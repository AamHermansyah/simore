"use server"

import bcrypt from "bcrypt"
import { loginSchema, LoginSchemaValues } from "@/lib/schemas/auth"
import { signJwt } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Guru, Puskesmas, Sekolah, Siswi, SuperAdmin } from "@/lib/generated/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import z from "zod"

export async function loginAction(values: LoginSchemaValues, redirectTo: string | null) {
  // validasi input
  const parsed = loginSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, message: JSON.stringify(z.treeifyError(parsed.error).errors) }
  }

  const { role, email, phone, password } = parsed.data
  let user: Siswi | Guru | Sekolah | Puskesmas | SuperAdmin | null = null

  // cari user sesuai role
  switch (role) {
    case "SISWI":
      user = await prisma.siswi.findUnique({
        where: { nomorTelepon: phone! },
      })
      break
    case "GURU":
      user = await prisma.guru.findUnique({ where: { email: email! } })
      break
    case "SEKOLAH":
      user = await prisma.sekolah.findUnique({ where: { email: email! } })
      break
    case "PUSKESMAS":
      user = await prisma.puskesmas.findUnique({ where: { email: email! } })
      break
    case "SUPERADMIN":
      user = await prisma.superAdmin.findUnique({ where: { email: email! } })
      break
  }

  if (!user) {
    return { success: false, message: "Akun tidak ditemukan" }
  }

  // cek password
  const passwordValid = await bcrypt.compare(password, user.password)
  if (!passwordValid) {
    return { success: false, message: "Password salah" }
  }

  // buat JWT
  const token = signJwt({
    id: user.id,
    role,
  })

  const c = await cookies()
  c.set('token', token);

  return redirect(redirectTo || '/');
}

export async function logout() {
  const c = await cookies()
  c.delete('token');
  return redirect('/login');
}
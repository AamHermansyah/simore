"use server"

import bcrypt from "bcrypt"
import { ChangePasswordFormValues, changePasswordSchema, loginSchema, LoginSchemaValues } from "@/lib/schemas/auth"
import { JWT_SECRET, JwtPayload, signJwt } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Guru, Puskesmas, Sekolah, Siswi, SuperAdmin } from "@/lib/generated/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import z from "zod"
import jwt from 'jsonwebtoken'

export async function loginAction(values: LoginSchemaValues, redirectTo: string | null) {
  // validasi input
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: z.treeifyError(parsed.error).errors.join(', ')
    }
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
  return {
    success: true,
    message: 'Berhasil logout'
  };
}

export async function changePassword(values: ChangePasswordFormValues) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload;
  if (!decoded?.id) {
    throw new Error("Token tidak valid");
  }

  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: JSON.stringify(z.treeifyError(parsed.error).errors)
    }
  }

  let role: 'siswi' | 'guru' | 'sekolah' | 'puskesmas' | 'superAdmin' | null = null;

  switch (decoded.role) {
    case 'SISWI':
      role = 'siswi';
      break;
    case 'GURU':
      role = 'guru';
      break;
    case 'SEKOLAH':
      role = 'sekolah';
      break;
    case 'PUSKESMAS':
      role = 'puskesmas';
      break;
    case 'SUPERADMIN':
      role = 'superAdmin';
      break;
  }

  const modelMap = {
    siswi: prisma.siswi,
    guru: prisma.guru,
    sekolah: prisma.sekolah,
    puskesmas: prisma.puskesmas,
    superAdmin: prisma.superAdmin,
  } as const;

  const model = role ? modelMap[role] : null;

  if (!model) {
    return {
      success: false,
      message: 'Role tidak ditemukan',
    };
  }

  try {
    // @ts-expect-error
    // Setiap model mempunyai findUnique
    const user = await model.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return {
        success: false,
        message: "Akun tidak ditemukan"
      };
    }

    const isMatch = await bcrypt.compare(values.currentPassword, user.password);
    if (!isMatch) {
      return {
        success: false,
        message: "Password tidak cocok"
      };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    // @ts-expect-error
    // Setiap model mempunyai update
    await model.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message: 'Password berhasil diubah'
    };
  } catch (err) {
    return {
      success: false,
      message: "Terjadi kesalahan server"
    };
  }
}
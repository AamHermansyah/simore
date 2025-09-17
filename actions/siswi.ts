"use server"

import prisma from "@/lib/prisma"
import { hash } from "bcrypt"
import { cookies } from "next/headers";
import z from "zod";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JwtPayload } from "@/lib/auth";
import { AddSiswiFormValues, addSiswiSchema } from "@/lib/schemas/siswi";

export async function addSiswi(values: Omit<AddSiswiFormValues, 'type'>, sekolahId: string) {
  try {
    const parsed = addSiswiSchema.safeParse({ ...values, type: 'add' });
    if (!parsed.success) {
      return {
        success: false,
        message: z.treeifyError(parsed.error).errors.join(', ')
      }
    }

    const data = parsed.data;
    const hashedPassword = await hash(data.password!, 10);

    const existing = await prisma.siswi.findFirst({
      where: {
        OR: [
          { nomorTelepon: data.nomorTelepon },
          { nisn: data.nisn },
        ],
      },
    })

    if (existing) {
      if (existing.nomorTelepon === data.nomorTelepon) {
        return {
          success: false,
          message: "Nomor telepon sudah digunakan",
        }
      }
      if (existing.nisn === data.nisn) {
        return {
          success: false,
          message: "NISN sudah digunakan",
        }
      }
    }

    const siswi = await prisma.siswi.create({
      data: {
        nama: data.nama,
        nisn: data.nisn,
        nomorTelepon: data.nomorTelepon,
        angkatanId: data.angkatanId,
        password: hashedPassword,
        sekolahId
      },
      include: {
        angkatan: true,
        _count: {
          select: { laporan: true }
        }
      }
    })

    return {
      success: true,
      data: siswi,
      message: 'Berhasil menambahkan akun siswi',
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}

export async function updateSiswiAccount(values: Omit<AddSiswiFormValues, 'type'>, id: string) {
  try {
    const parsed = addSiswiSchema.safeParse({ ...values, type: 'edit' });
    if (!parsed.success) {
      return {
        success: false,
        message: z.treeifyError(parsed.error).errors.join(', ')
      }
    }

    const data = parsed.data;

    const existing = await prisma.siswi.findFirst({
      where: {
        OR: [
          { nomorTelepon: data.nomorTelepon },
          { nisn: data.nisn },
        ],
        NOT: { id },
      },
    })

    if (existing) {
      if (existing.nomorTelepon === data.nomorTelepon) {
        return {
          success: false,
          message: "Nomor telepon sudah digunakan",
        }
      }
      if (existing.nisn === data.nisn) {
        return {
          success: false,
          message: "NISN sudah digunakan",
        }
      }
    }

    let hashedPassword = data.password ? await hash(data.password, 10) : undefined;

    // update data siswi
    const siswi = await prisma.siswi.update({
      where: { id },
      data: {
        nama: data.nama,
        nisn: data.nisn,
        nomorTelepon: data.nomorTelepon,
        angkatanId: data.angkatanId,
        ...(hashedPassword && { password: hashedPassword }),
      },
      include: {
        angkatan: true,
        _count: {
          select: { laporan: true }
        }
      }
    })

    return {
      success: true,
      data: siswi,
      message: "Berhasil memperbarui akun siswi",
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}
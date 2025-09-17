// actions/sekolah-actions.ts
"use server"

import prisma from "@/lib/prisma"
import { AddSekolahFormValues, addSekolahSchema, ProfileFormValues, profileSchema } from "@/lib/schemas/sekolah"
import { hash } from "bcrypt"
import { cookies } from "next/headers";
import z from "zod";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JwtPayload } from "@/lib/auth";

export async function addSekolah(values: Omit<AddSekolahFormValues, 'type'>) {
  try {
    const parsed = addSekolahSchema.safeParse({ ...values, type: 'add' });
    if (!parsed.success) {
      return {
        success: false,
        message: z.treeifyError(parsed.error).errors.join(', ')
      }
    }

    const data = parsed.data;
    const hashedPassword = await hash(data.password!, 10);

    const existing = await prisma.sekolah.findFirst({
      where: {
        OR: [
          { email: data.email },
          { nspn: data.nspn },
        ],
      },
    })

    if (existing) {
      if (existing.email === data.email) {
        return {
          success: false,
          message: "Email sudah digunakan",
        }
      }
      if (existing.nspn === data.nspn) {
        return {
          success: false,
          message: "NPSN sudah digunakan",
        }
      }
    }

    const sekolah = await prisma.sekolah.create({
      data: {
        nama: data.nama,
        nspn: data.nspn,
        jenjang: data.jenjang,
        email: data.email,
        password: hashedPassword,
      },
    })

    return {
      success: true,
      data: sekolah,
      message: 'Berhasil menambahkan akun sekolah',
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}

export async function updateSekolahAccount(values: Omit<AddSekolahFormValues, 'type'>, id: string) {
  try {
    const parsed = addSekolahSchema.safeParse({ ...values, type: 'edit' });
    if (!parsed.success) {
      return {
        success: false,
        message: z.treeifyError(parsed.error).errors.join(', ')
      }
    }

    const data = parsed.data;

    const existing = await prisma.sekolah.findFirst({
      where: {
        OR: [
          { email: data.email },
          { nspn: data.nspn },
        ],
        NOT: { id },
      },
    })

    if (existing) {
      if (existing.email === data.email) {
        return {
          success: false,
          message: "Email sudah digunakan oleh akun lain",
        }
      }
      if (existing.nspn === data.nspn) {
        return {
          success: false,
          message: "NPSN sudah digunakan oleh akun lain",
        }
      }
    }

    let hashedPassword = data.password ? await hash(data.password, 10) : undefined;

    // update data sekolah
    const sekolah = await prisma.sekolah.update({
      where: { id },
      data: {
        nama: data.nama,
        email: data.email,
        jenjang: data.jenjang,
        nspn: data.nspn,
        ...(hashedPassword && { password: hashedPassword }),
      },
    })

    return {
      success: true,
      data: sekolah,
      message: "Berhasil memperbarui akun sekolah",
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}

export async function editSekolah(data: ProfileFormValues) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload;
  if (!decoded?.id) {
    throw new Error("Token tidak valid");
  }

  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: z.treeifyError(parsed.error).errors.join(', ')
    }
  }

  try {
    const updated = await prisma.sekolah.update({
      where: { id: decoded.id },
      data,
    });

    return {
      success: true,
      data: updated
    };
  } catch (err) {
    return {
      success: false,
      message: "Terjadi kesalahan server"
    };
  }
}
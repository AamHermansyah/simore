"use server"

import prisma from "@/lib/prisma"
import { hash } from "bcrypt"
import { cookies } from "next/headers";
import z from "zod";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JwtPayload } from "@/lib/auth";
import { AddGuruFormValues, addGuruSchema, ProfileFormValues, profileSchema } from "@/lib/schemas/guru";

export async function addGuru(values: Omit<AddGuruFormValues, 'type'>, sekolahId: string) {
  try {
    const parsed = addGuruSchema.safeParse({ ...values, type: 'add' });
    if (!parsed.success) {
      return {
        success: false,
        message: z.treeifyError(parsed.error).errors.join(', ')
      }
    }

    const data = parsed.data;
    const hashedPassword = await hash(data.password!, 10);

    const existing = await prisma.guru.findFirst({
      where: {
        OR: [
          { email: data.email },
          { nip: data.nip },
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
      if (existing.nip === data.nip) {
        return {
          success: false,
          message: "NIP sudah digunakan",
        }
      }
    }

    const guru = await prisma.guru.create({
      data: {
        nama: data.nama,
        nip: data.nip,
        email: data.email,
        password: hashedPassword,
        sekolahId
      },
      include: {
        angkatan: true
      }
    })

    return {
      success: true,
      data: guru,
      message: 'Berhasil menambahkan akun guru',
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}

export async function updateGuruAccount(values: Omit<AddGuruFormValues, 'type'>, id: string) {
  try {
    const parsed = addGuruSchema.safeParse({ ...values, type: 'edit' });
    if (!parsed.success) {
      return {
        success: false,
        message: z.treeifyError(parsed.error).errors.join(', ')
      }
    }

    const data = parsed.data;

    const existing = await prisma.guru.findFirst({
      where: {
        OR: [
          { email: data.email },
          { nip: data.nip },
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
      if (existing.nip === data.nip) {
        return {
          success: false,
          message: "NPSN sudah digunakan oleh akun lain",
        }
      }
    }

    let hashedPassword = data.password ? await hash(data.password, 10) : undefined;

    // update data guru
    const guru = await prisma.guru.update({
      where: { id },
      data: {
        nama: data.nama,
        email: data.email,
        nip: data.nip,
        ...(hashedPassword && { password: hashedPassword }),
      },
      include: {
        angkatan: true
      }
    })

    return {
      success: true,
      data: guru,
      message: "Berhasil memperbarui akun guru",
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}

export async function editGuru(data: ProfileFormValues) {
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
      message: z.treeifyError(parsed.error).errors.join(", "),
    };
  }

  try {
    // Cek apakah email atau NIP sudah dipakai guru lain
    const existing = await prisma.guru.findFirst({
      where: {
        OR: [{ email: data.email }, { nip: data.nip }],
        NOT: { id: decoded.id }, // exclude dirinya sendiri
      },
    });

    if (existing) {
      let message = '';
      if (existing.email === data.email) message += 'Email sudah digunakan. ';
      if (existing.nip === data.nip) message += 'NIP sudah digunakan.';
      return {
        success: false,
        message: message.trim(),
      };
    }

    // Update data
    const updated = await prisma.guru.update({
      where: { id: decoded.id },
      data,
    });

    return {
      success: true,
      data: updated,
    };
  } catch (err) {
    return {
      success: false,
      message: "Terjadi kesalahan server",
    };
  }
}

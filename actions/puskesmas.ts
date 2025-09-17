// actions/sekolah-actions.ts
"use server"

import prisma from "@/lib/prisma"
import { AddPuskesmasFormValues, addPuskesmasSchema } from "@/lib/schemas/puskesmas";
import { hash } from "bcrypt"
import z from "zod";

export async function addPuskesmas(values: Omit<AddPuskesmasFormValues, 'type'>) {
  try {
    const parsed = addPuskesmasSchema.safeParse({ ...values, type: 'add' });
    if (!parsed.success) {
      return {
        success: false,
        message: z.treeifyError(parsed.error).errors.join(', ')
      }
    }

    const data = parsed.data;
    const hashedPassword = await hash(data.password!, 10);

    const existing = await prisma.puskesmas.findFirst({
      where: { email: data.email },
    })

    if (existing) {
      return {
        success: false,
        message: "Email sudah digunakan",
      }
    }

    const puskesmas = await prisma.puskesmas.create({
      data: {
        nama: data.nama,
        email: data.email,
        password: hashedPassword,
        sekolahs: {
          create: data.sekolahIds.map((id) => ({
            sekolah: {
              connect: { id },
            },
          })),
        },
      },
      include: {
        sekolahs: {
          include: {
            sekolah: {
              select: { id: true, nama: true }
            }
          },
        },
      },
    })

    return {
      success: true,
      data: puskesmas,
      message: 'Berhasil menambahkan akun puskesmas',
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}

export async function updatePuskesmasAccount(
  values: Omit<AddPuskesmasFormValues, 'type'>,
  id: string
) {
  try {
    const parsed = addPuskesmasSchema.safeParse({ ...values, type: 'edit' });
    if (!parsed.success) {
      return {
        success: false,
        message: z.treeifyError(parsed.error).errors.join(', '),
      };
    }

    const data = parsed.data;

    // Cek email unik (kecuali dirinya sendiri)
    const existing = await prisma.puskesmas.findFirst({
      where: {
        email: data.email,
        NOT: { id },
      },
    });

    if (existing) {
      return {
        success: false,
        message: 'Email sudah digunakan oleh akun lain',
      };
    }

    let hashedPassword = data.password
      ? await hash(data.password, 10)
      : undefined;

    const puskesmas = await prisma.puskesmas.update({
      where: { id },
      data: {
        nama: data.nama,
        email: data.email,
        ...(hashedPassword && { password: hashedPassword }),
        sekolahs: {
          set: data.sekolahIds.map((sekolahId) => ({
            puskesmasId_sekolahId: { puskesmasId: id, sekolahId },
          })),
        },
      },
      include: {
        sekolahs: {
          include: {
            sekolah: {
              select: { id: true, nama: true }
            }
          },
        },
      },
    });

    return {
      success: true,
      data: puskesmas,
      message: 'Berhasil memperbarui akun puskesmas',
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

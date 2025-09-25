"use server"

import prisma from "@/lib/prisma"
import { AddAngkatanFormValues, addAngkatanSchema } from "@/lib/schemas/angkatan";
import z from "zod";

export async function addAngkatan(values: Omit<AddAngkatanFormValues, 'type'>, sekolahId: string) {
  try {
    const parsed = addAngkatanSchema.safeParse({ ...values, type: 'add' });
    if (!parsed.success) {
      return {
        success: false,
        message: z.treeifyError(parsed.error).errors.join(', ')
      }
    }

    const data = parsed.data;

    const existing = await prisma.angkatan.findFirst({
      where: { nama: data.nama },
    })

    if (existing) {
      return {
        success: false,
        message: "Nama angkatan sudah digunakan",
      }
    }

    const angkatan = await prisma.angkatan.create({
      data: {
        nama: data.nama,
        guruId: data.guruId,
        sekolahId
      },
      include: {
        guru: {
          select: {
            id: true,
            nama: true
          }
        },
      }
    })

    return {
      success: true,
      data: {
        id: angkatan.id,
        nama: angkatan.nama,
        guru: angkatan.guru,
        status: angkatan.status,
        totalSiswi: 0,
        totalSiswiAktif: 0,
        kepatuhan: 0,
        createdAt: angkatan.createdAt,
      },
      message: 'Berhasil menambahkan akun angkatan',
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}

export async function updateAngkatan(values: Omit<AddAngkatanFormValues, 'type'>, id: string) {
  try {
    const parsed = addAngkatanSchema.safeParse({ ...values, type: 'edit' });
    if (!parsed.success) {
      return {
        success: false,
        message: z.treeifyError(parsed.error).errors.join(', ')
      }
    }

    const data = parsed.data;

    const existing = await prisma.angkatan.findFirst({
      where: {
        nama: data.nama,
        NOT: { id }
      },
    })

    if (existing) {
      return {
        success: false,
        message: "Nama angkatan sudah digunakan",
      }
    }

    const angkatan = await prisma.angkatan.update({
      where: { id },
      data: {
        nama: data.nama,
        guruId: data.guruId,
      },
      include: {
        guru: {
          select: {
            id: true,
            nama: true
          }
        },
        _count: {
          select: { siswi: true },
        },
        siswi: {
          select: {
            id: true,
            status: true,
            laporan: {
              take: 1,
              orderBy: { createdAt: "desc" },
              select: { status: true },
            },
          },
        },
      }
    });

    const totalSiswi = angkatan._count.siswi
    const siswiAktif = angkatan.siswi.filter((s) => s.status)
    const totalSiswiAktif = siswiAktif.length

    const patuh = siswiAktif.filter(
      (s) => s.laporan[0]?.status === "DIVERIFIKASI"
    ).length

    const kepatuhan =
      totalSiswiAktif > 0
        ? Math.round((patuh / totalSiswiAktif) * 100)
        : 0

    return {
      success: true,
      data: {
        id: angkatan.id,
        nama: angkatan.nama,
        guru: angkatan.guru,
        status: angkatan.status,
        totalSiswi,
        totalSiswiAktif,
        kepatuhan,
        createdAt: angkatan.createdAt,
      },
      message: "Berhasil memperbarui akun angkatan",
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}
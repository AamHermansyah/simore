import React from 'react'
import PeringkatLayout from '../../_layouts/peringkat-layout'
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JwtPayload } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getSiswiRanking } from '@/data/siswi';
import { getAllAngkatan } from '@/data/angkatan';

interface IProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

async function PuskesmasSiswiPeringkatPage({ searchParams }: IProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const angkatanId = (await searchParams).angkatanId;
  let sekolahId = (await searchParams).sekolahId;

  const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload;
  if (!decoded?.id) {
    throw new Error("Token tidak valid");
  }

  if (!sekolahId) {
    const sekolah = await prisma.puskesmasSekolah.findFirst({
      where: { puskesmasId: decoded.id },
      select: {
        sekolah: { select: { id: true, nama: true } },
      },
      orderBy: {
        sekolah: {
          nama: "asc",
        },
      },
    })

    if (!sekolah?.sekolah) throw Error('Sekolah yang dipilih tidak ditemukan');
    sekolahId = sekolah.sekolah.id;
  }

  const res = await getSiswiRanking(angkatanId, sekolahId);
  if (!res.success) throw new Error(res.message);

  const resAngkatan = await getAllAngkatan({ limit: 1000, page: 1, sekolahId });
  if (!resAngkatan.success) throw new Error(res.message);

  return (
    <PeringkatLayout
      data={res.data!}
      angkatanData={resAngkatan.data!.items}
    />
  )
}

export default PuskesmasSiswiPeringkatPage
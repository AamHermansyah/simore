import { JwtPayload, verifyJwt } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import React from 'react'
import SiswiLayout from '../_layouts/siswi-layout';
import { getAllAngkatan } from '@/data/angkatan';

interface IProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

async function PuskesmasDashboardPage({ searchParams }: IProps) {
  let sekolahId = (await searchParams).sekolahId;
  const c = await cookies()
  const token = c.get("token")?.value || null

  const decoded = verifyJwt(token || "") as JwtPayload | null
  if (!decoded) throw new Error('Token invalid');

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

  const res = await getAllAngkatan({ limit: 1000, page: 1, sekolahId });
  if (!res.success) throw new Error(res.message);

  return (
    <SiswiLayout
      sekolahId={sekolahId}
      angkatanData={res.data!.items}
    />
  )
}

export default PuskesmasDashboardPage
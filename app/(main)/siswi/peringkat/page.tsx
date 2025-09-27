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

async function SiswiPeringkatPage({ searchParams }: IProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const angkatanId = (await searchParams).angkatanId;

  const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload;
  if (!decoded?.id) {
    throw new Error("Token tidak valid");
  }

  const siswi = await prisma.siswi.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      nama: true,
      sekolahId: true,
      poin: true,
      bestStreak: true,
      angkatan: {
        select: { id: true, nama: true }
      }
    }
  });

  if (!siswi) throw new Error('Siswi tidak ditemukan');

  const res = await getSiswiRanking(angkatanId, siswi.sekolahId!);
  if (!res.success) throw new Error(res.message);

  const resAngkatan = await getAllAngkatan({ limit: 1000, page: 1, sekolahId: siswi.sekolahId! });
  if (!resAngkatan.success) throw new Error(res.message);

  return (
    <PeringkatLayout
      data={res.data!}
      angkatanData={resAngkatan.data!.items}
      siswi={siswi}
    />
  )
}

export default SiswiPeringkatPage
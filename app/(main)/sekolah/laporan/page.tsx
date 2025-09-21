import React from 'react';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JwtPayload } from '@/lib/auth';
import { cookies } from 'next/headers';
import { getAllAngkatan } from '@/data/angkatan';
import LaporanLayout from '../_layouts/laporan-layout';

async function SekolahLaporanPage() {
  let decoded: JwtPayload;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // 1. Verifikasi token
    decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload;
    if (!decoded?.id) {
      throw new Error("Token tidak valid");
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }

  const res = await getAllAngkatan({ limit: 1000, page: 1, sekolahId: decoded.id });
  if (!res.success) throw new Error(res.message);

  return (
    <LaporanLayout sekolahId={decoded.id} angkatanData={res.data!.items} />
  )
}

export default SekolahLaporanPage
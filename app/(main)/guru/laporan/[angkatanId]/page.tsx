import React from 'react'
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JwtPayload } from '@/lib/auth';
import { cookies } from 'next/headers';
import LaporanLayout from '../../_layouts/laporan-layout';

interface IParams {
  params: Promise<{ angkatanId: string }>
}

async function GuruSiswiByAngkatanPage({ params }: IParams) {
  const angkatanId = (await params).angkatanId;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // 1. Verifikasi token
    const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload;
    if (!decoded?.id) throw new Error("Token tidak valid");
  } catch (error) {
    throw new Error((error as Error).message);
  }

  return (
    <LaporanLayout angkatanId={angkatanId} />
  )
}

export default GuruSiswiByAngkatanPage
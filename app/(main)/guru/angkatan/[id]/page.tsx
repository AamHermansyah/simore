import React from 'react'
import SiswiLayout from '../../_layouts/siswi-layout';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JwtPayload } from '@/lib/auth';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

interface IParams {
  params: Promise<{ id: string }>
}

async function GuruSiswiByAngkatanPage({ params }: IParams) {
  const angkatanId = (await params).id;
  let sekolahId: string;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // 1. Verifikasi token
    const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload;
    if (!decoded?.id) throw new Error("Token tidak valid");

    const guru = await prisma.guru.findUnique({
      where: { id: decoded.id },
      select: { sekolahId: true }
    });

    if (!guru) throw new Error('Akun guru tidak ditemukan');

    sekolahId = guru.sekolahId!;
  } catch (error) {
    throw new Error((error as Error).message);
  }

  return (
    <SiswiLayout angkatanId={angkatanId} sekolahId={sekolahId} />
  )
}

export default GuruSiswiByAngkatanPage
import React from 'react'
import AngkatanLayout from '../_layouts/angkatan-layout'
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JwtPayload } from '@/lib/auth';
import { getAllGuru } from '@/data/guru';

async function SekolahAngkatanPage() {
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

  const res = await getAllGuru({ limit: 100, page: 1, sekolahId: decoded.id });
  if (!res.success) throw new Error(res.message);

  return (
    <AngkatanLayout sekolahId={decoded.id} guruData={res.data!.items} />
  )
}

export default SekolahAngkatanPage
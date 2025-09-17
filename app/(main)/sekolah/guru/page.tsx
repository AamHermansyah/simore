import React from 'react'
import GuruLayout from '../_layouts/guru-layout'
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JwtPayload } from '@/lib/auth';

async function SekolahGuruPage() {
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

  return (
    <GuruLayout sekolahId={decoded.id} />
  )
}

export default SekolahGuruPage
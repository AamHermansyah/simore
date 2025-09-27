import React from 'react'
import PeringkatLayout from '../../_layouts/peringkat-layout'
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JwtPayload } from '@/lib/auth';
import { getSiswiRanking } from '@/data/siswi';
import { getAllAngkatan } from '@/data/angkatan';

interface IProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

async function SekolahSiswiPeringkatPage({ searchParams }: IProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const angkatanId = (await searchParams).angkatanId;

  const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload;
  if (!decoded?.id) {
    throw new Error("Token tidak valid");
  }

  const res = await getSiswiRanking(angkatanId, decoded.id);
  if (!res.success) throw new Error(res.message);

  const resAngkatan = await getAllAngkatan({ limit: 1000, page: 1, sekolahId: decoded.id });
  if (!resAngkatan.success) throw new Error(res.message);

  return (
    <PeringkatLayout
      data={res.data!}
      angkatanData={resAngkatan.data!.items}
    />
  )
}

export default SekolahSiswiPeringkatPage
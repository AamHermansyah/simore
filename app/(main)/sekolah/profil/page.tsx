import React from 'react'
import ProfileLayout from '../_layouts/profile-layout'
import { getSekolah } from '@/data/sekolah';

async function SekolahProfilePage() {
  const res = await getSekolah();
  if (!res.success) throw Error(res.message);

  return (
    <ProfileLayout data={res.data!} />
  )
}

export default SekolahProfilePage
import React from 'react'
import ProfileLayout from '../_layouts/profile-layout'
import { getGuru } from '@/data/guru';

async function SekolahProfilePage() {
  const res = await getGuru();
  if (!res.success) throw Error(res.message);

  return (
    <ProfileLayout data={res.data!} />
  )
}

export default SekolahProfilePage
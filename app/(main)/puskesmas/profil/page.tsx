import React from 'react'
import ProfileLayout from '../_layouts/profile-layout'
import { getPuskesmas } from '@/data/puskesmas';

async function PuskesmasProfilePage() {
  const res = await getPuskesmas();
  if (!res.success) throw Error(res.message);

  return (
    <ProfileLayout data={res.data!} />
  )
}

export default PuskesmasProfilePage
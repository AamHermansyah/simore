import React from 'react'
import ProfileLayout from '../_layouts/profile-layout';
import { getSiswi } from '@/data/siswi';

async function SiswiProfilePage() {
  const res = await getSiswi();
  if (!res.success) throw Error(res.message);

  return (
    <ProfileLayout data={res.data!} />
  )
}

export default SiswiProfilePage
import React from 'react'
import ProfilLayout from '../_layouts/profil-layout'
import { getSuperAdmin } from '@/data/superadmin'

async function SuperAdminProfilePage() {
  const res = await getSuperAdmin();
  if (!res.success) throw Error(res.message);

  return (
    <ProfilLayout data={res.data!} />
  )
}

export default SuperAdminProfilePage
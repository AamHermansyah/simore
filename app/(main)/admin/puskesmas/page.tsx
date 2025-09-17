import React from 'react'
import PuskesmasLayout from '../_layouts/puskesmas-layout'
import prisma from '@/lib/prisma'

async function AdminPuskesmasPage() {
  const sekolahs = await prisma.sekolah.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      nama: true,
    }
  });

  return (
    <PuskesmasLayout sekolahs={sekolahs} />
  )
}

export default AdminPuskesmasPage
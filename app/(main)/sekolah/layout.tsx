import React from 'react'
import { cookies } from 'next/headers';
import { Roles } from '@/lib/types';
import { redirect, RedirectType } from 'next/navigation';

async function SekolahLayout({ children }: { children: React.ReactNode }) {
  const c = await cookies();
  const role = c.get('role')!.value as Roles;

  if (role !== 'SEKOLAH') return redirect('/404', 'replace' as RedirectType);

  return children;
}

export default SekolahLayout
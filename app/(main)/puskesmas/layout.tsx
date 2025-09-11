import React from 'react'
import { cookies } from 'next/headers';
import { Roles } from '@/lib/types';
import { redirect, RedirectType } from 'next/navigation';

async function PuskesmasLayout({ children }: { children: React.ReactNode }) {
  const c = await cookies();
  const role = c.get('role')!.value as Roles;

  if (role !== 'PUSKESMAS') return redirect('/404', 'replace' as RedirectType);

  return children;
}

export default PuskesmasLayout
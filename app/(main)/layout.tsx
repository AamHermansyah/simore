import React from 'react'
import { AppSidebar } from "./_layouts/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Navbar from './_components/navbar';
import { cookies } from 'next/headers';
import { Roles } from '@/lib/types';
import { getSekolahList } from '@/data/sekolah';

async function MainLayout({ children }: { children: React.ReactNode }) {
  const c = await cookies();
  const role = c.get('role')!.value as Roles;
  const res = await getSekolahList();

  if (!res.success) throw new Error(res.message);

  return (
    <SidebarProvider>
      <AppSidebar role={role} sekolahs={res.data!} />
      <SidebarInset className="overflow-hidden px-4 md:px-6">
        <Navbar />
        <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default MainLayout
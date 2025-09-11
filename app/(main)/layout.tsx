import React from 'react'
import { AppSidebar } from "./_layouts/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Navbar from './_components/navbar';
import { cookies } from 'next/headers';
import { Roles } from '@/lib/types';

async function MainLayout({ children }: { children: React.ReactNode }) {
  const c = await cookies();
  const role = c.get('role')!.value as Roles;

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
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
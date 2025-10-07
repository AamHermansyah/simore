"use client";

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { RiExpandUpDownLine, RiAddLine } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { Roles } from "@/lib/types";
import { usePathname, useSearchParams } from "next/navigation";

interface IProps {
  data: {
    id: string;
    nama: string;
  }[];
  role: Roles;
}

export function SchoolSwitcher({ data, role }: IProps) {
  const [activeSchool, setActiveSchool] = React.useState(data[0] ?? null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleRedirect = (id: string) => {
    // Buat objek query baru dari searchParams saat ini
    const params = new URLSearchParams(searchParams.toString());
    params.set("sekolahId", id);

    window.location.href = `${pathname}?${params.toString()}`;
  };

  if (!data.length) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              disabled={['SISWI', 'GURU', 'SEKOLAH'].includes(role)}
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3 [&>svg]:size-auto disabled:opacity-100"
            >
              {activeSchool && (
                <div className="relative size-8 bg-white rounded-full overflow-hidden border">
                  <Image
                    src="/logo.png"
                    alt="logo"
                    fill
                    className="p-1"
                  />
                </div>
              )}
              <div className="grid flex-1 text-left text-base leading-tight">
                <span className="truncate font-medium">
                  {activeSchool?.nama ?? "Select a Team"}
                </span>
              </div>
              <RiExpandUpDownLine
                className="ms-auto text-muted-foreground/60"
                size={20}
                aria-hidden="true"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-md"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="uppercase text-muted-foreground/60 text-xs">
              Sekolah
            </DropdownMenuLabel>
            {data.map((sekolah) => (
              <DropdownMenuItem
                key={sekolah.nama}
                onClick={() => {
                  setActiveSchool(sekolah);
                  handleRedirect(sekolah.id);
                }}
                className="gap-2 p-2"
              >
                <div className="relative size-6 bg-white rounded-full overflow-hidden border">
                  <Image
                    src="/logo.png"
                    alt="logo"
                    fill
                    className="p-1"
                  />
                </div>
                {sekolah.nama}
              </DropdownMenuItem>
            ))}
            {role === 'SUPERADMIN' && (
              <>
                <DropdownMenuSeparator />
                <Link href="/admin/sekolah">
                  <DropdownMenuItem className="gap-2 p-2">
                    <RiAddLine className="opacity-60" size={16} aria-hidden="true" />
                    <div className="font-medium">Tambah Sekolah</div>
                  </DropdownMenuItem>
                </Link>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
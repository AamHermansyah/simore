'use client'

import { logout } from "@/actions/auth";
import { SchoolSwitcher } from "../_components/school-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { navigations } from "@/lib/constants";
import { Roles } from "@/lib/types";
import { RiLogoutBoxLine } from "@remixicon/react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface IProps extends React.ComponentProps<typeof Sidebar> {
  role: Roles;
  sekolahs: {
    id: string;
    nama: string;
  }[];
}

export function AppSidebar({ role, sekolahs, ...props }: IProps) {
  const [loading, startServer] = useTransition();
  const navigate = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {role !== 'SUPERADMIN' ? <SchoolSwitcher data={sekolahs} role={role} /> : (
          <div className="w-full flex gap-2 items-center p-2">
            <div className="relative size-8 bg-white rounded-full overflow-hidden border">
              <Image
                src="/logo.png"
                alt="logo"
                fill
                className="p-1"
              />
            </div>
            <h2 className="font-medium tracking-wider">Simore</h2>
          </div>
        )}
        <hr className="border-t border-border mx-2 -mt-px" />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {navigations.map((item) => {
          if ((item.role !== undefined) && item.role === role) {
            return (
              <SidebarGroup key={item.title}>
                <SidebarGroupLabel className="uppercase text-muted-foreground/60">
                  {item.title}
                </SidebarGroupLabel>
                <SidebarGroupContent className="px-2">
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className="group/menu-button font-medium gap-3 h-9 rounded-md hover:bg-primary hover:text-primary-foreground data-[active=true]:bg-secondary data-[active=true]:text-secondary-foreground [&>svg]:size-auto"
                          isActive={(pathname === item.url) || (pathname.startsWith(item.url) && item.url.split('/').length > 2)}
                        >
                          <Link href={item.url}>
                            {item.icon && (
                              <item.icon
                                className="text-muted-foreground/80 group-data-[active=true]/menu-button:text-secondary-foreground"
                                size={22}
                                aria-hidden="true"
                              />
                            )}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )
          }
        })}
      </SidebarContent>
      <SidebarFooter>
        <hr className="border-t border-border mx-2 -mt-px" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="font-medium gap-3 h-9 rounded-md text-destructive hover:text-destructive cursor-pointer"
              onClick={() => {
                if (!loading) {
                  const id = toast.loading('Tunggu beberapa saat...');
                  startServer(() => {
                    logout()
                      .then(() => {
                        toast.dismiss(id);
                        toast.warning('Akun berhasil keluar');
                        navigate.push('/login');
                      });
                  })
                }
              }}
            >
              <RiLogoutBoxLine
                size={22}
                aria-hidden="true"
              />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, User } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/siswa/home",
    icon: Home,
  },
  {
    id: "riwayat",
    label: "Riwayat",
    href: "/siswa/riwayat",
    icon: Clock,
  },
  {
    id: "profil",
    label: "Profil",
    href: "/siswa/profil",
    icon: User,
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => pathname === href;

  if (!mounted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-gray-100">
        <div className="max-w-screen-sm mx-auto">
          <nav className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex flex-col items-center w-1/4 py-2"
                >
                  <Icon
                    className={`h-5 w-5 mb-1 ${
                      active ? "text-red-600 stroke-[2.5px]" : "text-gray-500 stroke-[1.5px]"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      active ? "text-red-600 font-semibold" : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="bg-white h-safe-area-inset-bottom" />
    </div>
  );
}

"use client";

import { BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  showNotification?: boolean;
  className?: string;
}

export function Header({
  title,
  showNotification = true,
  className
}: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 bg-red-500 shadow-sm", // merah + shadow
        className
      )}
    >
      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* Title di tengah jika tidak ada notifikasi */}
        <h1 className="text-white text-base font-bold flex-1 text-center">
          {title}
        </h1>

        {/* Notifikasi di kanan */}
        {showNotification && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifikasi"
            className="rounded-full text-white hover:bg-red-600 absolute right-4"
          >
            <BellIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}

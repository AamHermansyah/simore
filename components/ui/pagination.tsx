import * as React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps extends React.ComponentProps<"nav"> {
  page: number;
  pages: number;
}

function Pagination({
  className,
  page,
  pages,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageHref = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (pages <= 1) return null;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Jumlah maksimum halaman yang ditampilkan sebelum menggunakan ellipsis

    if (pages <= maxVisiblePages) {
      // Jika jumlah halaman sedikit, tampilkan semua
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(
          <PaginationItem key={`pagination-ka-${i}`}>
            <PaginationLink
              href={createPageHref(i)}
              isActive={i === page}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Jika jumlah halaman lebih banyak, tampilkan dengan ellipsis
      pageNumbers.push(
        <PaginationItem key={1}>
          <PaginationLink
            href={createPageHref(1)}
            isActive={1 === page}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (page > 3) {
        pageNumbers.push(<PaginationEllipsis key="ellipsis-start" />);
      }

      // Tampilkan halaman sebelum dan sesudah halaman aktif
      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(pages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationItem key={`pagination-kb-${i}`}>
            <PaginationLink
              href={createPageHref(i)}
              isActive={i === page}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (page < pages - 2) {
        pageNumbers.push(<PaginationEllipsis key="ellipsis-end" />);
      }

      pageNumbers.push(
        <PaginationItem key={`pagination-kc-${pages}`}>
          <PaginationLink
            href={createPageHref(pages)}
            isActive={pages === page}
          >
            {pages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageNumbers;
  };

  return (
    <nav className={cn("mx-auto flex w-full justify-center", className)}>
      <PaginationContent>
        {/* Tombol Previous */}
        <PaginationItem>
          <PaginationPrevious
            href={createPageHref(page - 1)}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Daftar halaman dengan ellipsis */}
        {renderPageNumbers()}

        {/* Tombol Next */}
        <PaginationItem>
          <PaginationNext
            href={createPageHref(page + 1)}
            className={page === pages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </nav>
  );
}

Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<VariantProps<typeof buttonVariants>, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "default" : "outline",
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="icon"
    className={cn(
      "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4 text-foreground" />
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="icon"
    className={cn(
      "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground",
      className
    )}
    {...props}
  >
    <ChevronRight className="h-4 w-4 text-foreground" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4 text-foreground" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
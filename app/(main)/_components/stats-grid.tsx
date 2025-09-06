import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="relative p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden">
      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div className="max-[480px]:hidden size-10 shrink-0 rounded-full bg-primary/25 border border-primary/50 flex items-center justify-center text-yellow-500">
          {icon}
        </div>
        {/* Content */}
        <div className="space-y-2">
          <h2 className="font-medium tracking-widest text-xs uppercase text-muted-foreground/60 before:absolute before:inset-0">
            {title}
          </h2>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: StatsCardProps[];
  className?: string;
}

export function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <div className={cn(
      'grid grid-cols-2 lg:grid-cols-4 border border-border rounded-xl bg-gradient-to-br from-sidebar/60 to-sidebar',
      className
    )}>
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
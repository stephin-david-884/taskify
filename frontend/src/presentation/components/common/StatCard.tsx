import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "emerald" | "amber" | "slate" | "rose" | "blue";
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "emerald",
}: StatCardProps) => {
  const variantStyles = {
    emerald: {
      bg: "bg-white border-neutral-200 hover:border-emerald-300",
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      accentBg: "bg-emerald-500",
    },
    slate: {
      bg: "bg-white border-neutral-200 hover:border-slate-300",
      iconBg: "bg-slate-50 text-slate-600 border border-slate-100",
      accentBg: "bg-slate-400",
    },
    amber: {
      bg: "bg-white border-neutral-200 hover:border-amber-300",
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
      accentBg: "bg-amber-500",
    },
    rose: {
      bg: "bg-white border-neutral-200 hover:border-rose-300",
      iconBg: "bg-rose-50 text-rose-600 border border-rose-100",
      accentBg: "bg-rose-500",
    },
    blue: {
      bg: "bg-white border-neutral-200 hover:border-blue-300",
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      accentBg: "bg-blue-500",
    },
  };

  const style = variantStyles[variant] || variantStyles.emerald;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-xs transition-all duration-200 hover:shadow-md ${style.bg}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {title}
        </span>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.iconBg}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3">
        <p className="text-3xl font-bold tracking-tight text-neutral-900">
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 text-xs text-neutral-500">{subtitle}</p>
        )}
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 h-1 ${style.accentBg} opacity-80`}
      />
    </div>
  );
};

export default StatCard;

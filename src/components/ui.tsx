import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const KPICard = ({ 
  label, 
  value, 
  sub, 
  trend, 
  small = false,
  className,
  valueClassName
}: { 
  key?: React.Key;
  label: string; 
  value: React.ReactNode; 
  sub?: string; 
  trend?: "up" | "down"; 
  small?: boolean;
  className?: string;
  valueClassName?: string;
}) => (
  <div className={cn(
    "bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col gap-1 min-w-0 transition-all hover:bg-zinc-800/50",
    small ? "p-3.5" : "p-5",
    className
  )}>
    <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">{label}</span>
    <span className={cn(
      "font-mono font-bold leading-tight",
      small ? "text-2xl" : "text-3xl",
      valueClassName || "text-zinc-100"
    )}>{value}</span>
    {sub && (
      <span className={cn(
        "text-[11px] font-medium",
        trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-zinc-500"
      )}>{sub}</span>
    )}
  </div>
);

export const SectionTitle = ({ children, extra }: { children: React.ReactNode; extra?: string }) => (
  <div className="flex items-center justify-between mb-4 mt-2">
    <h3 className="m-0 text-[15px] font-bold text-zinc-100 tracking-wide">{children}</h3>
    {extra && <span className="text-[11px] text-zinc-400 font-medium">{extra}</span>}
  </div>
);

export const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs shadow-xl">
      <div className="font-semibold mb-2 text-zinc-100">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex gap-2 items-center text-zinc-400 mb-1">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span>
            {p.name}: <strong className="text-zinc-100">
              {typeof p.value === "number" && p.value > 1000 && !p.name.includes("Tx") && !p.name.includes("Taxa") 
                ? `R$ ${(p.value).toLocaleString("pt-BR")}` 
                : p.value.toLocaleString("pt-BR")}
              {p.name.includes("Tx") || p.name.includes("Taxa") ? "%" : ""}
            </strong>
          </span>
        </div>
      ))}
    </div>
  );
};

export const Badge = ({ children, colorClass = "bg-pink-500/20 text-pink-400" }: { children: React.ReactNode; colorClass?: string }) => (
  <span className={cn(
    "inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap",
    colorClass
  )}>{children}</span>
);

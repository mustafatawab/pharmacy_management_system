import { ReactNode } from "react";

interface InventorySummaryCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export function InventorySummaryCard({
  title,
  value,
  icon,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
}: InventorySummaryCardProps) {
  return (
    <div className="flex items-center p-5 bg-card rounded-[2rem] shadow-sm group">
      <div className={`p-3.5 rounded-2xl ${iconBgColor} ${iconColor} mr-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{title}</p>
        <p className="text-2xl font-extrabold text-foreground mt-0.5 tracking-tighter">
          {value}
        </p>
      </div>
    </div>
  );
}

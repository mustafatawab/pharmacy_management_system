import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  index?: number;
}

export function StatCard({
  title,
  value,
  subtext,
  icon,
  iconBgColor = "bg-zinc-100 dark:bg-zinc-900",
  iconColor = "text-zinc-600 dark:text-zinc-400",
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="rounded-2xl bg-card p-5 shadow-sm hover:shadow-premium transition-all duration-300 group relative overflow-hidden"
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
            {title}
          </p>
          <p className="text-2xl font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">
            {value}
          </p>
        </div>
        <div 
          className={`rounded-lg p-2.5 transition-all duration-300 group-hover:bg-primary group-hover:text-white ${iconBgColor} ${iconColor}`}
        >
          <div className="h-5 w-5 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 relative z-10">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{subtext}</p>
      </div>
    </motion.div>
  );
}

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
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className="rounded-2xl border bg-card border-border p-6 shadow-sm hover:shadow-premium transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-foreground tracking-tight">
            {value}
          </p>
        </div>
        <div 
          className={`rounded-xl p-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${iconBgColor} ${iconColor}`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-primary/40" />
        <p className="text-xs font-semibold text-gray-400">{subtext}</p>
      </div>
    </motion.div>
  );
}

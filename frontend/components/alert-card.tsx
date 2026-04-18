import { AlertCircle, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface AlertItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string; 
}

interface AlertCardProps {
  title: string;
  type: "low-stock" | "expiring";
  items: AlertItem[];
}

export function AlertCard({ title, type, items }: AlertCardProps) {
  const isLowStock = type === "low-stock";
  const Icon = isLowStock ? AlertCircle : Calendar;
  const iconColor = isLowStock ? "text-danger" : "text-warning";
  const iconBg = isLowStock ? "bg-danger/10" : "bg-warning/10";

  return (
    <div className="flex flex-col h-full rounded-[2rem] bg-card p-6 shadow-sm group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-[0.2em]">{title}</h3>
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="space-y-2 flex-1">
        {items.length === 0 ? (
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No Alerts</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={item.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer group/item"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate tracking-tight">
                  {item.title}
                </p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter mt-0.5">{item.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md bg-white dark:bg-zinc-950 shadow-sm border border-zinc-100 dark:border-zinc-800 ${isLowStock ? 'text-danger' : 'text-warning'}`}>
                  {item.tag}
                </span>
                <ChevronRight className="h-3 w-3 text-zinc-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      <button className="mt-6 w-full py-3 rounded-xl border border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-primary transition-all">
        View Full Report
      </button>
    </div>
  );
}

import { TrendingUp, ArrowUpRight, ArrowDownRight, Package, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  type: "sale" | "restock" | "order" | "other";
  amount?: string;
  status?: string;
}

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  const getIcon = (type: string) => {
    switch(type) {
      case 'sale': return <ArrowUpRight className="h-4 w-4 text-success" />;
      case 'restock': return <Package className="h-4 w-4 text-primary" />;
      case 'order': return <Clock className="h-4 w-4 text-warning" />;
      default: return <TrendingUp className="h-4 w-4 text-zinc-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full rounded-[2rem] bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-[0.2em]">
            Global Feed
          </h3>
        </div>
        <span className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-900 px-2 py-1 rounded-full border border-zinc-100 dark:border-zinc-800">
          <div className="h-1 w-1 rounded-full bg-success animate-pulse" />
          Live
        </span>
      </div>

      <div className="space-y-2 flex-1">
        {activities.map((activity, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={activity.id} 
            className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-all cursor-default"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                {getIcon(activity.type)}
              </div>
              <div>
                <p className="text-xs font-bold text-foreground tracking-tight">
                  {activity.title}
                </p>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter mt-0.5">{activity.time}</p>
              </div>
            </div>
            {activity.amount && (
              <span className="text-[10px] font-extrabold text-success tracking-tight">
                {activity.amount}
              </span>
            )}
            {activity.status && (
              <span
                className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                  activity.status === "Pending"
                    ? "bg-warning/5 text-warning border-warning/10"
                    : activity.status === "Inventory"
                    ? "bg-primary/5 text-primary border-primary/10"
                    : "bg-zinc-100 text-zinc-400 border-zinc-200"
                }`}
              >
                {activity.status}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      <button className="mt-6 w-full py-3 rounded-xl border border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-primary transition-all">
        View Activity Logs
      </button>
    </div>
  );
}

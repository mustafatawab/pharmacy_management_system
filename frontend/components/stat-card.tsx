import { ReactNode } from "react";
import { motion } from "framer-motion";

export type StatCardVariant = "default" | "green" | "teal" | "pink" | "purple";

interface StatCardProps {
 title: string;
 value: string;
 subtext: string;
 icon: ReactNode;
 variant?: StatCardVariant;
 index?: number;
 iconBgColor?: string;
 iconColor?: string;
}

export function StatCard({
 title,
 value,
 subtext,
 icon,
 variant = "default",
 index = 0,
 iconBgColor,
 iconColor,
}: StatCardProps) {
 
 const variantStyles = {
 default: "bg-card text-card-foreground",
 green: "bg-pastel-green text-pastel-green-fg",
 teal: "bg-pastel-teal text-pastel-teal-fg",
 pink: "bg-pastel-pink text-pastel-pink-fg",
 purple: "bg-pastel-purple text-pastel-purple-fg",
 };

 const bgClass = variantStyles[variant];
 
 return (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.05, duration: 0.3 }}
 className={`rounded-[24px] p-6 shadow-soft transition-all duration-300 relative overflow-hidden ${bgClass}`}
 >
 <div className="flex items-start justify-between relative z-10 mb-4">
 <div 
 className={`p-2 rounded-xl backdrop-blur-md ${iconBgColor || 'bg-card/30 dark:bg-black/20'}`}
 style={iconColor ? { color: iconColor } : undefined}
 >
 <div className="h-4 w-4 flex items-center justify-center opacity-80">
 {icon}
 </div>
 </div>
 <div className="flex gap-1 items-center">
 <div className="h-1.5 w-1.5 rounded-full bg-current opacity-40"></div>
 <div className="h-1.5 w-1.5 rounded-full bg-current opacity-40"></div>
 <div className="h-1.5 w-1.5 rounded-full bg-current opacity-40"></div>
 </div>
 </div>

 <div className="space-y-1 relative z-10">
 <p className="text-xs font-semibold opacity-70">
 {title}
 </p>
 <p className="text-3xl font-extrabold tracking-tight">
 {value}
 </p>
 </div>

 <div className="mt-4 flex items-end justify-between relative z-10">
 <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{subtext}</p>
 
 {/* Decorative mini-chart bars */}
 <div className="flex gap-1 items-end h-8">
 <div className="w-1.5 h-3 rounded-full bg-current opacity-40"></div>
 <div className="w-1.5 h-5 rounded-full bg-current opacity-60"></div>
 <div className="w-1.5 h-8 rounded-full bg-current opacity-80"></div>
 <div className="w-1.5 h-4 rounded-full bg-current opacity-50"></div>
 </div>
 </div>
 </motion.div>
 );
}

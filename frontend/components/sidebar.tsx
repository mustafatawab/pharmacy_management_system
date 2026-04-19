"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  FileText,
  Settings,
  Pill,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Point of Sale", href: "/pos", icon: ShoppingCart },
  { name: "Purchases", href: "/purchases", icon: TrendingUp },
  { name: "User Management", href: "/users", icon: Users },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
}

export function Sidebar({ isOpen = false, onClose, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // The sidebar is effectively expanded if either it's not collapsed OR it's being hovered
  const isExpanded = !isCollapsed || isHovered;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-zinc-950/20 backdrop-blur-[2px] md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.div
        onMouseEnter={() => isCollapsed && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ 
          width: isExpanded ? 256 : 80,
          boxShadow: isHovered && isCollapsed ? "20px 0 50px -12px rgba(0, 0, 0, 0.15)" : "none"
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-900 transition-colors md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isHovered && isCollapsed ? "ring-1 ring-primary/5" : ""}`}
      >
        <div className="flex items-center justify-between px-6 py-6 overflow-hidden min-h-[80px]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
              <Pill className="h-6 w-6" />
            </div>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col whitespace-nowrap"
              >
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  Pharmacy
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                  OS Terminal
                </span>
              </motion.div>
            )}

          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors md:hidden"
          >
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`group relative flex items-center rounded-xl transition-all duration-300 h-11 ${
                  !isExpanded ? "justify-center" : "px-4 gap-3"
                } ${
                  isActive
                    ? "text-white"
                    : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
                title={!isExpanded ? item.name : ""}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon
                  className={`shrink-0 transition-colors relative z-10 ${
                    !isExpanded ? "h-5 w-5" : "h-4 w-4"
                  } ${
                    isActive
                      ? "text-white"
                      : "text-zinc-400 group-hover:text-primary"
                  }`}
                />
                {isExpanded && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-bold uppercase tracking-widest whitespace-nowrap relative z-10"
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 shrink-0">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse mx-auto" />
        </div>
      </motion.div>
    </>
  );
}

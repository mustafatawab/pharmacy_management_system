"use client";

import {
  Bell,
  User,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  ChevronLeft,
  Laptop,
  Menu,
  LoaderCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { User as UserType } from "./users/user-table";
import { useAuth } from "@/providers/AuthProvider";

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Header({ title, onMenuClick, isCollapsed, onToggleCollapse }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { tenant, user, logout, loading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white dark:bg-zinc-950 px-4 md:px-6 border-zinc-100 dark:border-zinc-800 transition-colors z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 md:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>

        {loading ? (
          <div className="h-6 w-32 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-lg" />
        ) : (
          <h1 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight ml-2">
            {title}
          </h1>
        )}
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <button className="relative p-2.5 text-zinc-400 hover:text-primary transition-all rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900">
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" />
          <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-danger ring-2 ring-white dark:ring-zinc-950" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-3 pl-3 py-1.5 pr-1.5 rounded-xl transition-all outline-none border ${
              isProfileOpen 
              ? "border-primary/20 bg-primary/5 shadow-sm" 
              : "border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            <div className="hidden flex-col text-right md:flex">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                {user?.full_name || "Account"}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mt-1">
                {user?.role || "Staff"}
              </span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-xs shadow-lg shadow-primary/20">
              {user ? user.full_name.charAt(0).toUpperCase() : "A"}
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-command py-2 z-[60]"
              >
                <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Display Mode</p>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: "light", icon: Sun },
                      { id: "dark", icon: Moon },
                      { id: "system", icon: Laptop },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                          mounted && theme === t.id
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                        }`}
                      >
                        <t.icon className="h-3.5 w-3.5" />
                        <span className="text-[9px] font-bold capitalize">{t.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="px-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 text-xs text-danger hover:bg-danger/5 rounded-xl flex items-center gap-3 font-bold transition-all group"
                  >
                    <div className="p-1.5 rounded-lg bg-danger/10 text-danger group-hover:bg-danger group-hover:text-white transition-all">
                      <LogOut className="h-3.5 w-3.5" />
                    </div>
                    Sign out Session
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

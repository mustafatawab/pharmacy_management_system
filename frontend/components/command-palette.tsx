"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Settings, 
  Command,
  Moon,
  Sun,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/providers/AuthProvider";

const actions = [
  { id: "dash", name: "Go to Dashboard", icon: LayoutDashboard, href: "/dashboard", shortcut: "G D" },
  { id: "inv", name: "Inventory Management", icon: Package, href: "/inventory", shortcut: "G I" },
  { id: "pos", name: "Open Point of Sale", icon: ShoppingCart, href: "/pos", shortcut: "G P" },
  { id: "purch", name: "Purchases & Orders", icon: TrendingUp, href: "/purchases", shortcut: "G O" },
  { id: "users", name: "Staff Management", icon: Users, href: "/users", shortcut: "G U" },
  { id: "settings", name: "System Settings", icon: Settings, href: "/settings", shortcut: "G S" },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const { logout } = useAuth();

  const filteredActions = actions.filter(action =>
    action.name.toLowerCase().includes(query.toLowerCase())
  );

  const togglePalette = useCallback(() => setIsOpen(open => !open), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        togglePalette();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [togglePalette]);

  const handleAction = (action: typeof actions[0]) => {
    router.push(action.href);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setQuery("");
    }
  }, [isOpen]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % filteredActions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === "Enter") {
      if (filteredActions[selectedIndex]) {
        handleAction(filteredActions[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-card border border-zinc-200 dark:border-zinc-800 shadow-command rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 border-b border-zinc-100 dark:border-zinc-800 h-14">
              <Search className="h-5 w-5 text-zinc-400 mr-3 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search commands or pages..."
                className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-sm font-medium"
              />
              <div className="flex items-center gap-1 ml-2">
                <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">ESC</kbd>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
              {filteredActions.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-zinc-400 font-medium">No results found for &quot;{query}&quot;</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Suggestions</p>
                  {filteredActions.map((action, idx) => (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${
                        idx === selectedIndex 
                          ? "bg-primary text-white shadow-lg shadow-primary/20" 
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${idx === selectedIndex ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                          <action.icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight">{action.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {action.shortcut.split(" ").map(s => (
                          <kbd key={s} className={`px-1 rounded text-[9px] font-bold ${idx === selectedIndex ? "bg-white/30 text-white" : "bg-zinc-50 dark:bg-zinc-800 text-zinc-400"}`}>{s}</kbd>
                        ))}
                        <ChevronRight className={`h-3 w-3 transition-transform ${idx === selectedIndex ? "translate-x-0.5" : "opacity-0"}`} />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Utility Section */}
              <div className="mt-4 pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
                <p className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Utilities</p>
                <button
                  onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setIsOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </div>
                    <span className="text-sm font-semibold tracking-tight">Toggle Theme</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-bold text-zinc-400">L</kbd>
                </button>
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold tracking-tight">Sign out</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-[10px] font-bold text-red-400">Q</kbd>
                </button>
              </div>
            </div>

            {/* Footer Tip */}
            <div className="px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1"><kbd className="px-1 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900 text-zinc-500">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900 text-zinc-500">↵</kbd> Select</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wider opacity-60">
                <Command className="h-3 w-3" /> <span>+ K</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

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
 Search,
 Mic
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
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
 <header className="flex h-20 items-center justify-between bg-background px-4 md:px-8 transition-colors z-30">
 <div className="flex items-center gap-3">
 <button
 onClick={onMenuClick}
 className="rounded-full p-2 text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 md:hidden transition-colors"
 >
 <Menu className="h-5 w-5" />
 </button>

 {/* Desktop Toggle */}
 <button
 onClick={onToggleCollapse}
 className="hidden md:flex rounded-full p-2 text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
 >
 {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
 </button>

 {/* Search Bar - Modern Pill Style */}
 <div className="hidden md:flex items-center bg-card shadow-soft px-4 py-2.5 rounded-full ml-4 min-w-[300px]">
 <Search className="h-4 w-4 text-muted-foreground" />
 <input 
 type="text" 
 placeholder="Search..." 
 className="bg-transparent border-none outline-none text-sm text-card-foreground placeholder:text-muted-foreground ml-3 w-full"
 />
 <Mic className="h-4 w-4 text-muted-foreground ml-2" />
 </div>
 </div>
 
 <div className="flex items-center gap-4">
 {/* Language & Notification Wrapper */}
 <div className="flex items-center gap-2 bg-card shadow-soft rounded-full px-2 py-1">
 <button className="relative p-2 text-muted-foreground hover:text-primary transition-all rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900">
 <span className="text-xs font-bold px-1">EN</span>
 </button>
 <button className="relative p-2 text-muted-foreground hover:text-primary transition-all rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900">
 <Bell className="h-4 w-4" />
 <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-warning ring-2 ring-card" />
 </button>
 </div>

 {/* Profile Dropdown */}
 <div className="relative" ref={dropdownRef}>
 <button
 onClick={() => setIsProfileOpen(!isProfileOpen)}
 className={`flex items-center gap-3 pl-1 py-1 pr-4 rounded-full transition-all outline-none border ${
 isProfileOpen 
 ? "border-primary/20 bg-primary/5 shadow-soft" 
 : "border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800"
 }`}
 >
 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-soft">
 {user ? user.full_name.charAt(0).toUpperCase() : "A"}
 </div>
 <div className="hidden flex-col text-left md:flex">
 <span className="text-sm font-bold text-card-foreground leading-none">
 {user?.full_name || "Account"}
 </span>
 <span className="text-[10px] font-medium text-muted-foreground mt-1 lowercase">
 {user?.username || "admin@example.com"}
 </span>
 </div>
 </button>

 <AnimatePresence>
 {isProfileOpen && (
 <motion.div
 initial={{ opacity: 0, y: 8, scale: 0.98 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 8, scale: 0.98 }}
 transition={{ duration: 0.15 }}
 className="absolute right-0 top-full mt-2 w-60 rounded-3xl border border-border bg-card shadow-soft py-2 z-[60]"
 >
 <div className="px-4 py-3 border-b border-border mb-1">
 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Display Mode</p>
 <div className="grid grid-cols-3 gap-1">
 {[
 { id: "light", icon: Sun },
 { id: "dark", icon: Moon },
 { id: "system", icon: Laptop },
 ].map((t) => (
 <button
 key={t.id}
 onClick={() => setTheme(t.id)}
 className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${
 mounted && theme === t.id
 ? "bg-primary text-primary-foreground shadow-soft"
 : "bg-neutral-50 dark:bg-neutral-800 text-muted-foreground hover:text-card-foreground"
 }`}
 >
 <t.icon className="h-4 w-4" />
 <span className="text-[9px] font-bold capitalize">{t.id}</span>
 </button>
 ))}
 </div>
 </div>

 <div className="px-2">
 <button
 onClick={handleLogout}
 className="w-full text-left px-3 py-2.5 text-xs text-warning hover:bg-warning/5 rounded-2xl flex items-center gap-3 font-bold transition-all group"
 >
 <div className="p-1.5 rounded-full bg-warning/10 text-warning group-hover:bg-warning group-hover:text-warning-foreground transition-all">
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

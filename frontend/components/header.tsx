"use client";

import {
  Bell,
  User,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
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
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isThemeSubmenuOpen, setIsThemeSubmenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  // Ensure we are mounted before showing theme based content to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const { tenant, user, logout, loading } = useAuth();

  // useEffect(() => {
  //   setMounted(true);
  //   const user = localStorage.getItem("user");
  //   if (user) {
  //     setCurrentUser(JSON.parse(user));
  //   }
  // }, []);

  // useEffect(() => {
  //   const getCurrentUser = async () => {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //     });

  //     const userData = await res.json();
  //     if (!res.ok) {
  //       toast.error(userData.detail);
  //       router.push("/login");
  //       return;
  //     }
  //     localStorage.setItem("user", JSON.stringify(userData));
  //   };
  //   getCurrentUser();
  // }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
        setIsThemeSubmenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCurrentThemeIcon = () => {
    if (!mounted) return <Sun className="h-4 w-4" />;
    if (theme === "system") return <Laptop className="h-4 w-4" />;
    if (theme === "dark") return <Moon className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };

  const getCurrentThemeLabel = () => {
    if (!mounted) return "Light";
    if (theme === "system") return "System";
    if (theme === "dark") return "Dark";
    return "Light";
  };

  const handleLogout = async () => {
    await logout();
    // console.log(process.env.NEXT_PUBLIC_API_URL);
    // setLoading(true);

    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    //   method: "POST",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "appplication/json",
    //   },
    // });
    // if (res.ok) {
    //   const response = await res.json();
    //   router.push("/login");
    //   toast.success("logout successfully");
    // }

    // setLoading(false);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-8 border-border">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 md:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {loading ? (
          <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg" />
        ) : (
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">
            {tenant && tenant.name}
          </h1>
        )}
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <button className="relative p-2.5 text-gray-400 hover:text-primary transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800">
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-danger ring-2 ring-white dark:ring-zinc-900" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-4 md:pl-4 py-1.5 pr-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs ring-2 ring-primary/20">
              {user ? user.full_name.charAt(0) : "A"}
            </div>
            <div className="hidden flex-col text-left md:flex">
              <span className="text-sm font-bold text-foreground leading-none">
                {user ? user.full_name : "Admin User"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">
                {user ? user.role : "Administrator"}
              </span>
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-card shadow-premium py-2 z-50"
              >
                <div className="px-4 py-3 border-b border-border mb-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Theme Settings</p>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[
                      { id: "light", icon: Sun },
                      { id: "dark", icon: Moon },
                      { id: "system", icon: Laptop },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                          theme === t.id
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:text-foreground"
                        }`}
                      >
                        <t.icon className="h-4 w-4" />
                        <span className="text-[10px] font-bold capitalize">{t.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="px-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-danger hover:bg-danger/5 rounded-xl flex items-center gap-3 font-bold transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {loading ? "Signing Out..." : "Sign out"}
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

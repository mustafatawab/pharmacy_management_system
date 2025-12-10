"use client";

import {
  Bell,
  User,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  Laptop,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

export function Header({ title }: { title: string }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isThemeSubmenuOpen, setIsThemeSubmenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  // Ensure we are mounted before showing theme based content to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background dark:bg-[#212121] px-8 border-gray-200 dark:border-[#2F2F2F]">
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      <div className="flex items-center gap-6">
        <button className="relative text-gray-400 hover:text-gray-500">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 border-l pl-6 border-gray-200 dark:border-[#2F2F2F] outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-foreground leading-none">
                Admin User
              </span>
              <span className="text-xs text-gray-500 mt-0.5">Admin</span>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-100 dark:border-[#2F2F2F] bg-background dark:bg-[#2F2F2F] shadow-lg py-1 z-50">
              <button
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between group"
                onClick={() => setIsThemeSubmenuOpen(!isThemeSubmenuOpen)}
              >
                <div className="flex items-center gap-2">
                  {getCurrentThemeIcon()}
                  <span>{getCurrentThemeLabel()} Mode</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>

              {/* Submenu (Opens to the left) */}
              {isThemeSubmenuOpen && (
                <div className="absolute right-full top-0 mr-2 w-48 rounded-xl border border-gray-100 dark:border-[#2F2F2F] bg-background dark:bg-[#2F2F2F] shadow-lg py-1">
                  <button
                    onClick={() => setTheme("light")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                      theme === "light"
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700"
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                      theme === "dark"
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700"
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                      theme === "system"
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700"
                    }`}
                  >
                    <Laptop className="h-4 w-4" />
                    System
                  </button>
                </div>
              )}

              <div className="my-1 border-t border-gray-100" />

              <Link
                href="/login"
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

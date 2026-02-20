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
import toast from "react-hot-toast";
import { User as UserType } from "./users/user-table";

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
  const [loading, setLoading] = useState(false);
  // Ensure we are mounted before showing theme based content to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const getCurrentUser = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch user");

      const userData = await res.json();
      localStorage.setItem("user", JSON.stringify(userData));
      console.log(userData);
    };
    getCurrentUser();
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

  const handleLogout = async () => {
    console.log(process.env.NEXT_PUBLIC_API_URL);
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "appplication/json",
      },
    });
    if (res.ok) {
      const response = await res.json();
      router.push("/login");
      toast.success("logout successfully");
    }

    setLoading(false);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background dark:bg-[#212121] px-4 md:px-8 border-gray-200 dark:border-[#2F2F2F]">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#2F2F2F] md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-6">
        <button className="relative p-2 text-gray-400 hover:text-gray-500">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 border-l pl-4 md:pl-6 border-gray-200 dark:border-[#2F2F2F] outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User className="h-5 w-5" />
            </div>
            <div className="hidden flex-col text-left md:flex">
              <span className="text-sm font-medium text-foreground leading-none">
                {currentUser ? currentUser.full_name : "Admin"}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                {currentUser ? currentUser.role : "Admin"}
              </span>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-100 dark:border-[#2F2F2F] bg-background dark:bg-[#2F2F2F] shadow-lg py-1 z-50">
              <button
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-50 hover:dark:text-gray-700 hover:bg-gray-50 flex items-center justify-between group"
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
                        : "text-gray-700 dark:text-gray-50 dark:hover:text-gray-700"
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
                        : "text-gray-700 dark:text-gray-50 dark:hover:text-gray-700"
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
                        : "text-gray-700 dark:text-gray-50 dark:hover:text-gray-700"
                    }`}
                  >
                    <Laptop className="h-4 w-4" />
                    System
                  </button>
                </div>
              )}

              <div className="my-1 border-t border-gray-100" />

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                {loading ? (
                  <span>
                    <LoaderCircle /> Signing Out{" "}
                  </span>
                ) : (
                  "Sign out"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

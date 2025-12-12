"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-background dark:bg-[#171717] border-gray-200 dark:border-[#2F2F2F] transition-transform duration-300 md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 dark:border-[#2F2F2F]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Pill className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground leading-none">
                Pharmacy
              </span>
              <span className="text-xs text-gray-500 mt-1">
                Management System
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] md:hidden"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose} // Close sidebar on mobile when link clicked
                className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors border-r-4 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-[#2F2F2F]">
          <div className="text-xs text-center text-gray-400">
            © {new Date().getFullYear()} Pharmacy Developed By WS
            <br />
            Version 1.0.0
          </div>
        </div>
      </div>
    </>
  );
}

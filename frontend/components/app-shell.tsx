"use client";

import { useState, useMemo } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { CommandPalette } from "@/components/command-palette";
import { usePathname } from "next/navigation";

interface AppShellProps {
  title?: string;
  children: React.ReactNode;
}

export function AppShell({ title, children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const displayTitle = useMemo(() => {
    if (title) return title;
    // Compute title from pathname: e.g. "/inventory/categories" -> "Categories" or "Inventory"
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "Dashboard";
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  }, [title, pathname]);

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors text-foreground">
      <CommandPalette />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isCollapsed={isCollapsed}
      />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header 
          title={displayTitle} 
          onMenuClick={() => setIsSidebarOpen(true)} 
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

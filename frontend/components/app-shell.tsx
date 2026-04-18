"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { CommandPalette } from "@/components/command-palette";

interface AppShellProps {
  title: string;
  children: React.ReactNode;
}

export function AppShell({ title, children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <CommandPalette />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isCollapsed={isCollapsed}
      />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header 
          title={title} 
          onMenuClick={() => setIsSidebarOpen(true)} 
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}

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
 CreditCard,
 Building,
 BarChart2,
 CalendarHeart
} from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";

const navigationGroups = [
 {
 title: "MAIN MENU",
 items: [
 { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "manager"] },
 { name: "Products", href: "/inventory", icon: Package, roles: ["admin", "manager", "cashier"] },
 { name: "Categories", href: "/categories", icon: Package, roles: ["admin", "manager"] }, // Mock link if categories page doesn't exist
 ]
 },
 {
 title: "OPERATIONS",
 items: [
 { name: "Point of Sale", href: "/pos", icon: ShoppingCart, roles: ["admin", "manager", "cashier"] },
 { name: "Sales List", href: "/reports", icon: BarChart2, roles: ["admin", "manager"] },
 { name: "Customers", href: "/customers", icon: Users, roles: ["admin", "manager", "cashier"] },
 { name: "Refills", href: "/refills", icon: CalendarHeart, roles: ["admin", "manager", "cashier"] },
 ]
 },
 {
 title: "SUPPLY CHAIN",
 items: [
 { name: "Purchases", href: "/purchases", icon: TrendingUp, roles: ["admin", "manager"] },
 { name: "Suppliers", href: "/supplier", icon: Building, roles: ["admin", "manager"] },
 { name: "Transfers", href: "/inventory/transfers", icon: FileText, roles: ["admin", "manager"] },
 ]
 },
 {
 title: "COMMS & ADMIN",
 items: [
 { name: "Insurance", href: "/insurance", icon: CreditCard, roles: ["admin", "manager"] },
 { name: "Users", href: "/users", icon: Users, roles: ["admin"] },
 { name: "Settings", href: "/settings", icon: Settings, roles: ["admin", "manager"] },
 ]
 }
];

interface SidebarProps {
 isOpen?: boolean;
 onClose?: () => void;
 isCollapsed?: boolean;
}

export function Sidebar({ isOpen = false, onClose, isCollapsed = false }: SidebarProps) {
 const pathname = usePathname();
 const [isHovered, setIsHovered] = useState(false);
 const { user } = useAuth();

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
 className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
 onClick={onClose}
 />
 )}
 </AnimatePresence>

 {/* Sidebar Container */}
 <motion.div
 onMouseEnter={() => isCollapsed && setIsHovered(true)}
 onMouseLeave={() => setIsHovered(false)}
 animate={{ 
 width: isExpanded ? 260 : 80,
 }}
 transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
 className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-background transition-colors md:relative md:translate-x-0 ${
 isOpen ? "translate-x-0" : "-translate-x-full"
 }`}
 >
 <div className="flex items-center justify-between px-8 py-8 overflow-hidden min-h-[96px]">
 <div className="flex items-center gap-4">
 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft">
 <Pill className="h-5 w-5" />
 </div>
 {isExpanded && (
 <motion.div 
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 className="flex flex-col whitespace-nowrap"
 >
 <span className="text-xl font-bold tracking-tight text-card-foreground">
 Pharmacy
 </span>
 </motion.div>
 )}
 </div>
 <button
 onClick={onClose}
 className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors md:hidden"
 >
 <X className="h-5 w-5 text-muted-foreground" />
 </button>
 </div>

 <nav className="flex-1 space-y-6 px-4 py-2 overflow-y-auto custom-scrollbar">
 {navigationGroups.map((group, groupIdx) => {
 const filteredItems = group.items.filter(item => !user || item.roles.includes(user.role));
 if (filteredItems.length === 0) return null;

 return (
 <div key={groupIdx} className="flex flex-col gap-1">
 {isExpanded && (
 <motion.span 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-2"
 >
 {group.title}
 </motion.span>
 )}
 {filteredItems.map((item) => {
 const isActive =
 pathname === item.href ||
 (item.href !== "/dashboard" && pathname.startsWith(item.href));
 
 return (
 <Link
 key={item.name}
 href={item.href}
 onClick={onClose}
 className={`group relative flex items-center rounded-full transition-all duration-300 h-12 ${
 !isExpanded ? "justify-center mx-2" : "px-4 gap-4"
 } ${
 isActive
 ? "text-primary-foreground"
 : "text-muted-foreground hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 hover:text-card-foreground"
 }`}
 title={!isExpanded ? item.name : ""}
 >
 {isActive && (
 <motion.div
 layoutId="active-pill"
 className="absolute inset-0 bg-primary rounded-full shadow-soft"
 transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
 />
 )}
 <item.icon
 className={`shrink-0 transition-colors relative z-10 ${
 !isExpanded ? "h-5 w-5" : "h-[18px] w-[18px]"
 } ${
 isActive
 ? "text-primary-foreground"
 : "group-hover:text-primary"
 }`}
 />
 {isExpanded && (
 <motion.span 
 initial={{ opacity: 0, x: -5 }}
 animate={{ opacity: 1, x: 0 }}
 className="text-[13px] font-medium whitespace-nowrap relative z-10"
 >
 {item.name}
 </motion.span>
 )}
 </Link>
 );
 })}
 </div>
 );
 })}
 </nav>

 <div className="p-8 shrink-0 flex justify-center">
 <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
 </div>
 </motion.div>
 </>
 );
}

"use client";

import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

interface ConfirmationModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: () => void;
 title: string;
 message: string;
 confirmLabel?: string;
 cancelLabel?: string;
 variant?: "danger" | "warning" | "info";
 isLoading?: boolean;
}

export function ConfirmationModal({
 isOpen,
 onClose,
 onConfirm,
 title,
 message,
 confirmLabel = "Confirm",
 cancelLabel = "Cancel",
 variant = "danger",
 isLoading = false,
}: ConfirmationModalProps) {
 useEffect(() => {
 const handleEscape = (e: KeyboardEvent) => {
 if (e.key === "Escape") onClose();
 };
 if (isOpen) document.addEventListener("keydown", handleEscape);
 return () => document.removeEventListener("keydown", handleEscape);
 }, [isOpen, onClose]);

 if (!isOpen) return null;

 const variantColors = {
 danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
 warning: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500 text-white",
 info: "bg-primary hover:bg-primary-hover focus:ring-primary text-white",
 };

 const iconColors = {
 danger: "bg-red-50 text-red-600",
 warning: "bg-amber-50 text-amber-600",
 info: "bg-primary/10 text-primary",
 };

 return (
 <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
 <div
 className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] transition-opacity"
 onClick={onClose}
 />
 <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-card dark:bg-neutral-800 shadow-2xl transition-all">
 <div className="p-6">
 <div className="flex items-start gap-4">
 <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${iconColors[variant]}`}>
 <AlertTriangle className="h-6 w-6" aria-hidden="true" />
 </div>
 <div className="flex-1">
 <h3 className="h3 text-lg font-semibold leading-6 text-card-foreground">
 {title}
 </h3>
 <div className="mt-2">
 <p className="text-sm text-muted-foreground">
 {message}
 </p>
 </div>
 </div>
 </div>
 </div>
 <div className="bg-neutral-50 dark:bg-neutral-900 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-3">
 <button
 type="button"
 className="mt-3 inline-flex w-full justify-center rounded-lg border border-border bg-card dark:bg-neutral-800 px-4 py-2 text-sm font-semibold text-card-foreground shadow-sm hover:bg-neutral-50 dark:hover:bg-[#3F3F3F] focus:outline-none focus:ring-2 focus:ring-primary sm:mt-0 sm:w-auto transition-colors"
 onClick={onClose}
 >
 {cancelLabel}
 </button>
 <button
 type="button"
 disabled={isLoading}
 className={`inline-flex w-full justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto transition-colors disabled:opacity-50 ${variantColors[variant]}`}
 onClick={onConfirm}
 >
 {isLoading ? "Processing..." : confirmLabel}
 </button>
 </div>
 </div>
 </div>
 );
}

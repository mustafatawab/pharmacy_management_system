"use client";

import { Calendar } from "lucide-react";

export function DateRangePicker() {
 return (
 <div className="flex items-center gap-2 rounded-lg border border-border bg-card dark:bg-neutral-800 p-2 text-sm shadow-sm">
 <div className="flex items-center gap-2 text-muted-foreground">
 <Calendar className="h-4 w-4" />
 <span>Date Range:</span>
 </div>
 <div className="flex items-center gap-2">
 <input
 type="date"
 className="rounded border border-border px-2 py-1 text-card-foreground outline-none focus:border-primary dark:bg-neutral-700 "
 defaultValue="2025-11-12"
 />
 <span className="text-muted-foreground">to</span>
 <input
 type="date"
 className="rounded border border-border px-2 py-1 text-card-foreground outline-none focus:border-primary dark:bg-neutral-700 "
 defaultValue="2025-12-12"
 />
 </div>
 </div>
 );
}

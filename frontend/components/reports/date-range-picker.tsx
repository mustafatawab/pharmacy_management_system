"use client";

import { Calendar } from "lucide-react";

export function DateRangePicker() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white dark:bg-[#2F2F2F] dark:border-[#2F2F2F] p-2 text-sm shadow-sm">
      <div className="flex items-center gap-2 text-gray-500">
        <Calendar className="h-4 w-4" />
        <span>Date Range:</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          className="rounded border border-gray-200 px-2 py-1 text-gray-700 outline-none focus:border-blue-500 dark:bg-[#3F3F3F] dark:border-gray-600 dark:text-white"
          defaultValue="2025-11-12"
        />
        <span className="text-gray-400">to</span>
        <input
          type="date"
          className="rounded border border-gray-200 px-2 py-1 text-gray-700 outline-none focus:border-blue-500 dark:bg-[#3F3F3F] dark:border-gray-600 dark:text-white"
          defaultValue="2025-12-12"
        />
      </div>
    </div>
  );
}

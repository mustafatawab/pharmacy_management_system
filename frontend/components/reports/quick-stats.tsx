export function QuickStats() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-[#2F2F2F] dark:border-[#2F2F2F]">
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-lg bg-yellow-100 p-2 text-yellow-600">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Stats
        </h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-[#3F3F3F]">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Revenue (All Time)
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            USD $0.00
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-[#3F3F3F]">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Sales
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">0</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-[#3F3F3F]">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Purchases
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">1</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-[#3F3F3F]">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Low Stock Items
          </span>
          <span className="font-semibold text-red-600">0</span>
        </div>
      </div>
    </div>
  );
}

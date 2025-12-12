"use client";

import { useState } from "react";
import {
  Building2,
  ShieldCheck,
  Bell,
  Settings as SettingsIcon,
  Printer,
  Save,
  Check,
} from "lucide-react";

type Tab = "info" | "security" | "notifications" | "system" | "printing";

// Local Switch Component
function Switch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
        checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// Local Checkbox Component
function Checkbox({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
          checked
            ? "bg-blue-600 border-blue-600 text-white"
            : "border-gray-300 bg-white dark:border-gray-600 dark:bg-transparent"
        }`}
        onClick={() => onCheckedChange(!checked)}
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300 select-none">
        {label}
      </span>
    </label>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("info");

  // Notification States
  const [notifications, setNotifications] = useState({
    lowStock: true,
    expiringProducts: true,
    newSales: false,
    dailyReport: true,
    email: true,
    push: false,
  });

  // System States
  const [system, setSystem] = useState({
    autoBackup: true,
  });

  // Printing States
  const [printing, setPrinting] = useState({
    includeLogo: true,
    barcodes: true,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6 text-gray-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 rounded-xl bg-white p-4 md:py-8 shadow-sm dark:bg-[#2F2F2F]">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap min-w-max ${
                activeTab === "info"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#3F3F3F]"
              }`}
            >
              <Building2 className="h-4 w-4" />
              Pharmacy Info
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap min-w-max ${
                activeTab === "security"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#3F3F3F]"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Security
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap min-w-max ${
                activeTab === "notifications"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#3F3F3F]"
              }`}
            >
              <Bell className="h-4 w-4" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("system")}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap min-w-max ${
                activeTab === "system"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#3F3F3F]"
              }`}
            >
              <SettingsIcon className="h-4 w-4" />
              System
            </button>
            <button
              onClick={() => setActiveTab("printing")}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap min-w-max ${
                activeTab === "printing"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#3F3F3F]"
              }`}
            >
              <Printer className="h-4 w-4" />
              Printing
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 rounded-xl bg-white p-8 shadow-sm dark:bg-[#2F2F2F]">
          {activeTab === "info" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pharmacy Name *
                  </label>
                  <input
                    type="text"
                    defaultValue="Pharmacy"
                    className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    License Number *
                  </label>
                  <input
                    type="text"
                    defaultValue="PH-2024-001"
                    className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address *
                </label>
                <textarea
                  defaultValue="123 Main Street, City, State 12345"
                  className="h-24 w-full resize-none rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    defaultValue="+1-555-0123"
                    className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    defaultValue="info@pharmacy.com"
                    className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    defaultValue="TAX-123456789"
                    className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Currency
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white dark:bg-[#2F2F2F]"
                    defaultValue="USD"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tax Rate (%)
                  </label>
                  <input
                    type="text"
                    defaultValue="17.00"
                    className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 px-1 py-6 dark:border-gray-700">
                <h3 className="mb-6 text-lg font-medium text-gray-900 dark:text-white">
                  Security Settings
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-[#3F3F3F]">
                      Enable
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Login Notifications
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified of new login attempts
                      </p>
                    </div>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Notification Preferences
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Low Stock
                  </span>
                  <Switch
                    checked={notifications.lowStock}
                    onCheckedChange={(c) =>
                      setNotifications((p) => ({ ...p, lowStock: c }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Expiring Products
                  </span>
                  <Switch
                    checked={notifications.expiringProducts}
                    onCheckedChange={(c) =>
                      setNotifications((p) => ({ ...p, expiringProducts: c }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    New Sales
                  </span>
                  <Switch
                    checked={notifications.newSales}
                    onCheckedChange={(c) =>
                      setNotifications((p) => ({ ...p, newSales: c }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Daily Report
                  </span>
                  <Switch
                    checked={notifications.dailyReport}
                    onCheckedChange={(c) =>
                      setNotifications((p) => ({ ...p, dailyReport: c }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Email Notifications
                  </span>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(c) =>
                      setNotifications((p) => ({ ...p, email: c }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Push Notifications
                  </span>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(c) =>
                      setNotifications((p) => ({ ...p, push: c }))
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  <Save className="h-4 w-4" />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                System Configuration
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Backup Frequency
                    </label>
                    <select
                      className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white dark:bg-[#2F2F2F]"
                      defaultValue="Daily"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Data Retention (Days)
                    </label>
                    <input
                      type="number"
                      defaultValue="365"
                      className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Session Timeout (Minutes)
                    </label>
                    <input
                      type="number"
                      defaultValue="120"
                      className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div className="flex items-end pb-2">
                    <Checkbox
                      checked={system.autoBackup}
                      onCheckedChange={(c) =>
                        setSystem((p) => ({ ...p, autoBackup: c }))
                      }
                      label="Enable Automatic Backup"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  <Save className="h-4 w-4" />
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === "printing" && (
            <div className="space-y-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Printing Configuration
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Receipt Printer
                    </label>
                    <select
                      className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white dark:bg-[#2F2F2F]"
                      defaultValue="Default System Printer"
                    >
                      <option value="Default System Printer">
                        Default System Printer
                      </option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Label Printer
                    </label>
                    <select
                      className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white dark:bg-[#2F2F2F]"
                      defaultValue="Default System Printer"
                    >
                      <option value="Default System Printer">
                        Default System Printer
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Receipt Format
                    </label>
                    <select
                      className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white dark:bg-[#2F2F2F]"
                      defaultValue="Standard (80mm)"
                    >
                      <option value="Standard (80mm)">Standard (80mm)</option>
                      <option value="Thermal (58mm)">Thermal (58mm)</option>
                      <option value="A4">A4</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Auto Print
                    </label>
                    <select
                      className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-white dark:bg-[#2F2F2F]"
                      defaultValue="Always Ask"
                    >
                      <option value="Always Ask">Always Ask</option>
                      <option value="Always Print">Always Print</option>
                      <option value="Never Print">Never Print</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Checkbox
                    checked={printing.includeLogo}
                    onCheckedChange={(c) =>
                      setPrinting((p) => ({ ...p, includeLogo: c }))
                    }
                    label="Include pharmacy logo on receipts"
                  />
                  <Checkbox
                    checked={printing.barcodes}
                    onCheckedChange={(c) =>
                      setPrinting((p) => ({ ...p, barcodes: c }))
                    }
                    label="Print product barcodes on labels"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  <Save className="h-4 w-4" />
                  Save Print Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

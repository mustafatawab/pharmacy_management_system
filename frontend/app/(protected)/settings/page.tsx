"use client";

import { useState, useEffect } from "react";
import {
 Building2,
 ShieldCheck,
 Bell,
 Settings as SettingsIcon,
 Printer,
 Save,
 Check,
} from "lucide-react";
import toast from "react-hot-toast";

type Tab = "general" | "auth";

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
 className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible-outline:focus-visible:ring-2 focus-visible-ring-blue-600 focus-visible:ring-offset-2 ${
 checked ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
 }`}
 >
 <span
 className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-card shadow ring-0 transition duration-200 ease-in-out ${
 checked ? "translate-x-5" : "translate-x-0"
 }`}
 />
 </button>
 );
}

function TabButton({
 title,
 isActive,
 onClick,
}: {
 title: string;
 isActive: boolean;
 onClick: () => void;
}) {
 return (
 <button
 onClick={onClick}
 className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap min-w-max ${
 isActive
 ? "bg-primary/10 text-primary dark:bg-blue-900/20 dark:text-blue-400"
 : "text-muted-foreground hover:bg-neutral-50 dark:text-muted-foreground dark:hover:bg-[#3F3F3F]"
 }`}
 title={title}
 >
 {isActive ? (
 <ShieldCheck className="h-4 w-4" />
 ) : (
 <Building2 className="h-4 w-4" />
 )}
 <span>{title}</span>
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
 ? "bg-primary border-blue-600 text-white"
 : "border-border bg-card dark:bg-transparent"
 }`}
 onClick={() => onCheckedChange(!checked)}
 >
 {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
 </div>
 <span className="text-sm text-card-foreground dark:text-muted-foreground select-none">
 {label}
 </span>
 </label>
 );
}

export default function SettingsPage() {
 const [activeTab, setActiveTab] = useState<Tab>("general");
 const [pharmacyInfo, setPharmacyInfo] = useState({
 name: "",
 address: "",
 city: "",
 phone: "",
 email: "",
 currency: "USD", license_number: "PH-2024-001", tax_id: "TAX-123456789",
 });
 const [password, setPassword] = useState({
 current: "",
 new: "",
 confirm: "",
 });

 // Fetch pharmacy info from backend on mount
 useEffect(() => {
 fetchPharmacyInfo();
 }, []);

 const fetchPharmacyInfo = async () => {
 try {
 const res = await fetch("/api/tenant/me", {
 credentials: "include",
 });
 if (res.ok) {
 const data = await res.json();
 setPharmacyInfo({
 name: data.name || "Pharmacy",
 address: data.address || "",
 city: data.city || "",
 phone: data.phone || "",
 email: data.email || "",
 currency: data.currency || "USD",
 license_number: data.license_number || "PH-2024-001",
 tax_id: data.tax_id || "TAX-123456789",
 });
 }
 } catch (error) {
 console.error("Failed to fetch pharmacy info:", error);
 }
 };

 const handleSavePharmacy = async () => {
 try {
 await fetch("/api/tenant/me", {
 method: "PUT",
 headers: {
 "Content-Type": "application/json",
 },
 credentials: "include",
 body: JSON.stringify({
 name: pharmacyInfo.name,
 address: pharmacyInfo.address,
 phone: pharmacyInfo.phone,
 email: pharmacyInfo.email,
 }),
 });
 toast.success("Pharmacy info updated successfully");
 } catch (error: any) {
 toast.error(error?.response?.data?.detail || "Failed to update pharmacy info");
 }
 };

 const handleChangePassword = async () => {
 if (password.new !== password.confirm) {
 toast.error("New passwords do not match");
 return;
 }
 if (password.new.length < 6) {
 toast.error("Password must be at least 6 characters");
 return;
 }
 try {
 await fetch("/api/auth/change-password", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 credentials: "include",
 body: JSON.stringify({
 current_password: password.current,
 new_password: password.new,
 }),
 });
 toast.success("Password changed successfully");
 setPassword({ current: "", new: "", confirm: "" });
 } catch (error: any) {
 toast.error(error?.response?.data?.detail || "Failed to change password");
 }
 };

 if (activeTab === "general") {
 return (
 <div className="flex flex-col gap-6">
 <div className="flex items-center gap-2">
 <SettingsIcon className="h-6 w-6 text-muted-foreground" />
 <h2 className="h2 text-xl font-bold text-card-foreground">
 Settings
 </h2>
 </div>

 <div className="flex gap-2 mb-4">
 <TabButton title="General" onClick={() => setActiveTab("general")} isActive={activeTab === "general"} />
 <TabButton title="Auth" onClick={() => setActiveTab("auth")} isActive={(activeTab as string) === "auth"} />
 </div>

 <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
 <div className="space-y-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Pharmacy Name *
 </label>
 <input
 type="text"
 value={pharmacyInfo.name}
 onChange={(e) =>
 setPharmacyInfo({ ...pharmacyInfo, name: e.target.value })
 }
 className="w-full rounded-lg border border-border bg-transparent px-4 py-2 text-card-foreground outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 "
 />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 License Number *
 </label>
 <input
 type="text"
 value={pharmacyInfo.license_number || "PH-2024-001"}
 onChange={(e) =>
 setPharmacyInfo({ ...pharmacyInfo, license_number: e.target.value })
 }
 className="w-full rounded-lg border border-border bg-transparent px-4 py-2 text-card-foreground outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 "
 />
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Address *
 </label>
 <textarea
 value={pharmacyInfo.address}
 onChange={(e) =>
 setPharmacyInfo({ ...pharmacyInfo, address: e.target.value })
 }
 className="h-24 w-full resize-none rounded-lg border border-border bg-transparent px-4 py-2 text-card-foreground outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 "
 />
 </div>

 <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
 <div className="space-y-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Phone Number *
 </label>
 <input
 type="text"
 value={pharmacyInfo.phone}
 onChange={(e) =>
 setPharmacyInfo({ ...pharmacyInfo, phone: e.target.value })
 }
 className="w-full rounded-lg border border-border bg-transparent px-4 py-2 text-card-foreground outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 "
 />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Email Address *
 </label>
 <input
 type="email"
 value={pharmacyInfo.email}
 onChange={(e) =>
 setPharmacyInfo({ ...pharmacyInfo, email: e.target.value })
 }
 className="w-full rounded-lg border border-border bg-transparent px-4 py-2 text-card-foreground outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 "
 />
 </div>
 </div>

 <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
 <div className="space-y-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Tax ID
 </label>
 <input
 type="text"
 value={pharmacyInfo.tax_id || "TAX-123456789"}
 onChange={(e) =>
 setPharmacyInfo({ ...pharmacyInfo, tax_id: e.target.value })
 }
 className="w-full rounded-lg border border-border bg-transparent px-4 py-2 text-card-foreground outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 "
 />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Currency
 </label>
 <select
 value={pharmacyInfo.currency}
 onChange={(e) =>
 setPharmacyInfo({ ...pharmacyInfo, currency: e.target.value })
 }
 className="w-full rounded-lg border border-border bg-transparent px-4 py-2 text-card-foreground outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 dark:bg-neutral-800"
 >
 <option value="USD">USD - US Dollar</option>
 <option value="EUR">EUR - Euro</option>
 <option value="GBP">GBP - British Pound</option>
 <option value="PKR">PKR - Pakistani Rupee</option>
 </select>
 </div>
 </div>

 <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
 <div className="space-y-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Tax Rate (%)
 </label>
 <input
 type="text"
 value={"17.00"}
 className="w-full rounded-lg border border-border bg-transparent px-4 py-2 text-card-foreground outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 "
 />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Business Hours
 </label>
 <input
 type="text"
 value={"09:00 AM - 09:00 PM"}
 className="w-full rounded-lg border border-border bg-transparent px-4 py-2 text-card-foreground outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 "
 />
 </div>
 </div>

 <div className="flex justify-end pt-4">
 <button
 onClick={handleSavePharmacy}
 className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover"
 >
 <Save className="h-4 w-4" />
 Save Changes
 </button>
 </div>
 </div>
 );
 }

 if ((activeTab as string) === "auth") {
 return (
 <div className="flex flex-col gap-6">
 <div className="flex items-center gap-2">
 <ShieldCheck className="h-6 w-6 text-muted-foreground" />
 <h2 className="h2 text-xl font-bold text-card-foreground">
 Auth Settings
 </h2>
 </div>

 <div className="space-y-8">
 <div className="space-y-6">
 <h3 className="h3 text-lg font-medium text-card-foreground">
 Change Password
 </h3>
 <div className="space-y-4">
 <div className="space-y-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Current Password *
 </label>
 <div className="relative">
 <input
 type="password"
 value={password.current}
 onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))}
 className="w-full rounded-lg border border-border bg-transparent px-4 py-2 text-card-foreground outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 "
 />
 </div>
 </div>
 <div className="space-y-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 New Password *
 </label>
 <div className="relative">
 <input
 type="password"
 value={password.new}
 onChange={(e) => setPassword((p) => ({ ...p, new: e.target.value }))}
 className="w-full rounded-lg border border-border bg-transparent px-4 py-2 text-card-foreground outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 "
 />
 </div>
 </div>
 <div className="space-y-2">
 <label className="text-sm font-medium text-card-foreground dark:text-muted-foreground">
 Confirm New Password *
 </label>
 <div className="relative">
 <input
 type="password"
 value={password.confirm}
 onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))}
 className="w-full rounded-lg border border-border bg-transparent px-4 py-2 text-card-foreground outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 "
 />
 </div>
 </div>
 </div>
 <div className="flex justify-end">
 <button
 onClick={handleChangePassword}
 className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover">
 Change Password
 </button>
 </div>
 </div>

 <div className="border-t border-border px-1 py-6 dark:border-gray-700">
 <h3 className="h3 mb-6 text-lg font-medium text-card-foreground">
 Security Settings
 </h3>
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-card-foreground">
 Two-Factor Authentication
 </p>
 <p className="text-sm text-muted-foreground">
 Add an extra layer of security to your account
 </p>
 </div>
 <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-card-foreground hover:bg-neutral-50 dark:text-muted-foreground dark:hover:bg-[#3F3F3F]">
 Enable
 </button>
 </div>
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-card-foreground">
 Login Notifications
 </p>
 <p className="text-sm text-muted-foreground">
 Get notified of new login attempts
 </p>
 </div>
 <Switch checked={true} onCheckedChange={() => {}} />
 </div>
 </div>
 </div>
 </div>
 </div>
 );
 }

 return null;
}
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Pill,
  Building2,
  Users,
  ArrowRight,
  Upload,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface PharmacyForm {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  logo_url: string | null;
}

interface StaffForm {
  full_name: string;
  username: string;
  password: string;
  confirm_password: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [pharmacyForm, setPharmacyForm] = useState<PharmacyForm>({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    logo_url: null,
  });

  const [staffForm, setStaffForm] = useState<StaffForm>({
    full_name: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  const handlePharmacyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPharmacyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStaffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStaffForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be less than 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setLogoPreview(base64);
      setPharmacyForm((prev) => ({ ...prev, logo_url: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pharmacyForm.name || !pharmacyForm.address || !pharmacyForm.phone || !pharmacyForm.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (staffForm.password !== staffForm.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    if (staffForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create the pharmacy (tenant)
      const tenantRes = await fetch(`${API_URL}/tenant/setup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pharmacyForm.name,
          address: pharmacyForm.address,
          city: pharmacyForm.city,
          phone: pharmacyForm.phone,
          email: pharmacyForm.email,
          logo_url: pharmacyForm.logo_url,
        }),
      });
      const tenantData = await tenantRes.json();
      if (!tenantRes.ok) {
        toast.error(tenantData.detail || "Failed to setup pharmacy");
        return;
      }

      // Step 2: Add staff member
      const staffRes = await fetch(`${API_URL}/user`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: staffForm.full_name,
          username: staffForm.username,
          password: staffForm.password,
          is_active: true,
        }),
      });
      const staffData = await staffRes.json();
      if (!staffRes.ok) {
        toast.error(staffData.detail || "Failed to add staff member");
        return;
      }

      toast.success("Pharmacy setup complete! Welcome aboard 🎉");
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E6F0FF] flex flex-col items-center justify-start py-10 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          <Pill className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900 leading-none">Pharmacy</p>
          <p className="text-xs text-gray-500">Management System</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0 mb-8">
        {/* Step 1 */}
        <div className="flex flex-col items-center gap-1">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full font-bold text-sm transition-all duration-300 ${
              step >= 1
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                : "bg-white text-gray-400 ring-1 ring-gray-200"
            }`}
          >
            {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
          </div>
          <span
            className={`text-xs font-medium ${
              step >= 1 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            Pharmacy
          </span>
        </div>

        {/* Connector */}
        <div className="flex items-center mb-4 mx-2">
          <div
            className={`h-0.5 w-20 transition-all duration-500 ${
              step >= 2 ? "bg-blue-500" : "bg-gray-200"
            }`}
          />
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center gap-1">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full font-bold text-sm transition-all duration-300 ${
              step >= 2
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                : "bg-white text-gray-400 ring-1 ring-gray-200"
            }`}
          >
            2
          </div>
          <span
            className={`text-xs font-medium ${
              step >= 2 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            Staff
          </span>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl shadow-blue-500/10 ring-1 ring-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                step === 1 ? "bg-blue-50" : "bg-emerald-50"
              }`}
            >
              {step === 1 ? (
                <Building2 className="h-6 w-6 text-blue-600" />
              ) : (
                <Users className="h-6 w-6 text-emerald-600" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {step === 1 ? "Set up your pharmacy" : "Add a staff member"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {step === 1
                  ? "Enter your pharmacy details to get started"
                  : "Add your first staff member to the team"}
              </p>
            </div>
          </div>
        </div>

        {/* Step 1 — Pharmacy Details */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="px-8 py-6 space-y-5">
            {/* Logo Upload */}
            <div className="flex items-center gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-all overflow-hidden"
              >
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoPreview}
                    alt="Pharmacy logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Pill className="h-7 w-7 text-gray-300" />
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload Logo
                </button>
                <p className="text-xs text-gray-400 mt-0.5">PNG or JPG, max 2MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>

            {/* Pharmacy Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">
                Pharmacy Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  required
                  value={pharmacyForm.name}
                  onChange={handlePharmacyChange}
                  placeholder="e.g. Al-Shifa Pharmacy"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">
                Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <textarea
                  name="address"
                  required
                  value={pharmacyForm.address}
                  onChange={handlePharmacyChange}
                  placeholder="Enter full pharmacy address"
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm resize-none"
                />
              </div>
            </div>

            {/* City + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 block">
                  City
                </label>
                <input
                  name="city"
                  type="text"
                  value={pharmacyForm.city}
                  onChange={handlePharmacyChange}
                  placeholder="Karachi"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 block">
                  Phone <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={pharmacyForm.phone}
                    onChange={handlePharmacyChange}
                    placeholder="+92 300 0000000"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Company Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">
                Company Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={pharmacyForm.email}
                  onChange={handlePharmacyChange}
                  placeholder="info@pharmacy.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm"
                />
              </div>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 mt-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Step 2 — Add Staff */}
        {step === 2 && (
          <form onSubmit={handleFinish} className="px-8 py-6 space-y-5">
            {/* Staff Info Banner */}
            <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 flex gap-3">
              <div className="mt-0.5 text-blue-500">
                <Users className="h-4 w-4" />
              </div>
              <p className="text-sm text-blue-700">
                Add a staff member who will help manage the pharmacy. You can add more from{" "}
                <span className="font-semibold">User Management</span> later.
              </p>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  name="full_name"
                  type="text"
                  required
                  value={staffForm.full_name}
                  onChange={handleStaffChange}
                  placeholder="Staff member's full name"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm"
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">
                Username <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">@</span>
                <input
                  name="username"
                  type="text"
                  required
                  value={staffForm.username}
                  onChange={handleStaffChange}
                  placeholder="staff_username"
                  className="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={staffForm.password}
                  onChange={handleStaffChange}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  name="confirm_password"
                  type={showConfirm ? "text" : "password"}
                  required
                  value={staffForm.confirm_password}
                  onChange={handleStaffChange}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-lg transition-all text-sm"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-2 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Finish Setup
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {/* Skip staff */}
            <p className="text-center text-xs text-gray-400">
              Don&apos;t want to add staff now?{" "}
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const tenantRes = await fetch(`${API_URL}/tenant/setup`, {
                      method: "POST",
                      credentials: "include",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: pharmacyForm.name,
                        address: pharmacyForm.address,
                        city: pharmacyForm.city,
                        phone: pharmacyForm.phone,
                        email: pharmacyForm.email,
                        logo_url: pharmacyForm.logo_url,
                      }),
                    });
                    const data = await tenantRes.json();
                    if (!tenantRes.ok) {
                      toast.error(data.detail || "Failed to setup pharmacy");
                      return;
                    }
                    toast.success("Pharmacy setup complete!");
                    router.push("/dashboard");
                  } catch {
                    toast.error("Something went wrong.");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Skip for now
              </button>
            </p>
          </form>
        )}
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-gray-400">
        © {new Date().getFullYear()} Pharmacy Management System · Version 1.0.0
      </p>
    </div>
  );
}

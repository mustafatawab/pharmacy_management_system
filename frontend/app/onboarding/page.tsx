"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Pill,
  Building2,
  ArrowRight,
  Upload,
  Loader2,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";
import api from "@/lib/api";

interface PharmacyForm {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  logo_url: string | null;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { refreshUser, refreshTenant } = useAuth();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [form, setForm] = useState<PharmacyForm>({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    logo_url: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      setForm((prev) => ({ ...prev, logo_url: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the pharmacy (tenant)
      await api.post("/tenant/setup", {
        name: form.name,
        address: form.address,
        city: form.city,
        phone: form.phone,
        email: form.email,
        logo_url: form.logo_url,
      });

      // Refresh global state so the app knows the user now has a tenant_id
      await refreshUser();
      await refreshTenant();

      toast.success("Pharmacy setup complete! Welcome aboard 🎉");
      router.push("/dashboard");
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Failed to setup pharmacy";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start py-10 px-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-premium ring-1 ring-gray-100">
          <Pill className="h-7 w-7 text-primary" />
        </div>
        <div>
          <p className="text-xl font-extrabold text-foreground tracking-tight leading-none">Pharmacy</p>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">Management System</p>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-card rounded-3xl shadow-premium border border-border overflow-hidden"
      >
        {/* Card Header */}
        <div className="px-8 pt-8 pb-6 border-b border-border bg-gray-50/30">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                Pharmacy Setup
              </h1>
              <p className="text-sm font-semibold text-gray-400 mt-1">
                Enter your pharmacy details to finalize your account.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          {/* Logo Upload */}
          <div className="flex items-center gap-5">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden group"
            >
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoPreview}
                  alt="Pharmacy logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Upload className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Logo</span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-bold text-primary hover:underline transition-all"
              >
                Upload Business Logo
              </button>
              <p className="text-xs font-medium text-gray-400">Recommended: Square PNG, max 2MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Pharmacy Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">
                Pharmacy Name <span className="text-danger">*</span>
              </label>
              <div className="relative group">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Al-Shifa Pharmacy"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground font-medium"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">
                Full Address <span className="text-danger">*</span>
              </label>
              <div className="relative group">
                <MapPin className="absolute left-3.5 top-4 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <textarea
                  name="address"
                  required
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter complete pharmacy address"
                  rows={3}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground font-medium resize-none"
                />
              </div>
            </div>

            {/* City + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block">City</label>
                <input
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Karachi"
                  className="w-full px-4 py-3.5 rounded-xl border border-border bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block">
                  Phone <span className="text-danger">*</span>
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+92 300 0000"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Company Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">
                Official Email <span className="text-danger">*</span>
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="pharmacy@business.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground font-medium"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl transition-all shadow-premium hover:shadow-primary/20 flex items-center justify-center gap-3 mt-4 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Finalizing Setup...
              </>
            ) : (
              <>
                Finish Setup
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Footer */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]"
      >
        © {new Date().getFullYear()} Pharmacy OS · v1.0.0
      </motion.p>
    </div>
  );
}

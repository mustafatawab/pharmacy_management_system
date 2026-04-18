"use client";

import { useState } from "react";
import { Pill, Eye, EyeOff, Loader2, User, Lock, Mail, BadgeCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [formValue, setFormValue] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(formValue);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-50">
      {/* Form Container - Left Side */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 flex items-center flex-col justify-center p-6 sm:p-12"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-premium ring-1 ring-gray-100 mb-6 lg:hidden">
            <Pill className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Get Started
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-bold uppercase tracking-widest">
            Create your account today
          </p>
        </div>

        <div className="w-full max-w-md bg-card rounded-3xl shadow-premium border border-border p-8 sm:p-10">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">Full Name</label>
              <div className="relative group">
                <BadgeCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  name="full_name"
                  type="text"
                  required
                  value={formValue.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formValue.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">Username</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  name="username"
                  type="text"
                  required
                  value={formValue.username}
                  onChange={handleChange}
                  placeholder="johndoe123"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formValue.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-900 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl transition-all shadow-premium hover:shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-slate-600 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Brand Panel - Right Side */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-32 h-32 rounded-full border-2 border-white rotate-12" />
          <div className="absolute bottom-32 left-16 w-48 h-48 rounded-3xl border-2 border-white/20 -rotate-12" />
        </div>

        <div className="relative z-10 text-center">
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-3xl backdrop-blur-md shadow-2xl border border-white/20">
            <Pill className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Pharmacy OS
          </h1>
          <p className="text-white/80 text-lg max-w-sm font-medium leading-relaxed">
            Join thousands of pharmacies streamlining their operations with our platform.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

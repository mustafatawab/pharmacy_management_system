"use client";

import { useState } from "react";
import { Pill, Eye, EyeOff, Loader2, User, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formValue, setFormValue] = useState({
    login: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(formValue);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-50">
      {/* Brand Panel - Left Side */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 relative overflow-hidden"
      >
        {/* Modern pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-3xl border-2 border-white rotate-12" />
          <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full border-2 border-white/20" />
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-xl border border-white/20 -rotate-12" />
        </div>

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-3xl backdrop-blur-md shadow-2xl border border-white/20">
            <Pill className="h-12 w-12 text-white" />
          </div>

          {/* Brand name */}
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Pharmacy OS
          </h1>

          {/* Tagline */}
          <p className="text-white/80 text-lg max-w-sm font-medium leading-relaxed">
            The next generation of pharmacy management. Fast, secure, and intuitive.
          </p>
        </div>
      </motion.div>
    
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 flex items-center flex-col justify-center p-6 sm:p-12"
      >
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-premium ring-1 ring-gray-100 mb-6 lg:hidden">
            <Pill className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-bold uppercase tracking-widest">
            Please enter your details
          </p>
        </div>

        <div className="w-full max-w-md bg-card rounded-3xl shadow-premium border border-border p-8 sm:p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="login"
                className="text-sm font-bold text-slate-700 block"
              >
                Username or Email
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  id="login"
                  name="login"
                  type="text"
                  required
                  value={formValue.login}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-slate-700 block"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formValue.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-900 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl transition-all shadow-premium hover:shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-border text-center">
            <p className="text-sm text-slate-600 font-medium">
              New to our platform?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

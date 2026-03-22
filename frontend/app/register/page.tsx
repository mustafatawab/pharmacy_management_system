"use client";

import { useState } from "react";
import { Pill, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formValue, setFormValue] = useState({
    full_name: "",
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
    await register(formValue);
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Form Container - Left Side (Opposite of Login) */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 flex items-center flex-col justify-center p-6 sm:p-12 bg-[#E6F0FF]"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 mb-6">
            <Pill className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Pharmacy
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Management System
          </p>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-blue-500/5 ring-1 ring-gray-100 p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="full_name"
                className="text-sm font-semibold text-gray-700 block"
              >
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                value={formValue.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-semibold text-gray-700 block"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formValue.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700 block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formValue.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700 block"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Already Have an Account?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Brand Panel - Right Side (Opposite of Login) */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-blue-900 flex-col items-center justify-center p-12 relative overflow-hidden"
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full border-2 border-white/30" />
          <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full border-2 border-white/20" />
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full border border-white/20" />
        </div>

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-2xl backdrop-blur-sm">
            <Pill className="h-12 w-12 text-white" />
          </div>

          {/* Brand name */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Pharmacy Management System
          </h1>

          {/* Tagline */}
          <p className="text-white/80 text-lg max-w-sm">
            Simplifying Management, Empowering Pharmacy
          </p>
        </div>
      </motion.div>
    </div>
  );
}

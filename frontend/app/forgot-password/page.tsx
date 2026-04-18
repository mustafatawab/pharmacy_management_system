"use client";

import { useState } from "react";
import { Pill, ArrowLeft, Mail, Loader2, SendHorizontal } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (error) {
      // Error handled by AuthProvider toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 items-center justify-center p-6 overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-3xl shadow-premium border border-border p-8 sm:p-10 relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-sm mb-6">
            <Pill className="h-9 w-9 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-bold uppercase tracking-widest">
            Enter your email to continue
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-bold text-slate-700 block"
              >
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-900 font-medium"
                />
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
                  Sending Link...
                </>
              ) : (
                <>
                  Send Reset Link
                  <SendHorizontal className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-8 py-4">
            <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl text-sm font-bold border border-emerald-100 leading-relaxed">
              We&apos;ve sent a password reset link to <br/>
              <span className="text-emerald-900 underline decoration-emerald-200 mt-1 inline-block">{email}</span>
            </div>
            <button 
              onClick={() => setSubmitted(false)}
              className="text-sm font-bold text-primary hover:underline"
            >
              Didn&apos;t receive it? Try a different email
            </button>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-border text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

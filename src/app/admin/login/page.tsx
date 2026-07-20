"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    accessError === "access_denied"
      ? "Access Denied: Your account does not have an active administrator profile."
      : accessError === "owner_required"
      ? "Access Restricted: Owner privileges required for this page."
      : null
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("An unexpected error occurred during sign in.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-2xl space-y-8">
      <div className="text-center space-y-3">
        <div className="relative w-16 h-16 bg-brand-50 rounded-2xl p-2 mx-auto shadow-sm">
          <Image
            src="/logos/logo.png"
            alt="OC Water Features Logo"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
          Admin Control Portal
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Authorized OC Water Features Administrators Only
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="admin-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Administrator Email
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" aria-hidden="true" />
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600"
              placeholder="admin@ocwaterfeatures.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="admin-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" aria-hidden="true" />
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600"
              placeholder="••••••••••••"
            />
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full justify-center">
          {loading ? "Authenticating..." : "Sign In to Admin Dashboard"}
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-100 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Strict Role-Based Access Control</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Public registration is disabled. Accounts are managed directly by system owners.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-white text-center">Loading portal...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}

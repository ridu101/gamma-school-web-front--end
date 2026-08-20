import { useState } from "react";
import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import toast from "react-hot-toast";
import { apiRequest } from "../services/api";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading(
      "লগইন করা হচ্ছে..."
    );

    try {
      setLoading(true);

      const response = await apiRequest(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      window.localStorage.setItem(
        "admin_token",
        response.data.token
      );

      window.localStorage.setItem(
        "admin_user",
        JSON.stringify(response.data.user)
      );

      toast.success(
        "সফলভাবে লগইন হয়েছে",
        {
          id: toastId,
        }
      );

      navigate({
        to: "/admin/dashboard",
      });
    } catch (err) {
      console.error(err);

      toast.error(
        err.message ||
          "ই-মেইল অথবা পাসওয়ার্ড সঠিক নয়",
        {
          id: toastId,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#dfe6eb] px-4 py-8 sm:px-6">
      {/* ==========================================
          PREMIUM FUTURISTIC BACKGROUND
      ========================================== */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundColor: "#dfe6eb",
          backgroundImage: `
            linear-gradient(rgba(13, 148, 136, 0.085) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.085) 1px, transparent 1px),
            linear-gradient(rgba(15, 23, 42, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px, 40px 40px, 200px 200px, 200px 200px",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-teal-200/35 via-cyan-100/20 to-transparent" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[85%] -translate-x-1/2 bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />

      <div className="relative z-10 w-full max-w-[460px]">
        {/* ==========================================
            BRAND BLOCK
        ========================================== */}
        <div className="mb-5 text-center">
          <div className="relative mx-auto flex h-[74px] w-[74px] items-center justify-center">
            <div className="absolute inset-0 rounded-[24px] border border-teal-300/70 bg-white/65 shadow-[0_12px_35px_rgba(15,118,110,0.20)] backdrop-blur-xl" />

            <div className="absolute inset-[5px] rounded-[20px] bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-600 shadow-lg shadow-teal-300/50" />

            <SchoolIcon className="relative z-10 h-9 w-9 text-white" />
          </div>

          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.32em] text-teal-700">
            Secure Admin Portal
          </p>

          <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
        </div>

        {/* ==========================================
            LOGIN CARD
        ========================================== */}
        <section className="overflow-hidden rounded-[30px] border border-slate-300/80 bg-white/94 shadow-[0_24px_65px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500" />

          <div className="relative p-6 sm:p-8">
            <div className="pointer-events-none absolute right-5 top-5 h-20 w-20 rounded-full border border-teal-100/80" />
            <div className="pointer-events-none absolute right-8 top-8 h-14 w-14 rounded-full border border-teal-100/60" />

            {/* Card Header */}
            <div className="relative text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-teal-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.10)]" />
                Protected Access
              </span>

              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[30px]">
                অ্যাডমিন লগইন
              </h1>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
                ডিজিটাল বিদ্যালয় ম্যানেজমেন্ট সিস্টেমে
                নিরাপদভাবে প্রবেশ করুন
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  ই-মেইল
                </label>

                <div className="group relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition group-focus-within:text-teal-600">
                    <MailIcon className="h-5 w-5" />
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="আপনার ই-মেইল লিখুন"
                    required
                    autoComplete="username"
                    className="w-full rounded-2xl border border-slate-300 bg-[#f3f6f8] py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100/90"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  পাসওয়ার্ড
                </label>

                <div className="group relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition group-focus-within:text-teal-600">
                    <LockIcon className="h-5 w-5" />
                  </span>

                  <input
                    type={
                      showPassword ? "text" : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-slate-300 bg-[#f3f6f8] py-3.5 pl-12 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100/90"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-teal-700"
                    aria-label={
                      showPassword
                        ? "পাসওয়ার্ড লুকান"
                        : "পাসওয়ার্ড দেখুন"
                    }
                    title={
                      showPassword
                        ? "পাসওয়ার্ড লুকান"
                        : "পাসওয়ার্ড দেখুন"
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Security Card */}
              <div className="flex items-center gap-3 rounded-2xl border border-teal-200/90 bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-white text-teal-700 shadow-sm">
                  <ShieldIcon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-extrabold text-teal-800">
                    Secure Access
                  </p>

                  <p className="mt-0.5 text-[11px] leading-4 text-teal-700">
                    শুধুমাত্র অনুমোদিত অ্যাডমিন অ্যাকাউন্ট ব্যবহার করুন
                  </p>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(13,148,136,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(13,148,136,0.34)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <span className="pointer-events-none absolute inset-y-0 left-[-40%] w-1/3 skew-x-[-18deg] bg-white/15 transition duration-700 group-hover:left-[120%]" />

                {loading ? (
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    লগইন হচ্ছে...
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center gap-2">
                    লগইন করুন
                    <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                )}
              </button>
            </form>

            {/* Footer inside card */}
            <div className="mt-7 border-t border-slate-200 pt-5 text-center">
              <p className="text-xs font-medium text-slate-500">
                Digital School Administration System
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                Secure • Responsive • Protected
              </p>
            </div>
          </div>
        </section>

        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <span className="h-px w-8 bg-slate-400/50" />
          <span>© 2026 ডিজিটাল বিদ্যালয়</span>
          <span className="h-px w-8 bg-slate-400/50" />
        </div>
      </div>
    </main>
  );
}

// ==========================================
// ICONS
// ==========================================

function SchoolIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M7 12v4.2c0 .8 2.2 2.8 5 2.8s5-2 5-2.8V12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M21 9.5V15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect
        x="4"
        y="6"
        width="16"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m5 8 7 5 7-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function EyeOffIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M6.3 6.3C4.4 7.7 3 10 2.5 12c1 2 4.5 6 9.5 6 1.2 0 2.3-.2 3.3-.6M9.4 5.3A10 10 0 0 1 12 5c5 0 8.5 5 9.5 7-.5 1-1.4 2.4-2.8 3.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M5 12h14M14 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
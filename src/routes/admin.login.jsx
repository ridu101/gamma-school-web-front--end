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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 sm:px-6">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />

        <div className="absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />

        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl" />
      </div>

      {/* Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,118,110,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Branding */}
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-100 bg-white shadow-lg shadow-cyan-100/60">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 w-8 text-teal-600"
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
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-teal-600">
            Secure Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 shadow-2xl shadow-slate-200/70 backdrop-blur-xl">
          <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-500" />

          <div className="p-6 sm:p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                অ্যাডমিন লগইন
              </h1>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                ডিজিটাল বিদ্যালয় ম্যানেজমেন্ট
                সিস্টেমে প্রবেশ করুন
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  ই-মেইল
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                    >
                      <path
                        d="M4 6.5h16v11H4v-11Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />

                      <path
                        d="m5 8 7 5 7-5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  পাসওয়ার্ড
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />

                      <path
                        d="M8 10V7a4 4 0 0 1 8 0v3"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-teal-600"
                    aria-label={
                      showPassword
                        ? "পাসওয়ার্ড লুকান"
                        : "পাসওয়ার্ড দেখুন"
                    }
                  >
                    {showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5"
                      >
                        <path
                          d="M3 3l18 18"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />

                        <path
                          d="M10.6 10.6A2 2 0 0 0 13.4 13.4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />

                        <path
                          d="M9.3 5.3A10.5 10.5 0 0 1 12 5c5 0 8.5 4.2 9.5 6-0.5 1-1.8 2.8-3.8 4.2M6.1 6.1C4.2 7.4 3 9.2 2.5 11c1 1.8 4.5 6 9.5 6 1 0 2-.2 2.9-.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5"
                      >
                        <path
                          d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinejoin="round"
                        />

                        <circle
                          cx="12"
                          cy="12"
                          r="2.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Security Message */}
              <div className="flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-3.5 py-3">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 shrink-0 text-teal-600"
                >
                  <path
                    d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />

                  <path
                    d="m9 12 2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="text-xs leading-5 text-teal-700">
                  শুধুমাত্র অনুমোদিত অ্যাডমিন
                  অ্যাকাউন্ট ব্যবহার করুন
                </span>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                    লগইন হচ্ছে...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    লগইন করুন

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path
                        d="M5 12h14M14 7l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            <div className="mt-7 border-t border-slate-100 pt-5 text-center">
              <p className="text-xs text-slate-400">
                Digital School Administration System
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                Secure Access • Authorized Personnel Only
              </p>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[11px] text-slate-400">
          © 2026 ডিজিটাল বিদ্যালয়
        </p>
      </div>
    </main>
  );
}
import { useEffect, useState } from "react";

import {
  createFileRoute,
  useNavigate,
  Link,
} from "@tanstack/react-router";

import { apiRequest } from "../services/api";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

// ==========================================
// ENGLISH NUMBER → BANGLA NUMBER
// ==========================================

const toBanglaNumber = (number) => {
  const banglaDigits = [
    "০",
    "১",
    "২",
    "৩",
    "৪",
    "৫",
    "৬",
    "৭",
    "৮",
    "৯",
  ];

  return String(number).replace(
    /\d/g,
    (digit) => banglaDigits[digit]
  );
};

// ==========================================
// ADMIN DASHBOARD
// ==========================================

function AdminDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    teachers: 0,
    students: 0,
    results: 0,
    routines: 0,
  });

  // ==========================================
  // CHECK AUTH + LOAD DASHBOARD STATS
  // ==========================================

  useEffect(() => {
    async function checkAuth() {
      const token =
        window.localStorage.getItem("admin_token");

      if (!token) {
        navigate({
          to: "/admin/login",
          replace: true,
        });

        return;
      }

      try {
        const response =
          await apiRequest("/auth/me");

        setAdmin(response.data);

        try {
          const statsResponse =
            await apiRequest("/dashboard/stats");

          setStats({
            teachers:
              statsResponse.data?.teachers ?? 0,

            students:
              statsResponse.data?.students ?? 0,

            results:
              statsResponse.data?.results ?? 0,

            routines:
              statsResponse.data?.routines ?? 0,
          });
        } catch (statsError) {
          console.error(
            "Dashboard stats error:",
            statsError
          );
        }
      } catch (error) {
        console.error("Auth error:", error);

        window.localStorage.removeItem(
          "admin_token"
        );

        window.localStorage.removeItem(
          "admin_user"
        );

        navigate({
          to: "/admin/login",
          replace: true,
        });
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [navigate]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      window.localStorage.removeItem(
        "admin_token"
      );

      window.localStorage.removeItem(
        "admin_user"
      );

      navigate({
        to: "/admin/login",
        replace: true,
      });
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#dfe6eb]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(13,148,136,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(13,148,136,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />

          <p className="text-sm font-semibold text-slate-600">
            ড্যাশবোর্ড লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // STAT CARDS
  // ==========================================

  const statCards = [
    {
      label: "শিক্ষক",
      value: stats.teachers,
      icon: "teacher",
      accent: "blue",
    },
    {
      label: "শিক্ষার্থী",
      value: stats.students,
      icon: "student",
      accent: "emerald",
    },
    {
      label: "ফলাফল",
      value: stats.results,
      icon: "result",
      accent: "violet",
    },
    {
      label: "রুটিন",
      value: stats.routines,
      icon: "routine",
      accent: "orange",
    },
  ];

  // ==========================================
  // MANAGEMENT CARDS
  // ==========================================

  const managementCards = [
    {
      title: "শিক্ষক ব্যবস্থাপনা",
      description:
        "শিক্ষক যোগ, সম্পাদনা এবং মুছে ফেলুন।",
      to: "/admin/teachers",
      buttonText: "শিক্ষক পরিচালনা",
      accent: "blue",
      icon: "teacher",
    },
    {
      title: "শিক্ষার্থী ব্যবস্থাপনা",
      description:
        "শিক্ষার্থী যোগ, সম্পাদনা এবং মুছে ফেলুন।",
      to: "/admin/students",
      buttonText: "শিক্ষার্থী পরিচালনা",
      accent: "emerald",
      icon: "student",
    },
    {
      title: "ফলাফল ব্যবস্থাপনা",
      description:
        "শিক্ষার্থীদের ফলাফল যোগ, সম্পাদনা এবং মুছে ফেলুন।",
      to: "/admin/results",
      buttonText: "ফলাফল পরিচালনা",
      accent: "violet",
      icon: "result",
    },
    {
      title: "রুটিন ব্যবস্থাপনা",
      description:
        "শ্রেণির রুটিন যোগ, সম্পাদনা এবং মুছে ফেলুন।",
      to: "/admin/routines",
      buttonText: "রুটিন পরিচালনা",
      accent: "orange",
      icon: "routine",
    },
    {
      title: "নোটিশ ব্যবস্থাপনা",
      description:
        "বিদ্যালয়ের নোটিশ যোগ, সম্পাদনা এবং মুছে ফেলুন।",
      to: "/admin/notices",
      buttonText: "নোটিশ পরিচালনা",
      accent: "teal",
      icon: "notice",
    },
  ];

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#dfe6eb]">
      {/* ==========================================
          BACKGROUND
      ========================================== */}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundColor: "#dfe6eb",
          backgroundImage: `
            linear-gradient(rgba(13,148,136,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13,148,136,0.08) 1px, transparent 1px),
            linear-gradient(rgba(15,23,42,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.025) 1px, transparent 1px)
          `,
          backgroundSize:
            "40px 40px, 40px 40px, 200px 200px, 200px 200px",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-teal-200/35 via-cyan-100/20 to-transparent" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="relative z-20 border-b border-slate-300/80 bg-white/90 shadow-[0_5px_20px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          {/* Left */}

          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
              <div className="absolute inset-0 rounded-[17px] bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-600 shadow-lg shadow-teal-300/50" />

              <SchoolIcon className="relative z-10 h-6 w-6 text-white" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-teal-700 sm:text-xs">
                Admin Control Center
              </p>

              <h1 className="truncate text-lg font-extrabold text-slate-900 sm:text-xl">
                ডিজিটাল বিদ্যালয়
              </h1>
            </div>
          </div>

          {/* Right */}

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden text-right sm:block">
              <p className="max-w-[190px] truncate text-sm font-bold text-slate-800">
                {admin?.name}
              </p>

              <p className="max-w-[210px] truncate text-xs text-slate-500">
                {admin?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="group inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-100 hover:shadow-md sm:px-4"
            >
              <LogoutIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />

              <span className="hidden sm:inline">
                লগআউট
              </span>

              <span className="sm:hidden">
                বের হন
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        {/* ==========================================
            HERO
        ========================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-slate-300/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
          <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500" />

          <div className="relative p-5 sm:p-7 lg:p-8">
            {/* Decorative circles */}

            <div className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full border border-teal-100/80" />

            <div className="pointer-events-none absolute right-5 top-5 h-28 w-28 rounded-full border border-teal-100/70" />

            <div className="pointer-events-none absolute right-12 top-12 h-16 w-16 rounded-full border border-teal-100/60" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Hero text */}

              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />

                  Dashboard Overview
                </span>

                <h2 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  স্বাগতম,{" "}
                  <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                    {admin?.name}
                  </span>
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  এখান থেকে বিদ্যালয়ের শিক্ষক, শিক্ষার্থী,
                  ফলাফল, রুটিন এবং নোটিশ এক জায়গা থেকে
                  সহজে পরিচালনা করতে পারবেন।
                </p>
              </div>

              {/* Status */}

              <div className="w-full shrink-0 rounded-[22px] border border-teal-200/80 bg-gradient-to-br from-white to-teal-50/80 p-4 shadow-sm lg:w-auto lg:min-w-[220px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-teal-100 bg-white text-teal-700 shadow-sm">
                    <ShieldIcon className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      System Status
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-sm font-extrabold text-emerald-600">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      </span>

                      Online & Secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            STATS SECTION
        ========================================== */}

        <section className="mt-7">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-teal-700">
                Overview
              </p>

              <h3 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
                বিদ্যালয়ের সারসংক্ষেপ
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                বর্তমান সিস্টেমের গুরুত্বপূর্ণ তথ্য
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {statCards.map((item) => (
              <StatCard
                key={item.label}
                {...item}
                value={toBanglaNumber(item.value)}
              />
            ))}
          </div>
        </section>

        {/* ==========================================
            MANAGEMENT SECTION
        ========================================== */}

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-teal-700">
              Management
            </p>

            <h3 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
              ব্যবস্থাপনা বিভাগ
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              যেই বিভাগ পরিচালনা করতে চান সেটি নির্বাচন করুন।
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {managementCards.map((item) => (
              <ManagementCard
                key={item.title}
                {...item}
              />
            ))}
          </div>
        </section>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <footer className="mt-10 border-t border-slate-300/80 py-6 text-center">
          <p className="text-xs font-semibold text-slate-500">
            Digital School Administration System
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Secure • Responsive • Centralized
          </p>
        </footer>
      </main>
    </div>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  label,
  value,
  accent,
  icon,
}) {
  const styles = {
    blue: {
      icon:
        "border-blue-100 bg-blue-50 text-blue-700",
      number: "text-blue-700",
      line: "from-blue-500 to-cyan-500",
      badge:
        "bg-blue-50 text-blue-600 border-blue-100",
      hover: "hover:border-blue-300",
    },

    emerald: {
      icon:
        "border-emerald-100 bg-emerald-50 text-emerald-700",
      number: "text-emerald-700",
      line: "from-emerald-500 to-teal-500",
      badge:
        "bg-emerald-50 text-emerald-600 border-emerald-100",
      hover: "hover:border-emerald-300",
    },

    violet: {
      icon:
        "border-violet-100 bg-violet-50 text-violet-700",
      number: "text-violet-700",
      line: "from-violet-500 to-fuchsia-500",
      badge:
        "bg-violet-50 text-violet-600 border-violet-100",
      hover: "hover:border-violet-300",
    },

    orange: {
      icon:
        "border-orange-100 bg-orange-50 text-orange-700",
      number: "text-orange-700",
      line: "from-orange-500 to-amber-500",
      badge:
        "bg-orange-50 text-orange-600 border-orange-100",
      hover: "hover:border-orange-300",
    },
  };

  const current = styles[accent];

  return (
    <article
      className={`group relative overflow-hidden rounded-[24px] border border-slate-300/80 bg-white/95 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,0.14)] sm:p-5 ${current.hover}`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${current.line}`}
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${current.icon}`}
        >
          <DashboardIcon
            name={icon}
            className="h-5 w-5"
          />
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] ${current.badge}`}
        >
          Total
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold text-slate-500 sm:text-sm">
          {label}
        </p>

        <h4
          className={`mt-1 text-2xl font-black sm:text-3xl ${current.number}`}
        >
          {value}
        </h4>
      </div>
    </article>
  );
}

// ==========================================
// MANAGEMENT CARD
// ==========================================

function ManagementCard({
  title,
  description,
  to,
  buttonText,
  accent,
  icon,
}) {
  const styles = {
    blue: {
      icon:
        "border-blue-100 bg-blue-50 text-blue-700",
      button:
        "from-blue-600 to-cyan-600 shadow-blue-200/80",
      border: "hover:border-blue-300",
      small:
        "border-blue-100 bg-blue-50 text-blue-600",
    },

    emerald: {
      icon:
        "border-emerald-100 bg-emerald-50 text-emerald-700",
      button:
        "from-emerald-600 to-teal-600 shadow-emerald-200/80",
      border: "hover:border-emerald-300",
      small:
        "border-emerald-100 bg-emerald-50 text-emerald-600",
    },

    violet: {
      icon:
        "border-violet-100 bg-violet-50 text-violet-700",
      button:
        "from-violet-600 to-fuchsia-600 shadow-violet-200/80",
      border: "hover:border-violet-300",
      small:
        "border-violet-100 bg-violet-50 text-violet-600",
    },

    orange: {
      icon:
        "border-orange-100 bg-orange-50 text-orange-700",
      button:
        "from-orange-500 to-amber-500 shadow-orange-200/80",
      border: "hover:border-orange-300",
      small:
        "border-orange-100 bg-orange-50 text-orange-600",
    },

    teal: {
      icon:
        "border-teal-100 bg-teal-50 text-teal-700",
      button:
        "from-cyan-600 to-teal-600 shadow-teal-200/80",
      border: "hover:border-teal-300",
      small:
        "border-teal-100 bg-teal-50 text-teal-600",
    },
  };

  const current = styles[accent];

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-300/80 bg-white/95 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.14)] sm:p-6 ${current.border}`}
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[80px] bg-slate-50/80" />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${current.icon}`}
        >
          <DashboardIcon
            name={icon}
            className="h-6 w-6"
          />
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] ${current.small}`}
        >
          Manage
        </span>
      </div>

      <div className="relative mt-5 flex flex-1 flex-col">
        <h4 className="text-lg font-extrabold text-slate-900 sm:text-xl">
          {title}
        </h4>

        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
          {description}
        </p>

        <Link
          to={to}
          className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r px-4 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:w-fit ${current.button}`}
        >
          {buttonText}

          <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

// ==========================================
// SCHOOL ICON
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

// ==========================================
// LOGOUT ICON
// ==========================================

function LogoutIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M14 8l4 4-4 4M18 12H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ==========================================
// SHIELD ICON
// ==========================================

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
        strokeLinejoin="round"
      />

      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ==========================================
// ARROW ICON
// ==========================================

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

// ==========================================
// DASHBOARD ICONS
// ==========================================

function DashboardIcon({
  name,
  className = "",
}) {
  // Teacher
  if (name === "teacher") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
      >
        <circle
          cx="12"
          cy="8"
          r="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <path
          d="M6 20v-2a6 6 0 0 1 12 0v2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <path
          d="M18 5h3v6h-3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Student
  if (name === "student") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
      >
        <path
          d="M3 9 12 5l9 4-9 4-9-4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        <path
          d="M7 12v4c0 1 2.2 3 5 3s5-2 5-3v-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Result
  if (name === "result") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
      >
        <path
          d="M7 3h8l4 4v14H7V3Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        <path
          d="M15 3v5h4M10 12h6M10 16h6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Routine
  if (name === "routine") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
      >
        <rect
          x="4"
          y="5"
          width="16"
          height="15"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <path
          d="M8 3v4M16 3v4M4 9h16M8 13h3M13 13h3M8 17h3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Notice
  if (name === "notice") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
      >
        <path
          d="M6 4h12v16H6V4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        <path
          d="M9 8h6M9 12h6M9 16h4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return null;
}
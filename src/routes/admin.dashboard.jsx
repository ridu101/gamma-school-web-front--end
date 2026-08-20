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

// English number → Bangla number
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-500" />

          <p className="text-sm font-medium text-slate-500">
            ড্যাশবোর্ড লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* ==========================================
          BACKGROUND
      ========================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />

        <div className="absolute -right-24 top-52 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,118,110,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,0.05) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="relative z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-lg shadow-teal-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
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
              </svg>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
                Admin Portal
              </p>

              <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                ডিজিটাল বিদ্যালয়
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden text-right sm:block">
              <p className="max-w-[180px] truncate text-sm font-semibold text-slate-800">
                {admin?.name}
              </p>

              <p className="max-w-[180px] truncate text-xs text-slate-500">
                {admin?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-100 sm:px-4"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
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

              <span className="hidden xs:inline">
                লগআউট
              </span>

              <span className="xs:hidden">
                বের হন
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          CONTENT
      ========================================== */}

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        {/* Welcome Hero */}
        <section className="relative overflow-hidden rounded-[28px] border border-white bg-white/80 p-5 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-100/70 blur-3xl" />

          <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-teal-100/60 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                Dashboard Overview
              </div>

              <h2 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
                স্বাগতম,{" "}
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {admin?.name}
                </span>
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                এখান থেকে বিদ্যালয়ের শিক্ষক, শিক্ষার্থী,
                ফলাফল, রুটিন ও নোটিশ সহজেই পরিচালনা করতে
                পারবেন।
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 px-4 py-3 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
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
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  System Status
                </p>

                <p className="text-sm font-semibold text-emerald-600">
                  ● Online & Secure
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            STATS
        ========================================== */}

        <section className="mt-7">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
                Overview
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-900">
                বিদ্যালয়ের সারসংক্ষেপ
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
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
            MANAGEMENT
        ========================================== */}

        <section className="mt-9">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
              Management
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
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

        {/* Footer */}
        <div className="mt-10 border-t border-slate-200/80 pt-6 text-center">
          <p className="text-xs text-slate-400">
            Digital School Administration System
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Secure • Responsive • Centralized Management
          </p>
        </div>
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
      icon: "bg-blue-50 text-blue-600",
      number: "text-blue-600",
      glow: "bg-blue-100/70",
    },

    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      number: "text-emerald-600",
      glow: "bg-emerald-100/70",
    },

    violet: {
      icon: "bg-violet-50 text-violet-600",
      number: "text-violet-600",
      glow: "bg-violet-100/70",
    },

    orange: {
      icon: "bg-orange-50 text-orange-600",
      number: "text-orange-600",
      glow: "bg-orange-100/70",
    },
  };

  const current = styles[accent];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 sm:rounded-3xl sm:p-5">
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${current.glow}`}
      />

      <div className="relative">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${current.icon}`}
        >
          <DashboardIcon
            name={icon}
            className="h-5 w-5"
          />
        </div>

        <p className="mt-4 text-xs font-medium text-slate-500 sm:text-sm">
          {label}
        </p>

        <h4
          className={`mt-1 text-2xl font-bold sm:text-3xl ${current.number}`}
        >
          {value}
        </h4>
      </div>
    </div>
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
      icon: "bg-blue-50 text-blue-600",
      button:
        "bg-blue-600 hover:bg-blue-700 shadow-blue-100",
      border: "hover:border-blue-200",
    },

    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      button:
        "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100",
      border: "hover:border-emerald-200",
    },

    violet: {
      icon: "bg-violet-50 text-violet-600",
      button:
        "bg-violet-600 hover:bg-violet-700 shadow-violet-100",
      border: "hover:border-violet-200",
    },

    orange: {
      icon: "bg-orange-50 text-orange-600",
      button:
        "bg-orange-500 hover:bg-orange-600 shadow-orange-100",
      border: "hover:border-orange-200",
    },

    teal: {
      icon: "bg-teal-50 text-teal-600",
      button:
        "bg-teal-600 hover:bg-teal-700 shadow-teal-100",
      border: "hover:border-teal-200",
    },
  };

  const current = styles[accent];

  return (
    <div
      className={`group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 sm:p-6 ${current.border}`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${current.icon}`}
      >
        <DashboardIcon
          name={icon}
          className="h-6 w-6"
        />
      </div>

      <h4 className="mt-5 text-lg font-bold text-slate-900 sm:text-xl">
        {title}
      </h4>

      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <Link
        to={to}
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 sm:w-fit ${current.button}`}
      >
        {buttonText}

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
      </Link>
    </div>
  );
}

// ==========================================
// DASHBOARD ICONS
// ==========================================

function DashboardIcon({
  name,
  className = "",
}) {
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
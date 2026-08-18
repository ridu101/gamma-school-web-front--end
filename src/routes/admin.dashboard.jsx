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
        // Admin Information
        const response =
          await apiRequest("/auth/me");

        setAdmin(response.data);

        // Dashboard Stats
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
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">
          ড্যাশবোর্ড লোড হচ্ছে...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-sm text-slate-500">
              অ্যাডমিন প্যানেল
            </p>

            <h1 className="text-xl font-bold text-slate-900">
              ডিজিটাল বিদ্যালয়
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="font-semibold text-slate-900">
                {admin?.name}
              </p>

              <p className="text-xs text-slate-500">
                {admin?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              লগআউট
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          CONTENT
      ========================================== */}

      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* Welcome */}

        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            স্বাগতম, {admin?.name}
          </h2>

          <p className="mt-2 text-slate-500">
            এখান থেকে বিদ্যালয়ের তথ্য পরিচালনা করতে পারবেন।
          </p>
        </div>

        {/* ==========================================
            STATS
        ========================================== */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Teacher */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              শিক্ষক
            </p>

            <h3 className="mt-2 text-3xl font-bold text-blue-600">
              {toBanglaNumber(stats.teachers)}
            </h3>
          </div>

          {/* Student */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              শিক্ষার্থী
            </p>

            <h3 className="mt-2 text-3xl font-bold text-emerald-600">
              {toBanglaNumber(stats.students)}
            </h3>
          </div>

          {/* Result */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              ফলাফল
            </p>

            <h3 className="mt-2 text-3xl font-bold text-violet-600">
              {toBanglaNumber(stats.results)}
            </h3>
          </div>

          {/* Routine */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              রুটিন
            </p>

            <h3 className="mt-2 text-3xl font-bold text-orange-600">
              {toBanglaNumber(stats.routines)}
            </h3>
          </div>
        </div>

        {/* ==========================================
            MANAGEMENT
        ========================================== */}

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Teacher Management */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              শিক্ষক ব্যবস্থাপনা
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              শিক্ষক যোগ, সম্পাদনা এবং মুছে ফেলুন।
            </p>

            <Link
              to="/admin/teachers"
              className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              শিক্ষক পরিচালনা
            </Link>
          </div>

          {/* Student Management */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              শিক্ষার্থী ব্যবস্থাপনা
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              শিক্ষার্থী যোগ, সম্পাদনা এবং মুছে ফেলুন।
            </p>

            <Link
              to="/admin/students"
              className="mt-5 inline-block rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              শিক্ষার্থী পরিচালনা
            </Link>
          </div>

          {/* Result Management */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              ফলাফল ব্যবস্থাপনা
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              শিক্ষার্থীদের ফলাফল যোগ, সম্পাদনা এবং মুছে ফেলুন।
            </p>

            <Link
              to="/admin/results"
              className="mt-5 inline-block rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              ফলাফল পরিচালনা
            </Link>
          </div>

          {/* Routine Management */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              রুটিন ব্যবস্থাপনা
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              শ্রেণির রুটিন যোগ, সম্পাদনা এবং মুছে ফেলুন।
            </p>

            <Link
              to="/admin/routines"
              className="mt-5 inline-block rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              রুটিন পরিচালনা
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
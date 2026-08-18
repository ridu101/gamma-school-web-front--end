import { useEffect, useState } from "react";

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";

import { apiRequest } from "../services/api";
export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = window.localStorage.getItem("admin_token");

      if (!token) {
        navigate({
          to: "/admin/login",
          replace: true,
        });
        return;
      }

      try {
        const response = await apiRequest("/auth/me");

        setAdmin(response.data);
      } catch (error) {
        window.localStorage.removeItem("admin_token");
        window.localStorage.removeItem("admin_user");

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

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      window.localStorage.removeItem("admin_token");
      window.localStorage.removeItem("admin_user");

      navigate({
        to: "/admin/login",
        replace: true,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">ড্যাশবোর্ড লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-sm text-slate-500">Admin Panel</p>

            <h1 className="text-xl font-bold text-slate-900">ডিজিটাল বিদ্যালয়</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="font-semibold text-slate-900">{admin?.name}</p>

              <p className="text-xs text-slate-500">{admin?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              লগআউট
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">স্বাগতম, {admin?.name}</h2>

          <p className="mt-2 text-slate-500">এখান থেকে বিদ্যালয়ের তথ্য পরিচালনা করতে পারবেন।</p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">শিক্ষক</p>

            <h3 className="mt-2 text-3xl font-bold text-blue-600">—</h3>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">শিক্ষার্থী</p>

            <h3 className="mt-2 text-3xl font-bold text-emerald-600">—</h3>
          </div>
        </div>

        {/* Management */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Teacher Management */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">শিক্ষক ব্যবস্থাপনা</h3>

            <p className="mt-2 text-sm text-slate-500">শিক্ষক যোগ, edit এবং delete করুন।</p>

            <Link
              to="/admin/teachers"
              className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              শিক্ষক পরিচালনা
            </Link>
          </div>

          {/* Student Management */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">শিক্ষার্থী ব্যবস্থাপনা</h3>

            <p className="mt-2 text-sm text-slate-500">শিক্ষার্থী যোগ, edit এবং delete করুন।</p>

            <Link
              to="/admin/students"
              className="mt-5 inline-block rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              শিক্ষার্থী পরিচালনা
            </Link>
          </div>
          {/* Result Management */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">ফলাফল ব্যবস্থাপনা</h3>

              <p className="mt-2 text-sm text-slate-500">
                শিক্ষার্থীদের ফলাফল যোগ, edit এবং delete করুন।
              </p>

              <Link
                to="/admin/results"
                className="mt-5 inline-block rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
              >
                ফলাফল পরিচালনা
              </Link>
            </div>
        </div>
      </main>
    </div>
  );
}

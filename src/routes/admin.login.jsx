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

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("password");
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
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl text-white">
            🎓
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            অ্যাডমিন লগইন
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            ডিজিটাল বিদ্যালয় ম্যানেজমেন্ট সিস্টেম
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              ই-মেইল
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="admin@gmail.com"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              পাসওয়ার্ড
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "লগইন হচ্ছে..."
              : "লগইন করুন"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          শুধুমাত্র অনুমোদিত অ্যাডমিনদের জন্য
        </p>
      </div>
    </main>
  );
}
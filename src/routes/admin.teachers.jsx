import { useEffect, useState } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import { apiRequest } from "../services/api";

export const Route = createFileRoute("/admin/teachers")({
  component: AdminTeachers,
});

const emptyForm = {
  name: "",
  designation: "",
  department: "",
  email: "",
  phone: "",
  bio: "",
  is_active: true,
};

function AdminTeachers() {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =============================
  // Authentication + Teachers
  // =============================
  useEffect(() => {
    async function initializePage() {
      const token = window.localStorage.getItem("admin_token");

      if (!token) {
        navigate({
          to: "/admin/login",
          replace: true,
        });

        return;
      }

      try {
        // Admin token verify
        await apiRequest("/auth/me");

        // Teacher list
        const response = await apiRequest("/teachers");

        setTeachers(response.data || []);
      } catch (error) {
        console.error(error);

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

    initializePage();
  }, [navigate]);

  // =============================
  // Reload Teachers
  // =============================
  const loadTeachers = async () => {
    try {
      const response = await apiRequest("/teachers");

      setTeachers(response.data || []);
    } catch (error) {
      setError(error.message);
    }
  };

  // =============================
  // Input Change
  // =============================
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =============================
  // Add / Update Teacher
  // =============================
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const teacherData = {
        name: form.name,
        designation: form.designation || null,
        department: form.department || null,
        email: form.email || null,
        phone: form.phone || null,
        bio: form.bio || null,
        photo: null,
        is_active: form.is_active,
      };

      if (editingId) {
        await apiRequest(`/teachers/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(teacherData),
        });

        setSuccess("শিক্ষকের তথ্য সফলভাবে আপডেট হয়েছে।");
      } else {
        await apiRequest("/teachers", {
          method: "POST",
          body: JSON.stringify(teacherData),
        });

        setSuccess("নতুন শিক্ষক সফলভাবে যোগ হয়েছে।");
      }

      setForm(emptyForm);
      setEditingId(null);

      await loadTeachers();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =============================
  // Edit Teacher
  // =============================
  const handleEdit = (teacher) => {
    setEditingId(teacher.id);

    setForm({
      name: teacher.name || "",
      designation: teacher.designation || "",
      department: teacher.department || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      bio: teacher.bio || "",
      is_active: Boolean(teacher.is_active),
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =============================
  // Cancel Edit
  // =============================
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
  };

  // =============================
  // Delete Teacher
  // =============================
  const handleDelete = async (teacher) => {
    const confirmed = window.confirm(
      `${teacher.name} কে delete করতে চান?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await apiRequest(`/teachers/${teacher.id}`, {
        method: "DELETE",
      });

      setSuccess("শিক্ষক সফলভাবে delete হয়েছে।");

      if (editingId === teacher.id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      await loadTeachers();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">
          শিক্ষকদের তথ্য লোড হচ্ছে...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-sm text-slate-500">
              Admin Panel
            </p>

            <h1 className="text-xl font-bold text-slate-900">
              শিক্ষক ব্যবস্থাপনা
            </h1>
          </div>

          <Link
            to="/admin/dashboard"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Heading */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            শিক্ষক পরিচালনা
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            এখান থেকে শিক্ষক যোগ, edit এবং delete করতে পারবেন।
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Form */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">
              {editingId
                ? "শিক্ষকের তথ্য Edit করুন"
                : "নতুন শিক্ষক যোগ করুন"}
            </h3>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-sm font-semibold text-red-500"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                শিক্ষকের নাম *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="যেমন: Mohammad Rahman"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                পদবী
              </label>

              <input
                type="text"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="যেমন: Senior Lecturer"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Department */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                বিভাগ
              </label>

              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="যেমন: Computer Science"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="teacher@gmail.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="017XXXXXXXX"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>

              <label className="flex h-[50px] items-center gap-3 rounded-xl border border-slate-300 px-4">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                <span className="text-sm text-slate-700">
                  Active Teacher
                </span>
              </label>
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Bio
              </label>

              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows="4"
                placeholder="শিক্ষক সম্পর্কে সংক্ষিপ্ত তথ্য..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Teacher"
                    : "Add Teacher"}
              </button>
            </div>
          </form>
        </section>

        {/* Teacher List */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                শিক্ষক তালিকা
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                মোট শিক্ষক: {teachers.length}
              </p>
            </div>
          </div>

          {teachers.length === 0 ? (
            <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center text-slate-500">
              কোনো শিক্ষক পাওয়া যায়নি।
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-4 py-3 text-sm font-semibold">
                      #
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      নাম
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      পদবী
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      বিভাগ
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Email
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {teachers.map((teacher, index) => (
                    <tr
                      key={teacher.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-4 py-4 text-sm">
                        {index + 1}
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-900">
                          {teacher.name}
                        </p>

                        {teacher.phone && (
                          <p className="mt-1 text-xs text-slate-500">
                            {teacher.phone}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {teacher.designation || "—"}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {teacher.department || "—"}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {teacher.email || "—"}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            teacher.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {teacher.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(teacher)
                            }
                            className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-200"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(teacher)
                            }
                            className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { useEffect, useState } from "react";
import { apiRequest } from "@/services/api";

export const Route = createFileRoute("/admin/routines")({
  component: AdminRoutines,
});

const emptyForm = {
  class_name: "",
  day: "",
  time: "",
  subject: "",
  teacher: "",
  room: "",
  sort_order: 0,
  is_active: true,
};

function AdminRoutines() {
  const navigate = useNavigate();

  const [routines, setRoutines] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD ROUTINES
  // ==========================================

  const loadRoutines = async () => {
    try {
      const response = await apiRequest("/routines");

      setRoutines(response.data || []);
    } catch (error) {
      console.error(error);

      setError("Routine load করা যায়নি।");
    }
  };

  // ==========================================
  // CHECK ADMIN AUTH
  // ==========================================

  useEffect(() => {
    async function start() {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        navigate({
          to: "/admin/login",
        });

        return;
      }

      try {
        await apiRequest("/auth/me");

        await loadRoutines();
      } catch (error) {
        console.error(error);

        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");

        navigate({
          to: "/admin/login",
        });
      } finally {
        setLoading(false);
      }
    }

    start();
  }, [navigate]);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]: type === "checkbox" ? checked : name === "sort_order" ? Number(value) : value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  // ==========================================
  // ADD / UPDATE ROUTINE
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.class_name.trim() ||
      !form.day.trim() ||
      !form.time.trim() ||
      !form.subject.trim() ||
      !form.teacher.trim()
    ) {
      setError("Class, Day, Time, Subject এবং Teacher অবশ্যই দিতে হবে।");

      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await apiRequest(`/routines/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });

        setSuccess("Routine successfully updated.");
      } else {
        await apiRequest("/routines", {
          method: "POST",
          body: JSON.stringify(form),
        });

        setSuccess("Routine successfully added.");
      }

      setForm(emptyForm);
      setEditingId(null);

      await loadRoutines();
    } catch (error) {
      console.error(error);

      setError(error.message || "Routine save করা যায়নি।");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT ROUTINE
  // ==========================================

  const handleEdit = (routine) => {
    setEditingId(routine.id);

    setForm({
      class_name: routine.class_name || "",

      day: routine.day || "",

      time: routine.time || "",

      subject: routine.subject || "",

      teacher: routine.teacher || "",

      room: routine.room || "",

      sort_order: routine.sort_order || 0,

      is_active: Boolean(routine.is_active),
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE ROUTINE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm("এই routine delete করতে চান?");

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await apiRequest(`/routines/${id}`, {
        method: "DELETE",
      });

      setSuccess("Routine successfully deleted.");

      await loadRoutines();
    } catch (error) {
      console.error(error);

      setError(error.message || "Routine delete করা যায়নি।");
    }
  };

  // ==========================================
  // PAGE LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">রুটিনের তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Routine Management</h1>

            <p className="mt-1 text-sm text-slate-500">Add, edit and manage class routines</p>
          </div>

          <Link
            to="/admin/dashboard"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* ==========================================
          CONTENT
      ========================================== */}

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {/* ==========================================
            FORM
        ========================================== */}

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? "Edit Routine" : "Add Routine"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">Class routine information</p>
          </div>

          {/* Error */}

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Class */}

            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Class *</span>

              <input
                type="text"
                name="class_name"
                value={form.class_name}
                onChange={handleChange}
                placeholder="10"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            {/* Day */}

            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Day *</span>

              <select
                name="day"
                value={form.day}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select Day</option>

                <option value="Sunday">Sunday</option>

                <option value="Monday">Monday</option>

                <option value="Tuesday">Tuesday</option>

                <option value="Wednesday">Wednesday</option>

                <option value="Thursday">Thursday</option>
              </select>
            </label>

            {/* Time */}

            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Time *</span>

              <input
                type="text"
                name="time"
                value={form.time}
                onChange={handleChange}
                placeholder="10:00 AM - 10:45 AM"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            {/* Subject */}

            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Subject *</span>

              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Bangla"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            {/* Teacher */}

            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Teacher *</span>

              <input
                type="text"
                name="teacher"
                value={form.teacher}
                onChange={handleChange}
                placeholder="Md. Karim"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            {/* Room */}

            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Room</span>

              <input
                type="text"
                name="room"
                value={form.room}
                onChange={handleChange}
                placeholder="Room 201"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            {/* Sort Order */}

            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Sort Order</span>

              <input
                type="number"
                min="0"
                name="sort_order"
                value={form.sort_order}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            {/* Active */}

            <label className="flex items-center gap-3 pt-7">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="h-5 w-5 accent-blue-600"
              />

              <span className="text-sm font-semibold text-slate-700">Active Routine</span>
            </label>

            {/* Buttons */}

            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}

                {saving ? "Saving..." : editingId ? "Update Routine" : "Add Routine"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ==========================================
            ROUTINE LIST
        ========================================== */}

        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-5 py-4">
            <h2 className="font-bold text-slate-900">Routine List</h2>

            <p className="mt-1 text-sm text-slate-500">Total: {routines.length}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="bg-slate-100 text-left text-slate-600">
                  <th className="px-4 py-3">Class</th>

                  <th className="px-4 py-3">Day</th>

                  <th className="px-4 py-3">Time</th>

                  <th className="px-4 py-3">Subject</th>

                  <th className="px-4 py-3">Teacher</th>

                  <th className="px-4 py-3">Room</th>

                  <th className="px-4 py-3">Order</th>

                  <th className="px-4 py-3">Status</th>

                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {routines.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-12 text-center text-slate-500">
                      কোনো Routine পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  routines.map((routine) => (
                    <tr key={routine.id} className="border-t transition hover:bg-slate-50">
                      {/* Class */}

                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {routine.class_name}
                      </td>

                      {/* Day */}

                      <td className="px-4 py-3 text-slate-600">{routine.day}</td>

                      {/* Time */}

                      <td className="px-4 py-3 text-slate-600">{routine.time}</td>

                      {/* Subject */}

                      <td className="px-4 py-3 font-medium text-slate-800">{routine.subject}</td>

                      {/* Teacher */}

                      <td className="px-4 py-3 text-slate-600">{routine.teacher}</td>

                      {/* Room */}

                      <td className="px-4 py-3 text-slate-600">{routine.room || "—"}</td>

                      {/* Order */}

                      <td className="px-4 py-3 text-slate-600">{routine.sort_order}</td>

                      {/* Status */}

                      <td className="px-4 py-3">
                        <span
                          className={
                            routine.is_active
                              ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700"
                              : "rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700"
                          }
                        >
                          {routine.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}

                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(routine)}
                            className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-200"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(routine.id)}
                            className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

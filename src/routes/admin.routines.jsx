import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

// ==========================================
// ADMIN ROUTINES
// ==========================================

function AdminRoutines() {
  const navigate = useNavigate();

  const [routines, setRoutines] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // ==========================================
  // LOAD ROUTINES
  // ==========================================

  const loadRoutines = async () => {
    try {
      const response =
        await apiRequest("/routines");

      setRoutines(
        response.data || []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "রুটিনের তথ্য লোড করা যায়নি।"
      );
    }
  };

  // ==========================================
  // CHECK ADMIN AUTH
  // ==========================================

  useEffect(() => {
    async function start() {
      const token =
        localStorage.getItem(
          "admin_token"
        );

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

        localStorage.removeItem(
          "admin_token"
        );

        localStorage.removeItem(
          "admin_user"
        );

        toast.error(
          "আপনার সেশন শেষ হয়েছে। আবার লগইন করুন।"
        );

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
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : name === "sort_order"
            ? Number(value)
            : value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm(emptyForm);

    setEditingId(null);
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancelEdit = () => {
    resetForm();

    toast(
      "Edit বাতিল করা হয়েছে।",
      {
        icon: "↩️",
      }
    );
  };

  // ==========================================
  // ADD / UPDATE ROUTINE
  // ==========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !form.class_name.trim() ||
      !form.day.trim() ||
      !form.time.trim() ||
      !form.subject.trim() ||
      !form.teacher.trim()
    ) {
      toast.error(
        "Class, Day, Time, Subject এবং Teacher অবশ্যই দিতে হবে।"
      );

      return;
    }

    const toastId =
      toast.loading(
        editingId
          ? "রুটিন আপডেট করা হচ্ছে..."
          : "নতুন রুটিন যোগ করা হচ্ছে..."
      );

    try {
      setSaving(true);

      // ======================================
      // UPDATE
      // ======================================

      if (editingId) {
        await apiRequest(
          `/routines/${editingId}`,
          {
            method: "PUT",

            body:
              JSON.stringify(form),
          }
        );

        toast.success(
          "রুটিন সফলভাবে আপডেট হয়েছে।",
          {
            id: toastId,
          }
        );
      }

      // ======================================
      // CREATE
      // ======================================

      else {
        await apiRequest(
          "/routines",
          {
            method: "POST",

            body:
              JSON.stringify(form),
          }
        );

        toast.success(
          "নতুন রুটিন সফলভাবে যোগ হয়েছে।",
          {
            id: toastId,
          }
        );
      }

      resetForm();

      await loadRoutines();
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "রুটিনের তথ্য সংরক্ষণ করা যায়নি।",
        {
          id: toastId,
        }
      );
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
      class_name:
        routine.class_name || "",

      day:
        routine.day || "",

      time:
        routine.time || "",

      subject:
        routine.subject || "",

      teacher:
        routine.teacher || "",

      room:
        routine.room || "",

      sort_order:
        routine.sort_order || 0,

      is_active:
        Boolean(
          routine.is_active
        ),
    });

    toast(
      "রুটিন Edit Mode-এ খোলা হয়েছে।",
      {
        icon: "✏️",
      }
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE ROUTINE
  // ==========================================

  const deleteRoutine = async (
    routine
  ) => {
    const toastId =
      toast.loading(
        "রুটিন মুছে ফেলা হচ্ছে..."
      );

    try {
      await apiRequest(
        `/routines/${routine.id}`,
        {
          method: "DELETE",
        }
      );

      if (
        editingId === routine.id
      ) {
        resetForm();
      }

      await loadRoutines();

      toast.success(
        "রুটিন সফলভাবে মুছে ফেলা হয়েছে।",
        {
          id: toastId,
        }
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "রুটিন মুছে ফেলা যায়নি।",
        {
          id: toastId,
        }
      );
    }
  };

  // ==========================================
  // DELETE CONFIRMATION
  // ==========================================

  const handleDelete = (routine) => {
    toast.custom(
      (t) => (
        <div
          className={`w-[calc(100vw-32px)] max-w-[390px] rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.22)] ${
            t.visible
              ? "animate-enter"
              : "animate-leave"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600">
              <TrashIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-900">
                রুটিন মুছে ফেলবেন?
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Class{" "}
                <span className="font-bold text-slate-700">
                  {routine.class_name}
                </span>{" "}
                এর{" "}
                <span className="font-bold text-slate-700">
                  {routine.day}
                </span>{" "}
                দিনের
                {routine.subject
                  ? ` ${routine.subject}`
                  : ""}{" "}
                রুটিন স্থায়ীভাবে মুছে যাবে।
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() =>
                toast.dismiss(t.id)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
            >
              বাতিল
            </button>

            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);

                deleteRoutine(
                  routine
                );
              }}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-700"
            >
              মুছে ফেলুন
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      }
    );
  };

  // ==========================================
  // PAGE LOADING
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
            backgroundSize:
              "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

          <p className="text-sm font-semibold text-slate-600">
            রুটিনের তথ্য লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

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

      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-orange-100/50 via-teal-100/20 to-transparent" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="relative z-20 border-b border-slate-300/80 bg-white/90 shadow-[0_5px_20px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          {/* Left */}

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] bg-gradient-to-br from-orange-500 via-amber-500 to-teal-600 text-white shadow-lg shadow-orange-300/40">
              <RoutineIcon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-orange-700 sm:text-xs">
                Admin Management
              </p>

              <h1 className="truncate text-lg font-extrabold text-slate-900 sm:text-xl">
                রুটিন ব্যবস্থাপনা
              </h1>
            </div>
          </div>

          {/* Dashboard */}

          <Link
            to="/admin/dashboard"
            className="group inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2.5 text-sm font-bold text-teal-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-teal-100 hover:shadow-md sm:px-4"
          >
            <DashboardIcon className="h-4 w-4" />

            <span className="hidden sm:inline">
              Dashboard
            </span>

            <span className="sm:hidden">
              Home
            </span>
          </Link>
        </div>
      </header>

      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {/* ==========================================
            FORM
        ========================================== */}

        <section className="overflow-hidden rounded-[30px] border border-slate-300/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
          {/* Gradient */}

          <div className="h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500" />

          {/* Header */}

          <div className="border-b border-slate-200 bg-gradient-to-r from-orange-50/60 via-white to-teal-50/70 px-5 py-5 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-100 bg-white text-orange-600 shadow-sm">
                  {editingId ? (
                    <EditIcon className="h-5 w-5" />
                  ) : (
                    <PlusIcon className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-600">
                    Routine Form
                  </p>

                  <h2 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                    {editingId
                      ? "রুটিন Edit করুন"
                      : "নতুন রুটিন যোগ করুন"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    ক্লাসের সময়সূচি,
                    শিক্ষক ও বিষয়ের তথ্য
                    পরিচালনা করুন।
                  </p>

                  {editingId && (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />

                      Edit Mode Active
                    </div>
                  )}
                </div>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={
                    handleCancelEdit
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100"
                >
                  <CloseIcon className="h-4 w-4" />

                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          {/* Form Body */}

          <div className="p-5 sm:p-6 lg:p-7">
            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-6"
            >
              {/* Main Fields */}

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {/* Class */}

                <Field
                  label="Class"
                  required
                >
                  <input
                    type="text"
                    name="class_name"
                    value={
                      form.class_name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="10"
                    className={inputClass}
                  />
                </Field>

                {/* Day */}

                <Field
                  label="Day"
                  required
                >
                  <select
                    name="day"
                    value={form.day}
                    onChange={
                      handleChange
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Select Day
                    </option>

                    <option value="Sunday">
                      Sunday
                    </option>

                    <option value="Monday">
                      Monday
                    </option>

                    <option value="Tuesday">
                      Tuesday
                    </option>

                    <option value="Wednesday">
                      Wednesday
                    </option>

                    <option value="Thursday">
                      Thursday
                    </option>
                  </select>
                </Field>

                {/* Time */}

                <Field
                  label="Time"
                  required
                >
                  <input
                    type="text"
                    name="time"
                    value={form.time}
                    onChange={
                      handleChange
                    }
                    placeholder="10:00 AM - 10:45 AM"
                    className={inputClass}
                  />
                </Field>

                {/* Subject */}

                <Field
                  label="Subject"
                  required
                >
                  <input
                    type="text"
                    name="subject"
                    value={
                      form.subject
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Bangla"
                    className={inputClass}
                  />
                </Field>

                {/* Teacher */}

                <Field
                  label="Teacher"
                  required
                >
                  <input
                    type="text"
                    name="teacher"
                    value={
                      form.teacher
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Md. Karim"
                    className={inputClass}
                  />
                </Field>

                {/* Room */}

                <Field label="Room">
                  <input
                    type="text"
                    name="room"
                    value={form.room}
                    onChange={
                      handleChange
                    }
                    placeholder="Room 201"
                    className={inputClass}
                  />
                </Field>

                {/* Sort Order */}

                <Field label="Sort Order">
                  <input
                    type="number"
                    min="0"
                    name="sort_order"
                    value={
                      form.sort_order
                    }
                    onChange={
                      handleChange
                    }
                    className={inputClass}
                  />
                </Field>

                {/* Active */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Status
                  </label>

                  <div className="flex min-h-[52px] items-center justify-between rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4">
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Active Routine
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        রুটিনটি active
                        থাকবে কি না
                      </p>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={
                          form.is_active
                        }
                        onChange={
                          handleChange
                        }
                        className="peer sr-only"
                      />

                      <div className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-emerald-600 peer-focus:ring-4 peer-focus:ring-emerald-100 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:after:translate-x-5" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Status Badge */}

              <div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
                    form.is_active
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      form.is_active
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }`}
                  />

                  {form.is_active
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>

              {/* Buttons */}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-teal-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(245,158,11,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(245,158,11,0.30)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                      Saving...
                    </>
                  ) : editingId ? (
                    <>
                      <EditIcon className="h-4 w-4" />

                      Update Routine
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4" />

                      Add Routine
                    </>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={
                      handleCancelEdit
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 sm:w-auto"
                  >
                    <CloseIcon className="h-4 w-4" />

                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* ==========================================
            ROUTINE LIST
        ========================================== */}

        <section className="mt-6 overflow-hidden rounded-[30px] border border-slate-300/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.11)] backdrop-blur-xl">
          {/* Header */}

          <div className="border-b border-slate-200 bg-gradient-to-r from-orange-50/60 via-white to-teal-50/70 px-5 py-5 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-100 bg-white text-orange-600 shadow-sm">
                  <ListIcon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-600">
                    Routine Directory
                  </p>

                  <h2 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                    রুটিন তালিকা
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    মোট রুটিন:{" "}
                    <span className="font-extrabold text-orange-600">
                      {routines.length}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  loadRoutines
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100"
              >
                <RefreshIcon className="h-4 w-4" />

                Refresh
              </button>
            </div>
          </div>

          {/* Content */}

          <div className="p-4 sm:p-5">
            {routines.length === 0 ? (
              <div className="flex min-h-[230px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-slate-200 bg-slate-50 text-slate-400">
                  <RoutineIcon className="h-8 w-8" />
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-slate-700">
                  কোনো Routine পাওয়া যায়নি
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  নতুন রুটিন যোগ করলে
                  এখানে দেখা যাবে।
                </p>
              </div>
            ) : (
              <>
                {/* ==================================
                    MOBILE CARDS
                ================================== */}

                <div className="grid gap-4 md:hidden">
                  {routines.map(
                    (routine) => (
                      <article
                        key={routine.id}
                        className="relative overflow-hidden rounded-[24px] border border-slate-300 bg-white p-5 shadow-sm"
                      >
                        <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-orange-500 via-amber-500 to-teal-500" />

                        {/* Top */}

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-orange-600">
                              Class Routine
                            </p>

                            <h3 className="mt-1 text-xl font-extrabold text-slate-900">
                              Class{" "}
                              {
                                routine.class_name
                              }
                            </h3>

                            <p className="mt-1 text-sm font-semibold text-slate-500">
                              {
                                routine.subject
                              }
                            </p>
                          </div>

                          <StatusBadge
                            active={
                              routine.is_active
                            }
                          />
                        </div>

                        {/* Info */}

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <RoutineInfo
                            label="Day"
                            value={
                              routine.day ||
                              "—"
                            }
                          />

                          <RoutineInfo
                            label="Time"
                            value={
                              routine.time ||
                              "—"
                            }
                          />

                          <RoutineInfo
                            label="Teacher"
                            value={
                              routine.teacher ||
                              "—"
                            }
                          />

                          <RoutineInfo
                            label="Room"
                            value={
                              routine.room ||
                              "—"
                            }
                          />

                          <RoutineInfo
                            label="Sort Order"
                            value={
                              routine.sort_order ??
                              "0"
                            }
                            wide
                          />
                        </div>

                        {/* Actions */}

                        <div className="mt-4 flex gap-2 border-t border-slate-200 pt-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                routine
                              )
                            }
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                          >
                            <EditIcon className="h-4 w-4" />

                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                routine
                              )
                            }
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                          >
                            <TrashIcon className="h-4 w-4" />

                            Delete
                          </button>
                        </div>
                      </article>
                    )
                  )}
                </div>

                {/* ==================================
                    DESKTOP TABLE
                ================================== */}

                <div className="hidden overflow-x-auto rounded-[22px] border border-slate-200 md:block">
                  <table className="w-full min-w-[1000px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-orange-50/50 text-left">
                        <TableHeading>
                          Class
                        </TableHeading>

                        <TableHeading>
                          Day
                        </TableHeading>

                        <TableHeading>
                          Time
                        </TableHeading>

                        <TableHeading>
                          Subject
                        </TableHeading>

                        <TableHeading>
                          Teacher
                        </TableHeading>

                        <TableHeading>
                          Room
                        </TableHeading>

                        <TableHeading>
                          Order
                        </TableHeading>

                        <TableHeading>
                          Status
                        </TableHeading>

                        <TableHeading>
                          Action
                        </TableHeading>
                      </tr>
                    </thead>

                    <tbody>
                      {routines.map(
                        (routine) => (
                          <tr
                            key={
                              routine.id
                            }
                            className="border-b border-slate-100 transition last:border-0 hover:bg-orange-50/30"
                          >
                            {/* Class */}

                            <td className="px-4 py-4">
                              <span className="inline-flex rounded-xl border border-orange-100 bg-orange-50 px-3 py-2 text-sm font-extrabold text-orange-700">
                                Class{" "}
                                {
                                  routine.class_name
                                }
                              </span>
                            </td>

                            {/* Day */}

                            <td className="px-4 py-4 font-semibold text-slate-600">
                              {
                                routine.day
                              }
                            </td>

                            {/* Time */}

                            <td className="px-4 py-4">
                              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                                <ClockIcon className="h-4 w-4 text-teal-600" />

                                {
                                  routine.time
                                }
                              </div>
                            </td>

                            {/* Subject */}

                            <td className="px-4 py-4 font-extrabold text-slate-800">
                              {
                                routine.subject
                              }
                            </td>

                            {/* Teacher */}

                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                                  <TeacherIcon className="h-4 w-4" />
                                </div>

                                <span className="font-semibold text-slate-600">
                                  {
                                    routine.teacher
                                  }
                                </span>
                              </div>
                            </td>

                            {/* Room */}

                            <td className="px-4 py-4 font-semibold text-slate-600">
                              {routine.room ||
                                "—"}
                            </td>

                            {/* Order */}

                            <td className="px-4 py-4">
                              <span className="inline-flex min-w-[38px] justify-center rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-extrabold text-slate-600">
                                {
                                  routine.sort_order
                                }
                              </span>
                            </td>

                            {/* Status */}

                            <td className="px-4 py-4">
                              <StatusBadge
                                active={
                                  routine.is_active
                                }
                              />
                            </td>

                            {/* Action */}

                            <td className="px-4 py-4">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(
                                      routine
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                                >
                                  <EditIcon className="h-3.5 w-3.5" />

                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      routine
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                                >
                                  <TrashIcon className="h-3.5 w-3.5" />

                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <footer className="mt-9 border-t border-slate-300/80 py-6 text-center">
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
// INPUT CLASS
// ==========================================

const inputClass =
  "w-full rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100";

// ==========================================
// FIELD
// ==========================================

function Field({
  label,
  required = false,
  children,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-600"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          active
            ? "bg-emerald-500"
            : "bg-red-500"
        }`}
      />

      {active
        ? "Active"
        : "Inactive"}
    </span>
  );
}

// ==========================================
// MOBILE ROUTINE INFO
// ==========================================

function RoutineInfo({
  label,
  value,
  wide = false,
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-slate-50 p-3 ${
        wide
          ? "col-span-2"
          : ""
      }`}
    >
      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-extrabold text-slate-700">
        {value}
      </p>
    </div>
  );
}

// ==========================================
// TABLE HEADING
// ==========================================

function TableHeading({ children }) {
  return (
    <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
      {children}
    </th>
  );
}

// ==========================================
// ROUTINE ICON
// ==========================================

function RoutineIcon({
  className = "",
}) {
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
        d="M8 3v4M16 3v4M4 9h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M8 13h3M13 13h3M8 17h3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ==========================================
// DASHBOARD ICON
// ==========================================

function DashboardIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect
        x="4"
        y="4"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="14"
        y="4"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="4"
        y="14"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="14"
        y="14"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

// ==========================================
// PLUS ICON
// ==========================================

function PlusIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ==========================================
// EDIT ICON
// ==========================================

function EditIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="m14 5 5 5M4 20l3.5-.8L19 7.7a2 2 0 0 0-2.8-2.8L4.8 16.3 4 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ==========================================
// TRASH ICON
// ==========================================

function TrashIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M5 7h14M9 7V4h6v3M8 10v7M12 10v7M16 10v7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="m7 7 .8 13h8.4L17 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ==========================================
// CLOSE ICON
// ==========================================

function CloseIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ==========================================
// LIST ICON
// ==========================================

function ListIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M9 6h11M9 12h11M9 18h11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="5"
        cy="6"
        r="1"
        fill="currentColor"
      />

      <circle
        cx="5"
        cy="12"
        r="1"
        fill="currentColor"
      />

      <circle
        cx="5"
        cy="18"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

// ==========================================
// REFRESH ICON
// ==========================================

function RefreshIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M20 7v5h-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M18.5 9A7 7 0 1 0 19 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ==========================================
// CLOCK ICON
// ==========================================

function ClockIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M12 8v4l3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ==========================================
// TEACHER ICON
// ==========================================

function TeacherIcon({
  className = "",
}) {
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
    </svg>
  );
}
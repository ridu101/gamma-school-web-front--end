import { useEffect, useState } from "react";

import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import toast from "react-hot-toast";

import { apiRequest } from "../services/api";

export const Route = createFileRoute("/admin/students")({
  component: AdminStudents,
});

// ==========================================
// EMPTY FORM
// ==========================================

const emptyForm = {
  student_id: "",
  name: "",
  email: "",
  phone: "",
  father_name: "",
  mother_name: "",
  class: "",
  section: "",
  roll: "",
  date_of_birth: "",
  address: "",
  status: true,
};

// ==========================================
// INPUT STYLE
// ==========================================

const inputClass =
  "w-full rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100";

// ==========================================
// ADMIN STUDENTS
// ==========================================

function AdminStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // ==========================================
  // AUTH + LOAD STUDENTS
  // ==========================================

  useEffect(() => {
    async function initializePage() {
      const token =
        window.localStorage.getItem(
          "admin_token"
        );

      if (!token) {
        navigate({
          to: "/admin/login",
          replace: true,
        });

        return;
      }

      try {
        // Verify Admin
        await apiRequest("/auth/me");

        // Get Students
        const response =
          await apiRequest("/students");

        setStudents(
          response.data || []
        );
      } catch (error) {
        console.error(
          "Student page error:",
          error
        );

        window.localStorage.removeItem(
          "admin_token"
        );

        window.localStorage.removeItem(
          "admin_user"
        );

        toast.error(
          "আপনার সেশন শেষ হয়েছে। আবার লগইন করুন।"
        );

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

  // ==========================================
  // RELOAD STUDENTS
  // ==========================================

  const loadStudents = async () => {
    try {
      const response =
        await apiRequest("/students");

      setStudents(
        response.data || []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "শিক্ষার্থীদের তথ্য লোড করা যায়নি।"
      );
    }
  };

  // ==========================================
  // INPUT CHANGE
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
  // ADD / UPDATE STUDENT
  // ==========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const toastId =
      toast.loading(
        editingId
          ? "শিক্ষার্থীর তথ্য আপডেট করা হচ্ছে..."
          : "নতুন শিক্ষার্থী যোগ করা হচ্ছে..."
      );

    try {
      setSaving(true);

      const studentData = {
        student_id:
          form.student_id,

        name:
          form.name,

        email:
          form.email || null,

        phone:
          form.phone || null,

        father_name:
          form.father_name || null,

        mother_name:
          form.mother_name || null,

        class:
          form.class,

        section:
          form.section || null,

        roll:
          form.roll,

        date_of_birth:
          form.date_of_birth || null,

        address:
          form.address || null,

        photo: null,

        status:
          form.status,
      };

      // ======================================
      // UPDATE STUDENT
      // ======================================

      if (editingId) {
        await apiRequest(
          `/students/${editingId}`,
          {
            method: "PUT",

            body:
              JSON.stringify(
                studentData
              ),
          }
        );

        toast.success(
          "শিক্ষার্থীর তথ্য সফলভাবে আপডেট হয়েছে।",
          {
            id: toastId,
          }
        );
      }

      // ======================================
      // ADD STUDENT
      // ======================================

      else {
        await apiRequest(
          "/students",
          {
            method: "POST",

            body:
              JSON.stringify(
                studentData
              ),
          }
        );

        toast.success(
          "নতুন শিক্ষার্থী সফলভাবে যোগ হয়েছে।",
          {
            id: toastId,
          }
        );
      }

      resetForm();

      await loadStudents();
    } catch (error) {
      console.error(
        "Student save error:",
        error
      );

      toast.error(
        error.message ||
          "শিক্ষার্থীর তথ্য সংরক্ষণ করা যায়নি।",
        {
          id: toastId,
        }
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT STUDENT
  // ==========================================

  const handleEdit = (student) => {
    setEditingId(student.id);

    setForm({
      student_id:
        student.student_id || "",

      name:
        student.name || "",

      email:
        student.email || "",

      phone:
        student.phone || "",

      father_name:
        student.father_name || "",

      mother_name:
        student.mother_name || "",

      class:
        student.class || "",

      section:
        student.section || "",

      roll:
        student.roll || "",

      date_of_birth:
        student.date_of_birth
          ? String(
              student.date_of_birth
            ).slice(0, 10)
          : "",

      address:
        student.address || "",

      status:
        Boolean(
          student.status
        ),
    });

    toast(
      "শিক্ষার্থীর তথ্য Edit Mode-এ খোলা হয়েছে।",
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
  // DELETE STUDENT
  // ==========================================

  const deleteStudent = async (
    student
  ) => {
    const toastId =
      toast.loading(
        "শিক্ষার্থী মুছে ফেলা হচ্ছে..."
      );

    try {
      await apiRequest(
        `/students/${student.id}`,
        {
          method: "DELETE",
        }
      );

      if (
        editingId ===
        student.id
      ) {
        resetForm();
      }

      await loadStudents();

      toast.success(
        "শিক্ষার্থী সফলভাবে মুছে ফেলা হয়েছে।",
        {
          id: toastId,
        }
      );
    } catch (error) {
      console.error(
        "Student delete error:",
        error
      );

      toast.error(
        error.message ||
          "শিক্ষার্থী মুছে ফেলা যায়নি।",
        {
          id: toastId,
        }
      );
    }
  };

  // ==========================================
  // DELETE CONFIRMATION
  // ==========================================

  const handleDelete = (
    student
  ) => {
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
                শিক্ষার্থী মুছে ফেলবেন?
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                <span className="font-bold text-slate-700">
                  {student.name}
                </span>{" "}
                এর তথ্য স্থায়ীভাবে
                মুছে যাবে।
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

                deleteStudent(
                  student
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

            backgroundSize:
              "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />

          <p className="text-sm font-semibold text-slate-600">
            শিক্ষার্থীদের তথ্য
            লোড হচ্ছে...
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
          backgroundColor:
            "#dfe6eb",

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

      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-emerald-100/55 via-teal-100/20 to-transparent" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="relative z-20 border-b border-slate-300/80 bg-white/90 shadow-[0_5px_20px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          {/* Left */}

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-lg shadow-emerald-300/40">
              <StudentIcon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-emerald-700 sm:text-xs">
                Admin Management
              </p>

              <h1 className="truncate text-lg font-extrabold text-slate-900 sm:text-xl">
                শিক্ষার্থী ব্যবস্থাপনা
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
            STUDENT FORM
        ========================================== */}

        <section className="overflow-hidden rounded-[30px] border border-slate-300/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
          {/* Gradient Line */}

          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

          {/* Form Header */}

          <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/70 px-5 py-5 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-700 shadow-sm">
                  {editingId ? (
                    <EditIcon className="h-5 w-5" />
                  ) : (
                    <PlusIcon className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-700">
                    Student Form
                  </p>

                  <h2 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                    {editingId
                      ? "শিক্ষার্থীর তথ্য Edit করুন"
                      : "নতুন শিক্ষার্থী যোগ করুন"}
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    শিক্ষার্থীর ব্যক্তিগত,
                    একাডেমিক এবং যোগাযোগের
                    তথ্য পরিচালনা করুন।
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
              className="space-y-7"
            >
              {/* ======================================
                  ACADEMIC INFORMATION
              ====================================== */}

              <FormSection
                eyebrow="Academic Information"
                title="একাডেমিক তথ্য"
                icon={
                  <IdIcon className="h-5 w-5" />
                }
              >
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {/* Student ID */}

                  <Field
                    label="Student ID"
                    required
                  >
                    <input
                      type="text"
                      name="student_id"
                      value={
                        form.student_id
                      }
                      onChange={
                        handleChange
                      }
                      required
                      placeholder="STD-001"
                      className={
                        inputClass
                      }
                    />
                  </Field>

                  {/* Name */}

                  <Field
                    label="শিক্ষার্থীর নাম"
                    required
                  >
                    <input
                      type="text"
                      name="name"
                      value={
                        form.name
                      }
                      onChange={
                        handleChange
                      }
                      required
                      placeholder="যেমন: Ridwan Ahmed"
                      className={
                        inputClass
                      }
                    />
                  </Field>

                  {/* Roll */}

                  <Field
                    label="Roll"
                    required
                  >
                    <input
                      type="text"
                      name="roll"
                      value={
                        form.roll
                      }
                      onChange={
                        handleChange
                      }
                      required
                      placeholder="01"
                      className={
                        inputClass
                      }
                    />
                  </Field>

                  {/* Class */}

                  <Field
                    label="Class"
                    required
                  >
                    <input
                      type="text"
                      name="class"
                      value={
                        form.class
                      }
                      onChange={
                        handleChange
                      }
                      required
                      placeholder="যেমন: 10"
                      className={
                        inputClass
                      }
                    />
                  </Field>

                  {/* Section */}

                  <Field label="Section">
                    <input
                      type="text"
                      name="section"
                      value={
                        form.section
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="যেমন: A"
                      className={
                        inputClass
                      }
                    />
                  </Field>

                  {/* DOB */}

                  <Field label="জন্ম তারিখ">
                    <input
                      type="date"
                      name="date_of_birth"
                      value={
                        form.date_of_birth
                      }
                      onChange={
                        handleChange
                      }
                      className={
                        inputClass
                      }
                    />
                  </Field>
                </div>
              </FormSection>

              {/* ======================================
                  CONTACT INFORMATION
              ====================================== */}

              <FormSection
                eyebrow="Contact Information"
                title="যোগাযোগের তথ্য"
                icon={
                  <ContactIcon className="h-5 w-5" />
                }
              >
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {/* Email */}

                  <Field label="Email">
                    <input
                      type="email"
                      name="email"
                      value={
                        form.email
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="student@gmail.com"
                      className={
                        inputClass
                      }
                    />
                  </Field>

                  {/* Phone */}

                  <Field label="Phone">
                    <input
                      type="text"
                      name="phone"
                      value={
                        form.phone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="017XXXXXXXX"
                      className={
                        inputClass
                      }
                    />
                  </Field>

                  {/* Status */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Status
                    </label>

                    <div className="flex min-h-[52px] items-center justify-between rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4">
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Active Student
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                          শিক্ষার্থী active
                          থাকবে কি না
                        </p>
                      </div>

                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          name="status"
                          checked={
                            form.status
                          }
                          onChange={
                            handleChange
                          }
                          className="peer sr-only"
                        />

                        <div className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-emerald-600 peer-focus:ring-4 peer-focus:ring-emerald-100 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:after:translate-x-5" />
                      </label>
                    </div>

                    <div
                      className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                        form.status
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-600"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          form.status
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />

                      {form.status
                        ? "Active"
                        : "Inactive"}
                    </div>
                  </div>
                </div>
              </FormSection>

              {/* ======================================
                  GUARDIAN INFORMATION
              ====================================== */}

              <FormSection
                eyebrow="Guardian Information"
                title="অভিভাবকের তথ্য"
                icon={
                  <GuardianIcon className="h-5 w-5" />
                }
              >
                <div className="grid gap-5 md:grid-cols-2">
                  {/* Father */}

                  <Field label="পিতার নাম">
                    <input
                      type="text"
                      name="father_name"
                      value={
                        form.father_name
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="পিতার নাম"
                      className={
                        inputClass
                      }
                    />
                  </Field>

                  {/* Mother */}

                  <Field label="মাতার নাম">
                    <input
                      type="text"
                      name="mother_name"
                      value={
                        form.mother_name
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="মাতার নাম"
                      className={
                        inputClass
                      }
                    />
                  </Field>

                  {/* Address */}

                  <div className="md:col-span-2">
                    <Field label="ঠিকানা">
                      <textarea
                        name="address"
                        value={
                          form.address
                        }
                        onChange={
                          handleChange
                        }
                        rows="3"
                        placeholder="শিক্ষার্থীর ঠিকানা..."
                        className={`${inputClass} resize-none`}
                      />
                    </Field>
                  </div>
                </div>
              </FormSection>

              {/* ======================================
                  SUBMIT
              ====================================== */}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(5,150,105,0.26)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(5,150,105,0.32)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                      Saving...
                    </>
                  ) : editingId ? (
                    <>
                      <EditIcon className="h-4 w-4" />

                      Update Student
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4" />

                      Add Student
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
            STUDENT LIST
        ========================================== */}

        <section className="mt-6 overflow-hidden rounded-[30px] border border-slate-300/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.11)] backdrop-blur-xl">
          {/* Header */}

          <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/70 px-5 py-5 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-700 shadow-sm">
                  <ListIcon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-700">
                    Student Directory
                  </p>

                  <h2 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                    শিক্ষার্থী তালিকা
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    মোট শিক্ষার্থী:{" "}
                    <span className="font-extrabold text-emerald-700">
                      {students.length}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  loadStudents
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
            {students.length === 0 ? (
              <div className="flex min-h-[230px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-slate-200 bg-slate-50 text-slate-400">
                  <StudentIcon className="h-8 w-8" />
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-slate-700">
                  কোনো শিক্ষার্থী পাওয়া
                  যায়নি
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  নতুন শিক্ষার্থী যোগ
                  করলে এখানে দেখা যাবে।
                </p>
              </div>
            ) : (
              <>
                {/* ==================================
                    MOBILE CARDS
                ================================== */}

                <div className="grid gap-4 md:hidden">
                  {students.map(
                    (
                      student,
                      index
                    ) => (
                      <article
                        key={
                          student.id
                        }
                        className="relative overflow-hidden rounded-[24px] border border-slate-300 bg-white p-5 shadow-sm"
                      >
                        {/* Accent */}

                        <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500" />

                        {/* Header */}

                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                              Student #
                              {index + 1}
                            </p>

                            <h3 className="mt-1 break-words text-lg font-extrabold text-slate-900">
                              {
                                student.name
                              }
                            </h3>

                            <p className="mt-1 text-xs font-semibold text-slate-500">
                              {
                                student.student_id
                              }
                            </p>
                          </div>

                          <StatusBadge
                            active={
                              student.status
                            }
                          />
                        </div>

                        {/* Class Info */}

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <StudentInfo
                            label="Class"
                            value={
                              student.class ||
                              "—"
                            }
                          />

                          <StudentInfo
                            label="Roll"
                            value={
                              student.roll ||
                              "—"
                            }
                          />

                          <StudentInfo
                            label="Section"
                            value={
                              student.section ||
                              "—"
                            }
                          />

                          <StudentInfo
                            label="Phone"
                            value={
                              student.phone ||
                              "—"
                            }
                          />
                        </div>

                        {/* Email */}

                        {student.email && (
                          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <MailIcon className="h-4 w-4 shrink-0 text-emerald-600" />

                            <p className="min-w-0 truncate text-xs font-semibold text-slate-600">
                              {
                                student.email
                              }
                            </p>
                          </div>
                        )}

                        {/* Actions */}

                        <div className="mt-4 flex gap-2 border-t border-slate-200 pt-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                student
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
                                student
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
                  <table className="w-full min-w-[1050px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50/60 text-left">
                        <TableHeading>
                          #
                        </TableHeading>

                        <TableHeading>
                          Student ID
                        </TableHeading>

                        <TableHeading>
                          নাম
                        </TableHeading>

                        <TableHeading>
                          Class
                        </TableHeading>

                        <TableHeading>
                          Section
                        </TableHeading>

                        <TableHeading>
                          Roll
                        </TableHeading>

                        <TableHeading>
                          যোগাযোগ
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
                      {students.map(
                        (
                          student,
                          index
                        ) => (
                          <tr
                            key={
                              student.id
                            }
                            className="border-b border-slate-100 transition last:border-0 hover:bg-emerald-50/30"
                          >
                            {/* Number */}

                            <td className="px-4 py-4 text-sm font-bold text-slate-400">
                              {index + 1}
                            </td>

                            {/* Student ID */}

                            <td className="px-4 py-4">
                              <span className="inline-flex rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-700">
                                {
                                  student.student_id
                                }
                              </span>
                            </td>

                            {/* Name */}

                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                                  <UserIcon className="h-5 w-5" />
                                </div>

                                <div className="min-w-0">
                                  <p className="max-w-[220px] truncate font-extrabold text-slate-900">
                                    {
                                      student.name
                                    }
                                  </p>

                                  {student.email && (
                                    <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                                      {
                                        student.email
                                      }
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Class */}

                            <td className="px-4 py-4">
                              <span className="inline-flex min-w-[48px] justify-center rounded-xl border border-teal-100 bg-teal-50 px-3 py-2 text-sm font-extrabold text-teal-700">
                                {
                                  student.class
                                }
                              </span>
                            </td>

                            {/* Section */}

                            <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                              {student.section ||
                                "—"}
                            </td>

                            {/* Roll */}

                            <td className="px-4 py-4 text-sm font-extrabold text-slate-700">
                              {
                                student.roll
                              }
                            </td>

                            {/* Contact */}

                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                <PhoneIcon className="h-4 w-4 shrink-0 text-emerald-600" />

                                <span>
                                  {student.phone ||
                                    "—"}
                                </span>
                              </div>
                            </td>

                            {/* Status */}

                            <td className="px-4 py-4">
                              <StatusBadge
                                active={
                                  student.status
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
                                      student
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
                                      student
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
// FORM SECTION
// ==========================================

function FormSection({
  eyebrow,
  title,
  icon,
  children,
}) {
  return (
    <section className="rounded-[24px] border border-slate-300/80 bg-slate-50/60 p-4 sm:p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700 shadow-sm">
          {icon}
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
            {eyebrow}
          </p>

          <h3 className="mt-1 font-extrabold text-slate-900">
            {title}
          </h3>
        </div>
      </div>

      {children}
    </section>
  );
}

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
// STUDENT INFO - MOBILE
// ==========================================

function StudentInfo({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
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

function TableHeading({
  children,
}) {
  return (
    <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
      {children}
    </th>
  );
}

// ==========================================
// STUDENT ICON
// ==========================================

function StudentIcon({
  className = "",
}) {
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

      <path
        d="M21 9v5"
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
// USER ICON
// ==========================================

function UserIcon({
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

// ==========================================
// ID ICON
// ==========================================

function IdIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="8"
        cy="11"
        r="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M5.5 16c.7-1.5 1.6-2.2 2.5-2.2S9.8 14.5 10.5 16M13 9h5M13 13h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ==========================================
// CONTACT ICON
// ==========================================

function ContactIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M5 4h14v16H5V4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M8 8h8M8 12h8M8 16h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ==========================================
// GUARDIAN ICON
// ==========================================

function GuardianIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle
        cx="9"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M3.5 19a5.5 5.5 0 0 1 11 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="17"
        cy="9"
        r="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M15 14.5a4 4 0 0 1 5.5 3.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ==========================================
// MAIL ICON
// ==========================================

function MailIcon({
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

// ==========================================
// PHONE ICON
// ==========================================

function PhoneIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M7 4 4.5 6.5c0 6.7 6.3 13 13 13L20 17l-4-3-2 2c-2.3-1-4.9-3.6-5.9-5.9l2-2L7 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
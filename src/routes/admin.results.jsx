import { useEffect, useState } from "react";

import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import toast from "react-hot-toast";

import { apiRequest } from "../services/api";

export const Route = createFileRoute("/admin/results")({
  component: AdminResults,
});

// ==========================================
// NEW SUBJECT
// ==========================================

const newSubject = () => ({
  subject: "",
  full_marks: 100,
  obtained_marks: "",
  grade: "",
});

// ==========================================
// EMPTY FORM
// ==========================================

const emptyForm = {
  student_id: "",
  exam_name: "",
  gpa: "",
  passed: true,
  subjects: [newSubject()],
};

// ==========================================
// ADMIN RESULTS
// ==========================================

function AdminResults() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // ==========================================
  // INITIALIZE PAGE
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
        await apiRequest("/auth/me");

        const [
          studentResponse,
          resultResponse,
        ] = await Promise.all([
          apiRequest("/students"),
          apiRequest("/results"),
        ]);

        setStudents(
          studentResponse.data || []
        );

        setResults(
          resultResponse.data || []
        );
      } catch (error) {
        console.error(error);

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
  // RELOAD RESULTS
  // ==========================================

  const loadResults = async () => {
    try {
      const response =
        await apiRequest("/results");

      setResults(
        response.data || []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "ফলাফলের তথ্য লোড করা যায়নি।"
      );
    }
  };

  // ==========================================
  // MAIN FORM CHANGE
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
  // SUBJECT CHANGE
  // ==========================================

  const handleSubjectChange = (
    index,
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => {
      const updatedSubjects = [
        ...previous.subjects,
      ];

      updatedSubjects[index] = {
        ...updatedSubjects[index],
        [name]: value,
      };

      return {
        ...previous,
        subjects: updatedSubjects,
      };
    });
  };

  // ==========================================
  // ADD SUBJECT
  // ==========================================

  const addSubject = () => {
    setForm((previous) => ({
      ...previous,

      subjects: [
        ...previous.subjects,
        newSubject(),
      ],
    }));
  };

  // ==========================================
  // REMOVE SUBJECT
  // ==========================================

  const removeSubject = (index) => {
    if (form.subjects.length === 1) {
      toast.error(
        "অন্তত একটি বিষয় রাখতে হবে।"
      );

      return;
    }

    setForm((previous) => ({
      ...previous,

      subjects:
        previous.subjects.filter(
          (_, subjectIndex) =>
            subjectIndex !== index
        ),
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      subjects: [newSubject()],
    });
  };

  // ==========================================
  // ADD / UPDATE RESULT
  // ==========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const toastId =
      toast.loading(
        editingId
          ? "ফলাফল আপডেট করা হচ্ছে..."
          : "নতুন ফলাফল যোগ করা হচ্ছে..."
      );

    try {
      setSaving(true);

      const data = {
        student_id:
          Number(form.student_id),

        exam_name:
          form.exam_name,

        gpa:
          Number(form.gpa),

        passed:
          form.passed,

        subjects:
          form.subjects.map(
            (item) => ({
              subject:
                item.subject,

              full_marks:
                Number(
                  item.full_marks
                ),

              obtained_marks:
                Number(
                  item.obtained_marks
                ),

              grade:
                item.grade || null,
            })
          ),
      };

      // ======================================
      // UPDATE
      // ======================================

      if (editingId) {
        await apiRequest(
          `/results/${editingId}`,
          {
            method: "PUT",

            body:
              JSON.stringify(data),
          }
        );

        toast.success(
          "ফলাফল সফলভাবে আপডেট হয়েছে।",
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
          "/results",
          {
            method: "POST",

            body:
              JSON.stringify(data),
          }
        );

        toast.success(
          "নতুন ফলাফল সফলভাবে যোগ হয়েছে।",
          {
            id: toastId,
          }
        );
      }

      resetForm();

      await loadResults();
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "ফলাফল সংরক্ষণ করা যায়নি।",
        {
          id: toastId,
        }
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT RESULT
  // ==========================================

  const handleEdit = (result) => {
    setEditingId(result.id);

    setForm({
      student_id:
        String(result.student_id),

      exam_name:
        result.exam_name || "",

      gpa:
        result.gpa || "",

      passed:
        Boolean(result.passed),

      subjects:
        result.subjects?.length > 0
          ? result.subjects.map(
              (subject) => ({
                subject:
                  subject.subject ||
                  "",

                full_marks:
                  subject.full_marks ??
                  100,

                obtained_marks:
                  subject.obtained_marks ??
                  "",

                grade:
                  subject.grade ||
                  "",
              })
            )
          : [newSubject()],
    });

    toast(
      "ফলাফল Edit Mode-এ খোলা হয়েছে।",
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
  // DELETE RESULT
  // ==========================================

  const deleteResult = async (
    result
  ) => {
    const toastId =
      toast.loading(
        "ফলাফল মুছে ফেলা হচ্ছে..."
      );

    try {
      await apiRequest(
        `/results/${result.id}`,
        {
          method: "DELETE",
        }
      );

      if (
        editingId === result.id
      ) {
        resetForm();
      }

      await loadResults();

      toast.success(
        "ফলাফল সফলভাবে মুছে ফেলা হয়েছে।",
        {
          id: toastId,
        }
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "ফলাফল মুছে ফেলা যায়নি।",
        {
          id: toastId,
        }
      );
    }
  };

  // ==========================================
  // DELETE CONFIRMATION
  // ==========================================

  const handleDelete = (result) => {
    const studentName =
      result.student?.name ||
      "এই শিক্ষার্থী";

    toast.custom(
      (t) => (
        <div
          className={`w-[calc(100vw-32px)] max-w-[380px] rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.22)] ${
            t.visible
              ? "animate-enter"
              : "animate-leave"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600">
              <TrashIcon className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900">
                ফলাফল মুছে ফেলবেন?
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {studentName}-এর{" "}
                {result.exam_name} ফলাফল
                স্থায়ীভাবে মুছে যাবে।
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

                deleteResult(result);
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
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />

          <p className="text-sm font-semibold text-slate-600">
            ফলাফলের তথ্য লোড হচ্ছে...
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

      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-violet-200/25 via-teal-100/20 to-transparent" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="relative z-20 border-b border-slate-300/80 bg-white/90 shadow-[0_5px_20px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          {/* Left */}

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] bg-gradient-to-br from-violet-500 via-purple-500 to-teal-600 text-white shadow-lg shadow-violet-300/40">
              <ResultIcon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-violet-700 sm:text-xs">
                Admin Management
              </p>

              <h1 className="truncate text-lg font-extrabold text-slate-900 sm:text-xl">
                ফলাফল ব্যবস্থাপনা
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
            RESULT FORM
        ========================================== */}

        <section className="overflow-hidden rounded-[30px] border border-slate-300/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
          {/* Gradient */}

          <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-teal-500" />

          {/* Form Header */}

          <div className="border-b border-slate-200 bg-gradient-to-r from-violet-50/60 via-white to-teal-50/70 px-5 py-5 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-100 bg-white text-violet-700 shadow-sm">
                  {editingId ? (
                    <EditIcon className="h-5 w-5" />
                  ) : (
                    <PlusIcon className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-700">
                    Result Form
                  </p>

                  <h2 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                    {editingId
                      ? "ফলাফল Edit করুন"
                      : "নতুন ফলাফল যোগ করুন"}
                  </h2>

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

          {/* Form */}

          <div className="p-5 sm:p-6 lg:p-7">
            <form
              onSubmit={handleSubmit}
              className="space-y-7"
            >
              {/* Main Fields */}

              <div>
                <div className="mb-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-600">
                    Basic Information
                  </p>

                  <h3 className="mt-1 text-base font-extrabold text-slate-900">
                    ফলাফলের মূল তথ্য
                  </h3>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                  {/* Student */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      শিক্ষার্থী
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <select
                      name="student_id"
                      value={
                        form.student_id
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="w-full rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition hover:border-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    >
                      <option value="">
                        শিক্ষার্থী নির্বাচন করুন
                      </option>

                      {students.map(
                        (student) => (
                          <option
                            key={
                              student.id
                            }
                            value={
                              student.id
                            }
                          >
                            {student.name} -
                            Class{" "}
                            {student.class} -
                            Roll{" "}
                            {student.roll}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Exam */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      পরীক্ষার নাম
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="exam_name"
                      value={
                        form.exam_name
                      }
                      onChange={
                        handleChange
                      }
                      required
                      placeholder="Final Exam"
                      className="w-full rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </div>

                  {/* GPA */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      GPA
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="number"
                      name="gpa"
                      value={
                        form.gpa
                      }
                      onChange={
                        handleChange
                      }
                      required
                      min="0"
                      max="5"
                      step="0.01"
                      placeholder="4.75"
                      className="w-full rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </div>

                  {/* Passed */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Status
                    </label>

                    <div className="flex min-h-[52px] items-center justify-between rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4">
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {form.passed
                            ? "Passed"
                            : "Failed"}
                        </p>
                      </div>

                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          name="passed"
                          checked={
                            form.passed
                          }
                          onChange={
                            handleChange
                          }
                          className="peer sr-only"
                        />

                        <div className="h-7 w-12 rounded-full bg-red-300 transition peer-checked:bg-emerald-600 peer-focus:ring-4 peer-focus:ring-emerald-100 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:after:translate-x-5" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================
                  SUBJECT RESULTS
              ====================================== */}

              <div className="rounded-[24px] border border-slate-300/80 bg-slate-50/70 p-4 sm:p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 bg-white text-violet-700 shadow-sm">
                      <SubjectIcon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-600">
                        Subject Results
                      </p>

                      <h4 className="mt-1 font-extrabold text-slate-900">
                        বিষয়ভিত্তিক ফলাফল
                      </h4>

                      <p className="mt-1 text-xs text-slate-500">
                        বিষয়, পূর্ণ নম্বর,
                        প্রাপ্ত নম্বর এবং
                        Grade দিন।
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={
                      addSubject
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <PlusIcon className="h-4 w-4" />

                    Add Subject
                  </button>
                </div>

                {/* Subject Rows */}

                <div className="mt-5 space-y-4">
                  {form.subjects.map(
                    (
                      subject,
                      index
                    ) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded-[22px] border border-slate-300 bg-white p-4 shadow-sm"
                      >
                        <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-violet-500 to-teal-500" />

                        <div className="mb-3 flex items-center justify-between">
                          <span className="inline-flex items-center rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[10px] font-extrabold text-violet-700">
                            Subject{" "}
                            {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeSubject(
                                index
                              )
                            }
                            disabled={
                              form
                                .subjects
                                .length ===
                              1
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
                          {/* Subject */}

                          <input
                            type="text"
                            name="subject"
                            value={
                              subject.subject
                            }
                            onChange={(
                              event
                            ) =>
                              handleSubjectChange(
                                index,
                                event
                              )
                            }
                            required
                            placeholder="Subject Name"
                            className="rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                          />

                          {/* Full Marks */}

                          <input
                            type="number"
                            name="full_marks"
                            value={
                              subject.full_marks
                            }
                            onChange={(
                              event
                            ) =>
                              handleSubjectChange(
                                index,
                                event
                              )
                            }
                            required
                            min="1"
                            placeholder="Full Marks"
                            className="rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                          />

                          {/* Obtained */}

                          <input
                            type="number"
                            name="obtained_marks"
                            value={
                              subject.obtained_marks
                            }
                            onChange={(
                              event
                            ) =>
                              handleSubjectChange(
                                index,
                                event
                              )
                            }
                            required
                            min="0"
                            placeholder="Obtained"
                            className="rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                          />

                          {/* Grade */}

                          <input
                            type="text"
                            name="grade"
                            value={
                              subject.grade
                            }
                            onChange={(
                              event
                            ) =>
                              handleSubjectChange(
                                index,
                                event
                              )
                            }
                            placeholder="Grade e.g. A+"
                            className="rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* ======================================
                  SUBMIT
              ====================================== */}

              <div className="border-t border-slate-200 pt-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-teal-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(124,58,237,0.24)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(124,58,237,0.30)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                      Saving...
                    </>
                  ) : editingId ? (
                    <>
                      <EditIcon className="h-4 w-4" />

                      Update Result
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4" />

                      Add Result
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ==========================================
            RESULT LIST
        ========================================== */}

        <section className="mt-6 overflow-hidden rounded-[30px] border border-slate-300/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.11)] backdrop-blur-xl">
          {/* Header */}

          <div className="border-b border-slate-200 bg-gradient-to-r from-violet-50/60 via-white to-teal-50/70 px-5 py-5 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-100 bg-white text-violet-700 shadow-sm">
                  <ListIcon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-700">
                    Result Directory
                  </p>

                  <h2 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                    ফলাফল তালিকা
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    মোট ফলাফল:{" "}
                    <span className="font-extrabold text-violet-700">
                      {results.length}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  loadResults
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100"
              >
                <RefreshIcon className="h-4 w-4" />

                Refresh
              </button>
            </div>
          </div>

          {/* List */}

          <div className="p-4 sm:p-5">
            {results.length === 0 ? (
              <div className="flex min-h-[230px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-slate-200 bg-slate-50 text-slate-400">
                  <ResultIcon className="h-8 w-8" />
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-slate-700">
                  কোনো ফলাফল পাওয়া যায়নি
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  নতুন ফলাফল যোগ করলে
                  এখানে দেখা যাবে।
                </p>
              </div>
            ) : (
              <>
                {/* ==================================
                    MOBILE CARDS
                ================================== */}

                <div className="grid gap-4 md:hidden">
                  {results.map(
                    (
                      result,
                      index
                    ) => (
                      <article
                        key={
                          result.id
                        }
                        className="relative overflow-hidden rounded-[24px] border border-slate-300 bg-white p-5 shadow-sm"
                      >
                        <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-violet-500 to-teal-500" />

                        {/* Top */}

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">
                              Result #
                              {index + 1}
                            </p>

                            <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                              {result.student
                                ?.name ||
                                "—"}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              Student ID:{" "}
                              {result.student
                                ?.student_id ||
                                "—"}
                            </p>
                          </div>

                          <span
                            className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
                              result.passed
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-red-200 bg-red-50 text-red-600"
                            }`}
                          >
                            {result.passed
                              ? "Passed"
                              : "Failed"}
                          </span>
                        </div>

                        {/* Info */}

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <ResultInfo
                            label="Class"
                            value={
                              result.student
                                ?.class ||
                              "—"
                            }
                          />

                          <ResultInfo
                            label="Roll"
                            value={
                              result.student
                                ?.roll ||
                              "—"
                            }
                          />

                          <ResultInfo
                            label="Exam"
                            value={
                              result.exam_name ||
                              "—"
                            }
                          />

                          <ResultInfo
                            label="GPA"
                            value={
                              result.gpa ??
                              "—"
                            }
                            accent
                          />

                          <ResultInfo
                            label="Marks"
                            value={`${result.total_marks ?? "—"} / ${result.full_marks ?? "—"}`}
                            wide
                          />
                        </div>

                        {/* Actions */}

                        <div className="mt-4 flex gap-2 border-t border-slate-200 pt-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                result
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
                                result
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
                  <table className="w-full min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-violet-50/50 text-left">
                        <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
                          #
                        </th>

                        <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
                          শিক্ষার্থী
                        </th>

                        <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
                          Class
                        </th>

                        <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
                          Roll
                        </th>

                        <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
                          Exam
                        </th>

                        <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
                          Marks
                        </th>

                        <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
                          GPA
                        </th>

                        <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
                          Status
                        </th>

                        <th className="px-4 py-4 text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.map(
                        (
                          result,
                          index
                        ) => (
                          <tr
                            key={
                              result.id
                            }
                            className="border-b border-slate-100 transition last:border-0 hover:bg-violet-50/30"
                          >
                            <td className="px-4 py-4 text-sm font-bold text-slate-400">
                              {index + 1}
                            </td>

                            {/* Student */}

                            <td className="px-4 py-4">
                              <div>
                                <p className="font-extrabold text-slate-900">
                                  {result.student
                                    ?.name ||
                                    "—"}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {result.student
                                    ?.student_id ||
                                    ""}
                                </p>
                              </div>
                            </td>

                            <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                              {result.student
                                ?.class ||
                                "—"}
                            </td>

                            <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                              {result.student
                                ?.roll ||
                                "—"}
                            </td>

                            <td className="px-4 py-4">
                              <span className="rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700">
                                {
                                  result.exam_name
                                }
                              </span>
                            </td>

                            <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                              {result.total_marks}{" "}
                              /{" "}
                              {result.full_marks}
                            </td>

                            <td className="px-4 py-4">
                              <span className="inline-flex min-w-[48px] justify-center rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-black text-violet-700">
                                {result.gpa}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${
                                  result.passed
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-red-200 bg-red-50 text-red-600"
                                }`}
                              >
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    result.passed
                                      ? "bg-emerald-500"
                                      : "bg-red-500"
                                  }`}
                                />

                                {result.passed
                                  ? "Passed"
                                  : "Failed"}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(
                                      result
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
                                      result
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
// MOBILE RESULT INFO
// ==========================================

function ResultInfo({
  label,
  value,
  accent = false,
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
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 break-words text-sm font-extrabold ${
          accent
            ? "text-violet-700"
            : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// ==========================================
// ICONS
// ==========================================

function ResultIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M6 3h9l4 4v14H6V3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M15 3v5h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M9 12h6M9 16h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

function SubjectIcon({
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
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

const newSubject = () => ({
  subject: "",
  full_marks: 100,
  obtained_marks: "",
  grade: "",
});

const emptyForm = {
  student_id: "",
  exam_name: "",
  gpa: "",
  passed: true,
  subjects: [newSubject()],
};

function AdminResults() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // Initialize Page
  // =========================
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
        await apiRequest("/auth/me");

        const [studentResponse, resultResponse] =
          await Promise.all([
            apiRequest("/students"),
            apiRequest("/results"),
          ]);

        setStudents(studentResponse.data || []);
        setResults(resultResponse.data || []);
      } catch (error) {
        console.error(error);

        window.localStorage.removeItem("admin_token");
        window.localStorage.removeItem("admin_user");

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

  // =========================
  // Reload Results
  // =========================
  const loadResults = async () => {
    try {
      const response = await apiRequest("/results");
      setResults(response.data || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "ফলাফলের তথ্য লোড করা যায়নি।"
      );
    }
  };

  // =========================
  // Main Form Change
  // =========================
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // Subject Change
  // =========================
  const handleSubjectChange = (index, event) => {
    const { name, value } = event.target;

    setForm((previous) => {
      const updatedSubjects = [...previous.subjects];

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

  // =========================
  // Add Subject Row
  // =========================
  const addSubject = () => {
    setForm((previous) => ({
      ...previous,
      subjects: [
        ...previous.subjects,
        newSubject(),
      ],
    }));
  };

  // =========================
  // Remove Subject
  // =========================
  const removeSubject = (index) => {
    if (form.subjects.length === 1) {
      toast.error(
        "অন্তত একটি বিষয় রাখতে হবে।"
      );
      return;
    }

    setForm((previous) => ({
      ...previous,
      subjects: previous.subjects.filter(
        (_, subjectIndex) =>
          subjectIndex !== index
      ),
    }));
  };

  // =========================
  // Reset Form
  // =========================
  const resetForm = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      subjects: [newSubject()],
    });
  };

  // =========================
  // Submit Add / Update
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    const toastId = toast.loading(
      editingId
        ? "ফলাফল আপডেট করা হচ্ছে..."
        : "নতুন ফলাফল যোগ করা হচ্ছে..."
    );

    try {
      setSaving(true);

      const data = {
        student_id: Number(form.student_id),
        exam_name: form.exam_name,
        gpa: Number(form.gpa),
        passed: form.passed,

        subjects: form.subjects.map((item) => ({
          subject: item.subject,
          full_marks: Number(item.full_marks),
          obtained_marks: Number(
            item.obtained_marks
          ),
          grade: item.grade || null,
        })),
      };

      if (editingId) {
        await apiRequest(
          `/results/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(data),
          }
        );

        toast.success(
          "ফলাফল সফলভাবে আপডেট হয়েছে।",
          {
            id: toastId,
          }
        );
      } else {
        await apiRequest("/results", {
          method: "POST",
          body: JSON.stringify(data),
        });

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

  // =========================
  // Edit Result
  // =========================
  const handleEdit = (result) => {
    setEditingId(result.id);

    setForm({
      student_id: String(result.student_id),
      exam_name: result.exam_name || "",
      gpa: result.gpa || "",
      passed: Boolean(result.passed),

      subjects:
        result.subjects?.length > 0
          ? result.subjects.map((subject) => ({
              subject:
                subject.subject || "",
              full_marks:
                subject.full_marks ?? 100,
              obtained_marks:
                subject.obtained_marks ?? "",
              grade:
                subject.grade || "",
            }))
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

  // =========================
  // Cancel Edit
  // =========================
  const handleCancelEdit = () => {
    resetForm();

    toast(
      "Edit বাতিল করা হয়েছে।",
      {
        icon: "↩️",
      }
    );
  };

  // =========================
  // Delete Result
  // =========================
  const deleteResult = async (result) => {
    const toastId = toast.loading(
      "ফলাফল মুছে ফেলা হচ্ছে..."
    );

    try {
      await apiRequest(
        `/results/${result.id}`,
        {
          method: "DELETE",
        }
      );

      if (editingId === result.id) {
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

  // =========================
  // Delete Confirmation
  // =========================
  const handleDelete = (result) => {
    const studentName =
      result.student?.name || "এই শিক্ষার্থী";

    toast(
      (t) => (
        <div className="min-w-67.5">
          <p className="font-bold text-white">
            ফলাফল মুছে ফেলবেন?
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-300">
            {studentName}-এর{" "}
            {result.exam_name} ফলাফল
            স্থায়ীভাবে মুছে যাবে।
          </p>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() =>
                toast.dismiss(t.id)
              }
              className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-600"
            >
              বাতিল
            </button>

            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                deleteResult(result);
              }}
              className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
            >
              মুছে ফেলুন
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        icon: "⚠️",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">
          ফলাফলের তথ্য লোড হচ্ছে...
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
              ফলাফল ব্যবস্থাপনা
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
        {/* Heading */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Result Management
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            শিক্ষার্থীর পরীক্ষার ফলাফল পরিচালনা করুন।
          </p>
        </div>

        {/* =========================
            Result Form
        ========================== */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-slate-900">
              {editingId
                ? "ফলাফল Edit করুন"
                : "নতুন ফলাফল যোগ করুন"}
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
            className="mt-6"
          >
            {/* Main Fields */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {/* Student */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  শিক্ষার্থী *
                </label>

                <select
                  name="student_id"
                  value={form.student_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  <option value="">
                    শিক্ষার্থী নির্বাচন করুন
                  </option>

                  {students.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.name} - Class{" "}
                      {student.class} - Roll{" "}
                      {student.roll}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  পরীক্ষার নাম *
                </label>

                <input
                  type="text"
                  name="exam_name"
                  value={form.exam_name}
                  onChange={handleChange}
                  required
                  placeholder="Final Exam"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              {/* GPA */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  GPA *
                </label>

                <input
                  type="number"
                  name="gpa"
                  value={form.gpa}
                  onChange={handleChange}
                  required
                  min="0"
                  max="5"
                  step="0.01"
                  placeholder="4.75"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              {/* Passed */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <label className="flex h-[50px] items-center gap-3 rounded-xl border border-slate-300 px-4">
                  <input
                    type="checkbox"
                    name="passed"
                    checked={form.passed}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />

                  <span className="text-sm text-slate-700">
                    Passed
                  </span>
                </label>
              </div>
            </div>

            {/* Subjects */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">
                    Subject Results
                  </h4>

                  <p className="mt-1 text-xs text-slate-500">
                    বিষয়ভিত্তিক নম্বর এবং grade দিন।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addSubject}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  + Add Subject
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {form.subjects.map(
                  (subject, index) => (
                    <div
                      key={index}
                      className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]"
                    >
                      {/* Subject */}
                      <input
                        type="text"
                        name="subject"
                        value={subject.subject}
                        onChange={(event) =>
                          handleSubjectChange(
                            index,
                            event
                          )
                        }
                        required
                        placeholder="Subject"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-violet-500"
                      />

                      {/* Full */}
                      <input
                        type="number"
                        name="full_marks"
                        value={subject.full_marks}
                        onChange={(event) =>
                          handleSubjectChange(
                            index,
                            event
                          )
                        }
                        required
                        min="1"
                        placeholder="Full Marks"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-violet-500"
                      />

                      {/* Obtained */}
                      <input
                        type="number"
                        name="obtained_marks"
                        value={
                          subject.obtained_marks
                        }
                        onChange={(event) =>
                          handleSubjectChange(
                            index,
                            event
                          )
                        }
                        required
                        min="0"
                        placeholder="Obtained"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-violet-500"
                      />

                      {/* Grade */}
                      <input
                        type="text"
                        name="grade"
                        value={subject.grade}
                        onChange={(event) =>
                          handleSubjectChange(
                            index,
                            event
                          )
                        }
                        placeholder="A+"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-violet-500"
                      />

                      {/* Delete Subject */}
                      <button
                        type="button"
                        onClick={() =>
                          removeSubject(index)
                        }
                        disabled={
                          form.subjects.length === 1
                        }
                        className="rounded-xl bg-red-100 px-4 py-3 text-sm font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Result"
                    : "Add Result"}
              </button>
            </div>
          </form>
        </section>

        {/* =========================
            Result List
        ========================== */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              ফলাফল তালিকা
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              মোট ফলাফল: {results.length}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center text-slate-500">
              কোনো ফলাফল পাওয়া যায়নি।
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-4 py-3 text-sm">
                      #
                    </th>

                    <th className="px-4 py-3 text-sm">
                      শিক্ষার্থী
                    </th>

                    <th className="px-4 py-3 text-sm">
                      Class
                    </th>

                    <th className="px-4 py-3 text-sm">
                      Roll
                    </th>

                    <th className="px-4 py-3 text-sm">
                      Exam
                    </th>

                    <th className="px-4 py-3 text-sm">
                      Marks
                    </th>

                    <th className="px-4 py-3 text-sm">
                      GPA
                    </th>

                    <th className="px-4 py-3 text-sm">
                      Status
                    </th>

                    <th className="px-4 py-3 text-sm">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {results.map(
                    (result, index) => (
                      <tr
                        key={result.id}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-4">
                          {index + 1}
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-semibold">
                            {result.student?.name ||
                              "—"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {result.student
                              ?.student_id || ""}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          {result.student?.class ||
                            "—"}
                        </td>

                        <td className="px-4 py-4">
                          {result.student?.roll ||
                            "—"}
                        </td>

                        <td className="px-4 py-4">
                          {result.exam_name}
                        </td>

                        <td className="px-4 py-4">
                          {result.total_marks} /{" "}
                          {result.full_marks}
                        </td>

                        <td className="px-4 py-4 font-semibold text-violet-600">
                          {result.gpa}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              result.passed
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
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
                                handleEdit(result)
                              }
                              className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-200"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(result)
                              }
                              className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-200"
                            >
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
          )}
        </section>
      </main>
    </div>
  );
}
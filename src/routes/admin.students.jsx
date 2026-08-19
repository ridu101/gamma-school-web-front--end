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

function AdminStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // AUTH + LOAD STUDENTS
  // ==========================================

  useEffect(() => {
    async function initializePage() {
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
        // Verify Admin
        await apiRequest("/auth/me");

        // Get Students
        const response =
          await apiRequest("/students");

        setStudents(response.data || []);
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

      setStudents(response.data || []);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const toastId = toast.loading(
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
            body: JSON.stringify(
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
            body: JSON.stringify(
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
        Boolean(student.status),
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
  // DELETE CONFIRMATION TOAST
  // ==========================================

  const handleDelete = (
    student
  ) => {
    toast(
      (t) => (
        <div className="min-w-[260px]">
          <p className="font-bold text-white">
            শিক্ষার্থী মুছে ফেলবেন?
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-300">
            {student.name} এর তথ্য
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

                deleteStudent(
                  student
                );
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

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">
          শিক্ষার্থীদের তথ্য লোড হচ্ছে...
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
              Admin Panel
            </p>

            <h1 className="text-xl font-bold text-slate-900">
              শিক্ষার্থী ব্যবস্থাপনা
            </h1>
          </div>

          <Link
            to="/admin/dashboard"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* ==========================================
          CONTENT
      ========================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Heading */}

        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            শিক্ষার্থী পরিচালনা
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            এখান থেকে শিক্ষার্থী যোগ,
            সম্পাদনা এবং মুছে ফেলতে
            পারবেন।
          </p>
        </div>

        {/* ==========================================
            STUDENT FORM
        ========================================== */}

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-slate-900">
              {editingId
                ? "শিক্ষার্থীর তথ্য Edit করুন"
                : "নতুন শিক্ষার্থী যোগ করুন"}
            </h3>

            {editingId && (
              <button
                type="button"
                onClick={
                  handleCancelEdit
                }
                className="text-sm font-semibold text-red-500"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {/* Student ID */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Student ID *
              </label>

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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Name */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                শিক্ষার্থীর নাম *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={
                  handleChange
                }
                required
                placeholder="যেমন: Ridwan Ahmed"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Roll */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Roll *
              </label>

              <input
                type="text"
                name="roll"
                value={form.roll}
                onChange={
                  handleChange
                }
                required
                placeholder="01"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Class */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Class *
              </label>

              <input
                type="text"
                name="class"
                value={form.class}
                onChange={
                  handleChange
                }
                required
                placeholder="যেমন: 10"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Section */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Section
              </label>

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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Date of Birth */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                জন্ম তারিখ
              </label>

              <input
                type="date"
                name="date_of_birth"
                value={
                  form.date_of_birth
                }
                onChange={
                  handleChange
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                onChange={
                  handleChange
                }
                placeholder="student@gmail.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                onChange={
                  handleChange
                }
                placeholder="017XXXXXXXX"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                  name="status"
                  checked={
                    form.status
                  }
                  onChange={
                    handleChange
                  }
                  className="h-4 w-4"
                />

                <span className="text-sm text-slate-700">
                  Active Student
                </span>
              </label>
            </div>

            {/* Father */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                পিতার নাম
              </label>

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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Mother */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                মাতার নাম
              </label>

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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Address */}

            <div className="md:col-span-2 lg:col-span-3">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ঠিকানা
              </label>

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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Submit */}

            <div className="md:col-span-2 lg:col-span-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Student"
                    : "Add Student"}
              </button>
            </div>
          </form>
        </section>

        {/* ==========================================
            STUDENT LIST
        ========================================== */}

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              শিক্ষার্থী তালিকা
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              মোট শিক্ষার্থী:{" "}
              {students.length}
            </p>
          </div>

          {students.length === 0 ? (
            <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center text-slate-500">
              কোনো শিক্ষার্থী পাওয়া
              যায়নি।
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-4 py-3 text-sm font-semibold">
                      #
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Student ID
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      নাম
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Class
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Section
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Roll
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      যোগাযোগ
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
                  {students.map(
                    (
                      student,
                      index
                    ) => (
                      <tr
                        key={
                          student.id
                        }
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-4 text-sm">
                          {index + 1}
                        </td>

                        <td className="px-4 py-4 text-sm font-medium text-slate-700">
                          {
                            student.student_id
                          }
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-900">
                            {
                              student.name
                            }
                          </p>

                          {student.email && (
                            <p className="mt-1 text-xs text-slate-500">
                              {
                                student.email
                              }
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {
                            student.class
                          }
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {student.section ||
                            "—"}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {
                            student.roll
                          }
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {student.phone ||
                            "—"}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              student.status
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {student.status
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  student
                                )
                              }
                              className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-200"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  student
                                )
                              }
                              className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-200"
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
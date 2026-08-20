import { useEffect, useState } from "react";

import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import toast from "react-hot-toast";

import { apiRequest } from "../services/api";

export const Route = createFileRoute("/admin/teachers")({
  component: AdminTeachers,
});

// ==========================================
// EMPTY FORM
// ==========================================

const emptyForm = {
  name: "",
  designation: "",
  department: "",
  email: "",
  phone: "",
  bio: "",
  is_active: true,
};

// ==========================================
// COMMON INPUT STYLE
// ==========================================

const inputClass =
  "w-full rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

// ==========================================
// ADMIN TEACHERS
// ==========================================

function AdminTeachers() {
  const navigate = useNavigate();

  const [teachers, setTeachers] =
    useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [photoFile, setPhotoFile] =
    useState(null);

  const [photoPreview, setPhotoPreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // ==========================================
  // AUTH + LOAD TEACHERS
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

        const response =
          await apiRequest("/teachers");

        setTeachers(
          response.data || []
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
  // RELOAD TEACHERS
  // ==========================================

  const loadTeachers = async () => {
    try {
      const response =
        await apiRequest("/teachers");

      setTeachers(
        response.data || []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "শিক্ষকদের তথ্য লোড করা যায়নি।"
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
  // PHOTO CHANGE
  // ==========================================

  const handlePhotoChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      toast.error(
        "শুধু JPG, JPEG, PNG অথবা WEBP ছবি ব্যবহার করুন।"
      );

      event.target.value = "";

      return;
    }

    // Maximum 3MB
    if (
      file.size >
      3 * 1024 * 1024
    ) {
      toast.error(
        "ছবির সাইজ সর্বোচ্চ 3MB হতে পারবে।"
      );

      event.target.value = "";

      return;
    }

    setPhotoFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setPhotoPreview(
      previewUrl
    );
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm(emptyForm);

    setEditingId(null);

    setPhotoFile(null);

    setPhotoPreview("");
  };

  // ==========================================
  // ADD / UPDATE TEACHER
  // ==========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const toastId =
      toast.loading(
        editingId
          ? "শিক্ষকের তথ্য আপডেট করা হচ্ছে..."
          : "শিক্ষক যোগ করা হচ্ছে..."
      );

    try {
      setSaving(true);

      const formData =
        new FormData();

      formData.append(
        "name",
        form.name
      );

      formData.append(
        "designation",
        form.designation || ""
      );

      formData.append(
        "department",
        form.department || ""
      );

      formData.append(
        "email",
        form.email || ""
      );

      formData.append(
        "phone",
        form.phone || ""
      );

      formData.append(
        "bio",
        form.bio || ""
      );

      formData.append(
        "is_active",
        form.is_active ? "1" : "0"
      );

      if (photoFile) {
        formData.append(
          "photo",
          photoFile
        );
      }

      // ======================================
      // UPDATE
      // ======================================

      if (editingId) {
        formData.append(
          "_method",
          "PUT"
        );

        await apiRequest(
          `/teachers/${editingId}`,
          {
            method: "POST",
            body: formData,
          }
        );

        toast.success(
          "শিক্ষকের তথ্য সফলভাবে আপডেট হয়েছে।",
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
          "/teachers",
          {
            method: "POST",
            body: formData,
          }
        );

        toast.success(
          "নতুন শিক্ষক সফলভাবে যোগ হয়েছে।",
          {
            id: toastId,
          }
        );
      }

      resetForm();

      await loadTeachers();
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "শিক্ষকের তথ্য সংরক্ষণ করা যায়নি।",
        {
          id: toastId,
        }
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT TEACHER
  // ==========================================

  const handleEdit = (
    teacher
  ) => {
    setEditingId(
      teacher.id
    );

    setForm({
      name:
        teacher.name || "",

      designation:
        teacher.designation || "",

      department:
        teacher.department || "",

      email:
        teacher.email || "",

      phone:
        teacher.phone || "",

      bio:
        teacher.bio || "",

      is_active:
        Boolean(
          teacher.is_active
        ),
    });

    setPhotoPreview(
      teacher.photo || ""
    );

    setPhotoFile(null);

    toast(
      "শিক্ষকের তথ্য Edit Mode-এ খোলা হয়েছে।",
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
  // DELETE TEACHER
  // ==========================================

  const deleteTeacher = async (
    teacher
  ) => {
    const toastId =
      toast.loading(
        "শিক্ষক মুছে ফেলা হচ্ছে..."
      );

    try {
      await apiRequest(
        `/teachers/${teacher.id}`,
        {
          method: "DELETE",
        }
      );

      if (
        editingId ===
        teacher.id
      ) {
        resetForm();
      }

      await loadTeachers();

      toast.success(
        "শিক্ষক সফলভাবে মুছে ফেলা হয়েছে।",
        {
          id: toastId,
        }
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "শিক্ষক মুছে ফেলা যায়নি।",
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
    teacher
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
                শিক্ষক মুছে ফেলবেন?
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                <span className="font-bold text-slate-700">
                  {teacher.name}
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

                deleteTeacher(
                  teacher
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
              linear-gradient(rgba(37,99,235,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(37,99,235,0.07) 1px, transparent 1px)
            `,
            backgroundSize:
              "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="text-sm font-semibold text-slate-600">
            শিক্ষকদের তথ্য
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

      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-100/60 via-cyan-100/25 to-transparent" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="relative z-20 border-b border-slate-300/80 bg-white/90 shadow-[0_5px_20px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 text-white shadow-lg shadow-blue-300/40">
              <TeacherIcon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-blue-700 sm:text-xs">
                Admin Management
              </p>

              <h1 className="truncate text-lg font-extrabold text-slate-900 sm:text-xl">
                শিক্ষক ব্যবস্থাপনা
              </h1>
            </div>
          </div>

          {/* DASHBOARD */}

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
            TEACHER FORM
        ========================================== */}

        <section className="overflow-hidden rounded-[30px] border border-slate-300/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
          {/* GRADIENT LINE */}

          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500" />

          {/* FORM HEADER */}

          <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50/70 via-white to-teal-50/70 px-5 py-5 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-700 shadow-sm">
                  {editingId ? (
                    <EditIcon className="h-5 w-5" />
                  ) : (
                    <PlusIcon className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700">
                    Teacher Form
                  </p>

                  <h2 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                    {editingId
                      ? "শিক্ষকের তথ্য Edit করুন"
                      : "নতুন শিক্ষক যোগ করুন"}
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    শিক্ষকের ব্যক্তিগত,
                    পেশাগত এবং যোগাযোগের
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

          {/* ==========================================
              FORM BODY
          ========================================== */}

          <div className="p-5 sm:p-6 lg:p-7">
            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-7"
            >
              {/* ======================================
                  PROFESSIONAL INFORMATION
              ====================================== */}

              <FormSection
                eyebrow="Professional Information"
                title="শিক্ষকের মূল তথ্য"
                icon={
                  <TeacherIcon className="h-5 w-5" />
                }
              >
                <div className="grid gap-5 md:grid-cols-2">
                  {/* Name */}

                  <Field
                    label="শিক্ষকের নাম"
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
                      placeholder="যেমন: Mohammad Rahman"
                      className={
                        inputClass
                      }
                    />
                  </Field>

                  {/* Designation */}

                  <Field label="পদবী">
                    <input
                      type="text"
                      name="designation"
                      value={
                        form.designation
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="যেমন: Senior Lecturer"
                      className={
                        inputClass
                      }
                    />
                  </Field>

                  {/* Department */}

                  <Field label="বিভাগ">
                    <input
                      type="text"
                      name="department"
                      value={
                        form.department
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="যেমন: Computer Science"
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
                          Active Teacher
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                          শিক্ষক active
                          থাকবেন কি না
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

                    <div
                      className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
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
                    </div>
                  </div>
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
                <div className="grid gap-5 md:grid-cols-2">
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
                      placeholder="teacher@gmail.com"
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
                </div>
              </FormSection>

              {/* ======================================
                  PHOTO
              ====================================== */}

              <FormSection
                eyebrow="Profile Photo"
                title="শিক্ষকের ছবি"
                icon={
                  <CameraIcon className="h-5 w-5" />
                }
              >
                <div className="overflow-hidden rounded-[24px] border border-dashed border-blue-200 bg-gradient-to-br from-blue-50/60 via-white to-teal-50/50 p-4 sm:p-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    {/* Preview */}

                    <div className="relative mx-auto shrink-0 sm:mx-0">
                      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[24px] border-4 border-white bg-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
                        {photoPreview ? (
                          <img
                            src={
                              photoPreview
                            }
                            alt="Teacher Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 px-3 text-center">
                            <UserIcon className="h-8 w-8 text-slate-300" />

                            <span className="text-[11px] font-semibold leading-4 text-slate-400">
                              কোনো ছবি নির্বাচন
                              করা হয়নি
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-4 border-white bg-blue-600 text-white shadow-lg">
                        <CameraIcon className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Upload */}

                    <div className="flex-1">
                      <p className="text-sm font-extrabold text-slate-800">
                        Profile Photo Upload
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        পরিষ্কার এবং square
                        profile photo ব্যবহার
                        করলে ভালো দেখাবে।
                      </p>

                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={
                          handlePhotoChange
                        }
                        className="mt-4 block w-full cursor-pointer rounded-2xl border border-slate-300 bg-white text-sm text-slate-600 file:mr-4 file:border-0 file:bg-gradient-to-r file:from-blue-600 file:to-cyan-600 file:px-4 file:py-3 file:text-sm file:font-bold file:text-white hover:file:from-blue-700 hover:file:to-cyan-700"
                      />

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700">
                          JPG
                        </span>

                        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700">
                          PNG
                        </span>

                        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700">
                          WEBP
                        </span>

                        <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">
                          Max 3MB
                        </span>
                      </div>

                      {editingId &&
                        photoPreview && (
                          <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                            <InfoIcon className="h-4 w-4 shrink-0" />

                            নতুন ছবি না দিলে
                            আগের ছবিই থাকবে।
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </FormSection>

              {/* ======================================
                  BIO
              ====================================== */}

              <FormSection
                eyebrow="Teacher Profile"
                title="শিক্ষক সম্পর্কে"
                icon={
                  <BioIcon className="h-5 w-5" />
                }
              >
                <Field label="Bio">
                  <textarea
                    name="bio"
                    value={
                      form.bio
                    }
                    onChange={
                      handleChange
                    }
                    rows="4"
                    placeholder="শিক্ষক সম্পর্কে সংক্ষিপ্ত তথ্য..."
                    className={`${inputClass} resize-none`}
                  />
                </Field>
              </FormSection>

              {/* ======================================
                  SUBMIT
              ====================================== */}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(37,99,235,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(37,99,235,0.32)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                      Saving...
                    </>
                  ) : editingId ? (
                    <>
                      <EditIcon className="h-4 w-4" />

                      Update Teacher
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4" />

                      Add Teacher
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
            TEACHER LIST
        ========================================== */}

        <section className="mt-6 overflow-hidden rounded-[30px] border border-slate-300/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.11)] backdrop-blur-xl">
          {/* LIST HEADER */}

          <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50/70 via-white to-teal-50/70 px-5 py-5 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-700 shadow-sm">
                  <ListIcon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700">
                    Teacher Directory
                  </p>

                  <h2 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                    শিক্ষক তালিকা
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    মোট শিক্ষক:{" "}
                    <span className="font-extrabold text-blue-700">
                      {teachers.length}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  loadTeachers
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100"
              >
                <RefreshIcon className="h-4 w-4" />

                Refresh
              </button>
            </div>
          </div>

          {/* LIST CONTENT */}

          <div className="p-4 sm:p-5">
            {teachers.length === 0 ? (
              <div className="flex min-h-[230px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-slate-200 bg-slate-50 text-slate-400">
                  <TeacherIcon className="h-8 w-8" />
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-slate-700">
                  কোনো শিক্ষক পাওয়া
                  যায়নি
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  নতুন শিক্ষক যোগ করলে
                  এখানে দেখা যাবে।
                </p>
              </div>
            ) : (
              <>
                {/* ==================================
                    MOBILE CARDS
                ================================== */}

                <div className="grid gap-4 md:hidden">
                  {teachers.map(
                    (
                      teacher,
                      index
                    ) => (
                      <article
                        key={
                          teacher.id
                        }
                        className="relative overflow-hidden rounded-[24px] border border-slate-300 bg-white p-5 shadow-sm"
                      >
                        {/* Accent */}

                        <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-blue-600 via-cyan-500 to-teal-500" />

                        {/* Top */}

                        <div className="flex items-start gap-4">
                          {/* Photo */}

                          <div className="shrink-0">
                            {teacher.photo ? (
                              <img
                                src={
                                  teacher.photo
                                }
                                alt={
                                  teacher.name
                                }
                                className="h-16 w-16 rounded-[18px] border-2 border-white object-cover shadow-md ring-1 ring-slate-200"
                              />
                            ) : (
                              <div className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-blue-100 bg-blue-50 text-blue-600">
                                <TeacherIcon className="h-7 w-7" />
                              </div>
                            )}
                          </div>

                          {/* Info */}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-blue-700">
                                  Teacher #
                                  {index + 1}
                                </p>

                                <h3 className="mt-1 break-words text-lg font-extrabold text-slate-900">
                                  {
                                    teacher.name
                                  }
                                </h3>
                              </div>

                              <StatusBadge
                                active={
                                  teacher.is_active
                                }
                              />
                            </div>

                            {teacher.designation && (
                              <p className="mt-1 text-sm font-bold text-blue-700">
                                {
                                  teacher.designation
                                }
                              </p>
                            )}

                            {teacher.department && (
                              <p className="mt-1 text-xs font-semibold text-slate-500">
                                {
                                  teacher.department
                                }
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Details */}

                        <div className="mt-4 grid grid-cols-1 gap-3">
                          <TeacherInfo
                            label="Phone"
                            value={
                              teacher.phone ||
                              "—"
                            }
                            icon={
                              <PhoneIcon className="h-4 w-4" />
                            }
                          />

                          <TeacherInfo
                            label="Email"
                            value={
                              teacher.email ||
                              "—"
                            }
                            icon={
                              <MailIcon className="h-4 w-4" />
                            }
                          />
                        </div>

                        {/* Actions */}

                        <div className="mt-4 flex gap-2 border-t border-slate-200 pt-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                teacher
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
                                teacher
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
                      <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/60 text-left">
                        <TableHeading>
                          #
                        </TableHeading>

                        <TableHeading>
                          ছবি
                        </TableHeading>

                        <TableHeading>
                          নাম
                        </TableHeading>

                        <TableHeading>
                          পদবী
                        </TableHeading>

                        <TableHeading>
                          বিভাগ
                        </TableHeading>

                        <TableHeading>
                          Email
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
                      {teachers.map(
                        (
                          teacher,
                          index
                        ) => (
                          <tr
                            key={
                              teacher.id
                            }
                            className="border-b border-slate-100 transition last:border-0 hover:bg-blue-50/30"
                          >
                            {/* Number */}

                            <td className="px-4 py-4 text-sm font-bold text-slate-400">
                              {index + 1}
                            </td>

                            {/* Photo */}

                            <td className="px-4 py-4">
                              {teacher.photo ? (
                                <img
                                  src={
                                    teacher.photo
                                  }
                                  alt={
                                    teacher.name
                                  }
                                  className="h-14 w-14 rounded-[16px] border-2 border-white object-cover shadow-md ring-1 ring-slate-200"
                                />
                              ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-[16px] border border-blue-100 bg-blue-50 text-blue-600">
                                  <TeacherIcon className="h-6 w-6" />
                                </div>
                              )}
                            </td>

                            {/* Name */}

                            <td className="px-4 py-4">
                              <div>
                                <p className="font-extrabold text-slate-900">
                                  {
                                    teacher.name
                                  }
                                </p>

                                {teacher.phone && (
                                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                    <PhoneIcon className="h-3.5 w-3.5 text-blue-500" />

                                    <span>
                                      {
                                        teacher.phone
                                      }
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Designation */}

                            <td className="px-4 py-4">
                              {teacher.designation ? (
                                <span className="inline-flex rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                                  {
                                    teacher.designation
                                  }
                                </span>
                              ) : (
                                <span className="text-sm text-slate-400">
                                  —
                                </span>
                              )}
                            </td>

                            {/* Department */}

                            <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                              {teacher.department ||
                                "—"}
                            </td>

                            {/* Email */}

                            <td className="px-4 py-4">
                              <div className="flex max-w-[220px] items-center gap-2 text-sm font-semibold text-slate-600">
                                <MailIcon className="h-4 w-4 shrink-0 text-teal-600" />

                                <span className="truncate">
                                  {teacher.email ||
                                    "—"}
                                </span>
                              </div>
                            </td>

                            {/* Status */}

                            <td className="px-4 py-4">
                              <StatusBadge
                                active={
                                  teacher.is_active
                                }
                              />
                            </td>

                            {/* Actions */}

                            <td className="px-4 py-4">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(
                                      teacher
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
                                      teacher
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
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-700 shadow-sm">
          {icon}
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-700">
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

function StatusBadge({
  active,
}) {
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
// TEACHER INFO
// ==========================================

function TeacherInfo({
  label,
  value,
  icon,
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-bold text-slate-700">
          {value}
        </p>
      </div>
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

      <path
        d="M18 5h3v6h-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
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
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M8 9h8M8 13h8M8 17h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ==========================================
// CAMERA ICON
// ==========================================

function CameraIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="13"
        r="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

// ==========================================
// BIO ICON
// ==========================================

function BioIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M6 4h12v16H6V4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M9 8h6M9 12h6M9 16h4"
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
// INFO ICON
// ==========================================

function InfoIcon({
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
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M12 11v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="8"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import toast from "react-hot-toast";

import { apiRequest } from "../services/api";

export const Route = createFileRoute("/admin/notices")({
  component: AdminNotices,
});

const emptyForm = {
  title: "",
  description: "",
  category: "সাধারণ",
  publish_date: "",
  is_active: true,
};

// ==========================================
// ADMIN NOTICES
// ==========================================

function AdminNotices() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyForm);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [currentFile, setCurrentFile] =
    useState(null);

  // ==========================================
  // FETCH NOTICES
  // ==========================================

  const fetchNotices = async () => {
    try {
      setLoading(true);

      const response =
        await apiRequest("/notices");

      setNotices(response.data || []);
    } catch (error) {
      toast.error(
        error.message ||
          "নোটিশ লোড করা যায়নি"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHECK ADMIN LOGIN
  // ==========================================

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        await apiRequest("/auth/me");
        await fetchNotices();
      } catch (error) {
        window.localStorage.removeItem(
          "admin_token"
        );

        window.localStorage.removeItem(
          "admin_user"
        );

        toast.error(
          "দয়া করে আবার লগইন করুন"
        );

        navigate({
          to: "/admin/login",
          replace: true,
        });
      }
    };

    checkAdmin();
  }, [navigate]);

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

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // FILE CHANGE
  // ==========================================

  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0] || null;

    setSelectedFile(file);
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setEditingId(null);

    setFormData(emptyForm);

    setSelectedFile(null);

    setCurrentFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // ADD / UPDATE NOTICE
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      toast.error(
        "নোটিশের শিরোনাম লিখুন"
      );

      return;
    }

    if (!formData.description.trim()) {
      toast.error(
        "নোটিশের বিস্তারিত লিখুন"
      );

      return;
    }

    const toastId = toast.loading(
      editingId
        ? "নোটিশ আপডেট হচ্ছে..."
        : "নোটিশ সংরক্ষণ হচ্ছে..."
    );

    try {
      setSaving(true);

      const data = new FormData();

      data.append(
        "title",
        formData.title
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "category",
        formData.category
      );

      if (formData.publish_date) {
        data.append(
          "publish_date",
          formData.publish_date
        );
      }

      data.append(
        "is_active",
        formData.is_active ? "1" : "0"
      );

      if (selectedFile) {
        data.append(
          "file",
          selectedFile
        );
      }

      // ======================================
      // UPDATE
      // Laravel multipart update:
      // POST + _method=PUT
      // ======================================

      if (editingId) {
        data.append("_method", "PUT");

        await apiRequest(
          `/notices/${editingId}`,
          {
            method: "POST",
            body: data,
          }
        );

        toast.success(
          "নোটিশ সফলভাবে আপডেট হয়েছে",
          {
            id: toastId,
          }
        );
      }

      // ======================================
      // CREATE
      // ======================================

      else {
        await apiRequest("/notices", {
          method: "POST",
          body: data,
        });

        toast.success(
          "নোটিশ সফলভাবে যোগ হয়েছে",
          {
            id: toastId,
          }
        );
      }

      resetForm();

      await fetchNotices();
    } catch (error) {
      toast.error(
        error.message ||
          "নোটিশ সংরক্ষণ করা যায়নি",
        {
          id: toastId,
        }
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (notice) => {
    setEditingId(notice.id);

    setFormData({
      title:
        notice.title || "",

      description:
        notice.description || "",

      category:
        notice.category || "সাধারণ",

      publish_date:
        notice.publish_date
          ? String(
              notice.publish_date
            ).substring(0, 10)
          : "",

      is_active:
        Boolean(
          notice.is_active
        ),
    });

    setSelectedFile(null);

    setCurrentFile(
      notice.file_url || null
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    toast.success(
      "নোটিশ Edit Mode-এ এসেছে"
    );
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancelEdit = () => {
    resetForm();

    toast(
      "Edit বাতিল করা হয়েছে"
    );
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = (notice) => {
    toast.custom(
      (t) => (
        <div
          className={`w-[calc(100vw-32px)] max-w-[370px] rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.22)] ${
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
                নোটিশ Delete করবেন?
              </h3>

              <p className="mt-1 break-words text-sm leading-6 text-slate-500">
                {notice.title}
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
              Cancel
            </button>

            <button
              type="button"
              onClick={async () => {
                toast.dismiss(t.id);

                const deleteToast =
                  toast.loading(
                    "নোটিশ Delete হচ্ছে..."
                  );

                try {
                  await apiRequest(
                    `/notices/${notice.id}`,
                    {
                      method: "DELETE",
                    }
                  );

                  toast.success(
                    "নোটিশ সফলভাবে Delete হয়েছে",
                    {
                      id: deleteToast,
                    }
                  );

                  if (
                    editingId === notice.id
                  ) {
                    resetForm();
                  }

                  await fetchNotices();
                } catch (error) {
                  toast.error(
                    error.message ||
                      "নোটিশ Delete করা যায়নি",
                    {
                      id: deleteToast,
                    }
                  );
                }
              }}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-700"
            >
              Delete
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
  // ACTIVE / INACTIVE
  // ==========================================

  const handleToggleStatus = async (
    notice
  ) => {
    const updatedStatus =
      !notice.is_active;

    const toastId = toast.loading(
      "Status পরিবর্তন হচ্ছে..."
    );

    try {
      await apiRequest(
        `/notices/${notice.id}`,
        {
          method: "PUT",

          body: JSON.stringify({
            title:
              notice.title,

            description:
              notice.description,

            category:
              notice.category ||
              "সাধারণ",

            publish_date:
              notice.publish_date
                ? String(
                    notice.publish_date
                  ).substring(0, 10)
                : null,

            is_active:
              updatedStatus,
          }),
        }
      );

      toast.success(
        updatedStatus
          ? "নোটিশ Active করা হয়েছে"
          : "নোটিশ Inactive করা হয়েছে",
        {
          id: toastId,
        }
      );

      await fetchNotices();
    } catch (error) {
      toast.error(
        error.message ||
          "Status পরিবর্তন করা যায়নি",
        {
          id: toastId,
        }
      );
    }
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "তারিখ নেই";
    }

    return new Date(
      date
    ).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-teal-200/35 via-cyan-100/20 to-transparent" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="relative z-20 border-b border-slate-300/80 bg-white/90 shadow-[0_5px_20px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          {/* Left */}

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-300/50">
              <NoticeIcon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-teal-700 sm:text-xs">
                Admin Management
              </p>

              <h1 className="truncate text-lg font-extrabold text-slate-900 sm:text-xl">
                নোটিশ ব্যবস্থাপনা
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
            FORM CARD
        ========================================== */}

        <section className="overflow-hidden rounded-[30px] border border-slate-300/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
          {/* top gradient */}

          <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500" />

          {/* Card Header */}

          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-teal-50/70 px-5 py-5 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-teal-100 bg-white text-teal-700 shadow-sm">
                  {editingId ? (
                    <EditIcon className="h-5 w-5" />
                  ) : (
                    <PlusIcon className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-teal-700">
                    Notice Form
                  </p>

                  <h2 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                    {editingId
                      ? "নোটিশ Edit করুন"
                      : "নতুন নোটিশ যোগ করুন"}
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

          {/* Form Body */}

          <div className="p-5 sm:p-6 lg:p-7">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Title */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  নোটিশের শিরোনাম
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <TitleIcon className="h-5 w-5" />
                  </span>

                  <input
                    type="text"
                    name="title"
                    value={
                      formData.title
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="নোটিশের শিরোনাম লিখুন"
                    className="w-full rounded-2xl border border-slate-300 bg-[#f3f6f8] py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
                  />
                </div>
              </div>

              {/* Description */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  বিস্তারিত
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  rows="6"
                  placeholder="নোটিশের বিস্তারিত লিখুন"
                  className="w-full resize-none rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
              </div>

              {/* Category + Date */}

              <div className="grid gap-5 md:grid-cols-2">
                {/* Category */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Category
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition hover:border-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
                  >
                    <option value="পরীক্ষা">
                      পরীক্ষা
                    </option>

                    <option value="ভর্তি">
                      ভর্তি
                    </option>

                    <option value="সাধারণ">
                      সাধারণ
                    </option>

                    <option value="অন্যান্য">
                      অন্যান্য
                    </option>
                  </select>
                </div>

                {/* Publish Date */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    প্রকাশের তারিখ
                  </label>

                  <input
                    type="date"
                    name="publish_date"
                    value={
                      formData.publish_date
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition hover:border-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
                  />
                </div>
              </div>

              {/* File + Status */}

              <div className="grid gap-5 md:grid-cols-2">
                {/* File */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    নোটিশের ফাইল
                  </label>

                  <div className="rounded-2xl border border-dashed border-slate-300 bg-[#f3f6f8] p-3 transition hover:border-teal-400">
                    <input
                      ref={
                        fileInputRef
                      }
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={
                        handleFileChange
                      }
                      className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-teal-50 file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-teal-700 hover:file:bg-teal-100"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    PDF, JPG, PNG, DOC,
                    DOCX — সর্বোচ্চ 5MB
                  </p>

                  {selectedFile && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700">
                      <FileIcon className="h-4 w-4 shrink-0" />

                      <span className="truncate">
                        {selectedFile.name}
                      </span>
                    </div>
                  )}

                  {editingId &&
                    currentFile &&
                    !selectedFile && (
                      <a
                        href={
                          currentFile
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                      >
                        <FileIcon className="h-4 w-4" />

                        বর্তমান ফাইল দেখুন
                      </a>
                    )}
                </div>

                {/* Status */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Status
                  </label>

                  <div className="flex min-h-[70px] items-center justify-between gap-4 rounded-2xl border border-slate-300 bg-[#f3f6f8] px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Notice Status
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        নোটিশটি website-এ
                        দেখানো হবে কি না
                      </p>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={
                          formData.is_active
                        }
                        onChange={
                          handleChange
                        }
                        className="peer sr-only"
                      />

                      <div className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-teal-600 peer-focus:ring-4 peer-focus:ring-teal-100 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:after:translate-x-5" />
                    </label>
                  </div>

                  <div
                    className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                      formData.is_active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-600"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        formData.is_active
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }`}
                    />

                    {formData.is_active
                      ? "Active"
                      : "Inactive"}
                  </div>
                </div>
              </div>

              {/* Submit */}

              <div className="border-t border-slate-200 pt-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(13,148,136,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(13,148,136,0.34)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                      Please wait...
                    </>
                  ) : editingId ? (
                    <>
                      <EditIcon className="h-4 w-4" />

                      Update Notice
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4" />

                      Add Notice
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ==========================================
            NOTICE LIST
        ========================================== */}

        <section className="mt-6 overflow-hidden rounded-[30px] border border-slate-300/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.11)] backdrop-blur-xl">
          {/* Header */}

          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-teal-50/70 px-5 py-5 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-teal-100 bg-white text-teal-700 shadow-sm">
                  <ListIcon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-teal-700">
                    Notice Directory
                  </p>

                  <h2 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                    সকল নোটিশ
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    মোট{" "}
                    <span className="font-bold text-teal-700">
                      {notices.length}
                    </span>{" "}
                    টি নোটিশ
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  fetchNotices
                }
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
              >
                <RefreshIcon
                  className={`h-4 w-4 ${
                    loading
                      ? "animate-spin"
                      : ""
                  }`}
                />

                Refresh
              </button>
            </div>
          </div>

          {/* Content */}

          <div className="p-4 sm:p-5">
            {loading ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />

                <p className="text-sm font-semibold text-slate-500">
                  নোটিশ লোড হচ্ছে...
                </p>
              </div>
            ) : notices.length === 0 ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-slate-200 bg-slate-50 text-slate-400">
                  <NoticeIcon className="h-8 w-8" />
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-slate-700">
                  এখনো কোনো নোটিশ নেই
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  নতুন নোটিশ যোগ করলে এখানে দেখা যাবে।
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {notices.map(
                  (notice) => (
                    <article
                      key={notice.id}
                      className="group relative overflow-hidden rounded-[24px] border border-slate-300/80 bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-[0_16px_38px_rgba(15,23,42,0.11)] sm:p-6"
                    >
                      {/* Accent */}

                      <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-cyan-500 via-teal-500 to-emerald-500" />

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        {/* Notice Info */}

                        <div className="min-w-0 flex-1">
                          {/* Badges */}

                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <CategoryBadge
                              category={
                                notice.category ||
                                "সাধারণ"
                              }
                            />

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${
                                notice.is_active
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-red-200 bg-red-50 text-red-600"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  notice.is_active
                                    ? "bg-emerald-500"
                                    : "bg-red-500"
                                }`}
                              />

                              {notice.is_active
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </div>

                          {/* Title */}

                          <h3 className="break-words text-lg font-extrabold leading-7 text-slate-900 sm:text-xl">
                            {notice.title}
                          </h3>

                          {/* Description */}

                          <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-slate-600">
                            {
                              notice.description
                            }
                          </p>

                          {/* Meta */}

                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
                              <CalendarIcon className="h-4 w-4 text-teal-600" />

                              {formatDate(
                                notice.publish_date
                              )}
                            </div>

                            {notice.file_url && (
                              <a
                                href={
                                  notice.file_url
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                              >
                                <DownloadIcon className="h-4 w-4" />

                                ফাইল দেখুন / Download
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Actions */}

                        <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-slate-200 pt-4 lg:max-w-[250px] lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                          {/* Toggle */}

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStatus(
                                notice
                              )
                            }
                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                              notice.is_active
                                ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            <PowerIcon className="h-4 w-4" />

                            {notice.is_active
                              ? "Inactive"
                              : "Active"}
                          </button>

                          {/* Edit */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                notice
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                          >
                            <EditIcon className="h-4 w-4" />

                            Edit
                          </button>

                          {/* Delete */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                notice
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                          >
                            <TrashIcon className="h-4 w-4" />

                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
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
// CATEGORY BADGE
// ==========================================

function CategoryBadge({ category }) {
  const styles = {
    পরীক্ষা:
      "border-violet-200 bg-violet-50 text-violet-700",

    ভর্তি:
      "border-blue-200 bg-blue-50 text-blue-700",

    সাধারণ:
      "border-teal-200 bg-teal-50 text-teal-700",

    অন্যান্য:
      "border-orange-200 bg-orange-50 text-orange-700",
  };

  const current =
    styles[category] ||
    styles["সাধারণ"];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${current}`}
    >
      {category}
    </span>
  );
}

// ==========================================
// ICONS
// ==========================================

function NoticeIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M6 3.5h12v17H6v-17Z"
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

function PlusIcon({ className = "" }) {
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

function EditIcon({ className = "" }) {
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

function TrashIcon({ className = "" }) {
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

function CloseIcon({ className = "" }) {
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

function TitleIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M5 6h14M12 6v12M8 18h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FileIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M6 3h8l4 4v14H6V3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M14 3v5h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ListIcon({ className = "" }) {
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

function CalendarIcon({
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
    </svg>
  );
}

function DownloadIcon({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 4v11M8 11l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 19h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PowerIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 3v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M7.1 6.7a8 8 0 1 0 9.8 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
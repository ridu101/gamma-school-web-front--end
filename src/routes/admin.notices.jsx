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
  // ADD / UPDATE
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

      if (editingId) {
        /*
          Laravel multipart file update-এর জন্য
          POST + _method=PUT ব্যবহার করছি
        */
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
      } else {
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
      title: notice.title || "",
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

      is_active: Boolean(
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
          className={`w-[340px] rounded-xl border border-gray-200 bg-white p-4 shadow-xl ${
            t.visible
              ? "animate-enter"
              : "animate-leave"
          }`}
        >
          <h3 className="font-semibold text-gray-900">
            নোটিশ Delete করবেন?
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            {notice.title}
          </p>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() =>
                toast.dismiss(t.id)
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
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
                    editingId ===
                    notice.id
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
              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
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
            title: notice.title,
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Notice Management
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              স্কুলের সকল নোটিশ পরিচালনা করুন
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            Dashboard
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Form */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingId
                  ? "নোটিশ Edit করুন"
                  : "নতুন নোটিশ যোগ করুন"}
              </h2>

              {editingId && (
                <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                  আপনি এখন Edit Mode-এ আছেন
                </p>
              )}
            </div>

            {editingId && (
              <button
                type="button"
                onClick={
                  handleCancelEdit
                }
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                নোটিশের শিরোনাম *
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="নোটিশের শিরোনাম লিখুন"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                বিস্তারিত *
              </label>

              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={handleChange}
                rows="6"
                placeholder="নোটিশের বিস্তারিত লিখুন"
                className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Category *
                </label>

                <select
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  প্রকাশের তারিখ
                </label>

                <input
                  type="date"
                  name="publish_date"
                  value={
                    formData.publish_date
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* File Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  নোটিশের ফাইল
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={
                    handleFileChange
                  }
                  className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:font-medium file:text-teal-700 hover:file:bg-teal-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                />

                <p className="mt-2 text-xs text-gray-500 dark:text-slate-500">
                  PDF, JPG, PNG, DOC,
                  DOCX — সর্বোচ্চ 5MB
                </p>

                {selectedFile && (
                  <p className="mt-2 text-sm font-medium text-teal-600">
                    নতুন ফাইল:{" "}
                    {selectedFile.name}
                  </p>
                )}

                {editingId &&
                  currentFile &&
                  !selectedFile && (
                    <a
                      href={currentFile}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                      বর্তমান ফাইল দেখুন
                    </a>
                  )}
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Status
                </label>

                <label className="flex h-[50px] cursor-pointer items-center gap-3 rounded-xl border border-gray-300 px-4 dark:border-slate-700">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={
                      formData.is_active
                    }
                    onChange={
                      handleChange
                    }
                    className="h-5 w-5 accent-teal-600"
                  />

                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                    {formData.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-teal-600 px-6 py-3 font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Please wait..."
                : editingId
                  ? "Update Notice"
                  : "Add Notice"}
            </button>
          </form>
        </div>

        {/* Notice List */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-gray-200 px-6 py-5 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  সকল নোটিশ
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  মোট {notices.length} টি
                  নোটিশ
                </p>
              </div>

              <button
                type="button"
                onClick={
                  fetchNotices
                }
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-500 dark:text-slate-400">
              নোটিশ লোড হচ্ছে...
            </div>
          ) : notices.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg font-medium text-gray-700 dark:text-slate-300">
                এখনো কোনো নোটিশ নেই
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-slate-800">
              {notices.map(
                (notice) => (
                  <div
                    key={notice.id}
                    className="p-6 transition hover:bg-gray-50 dark:hover:bg-slate-800/40"
                  >
                    <div className="flex flex-col justify-between gap-5 lg:flex-row">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {notice.title}
                          </h3>

                          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
                            {notice.category ||
                              "সাধারণ"}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              notice.is_active
                                ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                            }`}
                          >
                            {notice.is_active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>

                        <p className="whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-slate-400">
                          {
                            notice.description
                          }
                        </p>

                        <p className="mt-3 text-xs font-medium text-gray-500 dark:text-slate-500">
                          প্রকাশের তারিখ:{" "}
                          {formatDate(
                            notice.publish_date
                          )}
                        </p>

                        {notice.file_url && (
                          <a
                            href={
                              notice.file_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                          >
                            ফাইল দেখুন /
                            Download
                          </a>
                        )}
                      </div>

                      <div className="flex flex-wrap items-start gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(
                              notice
                            )
                          }
                          className={`rounded-lg px-3 py-2 text-sm font-medium ${
                            notice.is_active
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {notice.is_active
                            ? "Inactive"
                            : "Active"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              notice
                            )
                          }
                          className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              notice
                            )
                          }
                          className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
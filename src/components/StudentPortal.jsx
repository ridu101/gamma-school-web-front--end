import { useEffect, useState } from "react";

import { guidelines } from "@/data/students";
import { toBn, toEn } from "@/lib/bn";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/services/api";

import Icon from "./Icon";
import Reveal from "./Reveal";

const tabs = [
  {
    id: "result",
    label: "অনলাইন ফলাফল",
    icon: "result",
  },
  {
    id: "routine",
    label: "শ্রেণি রুটিন",
    icon: "routine",
  },
  {
    id: "guide",
    label: "শিক্ষার্থী নির্দেশিকা",
    icon: "guide",
  },
];

export default function StudentPortal() {
  const [tab, setTab] = useState("result");

  // ==========================================
  // RESULT STATES
  // ==========================================

  const [resultClasses, setResultClasses] = useState([]);
  const [resultExams, setResultExams] = useState([]);

  const [className, setClassName] = useState("");
  const [roll, setRoll] = useState("");
  const [exam, setExam] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [resultLoading, setResultLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);

  // ==========================================
  // ROUTINE STATES
  // ==========================================

  const [routineClasses, setRoutineClasses] = useState([]);
  const [routineDays, setRoutineDays] = useState([]);

  const [routineClass, setRoutineClass] = useState("");
  const [day, setDay] = useState("");

  const [routineRows, setRoutineRows] = useState([]);
  const [routineLoading, setRoutineLoading] = useState(true);
  const [routineError, setRoutineError] = useState("");

  // ==========================================
  // LOAD RESULT OPTIONS
  // ==========================================

  useEffect(() => {
    async function loadResultOptions() {
      try {
        setOptionsLoading(true);
        setError("");

        const response = await apiRequest(
          "/results/options"
        );

        const apiClasses =
          response.data?.classes || [];

        const apiExams =
          response.data?.exams || [];

        setResultClasses(apiClasses);
        setResultExams(apiExams);

        if (apiClasses.length > 0) {
          setClassName(apiClasses[0]);
        } else {
          setClassName("");
        }

        if (apiExams.length > 0) {
          setExam(apiExams[0]);
        } else {
          setExam("");
        }
      } catch (error) {
        console.error(
          "Result options error:",
          error
        );

        setResultClasses([]);
        setResultExams([]);

        setError(
          "ফলাফলের শ্রেণি ও পরীক্ষার তথ্য লোড করা যায়নি।"
        );
      } finally {
        setOptionsLoading(false);
      }
    }

    loadResultOptions();
  }, []);

  // ==========================================
  // LOAD ROUTINE OPTIONS
  // ==========================================

  useEffect(() => {
    async function loadRoutineOptions() {
      try {
        setRoutineLoading(true);
        setRoutineError("");

        const response = await apiRequest(
          "/routines/options"
        );

        const apiClasses =
          response.data?.classes || [];

        const apiDays =
          response.data?.days || [];

        setRoutineClasses(apiClasses);
        setRoutineDays(apiDays);

        if (apiClasses.length > 0) {
          setRoutineClass(apiClasses[0]);
        } else {
          setRoutineClass("");
        }

        if (apiDays.length > 0) {
          setDay(apiDays[0]);
        } else {
          setDay("");
        }
      } catch (error) {
        console.error(
          "Routine options error:",
          error
        );

        setRoutineClasses([]);
        setRoutineDays([]);
        setRoutineClass("");
        setDay("");

        setRoutineError(
          "রুটিনের তথ্য লোড করা যায়নি।"
        );
      } finally {
        setRoutineLoading(false);
      }
    }

    loadRoutineOptions();
  }, []);

  // ==========================================
  // LOAD ROUTINE DATA
  // ==========================================

  useEffect(() => {
    async function loadRoutineData() {
      if (!routineClass || !day) {
        setRoutineRows([]);
        return;
      }

      try {
        setRoutineLoading(true);
        setRoutineError("");
        setRoutineRows([]);

        const response = await apiRequest(
          `/routines/search?class=${encodeURIComponent(
            routineClass
          )}&day=${encodeURIComponent(day)}`
        );

        setRoutineRows(response.data || []);
      } catch (error) {
        console.error(
          "Routine data error:",
          error
        );

        setRoutineRows([]);

        setRoutineError(
          error.message ||
            "রুটিনের তথ্য লোড করা যায়নি।"
        );
      } finally {
        setRoutineLoading(false);
      }
    }

    loadRoutineData();
  }, [routineClass, day]);

  // ==========================================
  // SEARCH RESULT
  // ==========================================

  const showResult = async (event) => {
    event.preventDefault();

    if (!className || !exam || !roll.trim()) {
      setResult(null);

      setError(
        "শ্রেণি, পরীক্ষার ধরন এবং রোল নম্বর দিন।"
      );

      return;
    }

    try {
      setResultLoading(true);
      setError("");
      setResult(null);

      const englishRoll = toEn(
        roll.trim()
      );

      const response = await apiRequest(
        `/results/search?class=${encodeURIComponent(
          className
        )}&roll=${encodeURIComponent(
          englishRoll
        )}&exam=${encodeURIComponent(exam)}`
      );

      setResult(response.data);
    } catch (error) {
      console.error(
        "Result search error:",
        error
      );

      setResult(null);

      setError(
        error.message ||
          "কোনো ফলাফল পাওয়া যায়নি।"
      );
    } finally {
      setResultLoading(false);
    }
  };

  // ==========================================
  // COMMON STYLE
  // ==========================================

  const fieldClass =
    "w-full rounded-xl border border-cyan-200 dark:border-cyan-800/70 bg-white dark:bg-[#102f3a] px-4 py-3.5 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 dark:border-cyan-800/70 dark:bg-[#0e2934] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-500 dark:focus:ring-cyan-900/40 dark:disabled:bg-slate-800 dark:[color-scheme:dark]";

  const chip = (activeState) =>
    cn(
      "shrink-0 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all duration-300",
      activeState
        ? "border-cyan-700 bg-gradient-to-r from-[#00798a] to-[#08a9b8] text-white shadow-md shadow-cyan-200 dark:shadow-black/20"
        : "border-cyan-100 bg-white dark:bg-[#102f3a] text-slate-600 dark:text-slate-300 hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-950/35 hover:text-cyan-700 dark:hover:text-cyan-300"
    );

  return (
    <section
      id="student-portal"
      className="relative overflow-hidden bg-gradient-to-b from-[#f3fbfc] via-white to-[#edf9f7] py-20 transition-colors duration-300 dark:from-[#0b2430] dark:via-[#0d2b35] dark:to-[#10323d] lg:py-24"
    >
      {/* ==========================================
          BACKGROUND
      =========================================== */}

      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-cyan-200/45 blur-[100px] dark:bg-cyan-900/20" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-teal-200/35 blur-[100px] dark:bg-teal-900/20" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-100/65 blur-[100px] dark:bg-cyan-800/15" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ==========================================
            HEADER
        =========================================== */}

        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 dark:border-cyan-800/70 bg-white dark:bg-[#102f3a] px-4 py-2 text-xs font-bold text-cyan-700 dark:text-cyan-300 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.45)]" />

            শিক্ষার্থী পোর্টাল
          </div>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">
            ডিজিটাল স্কুল

            <span className="block bg-gradient-to-r from-[#063b52] via-[#007f91] to-[#06b6c8] bg-clip-text text-transparent">
              ম্যানেজমেন্ট পোর্টাল
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            পরীক্ষার ফলাফল, শ্রেণি রুটিন এবং
            শিক্ষার্থীদের প্রয়োজনীয় নির্দেশিকা এক
            জায়গা থেকে সহজেই দেখুন।
          </p>
        </Reveal>

        {/* ==========================================
            MAIN PORTAL
        =========================================== */}

        <Reveal
          delay={100}
          className="mt-12 lg:mt-14"
        >
          <div className="overflow-hidden rounded-[28px] border border-cyan-100 dark:border-cyan-900/60 bg-white dark:bg-[#102f3a] shadow-[0_20px_70px_rgba(8,145,160,0.12)] dark:shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
            <div className="grid lg:grid-cols-[270px_minmax(0,1fr)]">
              {/* ==========================================
                  LEFT NAVIGATION
              =========================================== */}

              <aside className="border-b border-cyan-100 dark:border-cyan-900/60 bg-gradient-to-b from-cyan-50 to-white dark:from-[#0d3340] dark:to-[#102f3a] p-3 lg:border-b-0 lg:border-r lg:p-5">
                <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                  {tabs.map((item) => {
                    const active =
                      tab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setTab(item.id)
                        }
                        className={cn(
                          "group flex min-h-[52px] shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-300 lg:w-full",
                          active
                            ? "border-cyan-700 bg-gradient-to-r from-[#00798a] to-[#08a9b8] text-white shadow-md shadow-cyan-200 dark:shadow-black/20"
                            : "border-transparent bg-white/60 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:border-cyan-200 hover:bg-white dark:hover:bg-[#163b47] hover:text-cyan-800 dark:hover:text-cyan-200"
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-9 w-9 shrink-0 place-items-center rounded-lg transition",
                            active
                              ? "bg-white/20 text-white"
                              : "bg-cyan-100 text-cyan-700 dark:text-cyan-300 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/60"
                          )}
                        >
                          <Icon
                            name={
                              item.icon
                            }
                            className="h-4 w-4"
                          />
                        </span>

                        <span className="whitespace-nowrap">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* System Status */}

                <div className="mt-6 hidden rounded-2xl transition-colors duration-300 border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/25 p-4 lg:block">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />

                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      সিস্টেম অনলাইন
                    </p>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    অনলাইন ফলাফল সরাসরি স্কুল
                    ডাটাবেজ থেকে দেখানো হচ্ছে।
                  </p>
                </div>
              </aside>

              {/* ==========================================
                  CONTENT
              =========================================== */}

              <main className="min-w-0 bg-white p-4 transition-colors duration-300 dark:bg-[#102f3a] sm:p-6 lg:p-8">
                {/* ==========================================
                    ONLINE RESULT
                =========================================== */}

                {tab === "result" && (
                  <div>
                    {/* Header */}

                    <div className="mb-7">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                        Online Result
                      </p>

                      <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                        পরীক্ষার ফলাফল অনুসন্ধান
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        শ্রেণি, পরীক্ষা এবং রোল
                        নম্বর দিয়ে শিক্ষার্থীর ফলাফল
                        দেখুন।
                      </p>
                    </div>

                    {/* Search Form */}

                    <form
                      onSubmit={showResult}
                      className="rounded-2xl border border-cyan-100 dark:border-cyan-900/60 bg-gradient-to-br from-cyan-50/80 to-teal-50/50 dark:from-[#123743] dark:to-[#102f3a] p-4 sm:p-5"
                    >
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {/* Class */}

                        <label className="block">
                          <span className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-200">
                            শ্রেণি নির্বাচন
                          </span>

                          <select
                            value={className}
                            onChange={(e) => {
                              setClassName(
                                e.target.value
                              );

                              setResult(null);
                              setError("");
                            }}
                            disabled={
                              optionsLoading ||
                              resultClasses.length ===
                                0
                            }
                            className={
                              fieldClass
                            }
                          >
                            {optionsLoading ? (
                              <option value="">
                                লোড হচ্ছে...
                              </option>
                            ) : resultClasses.length ===
                              0 ? (
                              <option value="">
                                কোনো শ্রেণি নেই
                              </option>
                            ) : (
                              resultClasses.map(
                                (
                                  currentClass
                                ) => (
                                  <option
                                    key={
                                      currentClass
                                    }
                                    value={
                                      currentClass
                                    }
                                  >
                                    {
                                      currentClass
                                    }{" "}
                                    শ্রেণি
                                  </option>
                                )
                              )
                            )}
                          </select>
                        </label>

                        {/* Exam */}

                        <label className="block">
                          <span className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-200">
                            পরীক্ষার ধরন
                          </span>

                          <select
                            value={exam}
                            onChange={(e) => {
                              setExam(
                                e.target.value
                              );

                              setResult(null);
                              setError("");
                            }}
                            disabled={
                              optionsLoading ||
                              resultExams.length ===
                                0
                            }
                            className={
                              fieldClass
                            }
                          >
                            {optionsLoading ? (
                              <option value="">
                                লোড হচ্ছে...
                              </option>
                            ) : resultExams.length ===
                              0 ? (
                              <option value="">
                                কোনো পরীক্ষা নেই
                              </option>
                            ) : (
                              resultExams.map(
                                (examName) => (
                                  <option
                                    key={
                                      examName
                                    }
                                    value={
                                      examName
                                    }
                                  >
                                    {
                                      examName
                                    }
                                  </option>
                                )
                              )
                            )}
                          </select>
                        </label>

                        {/* Roll */}

                        <label className="block">
                          <span className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-200">
                            রোল নম্বর
                          </span>

                          <input
                            value={roll}
                            onChange={(e) => {
                              setRoll(
                                e.target.value
                              );

                              setResult(null);
                              setError("");
                            }}
                            placeholder="যেমন: ০১"
                            inputMode="numeric"
                            className={
                              fieldClass
                            }
                          />
                        </label>

                        {/* Search Button */}

                        <div className="flex items-end">
                          <button
                            type="submit"
                            disabled={
                              resultLoading ||
                              optionsLoading ||
                              !className ||
                              !exam ||
                              !roll.trim()
                            }
                            className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00798a] to-[#08a9b8] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-200 dark:shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#00677a] hover:to-[#0795a4] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                          >
                            {resultLoading ? (
                              <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                ফলাফল খোঁজা হচ্ছে...
                              </>
                            ) : (
                              <>
                                ফলাফল দেখুন

                                <Icon
                                  name="arrowRight"
                                  className="h-4 w-4"
                                />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>

                    {/* Error */}

                    {error && (
                      <div className="mt-5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 px-4 py-3">
                        <p className="text-sm font-medium text-red-600 dark:text-red-300">
                          {error}
                        </p>
                      </div>
                    )}

                    {/* ==========================================
                        RESULT DATA
                    =========================================== */}

                    {result && (
                      <div className="mt-7 space-y-5">
                        {/* Student Information */}

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          {[
                            [
                              "শিক্ষার্থীর নাম",
                              result.student,
                            ],
                            [
                              "শ্রেণি",
                              `${result.className} শ্রেণি`,
                            ],
                            [
                              "রোল নম্বর",
                              toBn(
                                result.roll
                              ),
                            ],
                            [
                              "পরীক্ষার নাম",
                              result.exam,
                            ],
                          ].map(
                            (
                              [
                                label,
                                value,
                              ]
                            ) => (
                              <div
                                key={
                                  label
                                }
                                className="rounded-2xl border border-cyan-100 dark:border-cyan-900/60 bg-teal-50/50 dark:bg-teal-950/25 p-4 transition-all hover:border-cyan-200 hover:bg-cyan-50 dark:hover:bg-cyan-950/35"
                              >
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                  {
                                    label
                                  }
                                </p>

                                <p className="mt-1.5 break-words text-sm font-bold text-slate-900 dark:text-slate-100">
                                  {
                                    value
                                  }
                                </p>
                              </div>
                            )
                          )}
                        </div>

                        {/* GPA + Subject Table */}

                        <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
                          {/* GPA */}

                          <div className="space-y-4">
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#006b7d] via-[#00899a] to-[#08a9b8] p-6 text-center shadow-lg shadow-cyan-200 dark:shadow-black/20">
                              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />

                              <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-cyan-200/20" />

                              <p className="relative text-xs font-bold uppercase tracking-widest text-cyan-100">
                                GPA
                              </p>

                              <p className="relative mt-2 text-5xl font-black text-white">
                                {toBn(
                                  result.gpa
                                )}
                              </p>

                              <div
                                className={cn(
                                  "relative mx-auto mt-4 inline-flex rounded-full px-4 py-1.5 text-xs font-bold",
                                  result.passed
                                    ? "bg-emerald-400/20 text-white"
                                    : "bg-red-400/20 text-white"
                                )}
                              >
                                {result.passed
                                  ? "উত্তীর্ণ"
                                  : "অকৃতকার্য"}
                              </div>
                            </div>

                            {/* Marks */}

                            <div className="grid grid-cols-2 gap-3">
                              <div className="rounded-xl border border-cyan-100 dark:border-cyan-900/60 bg-white dark:bg-[#102f3a] p-4 shadow-sm">
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  পূর্ণমান
                                </p>

                                <p className="mt-1 text-xl font-extrabold text-slate-900 dark:text-slate-100">
                                  {toBn(
                                    result.fullTotal
                                  )}
                                </p>
                              </div>

                              <div className="rounded-xl border border-cyan-100 dark:border-cyan-900/60 bg-teal-50/50 dark:bg-teal-950/25 p-4 shadow-sm">
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  প্রাপ্ত নম্বর
                                </p>

                                <p className="mt-1 text-xl font-extrabold text-cyan-800 dark:text-cyan-300">
                                  {toBn(
                                    result.total
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Subject Table */}

                          <div className="overflow-hidden rounded-2xl border border-cyan-100 dark:border-cyan-900/60 bg-white dark:bg-[#102f3a] shadow-sm">
                            <div className="border-b border-cyan-100 dark:border-cyan-900/60 bg-teal-50/50 dark:bg-teal-950/25 px-5 py-4">
                              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                                বিষয়ভিত্তিক ফলাফল
                              </h4>

                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                সকল বিষয়ের নম্বর এবং
                                গ্রেড
                              </p>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full min-w-[520px] text-sm">
                                <thead>
                                  <tr className="bg-[#007f91] text-white">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold">
                                      বিষয়
                                    </th>

                                    <th className="px-4 py-3.5 text-center text-xs font-semibold">
                                      পূর্ণমান
                                    </th>

                                    <th className="px-4 py-3.5 text-center text-xs font-semibold">
                                      প্রাপ্ত নম্বর
                                    </th>

                                    <th className="px-4 py-3.5 text-center text-xs font-semibold">
                                      গ্রেড
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {(
                                    result.rows ||
                                    []
                                  ).map(
                                    (
                                      row,
                                      index
                                    ) => (
                                      <tr
                                        key={`${row.subject}-${index}`}
                                        className="border-t border-slate-100 dark:border-slate-700/70 transition hover:bg-cyan-50/60 dark:hover:bg-cyan-950/30"
                                      >
                                        <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">
                                          {
                                            row.subject
                                          }
                                        </td>

                                        <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300">
                                          {toBn(
                                            row.full
                                          )}
                                        </td>

                                        <td className="px-4 py-4 text-center font-bold text-cyan-800 dark:text-cyan-300">
                                          {toBn(
                                            row.obtained
                                          )}
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                          <span className="inline-flex min-w-[44px] justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/35 px-3 py-1.5 text-xs font-bold text-cyan-800 dark:text-cyan-300">
                                            {row.grade ||
                                              "—"}
                                          </span>
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ==========================================
                    ROUTINE
                =========================================== */}

                {tab === "routine" && (
                  <div>
                    {/* Header */}

                    <div className="mb-7">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                        Class Routine
                      </p>

                      <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                        শ্রেণি রুটিন
                      </h3>

                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        শ্রেণি ও দিন নির্বাচন করে
                        ক্লাস রুটিন দেখুন।
                      </p>
                    </div>

                    {/* Class Filters */}

                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {routineClasses.map(
                        (
                          currentClass
                        ) => (
                          <button
                            key={
                              currentClass
                            }
                            type="button"
                            onClick={() =>
                              setRoutineClass(
                                currentClass
                              )
                            }
                            className={chip(
                              routineClass ===
                                currentClass
                            )}
                          >
                            {
                              currentClass
                            }{" "}
                            শ্রেণি
                          </button>
                        )
                      )}
                    </div>

                    {/* Day Filters */}

                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                      {routineDays.map(
                        (currentDay) => (
                          <button
                            key={
                              currentDay
                            }
                            type="button"
                            onClick={() =>
                              setDay(
                                currentDay
                              )
                            }
                            className={cn(
                              "shrink-0 rounded-lg border px-4 py-2 text-xs font-semibold transition",
                              day ===
                                currentDay
                                ? "border-cyan-700 bg-[#007f91] text-white shadow-sm"
                                : "border-cyan-100 bg-white dark:bg-[#102f3a] text-slate-600 dark:text-slate-300 hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-950/35 hover:text-cyan-700 dark:hover:text-cyan-300"
                            )}
                          >
                            {
                              currentDay
                            }
                          </button>
                        )
                      )}
                    </div>

                    {/* Routine Table */}

                    <div className="mt-6 overflow-hidden rounded-2xl border border-cyan-100 dark:border-cyan-900/60 bg-white dark:bg-[#102f3a] shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-sm">
                          <thead>
                            <tr className="bg-[#007f91] text-white">
                              <th className="px-5 py-4 text-left text-xs font-semibold">
                                দিন
                              </th>

                              <th className="px-5 py-4 text-left text-xs font-semibold">
                                সময়
                              </th>

                              <th className="px-5 py-4 text-left text-xs font-semibold">
                                বিষয়
                              </th>

                              <th className="px-5 py-4 text-left text-xs font-semibold">
                                শিক্ষক
                              </th>

                              <th className="px-5 py-4 text-left text-xs font-semibold">
                                কক্ষ
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {routineLoading ? (
                              <tr>
                                <td
                                  colSpan="5"
                                  className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                                >
                                  রুটিনের তথ্য লোড হচ্ছে...
                                </td>
                              </tr>
                            ) : routineError ? (
                              <tr>
                                <td
                                  colSpan="5"
                                  className="px-5 py-8 text-center text-sm font-medium text-red-600 dark:text-red-300"
                                >
                                  {routineError}
                                </td>
                              </tr>
                            ) : routineRows.length === 0 ? (
                              <tr>
                                <td
                                  colSpan="5"
                                  className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                                >
                                  এই শ্রেণি ও দিনের কোনো রুটিন পাওয়া যায়নি।
                                </td>
                              </tr>
                            ) : (
                              routineRows.map(
                                (
                                  row,
                                  index
                                ) => (
                                  <tr
                                    key={
                                      row.id ||
                                      `${row.time}-${index}`
                                    }
                                    className="border-t border-slate-100 dark:border-slate-700/70 transition hover:bg-cyan-50/60 dark:hover:bg-cyan-950/30"
                                  >
                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                                      {row.day || day}
                                    </td>

                                    <td className="px-5 py-4 font-bold text-cyan-700 dark:text-cyan-300">
                                      {row.time}
                                    </td>

                                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">
                                      {row.subject}
                                    </td>

                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                                      {row.teacher}
                                    </td>

                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                                      {row.room || "—"}
                                    </td>
                                  </tr>
                                )
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ==========================================
                    GUIDE
                =========================================== */}

                {tab === "guide" && (
                  <div>
                    {/* Header */}

                    <div className="mb-7">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                        Student Guide
                      </p>

                      <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                        শিক্ষার্থী নির্দেশিকা
                      </h3>

                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        শিক্ষার্থীদের গুরুত্বপূর্ণ
                        নির্দেশনা এবং প্রয়োজনীয় তথ্য।
                      </p>
                    </div>

                    {/* Guide Cards */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {guidelines.map(
                        (item) => (
                          <div
                            key={
                              item.id
                            }
                            className="group rounded-2xl border border-cyan-100 dark:border-cyan-900/60 bg-white dark:bg-[#102f3a] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-lg hover:shadow-cyan-100 dark:hover:shadow-black/20"
                          >
                            <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-100 dark:bg-cyan-900/35 text-cyan-700 dark:text-cyan-300 transition group-hover:bg-[#007f91] dark:group-hover:bg-[#08a9b8] group-hover:text-white">
                              <Icon
                                name={
                                  item.icon
                                }
                                className="h-5 w-5"
                              />
                            </span>

                            <h4 className="mt-4 text-sm font-bold text-slate-900 dark:text-slate-100">
                              {
                                item.title
                              }
                            </h4>

                            <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                              {
                                item.text
                              }
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </main>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
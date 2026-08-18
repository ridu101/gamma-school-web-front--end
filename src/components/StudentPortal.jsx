import { useEffect, useState } from "react";

import {
  attendance,
  classes,
  guidelines,
} from "@/data/students";

import { days, getRoutine } from "@/data/routines";
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
    id: "attendance",
    label: "অনলাইন উপস্থিতি",
    icon: "attendance",
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
  // RESULT API DATA
  // ==========================================

  const [resultClasses, setResultClasses] = useState([]);
  const [resultExams, setResultExams] = useState([]);

  const [className, setClassName] = useState("");
  const [roll, setRoll] = useState("");
  const [exam, setExam] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [resultLoading, setResultLoading] =
    useState(false);

  const [optionsLoading, setOptionsLoading] =
    useState(true);

  // ==========================================
  // ATTENDANCE / ROUTINE
  // এখনো আগের data ব্যবহার করছে
  // ==========================================

  const [attClass, setAttClass] = useState(
    classes[0]
  );

  const [routineClass, setRoutineClass] =
    useState(classes[0]);

  const [day, setDay] = useState(days[0]);

  // ==========================================
  // LOAD RESULT OPTIONS FROM LARAVEL
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
  // SEARCH RESULT FROM LARAVEL
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
  // ATTENDANCE
  // ==========================================

  const att = attendance[attClass];

  const rate = att
    ? (
        (att.present / att.total) *
        100
      ).toFixed(1)
    : "0.0";

  const circumference =
    2 * Math.PI * 52;

  // ==========================================
  // COMMON STYLE
  // ==========================================

  const fieldClass =
    "box-border w-full min-w-0 max-w-full rounded-2xl border border-cyan-soft/20 bg-navy-deep/60 px-4 py-3 text-sm text-cyan-soft outline-none transition-all duration-300 focus:border-accent/70 focus:shadow-[var(--shadow-glow)] disabled:cursor-not-allowed disabled:opacity-60";

  const chip = (activeState) =>
    cn(
      "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300",
      activeState
        ? "border-transparent bg-[image:var(--gradient-accent)] text-primary-foreground shadow-[var(--shadow-glow)]"
        : "border-cyan-soft/25 text-cyan-soft hover:border-accent/50 hover:bg-primary-foreground/10"
    );

  return (
    <section
      id="student-portal"
      className="section-y relative scroll-mt-24 overflow-hidden bg-navy-deep"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-[0.14]" />

      <div className="pointer-events-none absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-[image:var(--gradient-accent)] opacity-20 blur-3xl float-slow" />

      <div className="container-x relative min-w-0">
        {/* ==========================================
            HEADER
        =========================================== */}

        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-soft/25 bg-primary-foreground/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan-soft">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />

            <span>
              শিক্ষার্থী পোর্টাল
            </span>
          </span>

          <h2 className="mt-4 break-words text-2xl font-bold leading-tight text-primary-foreground sm:text-3xl lg:text-4xl">
            ডিজিটাল স্কুল ম্যানেজমেন্ট
            পোর্টাল
          </h2>

          <p className="mx-auto mt-3 max-w-2xl break-words text-sm leading-relaxed text-cyan-soft/80 sm:text-base">
            পরীক্ষার ফলাফল অনুসন্ধান,
            শ্রেণি রুটিন, হাজিরা এবং
            শিক্ষার্থী সংক্রান্ত তথ্য এক
            জায়গায়।
          </p>

          <span className="mx-auto mt-6 block h-px w-40 max-w-full bg-[image:var(--gradient-accent)] opacity-70" />
        </Reveal>

        {/* ==========================================
            MAIN PORTAL
        =========================================== */}

        <Reveal
          delay={100}
          className="mt-10 min-w-0 sm:mt-12 lg:mt-16"
        >
          <div className="grid min-w-0 gap-4 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:gap-5">
            {/* ==========================================
                NAVIGATION
            =========================================== */}

            <div className="glass-dark min-w-0 rounded-3xl p-2.5 sm:p-3">
              <div
                className="
                  flex
                  min-w-0
                  gap-2
                  overflow-x-auto
                  overscroll-x-contain
                  pb-0.5
                  [-ms-overflow-style:none]
                  [scrollbar-width:none]
                  lg:flex-col
                  lg:overflow-visible
                  [&::-webkit-scrollbar]:hidden
                "
              >
                {tabs.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setTab(item.id)
                    }
                    className={cn(
                      `
                        inline-flex
                        min-h-[46px]
                        shrink-0
                        items-center
                        gap-2.5
                        rounded-2xl
                        border
                        px-3.5
                        py-2.5
                        text-xs
                        font-semibold
                        transition-all
                        duration-300
                        sm:px-4
                        sm:text-sm
                        lg:w-full
                      `,
                      tab === item.id
                        ? "border-accent/60 bg-[image:var(--gradient-accent)] text-primary-foreground shadow-[var(--shadow-glow)]"
                        : "border-transparent text-cyan-soft/85 hover:border-cyan-soft/25 hover:bg-primary-foreground/8"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-xl",
                        tab === item.id
                          ? "bg-primary-foreground/20"
                          : "bg-primary-foreground/8"
                      )}
                    >
                      <Icon
                        name={item.icon}
                        className="h-4 w-4"
                      />
                    </span>

                    <span className="whitespace-nowrap">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ==========================================
                CONTENT
            =========================================== */}

            <div className="glass-dark min-w-0 overflow-hidden rounded-3xl p-4 sm:p-6 lg:p-8">
              {/* ==========================================
                  ONLINE RESULT
              =========================================== */}

              {tab === "result" ? (
                <div className="min-w-0">
                  <form
                    onSubmit={showResult}
                    className="
                      grid
                      min-w-0
                      grid-cols-1
                      gap-4
                      sm:grid-cols-2
                      xl:grid-cols-4
                    "
                  >
                    {/* Class */}

                    <label className="block min-w-0">
                      <span className="mb-2 block text-xs font-semibold text-cyan-soft/80">
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
                        className={fieldClass}
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
                            (currentClass) => (
                              <option
                                key={
                                  currentClass
                                }
                                value={
                                  currentClass
                                }
                                className="text-foreground"
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

                    <label className="block min-w-0">
                      <span className="mb-2 block text-xs font-semibold text-cyan-soft/80">
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
                        className={fieldClass}
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
                                key={examName}
                                value={examName}
                                className="text-foreground"
                              >
                                {examName}
                              </option>
                            )
                          )
                        )}
                      </select>
                    </label>

                    {/* Roll */}

                    <label className="block min-w-0">
                      <span className="mb-2 block text-xs font-semibold text-cyan-soft/80">
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
                        placeholder="যেমন: ১"
                        inputMode="numeric"
                        className={cn(
                          fieldClass,
                          "placeholder:text-cyan-soft/45"
                        )}
                      />
                    </label>

                    {/* Submit */}

                    <button
                      type="submit"
                      disabled={
                        resultLoading ||
                        optionsLoading ||
                        !className ||
                        !exam ||
                        !roll.trim()
                      }
                      className="
                        mt-0
                        inline-flex
                        min-h-[48px]
                        w-full
                        min-w-0
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-[image:var(--gradient-accent)]
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-primary-foreground
                        shadow-[var(--shadow-glow)]
                        transition-transform
                        duration-300
                        hover:-translate-y-0.5
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        sm:mt-auto
                      "
                    >
                      <span>
                        {resultLoading
                          ? "ফলাফল খোঁজা হচ্ছে..."
                          : "ফলাফল দেখুন"}
                      </span>

                      {!resultLoading && (
                        <Icon
                          name="arrowRight"
                          className="h-4 w-4 shrink-0"
                        />
                      )}
                    </button>
                  </form>

                  {/* Error */}

                  {error ? (
                    <p className="mt-5 break-words rounded-2xl border border-cyan-soft/20 bg-primary-foreground/5 px-4 py-3 text-sm leading-relaxed text-cyan-soft/85">
                      {error}
                    </p>
                  ) : null}

                  {/* ==========================================
                      RESULT DATA
                  =========================================== */}

                  {result ? (
                    <div className="mt-7 min-w-0 space-y-4">
                      {/* Student information */}

                      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
                            toBn(result.roll),
                          ],
                          [
                            "পরীক্ষার নাম",
                            result.exam,
                          ],
                        ].map(
                          ([label, value]) => (
                            <div
                              key={label}
                              className="min-w-0 rounded-2xl border border-cyan-soft/15 bg-navy-deep/50 p-4"
                            >
                              <p className="text-[11px] text-cyan-soft/65">
                                {label}
                              </p>

                              <p className="mt-1 break-words text-sm font-semibold leading-relaxed text-primary-foreground">
                                {value}
                              </p>
                            </div>
                          )
                        )}
                      </div>

                      {/* GPA + Subject results */}

                      <div className="grid min-w-0 gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
                        {/* GPA */}

                        <div className="min-w-0 space-y-3">
                          <div className="rounded-2xl border border-accent/35 bg-navy-deep/60 p-5 text-center shadow-[var(--shadow-glow)] sm:p-6">
                            <p className="text-xs text-cyan-soft/70">
                              জিপিএ
                            </p>

                            <p className="mt-1 text-4xl font-bold text-gradient">
                              {toBn(
                                result.gpa
                              )}
                            </p>

                            <p className="mt-2 inline-flex max-w-full rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-cyan-soft">
                              ফলাফল:{" "}
                              {result.passed
                                ? "উত্তীর্ণ"
                                : "অকৃতকার্য"}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="min-w-0 rounded-2xl border border-cyan-soft/15 bg-navy-deep/50 p-3.5 sm:p-4">
                              <p className="text-[11px] text-cyan-soft/65">
                                মোট নম্বর
                              </p>

                              <p className="mt-1 text-lg font-bold text-primary-foreground">
                                {toBn(
                                  result.fullTotal
                                )}
                              </p>
                            </div>

                            <div className="min-w-0 rounded-2xl border border-cyan-soft/15 bg-navy-deep/50 p-3.5 sm:p-4">
                              <p className="text-[11px] text-cyan-soft/65">
                                প্রাপ্ত নম্বর
                              </p>

                              <p className="mt-1 text-lg font-bold text-primary-foreground">
                                {toBn(
                                  result.total
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Subject Table */}

                        <div className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-cyan-soft/15">
                          <div className="max-w-full overflow-x-auto overscroll-x-contain">
                            <table className="w-full min-w-[420px] text-sm">
                              <thead>
                                <tr className="bg-navy-deep/70 text-cyan-soft/75">
                                  <th className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                                    বিষয়
                                  </th>

                                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    পূর্ণমান
                                  </th>

                                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    প্রাপ্ত নম্বর
                                  </th>

                                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                    গ্রেড
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {(
                                  result.rows || []
                                ).map((row) => (
                                  <tr
                                    key={
                                      row.subject
                                    }
                                    className="border-t border-cyan-soft/10 text-center transition-colors hover:bg-primary-foreground/5"
                                  >
                                    <td className="whitespace-nowrap px-4 py-3 text-right text-primary-foreground">
                                      {
                                        row.subject
                                      }
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-3 text-cyan-soft/80">
                                      {toBn(
                                        row.full
                                      )}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-3 text-primary-foreground">
                                      {toBn(
                                        row.obtained
                                      )}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-3">
                                      <span className="inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-cyan-soft">
                                        {row.grade ||
                                          "—"}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* ==========================================
                  ATTENDANCE
              =========================================== */}

              {tab === "attendance" ? (
                <div className="grid min-w-0 gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
                  {/* Circular attendance */}

                  <div className="relative mx-auto grid place-items-center">
                    <svg
                      viewBox="0 0 120 120"
                      className="h-36 w-36 -rotate-90 sm:h-40 sm:w-40"
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-cyan-soft/15"
                      />

                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        className="text-accent transition-all duration-700"
                        strokeDasharray={
                          circumference
                        }
                        strokeDashoffset={
                          circumference *
                          (1 -
                            Number(rate) /
                              100)
                        }
                      />
                    </svg>

                    <span className="absolute text-center">
                      <span className="block text-2xl font-bold text-primary-foreground">
                        {toBn(rate)}%
                      </span>

                      <span className="block text-[11px] text-cyan-soft/70">
                        উপস্থিতির হার
                      </span>
                    </span>
                  </div>

                  {/* Attendance details */}

                  <div className="min-w-0">
                    {/* Class filters */}

                    <div className="max-w-full overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <div className="flex min-w-max gap-2 pb-1">
                        {classes.map(
                          (currentClass) => (
                            <button
                              key={
                                currentClass
                              }
                              type="button"
                              onClick={() =>
                                setAttClass(
                                  currentClass
                                )
                              }
                              className={chip(
                                attClass ===
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
                    </div>

                    {/* Attendance cards */}

                    <div className="mt-5 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
                      {[
                        [
                          "মোট ক্লাস",
                          att?.total ?? 0,
                        ],
                        [
                          "উপস্থিত",
                          att?.present ?? 0,
                        ],
                        [
                          "অনুপস্থিত",
                          att?.absent ?? 0,
                        ],
                      ].map(
                        ([label, value]) => (
                          <div
                            key={label}
                            className="min-w-0 rounded-2xl border border-cyan-soft/15 bg-navy-deep/50 p-4 transition-colors duration-300 hover:border-accent/40"
                          >
                            <p className="text-[11px] text-cyan-soft/65">
                              {label}
                            </p>

                            <p className="mt-1 text-xl font-bold text-primary-foreground">
                              {toBn(value)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* ==========================================
                  ROUTINE
              =========================================== */}

              {tab === "routine" ? (
                <div className="min-w-0">
                  {/* Class filters */}

                  <div className="max-w-full overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex min-w-max gap-2 pb-1">
                      {classes.map(
                        (currentClass) => (
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
                  </div>

                  {/* Day filters */}

                  <div className="mt-3 max-w-full overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex min-w-max gap-2 pb-1">
                      {days.map(
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
                              "shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300",
                              day ===
                                currentDay
                                ? "bg-accent/20 text-primary-foreground"
                                : "text-cyan-soft/70 hover:bg-primary-foreground/10"
                            )}
                          >
                            {currentDay}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Routine table */}

                  <div className="mt-5 max-w-full overflow-hidden rounded-2xl border border-cyan-soft/15">
                    <div className="max-w-full overflow-x-auto overscroll-x-contain">
                      <table className="w-full min-w-[520px] text-sm">
                        <thead>
                          <tr className="bg-navy-deep/70 text-cyan-soft/75">
                            <th className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                              দিন
                            </th>

                            <th className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                              সময়
                            </th>

                            <th className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                              বিষয়
                            </th>

                            <th className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                              শিক্ষক
                            </th>

                            <th className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                              কক্ষ
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {getRoutine(
                            routineClass,
                            day
                          ).map((row) => (
                            <tr
                              key={
                                row.time
                              }
                              className="border-t border-cyan-soft/10 transition-colors hover:bg-primary-foreground/5"
                            >
                              <td className="whitespace-nowrap px-4 py-3 text-right text-cyan-soft/80">
                                {day}
                              </td>

                              <td className="whitespace-nowrap px-4 py-3 text-right text-accent">
                                {row.time}
                              </td>

                              <td className="whitespace-nowrap px-4 py-3 text-right text-primary-foreground">
                                {
                                  row.subject
                                }
                              </td>

                              <td className="whitespace-nowrap px-4 py-3 text-right text-cyan-soft/80">
                                {
                                  row.teacher
                                }
                              </td>

                              <td className="whitespace-nowrap px-4 py-3 text-right text-cyan-soft/80">
                                {row.room}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* ==========================================
                  GUIDE
              =========================================== */}

              {tab === "guide" ? (
                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                  {guidelines.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="
                          min-w-0
                          rounded-2xl
                          border
                          border-cyan-soft/15
                          bg-navy-deep/50
                          p-4
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:border-accent/45
                          hover:shadow-[var(--shadow-glow)]
                          sm:p-5
                        "
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-cyan-soft">
                          <Icon
                            name={
                              item.icon
                            }
                            className="h-4.5 w-4.5"
                          />
                        </span>

                        <h3 className="mt-3 break-words text-sm font-semibold text-primary-foreground">
                          {item.title}
                        </h3>

                        <p className="mt-1.5 break-words text-xs leading-relaxed text-cyan-soft/75">
                          {item.text}
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
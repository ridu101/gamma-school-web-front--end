import { useState } from "react";
import { attendance, classes, examTypes, getResult, guidelines } from "@/data/students";
import { days, getRoutine } from "@/data/routines";
import { toBn, toEn } from "@/lib/bn";
import { cn } from "@/lib/utils";
import Icon from "./Icon";
import Reveal from "./Reveal";

const tabs = [
  { id: "result", label: "অনলাইন ফলাফল", icon: "result" },
  { id: "routine", label: "শ্রেণি রুটিন", icon: "routine" },
  { id: "attendance", label: "অনলাইন উপস্থিতি", icon: "attendance" },
  { id: "guide", label: "শিক্ষার্থী নির্দেশিকা", icon: "guide" },
];

export default function StudentPortal() {
  const [tab, setTab] = useState("result");

  const [className, setClassName] = useState(classes[0]);
  const [roll, setRoll] = useState("");
  const [exam, setExam] = useState(examTypes[1]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [attClass, setAttClass] = useState(classes[0]);
  const [routineClass, setRoutineClass] = useState(classes[0]);
  const [day, setDay] = useState(days[0]);

  const showResult = (event) => {
    event.preventDefault();
    const found = getResult(className, toEn(roll), exam);
    if (!found) {
      setResult(null);
      setError("এই রোল নম্বরের কোনো ডেমো তথ্য পাওয়া যায়নি। ১, ২ বা ৩ ব্যবহার করে দেখুন।");
      return;
    }
    setError("");
    setResult(found);
  };

  const att = attendance[attClass];
  const rate = ((att.present / att.total) * 100).toFixed(1);
  const circumference = 2 * Math.PI * 52;

  const fieldClass =
    "w-full rounded-2xl border border-cyan-soft/20 bg-navy-deep/60 px-4 py-3 text-sm text-cyan-soft outline-none transition-all duration-300 focus:border-accent/70 focus:shadow-[var(--shadow-glow)]";

  const chip = (activeState) =>
    cn(
      "rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300",
      activeState
        ? "border-transparent bg-[image:var(--gradient-accent)] text-primary-foreground shadow-[var(--shadow-glow)]"
        : "border-cyan-soft/25 text-cyan-soft hover:border-accent/50 hover:bg-primary-foreground/10",
    );

  return (
    <section
      id="student-portal"
      className="section-y relative scroll-mt-24 overflow-hidden bg-navy-deep"
    >
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-[0.14]" />
      <div className="pointer-events-none absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-[image:var(--gradient-accent)] opacity-20 blur-3xl float-slow" />

      <div className="container-x relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-soft/25 bg-primary-foreground/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            শিক্ষার্থী পোর্টাল
          </span>
          <h2 className="mt-4 text-2xl font-bold text-primary-foreground sm:text-3xl lg:text-4xl">
            ডিজিটাল স্কুল ম্যানেজমেন্ট পোর্টাল
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-cyan-soft/80 sm:text-base">
            পরীক্ষার ফলাফল অনুসন্ধান, শ্রেণি রুটিন, হাজিরা এবং শিক্ষার্থী সংক্রান্ত তথ্য এক জায়গায়।
          </p>
          <span className="mx-auto mt-6 block h-px w-40 bg-[image:var(--gradient-accent)] opacity-70" />
        </Reveal>

        <Reveal delay={100} className="mt-12 lg:mt-16">
          <div className="grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
            <div className="glass-dark rounded-3xl p-3">
              <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                {tabs.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 lg:w-full",
                      tab === item.id
                        ? "border-accent/60 bg-[image:var(--gradient-accent)] text-primary-foreground shadow-[var(--shadow-glow)]"
                        : "border-transparent text-cyan-soft/85 hover:border-cyan-soft/25 hover:bg-primary-foreground/8",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-xl",
                        tab === item.id ? "bg-primary-foreground/20" : "bg-primary-foreground/8",
                      )}
                    >
                      <Icon name={item.icon} className="h-4 w-4" />
                    </span>
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-dark rounded-3xl p-5 sm:p-7 lg:p-8">
              {tab === "result" ? (
                <div>
                  <form onSubmit={showResult} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-cyan-soft/80">
                        শ্রেণি নির্বাচন
                      </span>
                      <select
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        className={fieldClass}
                      >
                        {classes.map((c) => (
                          <option key={c} value={c} className="text-foreground">
                            {c} শ্রেণি
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-cyan-soft/80">
                        পরীক্ষার ধরন
                      </span>
                      <select
                        value={exam}
                        onChange={(e) => setExam(e.target.value)}
                        className={fieldClass}
                      >
                        {examTypes.map((t) => (
                          <option key={t} value={t} className="text-foreground">
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-cyan-soft/80">
                        রোল নম্বর
                      </span>
                      <input
                        value={roll}
                        onChange={(e) => setRoll(e.target.value)}
                        placeholder="যেমন: ১"
                        className={cn(fieldClass, "placeholder:text-cyan-soft/45")}
                      />
                    </label>
                    <button
                      type="submit"
                      className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[image:var(--gradient-accent)] px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      ফলাফল দেখুন <Icon name="arrowRight" className="h-4 w-4" />
                    </button>
                  </form>

                  {error ? (
                    <p className="mt-5 rounded-2xl border border-cyan-soft/20 bg-primary-foreground/5 px-4 py-3 text-sm text-cyan-soft/85">
                      {error}
                    </p>
                  ) : null}

                  {result ? (
                    <div className="mt-7 space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                          ["শিক্ষার্থীর নাম", result.student],
                          ["শ্রেণি", `${result.className} শ্রেণি`],
                          ["রোল নম্বর", toBn(result.roll)],
                          ["পরীক্ষার নাম", result.exam],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-2xl border border-cyan-soft/15 bg-navy-deep/50 p-4"
                          >
                            <p className="text-[11px] text-cyan-soft/65">{label}</p>
                            <p className="mt-1 text-sm font-semibold text-primary-foreground">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="grid gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
                        <div className="space-y-3">
                          <div className="rounded-2xl border border-accent/35 bg-navy-deep/60 p-6 text-center shadow-[var(--shadow-glow)]">
                            <p className="text-xs text-cyan-soft/70">জিপিএ</p>
                            <p className="mt-1 text-4xl font-bold text-gradient">{toBn(result.gpa)}</p>
                            <p className="mt-2 inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-cyan-soft">
                              ফলাফল: {result.passed ? "উত্তীর্ণ" : "অকৃতকার্য"}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-cyan-soft/15 bg-navy-deep/50 p-4">
                              <p className="text-[11px] text-cyan-soft/65">মোট নম্বর</p>
                              <p className="mt-1 text-lg font-bold text-primary-foreground">
                                {toBn(result.fullTotal)}
                              </p>
                            </div>
                            <div className="rounded-2xl border border-cyan-soft/15 bg-navy-deep/50 p-4">
                              <p className="text-[11px] text-cyan-soft/65">প্রাপ্ত নম্বর</p>
                              <p className="mt-1 text-lg font-bold text-primary-foreground">
                                {toBn(result.total)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-cyan-soft/15">
                          <table className="w-full min-w-[420px] text-sm">
                            <thead>
                              <tr className="bg-navy-deep/70 text-cyan-soft/75">
                                <th className="px-4 py-3 text-right font-semibold">বিষয়</th>
                                <th className="px-4 py-3 font-semibold">পূর্ণমান</th>
                                <th className="px-4 py-3 font-semibold">প্রাপ্ত নম্বর</th>
                                <th className="px-4 py-3 font-semibold">গ্রেড</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.rows.map((row) => (
                                <tr
                                  key={row.subject}
                                  className="border-t border-cyan-soft/10 text-center transition-colors hover:bg-primary-foreground/5"
                                >
                                  <td className="px-4 py-3 text-right text-primary-foreground">
                                    {row.subject}
                                  </td>
                                  <td className="px-4 py-3 text-cyan-soft/80">{toBn(row.full)}</td>
                                  <td className="px-4 py-3 text-primary-foreground">
                                    {toBn(row.obtained)}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-cyan-soft">
                                      {row.grade}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {tab === "attendance" ? (
                <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
                  <div className="relative mx-auto grid place-items-center">
                    <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
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
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - Number(rate) / 100)}
                      />
                    </svg>
                    <span className="absolute text-center">
                      <span className="block text-2xl font-bold text-primary-foreground">
                        {toBn(rate)}%
                      </span>
                      <span className="block text-[11px] text-cyan-soft/70">উপস্থিতির হার</span>
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-2">
                      {classes.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setAttClass(c)}
                          className={chip(attClass === c)}
                        >
                          {c} শ্রেণি
                        </button>
                      ))}
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {[
                        ["মোট ক্লাস", att.total],
                        ["উপস্থিত", att.present],
                        ["অনুপস্থিত", att.absent],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-cyan-soft/15 bg-navy-deep/50 p-4 transition-colors duration-300 hover:border-accent/40"
                        >
                          <p className="text-[11px] text-cyan-soft/65">{label}</p>
                          <p className="mt-1 text-xl font-bold text-primary-foreground">
                            {toBn(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {tab === "routine" ? (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {classes.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setRoutineClass(c)}
                        className={chip(routineClass === c)}
                      >
                        {c} শ্রেণি
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {days.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDay(d)}
                        className={cn(
                          "rounded-full px-4 py-2 text-xs font-medium transition-all duration-300",
                          day === d
                            ? "bg-accent/20 text-primary-foreground"
                            : "text-cyan-soft/70 hover:bg-primary-foreground/10",
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 overflow-x-auto rounded-2xl border border-cyan-soft/15">
                    <table className="w-full min-w-[520px] text-sm">
                      <thead>
                        <tr className="bg-navy-deep/70 text-cyan-soft/75">
                          <th className="px-4 py-3 text-right font-semibold">দিন</th>
                          <th className="px-4 py-3 text-right font-semibold">সময়</th>
                          <th className="px-4 py-3 text-right font-semibold">বিষয়</th>
                          <th className="px-4 py-3 text-right font-semibold">শিক্ষক</th>
                          <th className="px-4 py-3 text-right font-semibold">কক্ষ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getRoutine(routineClass, day).map((row) => (
                          <tr
                            key={row.time}
                            className="border-t border-cyan-soft/10 transition-colors hover:bg-primary-foreground/5"
                          >
                            <td className="px-4 py-3 text-right text-cyan-soft/80">{day}</td>
                            <td className="px-4 py-3 text-right text-accent">{row.time}</td>
                            <td className="px-4 py-3 text-right text-primary-foreground">
                              {row.subject}
                            </td>
                            <td className="px-4 py-3 text-right text-cyan-soft/80">{row.teacher}</td>
                            <td className="px-4 py-3 text-right text-cyan-soft/80">{row.room}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {tab === "guide" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {guidelines.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-cyan-soft/15 bg-navy-deep/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/45 hover:shadow-[var(--shadow-glow)]"
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-cyan-soft">
                        <Icon name={item.icon} className="h-4.5 w-4.5" />
                      </span>
                      <h3 className="mt-3 text-sm font-semibold text-primary-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-cyan-soft/75">{item.text}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

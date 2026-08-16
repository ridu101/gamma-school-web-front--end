import { useMemo, useState } from "react";
import { notices } from "@/data/notices";
import { services } from "@/data/services";
import { teachers } from "@/data/teachers";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const portalItems = [
  { title: "ফলাফল দেখুন", detail: "শ্রেণি, রোল ও পরীক্ষা নির্বাচন করে ফলাফল দেখুন", target: "student-portal" },
  { title: "উপস্থিতি", detail: "শ্রেণিভিত্তিক উপস্থিতির হার ও পরিসংখ্যান", target: "student-portal" },
  { title: "ক্লাস রুটিন", detail: "শনিবার থেকে বৃহস্পতিবার পর্যন্ত সাপ্তাহিক রুটিন", target: "student-portal" },
];

const index = [
  ...notices.map((n) => ({ type: "নোটিশ", title: n.title, detail: n.date, target: "notices" })),
  ...teachers.map((t) => ({
    type: "শিক্ষক",
    title: t.name,
    detail: `${t.department} • ${t.subject}`,
    target: "teachers",
  })),
  ...services.map((s) => ({ type: "সেবা", title: s.title, detail: s.description, target: "services" })),
  ...portalItems.map((p) => ({ type: "পোর্টাল", title: p.title, detail: p.detail, target: p.target })),
];

export default function SearchSection() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return index
      .filter((item) => item.title.includes(q) || item.detail.includes(q) || item.type.includes(q))
      .slice(0, 8);
  }, [query]);

  const goTo = (target) => () => {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setQuery("");
  };

  return (
    <section className="section-y bg-surface-2">
      <div className="container-x">
        <SectionHeading
          eyebrow="দ্রুত অনুসন্ধান"
          title="প্রয়োজনীয় তথ্য খুঁজুন"
          subtitle="নোটিশ, শিক্ষক, সেবা ও শিক্ষার্থী পোর্টালের তথ্য এক জায়গা থেকে খুঁজে নিন"
        />

        <Reveal className="mx-auto mt-10 max-w-3xl">
          <div className="relative">
            <div className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3">
              <Icon name="search" className="h-5 w-5 shrink-0 text-teal" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="আপনি কী খুঁজছেন?"
                aria-label="অনুসন্ধান"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="মুছুন"
                  onClick={() => setQuery("")}
                  className="shrink-0 text-muted-foreground transition-colors hover:text-teal"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            {query.trim() ? (
              <div className="absolute inset-x-0 top-full z-30 mt-3 max-h-80 overflow-y-auto rounded-2xl border border-border bg-surface p-2 shadow-[var(--shadow-lift)]">
                {results.length ? (
                  results.map((item) => (
                    <button
                      key={`${item.type}-${item.title}`}
                      type="button"
                      onClick={goTo(item.target)}
                      className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-accent/10"
                    >
                      <span className="mt-0.5 shrink-0 rounded-full bg-accent/12 px-2.5 py-1 text-[11px] font-semibold text-teal">
                        {item.type}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-primary">{item.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {item.detail}
                        </span>
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-5 text-center text-sm text-muted-foreground">
                    কোনো তথ্য পাওয়া যায়নি।
                  </p>
                )}
              </div>
            ) : null}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            উদাহরণ: “ভর্তি”, “রাকিব”, “রুটিন”, “ফলাফল”
          </p>
        </Reveal>
      </div>
    </section>
  );
}

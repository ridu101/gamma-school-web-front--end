import { useEffect, useMemo, useState } from "react";
import {
  academicCalendar,
  downloadLinks,
  noticeCategories,
} from "@/data/notices";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/services/api";
import Icon from "./Icon";
import Reveal from "./Reveal";

const categoryTone = {
  পরীক্ষা: "bg-accent/12 text-teal border-accent/30",
  ভর্তি: "bg-primary/8 text-primary border-primary/20",
  সাধারণ: "bg-cyan/10 text-teal border-cyan/25",
  অন্যান্য: "bg-muted text-muted-foreground border-border",
};

export default function NoticeBoard() {
  const [category, setCategory] = useState("সকল নোটিশ");
  const [query, setQuery] = useState("");

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD NOTICES FROM API
  // ==========================================
  useEffect(() => {
    const loadNotices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiRequest("/notices");

        const activeNotices = (response.data || [])
          .filter((notice) => Boolean(notice.is_active))
          .map((notice) => {
            const publishDate = notice.publish_date
              ? new Date(notice.publish_date)
              : null;

            return {
              ...notice,

              category: notice.category || "সাধারণ",

              day: publishDate
                ? publishDate.toLocaleDateString("bn-BD", {
                    day: "2-digit",
                  })
                : "--",

              month: publishDate
                ? publishDate.toLocaleDateString("bn-BD", {
                    month: "short",
                  })
                : "",

              date: publishDate
                ? publishDate.toLocaleDateString("bn-BD", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "তারিখ নেই",
            };
          });

        setNotices(activeNotices);
      } catch (error) {
        console.error("Notice load error:", error);

        setError(
          error.message || "নোটিশ লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    };

    loadNotices();
  }, []);

  // ==========================================
  // SEARCH + CATEGORY FILTER
  // ==========================================
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();

    return notices.filter((notice) => {
      const matchCat =
        category === "সকল নোটিশ" ||
        notice.category === category;

      const matchQuery =
        !q ||
        notice.title
          ?.toLowerCase()
          .includes(q) ||
        notice.description
          ?.toLowerCase()
          .includes(q);

      return matchCat && matchQuery;
    });
  }, [category, query, notices]);

  return (
    <section
      id="notices"
      className="section-y relative scroll-mt-24 overflow-hidden bg-surface-2"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[image:var(--gradient-soft)] opacity-70" />

      <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-[image:var(--gradient-accent)] opacity-10 blur-3xl" />

      <div className="container-x relative">
        {/* ==========================================
            HEADER
        ========================================== */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />

            নোটিশ বোর্ড
          </span>

          <h2 className="mt-4 text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">
            সর্বশেষ নোটিশ ও কার্যসূচি
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            বিদ্যালয়ের গুরুত্বপূর্ণ বিজ্ঞপ্তি, পরীক্ষা ও ভর্তি
            সংক্রান্ত তথ্য এবং আসন্ন কার্যসূচি এক জায়গায়।
          </p>

          <span className="mx-auto mt-6 block h-px w-40 bg-[image:var(--gradient-accent)] opacity-70" />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          {/* ==========================================
              LEFT SIDE
          ========================================== */}
          <Reveal className="space-y-5">
            {/* Search + Categories */}
            <div className="rounded-3xl border border-border bg-surface p-4 shadow-[var(--shadow-soft)] sm:p-5">
              {/* Search */}
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-muted-foreground">
                  <Icon
                    name="search"
                    className="h-4 w-4"
                  />
                </span>

                <input
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder="নোটিশ খুঁজুন..."
                  className="w-full rounded-2xl border border-border bg-surface-2 py-3 pr-11 pl-4 text-sm outline-none transition-colors focus:border-accent/60 focus:bg-surface"
                />
              </div>

              {/* Categories */}
              <div className="mt-4 flex flex-wrap gap-2">
                {noticeCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setCategory(cat)
                    }
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300",

                      category === cat
                        ? "border-transparent bg-[image:var(--gradient-accent)] text-primary-foreground shadow-[var(--shadow-glow)]"
                        : "border-border bg-surface text-foreground/70 hover:border-accent/45 hover:text-teal"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* ==========================================
                NOTICE LIST
            ========================================== */}
            <div className="space-y-4">
              {/* Loading */}
              {loading ? (
                <div className="rounded-3xl border border-border bg-surface p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    নোটিশ লোড হচ্ছে...
                  </p>
                </div>
              ) : null}

              {/* Error */}
              {!loading && error ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
                  <p className="text-sm text-red-600">
                    {error}
                  </p>
                </div>
              ) : null}

              {/* Notice Cards */}
              {!loading &&
                !error &&
                items.map((notice, i) => (
                  <Reveal
                    key={notice.id}
                    delay={i * 60}
                  >
                    <article className="group relative grid gap-4 overflow-hidden rounded-3xl border border-border bg-surface p-5 transition-all duration-500 hover:-translate-y-1 hover:border-accent/45 hover:shadow-[var(--shadow-glow)] sm:grid-cols-[auto_minmax(0,1fr)] sm:p-6">
                      <span className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[image:var(--gradient-accent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      {/* Date Box */}
                      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-accent/25 bg-accent/8 text-teal">
                        <span className="text-lg leading-none font-bold">
                          {notice.day}
                        </span>

                        <span className="text-[11px] leading-none">
                          {notice.month}
                        </span>
                      </div>

                      <div className="min-w-0">
                        {/* Category + Date */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span
                            className={cn(
                              "rounded-full border px-3 py-1 font-semibold",

                              categoryTone[
                                notice.category
                              ] ||
                                categoryTone[
                                  "অন্যান্য"
                                ]
                            )}
                          >
                            {notice.category}
                          </span>

                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Icon
                              name="calendar"
                              className="h-3.5 w-3.5"
                            />

                            প্রকাশ: {notice.date}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="mt-2.5 text-base font-semibold text-primary">
                          {notice.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                          {notice.description}
                        </p>

                        {/* Download Button */}
                        {notice.download_url ? (
                          <a
                            href={notice.download_url}
                            className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/8 px-5 py-2 text-xs font-semibold text-teal transition-all duration-300 hover:bg-[image:var(--gradient-accent)] hover:text-primary-foreground"
                          >
                            <Icon
                              name="download"
                              className="h-3.5 w-3.5"
                            />

                            ডাউনলোড
                          </a>
                        ) : null}
                      </div>
                    </article>
                  </Reveal>
                ))}

              {/* No Result */}
              {!loading &&
              !error &&
              items.length === 0 ? (
                <p className="rounded-3xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted-foreground">
                  এই অনুসন্ধানে কোনো নোটিশ পাওয়া যায়নি।
                </p>
              ) : null}
            </div>
          </Reveal>

          {/* ==========================================
              RIGHT SIDE
          ========================================== */}
          <Reveal
            delay={120}
            className="space-y-5 lg:sticky lg:top-28"
          >
            {/* Academic Calendar */}
            <div className="relative overflow-hidden rounded-3xl border border-cyan-soft/20 bg-navy-deep p-6 text-primary-foreground">
              <div className="pointer-events-none absolute inset-0 grid-pattern opacity-[0.16]" />

              <div className="pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full bg-[image:var(--gradient-accent)] opacity-25 blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-foreground/10 text-cyan-soft">
                    <Icon
                      name="calendar"
                      className="h-4.5 w-4.5"
                    />
                  </span>

                  <h3 className="text-base font-semibold">
                    আসন্ন শিক্ষাবর্ষের কার্যসূচি
                  </h3>
                </div>

                <ul className="mt-5 space-y-3">
                  {academicCalendar.map(
                    (event) => (
                      <li
                        key={event.id}
                        className="group flex items-start gap-3 rounded-2xl border border-cyan-soft/15 bg-primary-foreground/5 p-3.5 transition-colors duration-300 hover:border-accent/45"
                      >
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent shadow-[var(--shadow-glow)]" />

                        <div className="min-w-0">
                          <p className="text-xs text-cyan-soft/70">
                            {event.date}
                          </p>

                          <p className="mt-0.5 text-sm font-semibold">
                            {event.title}
                          </p>

                          <span className="mt-1.5 inline-flex rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] text-cyan-soft">
                            {event.tag}
                          </span>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            {/* Download Links */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
              <h3 className="text-base font-semibold text-primary">
                গুরুত্বপূর্ণ ডাউনলোড লিংক
              </h3>

              <ul className="mt-4 space-y-2.5">
                {downloadLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.file}
                      download
                      className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-[var(--shadow-soft)]"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-teal">
                        <Icon
                          name="download"
                          className="h-4 w-4"
                        />
                      </span>

                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-primary">
                          {link.title}
                        </span>

                        <span className="block text-[11px] text-muted-foreground">
                          {link.meta}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
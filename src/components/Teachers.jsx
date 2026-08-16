import { useMemo, useState } from "react";
import { departments, teachers } from "@/data/teachers";
import { cn } from "@/lib/utils";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import TeacherCard from "./TeacherCard";

export default function Teachers() {
  const [department, setDepartment] = useState("সব");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim();
    return teachers.filter((teacher) => {
      const matchDept = department === "সব" || teacher.department === department;
      const matchQuery =
        !q || teacher.name.includes(q) || teacher.subject.includes(q) || teacher.designation.includes(q);
      return matchDept && matchQuery;
    });
  }, [department, query]);

  return (
    <section id="teachers" className="section-y scroll-mt-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="শিক্ষক প্যানেল"
          title="আমাদের শিক্ষকবৃন্দ"
          subtitle="অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকদের সমন্বয়ে আমাদের শিক্ষাঙ্গন"
        />

        <Reveal className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
            <Icon name="search" className="h-5 w-5 shrink-0 text-teal" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="শিক্ষকের নাম দিয়ে খুঁজুন..."
              aria-label="শিক্ষক অনুসন্ধান"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setDepartment(dept)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300",
                  department === dept
                    ? "border-transparent bg-[image:var(--gradient-accent)] text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "border-border bg-surface text-foreground/75 hover:border-accent/50 hover:text-teal",
                )}
              >
                {dept}
              </button>
            ))}
          </div>
        </Reveal>

        {filtered.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((teacher, i) => (
              <Reveal key={teacher.id} delay={(i % 3) * 90}>
                <TeacherCard teacher={teacher} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-12 rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            এই অনুসন্ধানে কোনো শিক্ষক পাওয়া যায়নি।
          </p>
        )}
      </div>
    </section>
  );
}

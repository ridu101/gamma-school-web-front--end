import { images } from "@/lib/images";
import Icon from "./Icon";

export default function TeacherCard({ teacher }) {
  return (
    <article className="group h-full overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/45 hover:shadow-[var(--shadow-glow)]">
      <div className="relative overflow-hidden">
        <img
          src={images[teacher.image]}
          alt={teacher.name}
          width={900}
          height={1100}
          loading="lazy"
          className="h-64 w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-0 transition-opacity duration-500 group-hover:opacity-70" />
        <span className="absolute top-4 left-4 rounded-full bg-navy-deep/70 px-3 py-1 text-[11px] font-semibold text-cyan-soft backdrop-blur">
          {teacher.badge}
        </span>
        <span className="absolute bottom-4 left-4 rounded-full bg-[image:var(--gradient-accent)] px-3 py-1 text-[11px] font-semibold text-primary-foreground">
          {teacher.department}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-base font-semibold text-primary">{teacher.name}</h3>
        <p className="text-xs text-teal">{teacher.designation}</p>

        <dl className="mt-4 space-y-1.5 text-xs text-muted-foreground">
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold text-foreground/70">বিষয়:</dt>
            <dd className="min-w-0">{teacher.subject}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold text-foreground/70">যোগ্যতা:</dt>
            <dd className="min-w-0">{teacher.qualification}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold text-foreground/70">অভিজ্ঞতা:</dt>
            <dd className="min-w-0">{teacher.experience}</dd>
          </div>
        </dl>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{teacher.bio}</p>

        <div className="mt-5 flex items-center gap-2">
          <a
            href={`mailto:${teacher.email}`}
            aria-label={`${teacher.name} — ই-মেইল`}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border text-teal transition-colors hover:border-accent/60 hover:bg-accent/10"
          >
            <Icon name="mail" className="h-4 w-4" />
          </a>
          <a
            href={`tel:${teacher.phone}`}
            aria-label={`${teacher.name} — ফোন`}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border text-teal transition-colors hover:border-accent/60 hover:bg-accent/10"
          >
            <Icon name="phone" className="h-4 w-4" />
          </a>
          <button
            type="button"
            className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-primary/6 px-4 py-2 text-xs font-semibold text-teal transition-colors hover:bg-accent/12"
          >
            প্রোফাইল <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

import Icon from "./Icon";

export default function TeacherCard({ teacher }) {
  // Laravel photo থাকলে সেটা ব্যবহার করবে
  // না থাকলে school.png fallback হিসেবে দেখাবে
  const photoUrl = teacher.photo
    ? teacher.photo.startsWith("http")
      ? teacher.photo
      : `http://127.0.0.1:8000/storage/${teacher.photo}`
    : "/school.png";

  return (
    <article className="group h-full overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/45 hover:shadow-[var(--shadow-glow)]">
      
      {/* Teacher Image */}
      <div className="relative overflow-hidden">
        <img
          src={photoUrl}
          alt={teacher.name}
          width={900}
          height={1100}
          loading="lazy"
          className="h-64 w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "/school.png";
          }}
        />

        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-0 transition-opacity duration-500 group-hover:opacity-70" />

        {/* Teacher badge */}
        <span className="absolute top-4 left-4 rounded-full bg-navy-deep/70 px-3 py-1 text-[11px] font-semibold text-cyan-soft backdrop-blur">
          শিক্ষক
        </span>

        {/* Department */}
        {teacher.department && (
          <span className="absolute bottom-4 left-4 rounded-full bg-[image:var(--gradient-accent)] px-3 py-1 text-[11px] font-semibold text-primary-foreground">
            {teacher.department}
          </span>
        )}
      </div>

      {/* Teacher Information */}
      <div className="p-5">
        <h3 className="text-base font-semibold text-primary">
          {teacher.name}
        </h3>

        {teacher.designation && (
          <p className="text-xs text-teal">
            {teacher.designation}
          </p>
        )}

        <dl className="mt-4 space-y-1.5 text-xs text-muted-foreground">
          
          {/* Department */}
          {teacher.department && (
            <div className="flex gap-2">
              <dt className="shrink-0 font-semibold text-foreground/70">
                বিভাগ:
              </dt>
              <dd className="min-w-0">
                {teacher.department}
              </dd>
            </div>
          )}

          {/* Email */}
          {teacher.email && (
            <div className="flex gap-2">
              <dt className="shrink-0 font-semibold text-foreground/70">
                ই-মেইল:
              </dt>
              <dd className="min-w-0 truncate">
                {teacher.email}
              </dd>
            </div>
          )}

          {/* Phone */}
          {teacher.phone && (
            <div className="flex gap-2">
              <dt className="shrink-0 font-semibold text-foreground/70">
                ফোন:
              </dt>
              <dd className="min-w-0">
                {teacher.phone}
              </dd>
            </div>
          )}
        </dl>

        {/* Bio */}
        {teacher.bio && (
          <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {teacher.bio}
          </p>
        )}

        {/* Actions */}
        <div className="mt-5 flex items-center gap-2">

          {/* Email */}
          {teacher.email && (
            <a
              href={`mailto:${teacher.email}`}
              aria-label={`${teacher.name} — ই-মেইল`}
              className="grid h-9 w-9 place-items-center rounded-xl border border-border text-teal transition-colors hover:border-accent/60 hover:bg-accent/10"
            >
              <Icon name="mail" className="h-4 w-4" />
            </a>
          )}

          {/* Phone */}
          {teacher.phone && (
            <a
              href={`tel:${teacher.phone}`}
              aria-label={`${teacher.name} — ফোন`}
              className="grid h-9 w-9 place-items-center rounded-xl border border-border text-teal transition-colors hover:border-accent/60 hover:bg-accent/10"
            >
              <Icon name="phone" className="h-4 w-4" />
            </a>
          )}

          {/* Profile */}
          <button
            type="button"
            className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-primary/6 px-4 py-2 text-xs font-semibold text-teal transition-colors hover:bg-accent/12"
          >
            প্রোফাইল
            <Icon
              name="arrowUpRight"
              className="h-3.5 w-3.5"
            />
          </button>
        </div>
      </div>
    </article>
  );
}
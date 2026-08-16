import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

export default function SectionHeading({ eyebrow, title, subtitle, align = "center", tone = "light" }) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide",
            tone === "dark"
              ? "border-cyan-soft/25 bg-navy-deep/40 text-cyan-soft"
              : "border-accent/25 bg-accent/8 text-teal",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "mt-4 text-2xl font-bold sm:text-3xl lg:text-4xl",
          tone === "dark" ? "text-primary-foreground" : "text-primary",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-3 text-sm leading-relaxed sm:text-base",
            tone === "dark" ? "text-cyan-soft/80" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}

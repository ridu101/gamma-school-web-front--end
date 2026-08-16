import { principalMessage } from "@/data/site";
import { images } from "@/lib/images";
import Icon from "./Icon";
import Reveal from "./Reveal";

export default function PrincipalMessage() {
  return (
    <Reveal className="mt-12 lg:mt-16">
      <div className="relative overflow-hidden rounded-3xl bg-navy-deep p-6 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-[0.16]" />
        <div className="pointer-events-none absolute -right-16 -bottom-20 h-72 w-72 rounded-full bg-[image:var(--gradient-accent)] opacity-25 blur-3xl" />
        <div className="relative grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-8">
          <img
            src={images[principalMessage.image]}
            alt={principalMessage.name}
            width={900}
            height={1100}
            loading="lazy"
            className="h-40 w-40 rounded-2xl border border-cyan-soft/25 object-cover shadow-[var(--shadow-lift)] sm:h-48 sm:w-40"
          />
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-soft/25 px-4 py-1.5 text-xs font-semibold text-cyan-soft">
              <Icon name="spark" className="h-3.5 w-3.5 text-accent" />
              প্রধান শিক্ষকের বাণী
            </span>
            <p className="mt-4 text-sm leading-relaxed text-cyan-soft/85 sm:text-base">
              “{principalMessage.message}”
            </p>
            <div className="mt-5 border-t border-cyan-soft/15 pt-4">
              <p className="text-sm font-semibold text-primary-foreground">
                {principalMessage.name}
              </p>
              <p className="text-xs text-cyan-soft/75">{principalMessage.role}</p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

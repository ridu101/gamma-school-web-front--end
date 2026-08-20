import { stats } from "@/data/site";
import Reveal from "./Reveal";

export default function Statistics() {
  return (
    <section className="relative z-20 -mt-28">
      <div className="container-x">
        <div className="glass-card grid gap-4 rounded-3xl p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-7">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90}>
              <div className="rounded-2xl border border-border/70 bg-(image:--gradient-soft) p-5 text-center transition-all duration-500 hover:-translate-y-1 hover:border-accent/45 hover:shadow-(--shadow-glow)">
                <p className="text-2xl font-bold text-gradient lg:text-3xl">{stat.value}</p>
                <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

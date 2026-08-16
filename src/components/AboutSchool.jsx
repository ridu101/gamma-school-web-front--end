import { aboutContent, quickInfo } from "@/data/site";
import { images } from "@/lib/images";
import Icon from "./Icon";
import PrincipalMessage from "./PrincipalMessage";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function AboutSchool() {
  return (
    <section id="about" className="section-y ">
      <div className="container-x">
        <SectionHeading
          eyebrow="বিদ্যালয় পরিচিতি"
          title="আমাদের বিদ্যালয় সম্পর্কে"
          subtitle="জ্ঞান, নৈতিকতা ও প্রযুক্তির সমন্বয়ে একটি আলোকিত ভবিষ্যৎ"
        />

        <div className="mt-12 grid items-start gap-8 lg:mt-16 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <div className="relative">
              <div className="pointer-events-none absolute -top-6 -left-6 h-40 w-40 rounded-full bg-(image:--gradient-accent) opacity-15 blur-3xl" />
              <img
                src={images.about}
                alt="বিদ্যালয় প্রাঙ্গণ"
                width={1200}
                height={900}
                loading="lazy"
                className="relative w-full rounded-3xl border border-border object-cover shadow-(--shadow-lift)"
              />
              <div className="glass-card absolute -bottom-6 left-4 rounded-2xl px-5 py-4 sm:left-8">
                <p className="text-xl font-bold text-gradient">৪০ বছরের</p>
                <p className="text-xs text-muted-foreground">শিক্ষায় নিরবচ্ছিন্ন অগ্রযাত্রা</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="space-y-6 pt-8 lg:pt-0">
            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-primary lg:text-lg">
                <Icon name="calendar" className="h-5 w-5 text-teal" /> প্রতিষ্ঠার ইতিহাস
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {aboutContent.history}
              </p>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-primary lg:text-lg">
                <Icon name="target" className="h-5 w-5 text-teal" /> আমাদের লক্ষ্য
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {aboutContent.mission}
              </p>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-primary lg:text-lg">
                <Icon name="spark" className="h-5 w-5 text-teal" /> আমাদের উদ্দেশ্য
              </h3>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {aboutContent.objectives.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground/85"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/12 text-teal">
                      <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.2} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {quickInfo.map((info, i) => (
            <Reveal key={info.label} delay={i * 80}>
              <div className="card-premium flex h-full items-center gap-4 p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-teal">
                  <Icon name={info.icon} />
                </span>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-primary">{info.value}</p>
                  <p className="truncate text-xs text-muted-foreground">{info.label}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <PrincipalMessage />
      </div>
    </section>
  );
}

import { services } from "@/data/services";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Services() {
  return (
    <section id="services" className="section-y scroll-mt-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="ডিজিটাল সেবা"
          title="আমাদের ডিজিটাল সেবাসমূহ"
          subtitle="শিক্ষার্থী ও অভিভাবকদের জন্য প্রয়োজনীয় সেবাগুলো এখন এক প্ল্যাটফর্মে"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 80}>
              <article className="card-premium group relative h-full overflow-hidden p-6 lg:p-7">
                <span className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[image:var(--gradient-accent)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20" />
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-teal transition-all duration-500 group-hover:bg-[image:var(--gradient-accent)] group-hover:text-primary-foreground">
                  <Icon name={service.icon} className="h-7 w-7 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
                </span>
                <h3 className="relative mt-5 text-base font-semibold text-primary lg:text-lg">
                  {service.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <span className="relative mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-teal opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  বিস্তারিত <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

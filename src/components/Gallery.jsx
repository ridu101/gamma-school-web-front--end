import { useEffect, useMemo, useState } from "react";
import { gallery, galleryCategories, videos } from "@/data/gallery";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";
import Icon from "./Icon";
import Reveal from "./Reveal";

export default function Gallery() {
  const [category, setCategory] = useState("সব");
  const [activeVideo, setActiveVideo] = useState(null);

  const items = useMemo(
    () => (category === "সব" ? gallery : gallery.filter((g) => g.category === category)),
    [category],
  );

  useEffect(() => {
    if (!activeVideo) return undefined;
    const onKey = (e) => e.key === "Escape" && setActiveVideo(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeVideo]);

  return (
    <section id="gallery" className="section-y relative scroll-mt-24 overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-[image:var(--gradient-accent)] opacity-10 blur-3xl" />

      <div className="container-x relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            মিডিয়া আর্কাইভ
          </span>
          <h2 className="mt-4 text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">
            ফটো ও ভিডিও গ্যালারি
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            বিদ্যালয়ের বিভিন্ন অনুষ্ঠান, ক্রীড়া, ক্যাম্পাস কার্যক্রম ও শিক্ষামূলক মুহূর্তের স্মৃতি।
          </p>
          <span className="mx-auto mt-6 block h-px w-40 bg-[image:var(--gradient-accent)] opacity-70" />
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap justify-center gap-2">
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full border px-5 py-2 text-xs font-semibold transition-all duration-300",
                category === cat
                  ? "border-transparent bg-[image:var(--gradient-accent)] text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "border-border bg-surface text-foreground/70 hover:-translate-y-0.5 hover:border-accent/50 hover:text-teal",
              )}
            >
              {cat}
            </button>
          ))}
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 70}>
              <figure className="group relative overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/45 hover:shadow-[var(--shadow-glow)]">
                <div className="overflow-hidden">
                  <img
                    src={images[item.image]}
                    alt={item.title}
                    width={900}
                    height={700}
                    loading="lazy"
                    className="h-60 w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-64"
                  />
                </div>
                <span className="absolute top-4 right-4 rounded-full bg-surface/90 px-3 py-1 text-[11px] font-semibold text-teal backdrop-blur">
                  {item.category}
                </span>
                <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,var(--navy-deep),transparent)] p-5 pt-14">
                  <span className="block translate-y-2 text-sm font-semibold text-primary-foreground opacity-90 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.title}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-teal">
            <Icon name="video" className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-primary">ভিডিও গ্যালারি</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              নির্বাচিত অনুষ্ঠান ও কার্যক্রমের ভিডিও সংরক্ষণাগার
            </p>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video, i) => (
            <Reveal key={video.id} delay={(i % 4) * 70}>
              <button
                type="button"
                onClick={() => setActiveVideo(video)}
                className="group block w-full overflow-hidden rounded-3xl border border-border bg-surface text-right shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/45 hover:shadow-[var(--shadow-glow)]"
              >
                <span className="relative block overflow-hidden">
                  <img
                    src={images[video.image]}
                    alt={video.title}
                    width={800}
                    height={520}
                    loading="lazy"
                    className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 bg-navy-deep/35 transition-colors duration-500 group-hover:bg-navy-deep/55" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-[image:var(--gradient-accent)] text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-500 group-hover:scale-110">
                      <Icon name="play" className="h-5 w-5" strokeWidth={1.4} />
                    </span>
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-full bg-navy-deep/80 px-2.5 py-1 text-[11px] font-semibold text-cyan-soft">
                    {video.duration}
                  </span>
                </span>
                <span className="block p-5">
                  <span className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold text-teal">
                    {video.category}
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-primary">{video.title}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {activeVideo ? (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-navy-deep/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-soft/20 bg-navy-deep shadow-[var(--shadow-lift)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={images[activeVideo.image]}
                alt={activeVideo.title}
                className="h-56 w-full object-cover sm:h-80"
              />
              <div className="absolute inset-0 grid place-items-center bg-navy-deep/55">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-[image:var(--gradient-accent)] text-primary-foreground shadow-[var(--shadow-glow)]">
                  <Icon name="play" className="h-6 w-6" strokeWidth={1.4} />
                </span>
              </div>
              <button
                type="button"
                aria-label="বন্ধ করুন"
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 left-4 grid h-10 w-10 place-items-center rounded-xl border border-cyan-soft/25 bg-navy-deep/70 text-cyan-soft transition-colors hover:border-accent/60"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6">
              <span className="inline-flex rounded-full bg-accent/15 px-3 py-1 text-[11px] font-semibold text-cyan-soft">
                {activeVideo.category} • {activeVideo.duration}
              </span>
              <h4 className="mt-3 text-lg font-semibold text-primary-foreground">
                {activeVideo.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-cyan-soft/80">
                {activeVideo.description}
              </p>
              <p className="mt-3 text-xs text-cyan-soft/60">
                এটি একটি ডেমো ভিডিও প্রিভিউ — সম্পূর্ণ ফ্রন্টএন্ড উপস্থাপনা।
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

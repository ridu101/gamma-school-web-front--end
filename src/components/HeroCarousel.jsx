import { useCallback, useEffect, useRef, useState } from "react";
import { heroSlides } from "@/data/site";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";
import Icon from "./Icon";

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  const go = useCallback((next) => {
    setIndex((prev) => (next + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    timer.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(timer.current);
  }, [paused]);

  const scrollTo = (id) => () =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section
      id="home"
      className="relative isolate min-h-[88vh] overflow-hidden bg-navy-deep pt-28 pb-36 sm:pt-32 lg:min-h-[92vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {heroSlides.map((slide, i) => (
        <div
          key={slide.title}
          className={cn(
            "absolute inset-0 transition-opacity duration-200",
            i === index ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={i !== index}
        >
          <img
            src={images[slide.image]}
            alt={slide.title}
            width={1600}
            height={1000}
            loading={i === 0 ? "eager" : "lazy"}
            className={cn(
              "h-full w-full object-cover transition-transform duration-6000 ease-out",
              i === index ? "scale-105" : "scale-100",
            )}
          />
          <div className="absolute inset-0 bg-(image:--gradient-hero) opacity-95" />
          <div className="absolute inset-0 bg-navy-deep/45" />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-[0.18]" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-(image:--gradient-accent) opacity-25 blur-3xl float-slow" />

      <div className="container-x relative z-10 flex min-h-[62vh] items-center">
        <div className="max-w-3xl">
          {heroSlides.map((slide, i) => (
            <div
              key={slide.title}
              className={cn(
                "transition-all duration-700",
                i === index ? "block opacity-100" : "hidden opacity-0",
              )}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-soft/30 bg-navy-deep/40 px-4 py-1.5 text-xs font-semibold text-cyan-soft backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {slide.badge}
              </span>
              <h1 className="mt-5 text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-6xl">
                {slide.title}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-cyan-soft/85 sm:text-base lg:text-lg">
                {slide.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={scrollTo(slide.target)}
                  className="inline-flex items-center gap-2 rounded-full bg-(image:--gradient-accent) px-6 py-3 text-sm font-semibold text-primary-foreground shadow-(--shadow-glow) transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {slide.cta}
                  <Icon name="arrowRight" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollTo("notices")}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-soft/30 px-6 py-3 text-sm font-semibold text-cyan-soft backdrop-blur transition-colors duration-300 hover:bg-primary-foreground/10"
                >
                  নোটিশ বোর্ড
                  <Icon name="bell" className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-x relative z-10 mt-10 flex items-center gap-4">
        <button
          type="button"
          aria-label="পূর্ববর্তী"
          onClick={() => go(index - 1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-cyan-soft/30 text-cyan-soft backdrop-blur transition-colors hover:bg-primary-foreground/10"
        >
          <Icon name="chevronLeft" />
        </button>
        <button
          type="button"
          aria-label="পরবর্তী"
          onClick={() => go(index + 1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-cyan-soft/30 text-cyan-soft backdrop-blur transition-colors hover:bg-primary-foreground/10"
        >
          <Icon name="chevronRight" />
        </button>
        <div className="flex items-center gap-2">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`স্লাইড ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === index ? "w-10 bg-(image:--gradient-accent)" : "w-4 bg-cyan-soft/35",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

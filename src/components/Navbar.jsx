import { useEffect, useMemo, useState } from "react";
import { navLinks, contactInfo } from "@/data/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";
import Icon from "./Icon";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const ids = useMemo(() => navLinks.map((l) => l.id), []);
  const active = useActiveSection(ids);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => (event) => {
    event.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="hidden bg-navy-deep text-cyan-soft/85 md:block">
        <div className="container-x flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Icon name="phone" className="h-3.5 w-3.5 text-accent" />
              {contactInfo.phone}
            </span>
            <span className="flex items-center gap-2">
              <Icon name="mail" className="h-3.5 w-3.5 text-accent" />
              {contactInfo.email}
            </span>
          </div>
          <span className="flex items-center gap-2">
            <Icon name="location" className="h-3.5 w-3.5 text-accent" />
            {contactInfo.shortAddress}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-500",
          scrolled
            ? "glass-card border-x-0 border-t-0 border-b border-border/70"
            : "bg-navy-deep/25 backdrop-blur-sm",
        )}
      >
        <div className="container-x grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:h-20 lg:flex lg:justify-between">
          <a href="#home" onClick={go("home")} className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[image:var(--gradient-accent)] text-primary-foreground shadow-[var(--shadow-glow)]">
              <Icon name="cap" />
            </span>
            <span className="min-w-0">
              <span
                className={cn(
                  "block truncate text-sm font-bold sm:text-base",
                  scrolled ? "text-primary" : "text-primary-foreground",
                )}
              >
                ডিজিটাল বিদ্যালয়
              </span>
              <span
                className={cn(
                  "block truncate text-[11px]",
                  scrolled ? "text-muted-foreground" : "text-cyan-soft/85",
                )}
              >
                জ্ঞান • প্রযুক্তি • মানবিকতা
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-0.5 xl:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={go(link.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-[13px] font-medium transition-all duration-300",
                    isActive
                      ? "bg-[image:var(--gradient-accent)] text-primary-foreground shadow-[var(--shadow-glow)]"
                      : scrolled
                        ? "text-foreground/75 hover:bg-accent/10 hover:text-teal"
                        : "text-cyan-soft/90 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[image:var(--gradient-accent)] transition-opacity duration-300",
                      isActive ? "opacity-0" : "opacity-0",
                    )}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle scrolled={scrolled} />
            <a
              href="#contact"
              onClick={go("contact")}
              className="hidden items-center gap-2 rounded-full bg-[image:var(--gradient-accent)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5 sm:inline-flex"
            >
              যোগাযোগ করুন
              <Icon name="arrowUpRight" className="h-4 w-4" />
            </a>
            <button
              type="button"
              aria-label="মেনু"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-xl border backdrop-blur xl:hidden",
                scrolled
                  ? "border-border bg-surface/80 text-primary"
                  : "border-cyan-soft/25 bg-navy-deep/40 text-cyan-soft",
              )}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-border/70 bg-surface/95 backdrop-blur-xl xl:hidden">
            <nav className="container-x flex flex-col py-3">
              {navLinks.map((link) => {
                const isActive = active === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={go(link.id)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[image:var(--gradient-accent)] text-primary-foreground"
                        : "text-foreground/85 hover:bg-accent/10 hover:text-teal",
                    )}
                  >
                    {link.label}
                    {isActive ? <span className="h-1.5 w-1.5 rounded-full bg-accent" /> : null}
                  </a>
                );
              })}
              <a
                href="#contact"
                onClick={go("contact")}
                className="mt-2 mb-3 rounded-xl bg-[image:var(--gradient-accent)] px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                যোগাযোগ করুন
              </a>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}

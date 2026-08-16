import { contactInfo, navLinks } from "@/data/site";
import Icon from "./Icon";

export default function Footer() {
  const go = (id) => (event) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="relative overflow-hidden bg-navy-deep pt-14 pb-8">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-[0.12]" />
      <div className="container-x relative grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[image:var(--gradient-accent)] text-primary-foreground">
              <Icon name="cap" />
            </span>
            <div>
              <p className="text-base font-bold text-primary-foreground">ডিজিটাল বিদ্যালয়</p>
              <p className="text-[11px] text-cyan-soft/75">জ্ঞান • প্রযুক্তি • মানবিকতা</p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cyan-soft/75">
            আধুনিক শিক্ষা, ডিজিটাল সেবা ও মানবিক মূল্যবোধের সমন্বয়ে শিক্ষার্থীদের ভবিষ্যৎ গড়ার একটি
            নির্ভরযোগ্য শিক্ষাঙ্গন।
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-primary-foreground">দ্রুত লিংক</p>
          <ul className="mt-4 grid gap-2 text-sm text-cyan-soft/75">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={go(link.id)}
                  className="transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-primary-foreground">যোগাযোগ</p>
          <ul className="mt-4 grid gap-3 text-sm text-cyan-soft/75">
            <li className="flex items-start gap-2">
              <Icon name="location" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {contactInfo.address}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="phone" className="h-4 w-4 shrink-0 text-accent" />
              {contactInfo.phone}
            </li>
            <li className="flex items-center gap-2 break-all">
              <Icon name="mail" className="h-4 w-4 shrink-0 text-accent" />
              {contactInfo.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x relative mt-10 border-t border-cyan-soft/15 pt-5 text-center text-xs text-cyan-soft/60">
        © ২০২৬ ডিজিটাল বিদ্যালয় — সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}

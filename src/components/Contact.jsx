import { useState } from "react";
import { contactInfo } from "@/data/site";
import Icon from "./Icon";
import LocationCard from "./LocationCard";
import Reveal from "./Reveal";

const empty = { name: "", phone: "", email: "", subject: "", message: "" };

const fields = [
  { key: "name", label: "নাম", type: "text", placeholder: "আপনার পূর্ণ নাম" },
  { key: "phone", label: "মোবাইল নম্বর", type: "tel", placeholder: "০১XXXXXXXXX" },
  { key: "email", label: "ই-মেইল", type: "email", placeholder: "example@mail.com" },
  { key: "subject", label: "বিষয়", type: "text", placeholder: "বার্তার বিষয়" },
];

const socials = [
  { icon: "facebook", label: "ফেসবুক" },
  { icon: "youtube", label: "ইউটিউব" },
  { icon: "linkedin", label: "লিংকডইন" },
];

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [sent, setSent] = useState(false);

  const update = (key) => (e) => {
    setSent(false);
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm(empty);
  };

  const inputClass =
    "w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-accent/60 focus:bg-surface focus:shadow-[var(--shadow-glow)]";

  return (
    <section id="contact" className="section-y relative scroll-mt-24 overflow-hidden bg-surface-2">
      <div className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full bg-[image:var(--gradient-accent)] opacity-10 blur-3xl" />

      <div className="container-x relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            যোগাযোগ
          </span>
          <h2 className="mt-4 text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">
            আমাদের সাথে যোগাযোগ করুন
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            ভর্তি, তথ্য অথবা যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন।
          </p>
          <span className="mx-auto mt-6 block h-px w-40 bg-[image:var(--gradient-accent)] opacity-70" />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <Reveal>
            <form
              onSubmit={submit}
              className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((field) => (
                  <label key={field.key} className="block">
                    <span className="mb-2 block text-xs font-semibold text-foreground/75">
                      {field.label}
                    </span>
                    <input
                      type={field.type}
                      required={field.key === "name" || field.key === "phone"}
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={update(field.key)}
                      className={inputClass}
                    />
                  </label>
                ))}
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-semibold text-foreground/75">বার্তা</span>
                <textarea
                  rows={5}
                  required
                  placeholder="আপনার বার্তা লিখুন..."
                  value={form.message}
                  onChange={update("message")}
                  className={inputClass}
                />
              </label>
              <button
                type="submit"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-accent)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                বার্তা পাঠান <Icon name="send" className="h-4 w-4" />
              </button>
              {sent ? (
                <p className="mt-4 flex items-center gap-2 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-teal">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.2} />
                  আপনার বার্তাটি সফলভাবে গ্রহণ করা হয়েছে। আমরা দ্রুত যোগাযোগ করব।
                </p>
              ) : null}
            </form>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-3xl border border-cyan-soft/20 bg-navy-deep p-6 text-primary-foreground sm:p-8">
              <div className="pointer-events-none absolute inset-0 grid-pattern opacity-[0.16]" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-[image:var(--gradient-accent)] opacity-25 blur-3xl" />
              <div className="relative">
                <h3 className="text-lg font-semibold">যোগাযোগের তথ্য</h3>
                <p className="mt-1.5 text-sm text-cyan-soft/75">
                  {contactInfo.organization} — আমাদের সাথে সরাসরি যুক্ত হন।
                </p>

                <ul className="mt-6 space-y-3">
                  {[
                    { icon: "location", label: "ঠিকানা", value: contactInfo.address },
                    { icon: "phone", label: "ফোন", value: contactInfo.phone },
                    { icon: "mail", label: "ই-মেইল", value: contactInfo.email },
                    { icon: "clock", label: "অফিস সময়", value: "শনি–বৃহস্পতি, সকাল ৯টা – বিকাল ৫টা" },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="flex items-start gap-3 rounded-2xl border border-cyan-soft/15 bg-primary-foreground/5 p-4 transition-colors duration-300 hover:border-accent/45"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-cyan-soft">
                        <Icon name={item.icon} className="h-4.5 w-4.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] text-cyan-soft/65">{item.label}</span>
                        <span className="mt-0.5 block text-sm font-semibold break-words">
                          {item.value}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center gap-2.5">
                  {socials.map((s) => (
                    <a
                      key={s.icon}
                      href="#contact"
                      aria-label={s.label}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-soft/20 bg-primary-foreground/5 text-cyan-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:text-primary-foreground"
                    >
                      <Icon name={s.icon} className="h-4.5 w-4.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={80} className="mt-6">
          <LocationCard />
        </Reveal>
      </div>
    </section>
  );
}

import { contactInfo } from "@/data/site";
import Icon from "./Icon";

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14695.88204680875!2d91.1000!3d22.8700!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDUyJzEyLjAiTiA5McKwMDYnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1234567890";

export default function LocationCard() {
  return (
    <div className="grid overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="relative">
        <span className="pointer-events-none absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-surface/90 px-3 py-1.5 text-[11px] font-semibold text-teal shadow-[var(--shadow-soft)] backdrop-blur">
          <Icon name="location" className="h-3.5 w-3.5" /> বিদ্যালয়ের অবস্থান
        </span>
        <div className="h-[260px] w-full overflow-hidden sm:h-[300px] lg:h-full lg:min-h-[360px]">
          <iframe
            src={MAP_EMBED_URL}
            title="বিদ্যালয়ের অবস্থান"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[260px] w-full border-0"
          />
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-3 py-1 text-[11px] font-semibold text-teal">
          <Icon name="route" className="h-3.5 w-3.5" /> অবস্থান
        </span>
        <h3 className="mt-3 text-lg font-semibold text-primary">আমাদের অবস্থান</h3>
        <p className="mt-1 text-sm text-teal">{contactInfo.shortAddress}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {contactInfo.organization} — {contactInfo.address}। পুরানা পল্টন মোড় থেকে হাঁটা দূরত্বে,
          সহজেই খুঁজে পাওয়া যায়।
        </p>

        <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> নিকটবর্তী ল্যান্ডমার্ক: পল্টন মোড়
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> পার্কিং ও গণপরিবহন সুবিধা রয়েছে
          </li>
          <li className="flex items-center gap-2">
            <Icon name="phone" className="h-3.5 w-3.5 shrink-0 text-accent" /> {contactInfo.phone}
          </li>
        </ul>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-accent)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          দিকনির্দেশনা দেখুন <Icon name="route" className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

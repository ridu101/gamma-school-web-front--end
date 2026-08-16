import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import Icon from "./Icon";

export default function ThemeToggle({ scrolled = true, className }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
      title={isDark ? "লাইট মোড" : "ডার্ক মোড"}
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center rounded-xl border backdrop-blur transition-all duration-300 hover:-translate-y-0.5",
        scrolled
          ? "border-border bg-surface/80 text-teal"
          : "border-cyan-soft/25 bg-navy-deep/40 text-cyan-soft",
        className,
      )}
    >
      <span className="transition-transform duration-300">
        <Icon name={isDark ? "sun" : "moon"} className="h-4.5 w-4.5" />
      </span>
    </button>
  );
}

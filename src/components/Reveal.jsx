import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

export default function Reveal({ children, className, delay = 0, as: Tag = "div" }) {
  const [ref, visible] = useReveal();

  return (
    <Tag
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

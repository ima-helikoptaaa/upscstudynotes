import { cn } from "@/lib/utils";

interface TagProps {
  label: string;
  variant?: "default" | "subject" | "source" | "type" | "active";
  className?: string;
  onClick?: () => void;
}

const subjectColors: Record<string, string> = {
  GS1: "bg-blue-50 text-blue-700",
  GS2: "bg-emerald-50 text-emerald-700",
  GS3: "bg-orange-50 text-orange-700",
  GS4: "bg-purple-50 text-purple-700",
  Optional: "bg-pink-50 text-pink-700",
  CA: "bg-amber-50 text-amber-700",
};

const sourceColors: Record<string, string> = {
  NCERT: "bg-sky-50 text-sky-700 border border-sky-100",
  Coaching: "bg-violet-50 text-violet-700 border border-violet-100",
  PYQ: "bg-rose-50 text-rose-700 border border-rose-100",
};

export function Tag({ label, variant = "default", className, onClick }: TagProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-satoshi transition-all duration-150 leading-none",
        variant === "default" &&
          "bg-[#F0EFE9] text-[var(--color-text-secondary)]",
        variant === "active" &&
          "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
        variant === "subject" && (subjectColors[label] ?? "bg-gray-100 text-gray-700"),
        variant === "source" && (sourceColors[label] ?? "bg-gray-50 text-gray-600 border border-gray-100"),
        onClick && "cursor-pointer hover:opacity-75",
        className
      )}
    >
      {label}
    </span>
  );
}

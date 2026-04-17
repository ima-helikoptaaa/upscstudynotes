import { cn } from "@/lib/utils";

interface TagProps {
  label: string;
  variant?: "default" | "subject" | "source" | "collection" | "type" | "active";
  className?: string;
  onClick?: () => void;
}

const subjectColors: Record<string, string> = {
  GS1:      "bg-blue-50   text-blue-700   border border-blue-100",
  GS2:      "bg-emerald-50 text-emerald-700 border border-emerald-100",
  GS3:      "bg-orange-50 text-orange-700 border border-orange-100",
  GS4:      "bg-purple-50 text-purple-700 border border-purple-100",
  CSAT:     "bg-amber-50  text-amber-700  border border-amber-100",
  Optionals:"bg-pink-50   text-pink-700   border border-pink-100",
  Essay:    "bg-teal-50   text-teal-700   border border-teal-100",
};

const sourceColors: Record<string, string> = {
  VisionIAS:   "bg-indigo-50  text-indigo-700  border border-indigo-100",
  ForumIAS:    "bg-teal-50    text-teal-700    border border-teal-100",
  DrishtiIAS:  "bg-sky-50     text-sky-700     border border-sky-100",
  ShankarIAS:  "bg-violet-50  text-violet-700  border border-violet-100",
  InsightsIAS: "bg-cyan-50    text-cyan-700    border border-cyan-100",
  StudyIQ:     "bg-lime-50    text-lime-700    border border-lime-100",
  NCERT:       "bg-rose-50    text-rose-700    border border-rose-100",
  PYQ:         "bg-amber-50   text-amber-700   border border-amber-100",
};

export function Tag({ label, variant = "default", className, onClick }: TagProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold font-satoshi leading-none transition-all duration-150",
        variant === "default" &&
          "bg-[#EEECEA] text-[var(--color-text-secondary)] border border-[var(--color-border)]",
        variant === "active" &&
          "bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary)]/20",
        variant === "subject" && (subjectColors[label] ?? "bg-gray-100 text-gray-700 border border-gray-200"),
        variant === "source"  && (sourceColors[label]  ?? "bg-gray-50  text-gray-600  border border-gray-100"),
        variant === "collection" && (sourceColors[label] ?? "bg-gray-50  text-gray-600  border border-gray-100"),
        onClick && "cursor-pointer hover:opacity-75",
        className
      )}
    >
      {label}
    </span>
  );
}

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

/**
 * Primary uses Sentient for stronger CTA presence.
 * Secondary and ghost use Satoshi.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          /* Base */
          "inline-flex items-center justify-center transition-all duration-[175ms] ease-out",
          "rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 focus-visible:ring-offset-1",
          "disabled:opacity-40 disabled:pointer-events-none select-none",

          /* Variants */
          variant === "primary" && [
            "font-sentient bg-[var(--color-primary)] text-white border border-[var(--color-primary)]",
            "hover:bg-[var(--color-primary-hover)] hover:border-[var(--color-primary-hover)]",
            "active:scale-[0.98]",
          ],
          variant === "secondary" && [
            "font-satoshi tracking-satoshi border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)]",
            "hover:bg-[var(--color-surface-alt)] hover:border-[var(--color-border-strong)]",
            "active:scale-[0.98]",
          ],
          variant === "ghost" && [
            "font-satoshi tracking-satoshi text-[var(--color-text-secondary)]",
            "hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]",
          ],

          /* Sizes */
          size === "sm" && "text-xs px-3.5 py-1.5 gap-1.5",
          size === "md" && "text-sm px-4 py-2 gap-2",
          size === "lg" && "text-[0.9375rem] px-5 py-2.5 gap-2",

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };

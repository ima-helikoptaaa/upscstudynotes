"use client";

import * as Select from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { ChevronDown as ChevronDownIcon, Check as CheckIcon } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  placeholder: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

export function Dropdown({
  placeholder,
  options,
  value,
  onChange,
  className,
}: DropdownProps) {
  const isActive = value !== null;

  return (
    <Select.Root
      value={value ?? "__all__"}
      onValueChange={(v) => onChange(v === "__all__" ? null : v)}
    >
      <Select.Trigger
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-satoshi transition-all duration-[175ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 select-none cursor-pointer",
          isActive
            ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
            : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[#F0EFE9]",
          className
        )}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="ml-0.5">
          <ChevronDownIcon size={12} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="bg-[var(--color-surface)] rounded-lg shadow-card-hover border border-[var(--color-border)] overflow-hidden z-50 min-w-[140px] animate-fade-up"
          position="popper"
          sideOffset={5}
          align="start"
        >
          <Select.Viewport className="p-1">
            {/* "All" reset option */}
            <Select.Item
              value="__all__"
              className={cn(
                "flex items-center justify-between px-3 py-1.5 text-sm rounded-md cursor-pointer focus:outline-none transition-colors",
                !isActive
                  ? "text-[var(--color-text-primary)] bg-[#F7F6F2]"
                  : "text-[var(--color-text-secondary)] hover:bg-[#F7F6F2]"
              )}
            >
              <Select.ItemText>All</Select.ItemText>
              {!isActive && <CheckIcon size={12} className="text-[var(--color-primary)]" />}
            </Select.Item>

            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className={cn(
                  "flex items-center justify-between px-3 py-1.5 text-sm rounded-md cursor-pointer focus:outline-none transition-colors",
                  value === opt.value
                    ? "text-[var(--color-primary)] bg-[var(--color-primary-light)]"
                    : "text-[var(--color-text-primary)] hover:bg-[#F7F6F2]"
                )}
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
                {value === opt.value && (
                  <CheckIcon size={12} className="text-[var(--color-primary)]" />
                )}
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

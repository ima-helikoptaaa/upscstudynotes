"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X as XIcon } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  maxWidth = "max-w-md",
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.175 }}
              />
            </Dialog.Overlay>

            {/* Panel */}
            <Dialog.Content asChild>
              <motion.div
                className={cn(
                  "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-2rem)] bg-[var(--color-surface)] rounded-xl shadow-modal p-6 focus:outline-none",
                  maxWidth,
                  className
                )}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                transition={{ duration: 0.175, ease: "easeOut" }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  {title && (
                    <Dialog.Title className="font-sentient text-h3 text-[var(--color-text-primary)] pr-4">
                      {title}
                    </Dialog.Title>
                  )}
                  <Dialog.Close
                    onClick={onClose}
                    className="ml-auto shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[#F0EFE9] rounded-md p-1.5 transition-colors"
                    aria-label="Close"
                  >
                    <XIcon size={14} />
                  </Dialog.Close>
                </div>

                {children}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Step = "phone" | "otp" | "profile";

const MOCK_OTP = "1234";

const STEP_TITLES: Record<Step, string> = {
  phone: "Login to download",
  otp: "Enter your OTP",
  profile: "One last thing",
};

const STEP_SUBTITLES: Record<Step, string> = {
  phone: "Sign in to continue — takes under a minute.",
  otp: "We sent a 4-digit code to your number.",
  profile: "Optional — helps personalise your experience.",
};

export function LoginModal() {
  const { isAuthModalOpen, closeAuthModal, setUser, authRedirectAction } = useStore();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [attemptYear, setAttemptYear] = useState("");
  const [coaching, setCoaching] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setStep("phone");
    setPhone(""); setOtp(""); setOtpError(false);
    setAttemptYear(""); setCoaching("");
  };

  const handleClose = () => { closeAuthModal(); reset(); };

  /* Step 1 → Send OTP */
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setStep("otp");
  };

  /* Step 2 → Verify OTP */
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    if (otp !== MOCK_OTP) { setOtpError(true); return; }
    setOtpError(false);
    setStep("profile");
  };

  /* Step 3 → Complete */
  const handleComplete = (e?: React.FormEvent) => {
    e?.preventDefault();
    setUser({
      id: Math.random().toString(36).slice(2),
      name: `+91 ${phone}`,
      phone,
      attemptYear: attemptYear ? parseInt(attemptYear) : undefined,
      coaching: coaching || undefined,
    });
    handleClose();
    authRedirectAction?.();
  };

  const stepIndex = { phone: 0, otp: 1, profile: 2 }[step];

  return (
    <Dialog.Root open={isAuthModalOpen} onOpenChange={(v) => !v && handleClose()}>
      <AnimatePresence>
        {isAuthModalOpen && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            {/* Modal */}
            <Dialog.Content asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-2rem)] max-w-[680px] bg-[var(--color-surface)] rounded-2xl overflow-hidden focus:outline-none"
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.97 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="flex min-h-[440px]">
                  {/* ── Left visual panel ───────────────── */}
                  <div className="hidden md:flex w-[240px] shrink-0 flex-col bg-[#1C1B38] p-8 relative overflow-hidden">
                    {/* Subtle texture circles */}
                    <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[var(--color-primary)]/20" />
                    <div className="absolute -bottom-16 -right-8 w-56 h-56 rounded-full bg-[var(--color-accent)]/10" />

                    <div className="relative z-10 flex flex-col h-full">
                      <p className="font-sentient text-[1.1rem] text-[var(--color-primary-light)] mb-1 leading-none">
                        UPSC<span className="text-white">Notes</span>
                      </p>

                      <p className="font-sentient text-[1.375rem] text-white leading-snug mt-auto mb-6 text-balance">
                        "Every session brings you closer to selection."
                      </p>

                      <div className="flex gap-1.5">
                        {([0, 1, 2] as const).map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-0.5 rounded-full transition-all duration-300",
                              i === stepIndex
                                ? "bg-white flex-[2]"
                                : i < stepIndex
                                ? "bg-white/40 flex-1"
                                : "bg-white/15 flex-1"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── Right form ──────────────────────── */}
                  <div className="flex-1 flex flex-col p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <Dialog.Title className="font-sentient text-h3 text-[var(--color-text-primary)]">
                          {STEP_TITLES[step]}
                        </Dialog.Title>
                        <p className="text-sm text-[var(--color-text-secondary)] font-satoshi tracking-satoshi mt-1">
                          {STEP_SUBTITLES[step]}
                        </p>
                      </div>
                      <Dialog.Close
                        onClick={handleClose}
                        className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1.5 rounded-md hover:bg-[var(--color-surface-alt)] transition-colors ml-4"
                        aria-label="Close"
                      >
                        <X size={15} />
                      </Dialog.Close>
                    </div>

                    {/* Steps */}
                    <AnimatePresence mode="wait" initial={false}>
                      {step === "phone" && (
                        <StepPanel key="phone">
                          <form onSubmit={handleSendOTP} className="flex flex-col gap-4 flex-1">
                            <div className="flex-1">
                              <FieldLabel>Phone number</FieldLabel>
                              <div className="flex mt-1.5">
                                <span className="inline-flex items-center px-3.5 border border-r-0 border-[var(--color-border)] rounded-l-lg bg-[var(--color-surface-alt)] text-sm text-[var(--color-text-secondary)] font-satoshi tracking-satoshi">
                                  +91
                                </span>
                                <input
                                  type="tel"
                                  placeholder="9876543210"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                  className={fieldCls + " rounded-l-none"}
                                  maxLength={10}
                                  autoFocus
                                />
                              </div>
                            </div>
                            <Button
                              type="submit"
                              size="lg"
                              className="w-full justify-center mt-auto"
                              disabled={phone.length < 10 || loading}
                            >
                              {loading ? "Sending OTP…" : "Send OTP →"}
                            </Button>
                          </form>
                        </StepPanel>
                      )}

                      {step === "otp" && (
                        <StepPanel key="otp">
                          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4 flex-1">
                            <div className="flex-1">
                              <FieldLabel>
                                One-time password
                                <button
                                  type="button"
                                  onClick={() => setStep("phone")}
                                  className="ml-2 text-[var(--color-primary)] underline underline-offset-2 font-normal"
                                >
                                  Change number
                                </button>
                              </FieldLabel>
                              <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Enter 4-digit OTP"
                                value={otp}
                                onChange={(e) => {
                                  setOtpError(false);
                                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 4));
                                }}
                                className={cn(
                                  fieldCls,
                                  "text-center text-xl tracking-[0.3em] mt-1.5",
                                  otpError && "border-red-400 bg-red-50 focus:ring-red-300/30"
                                )}
                                maxLength={4}
                                autoFocus
                              />
                              {otpError && (
                                <p className="mt-1.5 text-xs text-red-500 font-satoshi">
                                  Incorrect OTP. Use <strong>1234</strong> for this demo.
                                </p>
                              )}
                            </div>
                            <Button
                              type="submit"
                              size="lg"
                              className="w-full justify-center mt-auto"
                              disabled={otp.length < 4 || loading}
                            >
                              {loading ? "Verifying…" : "Verify →"}
                            </Button>
                          </form>
                        </StepPanel>
                      )}

                      {step === "profile" && (
                        <StepPanel key="profile">
                          <form onSubmit={handleComplete} className="flex flex-col gap-4 flex-1">
                            <div className="flex-1 space-y-3.5">
                              <div>
                                <FieldLabel>Attempt year</FieldLabel>
                                <select
                                  value={attemptYear}
                                  onChange={(e) => setAttemptYear(e.target.value)}
                                  className={cn(fieldCls, "mt-1.5 bg-white")}
                                >
                                  <option value="">Select year</option>
                                  {[2025, 2026, 2027, 2028].map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <FieldLabel>Coaching (if any)</FieldLabel>
                                <input
                                  type="text"
                                  placeholder="e.g. Vision IAS, self-study"
                                  value={coaching}
                                  onChange={(e) => setCoaching(e.target.value)}
                                  className={cn(fieldCls, "mt-1.5")}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2.5 mt-auto">
                              <Button
                                type="button"
                                variant="secondary"
                                size="lg"
                                className="flex-1 justify-center"
                                onClick={() => handleComplete()}
                              >
                                Skip for now
                              </Button>
                              <Button type="submit" size="lg" className="flex-1 justify-center">
                                Done →
                              </Button>
                            </div>
                          </form>
                        </StepPanel>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

/* ── Helpers ────────────────────────────────────────────── */

const fieldCls =
  "w-full px-3.5 py-2.5 border border-[var(--color-border)] rounded-lg text-sm font-satoshi tracking-satoshi text-[var(--color-text-primary)] bg-[var(--color-surface)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/40 transition-all";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-[var(--color-text-secondary)] font-satoshi tracking-satoshi">
      {children}
    </label>
  );
}

function StepPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex-1 flex flex-col"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

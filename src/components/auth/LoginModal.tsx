"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ArrowLeft } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { LoginAscii, type LoginStep } from "@/components/ui/LoginAscii";
import { cn } from "@/lib/utils";

type Step = "phone" | "otp" | "details" | "prep";

const MOCK_OTP = "1234";

const STEP_META: Record<Step, { title: string; subtitle: string; index: number; asciiStep: LoginStep }> = {
  phone:   { title: "Welcome back",        subtitle: "Enter your number to get started.",               index: 0, asciiStep: "phone"   },
  otp:     { title: "Verify your number",  subtitle: "We sent a 4-digit code to your number.",          index: 1, asciiStep: "otp"     },
  details: { title: "Your details",        subtitle: "Help us personalise your experience.",            index: 2, asciiStep: "details" },
  prep:    { title: "Your preparation",    subtitle: "Tell us about your UPSC journey so far.",         index: 3, asciiStep: "prep"    },
};

export function LoginModal() {
  const { isAuthModalOpen, closeAuthModal, setUser, authRedirectAction } = useStore();

  const [step, setStep]               = useState<Step>("phone");
  const [phone, setPhone]             = useState("");
  const [otp, setOtp]                 = useState("");
  const [otpError, setOtpError]       = useState(false);
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [attemptYear, setAttemptYear] = useState("");
  const [coaching, setCoaching]       = useState("");
  const [loading, setLoading]         = useState(false);

  const reset = () => {
    setStep("phone");
    setPhone(""); setOtp(""); setOtpError(false);
    setName(""); setEmail(""); setAttemptYear(""); setCoaching("");
  };

  const handleClose = () => { closeAuthModal(); reset(); };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setStep("otp");
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    if (otp !== MOCK_OTP) { setOtpError(true); return; }
    setOtpError(false);
    setStep("details");
  };

  const handleDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setStep("prep");
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ id: Math.random().toString(36).slice(2), name, email, phone, attemptYear: attemptYear ? parseInt(attemptYear) : undefined, coaching: coaching || undefined });
    handleClose();
    authRedirectAction?.();
  };

  const { title, subtitle, index: stepIndex, asciiStep } = STEP_META[step];

  return (
    <Dialog.Root open={isAuthModalOpen} onOpenChange={(v) => !v && handleClose()}>
      <AnimatePresence>
        {isAuthModalOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-[3px] z-50"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  className="w-full max-w-[700px] bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-2xl shadow-black/25 focus:outline-none"
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex min-h-[480px]">

                    {/* ── Left: ASCII only ──────────────────── */}
                    <div className="hidden md:flex w-[200px] shrink-0 flex-col bg-[#161529] px-5 py-6 relative overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                          backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                          backgroundSize: "24px 24px",
                        }}
                      />
                      <div className="relative z-10 flex flex-col h-full">
                        <LoginAscii step={asciiStep} />
                        {/* Progress dots */}
                        <div className="flex gap-1.5 mt-auto">
                          {([0, 1, 2, 3] as const).map((i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-[3px] rounded-full transition-all duration-400",
                                i === stepIndex  ? "bg-white flex-[2]"
                                : i < stepIndex  ? "bg-white/50 flex-1"
                                : "bg-white/12 flex-1"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ── Right: form ───────────────────────── */}
                    <div className="flex-1 flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-[var(--color-border)]">
                        <div>
                          <Dialog.Title className="font-sentient text-[1.3rem] leading-tight text-[var(--color-text-primary)]">
                            {title}
                          </Dialog.Title>
                          <p className="text-[13px] text-[var(--color-text-secondary)] font-satoshi mt-1">{subtitle}</p>
                        </div>
                        <Dialog.Close
                          onClick={handleClose}
                          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] transition-colors ml-4 mt-0.5"
                          aria-label="Close"
                        >
                          <X size={14} />
                        </Dialog.Close>
                      </div>

                      {/* Step content */}
                      <div className="flex-1 flex flex-col px-7 py-6">
                        <AnimatePresence mode="wait" initial={false}>

                          {/* Phone */}
                          {step === "phone" && (
                            <StepPanel key="phone">
                              <form onSubmit={handleSendOTP} className="flex flex-col gap-5 flex-1">
                                <div className="flex-1">
                                  <FieldLabel>Mobile number</FieldLabel>
                                  <div className="flex mt-1.5">
                                    <span className="inline-flex items-center px-3.5 border border-r-0 border-[var(--color-border)] rounded-l-lg bg-[var(--color-surface-alt)] text-sm text-[var(--color-text-secondary)] font-satoshi">+91</span>
                                    <input type="tel" placeholder="9876543210" value={phone}
                                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                      className={fieldCls + " rounded-l-none"} maxLength={10} autoFocus />
                                  </div>
                                </div>
                                <Button type="submit" size="lg" className="w-full justify-center" disabled={phone.length < 10 || loading}>
                                  {loading ? "Sending…" : "Send OTP →"}
                                </Button>
                              </form>
                            </StepPanel>
                          )}

                          {/* OTP */}
                          {step === "otp" && (
                            <StepPanel key="otp">
                              <form onSubmit={handleVerifyOTP} className="flex flex-col gap-5 flex-1">
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <FieldLabel>One-time password</FieldLabel>
                                    <button type="button" onClick={() => setStep("phone")}
                                      className="flex items-center gap-1 text-[11px] text-[var(--color-primary)] font-satoshi hover:underline">
                                      <ArrowLeft size={10} /> Change number
                                    </button>
                                  </div>
                                  <input type="text" inputMode="numeric" placeholder="1234" value={otp}
                                    onChange={(e) => { setOtpError(false); setOtp(e.target.value.replace(/\D/g, "").slice(0, 4)); }}
                                    className={cn(fieldCls, "text-center text-2xl tracking-[0.4em] mt-1.5", otpError && "border-red-400 bg-red-50 focus:ring-red-300/30")}
                                    maxLength={4} autoFocus />
                                  {otpError && <p className="text-xs text-red-500 font-satoshi pt-1">Incorrect OTP. Use <strong>1234</strong> for this demo.</p>}
                                </div>
                                <Button type="submit" size="lg" className="w-full justify-center" disabled={otp.length < 4 || loading}>
                                  {loading ? "Verifying…" : "Verify →"}
                                </Button>
                              </form>
                            </StepPanel>
                          )}

                          {/* Details: name + email */}
                          {step === "details" && (
                            <StepPanel key="details">
                              <form onSubmit={handleDetails} className="flex flex-col gap-5 flex-1">
                                <div className="flex-1 space-y-4">
                                  <div>
                                    <FieldLabel>Full name *</FieldLabel>
                                    <input required type="text" placeholder="Arjun Sharma" value={name}
                                      onChange={(e) => setName(e.target.value)}
                                      className={cn(fieldCls, "mt-1.5")} autoFocus />
                                  </div>
                                  <div>
                                    <FieldLabel>Email address *</FieldLabel>
                                    <input required type="email" placeholder="you@example.com" value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      className={cn(fieldCls, "mt-1.5")} />
                                  </div>
                                </div>
                                <Button type="submit" size="lg" className="w-full justify-center" disabled={!name || !email}>
                                  Continue →
                                </Button>
                              </form>
                            </StepPanel>
                          )}

                          {/* Prep: attempt year + coaching */}
                          {step === "prep" && (
                            <StepPanel key="prep">
                              <form onSubmit={handleComplete} className="flex flex-col gap-5 flex-1">
                                <div className="flex-1 space-y-4">
                                  <div>
                                    <FieldLabel>Attempt year *</FieldLabel>
                                    <Select.Root required value={attemptYear} onValueChange={setAttemptYear}>
                                      <Select.Trigger className={cn(fieldCls, "mt-1.5 flex items-center justify-between cursor-pointer data-[placeholder]:text-[var(--color-text-muted)]")}>
                                        <Select.Value placeholder="Select year" />
                                        <Select.Icon asChild><ChevronDown size={14} className="text-[var(--color-text-muted)] shrink-0" /></Select.Icon>
                                      </Select.Trigger>
                                      <Select.Portal>
                                        <Select.Content position="popper" sideOffset={4} className="z-[200] w-[--radix-select-trigger-width] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
                                          <Select.Viewport className="p-1">
                                            {[2025, 2026, 2027, 2028].map((y) => (
                                              <Select.Item key={y} value={String(y)} className="flex items-center px-3 py-2 rounded-md text-sm font-satoshi text-[var(--color-text-primary)] cursor-pointer outline-none data-[highlighted]:bg-[var(--color-primary-light)] data-[highlighted]:text-[var(--color-primary)] transition-colors select-none">
                                                <Select.ItemText>{y}</Select.ItemText>
                                              </Select.Item>
                                            ))}
                                          </Select.Viewport>
                                        </Select.Content>
                                      </Select.Portal>
                                    </Select.Root>
                                  </div>
                                  <div>
                                    <FieldLabel>Coaching / prep mode *</FieldLabel>
                                    <input required type="text" placeholder="Vision IAS, self-study…" value={coaching}
                                      onChange={(e) => setCoaching(e.target.value)}
                                      className={cn(fieldCls, "mt-1.5")} autoFocus />
                                  </div>
                                </div>
                                <Button type="submit" size="lg" className="w-full justify-center" disabled={!attemptYear || !coaching}>
                                  Done →
                                </Button>
                              </form>
                            </StepPanel>
                          )}

                        </AnimatePresence>
                      </div>
                    </div>

                  </div>
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

/* ── Helpers ──────────────────────────────────────────────── */

const fieldCls =
  "w-full px-3.5 py-2.5 border border-[var(--color-border)] rounded-lg text-sm font-satoshi text-[var(--color-text-primary)] bg-[var(--color-surface)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/40 transition-all";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] font-satoshi">
      {children}
    </label>
  );
}

function StepPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex-1 flex flex-col"
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -14 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Pencil, ArrowRight, Check } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function playChime() {
  try {
    const ctx = new AudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.start(t); osc.stop(t + 0.45);
    });
  } catch {}
}

const CONFETTI_COLORS = ["#4F46E5","#7C3AED","#EC4899","#F59E0B","#10B981","#3B82F6","#EF4444"];

function Confetti() {
  const pieces = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 0.4,
    duration: 0.9 + Math.random() * 0.6,
    rotate: Math.random() * 360,
    size: 6 + Math.random() * 6,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{ left: `${p.x}%`, top: -10, width: p.size, height: p.size * 0.6, background: p.color, rotate: p.rotate }}
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: p.rotate + 360 * 3 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

type Step = "phone" | "otp" | "details" | "prep";

const STEP_META: Record<Step, { title: string; index: number }> = {
  phone:   { title: "Login to save and download", index: 0 },
  otp:     { title: "Login to save and download", index: 1 },
  details: { title: "Login to save and download", index: 2 },
  prep:    { title: "Login to save and download", index: 3 },
};

function maskPhone(p: string) {
  if (p.length < 5) return p;
  return p.slice(0, 5).replace(/./g, "X") + " X" + p.slice(6);
}

export function LoginModal() {
  const { isAuthModalOpen, closeAuthModal, setUser, authRedirectAction } = useStore();

  const [step, setStep]               = useState<Step>("phone");
  const [phone, setPhone]             = useState("");
  const [otpDigits, setOtpDigits]     = useState<string[]>(["","","","","",""]);
  const [otpError, setOtpError]       = useState(false);
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [attemptYear, setAttemptYear] = useState("");
  const [coaching, setCoaching]       = useState("");
  const [loading, setLoading]         = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [demoOtp, setDemoOtp]         = useState<string | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otp = otpDigits.join("");

  const reset = () => {
    setStep("phone");
    setPhone(""); setOtpDigits(["","","","","",""]); setOtpError(false);
    setName(""); setEmail(""); setAttemptYear(""); setCoaching(""); setDemoOtp(null);
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtpError(false);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otpDigits[index]) {
        const next = [...otpDigits]; next[index] = ""; setOtpDigits(next);
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = ["","","","","",""];
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setOtpDigits(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleClose = () => { closeAuthModal(); reset(); };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.demoOtp) setDemoOtp(data.demoOtp);
    } catch {
      // fall through — OTP step will still show
    }
    setLoading(false);
    setStep("otp");
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok || data.error) { setOtpError(true); return; }
      setOtpError(false);
      if (data.user?.name) {
        setUser({ id: data.user.id, name: data.user.name, phone, email: "", attemptYear: data.user.attemptYear, coaching: data.user.coaching }, true);
        handleExistingUser();
        return;
      }
      setStep("details");
    } catch {
      setLoading(false);
      setOtpError(true);
    }
  };

  const handleDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setStep("prep");
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    const redirect = authRedirectAction;
    setUser({ id: Math.random().toString(36).slice(2), name, email, phone, attemptYear: attemptYear ? parseInt(attemptYear) : undefined, coaching: coaching || undefined }, true);
    playChime();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2200);
    handleClose();
    redirect?.();
  };

  const handleExistingUser = () => {
    const redirect = authRedirectAction;
    playChime();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2200);
    handleClose();
    redirect?.();
  };

  const { title, index: stepIndex } = STEP_META[step];

  return (
    <>
    {showConfetti && <Confetti />}
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
                  className="w-full max-w-[680px] bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-2xl shadow-black/25 focus:outline-none"
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex min-h-[460px]">

                    {/* ── Left: dot grid only ───────────────── */}
                    <div className="hidden md:flex w-[180px] shrink-0 flex-col bg-[#161529] px-5 py-6 relative overflow-hidden">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
                          backgroundSize: "20px 20px",
                        }}
                      />
                      {/* Progress in left panel */}
                      <div className="relative z-10 flex flex-col h-full justify-end">
                        <p className="text-[10px] font-satoshi text-white/40 mb-2 tracking-widest uppercase">
                          {stepIndex + 1} of 4
                        </p>
                        <div className="flex gap-1.5">
                          {[0, 1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-[3px] flex-1 rounded-full transition-all duration-300",
                                i <= stepIndex ? "bg-white" : "bg-white/25"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ── Right: form ───────────────────────── */}
                    <div className="flex-1 flex flex-col">
                      {/* Header */}
                      <div className="px-7 pt-7 pb-5 border-b border-[var(--color-border)]">
                        <Dialog.Title className="font-sentient text-[1.25rem] leading-tight text-[var(--color-text-primary)]">
                          {title}
                        </Dialog.Title>
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
                                  <div className="flex mt-2">
                                    <span className="inline-flex items-center px-3.5 border border-r-0 border-[var(--color-border)] rounded-l-lg bg-[var(--color-surface-alt)] text-sm text-[var(--color-text-secondary)] font-satoshi">
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
                                <Button type="submit" size="lg" className="w-full justify-center gap-2" disabled={phone.length < 10 || loading}>
                                  {loading ? "Sending…" : "Send OTP"}
                                </Button>
                              </form>
                            </StepPanel>
                          )}

                          {/* OTP */}
                          {step === "otp" && (
                            <StepPanel key="otp">
                              <form onSubmit={handleVerifyOTP} className="flex flex-col gap-5 flex-1">
                                <div className="flex-1 space-y-4">
                                  <div>
                                    <FieldLabel>Enter OTP</FieldLabel>
                                    <p className="text-[12px] text-[var(--color-text-muted)] font-satoshi flex items-center gap-1.5 mt-1">
                                      We&apos;ve sent a 6-digit OTP to your +91 {maskPhone(phone)}
                                      <button
                                        type="button"
                                        onClick={() => { setStep("phone"); setOtpDigits(["","","","","",""]); setOtpError(false); }}
                                        className="text-[var(--color-primary)] hover:opacity-70 transition-opacity"
                                        aria-label="Edit number"
                                      >
                                        <Pencil size={12} />
                                      </button>
                                    </p>
                                  </div>

                                  {/* 6-box OTP input */}
                                  <div className="flex gap-2.5" onPaste={handleOtpPaste}>
                                    {otpDigits.map((digit, i) => (
                                      <input
                                        key={i}
                                        ref={(el) => { otpRefs.current[i] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        autoFocus={i === 0}
                                        className={cn(
                                          "w-full aspect-square rounded-xl border text-center text-xl font-semibold font-satoshi text-[var(--color-text-primary)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 transition-all",
                                          otpError
                                            ? "border-red-400 bg-red-50 focus:ring-red-300/30"
                                            : "border-[var(--color-border)] focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/40"
                                        )}
                                      />
                                    ))}
                                  </div>

                                  {demoOtp && (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                                      <span className="text-[11px] text-amber-700 font-satoshi">Demo OTP:</span>
                                      <span className="text-sm font-bold font-mono text-amber-900 tracking-widest">{demoOtp}</span>
                                    </div>
                                  )}

                                  {otpError && (
                                    <p className="text-xs text-red-500 font-satoshi">
                                      Incorrect OTP. Please try again.
                                    </p>
                                  )}
                                </div>
                                <Button type="submit" size="lg" className="w-full justify-center gap-2" disabled={otp.length < 6 || loading}>
                                  {loading ? "Verifying…" : "Verify"}
                                </Button>
                              </form>
                            </StepPanel>
                          )}

                          {/* Details */}
                          {step === "details" && (
                            <StepPanel key="details">
                              <form onSubmit={handleDetails} className="flex flex-col gap-5 flex-1">
                                <div className="flex-1 space-y-4">
                                  <div>
                                    <FieldLabel>Full name</FieldLabel>
                                    <input required type="text" placeholder="Arjun Sharma" value={name}
                                      onChange={(e) => setName(e.target.value)}
                                      className={cn(fieldCls, "mt-2")} autoFocus />
                                  </div>
                                  <div>
                                    <FieldLabel>Email address</FieldLabel>
                                    <input required type="email" placeholder="you@example.com" value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      className={cn(fieldCls, "mt-2")} />
                                  </div>
                                </div>
                                <Button type="submit" size="lg" className="w-full justify-center gap-2" disabled={!name || !email}>
                                  <ArrowRight size={15} /> Continue
                                </Button>
                              </form>
                            </StepPanel>
                          )}

                          {/* Prep */}
                          {step === "prep" && (
                            <StepPanel key="prep">
                              <form onSubmit={handleComplete} className="flex flex-col gap-5 flex-1">
                                <div className="flex-1 space-y-4">
                                  <div>
                                    <FieldLabel>Attempt year</FieldLabel>
                                    <Select.Root value={attemptYear} onValueChange={setAttemptYear}>
                                      <Select.Trigger className={cn(fieldCls, "mt-2 flex items-center justify-between cursor-pointer data-[placeholder]:text-[var(--color-text-muted)]")}>
                                        <Select.Value placeholder="Select year" />
                                        <Select.Icon asChild><ChevronDown size={14} className="text-[var(--color-text-muted)] shrink-0" /></Select.Icon>
                                      </Select.Trigger>
                                      <Select.Portal>
                                        <Select.Content position="popper" sideOffset={4} className="z-[200] w-[--radix-select-trigger-width] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
                                          <Select.Viewport className="p-1">
                                            {["2026", "2027", "2028", "Later"].map((y) => (
                                              <Select.Item key={y} value={y} className="flex items-center px-3 py-2 rounded-md text-sm font-satoshi text-[var(--color-text-primary)] cursor-pointer outline-none data-[highlighted]:bg-[var(--color-primary-light)] data-[highlighted]:text-[var(--color-primary)] transition-colors select-none">
                                                <Select.ItemText>{y}</Select.ItemText>
                                              </Select.Item>
                                            ))}
                                          </Select.Viewport>
                                        </Select.Content>
                                      </Select.Portal>
                                    </Select.Root>
                                  </div>
                                  <div>
                                    <FieldLabel>Coaching / prep mode</FieldLabel>
                                    <input type="text" placeholder="Vision IAS, self-study…" value={coaching}
                                      onChange={(e) => setCoaching(e.target.value)}
                                      className={cn(fieldCls, "mt-2")} />
                                  </div>
                                </div>
                                <Button type="submit" size="lg" className="w-full justify-center gap-2" disabled={!attemptYear}>
                                  <Check size={15} /> Done
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
    </>
  );
}

/* ── Helpers ──────────────────────────────────────────────────── */

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

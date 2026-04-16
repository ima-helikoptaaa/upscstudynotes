"use client";

import { motion, AnimatePresence } from "framer-motion";

export type LoginStep = "phone" | "otp" | "details" | "prep";

const FRAMES: Record<LoginStep, string[]> = {
  phone: [
    "  .   .   .   .   .   .  ",
    " .                     . ",
    " .                     . ",
    " .                     . ",
    " .       |       |     . ",
    " .       |       |     . ",
    " .       |_______|     . ",
    " .                     . ",
    " .                     . ",
    "  .   .   .   .   .   .  ",
  ],
  otp: [
    "  .   .   .   .   .   .  ",
    " .       / . . \\      . ",
    " .      /  . .  \\     . ",
    " .     | . . . . |    . ",
    " .   . | |     | | .  . ",
    " .     | |     | |    . ",
    " .     |_|_____|_|    . ",
    " .   . |         | .  . ",
    " .     |_________|    . ",
    "  .   .   .   .   .   .  ",
  ],
  details: [
    "  .   .   .   .   .   .  ",
    " .       / . . \\      . ",
    " .      /  . .  \\     . ",
    " .     | . . . . |    . ",
    " .   . | | | | | | .  . ",
    " .     | | | | | |    . ",
    " .     |_|_|_|_|_|    . ",
    " .   . |         | .  . ",
    " .     |_________|    . ",
    "  .   .   .   .   .   .  ",
  ],
  prep: [
    "  .   .   .   *   .   .  ",
    " .          /|\\        . ",
    " .         / | \\       . ",
    " .        |  |  |      . ",
    " .   .  . | |*| | . .  . ",
    " .        | | | |      . ",
    " .        |_|_|_|      . ",
    " .   .    |     |   .  . ",
    " .        |_____|      . ",
    "  .   .   .   .   .   .  ",
  ],
};

const COLORS: Record<LoginStep, string> = {
  phone:   "rgba(255,255,255,0.18)",
  otp:     "rgba(255,255,255,0.35)",
  details: "rgba(255,255,255,0.52)",
  prep:    "rgba(167,139,250,0.75)",
};

export function LoginAscii({ step }: { step: LoginStep }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <pre
            aria-hidden
            style={{
              fontFamily: "monospace",
              fontSize: "13px",
              lineHeight: "1.7",
              letterSpacing: "0.06em",
              color: COLORS[step],
              whiteSpace: "pre",
            }}
          >
            {FRAMES[step].join("\n")}
          </pre>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

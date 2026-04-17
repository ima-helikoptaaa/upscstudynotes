import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({
  src: [
    { path: "../../assets/fonts/Satoshi-Regular.otf", weight: "400", style: "normal" },
    { path: "../../assets/fonts/Satoshi-Medium.otf",  weight: "500", style: "normal" },
    { path: "../../assets/fonts/Satoshi-Bold.otf",    weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const sentient = localFont({
  src: [
    { path: "../../assets/fonts/Sentient-Regular.otf", weight: "400", style: "normal" },
    { path: "../../assets/fonts/Sentient-Medium.otf",  weight: "500", style: "normal" },
    { path: "../../assets/fonts/Sentient-Bold.otf",    weight: "700", style: "normal" },
  ],
  variable: "--font-sentient",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UPSCStudyNotes - Study smarter",
  description:
    "Interactive PDF learning platform for UPSC aspirants. Explain, summarize, generate Q&A and flashcards from any study material.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${satoshi.variable} ${sentient.variable}`}>
      <body>{children}</body>
    </html>
  );
}

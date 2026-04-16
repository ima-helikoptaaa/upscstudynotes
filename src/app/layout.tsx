import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UPSCStudyNotes — Study smarter",
  description:
    "Interactive PDF learning platform for UPSC aspirants. Explain, summarize, generate Q&A and flashcards from any study material.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

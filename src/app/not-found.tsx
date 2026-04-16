import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-4 text-center">
      {/* Large muted number */}
      <p className="font-sentient text-[7rem] leading-none text-[var(--color-border-strong)] select-none mb-2">
        404
      </p>
      <h1 className="font-sentient text-h2 text-[var(--color-text-primary)] mb-3">
        Page not found
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] font-satoshi max-w-xs leading-relaxed mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-satoshi font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Back to home
        </Link>
        <Link
          href="/saved"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--color-border)] text-sm font-satoshi font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          Saved PDFs
        </Link>
      </div>
    </div>
  );
}

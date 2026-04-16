"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { LoginModal } from "@/components/auth/LoginModal";
import { COLLECTIONS } from "@/lib/mock-data";

export default function CollectionsPage() {
  return (
    <AppLayout showRightPanel={false}>
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] font-satoshi mb-1">
          Browse
        </p>
        <h1 className="font-sentient text-h2 text-[var(--color-text-primary)]">
          Collections
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] font-satoshi tracking-satoshi mt-1.5">
          Curated sets of PDFs organised by paper and source.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COLLECTIONS.map((col) => (
          <CollectionCard
            key={col.id}
            id={col.id}
            label={col.label}
            subjectFilter={col.subjectFilter}
            sourceFilter={col.sourceFilter}
          />
        ))}
      </div>

      <LoginModal />
    </AppLayout>
  );
}

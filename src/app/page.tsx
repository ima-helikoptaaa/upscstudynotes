"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PDFFeed } from "@/components/pdf/PDFFeed";
import { LoginModal } from "@/components/auth/LoginModal";

export default function HomePage() {
  return (
    <AppLayout>
      <PDFFeed />
      <LoginModal />
    </AppLayout>
  );
}

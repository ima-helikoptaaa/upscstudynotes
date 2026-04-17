"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSavedItems, user } = useStore();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [setUser]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/saved")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.data) {
          setSavedItems(data.data.map((p: { id: string }) => p.id));
        }
      })
      .catch(() => {});
  }, [user, setSavedItems]);

  return <>{children}</>;
}

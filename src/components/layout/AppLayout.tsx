import { Navbar } from "./Navbar";
import { Toast } from "@/components/ui/Toast";
import { WelcomeModal } from "@/components/ui/WelcomeModal";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <main>{children}</main>
      <Toast />
      <WelcomeModal />
    </div>
  );
}

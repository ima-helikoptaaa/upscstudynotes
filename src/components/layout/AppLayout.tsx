import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { RightPanel } from "./RightPanel";
import { SearchOverlay } from "@/components/search/SearchOverlay";

interface AppLayoutProps {
  children: React.ReactNode;
  showRightPanel?: boolean;
}

export function AppLayout({ children, showRightPanel = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Sidebar: off-white */}
      <Sidebar />

      {/* Main container — offset by sidebar on lg+ */}
      <div className="lg:pl-[216px] flex min-h-screen">
        {/* Center column — pure white, creates depth against sidebar */}
        <div className="flex-1 bg-[var(--color-surface)] border-r border-[var(--color-border)] min-w-0 flex flex-col">
          <TopBar />
          <main className="flex-1 px-6 py-6">
            {children}
          </main>
        </div>

        {/* Right panel — subtle neutral, different from white center */}
        {showRightPanel && <RightPanel />}
      </div>

      {/* Global search overlay (portal-like, rendered above everything) */}
      <SearchOverlay />
    </div>
  );
}

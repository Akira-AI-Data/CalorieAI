'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ArtifactsPanel } from '@/components/artifacts/ArtifactsPanel';
import { useUIStore } from '@/stores/uiStore';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const artifactsPanelOpen = useUIStore((s) => s.artifactsPanelOpen);

  return (
    <div className="flex h-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-hidden flex">
          <div className="flex-1 min-w-0">{children}</div>
          {artifactsPanelOpen && <ArtifactsPanel />}
        </main>
      </div>
    </div>
  );
}

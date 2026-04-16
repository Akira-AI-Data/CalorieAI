'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ArtifactsPanel } from '@/components/artifacts/ArtifactsPanel';
import { useUIStore } from '@/stores/uiStore';

export default function AdvisorPage() {
  const artifactsPanelOpen = useUIStore((s) => s.artifactsPanelOpen);
  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:h-screen -m-4 md:-m-8 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-hidden flex">
          <div className="flex-1 min-w-0"><ChatContainer /></div>
          {artifactsPanelOpen && <ArtifactsPanel />}
        </main>
      </div>
    </div>
  );
}

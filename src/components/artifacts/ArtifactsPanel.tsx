'use client';

import { X } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { ArtifactViewer } from './ArtifactViewer';

export function ArtifactsPanel() {
  const activeArtifact = useUIStore((s) => s.activeArtifact);
  const setActiveArtifact = useUIStore((s) => s.setActiveArtifact);

  if (!activeArtifact) return null;

  return (
    <div className="w-[500px] border-l border-border bg-background flex flex-col flex-shrink-0 h-full max-md:fixed max-md:inset-0 max-md:w-full max-md:z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <h3 className="font-medium text-sm text-foreground">{activeArtifact.title}</h3>
        <button
          onClick={() => setActiveArtifact(null)}
          className="p-1.5 rounded-lg hover:bg-sidebar-hover transition-colors text-muted"
          aria-label="Close artifacts panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <ArtifactViewer artifact={activeArtifact} />
      </div>
    </div>
  );
}

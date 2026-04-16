'use client';

import { cn } from '@/lib/utils';
import { Artifact } from '@/types';

interface ArtifactTabsProps {
  artifacts: Artifact[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function ArtifactTabs({ artifacts, activeId, onSelect }: ArtifactTabsProps) {
  if (artifacts.length <= 1) return null;

  return (
    <div className="flex border-b border-border overflow-x-auto">
      {artifacts.map((artifact) => (
        <button
          key={artifact.id}
          onClick={() => onSelect(artifact.id)}
          className={cn(
            'px-4 py-2 text-sm whitespace-nowrap transition-colors border-b-2',
            artifact.id === activeId
              ? 'border-accent text-foreground'
              : 'border-transparent text-muted hover:text-foreground'
          )}
        >
          {artifact.title}
        </button>
      ))}
    </div>
  );
}

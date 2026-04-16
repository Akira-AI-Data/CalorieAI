'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Artifact } from '@/types';

interface ArtifactViewerProps {
  artifact: Artifact;
}

export function ArtifactViewer({ artifact }: ArtifactViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (artifact.type === 'html') {
    return (
      <div className="h-full">
        <iframe
          srcDoc={artifact.content}
          className="w-full h-full border-0 bg-white"
          sandbox="allow-scripts"
          title={artifact.title}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-sidebar-bg">
        <span className="text-xs font-medium text-muted">
          {artifact.language || artifact.type}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-sidebar-hover transition-colors text-muted"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="flex-1 overflow-auto p-4 bg-code-bg text-sm font-mono text-foreground">
        <code>{artifact.content}</code>
      </pre>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';

interface MessageActionsProps {
  content: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function MessageActions({ content, onRetry, showRetry }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1 mt-1">
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors"
        aria-label="Copy message"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors"
          aria-label="Retry"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

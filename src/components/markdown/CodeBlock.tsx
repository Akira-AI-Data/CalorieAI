'use client';

import { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';
import { v4 as uuidv4 } from 'uuid';

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
}

export function CodeBlock({ className, children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const setActiveArtifact = useUIStore((s) => s.setActiveArtifact);

  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');

  // Inline code (no language class)
  if (!match) {
    return (
      <code className={cn('bg-code-bg px-1.5 py-0.5 rounded text-sm', className)} {...props}>
        {children}
      </code>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenArtifact = () => {
    setActiveArtifact({
      id: uuidv4(),
      type: 'code',
      title: language.charAt(0).toUpperCase() + language.slice(1),
      content: code,
      language,
    });
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="rounded-lg overflow-hidden border border-border my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-sidebar-bg text-xs">
        <span className="font-medium text-muted">{language}</span>
        <div className="flex items-center gap-1">
          {lineCount > 10 && (
            <button
              onClick={handleOpenArtifact}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-sidebar-hover transition-colors text-muted hover:text-foreground"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-sidebar-hover transition-colors text-muted hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto p-4 bg-code-bg text-sm">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

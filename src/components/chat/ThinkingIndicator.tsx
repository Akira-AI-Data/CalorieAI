'use client';

import { Avatar } from '@/components/ui/Avatar';

export function ThinkingIndicator() {
  return (
    <div className="flex gap-3 message-appear">
      <Avatar role="assistant" />
      <div className="flex-1">
        <div className="font-medium text-sm mb-1 text-foreground">Posha</div>
        <div className="flex items-center gap-1 py-2">
          <span className="text-sm text-muted">Thinking</span>
          <div className="flex gap-1 ml-1">
            <span className="thinking-dot w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="thinking-dot w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="thinking-dot w-1.5 h-1.5 rounded-full bg-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}

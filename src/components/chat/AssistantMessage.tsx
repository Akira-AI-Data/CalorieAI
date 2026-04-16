'use client';

import { memo } from 'react';
import { Message } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { MessageActions } from './MessageActions';

interface AssistantMessageProps {
  message: Message;
  isStreaming?: boolean;
  streamingContent?: string;
  isLast?: boolean;
  onRetry?: () => void;
}

export const AssistantMessage = memo(function AssistantMessage({
  message,
  isStreaming,
  streamingContent,
  isLast,
  onRetry,
}: AssistantMessageProps) {
  const content = isStreaming && isLast ? streamingContent || '' : message.content;

  return (
    <div className="flex gap-3 message-appear">
      <Avatar role="assistant" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm mb-1 text-foreground">NourishSnap</div>
        {content ? (
          <MarkdownRenderer content={content} />
        ) : (
          isStreaming && isLast && (
            <div className="flex items-center gap-1 py-2">
              <span className="text-sm text-muted">Thinking</span>
              <div className="flex gap-1 ml-1">
                <span className="thinking-dot w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="thinking-dot w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="thinking-dot w-1.5 h-1.5 rounded-full bg-accent" />
              </div>
            </div>
          )
        )}
        {!isStreaming && content && (
          <MessageActions
            content={content}
            onRetry={onRetry}
            showRetry={isLast}
          />
        )}
      </div>
    </div>
  );
});

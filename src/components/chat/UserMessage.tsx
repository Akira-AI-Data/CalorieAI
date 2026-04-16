'use client';

import { Message } from '@/types';
import { Avatar } from '@/components/ui/Avatar';

interface UserMessageProps {
  message: Message;
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex gap-3 message-appear">
      <Avatar role="user" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm mb-1 text-foreground">You</div>
        <div className="text-[15px] text-foreground whitespace-pre-wrap break-words">
          {message.content}
        </div>
        {message.files && message.files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-sidebar-bg rounded-lg text-sm text-muted"
              >
                <span className="truncate max-w-[200px]">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)}KB
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

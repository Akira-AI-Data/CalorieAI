'use client';

import { cn } from '@/lib/utils';
import { Sparkles, User } from 'lucide-react';

interface AvatarProps {
  role: 'user' | 'assistant';
  className?: string;
}

export function Avatar({ role, className }: AvatarProps) {
  if (role === 'assistant') {
    return (
      <div
        className={cn(
          'w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0',
          className
        )}
      >
        <Sparkles className="w-4 h-4 text-white" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-7 h-7 rounded-full bg-sidebar-active flex items-center justify-center flex-shrink-0',
        className
      )}
    >
      <User className="w-4 h-4 text-foreground" />
    </div>
  );
}

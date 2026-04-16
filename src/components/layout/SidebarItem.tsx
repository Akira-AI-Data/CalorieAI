'use client';

import { Trash2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Conversation } from '@/types';
import { useChatStore } from '@/stores/chatStore';

interface SidebarItemProps {
  conversation: Conversation;
  isActive: boolean;
}

export function SidebarItem({ conversation, isActive }: SidebarItemProps) {
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const deleteConversation = useChatStore((s) => s.deleteConversation);

  return (
    <div
      onClick={() => setActiveConversation(conversation.id)}
      className={cn(
        'group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors',
        isActive
          ? 'bg-sidebar-active text-foreground'
          : 'text-muted hover:bg-sidebar-hover hover:text-foreground'
      )}
    >
      <MessageSquare className="w-4 h-4 flex-shrink-0" />
      <span className="truncate flex-1">{conversation.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteConversation(conversation.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-sidebar-active transition-opacity"
        aria-label="Delete conversation"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

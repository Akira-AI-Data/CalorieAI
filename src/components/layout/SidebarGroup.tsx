'use client';

import { Conversation } from '@/types';
import { SidebarItem } from './SidebarItem';

interface SidebarGroupProps {
  label: string;
  conversations: Conversation[];
  activeId: string | null;
}

export function SidebarGroup({ label, conversations, activeId }: SidebarGroupProps) {
  return (
    <div className="mb-4">
      <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
      <div className="mt-1 space-y-0.5">
        {conversations.map((conv) => (
          <SidebarItem
            key={conv.id}
            conversation={conv}
            isActive={conv.id === activeId}
          />
        ))}
      </div>
    </div>
  );
}

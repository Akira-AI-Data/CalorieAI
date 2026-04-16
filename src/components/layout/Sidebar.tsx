'use client';

import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';
import { groupConversationsByDate, DateGroup } from '@/lib/dateGroups';
import { SidebarGroup } from './SidebarGroup';
import { useMemo } from 'react';

const GROUP_ORDER: DateGroup[] = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Older'];

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const selectedModel = useUIStore((s) => s.selectedModel);
  const conversations = useChatStore((s) => s.conversations);
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const createConversation = useChatStore((s) => s.createConversation);

  const groups = useMemo(() => groupConversationsByDate(conversations), [conversations]);

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'bg-sidebar-bg flex flex-col h-full transition-all duration-300 ease-in-out z-50',
          // Mobile: overlay
          'fixed md:relative',
          sidebarOpen
            ? 'w-64 translate-x-0'
            : 'w-0 -translate-x-full md:translate-x-0 overflow-hidden'
        )}
      >
        <div className="flex items-center justify-between p-3 flex-shrink-0">
          <button
            onClick={() => createConversation(selectedModel)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-sidebar-hover transition-colors flex-1"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-sidebar-hover transition-colors md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {GROUP_ORDER.map((groupName) => {
            const convs = groups.get(groupName);
            if (!convs || convs.length === 0) return null;
            return (
              <SidebarGroup
                key={groupName}
                label={groupName}
                conversations={convs}
                activeId={activeConversationId}
              />
            );
          })}

          {conversations.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-muted">
              No conversations yet
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

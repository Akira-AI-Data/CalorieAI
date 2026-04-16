'use client';

import { useSession } from 'next-auth/react';
import { useUIStore } from '@/stores/uiStore';
import { PanelLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function AppHeader({ title }: { title?: string }) {
  const { data: session } = useSession();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  const userInitial = session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || '?';

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-background flex-shrink-0">
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-sidebar-hover transition-colors"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="w-5 h-5 text-muted" />
          </button>
        )}
        {title && (
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-medium">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            userInitial
          )}
        </div>
      </div>
    </header>
  );
}

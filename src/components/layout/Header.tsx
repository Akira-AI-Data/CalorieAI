'use client';

import { useState, useRef, useEffect } from 'react';
import { PanelLeft, Plus, LogOut, ArrowUpRight } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';
import { IconButton } from '@/components/ui/IconButton';
import { ModelSelector } from '@/components/ui/ModelSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Header() {
  const { data: session } = useSession();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const selectedModel = useUIStore((s) => s.selectedModel);
  const setSelectedModel = useUIStore((s) => s.setSelectedModel);
  const createConversation = useChatStore((s) => s.createConversation);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isMax = selectedModel === 'claude-sonnet-4-20250514';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitial = session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || '?';

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-background h-12 flex-shrink-0">
      <div className="flex items-center gap-1">
        <IconButton onClick={toggleSidebar} aria-label="Toggle sidebar">
          <PanelLeft className="w-5 h-5" />
        </IconButton>
        <IconButton
          onClick={() => createConversation(selectedModel)}
          aria-label="New conversation"
        >
          <Plus className="w-5 h-5" />
        </IconButton>
      </div>

      <div className="flex items-center gap-2">
        <ModelSelector />
        {!isMax && (
          <button
            onClick={() => setSelectedModel('claude-sonnet-4-20250514')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-brand-teal/30 text-brand-teal hover:bg-brand-teal/10 transition-colors"
          >
            <ArrowUpRight className="w-3 h-3" />
            Upgrade
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium overflow-hidden ml-1 hover:ring-2 hover:ring-accent/30 transition-all"
          >
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-brand-teal text-white flex items-center justify-center">
                {userInitial}
              </div>
            )}
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-card-bg border border-border rounded-xl shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-border">
                <div className="text-sm font-medium text-foreground truncate">
                  {session?.user?.name || 'User'}
                </div>
                <div className="text-xs text-muted truncate">
                  {session?.user?.email}
                </div>
              </div>
              <div className="px-4 py-2 border-b border-border">
                <div className="text-xs text-muted mb-1">Current plan</div>
                <div className="text-sm font-medium text-foreground">
                  {isMax ? 'Max' : 'Pro'}
                </div>
                {!isMax && (
                  <button
                    onClick={() => {
                      setSelectedModel('claude-sonnet-4-20250514');
                      setUserMenuOpen(false);
                    }}
                    className="text-xs text-brand-teal hover:underline mt-1"
                  >
                    Upgrade to Max &rarr;
                  </button>
                )}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

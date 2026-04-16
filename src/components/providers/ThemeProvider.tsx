'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const initialize = useUIStore((s) => s.initialize);
  const initialized = useUIStore((s) => s.initialized);
  const loadFromAPI = useChatStore((s) => s.loadFromAPI);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Load conversations when authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      loadFromAPI();
    }
  }, [status, loadFromAPI]);

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  if (!initialized) {
    return null;
  }

  return <>{children}</>;
}

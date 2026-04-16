'use client';

import { Sun, Moon } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { IconButton } from './IconButton';

export function ThemeToggle() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  return (
    <IconButton
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </IconButton>
  );
}

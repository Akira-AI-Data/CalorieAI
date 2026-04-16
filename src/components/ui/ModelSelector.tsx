'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Zap, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';
import { Model, MODEL_LABELS } from '@/types';

const MODEL_OPTIONS: { model: Model; icon: React.ReactNode; description: string; badge?: string }[] = [
  {
    model: 'claude-haiku-4-5-20251001',
    icon: <Zap className="w-4 h-4" />,
    description: 'Fast and efficient for everyday tasks',
    badge: '$9.99/mo',
  },
  {
    model: 'claude-sonnet-4-20250514',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Advanced reasoning for complex tasks',
    badge: '$19.99/mo',
  },
];

export function ModelSelector() {
  const [open, setOpen] = useState(false);
  const selectedModel = useUIStore((s) => s.selectedModel);
  const setSelectedModel = useUIStore((s) => s.setSelectedModel);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground hover:bg-sidebar-hover transition-colors"
      >
        {MODEL_LABELS[selectedModel]}
        <ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-72 bg-card-bg border border-border rounded-xl shadow-lg py-1 z-50">
          {MODEL_OPTIONS.map(({ model, icon, description, badge }) => (
            <button
              key={model}
              onClick={() => {
                setSelectedModel(model);
                setOpen(false);
              }}
              className={cn(
                'w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-sidebar-hover transition-colors',
                selectedModel === model && 'bg-sidebar-hover'
              )}
            >
              <span className="mt-0.5 text-accent">{icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {MODEL_LABELS[model]}
                  </span>
                  <div className="flex items-center gap-2">
                    {badge && (
                      <span className="text-xs text-muted">{badge}</span>
                    )}
                    {selectedModel === model && (
                      <Check className="w-3.5 h-3.5 text-accent" />
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted">{description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

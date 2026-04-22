'use client';

import { Sparkles, Zap, ArrowUpRight } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { MODEL_LABELS } from '@/types';

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
}

const SUGGESTIONS = [
  'Explain quantum computing in simple terms',
  'Write a Python script to sort a list',
  'Help me debug my React code',
  'Summarize a long document for me',
];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  const selectedModel = useUIStore((s) => s.selectedModel);
  const setSelectedModel = useUIStore((s) => s.setSelectedModel);
  const isMax = selectedModel === 'claude-sonnet-4-20250514';

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="w-14 h-14 rounded-2xl bg-brand-teal flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-white" />
      </div>

      <h1 className="text-2xl font-semibold text-foreground mb-2">
        What can Posha do for you?
      </h1>

      {/* Current plan indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
          {isMax ? (
            <Sparkles className="w-3.5 h-3.5" />
          ) : (
            <Zap className="w-3.5 h-3.5" />
          )}
          {MODEL_LABELS[selectedModel]} Plan
        </div>
        {!isMax && (
          <button
            onClick={() => setSelectedModel('claude-sonnet-4-20250514')}
            className="flex items-center gap-1 px-3 py-1 rounded-full border border-brand-teal/30 text-brand-teal text-sm font-medium hover:bg-brand-teal/10 transition-colors"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Upgrade to Max
          </button>
        )}
      </div>

      <p className="text-muted text-sm mb-8 text-center max-w-md">
        {isMax
          ? 'Advanced reasoning and analysis for complex tasks.'
          : 'Fast and efficient for everyday tasks. Upgrade to Max for advanced reasoning.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="text-left px-4 py-3 rounded-xl border border-border hover:bg-sidebar-hover transition-colors text-sm text-foreground"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

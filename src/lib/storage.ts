import { Model } from '@/types';

const MODEL_KEY = 'chatbot-model';
const THEME_KEY = 'chatbot-theme';

export function saveModel(model: Model): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MODEL_KEY, model);
}

export function loadModel(): Model | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(MODEL_KEY) as Model | null;
}

export function saveTheme(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_KEY, theme);
}

export function loadTheme(): 'light' | 'dark' | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
}

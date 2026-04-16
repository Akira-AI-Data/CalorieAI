import { create } from 'zustand';
import { Artifact, Model } from '@/types';
import { saveModel, loadModel, saveTheme, loadTheme } from '@/lib/storage';

interface UIStore {
  sidebarOpen: boolean;
  artifactsPanelOpen: boolean;
  activeArtifact: Artifact | null;
  selectedModel: Model;
  theme: 'light' | 'dark';
  initialized: boolean;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleArtifactsPanel: () => void;
  setActiveArtifact: (artifact: Artifact | null) => void;
  setSelectedModel: (model: Model) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  initialize: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  artifactsPanelOpen: false,
  activeArtifact: null,
  selectedModel: 'claude-sonnet-4-20250514',
  theme: 'light',
  initialized: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

  toggleArtifactsPanel: () =>
    set((state) => ({ artifactsPanelOpen: !state.artifactsPanelOpen })),

  setActiveArtifact: (artifact: Artifact | null) =>
    set({ activeArtifact: artifact, artifactsPanelOpen: artifact !== null }),

  setSelectedModel: (model: Model) => {
    saveModel(model);
    set({ selectedModel: model });
  },

  setTheme: (theme: 'light' | 'dark') => {
    saveTheme(theme);
    set({ theme });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  },

  initialize: () => {
    const savedModel = loadModel();
    const savedTheme = loadTheme();
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    set({
      selectedModel: savedModel || 'claude-sonnet-4-20250514',
      theme,
      sidebarOpen: isDesktop,
      initialized: true,
    });
  },
}));

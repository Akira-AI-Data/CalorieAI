import { beforeEach, describe, expect, it } from 'vitest';
import { loadModel, loadTheme, saveModel, saveTheme } from './storage';

describe('storage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists the selected model and theme', () => {
    saveModel('claude-haiku-4-5-20251001');
    saveTheme('dark');

    expect(loadModel()).toBe('claude-haiku-4-5-20251001');
    expect(loadTheme()).toBe('dark');
  });

  it('returns null when nothing has been saved yet', () => {
    expect(loadModel()).toBeNull();
    expect(loadTheme()).toBeNull();
  });
});

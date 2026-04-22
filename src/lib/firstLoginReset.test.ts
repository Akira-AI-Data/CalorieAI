import { beforeEach, describe, expect, it } from 'vitest';
import { resetIfFirstLogin } from './firstLoginReset';

const FLAG_KEY = 'posha_first_login_done';
const APP_DATA_KEYS = [
  'posha_mealplan',
  'posha_saved_recipes',
  'posha_pantry',
  'posha_shopping',
  'posha_shopping_reminder_last',
  'posha_settings',
];

describe('resetIfFirstLogin', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('clears app-specific local storage and records the user flag on first login', () => {
    for (const key of APP_DATA_KEYS) {
      localStorage.setItem(key, 'stale');
    }
    localStorage.setItem('unrelated', 'keep-me');

    resetIfFirstLogin('user-1');

    for (const key of APP_DATA_KEYS) {
      expect(localStorage.getItem(key)).toBeNull();
    }

    expect(localStorage.getItem('unrelated')).toBe('keep-me');

    const storedFlags = JSON.parse(localStorage.getItem(FLAG_KEY) || '{}');
    expect(storedFlags['user-1']).toEqual(expect.any(String));
  });

  it('does not wipe data again once the user has already been initialized on the device', () => {
    resetIfFirstLogin('user-1');
    localStorage.setItem('posha_mealplan', 'fresh-data');

    resetIfFirstLogin('user-1');

    expect(localStorage.getItem('posha_mealplan')).toBe('fresh-data');
  });

  it('does nothing when no user id is provided', () => {
    localStorage.setItem('posha_mealplan', 'keep-me');

    resetIfFirstLogin(undefined);

    expect(localStorage.getItem('posha_mealplan')).toBe('keep-me');
    expect(localStorage.getItem(FLAG_KEY)).toBeNull();
  });
});

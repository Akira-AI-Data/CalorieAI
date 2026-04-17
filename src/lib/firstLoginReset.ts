// Client-side reset for first-ever login of a given user.
// Called from the (app) layout on mount — wipes app localStorage so a new
// account starts with a clean slate on this device.

const FLAG_KEY = 'calorieai_first_login_done'

const APP_DATA_KEYS = [
  'calorieai_mealplan',
  'calorieai_saved_recipes',
  'calorieai_pantry',
  'calorieai_shopping',
  'calorieai_shopping_reminder_last',
  'calorieai_settings',
]

export function resetIfFirstLogin(userId: string | undefined | null) {
  if (!userId || typeof window === 'undefined') return
  try {
    const flag = JSON.parse(localStorage.getItem(FLAG_KEY) || '{}')
    if (flag[userId]) return // already initialised for this user on this device
    APP_DATA_KEYS.forEach((k) => localStorage.removeItem(k))
    flag[userId] = new Date().toISOString()
    localStorage.setItem(FLAG_KEY, JSON.stringify(flag))
  } catch {
    /* ignore */
  }
}

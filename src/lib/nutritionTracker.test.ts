import { beforeEach, describe, expect, it } from 'vitest';
import {
  buildDailyNutritionSummary,
  buildNutritionInsights,
  buildWeeklyCalories,
  createMealId,
  getLocalDateKey,
  saveLoggedMeals,
  syncMealToMealPlan,
  loadMealPlan,
  type LoggedMeal,
} from './nutritionTracker';

describe('nutritionTracker', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('builds live calorie and macro totals from logged meals', () => {
    const today = getLocalDateKey();
    const meals: LoggedMeal[] = [
      {
        id: createMealId(),
        mealType: 'lunch',
        source: 'manual',
        name: 'Italian Margherita Pizza',
        serving: '1 serving',
        calories: 420,
        protein: 24,
        carbs: 34,
        fat: 16,
        ingredients: ['Pizza dough', 'Mozzarella', 'Tomato', 'Basil'],
        createdAt: `${today}T12:00:00.000Z`,
      },
    ];

    saveLoggedMeals(meals);

    const summary = buildDailyNutritionSummary(today);
    expect(summary.consumed).toBe(420);
    expect(summary.macros.find((macro) => macro.label === 'Protein')?.current).toBe(24);
    expect(summary.macros.find((macro) => macro.label === 'Carbs')?.current).toBe(34);
  });

  it('syncs a meal into the meal plan slot', () => {
    const meal: LoggedMeal = {
      id: createMealId(),
      mealType: 'dinner',
      source: 'manual',
      name: 'Greek Yogurt Parfait',
      serving: '1 serving',
      calories: 300,
      protein: 20,
      carbs: 25,
      fat: 10,
      ingredients: ['Greek yogurt', 'Honey', 'Walnuts'],
      createdAt: `${getLocalDateKey()}T08:00:00.000Z`,
    };

    syncMealToMealPlan(meal, '2026-04-21', 'dinner');

    expect(loadMealPlan()['2026-04-21']?.dinner?.name).toBe('Greek Yogurt Parfait');
  });

  it('builds weekly calories and nutrition insights from logged data', () => {
    saveLoggedMeals([
      {
        id: createMealId(),
        mealType: 'lunch',
        source: 'manual',
        name: 'Italian Margherita Pizza',
        serving: '1 serving',
        calories: 420,
        protein: 24,
        carbs: 34,
        fat: 16,
        ingredients: ['Pizza dough', 'Mozzarella', 'Tomato', 'Basil'],
        createdAt: '2026-04-20T12:00:00.000Z',
      },
      {
        id: createMealId(),
        mealType: 'breakfast',
        source: 'manual',
        name: 'Classic Oatmeal with Berries',
        serving: '1 bowl',
        calories: 280,
        protein: 10,
        carbs: 42,
        fat: 7,
        ingredients: ['Oats', 'Berries', 'Honey'],
        createdAt: '2026-04-21T07:00:00.000Z',
      },
    ]);

    const week = buildWeeklyCalories(new Date('2026-04-21T12:00:00.000Z'));
    const insights = buildNutritionInsights();

    expect(week[0].cal).toBe(420);
    expect(week[1].cal).toBe(280);
    expect(insights.nutritionScore).toBeGreaterThan(0);
    expect(insights.foodGroups.some((group) => group.label === 'Grains' && group.pct > 0)).toBe(true);
  });
});

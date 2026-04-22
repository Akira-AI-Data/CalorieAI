import { describe, expect, it } from 'vitest';
import type { Recipe } from '@/data/recipes';
import {
  collectDietaryRestrictions,
  planNutritionSmartWeek,
  recipeMatchesDietaryRestrictions,
} from './mealPlanner';

function recipe(overrides: Partial<Recipe> & Pick<Recipe, 'name' | 'category'>): Recipe {
  return {
    name: overrides.name,
    emoji: overrides.emoji ?? '🍽️',
    description: overrides.description ?? '',
    category: overrides.category,
    cuisine: overrides.cuisine ?? 'Universal',
    prepTime: overrides.prepTime ?? '15 min',
    ageRange: overrides.ageRange ?? 'All ages',
    nutrients: overrides.nutrients ?? ['Protein', 'Fiber'],
    ingredients: overrides.ingredients ?? ['1 tomato', '1 cucumber'],
    instructions: overrides.instructions ?? ['Cook and serve'],
  };
}

describe('meal planner restrictions', () => {
  it('collects allergies, aliases, and excluded ingredients from family profiles', () => {
    const restrictions = collectDietaryRestrictions({
      familyProfiles: [
        {
          allergies: ['Dairy', 'Gluten Free'],
          excludedIngredients: ['mushrooms', 'Vegetarian'],
        },
      ],
    });

    expect(restrictions.allergyLabels).toEqual(
      expect.arrayContaining(['dairy', 'gluten', 'vegetarian'])
    );
    expect(restrictions.excludedTerms).toContain('mushrooms');
    expect(restrictions.summaryLabels).toEqual(
      expect.arrayContaining(['Dairy', 'Gluten Free', 'mushrooms', 'Vegetarian'])
    );
  });

  it('filters out recipes that violate active dietary restrictions', () => {
    const restrictions = collectDietaryRestrictions({
      familyProfiles: [
        {
          allergies: ['Dairy', 'Vegetarian'],
          excludedIngredients: ['mushrooms'],
        },
      ],
    });

    expect(
      recipeMatchesDietaryRestrictions(
        recipe({
          name: 'Safe Bowl',
          category: 'lunch',
          ingredients: ['1 cup quinoa', '1 avocado', '1 tomato'],
        }),
        restrictions
      )
    ).toBe(true);

    expect(
      recipeMatchesDietaryRestrictions(
        recipe({
          name: 'Cheesy Pasta',
          category: 'dinner',
          ingredients: ['1 cup pasta', '1/2 cup parmesan'],
        }),
        restrictions
      )
    ).toBe(false);

    expect(
      recipeMatchesDietaryRestrictions(
        recipe({
          name: 'Chicken Stir Fry',
          category: 'dinner',
          ingredients: ['1 chicken breast', '1 cup broccoli'],
        }),
        restrictions
      )
    ).toBe(false);

    expect(
      recipeMatchesDietaryRestrictions(
        recipe({
          name: 'Mushroom Toast',
          category: 'breakfast',
          ingredients: ['2 mushrooms', '2 slices bread'],
        }),
        restrictions
      )
    ).toBe(false);
  });
});

describe('planNutritionSmartWeek', () => {
  it('builds a full week plan using only allowed recipes for each meal type', () => {
    const recipes: Recipe[] = [
      recipe({
        name: 'Protein Oats',
        category: 'breakfast',
        nutrients: ['Protein', 'Fiber', 'Calcium'],
        ingredients: ['1 cup oats', '1 banana'],
      }),
      recipe({
        name: 'Berry Yogurt Bowl',
        category: 'breakfast',
        nutrients: ['Calcium', 'Protein'],
        ingredients: ['1 cup yogurt', '1 cup berries'],
      }),
      recipe({
        name: 'Tofu Scramble',
        category: 'breakfast',
        nutrients: ['Protein', 'Iron'],
        ingredients: ['200g tofu', '1 cup spinach'],
      }),
      recipe({
        name: 'Quinoa Salad',
        category: 'lunch',
        nutrients: ['Protein', 'Fiber', 'Vitamin C'],
        ingredients: ['1 cup quinoa', '1 cucumber'],
      }),
      recipe({
        name: 'Veggie Wrap',
        category: 'lunch',
        nutrients: ['Fiber', 'Vitamin C'],
        ingredients: ['1 tortilla', '1 avocado'],
      }),
      recipe({
        name: 'Lentil Soup',
        category: 'lunch',
        nutrients: ['Protein', 'Iron', 'Fiber'],
        ingredients: ['1 cup lentils', '1 carrot'],
      }),
      recipe({
        name: 'Salmon Bowl',
        category: 'dinner',
        nutrients: ['Protein', 'Healthy Fats', 'Vitamin A'],
        ingredients: ['1 salmon fillet', '1 sweet potato'],
      }),
      recipe({
        name: 'Tofu Curry',
        category: 'dinner',
        nutrients: ['Protein', 'Healthy Fats', 'Vitamin C'],
        ingredients: ['200g tofu', '1 can coconut milk'],
      }),
      recipe({
        name: 'Bean Chili',
        category: 'dinner',
        nutrients: ['Protein', 'Fiber', 'Iron'],
        ingredients: ['1 cup black beans', '1 tomato'],
      }),
      recipe({
        name: 'Trail Mix',
        category: 'snack',
        nutrients: ['Healthy Fats', 'Protein'],
        ingredients: ['1/4 cup almonds', '1/4 cup raisins'],
      }),
      recipe({
        name: 'Apple Slices',
        category: 'snack',
        nutrients: ['Fiber', 'Vitamin C'],
        ingredients: ['1 apple', '1 tbsp peanut butter'],
      }),
      recipe({
        name: 'Hummus Cup',
        category: 'snack',
        nutrients: ['Protein', 'Fiber'],
        ingredients: ['1/2 cup hummus', '1 carrot'],
      }),
    ];

    const result = planNutritionSmartWeek(
      recipes,
      [
        '2026-04-20',
        '2026-04-21',
        '2026-04-22',
        '2026-04-23',
        '2026-04-24',
        '2026-04-25',
        '2026-04-26',
      ],
      {
        dailyGoals: { protein: '150', calories: '1900' },
        familyProfiles: [{ allergies: ['Dairy', 'Peanuts'] }],
      }
    );

    expect(result.unmetMealTypes).toEqual([]);
    expect(Object.keys(result.plan)).toHaveLength(7);

    for (const dayPlan of Object.values(result.plan)) {
      expect(dayPlan.breakfast).toBeDefined();
      expect(dayPlan.lunch).toBeDefined();
      expect(dayPlan.dinner).toBeDefined();
      expect(dayPlan.snack).toBeDefined();
    }

    const chosenMealNames = result.selectedRecipes.map((selected) => selected.name);
    expect(chosenMealNames).not.toContain('Berry Yogurt Bowl');
    expect(chosenMealNames).not.toContain('Apple Slices');
  });
});

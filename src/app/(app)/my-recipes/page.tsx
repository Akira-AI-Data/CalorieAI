'use client'

import { useState, useEffect } from 'react'
import { Bookmark, Trash2, ChevronDown, ChevronUp, Search, Globe, Clock, CalendarDays, Plus, X } from 'lucide-react'
import { FluentEmoji } from '@/components/ui/FluentEmoji'

interface Recipe {
  name: string
  emoji?: string
  description?: string
  category?: string
  cuisine?: string
  prepTime?: string
  ageRange?: string
  nutrients?: string[]
  ingredients?: string[]
  instructions?: string[]
  savedAt?: string
}

const SAVED_RECIPES_KEY = 'calorieai_saved_recipes'
const MEALPLAN_KEY = 'calorieai_mealplan'

function loadSavedRecipes(): Recipe[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_RECIPES_KEY) || '[]')
  } catch {
    return []
  }
}

function persistSavedRecipes(recipes: Recipe[]) {
  localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(recipes))
}

export default function MyRecipesPage() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [addingToPlan, setAddingToPlan] = useState<Recipe | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    category: 'breakfast',
    cuisine: '',
    prepTime: '',
    emoji: '',
    description: '',
    ingredients: '',
    instructions: '',
  })

  // Load recipes on mount
  useEffect(() => {
    setSavedRecipes(loadSavedRecipes())
  }, [])

  function removeRecipe(recipeName: string) {
    const updated = savedRecipes.filter((r) => r.name !== recipeName)
    setSavedRecipes(updated)
    persistSavedRecipes(updated)
    if (expandedRecipe === recipeName) setExpandedRecipe(null)
  }

  function handleCreateRecipe() {
    if (!newRecipe.name.trim()) return
    const recipe: Recipe = {
      name: newRecipe.name.trim(),
      category: newRecipe.category,
      cuisine: newRecipe.cuisine.trim() || undefined,
      prepTime: newRecipe.prepTime.trim() || undefined,
      emoji: newRecipe.emoji.trim() || undefined,
      description: newRecipe.description.trim() || undefined,
      ingredients: newRecipe.ingredients.trim()
        ? newRecipe.ingredients.trim().split('\n').filter(Boolean)
        : undefined,
      instructions: newRecipe.instructions.trim()
        ? newRecipe.instructions.trim().split('\n').filter(Boolean)
        : undefined,
      savedAt: new Date().toISOString(),
    }
    const updated = [recipe, ...savedRecipes]
    setSavedRecipes(updated)
    persistSavedRecipes(updated)
    setShowCreateModal(false)
    setNewRecipe({
      name: '',
      category: 'breakfast',
      cuisine: '',
      prepTime: '',
      emoji: '',
      description: '',
      ingredients: '',
      instructions: '',
    })
  }

  function addToMealPlan(recipe: Recipe, date: string, mealType: string) {
    try {
      const plan = JSON.parse(localStorage.getItem(MEALPLAN_KEY) || '{}')
      if (!plan[date]) plan[date] = {}
      plan[date][mealType] = {
        name: recipe.name,
        emoji: recipe.emoji,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
      }
      localStorage.setItem(MEALPLAN_KEY, JSON.stringify(plan))
      setAddingToPlan(null)
    } catch { /* ignore */ }
  }

  // Filter recipes
  const filtered = savedRecipes.filter((r) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchesName = r.name?.toLowerCase().includes(q)
      const matchesCuisine = r.cuisine?.toLowerCase().includes(q)
      const matchesIngredient = r.ingredients?.some((ing) => ing.toLowerCase().includes(q))
      if (!matchesName && !matchesCuisine && !matchesIngredient) return false
    }
    if (filterCategory && r.category !== filterCategory) return false
    return true
  })

  const categories = [...new Set(savedRecipes.map((r) => r.category).filter(Boolean))]

  // Quick meal plan modal
  function MealPlanQuickAdd({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
    const today = new Date()
    const dates: string[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() + i)
      dates.push(d.toISOString().split('T')[0])
    }
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-card-bg rounded-3xl max-w-sm w-full shadow-2xl p-5" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-lg font-bold text-foreground mb-1">Add to Meal Plan</h2>
          <p className="text-xs text-muted-foreground mb-4">Select a day and meal type for "{recipe.name}"</p>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {dates.map((date) => {
              const d = new Date(date + 'T00:00:00')
              const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
              return (
                <div key={date}>
                  <p className="text-xs font-medium text-foreground mb-1">{label}</p>
                  <div className="flex gap-1.5 mb-2">
                    {mealTypes.map((mt) => (
                      <button
                        key={mt}
                        onClick={() => addToMealPlan(recipe, date, mt)}
                        className="px-2.5 py-1.5 text-xs capitalize rounded-lg border border-border text-foreground hover:bg-primary hover:text-white hover:border-primary transition-colors"
                      >
                        {mt}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-primary" />
            My Recipes
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {savedRecipes.length} saved recipe{savedRecipes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white font-medium text-sm rounded-xl hover:bg-primary/80 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Recipe
        </button>
      </div>

      {/* Search & Filter */}
      {savedRecipes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="flex items-center gap-2 px-3 py-2 bg-card-bg border border-border rounded-xl flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-muted-foreground-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, cuisine, or ingredient..."
              className="bg-transparent outline-none text-sm text-foreground w-full placeholder-muted-foreground"
            />
          </div>
          {categories.length > 1 && (
            <div className="flex gap-1.5">
              <button
                onClick={() => setFilterCategory('')}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  !filterCategory
                    ? 'bg-foreground text-white'
                    : 'bg-card-bg text-foreground border border-border hover:bg-background'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(filterCategory === cat ? '' : cat!)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                    filterCategory === cat
                      ? 'bg-foreground text-white'
                      : 'bg-card-bg text-foreground border border-border hover:bg-background'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recipe List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((recipe) => {
            const isExpanded = expandedRecipe === recipe.name
            return (
              <div
                key={recipe.name}
                className="bg-card-bg border border-border rounded-2xl overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-background transition-colors"
                  onClick={() => setExpandedRecipe(isExpanded ? null : recipe.name)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FluentEmoji emoji={recipe.emoji || '\ud83c\udf7d\ufe0f'} size={28} className="flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm truncate">{recipe.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground-foreground">
                          <Globe className="w-3 h-3" /> {recipe.cuisine}
                        </span>
                        {recipe.ageRange && (
                          <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">{recipe.ageRange}</span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-muted-foreground-foreground">
                          <Clock className="w-3 h-3" /> {recipe.prepTime}
                        </span>
                        <span className="text-xs text-muted-foreground-foreground capitalize">{recipe.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeRecipe(recipe.name)
                      }}
                      className="p-1.5 text-muted-foreground-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from My Recipes"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground-foreground" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mt-3 mb-4">{recipe.description}</p>

                      {recipe.nutrients && recipe.nutrients.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {recipe.nutrients.map((n) => (
                            <span key={n} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{n}</span>
                          ))}
                        </div>
                      )}

                      <h4 className="text-sm font-semibold text-foreground mb-2">Ingredients</h4>
                      <ul className="space-y-1.5 mb-4">
                        {recipe.ingredients?.map((ing, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            {ing}
                          </li>
                        ))}
                      </ul>

                      <h4 className="text-sm font-semibold text-foreground mb-2">Instructions</h4>
                      <ol className="space-y-2 mb-4">
                        {recipe.instructions?.map((step, i) => (
                          <li key={i} className="flex gap-2 text-sm text-foreground">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>

                      <button
                        onClick={() => setAddingToPlan(recipe)}
                        className="w-full py-2.5 bg-foreground text-white font-medium text-sm rounded-xl hover:bg-foreground/80 transition-all flex items-center justify-center gap-2"
                      >
                        <CalendarDays className="w-4 h-4" /> Add to Meal Plan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : savedRecipes.length > 0 ? (
        <div className="text-center py-16 text-muted-foreground-foreground">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No recipes match your search</p>
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground-foreground">
          <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No saved recipes yet</p>
          <p className="text-xs mt-1">Save recipes from the Cookbook to see them here</p>
        </div>
      )}

      {/* Quick Add to Meal Plan Modal */}
      {addingToPlan && (
        <MealPlanQuickAdd recipe={addingToPlan} onClose={() => setAddingToPlan(null)} />
      )}

      {/* Create Recipe Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-card-bg rounded-3xl max-w-md w-full shadow-2xl p-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Create Recipe</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 hover:bg-background rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground-foreground" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Name *</label>
                <input
                  type="text"
                  value={newRecipe.name}
                  onChange={(e) => setNewRecipe((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Recipe name"
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
                  <select
                    value={newRecipe.category}
                    onChange={(e) => setNewRecipe((p) => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm bg-card-bg"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Cuisine</label>
                  <input
                    type="text"
                    value={newRecipe.cuisine}
                    onChange={(e) => setNewRecipe((p) => ({ ...p, cuisine: e.target.value }))}
                    placeholder="e.g., Italian"
                    className="w-full px-3 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={newRecipe.prepTime}
                    onChange={(e) => setNewRecipe((p) => ({ ...p, prepTime: e.target.value }))}
                    placeholder="e.g., 30 min"
                    className="w-full px-3 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Emoji</label>
                  <input
                    type="text"
                    value={newRecipe.emoji}
                    onChange={(e) => setNewRecipe((p) => ({ ...p, emoji: e.target.value }))}
                    placeholder="e.g., \ud83c\udf5d"
                    className="w-full px-3 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
                <input
                  type="text"
                  value={newRecipe.description}
                  onChange={(e) => setNewRecipe((p) => ({ ...p, description: e.target.value }))}
                  placeholder="A short description"
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Ingredients (one per line)</label>
                <textarea
                  value={newRecipe.ingredients}
                  onChange={(e) => setNewRecipe((p) => ({ ...p, ingredients: e.target.value }))}
                  placeholder={"1 cup flour\n2 eggs\n1/2 cup milk"}
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Instructions (one per line)</label>
                <textarea
                  value={newRecipe.instructions}
                  onChange={(e) => setNewRecipe((p) => ({ ...p, instructions: e.target.value }))}
                  placeholder={"Preheat oven to 350F\nMix dry ingredients\nBake for 25 minutes"}
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm resize-none"
                />
              </div>
              <button
                onClick={handleCreateRecipe}
                disabled={!newRecipe.name.trim()}
                className="w-full py-3 bg-primary text-white font-medium text-sm rounded-xl hover:bg-primary/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Save Recipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client';

import { useMemo, useRef, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Pencil,
  Flame,
  Loader2,
  MessageSquare,
  Plus,
  ScanBarcode,
  Search,
  Sparkles,
  UtensilsCrossed,
  Wheat,
  Beef,
  Droplets,
  X,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RECIPES } from '@/data/recipes';
import {
  createMealId,
  deleteLoggedMeal,
  getLocalDateKey,
  loadLoggedMeals,
  syncMealToMealPlan,
  type LoggedMeal,
  type MealType,
  saveLoggedMeals,
  updateLoggedMeal,
} from '@/lib/nutritionTracker';

interface FoodItem {
  name: string;
  portion: string;
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  ingredients?: string[];
  barcode?: string;
}

interface ParsedMeal {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  notes?: string;
}

const popularFoods: FoodItem[] = [
  { name: 'Chicken Breast', portion: '100g', cal: 156, protein: 31, carbs: 0, fat: 3.6, tags: ['High Protein'], ingredients: ['Chicken breast'], barcode: '9300605123451' },
  { name: 'Brown Rice', portion: '1 cup', cal: 216, protein: 5, carbs: 45, fat: 1.8, tags: ['Complex Carbs'], ingredients: ['Brown rice', 'Water'], barcode: '9300605987654' },
  { name: 'Scrambled Eggs', portion: '2 eggs', cal: 182, protein: 12, carbs: 2, fat: 14, tags: ['Breakfast'], ingredients: ['Eggs', 'Butter', 'Salt', 'Pepper'], barcode: '9312345678901' },
  { name: 'Greek Yogurt', portion: '200g', cal: 130, protein: 12, carbs: 7, fat: 6, tags: ['Probiotic'], ingredients: ['Milk', 'Live cultures'], barcode: '9345678901234' },
  { name: 'Banana', portion: '1 medium', cal: 117, protein: 1.3, carbs: 27, fat: 0.4, tags: ['Fruit'], ingredients: ['Banana'], barcode: '9400000000001' },
  { name: 'Avocado', portion: 'Half', cal: 161, protein: 2, carbs: 9, fat: 15, tags: ['Healthy Fats'], ingredients: ['Avocado'], barcode: '9400000000002' },
  { name: 'Oatmeal', portion: '1 cup', cal: 150, protein: 5, carbs: 27, fat: 2.5, tags: ['Breakfast'], ingredients: ['Rolled oats', 'Water', 'Berries'], barcode: '9311111111111' },
  { name: 'Salmon Fillet', portion: '100g', cal: 208, protein: 20, carbs: 0, fat: 13, tags: ['Omega-3'], ingredients: ['Salmon fillet', 'Lemon', 'Olive oil'], barcode: '9333333333333' },
];

const tagColors: Record<string, string> = {
  'High Protein': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Complex Carbs': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Breakfast: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Probiotic: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Fruit: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Healthy Fats': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Omega-3': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
};

function estimateRecipeFoodItem(name: string): FoodItem {
  const recipe = RECIPES.find((item) => item.name === name);
  const ingredients = recipe?.ingredients ?? [name];
  const hasProtein = recipe?.nutrients.includes('Protein');
  const hasFiber = recipe?.nutrients.includes('Fiber');
  const hasHealthyFats = recipe?.nutrients.includes('Healthy Fats');

  return {
    name,
    portion: '1 serving',
    cal: hasProtein ? 420 : 320,
    protein: hasProtein ? 24 : 10,
    carbs: hasFiber ? 34 : 28,
    fat: hasHealthyFats ? 16 : 11,
    tags: [recipe?.category ? mealTypeLabel(recipe.category) : 'Recipe', recipe?.cuisine || 'Recipe'],
    ingredients,
  };
}

function mealTypeLabel(mealType: MealType) {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
}

function normalizeIngredient(value: string) {
  return value
    .replace(/^\s*[-*]\s*/, '')
    .replace(/^\s*\d+[.)]?\s*/, '')
    .trim();
}

function parseNutritionText(text: string, label: string) {
  const pattern = new RegExp(`${label}\\s*[:=-]?\\s*(\\d+(?:\\.\\d+)?)`, 'i');
  const match = text.match(pattern);
  return match ? Number(match[1]) : 0;
}

function parseIngredientsFromText(text: string) {
  const ingredientsMatch = text.match(/ingredients?\s*[:=-]?\s*([\s\S]+)/i);
  if (!ingredientsMatch) return [];

  const source = ingredientsMatch[1]
    .split(/\n|,|;/)
    .map(normalizeIngredient)
    .filter(Boolean);

  return [...new Set(source)].slice(0, 12);
}

function parseDescribeFallback(input: string): ParsedMeal {
  const cleaned = input.trim();
  const pieces = cleaned
    .split(/,| with | and /i)
    .map((part) => normalizeIngredient(part))
    .filter(Boolean);

  const name = pieces[0] || cleaned || 'Custom meal';
  const ingredients = pieces.length > 1 ? pieces : [name];
  const calories = Math.max(ingredients.length * 110, 180);
  const protein = Math.max(Math.round(calories * 0.09 / 4), 8);
  const carbs = Math.max(Math.round(calories * 0.45 / 4), 12);
  const fat = Math.max(Math.round(calories * 0.25 / 9), 4);

  return {
    name,
    serving: '1 serving',
    calories,
    protein,
    carbs,
    fat,
    ingredients,
    notes: 'Estimated from your description.',
  };
}

function parsePhotoFallback(file: File): ParsedMeal {
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const normalized = baseName.replace(/[-_]+/g, ' ').trim();
  const title =
    normalized
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Captured meal';

  const ingredients = normalized
    .split(/[\s,_-]+/)
    .map(normalizeIngredient)
    .filter((part) => part.length > 2)
    .slice(0, 6);

  return {
    name: title,
    serving: '1 serving',
    calories: 350,
    protein: 20,
    carbs: 30,
    fat: 14,
    ingredients: ingredients.length > 0 ? ingredients : ['Review ingredients manually'],
    notes: 'AI image analysis is unavailable on this deployment, so this was created for manual review.',
  };
}

function parseAiMealResponse(text: string): ParsedMeal | null {
  const fencedMatch = text.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fencedMatch?.[1] ?? text;
  const objectMatch = candidate.match(/\{[\s\S]*\}/);

  if (objectMatch) {
    try {
      const parsed = JSON.parse(objectMatch[0]) as ParsedMeal;
      if (parsed.name && Array.isArray(parsed.ingredients)) {
        return {
          name: parsed.name,
          serving: parsed.serving || '1 serving',
          calories: Number(parsed.calories) || 0,
          protein: Number(parsed.protein) || 0,
          carbs: Number(parsed.carbs) || 0,
          fat: Number(parsed.fat) || 0,
          ingredients: parsed.ingredients.map(normalizeIngredient).filter(Boolean),
          notes: parsed.notes,
        };
      }
    } catch {
      // Fall through to text parsing.
    }
  }

  const ingredients = parseIngredientsFromText(candidate);
  const lines = candidate
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const nameLine =
    lines.find((line) => /^meal|^dish|^name/i.test(line)) ||
    lines.find((line) => !/calories|protein|carbs|fat|ingredients/i.test(line));

  if (!nameLine) return null;

  return {
    name: nameLine.replace(/^meal|^dish|^name\s*[:=-]?/i, '').trim() || 'Captured meal',
    serving: '1 serving',
    calories: parseNutritionText(candidate, 'calories'),
    protein: parseNutritionText(candidate, 'protein'),
    carbs: parseNutritionText(candidate, 'carbs'),
    fat: parseNutritionText(candidate, 'fat'),
    ingredients,
    notes: 'Parsed from AI capture.',
  };
}

async function readFileAsBase64(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Failed to read image.'));
        return;
      }
      resolve(result.split(',')[1] || '');
    };
    reader.onerror = () => reject(new Error('Failed to read image.'));
    reader.readAsDataURL(file);
  });
}

async function analyzeWithAi({
  prompt,
  imageFile,
}: {
  prompt: string;
  imageFile?: File;
}): Promise<ParsedMeal | null> {
  const files = imageFile
    ? [
        {
          name: imageFile.name,
          type: imageFile.type,
          content: await readFileAsBase64(imageFile),
        },
      ]
    : [];

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      messages: [
        {
          role: 'user',
          content: prompt,
          files,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Could not read AI response.');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';

    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6);
      if (payload === '[DONE]') continue;
      const parsed = JSON.parse(payload) as { text?: string; error?: string };
      if (parsed.error) throw new Error(parsed.error);
      if (parsed.text) text += parsed.text;
    }
  }

  return parseAiMealResponse(text);
}

function CaptureModal({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-card rounded-3xl border border-border shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 p-5 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function LogFoodPage() {
  const [search, setSearch] = useState('');
  const [activeMealType, setActiveMealType] = useState<MealType>('lunch');
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', serving: '', ingredients: '' });
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>(() => loadLoggedMeals());
  const [editingMeal, setEditingMeal] = useState<LoggedMeal | null>(null);
  const [editDraft, setEditDraft] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', serving: '', ingredients: '' });
  const [captureMode, setCaptureMode] = useState<'photo' | 'barcode' | 'describe' | null>(null);
  const [captureText, setCaptureText] = useState('');
  const [barcode, setBarcode] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [captureResult, setCaptureResult] = useState<ParsedMeal | null>(null);
  const [captureError, setCaptureError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return popularFoods;

    const popularMatches = popularFoods.filter((food) => {
      const haystack = [food.name, food.portion, ...food.tags, ...(food.ingredients ?? [])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });

    const seenNames = new Set(popularMatches.map((food) => food.name.toLowerCase()));
    const recipeMatches = RECIPES.filter((recipe) => {
      const haystack = [recipe.name, recipe.cuisine, ...recipe.ingredients].join(' ').toLowerCase();
      return haystack.includes(query);
    })
      .filter((recipe) => !seenNames.has(recipe.name.toLowerCase()))
      .slice(0, 10)
      .map((recipe) => estimateRecipeFoodItem(recipe.name));

    return [...popularMatches, ...recipeMatches];
  }, [search]);

  const currentMealEntries = useMemo(
    () =>
      loggedMeals
        .filter((meal) => meal.mealType === activeMealType)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [activeMealType, loggedMeals]
  );

  function persistMeals(nextMeals: LoggedMeal[]) {
    setLoggedMeals(nextMeals);
    saveLoggedMeals(nextMeals);
  }

  function addMeal(meal: ParsedMeal, source: LoggedMeal['source'], options?: { syncToMealPlan?: boolean }) {
    const dateKey = getLocalDateKey();
    const shouldSync = !!options?.syncToMealPlan;
    const entry: LoggedMeal = {
      id: createMealId(),
      mealType: activeMealType,
      source,
      name: meal.name,
      serving: meal.serving,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      ingredients: meal.ingredients,
      notes: meal.notes,
      createdAt: new Date().toISOString(),
      linkedDate: shouldSync ? dateKey : undefined,
      linkedMealType: shouldSync ? activeMealType : undefined,
    };

    persistMeals([entry, ...loggedMeals]);
    if (shouldSync) {
      syncMealToMealPlan(entry, dateKey, activeMealType);
    }
  }

  function resetCaptureState(mode: 'photo' | 'barcode' | 'describe' | null) {
    setCaptureMode(mode);
    setCaptureText('');
    setBarcode('');
    setSelectedImage(null);
    setCaptureResult(null);
    setCaptureError('');
    setIsSubmitting(false);
  }

  function handleQuickAdd(food: FoodItem) {
    addMeal(
      {
        name: food.name,
        serving: food.portion,
        calories: food.cal,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        ingredients: food.ingredients ?? [food.name],
        notes: 'Added from food library.',
      },
      'quick-add'
    );
  }

  function handleManualLog() {
    if (!manual.name.trim()) return;

    addMeal(
      {
        name: manual.name.trim(),
        serving: manual.serving.trim() || '1 serving',
        calories: Number(manual.calories) || 0,
        protein: Number(manual.protein) || 0,
        carbs: Number(manual.carbs) || 0,
        fat: Number(manual.fat) || 0,
        ingredients: manual.ingredients
          .split(/\n|,/)
          .map(normalizeIngredient)
          .filter(Boolean),
        notes: 'Added manually.',
      },
      'manual',
      { syncToMealPlan: true }
    );

    setManual({ name: '', calories: '', protein: '', carbs: '', fat: '', serving: '', ingredients: '' });
    setShowManual(false);
  }

  function startEditing(meal: LoggedMeal) {
    setEditingMeal(meal);
    setEditDraft({
      name: meal.name,
      serving: meal.serving,
      calories: String(meal.calories),
      protein: String(meal.protein),
      carbs: String(meal.carbs),
      fat: String(meal.fat),
      ingredients: meal.ingredients.join(', '),
    });
  }

  function handleSaveEdit() {
    if (!editingMeal) return;

    const updates: Partial<LoggedMeal> = {
      name: editDraft.name.trim(),
      serving: editDraft.serving.trim() || '1 serving',
      calories: Number(editDraft.calories) || 0,
      protein: Number(editDraft.protein) || 0,
      carbs: Number(editDraft.carbs) || 0,
      fat: Number(editDraft.fat) || 0,
      ingredients: editDraft.ingredients.split(/\n|,/).map(normalizeIngredient).filter(Boolean),
      notes: editingMeal.notes,
    };

    updateLoggedMeal(editingMeal.id, updates);
    const nextMeals = loadLoggedMeals();
    setLoggedMeals(nextMeals);

    if (editingMeal.linkedDate && editingMeal.linkedMealType) {
      syncMealToMealPlan({ ...editingMeal, ...updates } as LoggedMeal, editingMeal.linkedDate, editingMeal.linkedMealType);
    }

    setEditingMeal(null);
  }

  function handleDeleteMeal(id: string) {
    deleteLoggedMeal(id);
    setLoggedMeals(loadLoggedMeals());
  }

  async function handleDescribeCapture() {
    if (!captureText.trim()) return;
    setIsSubmitting(true);
    setCaptureError('');

    try {
      const prompt =
        `Extract the meal in this text into JSON only with keys name, serving, calories, protein, carbs, fat, ingredients, notes. ` +
        `Use a short ingredient list. If you are unsure, estimate reasonably.\n\nMeal description: ${captureText}`;
      const parsed = await analyzeWithAi({ prompt }).catch(() => null);
      setCaptureResult(parsed ?? parseDescribeFallback(captureText));
    } catch (error) {
      setCaptureError(error instanceof Error ? error.message : 'Could not analyze your meal description.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePhotoCapture() {
    if (!selectedImage) return;
    setIsSubmitting(true);
    setCaptureError('');

    try {
      const prompt =
        'Look at this food photo and return JSON only with keys name, serving, calories, protein, carbs, fat, ingredients, notes. ' +
        'Identify the main meal and list the visible ingredients. If portions are unclear, estimate a reasonable single serving.';
      const parsed = await analyzeWithAi({ prompt, imageFile: selectedImage });
      setCaptureResult(parsed ?? parsePhotoFallback(selectedImage));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not analyze the meal photo.';

      if (message.includes('AI features are not configured')) {
        setCaptureResult(parsePhotoFallback(selectedImage));
        setCaptureError('AI photo analysis is unavailable here, so we created a manual-review meal card instead.');
      } else {
        setCaptureError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBarcodeLookup() {
    if (!barcode.trim()) return;
    setCaptureError('');

    const match = popularFoods.find((food) => food.barcode === barcode.trim());
    if (!match) {
      setCaptureResult(null);
      setCaptureError('Barcode not found in the current food catalog.');
      return;
    }

    setCaptureResult({
      name: match.name,
      serving: match.portion,
      calories: match.cal,
      protein: match.protein,
      carbs: match.carbs,
      fat: match.fat,
      ingredients: match.ingredients ?? [match.name],
      notes: `Matched barcode ${barcode.trim()}.`,
    });
  }

  function confirmCapture() {
    if (!captureResult || !captureMode) return;
    addMeal(captureResult, captureMode);
    resetCaptureState(null);
  }

  const mealTypeTabs: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="min-h-screen text-foreground pb-24 space-y-5 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Log Food</h1>
        <p className="text-sm text-muted-foreground mt-1">Track what you eat to hit your goals</p>
      </div>

      <Tabs
        value={activeMealType}
        onValueChange={(value) => setActiveMealType(value as MealType)}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="breakfast">🌅 Breakfast</TabsTrigger>
          <TabsTrigger value="lunch">☀️ Lunch</TabsTrigger>
          <TabsTrigger value="dinner">🌙 Dinner</TabsTrigger>
          <TabsTrigger value="snack">🍎 Snack</TabsTrigger>
        </TabsList>

        {mealTypeTabs.map((mealType) => (
          <TabsContent key={mealType} value={mealType} className="space-y-5 animate-in fade-in duration-200">
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  id: 'photo',
                  label: 'Take Photo',
                  desc: 'Capture meal + ingredients',
                  icon: Camera,
                  cls: 'border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10',
                  iconCls: 'bg-primary/15 text-primary',
                  onClick: () => resetCaptureState('photo'),
                },
                {
                  id: 'barcode',
                  label: 'Scan Barcode',
                  desc: 'Lookup packaged food',
                  icon: ScanBarcode,
                  cls: 'border border-border bg-card hover:border-primary/30',
                  iconCls: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20',
                  onClick: () => resetCaptureState('barcode'),
                },
                {
                  id: 'describe',
                  label: 'Describe It',
                  desc: 'Parse meal text',
                  icon: MessageSquare,
                  cls: 'border border-border bg-card hover:border-primary/30',
                  iconCls: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20',
                  onClick: () => resetCaptureState('describe'),
                },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={method.onClick}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl transition-all active:scale-95 group ${method.cls}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${method.iconCls}`}>
                    <method.icon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-foreground">{method.label}</p>
                    <p className="text-[10px] text-muted-foreground">{method.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search foods..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {search ? 'Search Results' : 'Popular Foods'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {filtered.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <Search className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-foreground">No foods found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try a dish name, cuisine, or ingredient like pizza, tomato, or Italian.</p>
                  </div>
                ) : (
                  filtered.map((food, index) => (
                    <div
                      key={food.name}
                      className={`flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer group ${
                        index < filtered.length - 1 ? 'border-b border-border' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-foreground">{food.name}</p>
                          {food.tags.map((tag) => (
                            <Badge key={tag} className={`text-[9px] px-1.5 py-0 h-4 ${tagColors[tag] || ''}`}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                          <span>{food.portion}</span>
                          <span className="flex items-center gap-0.5"><Beef className="w-2.5 h-2.5" /> {food.protein}g P</span>
                          <span className="flex items-center gap-0.5"><Wheat className="w-2.5 h-2.5" /> {food.carbs}g C</span>
                          <span className="flex items-center gap-0.5"><Droplets className="w-2.5 h-2.5" /> {food.fat}g F</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <span className="text-sm font-bold text-primary tabular-nums flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" />
                          {food.cal}
                        </span>
                        <button
                          onClick={() => handleQuickAdd(food)}
                          className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Logged for {mealTypeLabel(activeMealType)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentMealEntries.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                    <UtensilsCrossed className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-foreground">No foods logged yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Capture a meal photo, barcode, or description to store ingredients and macros.
                    </p>
                  </div>
                ) : (
                  currentMealEntries.map((entry) => (
                    <div key={entry.id} className="rounded-2xl border border-border p-4 bg-background/60">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-foreground">{entry.name}</p>
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                              {entry.source}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{entry.serving}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary flex items-center gap-1 justify-end">
                            <Flame className="w-3.5 h-3.5" />
                            {entry.calories}
                          </p>
                          <p className="text-[10px] text-muted-foreground">calories</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3 text-[11px]">
                        <div className="rounded-xl bg-card px-3 py-2">Protein: <span className="font-semibold">{entry.protein}g</span></div>
                        <div className="rounded-xl bg-card px-3 py-2">Carbs: <span className="font-semibold">{entry.carbs}g</span></div>
                        <div className="rounded-xl bg-card px-3 py-2">Fat: <span className="font-semibold">{entry.fat}g</span></div>
                      </div>
                      <div className="mt-3">
                        <p className="text-[11px] font-semibold text-foreground mb-1">Ingredients</p>
                        <div className="flex flex-wrap gap-1.5">
                          {entry.ingredients.length > 0 ? (
                            entry.ingredients.map((ingredient) => (
                              <Badge key={ingredient} variant="outline" className="text-[10px]">
                                {ingredient}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-[11px] text-muted-foreground">No ingredients captured.</span>
                          )}
                        </div>
                      </div>
                      {entry.notes ? <p className="text-[11px] text-muted-foreground mt-3">{entry.notes}</p> : null}
                      <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEditing(entry)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMeal(entry.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <div>
              <button
                onClick={() => setShowManual(!showManual)}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline transition-colors"
              >
                <Plus className={`w-4 h-4 transition-transform duration-200 ${showManual ? 'rotate-45' : ''}`} />
                {showManual ? 'Cancel manual entry' : 'Add manually'}
              </button>
              {showManual && (
                <Card className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Manual Entry</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-foreground mb-1 block">Food Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Grilled chicken salad"
                          value={manual.name}
                          onChange={(event) => setManual({ ...manual, name: event.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-foreground mb-1 block">Ingredients</label>
                        <textarea
                          rows={3}
                          placeholder="Chicken, lettuce, tomatoes, olive oil"
                          value={manual.ingredients}
                          onChange={(event) => setManual({ ...manual, ingredients: event.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                      </div>
                      {[
                        { key: 'serving', label: 'Serving Size', placeholder: 'e.g. 1 bowl' },
                        { key: 'calories', label: 'Calories', placeholder: '0', type: 'number' },
                        { key: 'protein', label: 'Protein (g)', placeholder: '0', type: 'number' },
                        { key: 'carbs', label: 'Carbs (g)', placeholder: '0', type: 'number' },
                        { key: 'fat', label: 'Fat (g)', placeholder: '0', type: 'number' },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="text-xs font-medium text-foreground mb-1 block">{field.label}</label>
                          <input
                            type={field.type || 'text'}
                            placeholder={field.placeholder}
                            value={(manual as Record<string, string>)[field.key]}
                            onChange={(event) => setManual({ ...manual, [field.key]: event.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleManualLog}
                      className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 active:scale-95"
                    >
                      Log Food
                    </button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {captureMode === 'photo' && (
        <CaptureModal
          title="Take Photo"
          description="Upload a meal photo and Posha will estimate the meal, ingredients, and macros."
          onClose={() => resetCaptureState(null)}
        >
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                setSelectedImage(file);
                setCaptureResult(null);
                setCaptureError('');
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-8 text-center hover:bg-primary/10 transition-colors"
            >
              <Camera className="w-8 h-8 mx-auto text-primary mb-2" />
              <p className="text-sm font-semibold text-foreground">
                {selectedImage ? selectedImage.name : 'Choose or capture a meal photo'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG, or WEBP</p>
            </button>
            <button
              onClick={handlePhotoCapture}
              disabled={!selectedImage || isSubmitting}
              className="w-full rounded-xl bg-primary text-white py-2.5 font-semibold text-sm disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Analyze meal photo'}
            </button>
            {captureError ? <p className="text-sm text-red-500">{captureError}</p> : null}
            {captureResult ? (
              <div className="rounded-2xl border border-border bg-background p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold">{captureResult.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">{captureResult.serving}</p>
                <p className="text-xs text-foreground">Ingredients: {captureResult.ingredients.join(', ') || 'Not detected'}</p>
                <button
                  onClick={confirmCapture}
                  className="w-full rounded-xl bg-foreground text-white py-2.5 text-sm font-semibold"
                >
                  Save captured meal
                </button>
              </div>
            ) : null}
          </div>
        </CaptureModal>
      )}

      {captureMode === 'barcode' && (
        <CaptureModal
          title="Scan Barcode"
          description="Enter a barcode from a packaged food to pull its nutrition and ingredients."
          onClose={() => resetCaptureState(null)}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="e.g. 9300605123451"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm"
            />
            <button
              onClick={handleBarcodeLookup}
              className="w-full rounded-xl bg-primary text-white py-2.5 font-semibold text-sm"
            >
              Lookup barcode
            </button>
            <p className="text-xs text-muted-foreground">
              Sample demo barcodes: 9300605123451, 9300605987654, 9312345678901
            </p>
            {captureError ? <p className="text-sm text-red-500">{captureError}</p> : null}
            {captureResult ? (
              <div className="rounded-2xl border border-border bg-background p-4 space-y-2">
                <p className="text-sm font-semibold">{captureResult.name}</p>
                <p className="text-xs text-muted-foreground">{captureResult.serving}</p>
                <p className="text-xs text-foreground">Ingredients: {captureResult.ingredients.join(', ')}</p>
                <button
                  onClick={confirmCapture}
                  className="w-full rounded-xl bg-foreground text-white py-2.5 text-sm font-semibold"
                >
                  Save barcode item
                </button>
              </div>
            ) : null}
          </div>
        </CaptureModal>
      )}

      {captureMode === 'describe' && (
        <CaptureModal
          title="Describe It"
          description="Describe your meal in plain language and Posha will turn it into a logged meal with ingredients."
          onClose={() => resetCaptureState(null)}
        >
          <div className="space-y-4">
            <textarea
              rows={5}
              placeholder="e.g. Grilled chicken salad with avocado, cherry tomatoes, feta, and olive oil dressing"
              value={captureText}
              onChange={(event) => setCaptureText(event.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm"
            />
            <button
              onClick={handleDescribeCapture}
              disabled={!captureText.trim() || isSubmitting}
              className="w-full rounded-xl bg-primary text-white py-2.5 font-semibold text-sm disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Analyze description'}
            </button>
            {captureError ? <p className="text-sm text-red-500">{captureError}</p> : null}
            {captureResult ? (
              <div className="rounded-2xl border border-border bg-background p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold">{captureResult.name}</p>
                </div>
                <p className="text-xs text-foreground">Ingredients: {captureResult.ingredients.join(', ')}</p>
                <button
                  onClick={confirmCapture}
                  className="w-full rounded-xl bg-foreground text-white py-2.5 text-sm font-semibold"
                >
                  Save described meal
                </button>
              </div>
            ) : null}
          </div>
        </CaptureModal>
      )}

      {editingMeal && (
        <CaptureModal
          title="Edit Logged Food"
          description="Update the meal details, ingredients, and macros."
          onClose={() => setEditingMeal(null)}
        >
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Food Name</label>
              <input
                type="text"
                value={editDraft.name}
                onChange={(event) => setEditDraft({ ...editDraft, name: event.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Ingredients</label>
              <textarea
                rows={3}
                value={editDraft.ingredients}
                onChange={(event) => setEditDraft({ ...editDraft, ingredients: event.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'serving', label: 'Serving' },
                { key: 'calories', label: 'Calories' },
                { key: 'protein', label: 'Protein (g)' },
                { key: 'carbs', label: 'Carbs (g)' },
                { key: 'fat', label: 'Fat (g)' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-foreground mb-1 block">{field.label}</label>
                  <input
                    type={field.key === 'serving' ? 'text' : 'number'}
                    value={(editDraft as Record<string, string>)[field.key]}
                    onChange={(event) => setEditDraft({ ...editDraft, [field.key]: event.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleSaveEdit}
              className="w-full rounded-xl bg-primary text-white py-2.5 font-semibold text-sm"
            >
              Save changes
            </button>
          </div>
        </CaptureModal>
      )}
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Leaf } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

/* ─── Topic detection ─────────────────────────────────────────────── */
const HEALTH_KEYWORDS = [
  // Nutrition & food
  'food','calorie','calories','protein','carb','carbs','fat','fats','fiber','sugar',
  'vitamin','mineral','nutrient','nutrition','macro','macros','diet','eat','eating',
  'meal','meals','recipe','ingredient','ingredients','vegetable','fruit','grain','dairy',
  'sodium','potassium','calcium','iron','zinc','magnesium','omega','antioxidant',
  'portion','serving','kcal','kj','breakfast','lunch','dinner','snack','cook','cooking',
  'water','hydration','supplement','probiotic','prebiotic','glucose','glycemic',
  'cholesterol','saturated','unsaturated','trans fat','whole grain','processed',
  // Weight & body
  'weight','lose weight','gain weight','bmi','body mass','overweight','obese','obesity',
  'kg','pounds','lbs','stone','waist','belly','fat loss','fat gain','body fat','lean mass',
  'bulk','cut','caloric deficit','caloric surplus','deficit','surplus','tdee','bmr',
  'metabolism','metabolic rate','body composition',
  // Fitness & exercise
  'exercise','workout','training','gym','run','running','walk','walking','cardio',
  'strength','resistance','weight training','hiit','steps','active','activity',
  'muscle','muscles','bicep','squat','deadlift','push','pull','rep','set','rest day',
  'recovery','soreness','doms','endurance','stamina','flexibility','stretch',
  'sport','sports','swim','swimming','cycling','yoga','pilates','crossfit',
  // Health & wellness
  'health','healthy','wellness','wellbeing','sleep','stress','hormones','thyroid',
  'insulin','blood sugar','blood pressure','heart','cardiovascular','cholesterol',
  'gut','digestion','digestive','immune','inflammation','energy level','fatigue','tired',
  'mood','mental','anxiety','depression','chronic','disease','diabetes','hypertension',
  // Goals
  'goal','goals','reduce','lose','gain','build','improve','maintain','increase','decrease',
  'how to','how do','how can','what should','tips','advice','plan','strategy',
];

function isHealthRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return HEALTH_KEYWORDS.some(kw => lower.includes(kw));
}

/* ─── Response rules (pattern → answer) ──────────────────────────── */
type Rule = { patterns: string[]; answer: string };

const RULES: Rule[] = [
  // Weight loss
  {
    patterns: ['lose weight','weight loss','reduce weight','drop weight','lose fat','shed','slim'],
    answer: `Great goal! Here's a practical roadmap to lose weight sustainably:\n\n1. **Calorie deficit** — Eat 300–500 kcal less than you burn per day. That's ~0.3–0.5 kg/week, which is safe and maintainable.\n2. **Track your intake** — Use the Log Food page to stay accountable. Most people underestimate by 20–30%.\n3. **Prioritise protein** — Aim for 1.6–2g per kg of bodyweight. Protein keeps you full and preserves muscle during a cut.\n4. **Move more** — Add 8,000–10,000 steps/day + 2–3 strength sessions/week. This increases your calorie burn without making you ravenous.\n5. **Sleep 7–9 hours** — Poor sleep raises hunger hormones (ghrelin) and lowers willpower.\n6. **Be patient** — 0.5–1 kg/week is realistic. Crash diets cause muscle loss and rebound.\n\nFor 5 kg specifically, expect 6–12 weeks at a steady deficit. You've got this! 💪`,
  },
  {
    patterns: ['how much weight','how fast','how long to lose','how quickly'],
    answer: `A safe, sustainable rate of fat loss is **0.5–1 kg per week**.\n\nTo lose 5 kg:\n• At 0.5 kg/week → ~10 weeks\n• At 1 kg/week → ~5 weeks\n\nThis requires a daily deficit of 500–1000 kcal below your TDEE (Total Daily Energy Expenditure). Going faster risks muscle loss, fatigue, and rebound weight gain.\n\nUse the Dashboard to track your daily calories and progress toward your goal weight.`,
  },
  {
    patterns: ['gain weight','gain muscle','build muscle','bulk','muscle mass'],
    answer: `To gain muscle (lean bulk):\n\n1. **Calorie surplus** — Eat 250–500 kcal above maintenance. More than that risks excessive fat gain.\n2. **High protein** — 1.6–2.2g per kg bodyweight daily. Distribute across 3–5 meals.\n3. **Progressive overload** — Lift heavier or do more reps/sets each week. Without stimulus, extra calories just become fat.\n4. **Compound lifts** — Squats, deadlifts, bench press, rows, overhead press give the most muscle-building bang per session.\n5. **Sleep & recovery** — Muscle is built during rest, not during workouts. Prioritise 7–9 hrs sleep.\n\nExpect 0.5–1 kg of lean muscle per month as a natural lifter — that's the realistic ceiling.`,
  },
  // Calorie deficit / surplus
  {
    patterns: ['caloric deficit','calorie deficit','deficit'],
    answer: `A calorie deficit means eating fewer calories than your body burns.\n\n• **Mild deficit (250–300 kcal/day)** → ~0.25 kg/week loss, easier to maintain\n• **Moderate deficit (500 kcal/day)** → ~0.5 kg/week, the most common recommendation\n• **Large deficit (>750 kcal/day)** → faster loss but high risk of muscle loss, fatigue, and diet failure\n\nFind your TDEE (Total Daily Energy Expenditure) first — it's roughly your bodyweight (kg) × 30–35 for a moderately active person. Then subtract to create your deficit.\n\nLog meals daily in NourishSnap to stay on track.`,
  },
  {
    patterns: ['tdee','bmr','maintenance calories','how many calories do i need','how many calories should i eat','daily calories'],
    answer: `Your calorie needs depend on your stats and activity level.\n\n**Quick estimate:**\n• Sedentary (desk job, little exercise): bodyweight (kg) × 28–30 kcal\n• Lightly active (3× exercise/week): × 32–34 kcal\n• Moderately active (5× exercise/week): × 35–37 kcal\n• Very active (intense daily training): × 38–40 kcal\n\nExample: 80 kg, moderately active → ~2,800–2,960 kcal/day to maintain weight.\n\nSubtract 500 kcal to lose, add 300 kcal to gain muscle. Update your goal on the Settings page and track daily in the Dashboard.`,
  },
  // Protein
  {
    patterns: ['protein','how much protein','high protein'],
    answer: `Protein is essential for muscle repair, satiety, and metabolism.\n\n**How much:**\n• Sedentary adults: 0.8g per kg bodyweight\n• Active / fitness-focused: 1.6–2g per kg\n• Muscle building: 2–2.2g per kg\n\n**Best sources:**\n• Animal: chicken breast, eggs, Greek yogurt, cottage cheese, salmon, tuna, lean beef\n• Plant: lentils, chickpeas, tofu, tempeh, edamame, black beans, seitan\n\nSpread intake across meals — your body can only synthesise ~30–40g of protein at a time for muscle building. Track protein in the Log Food page.`,
  },
  // Carbs
  {
    patterns: ['carb','carbohydrate','carbs','low carb','no carb','keto'],
    answer: `Carbohydrates are your body's preferred energy source — especially for the brain and muscles.\n\n**Focus on complex carbs:**\n• Oats, brown rice, quinoa, sweet potato, whole grain bread, legumes\n• These digest slowly, keeping blood sugar stable and energy steady\n\n**Limit refined carbs:**\n• White bread, sugary drinks, pastries, white rice in excess\n\n**Low-carb / keto:**\n• Can work for weight loss and blood sugar control, but isn't necessary for everyone\n• May reduce energy for intense workouts initially (adaptation takes 2–4 weeks)\n\nFor most active people, 40–50% of calories from carbs is a good starting point.`,
  },
  // Fat
  {
    patterns: ['fat','healthy fat','unhealthy fat','saturated','trans fat','omega'],
    answer: `Dietary fat is essential — it supports hormones, brain health, and vitamin absorption.\n\n**Healthy (prioritise):**\n• Monounsaturated: avocado, olive oil, almonds\n• Polyunsaturated: salmon, walnuts, flaxseed, chia (great for omega-3)\n\n**Limit:**\n• Saturated fat: red meat, butter, coconut oil, full-fat dairy — keep under 10% of calories\n\n**Avoid:**\n• Trans fats: partially hydrogenated oils found in some fried and packaged foods\n\nAim for fat to make up 25–35% of your total daily calories.`,
  },
  // Fiber
  {
    patterns: ['fiber','fibre','digestion','digestive','bloat','gut'],
    answer: `Fiber is critical for digestive health, blood sugar control, and satiety.\n\n**Daily targets:**\n• Women: 25g/day\n• Men: 38g/day\n\n**Best sources:**\n• Beans & lentils (top tier — 8–10g per ½ cup)\n• Oats, barley, quinoa\n• Vegetables: broccoli, Brussels sprouts, carrots\n• Fruits: apples (with skin), pears, berries\n• Flaxseed, chia seeds\n\n**Tips:** Increase fiber gradually and drink plenty of water to avoid bloating. If you're suddenly adding a lot of legumes, give your gut 1–2 weeks to adapt.`,
  },
  // Water / hydration
  {
    patterns: ['water','hydrat','drink','thirst','dehydrat'],
    answer: `Hydration affects energy, focus, digestion, and even hunger (thirst is often mistaken for hunger).\n\n**General guidelines:**\n• Women: ~2.7L (11 cups) total water per day\n• Men: ~3.7L (15 cups) total water per day\n• Add 0.5–1L extra for every hour of exercise\n\n**Signs of dehydration:** dark urine, fatigue, headaches, poor concentration\n\n**Tips:**\n• Start the day with a big glass of water\n• Carry a bottle — visibility drives consumption\n• Herbal teas, fruits, and vegetables all contribute to intake\n\nTrack your water on the Dashboard to hit your daily goal.`,
  },
  // Exercise
  {
    patterns: ['exercise','workout','training','gym','cardio','run','walk','steps','hiit','strength','lifting'],
    answer: `Exercise is the most powerful lever for long-term health — beyond just calories.\n\n**WHO recommendations:**\n• 150–300 min/week of moderate cardio (walking, cycling, swimming)\n• OR 75–150 min/week of vigorous cardio (running, HIIT)\n• PLUS 2+ strength sessions/week targeting major muscle groups\n\n**For fat loss:**\n• Cardio burns calories in session; strength training raises your resting metabolism\n• Combining both is most effective\n\n**For muscle gain:**\n• Prioritise progressive overload in strength training\n• Don't neglect cardio — cardiovascular health supports recovery\n\n**Recovery:** At least 1–2 rest days per week. Sleep and protein are your biggest recovery tools.`,
  },
  // Sleep
  {
    patterns: ['sleep','insomnia','rest','recovery','tired','fatigue'],
    answer: `Sleep is arguably the most underrated pillar of health and fitness.\n\n**Why it matters:**\n• Poor sleep raises ghrelin (hunger hormone) by up to 28% and lowers leptin (fullness hormone)\n• Growth hormone — essential for muscle repair — is released primarily during deep sleep\n• Sleep deprivation impairs willpower, making healthy choices harder\n\n**How much:** Adults need 7–9 hours of quality sleep per night.\n\n**Tips for better sleep:**\n• Consistent wake time (even weekends)\n• Avoid screens 30–60 min before bed\n• Keep the room cool (16–19°C)\n• No caffeine after 2 PM\n• Avoid heavy meals within 2 hrs of bed`,
  },
  // Stress
  {
    patterns: ['stress','cortisol','anxiety','mental','overwhelm'],
    answer: `Chronic stress raises cortisol, which promotes fat storage (especially around the belly), disrupts sleep, and drives sugar cravings.\n\n**Managing stress for better health:**\n• **Exercise** — even a 20-min walk significantly reduces cortisol\n• **Adequate sleep** — the #1 cortisol regulator\n• **Mindfulness / breathing** — 5 min of deep breathing activates the parasympathetic system\n• **Consistent eating** — blood sugar crashes amplify stress hormones\n• **Social connection** — loneliness is a chronic stressor\n\nIf stress is significantly affecting your eating patterns or weight, consider speaking with a healthcare professional or registered dietitian.`,
  },
  // BMI
  {
    patterns: ['bmi','body mass index'],
    answer: `BMI (Body Mass Index) = weight (kg) ÷ height² (m²)\n\n**Standard ranges:**\n• < 18.5 — Underweight\n• 18.5–24.9 — Healthy weight\n• 25–29.9 — Overweight\n• ≥ 30 — Obese\n\n**Limitations:** BMI doesn't distinguish muscle from fat, so it can misclassify muscular athletes as overweight. Body fat percentage and waist circumference are often more useful alongside BMI.\n\n**Better metrics to track:** waist-to-height ratio, body fat %, energy levels, strength, and how your clothes fit.`,
  },
  // Vitamins / minerals
  {
    patterns: ['vitamin','mineral','supplement','deficien'],
    answer: `Vitamins and minerals are essential micronutrients your body can't make in sufficient quantities.\n\n**Common deficiencies to watch:**\n• **Vitamin D** — most people (especially in low-sunlight climates) are deficient. Supplement 1000–2000 IU/day.\n• **Iron** — especially women. Found in red meat, lentils, spinach. Pair with Vitamin C to absorb better.\n• **B12** — critical for vegans/vegetarians. Supplement daily.\n• **Magnesium** — supports sleep, muscle function, stress. Found in nuts, seeds, dark chocolate.\n• **Omega-3** — anti-inflammatory. Found in fatty fish, walnuts, flaxseed.\n\nCheck the Nutrition tab on your Dashboard to see your current coverage and gaps.`,
  },
  // Metabolism
  {
    patterns: ['metabolism','metabolic','slow metabolism'],
    answer: `Metabolism is the rate at which your body converts food to energy. It has several components:\n\n• **BMR (Basal Metabolic Rate)** — calories burned at rest (~60–70% of total)\n• **NEAT (Non-Exercise Activity)** — walking, fidgeting, daily movement (~15–30%)\n• **Exercise** — deliberate training (~5–15%)\n• **TEF (Thermic Effect of Food)** — calories burned digesting food (~10%)\n\n**To boost metabolism:**\n• Build muscle — muscle burns ~3× more calories at rest than fat\n• Eat enough protein — TEF for protein is 20–30% vs 5–10% for carbs/fat\n• Don't crash diet — very low calories suppress BMR by 10–20%\n• Stay active throughout the day (NEAT matters more than gym time for most people)\n• Sleep well — sleep deprivation reduces metabolic rate`,
  },
  // General health / how do I
  {
    patterns: ['how do i','how to','tips','advice','help me','guide','plan','strategy','best way','what should'],
    answer: `Happy to help! Here are the core pillars of health and fitness:\n\n1. **Nutrition** — eat mostly whole foods, hit your protein target, and track calories if you have a specific goal\n2. **Movement** — 8,000–10,000 steps/day + 2–3 strength sessions/week\n3. **Sleep** — 7–9 hours is non-negotiable for recovery and hunger regulation\n4. **Hydration** — 2.5–3.5L water/day depending on size and activity\n5. **Consistency** — the best plan is the one you can stick to for months, not just days\n\nCould you be more specific? E.g. "How do I lose 5 kg?", "How do I build muscle?", "How do I eat more protein?" — I'll give you a targeted answer! 🌿`,
  },
];

/* ─── Matcher ──────────────────────────────────────────────────────── */
function getAnswer(text: string): string {
  const lower = text.toLowerCase();
  // Find the rule with the most matching patterns
  let bestRule: Rule | null = null;
  let bestScore = 0;
  for (const rule of RULES) {
    const score = rule.patterns.filter(p => lower.includes(p)).length;
    if (score > bestScore) { bestScore = score; bestRule = rule; }
  }
  if (bestRule && bestScore > 0) return bestRule.answer;
  // Generic fallback for health-related but unmatched
  return `That's a great health and fitness question! Here's some general guidance:\n\nNourishSnap focuses on nutrition, fitness, and wellness. For your specific question, the key principles are:\n• Eat whole, minimally processed foods\n• Hit your protein target (1.6–2g/kg bodyweight)\n• Stay active — 150 min/week of moderate exercise\n• Sleep 7–9 hours and manage stress\n• Be consistent over weeks and months\n\nCould you ask a more specific question? For example: "How do I lose weight?", "What should I eat before a workout?", or "How much protein do I need?" — I'll give you a detailed, personalised answer! 🌿`;
}

const DEFAULT_REPLY = "I'm your NourishSnap health and fitness assistant — I can help with nutrition, weight management, exercise, sleep, and general wellness.\n\nFor questions outside health and fitness (tech issues, billing, account problems), contact us at support@nourishsnap.app.";

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm your NourishSnap health assistant 🌿\n\nAsk me anything about nutrition, weight loss, fitness, exercise, sleep, or healthy habits — I'm here to help you reach your goals!",
};

const SUGGESTED = [
  'How do I lose 5 kg?',
  'How much protein do I need?',
  'What should I eat to build muscle?',
  'How many calories should I eat?',
  'How do I boost my metabolism?',
  'What are healthy fats?',
  'How much water should I drink?',
  'How does sleep affect weight loss?',
];

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function HelpPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    await new Promise(r => setTimeout(r, 700));

    const reply = isHealthRelated(text) ? getAnswer(text) : DEFAULT_REPLY;

    const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: reply };
    setMessages(prev => [...prev, assistantMsg]);
    setLoading(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div className="text-foreground max-w-2xl mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Advisor</h1>
          <p className="text-sm text-muted-foreground">Health, fitness & nutrition assistant</p>
        </div>
      </div>

      {/* Chat window */}
      <div className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm" style={{ height: 480 }}>
        {/* Messages */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-muted/40 text-foreground border border-border rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center bg-primary/10 text-primary">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted/40 border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Thinking…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about nutrition, weight loss, fitness…"
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Try asking</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED.map(q => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted/50 text-foreground transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

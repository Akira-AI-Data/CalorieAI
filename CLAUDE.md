@AGENTS.md

# Posha - AI-Powered Calorie Tracking App

## Project Overview
Posha is an AI-powered calorie tracking app with a 3D animated landing page. Built with Next.js 16, React 19, and Tailwind CSS 4. The app combines a marketing landing page with a Claude AI chatbot backend (repurposable as a nutrition AI assistant).

## Tech Stack
- **Framework**: Next.js 16.2.2 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS 4 (`@theme inline` for design tokens)
- **Auth**: NextAuth v5 beta (Google OAuth + email/password, JWT strategy)
- **Database**: Supabase (users, conversations tables)
- **AI**: Anthropic Claude API (streaming via SSE)
- **State**: Zustand (chatStore, uiStore)
- **Animations**: Motion (motion/react), Lenis (smooth scroll)
- **3D**: Three.js, React Three Fiber, @react-three/drei (hero scene - currently using image-based hero)
- **Icons**: lucide-react

## Directory Structure
```
Chatbot/
├── src/
│   ├── app/
│   │   ├── (public)/          # Landing page + pricing (no auth required)
│   │   ├── api/               # Auth, chat, conversations endpoints
│   │   ├── chat/              # Main chat interface (auth required)
│   │   ├── login/             # Login/signup page
│   │   ├── globals.css        # Design tokens, theme, Lenis styles
│   │   └── layout.tsx         # Root layout with providers
│   ├── components/
│   │   ├── 3d/                # Three.js 3D scene components (Apple, Avocado, etc.)
│   │   ├── animations/        # ScrollReveal, CountUp
│   │   ├── landing/           # Landing page sections (Navbar, Hero, Features, etc.)
│   │   ├── chat/              # Chat UI components
│   │   ├── layout/            # App layout (Header, Sidebar)
│   │   ├── artifacts/         # Code/document viewer
│   │   ├── markdown/          # Markdown renderer
│   │   ├── providers/         # SessionProvider, ThemeProvider, SmoothScrollProvider
│   │   └── ui/                # Button, Avatar, ModelSelector, etc.
│   ├── lib/                   # Auth config, Supabase clients, utilities
│   ├── stores/                # Zustand stores
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets (salad-bowl.png, icons, manifest)
└── .env.local                 # Environment variables (not committed)
```

## Brand & Design
- **Name**: Posha
- **Logo**: Camera aperture + leaf SVG (src/components/landing/Logo.tsx)
- **Primary color**: Green `#22C55E`
- **Accent**: Amber `#F59E0B`
- **Background**: Warm off-white `#FAFAF9`
- **Theme**: Light-first with dark mode support via `.dark` class

## Key Patterns
- CSS custom properties in `:root` / `.dark` mapped to Tailwind via `@theme inline`
- `cn()` utility from clsx + tailwind-merge for conditional classes
- Public pages use `(public)` route group with Navbar + SmoothScrollProvider
- Protected routes guarded by middleware.ts (NextAuth)
- Chat uses SSE streaming via `/api/chat` endpoint
- Conversations persisted to Supabase with debounced saves

## Environment Variables Required
```
AUTH_TRUST_HOST=true
AUTH_URL=http://localhost:3000
AUTH_SECRET=<secret>
NEXT_PUBLIC_SUPABASE_URL=<url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
SUPABASE_SERVICE_ROLE_KEY=<key>
ANTHROPIC_API_KEY=<key>
AUTH_GOOGLE_ID=<id>
AUTH_GOOGLE_SECRET=<secret>
```

## Landing Page Sections (in order)
1. Navbar (sticky, transparent → solid on scroll)
2. Hero (headline + floating salad bowl image)
3. Social Proof (stats bar with CountUp animation)
4. Features Grid (6 cards with icons)
5. How It Works (3 steps: Snap, Track, Thrive)
6. App Preview (dashboard mockup with parallax)
7. Macro Tracking (alternating split layouts)
8. Testimonials (3 cards)
9. Pricing (Free, Pro $9.99, Max $19.99)
10. CTA Section (green gradient)
11. Footer (4-column dark footer)

## App Features

### Core Features
- **AI-Powered Recipe Generation** — Claude API generates personalized recipes from global cuisines using only whole, fresh ingredients (no processed food)
- **Surprise Me Widget** — Circular interactive widget that randomly picks a meal category and fetches recipes
- **Meal Planner** — Weekly calendar to plan Breakfast, Lunch, Dinner, and Snacks by date
- **Smart Shopping List** — Auto-generated from meal plan, syncs ingredients and diffs against pantry
- **Pantry Tracker** — Track ingredients you have at home
- **My Recipes** — Save and bookmark favorite recipes
- **Nutrition Dashboard** — Score-based nutrition analysis with food group balance, nutrient coverage heatmap, and personalized recommendations

### Personalization
- **Multi-Profile Support** — Multiple kid/person profiles with age-based recipe targeting
- **Age-Adaptive Recipes** — Recipes tailored to age group (baby, toddler, teen, adult)
- **Allergy & Dietary Filters** — Exclude allergens and dietary restrictions
- **Cuisine Filters** — Filter by global cuisines (Thai, Indian, Italian, Korean, etc.)
- **Ingredient-Based Search** — Find recipes by available ingredients
- **Nutrient Smart Filters** — Target specific nutrients (iron, calcium, protein, etc.)

### Intelligence
- **Nutrition Score Ring** — Overall nutrition score (0-100) based on recent meals
- **Food Group Balance Bars** — Visual breakdown of vegetables, fruits, grains, protein, dairy
- **Nutrient Coverage Tiles** — Per-nutrient scoring with age-priority highlighting
- **Personalized Recommendations** — AI-driven tips (warnings, suggestions, success indicators)
- **Meal History Analytics** — 2-week overview with cuisine diversity tracking

## GitHub
- **Org**: Akira-Ai-Data
- **Repo**: ProjectCalories

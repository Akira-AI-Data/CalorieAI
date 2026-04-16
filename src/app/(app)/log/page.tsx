'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, ScanBarcode, MessageSquare, Search, Plus, Flame, Beef, Wheat, Droplets } from 'lucide-react';

const popularFoods = [
  { name: 'Chicken Breast', portion: '100g', cal: 156, protein: 31, carbs: 0, fat: 3.6, tags: ['High Protein'] },
  { name: 'Brown Rice', portion: '1 cup', cal: 216, protein: 5, carbs: 45, fat: 1.8, tags: ['Complex Carbs'] },
  { name: 'Scrambled Eggs', portion: '2 eggs', cal: 182, protein: 12, carbs: 2, fat: 14, tags: ['Breakfast'] },
  { name: 'Greek Yogurt', portion: '200g', cal: 130, protein: 12, carbs: 7, fat: 6, tags: ['Probiotic'] },
  { name: 'Banana', portion: '1 medium', cal: 117, protein: 1.3, carbs: 27, fat: 0.4, tags: ['Fruit'] },
  { name: 'Avocado', portion: 'Half', cal: 161, protein: 2, carbs: 9, fat: 15, tags: ['Healthy Fats'] },
  { name: 'Oatmeal', portion: '1 cup', cal: 150, protein: 5, carbs: 27, fat: 2.5, tags: ['Breakfast'] },
  { name: 'Salmon Fillet', portion: '100g', cal: 208, protein: 20, carbs: 0, fat: 13, tags: ['Omega-3'] },
];

const tagColors: Record<string, string> = {
  'High Protein': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Complex Carbs': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Breakfast': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Probiotic': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Fruit': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Healthy Fats': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Omega-3': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
};

// Suppress unused import warnings — Progress is used via shadcn internally
void Progress;

export default function LogFoodPage() {
  const [search, setSearch] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState({ name:'', calories:'', protein:'', carbs:'', fat:'', serving:'' });

  const filtered = popularFoods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen text-foreground pb-24 space-y-5 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Log Food</h1>
        <p className="text-sm text-muted-foreground mt-1">Track what you eat to hit your goals</p>
      </div>

      {/* Meal Type Tabs */}
      <Tabs defaultValue="lunch" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="breakfast">🌅 Breakfast</TabsTrigger>
          <TabsTrigger value="lunch">☀️ Lunch</TabsTrigger>
          <TabsTrigger value="dinner">🌙 Dinner</TabsTrigger>
          <TabsTrigger value="snack">🍎 Snack</TabsTrigger>
        </TabsList>

        {['breakfast','lunch','dinner','snack'].map(meal => (
          <TabsContent key={meal} value={meal} className="space-y-5 animate-in fade-in duration-200">

            {/* Input Methods */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id:'photo', label:'Take Photo', desc:'AI scans meal', icon:Camera, cls:'border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10', iconCls:'bg-primary/15 text-primary' },
                { id:'barcode', label:'Scan Barcode', desc:'Packaged foods', icon:ScanBarcode, cls:'border border-border bg-card hover:border-primary/30', iconCls:'bg-orange-100 text-orange-600 dark:bg-orange-900/20' },
                { id:'describe', label:'Describe It', desc:'Natural language', icon:MessageSquare, cls:'border border-border bg-card hover:border-primary/30', iconCls:'bg-purple-100 text-purple-600 dark:bg-purple-900/20' },
              ].map(m => (
                <button key={m.id} className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl transition-all active:scale-95 group ${m.cls}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${m.iconCls}`}>
                    <m.icon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-foreground">{m.label}</p>
                    <p className="text-[10px] text-muted-foreground">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search foods…"
                value={search}
                onChange={e=>setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            {/* Food List */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {search ? 'Search Results' : 'Popular Foods'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {filtered.map((food, i) => (
                  <div key={food.name} className={`flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer group ${i < filtered.length-1 ? 'border-b border-border' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{food.name}</p>
                        {food.tags.map(t=>(
                          <Badge key={t} className={`text-[9px] px-1.5 py-0 h-4 ${tagColors[t]||''}`}>{t}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                        <span>{food.portion}</span>
                        <span className="flex items-center gap-0.5"><Beef className="w-2.5 h-2.5"/> {food.protein}g P</span>
                        <span className="flex items-center gap-0.5"><Wheat className="w-2.5 h-2.5"/> {food.carbs}g C</span>
                        <span className="flex items-center gap-0.5"><Droplets className="w-2.5 h-2.5"/> {food.fat}g F</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <span className="text-sm font-bold text-primary tabular-nums flex items-center gap-1"><Flame className="w-3.5 h-3.5"/>{food.cal}</span>
                      <button className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Manual Entry */}
            <div>
              <button onClick={()=>setShowManual(!showManual)} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline transition-colors">
                <Plus className={`w-4 h-4 transition-transform duration-200 ${showManual?'rotate-45':''}`} />
                {showManual ? 'Cancel manual entry' : 'Add manually'}
              </button>
              {showManual && (
                <Card className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <CardHeader className="pb-3"><CardTitle className="text-sm">Manual Entry</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-foreground mb-1 block">Food Name</label>
                        <input type="text" placeholder="e.g. Grilled chicken breast" value={manual.name} onChange={e=>setManual({...manual,name:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"/>
                      </div>
                      {[{k:'serving',label:'Serving Size',ph:'e.g. 100g'},{k:'calories',label:'Calories',ph:'0',type:'number'},{k:'protein',label:'Protein (g)',ph:'0',type:'number'},{k:'carbs',label:'Carbs (g)',ph:'0',type:'number'},{k:'fat',label:'Fat (g)',ph:'0',type:'number'}].map(f=>(
                        <div key={f.k}>
                          <label className="text-xs font-medium text-foreground mb-1 block">{f.label}</label>
                          <input type={f.type||'text'} placeholder={f.ph} value={(manual as Record<string,string>)[f.k]} onChange={e=>setManual({...manual,[f.k]:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"/>
                        </div>
                      ))}
                    </div>
                    <button className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 active:scale-95">
                      Log Food
                    </button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

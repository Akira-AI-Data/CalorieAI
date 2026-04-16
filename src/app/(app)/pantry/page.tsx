'use client'

import { useState, useEffect } from 'react'
import { Warehouse, Plus, Trash2, Package } from 'lucide-react'

interface PantryItem {
  id: string
  name: string
  quantity: string
  unit: string
  addedAt: string
}

const unitOptions = ['g', 'kg', 'ml', 'L', 'cups', 'pcs', 'tbsp', 'tsp']

const PANTRY_KEY = 'calorieai_pantry'

function loadPantry(): PantryItem[] {
  try {
    return JSON.parse(localStorage.getItem(PANTRY_KEY) || '[]')
  } catch {
    return []
  }
}

function savePantry(items: PantryItem[]) {
  localStorage.setItem(PANTRY_KEY, JSON.stringify(items))
}

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([])
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('g')

  useEffect(() => {
    setItems(loadPantry())
  }, [])

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const newItem: PantryItem = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
      name: name.trim(),
      quantity: quantity.trim(),
      unit,
      addedAt: new Date().toISOString(),
    }
    const updated = [newItem, ...items]
    setItems(updated)
    savePantry(updated)
    setName('')
    setQuantity('')
    setUnit('g')
  }

  function removeItem(id: string) {
    const updated = items.filter((item) => item.id !== id)
    setItems(updated)
    savePantry(updated)
  }

  return (
    <div className="animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
        <Warehouse className="w-6 h-6 text-primary" />
        My Pantry
      </h1>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name (e.g., Sweet potato)"
          className="flex-1 px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Qty"
          min="0"
          className="w-20 px-3 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-20 px-2 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm bg-card-bg"
        >
          {unitOptions.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!name.trim()}
          className="px-4 py-3 bg-foreground text-white rounded-xl hover:bg-foreground/80 transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-foreground"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      {/* Pantry Items */}
      {items.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-muted-foreground-foreground mx-auto mb-3" />
          <p className="text-muted-foreground-foreground">Your pantry is empty. Add items above!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-card-bg rounded-xl px-4 py-3 border border-border group"
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                {item.quantity && (
                  <span className="text-xs text-muted-foreground">{item.quantity}{item.unit ? ` ${item.unit}` : ''}</span>
                )}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-muted-foreground-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react'

type State =
  | { kind: 'loading' }
  | { kind: 'no_home' }
  | { kind: 'perm_default' }
  | { kind: 'perm_denied' }
  | { kind: 'no_geo' }
  | { kind: 'ready'; distanceKm: number | null }

export function ReminderStatus() {
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('Notification' in window)) return setState({ kind: 'no_geo' })

    ;(async () => {
      let home: { lat: number; lng: number } | null = null
      try {
        const res = await fetch('/api/profile')
        const d = await res.json()
        if (d.profile?.latitude != null && d.profile?.longitude != null) {
          home = { lat: Number(d.profile.latitude), lng: Number(d.profile.longitude) }
        }
      } catch {}
      if (!home) {
        try {
          const s = JSON.parse(localStorage.getItem('posha_settings') || '{}')
          const lat = parseFloat(s?.personalInfo?.latitude)
          const lng = parseFloat(s?.personalInfo?.longitude)
          if (!isNaN(lat) && !isNaN(lng)) home = { lat, lng }
        } catch {}
      }
      if (!home) return setState({ kind: 'no_home' })

      if (Notification.permission === 'default') return setState({ kind: 'perm_default' })
      if (Notification.permission === 'denied') return setState({ kind: 'perm_denied' })

      if (!navigator.geolocation) return setState({ kind: 'ready', distanceKm: null })
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const km = haversine(home!.lat, home!.lng, pos.coords.latitude, pos.coords.longitude)
          setState({ kind: 'ready', distanceKm: km })
        },
        () => setState({ kind: 'ready', distanceKm: null }),
        { enableHighAccuracy: false, maximumAge: 60000, timeout: 10000 },
      )
    })()
  }, [])

  async function requestPerm() {
    const result = await Notification.requestPermission()
    if (result === 'granted') setState({ kind: 'ready', distanceKm: null })
    else if (result === 'denied') setState({ kind: 'perm_denied' })
  }

  function testNotify() {
    if (Notification.permission !== 'granted') return
    const body = 'Test reminder — this is how shopping alerts look.'
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) =>
        reg.showNotification('Shopping Reminder', { body, icon: '/icons/icon-192x192.png' }),
      )
    } else {
      new Notification('Shopping Reminder', { body })
    }
  }

  if (state.kind === 'loading') return null

  const base = 'flex items-center gap-2 rounded-xl px-3 py-2 text-xs'

  if (state.kind === 'no_home') {
    return (
      <div className={`${base} bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 mb-3`}>
        <MapPin className="w-4 h-4 flex-shrink-0" />
        <span>
          Home location not set.{' '}
          <a href="/settings" className="underline font-semibold">
            Add it in Profile
          </a>{' '}
          to get shopping reminders when 2km away.
        </span>
      </div>
    )
  }
  if (state.kind === 'perm_default') {
    return (
      <div className={`${base} bg-primary/10 text-primary mb-3 justify-between gap-3`}>
        <div className="flex items-center gap-2 min-w-0">
          <Bell className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">Enable notifications to get reminders away from home.</span>
        </div>
        <button onClick={requestPerm} className="font-semibold underline flex-shrink-0">
          Enable
        </button>
      </div>
    )
  }
  if (state.kind === 'perm_denied') {
    return (
      <div className={`${base} bg-red-500/10 text-red-700 dark:text-red-400 mb-3`}>
        <BellOff className="w-4 h-4 flex-shrink-0" />
        <span>Notifications blocked. Enable in browser site settings to get reminders.</span>
      </div>
    )
  }
  if (state.kind === 'no_geo') {
    return (
      <div className={`${base} bg-muted text-muted-foreground mb-3`}>
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>Notifications not supported on this device.</span>
      </div>
    )
  }
  // ready
  const km = state.distanceKm
  const away = km != null && km >= 2
  return (
    <div className={`${base} bg-green-500/10 text-green-700 dark:text-green-400 mb-3 justify-between gap-3`}>
      <div className="flex items-center gap-2 min-w-0">
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">
          Reminders on.{' '}
          {km == null ? 'Detecting location…' : `You're ${km.toFixed(1)}km from home${away ? ' — eligible for alerts' : ''}.`}
        </span>
      </div>
      <button onClick={testNotify} className="font-semibold underline flex-shrink-0">
        Test
      </button>
    </div>
  )
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

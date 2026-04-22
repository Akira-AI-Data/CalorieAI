'use client';

import { useEffect, useRef, useCallback } from 'react';

const SETTINGS_KEY = 'posha_settings';
const SHOPPING_KEY = 'posha_shopping';
const REMINDER_COOLDOWN_KEY = 'posha_shopping_reminder_last';
const MIN_DISTANCE_KM = 2;
const COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes between reminders

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getHomeLocation(): { lat: number; lng: number } | null {
  try {
    const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    const lat = parseFloat(settings?.personalInfo?.latitude);
    const lng = parseFloat(settings?.personalInfo?.longitude);
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

async function getHomeLocationFromApi(): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) return null;
    const d = await res.json();
    const lat = d.profile?.latitude;
    const lng = d.profile?.longitude;
    if (lat == null || lng == null) return null;
    return { lat: Number(lat), lng: Number(lng) };
  } catch {
    return null;
  }
}

function getUncheckedShoppingCount(): number {
  try {
    const items = JSON.parse(localStorage.getItem(SHOPPING_KEY) || '[]');
    return items.filter((i: { checked?: boolean }) => !i.checked).length;
  } catch {
    return 0;
  }
}

function isInCooldown(): boolean {
  try {
    const last = parseInt(localStorage.getItem(REMINDER_COOLDOWN_KEY) || '0', 10);
    return Date.now() - last < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markReminderSent() {
  localStorage.setItem(REMINDER_COOLDOWN_KEY, Date.now().toString());
}

export function useShoppingReminder() {
  const watchId = useRef<number | null>(null);
  const hasNotified = useRef(false);
  const homeRef = useRef<{ lat: number; lng: number } | null>(null);

  const showNotification = useCallback((count: number) => {
    if (hasNotified.current) return;
    hasNotified.current = true;
    markReminderSent();

    // Try browser Notification API (prefer service worker for mobile PWA)
    if ('Notification' in window && Notification.permission === 'granted') {
      const body = `You have ${count} item${count > 1 ? 's' : ''} on your shopping list. You're away from home — good time to shop!`;
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
          .then((reg) =>
            reg.showNotification('Shopping Reminder', {
              body,
              icon: '/icons/icon-192x192.png',
              badge: '/icons/icon-96x96.png',
              tag: 'shopping-reminder',
              data: { url: '/shopping' },
            }),
          )
          .catch(() => {
            new Notification('Shopping Reminder', { body, icon: '/favicon.png' });
          });
      } else {
        new Notification('Shopping Reminder', { body, icon: '/favicon.png' });
      }
    }

    // Also dispatch a custom event that any component can listen to
    window.dispatchEvent(
      new CustomEvent('posha-shopping-reminder', {
        detail: { count },
      })
    );
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    let cancelled = false;

    // Resolve home from localStorage first, then Supabase via /api/profile
    (async () => {
      homeRef.current = getHomeLocation();
      if (!homeRef.current) {
        const api = await getHomeLocationFromApi();
        if (!cancelled && api) homeRef.current = api;
      }
    })();

    const checkPosition = (pos: GeolocationPosition) => {
      if (!homeRef.current) return;
      const distance = haversineKm(
        homeRef.current.lat,
        homeRef.current.lng,
        pos.coords.latitude,
        pos.coords.longitude,
      );

      if (distance >= MIN_DISTANCE_KM) {
        const unchecked = getUncheckedShoppingCount();
        if (unchecked > 0 && !isInCooldown()) {
          showNotification(unchecked);
        }
      } else {
        hasNotified.current = false;
      }
    };

    // Watch position continuously while app is open
    watchId.current = navigator.geolocation.watchPosition(
      checkPosition,
      () => {},
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 10000 },
    );

    // Also re-check on tab visibility (PWA resume from background)
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      navigator.geolocation.getCurrentPosition(
        checkPosition,
        () => {},
        { enableHighAccuracy: false, maximumAge: 60000, timeout: 10000 },
      );
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [showNotification]);
}

import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface AnalyticsEvent {
  id?: string;
  visitorId: string;
  sessionId: string;
  page: string;
  action?: string;
  category?: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  referrer: string;
  timestamp: string;
  screenSize: string;
}

export interface AnalyticsSummary {
  totalPageviews: number;
  uniqueVisitors: number;
  mobileCount: number;
  desktopCount: number;
  tabletCount: number;
  pageViews: Record<string, number>;
  events: Record<string, number>;
  recentEvents: AnalyticsEvent[];
  todayPageviews: number;
}

const COOKIE_UID_KEY = 'badeend_uid';
const COOKIE_SID_KEY = 'badeend_sid';
const COOKIE_CONSENT_KEY = 'badeend_consent';
const LOCAL_EVENTS_KEY = 'badeend_local_analytics_v1';

// Cookie helper functions
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=Lax`;
}

export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}

// Generate random UUID
function generateId(): string {
  return 'v_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
}

// Get or initialize persistent visitor cookie
export function getOrCreateVisitorId(): string {
  let uid = getCookie(COOKIE_UID_KEY);
  if (!uid) {
    try {
      uid = localStorage.getItem(COOKIE_UID_KEY);
    } catch {
      // ignore
    }
  }

  if (!uid) {
    uid = generateId();
    setCookie(COOKIE_UID_KEY, uid, 365);
    try {
      localStorage.setItem(COOKIE_UID_KEY, uid);
    } catch {
      // ignore
    }
  } else {
    // Refresh cookie expiration
    setCookie(COOKIE_UID_KEY, uid, 365);
  }
  return uid;
}

// Get or initialize session cookie (expires in 30 minutes)
export function getOrCreateSessionId(): string {
  let sid = getCookie(COOKIE_SID_KEY);
  if (!sid) {
    sid = 's_' + Math.random().toString(36).substring(2, 9);
  }
  // Reset 30 min sliding window
  const date = new Date();
  date.setTime(date.getTime() + 30 * 60 * 1000);
  if (typeof document !== 'undefined') {
    document.cookie = `${COOKIE_SID_KEY}=${encodeURIComponent(sid)};expires=${date.toUTCString()};path=/;SameSite=Lax`;
  }
  return sid;
}

export function getCookieConsent(): 'accepted' | 'essential' | null {
  const c = getCookie(COOKIE_CONSENT_KEY);
  if (c === 'accepted' || c === 'essential') return c;
  try {
    const l = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (l === 'accepted' || l === 'essential') return l;
  } catch {
    // ignore
  }
  return null;
}

export function setCookieConsent(type: 'accepted' | 'essential') {
  setCookie(COOKIE_CONSENT_KEY, type, 365);
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, type);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent('badeend_consent_change', { detail: type }));
}

function detectDevice(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua
    ) ||
    window.innerWidth <= 768
  ) {
    return 'mobile';
  }
  return 'desktop';
}

function detectBrowser(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Internet';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Edge') || ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Browser';
}

// Track pageview
export async function trackPageView(pageName: string) {
  if (typeof window === 'undefined') return;

  const visitorId = getOrCreateVisitorId();
  const sessionId = getOrCreateSessionId();
  const device = detectDevice();
  const browser = detectBrowser();
  const referrer = document.referrer ? new URL(document.referrer, window.location.href).hostname : 'Direct';
  const timestamp = new Date().toISOString();
  const screenSize = `${window.innerWidth}x${window.innerHeight}`;

  const eventData: AnalyticsEvent = {
    visitorId,
    sessionId,
    page: pageName,
    device,
    browser,
    referrer,
    timestamp,
    screenSize,
  };

  // 1. Store in local cache for offline/instant analytics
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    events.unshift(eventData);
    if (events.length > 200) events.pop();
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
  } catch {
    // ignore
  }

  // 2. Sync to Firestore
  try {
    const eventsCollection = collection(db, 'analytics_events');
    await addDoc(eventsCollection, eventData);
  } catch {
    // Silently continue if Firestore write is blocked or offline
  }

  // 3. Optional Google Analytics 4 integration
  if (typeof (window as unknown as { gtag: (...args: unknown[]) => void }).gtag === 'function') {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: '/' + pageName,
    });
  }
}

// Track custom user interactions
export async function trackInteraction(action: string, category: string = 'engagement', label?: string) {
  if (typeof window === 'undefined') return;

  const visitorId = getOrCreateVisitorId();
  const sessionId = getOrCreateSessionId();
  const device = detectDevice();
  const browser = detectBrowser();
  const timestamp = new Date().toISOString();

  const eventData: AnalyticsEvent = {
    visitorId,
    sessionId,
    page: window.location.pathname || 'app',
    action,
    category,
    device,
    browser,
    referrer: label || '',
    timestamp,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
  };

  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    events.unshift(eventData);
    if (events.length > 200) events.pop();
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
  } catch {
    // ignore
  }

  try {
    const eventsCollection = collection(db, 'analytics_events');
    await addDoc(eventsCollection, eventData);
  } catch {
    // ignore
  }

  if (typeof (window as unknown as { gtag: (...args: unknown[]) => void }).gtag === 'function') {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
}

// Load and aggregate analytics metrics for the Admin Dashboard
export function initGoogleAnalytics() {
  if (typeof window === 'undefined') return;
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!gaId || document.getElementById('ga-gtag-script')) return;

  const script = document.createElement('script');
  script.id = 'ga-gtag-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  const inlineScript = document.createElement('script');
  inlineScript.id = 'ga-gtag-init';
  inlineScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}', { anonymize_ip: true });
  `;
  document.head.appendChild(inlineScript);
}

export async function getAnalyticsStats(): Promise<AnalyticsSummary> {
  let allEvents: AnalyticsEvent[] = [];

  // Attempt to fetch live events from Firestore
  try {
    const eventsCollection = collection(db, 'analytics_events');
    const q = query(eventsCollection, orderBy('timestamp', 'desc'), limit(500));
    const snap = await getDocs(q);

    snap.forEach((doc) => {
      allEvents.push({ id: doc.id, ...(doc.data() as Omit<AnalyticsEvent, 'id'>) });
    });
  } catch {
    // Fallback to local storage if offline or permissions restricted
    try {
      const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
      if (raw) allEvents = JSON.parse(raw);
    } catch {
      allEvents = [];
    }
  }

  if (allEvents.length === 0) {
    try {
      const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
      if (raw) allEvents = JSON.parse(raw);
    } catch {
      // ignore
    }
  }

  const visitors = new Set<string>();
  const pageViews: Record<string, number> = {};
  const events: Record<string, number> = {};
  let mobileCount = 0;
  let desktopCount = 0;
  let tabletCount = 0;
  let todayPageviews = 0;

  const todayStr = new Date().toISOString().slice(0, 10);

  allEvents.forEach((ev) => {
    if (ev.visitorId) visitors.add(ev.visitorId);

    if (ev.action) {
      events[ev.action] = (events[ev.action] || 0) + 1;
    } else if (ev.page) {
      pageViews[ev.page] = (pageViews[ev.page] || 0) + 1;
    }

    if (ev.device === 'mobile') mobileCount++;
    else if (ev.device === 'tablet') tabletCount++;
    else desktopCount++;

    if (ev.timestamp && ev.timestamp.startsWith(todayStr)) {
      todayPageviews++;
    }
  });

  return {
    totalPageviews: allEvents.filter((e) => !e.action).length || allEvents.length,
    uniqueVisitors: Math.max(visitors.size, 1),
    mobileCount,
    desktopCount,
    tabletCount,
    pageViews,
    events,
    recentEvents: allEvents.slice(0, 25),
    todayPageviews,
  };
}

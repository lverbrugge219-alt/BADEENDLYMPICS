import { collection, addDoc, getDocs, query, orderBy, limit, writeBatch, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface TrafficOriginInfo {
  category: 'direct' | 'search' | 'social' | 'external' | 'campaign';
  sourceName: string;
  hostname?: string;
  fullReferrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  landingPage?: string;
}

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
  origin?: TrafficOriginInfo;
}

export interface SessionVisitStep {
  page: string;
  timestamp: string;
  timeSpentSeconds?: number;
  action?: string;
  index: number;
}

export interface SessionDetail {
  sessionId: string;
  visitorId: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  screenSize: string;
  origin: TrafficOriginInfo;
  landingPage: string;
  exitPage: string;
  pageCount: number;
  uniquePagesCount: number;
  steps: SessionVisitStep[];
}

export interface AnalyticsSummary {
  totalPageviews: number;
  uniqueVisitors: number;
  totalSessions: number;
  mobileCount: number;
  desktopCount: number;
  tabletCount: number;
  pageViews: Record<string, number>;
  events: Record<string, number>;
  recentEvents: AnalyticsEvent[];
  todayPageviews: number;
  sessions: SessionDetail[];
  trafficSources: Record<string, number>;
  trafficCategories: {
    direct: number;
    search: number;
    social: number;
    external: number;
    campaign: number;
  };
  avgSessionDuration: number;
  avgPagesPerSession: number;
}

const COOKIE_UID_KEY = 'badeend_uid';
const COOKIE_SID_KEY = 'badeend_sid';
const COOKIE_CONSENT_KEY = 'badeend_consent';
const LOCAL_EVENTS_KEY = 'badeend_local_analytics_v1';
const SESSION_ORIGIN_STORAGE_KEY = 'badeend_session_origin_v1';

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
  // Also try clearing without sameSite or with domain variations
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
}

/**
 * Wipes all cookies and local identification data from the user's browser.
 */
export function clearAllUserCookiesAndStorage(): { cookiesDeleted: number; localStorageCleared: boolean } {
  let cookiesDeleted = 0;
  if (typeof document !== 'undefined') {
    const knownCookies = [
      COOKIE_UID_KEY,
      COOKIE_SID_KEY,
      COOKIE_CONSENT_KEY,
      '_ga',
      '_gid',
      '_gat',
    ];

    // Find all cookies in document.cookie
    const cookieList = document.cookie.split(';');
    for (const c of cookieList) {
      const name = c.split('=')[0]?.trim();
      if (name) {
        deleteCookie(name);
        cookiesDeleted++;
      }
    }

    knownCookies.forEach((name) => deleteCookie(name));
  }

  let localStorageCleared = false;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(COOKIE_UID_KEY);
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      localStorage.removeItem(LOCAL_EVENTS_KEY);
      sessionStorage.removeItem(SESSION_ORIGIN_STORAGE_KEY);
      localStorageCleared = true;
    } catch {
      // ignore
    }
    // Notify listeners
    window.dispatchEvent(new Event('badeend_consent_change'));
  }

  return { cookiesDeleted, localStorageCleared };
}

/**
 * Admin action: Purges all stored analytics data from Firestore and local device storage.
 */
export async function clearAllDatabaseAnalytics(): Promise<{ deletedCount: number }> {
  let deletedCount = 0;

  // 1. Clear Firestore analytics_events collection in batches of up to 500
  try {
    const eventsCollection = collection(db, 'analytics_events');
    const snap = await getDocs(eventsCollection);

    if (!snap.empty) {
      const docs = snap.docs;
      const batchSize = 400;
      for (let i = 0; i < docs.length; i += batchSize) {
        const batch = writeBatch(db);
        const chunk = docs.slice(i, i + batchSize);
        chunk.forEach((d) => {
          batch.delete(d.ref);
          deletedCount++;
        });
        await batch.commit();
      }
    }
  } catch (err) {
    console.error('Fout bij het leegmaken van Firestore analytics:', err);
  }

  // 2. Clear local events storage
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(LOCAL_EVENTS_KEY);
    } catch {
      // ignore
    }
  }

  return { deletedCount };
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
    sid = 's_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36).slice(-4);
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

/**
 * Parses where the user came from (Traffic Origin & Referrer).
 * Persists entry origin in sessionStorage so it stays attached to the session during SPA navigation.
 */
export function getOrDetectTrafficOrigin(currentLandingPage: string): TrafficOriginInfo {
  if (typeof window === 'undefined') {
    return { category: 'direct', sourceName: 'Direct verkeer' };
  }

  // Check if we already have the session origin stored
  try {
    const existingRaw = sessionStorage.getItem(SESSION_ORIGIN_STORAGE_KEY);
    if (existingRaw) {
      const parsed: TrafficOriginInfo = JSON.parse(existingRaw);
      return parsed;
    }
  } catch {
    // ignore
  }

  // Parse URL search parameters for campaigns / referrers
  let urlParams: URLSearchParams | null = null;
  try {
    urlParams = new URLSearchParams(window.location.search);
  } catch {
    urlParams = null;
  }

  const utmSource = urlParams?.get('utm_source') || undefined;
  const utmMedium = urlParams?.get('utm_medium') || undefined;
  const utmCampaign = urlParams?.get('utm_campaign') || undefined;
  const customRef = urlParams?.get('ref') || urlParams?.get('source') || undefined;

  let origin: TrafficOriginInfo;

  // 1. Campaign / UTM check
  if (utmSource || customRef) {
    const src = (utmSource || customRef || 'Campagne').trim();
    origin = {
      category: 'campaign',
      sourceName: `Campagne: ${src}`,
      utmSource,
      utmMedium,
      utmCampaign,
      landingPage: currentLandingPage,
    };
  } else if (document.referrer) {
    try {
      const refUrl = new URL(document.referrer, window.location.href);
      const host = refUrl.hostname.toLowerCase();

      if (host === window.location.hostname.toLowerCase()) {
        // Internal page reload/nav
        origin = {
          category: 'direct',
          sourceName: 'Direct verkeer',
          landingPage: currentLandingPage,
        };
      } else if (host.includes('google.')) {
        origin = {
          category: 'search',
          sourceName: 'Google Zoeken',
          hostname: host,
          fullReferrer: document.referrer,
          landingPage: currentLandingPage,
        };
      } else if (host.includes('bing.') || host.includes('duckduckgo.') || host.includes('ecosia.')) {
        origin = {
          category: 'search',
          sourceName: 'Zoekmachine (' + host.replace('www.', '') + ')',
          hostname: host,
          fullReferrer: document.referrer,
          landingPage: currentLandingPage,
        };
      } else if (host.includes('whatsapp') || host.includes('wa.me')) {
        origin = {
          category: 'social',
          sourceName: 'WhatsApp Link',
          hostname: host,
          fullReferrer: document.referrer,
          landingPage: currentLandingPage,
        };
      } else if (host.includes('instagram.') || host.includes('l.instagram.')) {
        origin = {
          category: 'social',
          sourceName: 'Instagram',
          hostname: host,
          fullReferrer: document.referrer,
          landingPage: currentLandingPage,
        };
      } else if (host.includes('facebook.') || host.includes('fb.me') || host.includes('m.facebook.')) {
        origin = {
          category: 'social',
          sourceName: 'Facebook',
          hostname: host,
          fullReferrer: document.referrer,
          landingPage: currentLandingPage,
        };
      } else if (host.includes('scoutingpapendrecht.nl') || host.includes('scouting.nl') || host.includes('batenstein')) {
        origin = {
          category: 'external',
          sourceName: 'Scouting van Brederode Website',
          hostname: host,
          fullReferrer: document.referrer,
          landingPage: currentLandingPage,
        };
      } else {
        origin = {
          category: 'external',
          sourceName: `Verwijzing via ${host.replace('www.', '')}`,
          hostname: host,
          fullReferrer: document.referrer,
          landingPage: currentLandingPage,
        };
      }
    } catch {
      origin = {
        category: 'direct',
        sourceName: 'Direct verkeer',
        landingPage: currentLandingPage,
      };
    }
  } else {
    origin = {
      category: 'direct',
      sourceName: 'Direct verkeer (URL / Bladwijzer)',
      landingPage: currentLandingPage,
    };
  }

  try {
    sessionStorage.setItem(SESSION_ORIGIN_STORAGE_KEY, JSON.stringify(origin));
  } catch {
    // ignore
  }

  return origin;
}

// Track pageview
export async function trackPageView(pageName: string) {
  if (typeof window === 'undefined') return;

  const visitorId = getOrCreateVisitorId();
  const sessionId = getOrCreateSessionId();
  const device = detectDevice();
  const browser = detectBrowser();
  const origin = getOrDetectTrafficOrigin(pageName);
  const referrer = origin.sourceName;
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
    origin,
  };

  // 1. Store in local cache for offline/instant analytics
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    events.unshift(eventData);
    if (events.length > 500) events.pop();
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
  const origin = getOrDetectTrafficOrigin(window.location.pathname || 'app');
  const timestamp = new Date().toISOString();

  const eventData: AnalyticsEvent = {
    visitorId,
    sessionId,
    page: window.location.pathname || 'app',
    action,
    category,
    device,
    browser,
    referrer: label || origin.sourceName,
    timestamp,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    origin,
  };

  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    events.unshift(eventData);
    if (events.length > 500) events.pop();
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

export const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-W8TP37FQFP').trim();

export function initGoogleAnalytics() {
  if (typeof window === 'undefined') return;
  const gaId = GA_MEASUREMENT_ID;
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

/**
 * Aggregates all recorded analytics events into rich statistics,
 * grouping events into chronological sessions and analyzing traffic origin sources.
 */
export async function getAnalyticsStats(): Promise<AnalyticsSummary> {
  let allEvents: AnalyticsEvent[] = [];

  // Attempt to fetch live events from Firestore
  try {
    const eventsCollection = collection(db, 'analytics_events');
    const q = query(eventsCollection, orderBy('timestamp', 'desc'), limit(1000));
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

  // Merge with local storage if Firestore had fewer events
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    if (raw) {
      const localList: AnalyticsEvent[] = JSON.parse(raw);
      const existingIds = new Set(allEvents.map((e) => e.timestamp + '_' + e.sessionId + '_' + e.page));
      localList.forEach((le) => {
        const key = le.timestamp + '_' + le.sessionId + '_' + le.page;
        if (!existingIds.has(key)) {
          allEvents.push(le);
        }
      });
    }
  } catch {
    // ignore
  }

  const visitors = new Set<string>();
  const pageViews: Record<string, number> = {};
  const events: Record<string, number> = {};
  const trafficSources: Record<string, number> = {};
  const trafficCategories = {
    direct: 0,
    search: 0,
    social: 0,
    external: 0,
    campaign: 0,
  };

  let mobileCount = 0;
  let desktopCount = 0;
  let tabletCount = 0;
  let todayPageviews = 0;

  const todayStr = new Date().toISOString().slice(0, 10);

  // Group events by sessionId
  const sessionMap = new Map<string, AnalyticsEvent[]>();

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

    const sid = ev.sessionId || `session_${ev.visitorId}_${ev.timestamp?.slice(0, 10)}`;
    if (!sessionMap.has(sid)) {
      sessionMap.set(sid, []);
    }
    sessionMap.get(sid)!.push(ev);
  });

  // Construct structured SessionDetail list
  const sessions: SessionDetail[] = [];
  let totalDurationSum = 0;
  let totalPagesSum = 0;

  sessionMap.forEach((sessionEvents, sId) => {
    // Sort chronological: oldest to newest
    sessionEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const firstEvent = sessionEvents[0];
    const lastEvent = sessionEvents[sessionEvents.length - 1];

    const startTime = firstEvent.timestamp;
    const endTime = lastEvent.timestamp;
    const startMs = new Date(startTime).getTime();
    const endMs = new Date(endTime).getTime();
    const durationSeconds = Math.max(0, Math.round((endMs - startMs) / 1000));

    // Determine traffic origin info
    const origin: TrafficOriginInfo = firstEvent.origin || {
      category: 'direct',
      sourceName: firstEvent.referrer || 'Direct verkeer',
      landingPage: firstEvent.page,
    };

    // Tally traffic sources per session
    const srcName = origin.sourceName || 'Direct verkeer';
    trafficSources[srcName] = (trafficSources[srcName] || 0) + 1;

    const cat = origin.category || 'direct';
    if (cat in trafficCategories) {
      trafficCategories[cat]++;
    } else {
      trafficCategories.direct++;
    }

    const steps: SessionVisitStep[] = sessionEvents.map((ev, idx) => {
      let timeSpentSeconds: number | undefined = undefined;
      if (idx < sessionEvents.length - 1) {
        const nextTime = new Date(sessionEvents[idx + 1].timestamp).getTime();
        const curTime = new Date(ev.timestamp).getTime();
        timeSpentSeconds = Math.max(0, Math.round((nextTime - curTime) / 1000));
      }
      return {
        page: ev.page,
        timestamp: ev.timestamp,
        timeSpentSeconds,
        action: ev.action,
        index: idx + 1,
      };
    });

    const uniquePages = new Set(sessionEvents.map((e) => e.page)).size;
    const pageCount = sessionEvents.length;

    totalDurationSum += durationSeconds;
    totalPagesSum += pageCount;

    sessions.push({
      sessionId: sId,
      visitorId: firstEvent.visitorId,
      startTime,
      endTime,
      durationSeconds,
      device: firstEvent.device || 'desktop',
      browser: firstEvent.browser || 'Browser',
      screenSize: firstEvent.screenSize || '-',
      origin,
      landingPage: firstEvent.page,
      exitPage: lastEvent.page,
      pageCount,
      uniquePagesCount: uniquePages,
      steps,
    });
  });

  // Sort sessions newest first
  sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const totalSessions = sessions.length || Math.max(visitors.size, 1);
  const avgSessionDuration = totalSessions > 0 ? Math.round(totalDurationSum / totalSessions) : 0;
  const avgPagesPerSession = totalSessions > 0 ? Number((totalPagesSum / totalSessions).toFixed(1)) : 1;

  return {
    totalPageviews: allEvents.filter((e) => !e.action).length || allEvents.length,
    uniqueVisitors: Math.max(visitors.size, 1),
    totalSessions,
    mobileCount,
    desktopCount,
    tabletCount,
    pageViews,
    events,
    recentEvents: allEvents.slice(0, 50),
    todayPageviews,
    sessions,
    trafficSources,
    trafficCategories,
    avgSessionDuration,
    avgPagesPerSession,
  };
}


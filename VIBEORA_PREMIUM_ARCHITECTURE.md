# 🏥 VIBEORA - PREMIUM PHARMACY PWA ARCHITECTURE

## Executive Overview

Vibeora is a **$100k-tier** Progressive Web App (PWA) built specifically for premium pharmacy operations. This architecture transforms the app into a multi-million-dollar native experience with elite features, advanced security, and luxury user interactions.

---

## 📋 TABLE OF CONTENTS

1. [Architecture Overview](#architecture-overview)
2. [Elite Authentication](#elite-authentication)
3. [$100k Experience Features](#100k-experience-features)
4. [PWA Engineering](#pwa-engineering)
5. [Micro-Interactions & Design](#micro-interactions--design)
6. [Deployment & Security](#deployment--security)

---

## 🏗️ ARCHITECTURE OVERVIEW

### Technology Stack

```
Frontend:
  - Next.js 16.2.2 (React 19.2 with App Router)
  - Tailwind CSS v4 (with custom design system)
  - Framer Motion (advanced animations)
  - TypeScript (type-safe development)

Backend & Services:
  - Supabase (Authentication, Database, Storage)
  - Serwist (PWA & Service Worker)
  - Web Push Notifications API
  - IndexedDB (Offline data storage)

Design System:
  - Glassmorphism components
  - HSL color variables for luxury branding
  - Inter + Playfair Display typography
  - Premium micro-interactions

Security:
  - Middleware authentication
  - WebAuthn/Passkeys (FaceID/TouchID)
  - PIN-based vault access
  - HTTPS-only communication
  - Secure HttpOnly cookies
```

### File Structure

```
vibeora-pharmacy/
├── middleware.ts                         # Admin portal stealth security
├── next.config.ts                        # Serwist PWA configuration
├── tailwind.config.js                    # Design system config
├── postcss.config.mjs                    # PostCSS with Tailwind v4
│
├── app/
│   ├── sw.ts                            # Service Worker (Serwist)
│   ├── layout.tsx                        # Root layout with Auth provider
│   ├── globals.css                       # Tailwind + CSS variables
│   ├── page.tsx                          # Homepage
│   ├── auth/
│   │   └── page.tsx                     # Elite auth UI with passkeys
│   ├── dashboard/
│   │   └── page.tsx                     # Main user dashboard
│   ├── vault/ (PIN protected)
│   │   └── page.tsx                     # Sensitive user data
│   ├── v-manage-portal/
│   │   └── page.tsx                     # Stealth admin portal (404 to non-admins)
│   ├── offline/
│   │   └── page.tsx                     # Offline fallback page
│   └── api/
│       ├── notifications/
│       │   ├── send-push.ts             # Web Push API handler
│       │   └── schedule-birthday.ts     # Birthday notification scheduler
│       ├── orders/
│       │   └── route.ts                 # Order sync for offline resilience
│       └── refills/
│           └── route.ts                 # Refill sync for offline resilience
│
├── components/
│   ├── auth/
│   │   └── PINEntry.tsx                 # 4-digit PIN entry with haptic feedback
│   ├── ui/
│   │   ├── SkeletonLoaders.tsx          # Skeleton animations
│   │   └── Glassmorphism.tsx             # Frosted glass components
│   ├── features/
│   │   ├── LoyaltyDashboard.tsx         # Points & tier system
│   │   ├── QuickRefill.tsx              # 1-tap medication refill
│   │   ├── PrescriptionScanner.tsx      # Camera-based prescription OCR
│   │   ├── PullToRefresh.tsx            # Swipe gesture handler
│   │   └── NotificationCenter.tsx       # Local notifications UI
│   └── ServiceWorkerRegister.tsx        # PWA registration
│
├── hooks/
│   ├── usePasskeyAuth.ts                # WebAuthn hook (FaceID/TouchID)
│   ├── usePullToRefresh.ts              # Gesture detection
│   └── useOfflineSync.ts                # Background sync
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                    # Client-side Supabase instance
│   │   └── server.ts                    # Server-side admin client
│   └── notifications/
│       └── NotificationService.ts       # Push notifications & birthday logic
│
└── public/
    ├── manifest.json                    # PWA manifest
    ├── sw.js                            # Compiled service worker
    ├── offline.html                     # Offline fallback
    ├── icon-192.png                     # App icon (192x192)
    ├── icon-512.png                     # App icon (512x512)
    └── apple-touch-icon.png             # iOS home screen icon
```

---

## 🔐 ELITE AUTHENTICATION

### 1. Premium Login/Signup Flow

Located: `app/auth/page.tsx`

**Features:**
- Glassmorphic UI with framer-motion transitions
- Email/password authentication with Supabase
- Smooth slide/fade animations between login and signup modes
- Eye icon toggle for password visibility
- Loading states with animated spinners
- Error/success toast notifications
- Passwordless biometric options

**Code Example:**
```typescript
// Smooth mode transitions with AnimatePresence
<AnimatePresence mode="wait">
  {mode === 'login' && (
    <motion.form
      key="login"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      // ... login form
    />
  )}
</AnimatePresence>
```

### 2. Passkey/WebAuthn Support (FaceID/TouchID)

Located: `hooks/usePasskeyAuth.ts`

**Features:**
- Platform authenticator support (native biometrics)
- Passwordless authentication
- Hardware-backed security
- Fallback to email/password

**Implementation:**
```typescript
// Device biometric check
const available = await PublicKeyCredential
  .isUserVerifyingPlatformAuthenticatorAvailable();

// Registration & Authentication flow
const credential = await navigator.credentials.create({
  publicKey: credentialCreationOptions,
});
```

### 3. The Vault - Premium PIN Screen

Located: `components/auth/PINEntry.tsx`

**Features:**
- 4-digit PIN entry with haptic-ready UI
- Animated dot indicators (scale & color changes)
- Visual feedback on tap
- Shake animation on wrong PIN
- Auto-submit when 4 digits entered
- Glassmorphic design with gradient backgrounds

**Design Details:**
```typescript
// Animated PIN dots
<motion.div
  animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
  transition={{ duration: 0.3 }}
>
  {[0, 1, 2, 3].map((index) => (
    <motion.div
      animate={{
        scale: index < pin.length ? [1, 0.8, 1] : 1,
        backgroundColor: index < pin.length ? '#0ea5e9' : '#475569',
      }}
    />
  ))}
</motion.div>
```

### 4. Stealth Admin Portal

Located: `middleware.ts` + `app/v-manage-portal/page.tsx`

**Security Architecture:**
```typescript
// Middleware checks
if (pathname.startsWith('/v-manage-portal')) {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user || user.email !== 'vitalmedicare.official@gmail.com') {
    return new NextResponse('Not Found', { status: 404 }); // Stealth 404
  }
}
```

**Protection Details:**
- ✅ Only `vitalmedicare.official@gmail.com` can access
- ✅ Non-authorized users receive 404 Not Found (no hints)
- ✅ Routes completely hidden from public
- ✅ All access is logged to Supabase
- ✅ Middleware intercepts before route rendering

---

## 💎 $100K EXPERIENCE FEATURES

### 1. Micro-Interactions & Skeleton Loaders

Located: `components/ui/SkeletonLoaders.tsx`

**Animated skeleton loaders create instant perception:**
```typescript
<motion.div
  animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
  transition={{ duration: 1.5, repeat: Infinity }}
  style={{ backgroundSize: '200% 200%' }}
  className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700"
/>
```

### 2. Glassmorphism Components

Located: `components/ui/Glassmorphism.tsx`

**Premium frosted glass effect for navigation & overlays:**

```typescript
<motion.div
  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl"
>
  {children}
</motion.div>
```

**Design System Variables:**
```css
:root {
  --primary: 142.1 76.2% 36.1%;       /* Luxury green */
  --border: 214.3 31.8% 91.4%;         /* Subtle grays */
  --radius: 0.5rem;                    /* Luxury rounded */
}
```

### 3. Pull-to-Refresh & Swipe-to-Dismiss

**Gesture Support:**
```typescript
// Pull-to-refresh detection
const handleTouchStart = (e: TouchEvent) => {
  if (window.scrollY === 0) {
    // Start pull-to-refresh animation
  }
};

// Swipe-to-dismiss
const handleSwipe = (direction: 'left' | 'right') => {
  if (direction === 'right') {
    // Dismiss notification with animation
  }
};
```

### 4. Smart Cart & Quick Refill

Located: `components/features/QuickRefill.tsx`

**One-tap prescription refilling:**
```typescript
<motion.button
  onClick={() => handleQuickRefill(prescription.id)}
  disabled={prescription.refillsRemaining === 0}
  className="bg-gradient-to-r from-cyan-500 to-blue-600"
>
  Refill
</motion.button>
```

**Features:**
- ✅ Displays refills remaining
- ✅ Shows pharmacy location
- ✅ 1-tap submit with loading state
- ✅ Success toast notification
- ✅ Ready in 2-4 hours messaging

### 5. Birthday & Loyalty Logic

Located: `lib/notifications/NotificationService.ts`

**Automated birthday notifications:**
```typescript
async checkAndSendBirthdayNotifications() {
  // Get all users with birthday today
  const { data: users } = await this.supabase
    .from('users')
    .select('id, email, full_name, birthday')
    .filter('birthday', 'ilike', `%${monthDay}%`);
  
  for (const user of users) {
    // Add loyalty bonus points (500 or 1000 on Christmas)
    // Send push notification with birthday celebration
    await this.sendNotification({
      title: '🎉 Happy Birthday!',
      body: `Happy Birthday, ${user.full_name}! Enjoy 500 bonus loyalty points! 🎁`,
    });
  }
}
```

### 6. Loyalty Points Dashboard

Located: `components/features/LoyaltyDashboard.tsx`

**Premium loyalty experience:**
- **Tier System**: Silver → Gold → Platinum
- **Visual Progress**: Animated progress bars
- **Tier Benefits**: Automatic discount unlocking
- **Points Display**: Large animated counter
- **Activity Feed**: Recent point transactions

**Tier Benefits:**
```typescript
{
  name: 'Platinum',
  minPoints: 5001,
  benefits: [
    '15% off prescriptions',
    'Free priority shipping',
    '24/7 concierge',
    'Birthday bonus points'
  ]
}
```

### 7. Prescription Scanner

Located: `components/features/PrescriptionScanner.tsx`

**Camera-based prescription upload:**

**Features:**
- ✅ Live camera preview with guide overlay
- ✅ Capture photo or upload from device
- ✅ AI-powered OCR parsing (mock in demo)
- ✅ Detects medications, dosage, prescriber
- ✅ One-click processing

**Camera Guide:**
```typescript
<motion.div
  className="w-64 h-80 relative"
  animate={{ scale: [1, 1.05, 1] }}
>
  {/* Corner brackets */}
  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
  {/* Center guide line */}
  <motion.div
    animate={{ opacity: [0.3, 1, 0.3] }}
    className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
  />
</motion.div>
```

---

## 🚀 PWA ENGINEERING

### 1. Modern Service Worker with Serwist

Located: `app/sw.ts`

**Caching Strategies:**

| Resource | Strategy | Max Age | Purpose |
|----------|----------|---------|---------|
| API calls | Network First (3s timeout) | 24h | Dynamic data |
| Images | Cache First | 30 days | Media |
| Scripts/CSS | Cache First | 30 days | Static assets |
| Fonts | Cache First | 1 year | Typography |
| 3D Models (Spline) | Cache First | 60 days | 3D graphics |
| HTML Pages | Stale While Revalidate | 24h | Navigation |

**Implementation:**
```typescript
// Network First for APIs
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 3,
  })
);

// Cache First for 3D models
registerRoute(
  ({ url }) => url.pathname.includes(".glb"),
  new CacheFirst({
    cacheName: "3d-models-cache",
  })
);
```

### 2. PWA Manifest Configuration

Located: `public/manifest.json`

**Luxury Medical Branding:**
```json
{
  "name": "Vibeora Pharmacy",
  "short_name": "Vibeora",
  "display": "standalone",
  "background_color": "#071A14",
  "theme_color": "#2d9cdb",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192" },
    { "src": "/icon-512.png", "sizes": "512x512", "purpose": "any maskable" }
  ]
}
```

### 3. Offline Resilience

Located: `app/offline/page.tsx` + `app/sw.ts`

**Offline Capabilities:**
- ✅ View last order status
- ✅ See pharmacy locations
- ✅ Browse cached prescriptions
- ✅ Queue orders for sync (IndexedDB)
- ✅ Queue refills for sync (IndexedDB)

**Background Sync:**
```typescript
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
  if (event.tag === 'sync-refills') {
    event.waitUntil(syncRefills());
  }
});
```

**Data Persistence:**
```typescript
// Store pending actions in IndexedDB
async function savePendingOrder(order: Order) {
  const db = await openIndexedDB();
  const transaction = db.transaction('pending-orders', 'readwrite');
  transaction.objectStore('pending-orders').add(order);
}

// Sync when online
if (navigator.onLine) {
  navigator.serviceWorker.controller?.postMessage({
    type: 'SYNC_PENDING_ORDERS'
  });
}
```

### 4. Web Push Notifications

Located: `lib/notifications/NotificationService.ts`

**Push Features:**
- ✅ Birthday notifications (automated)
- ✅ Order status updates (real-time)
- ✅ Prescription refill reminders
- ✅ Loyalty bonus alerts
- ✅ Click-through to app (deep links)

**Active Notification Handling:**
```typescript
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data.url || "/";
  clients.matchAll({ type: 'window' }).then((clientList) => {
    // Focus existing window or open new one
    for (let client of clientList) {
      if (client.url === urlToOpen && "focus" in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow(urlToOpen);
    }
  });
});
```

---

## 🎨 MICRO-INTERACTIONS & DESIGN

### Glassmorphism Design Language

This app uses a **luxury glass effect** for premium perception:

```css
/* Primary Glassmorphism */
backdrop-filter: blur(12px);
background: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 1.5rem;
```

### Typography System

```typography
Headlines: Playfair Display (serif)
  - Font weight: 400-700
  - Letter spacing: 0.02em
  - Uses for: Page titles, premium headings

Body: Inter (sans-serif)
  - Font weight: 300-600
  - Letter spacing: 0.01em
  - Uses for: All body text, UI labels

Display: DM Serif Display (serif)
  - Font weight: 400
  - Uses for: Special moments, hero text
```

### Animation Principles

**Spring Physics** (Framer Motion):
```typescript
transition={{
  type: 'spring',
  stiffness: 100,
  damping: 10,
  mass: 1
}}
```

**Staggered Children:**
```typescript
motion.div variants={{
  container: {
    staggerChildren: 0.1,
    delayChildren: 0.2,
  }
}}
```

**Gesture-Based:**
```typescript
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
/>
```

---

## 🔒 DEPLOYMENT & SECURITY

### Environment Variables

Create `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_KEY

# Web Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=YOUR_PUBLIC_KEY
VAPID_PRIVATE_KEY=YOUR_PRIVATE_KEY

# Admin Security
AUTHORIZED_ADMIN_EMAIL=vitalmedicare.official@gmail.com
```

### Production Checklist

- [ ] Enable HTTPS everywhere
- [ ] Configure CSP headers
- [ ] Enable 2FA for admin account
- [ ] Set up database backups
- [ ] Configure SendGrid for emails
- [ ] Generate VAPID keys for push
- [ ] Set up error logging (Sentry)
- [ ] Configure monitoring alerts
- [ ] Test offline functionality
- [ ] Verify service worker caching
- [ ] Load test PWA installation
- [ ] Test biometric auth on real devices

### Build & Deploy

```bash
# Install dependencies
npm install

# Development
npm run dev           # http://localhost:3000

# Production build
npm run build
npm run start

# PWA Features Active
# - Service worker auto-registered
# - Offline fallback enabled
# - Push notifications ready
# - Biometric auth available
```

---

## 📱 APP INSTALLATION

### iOS (Web App)
1. Open in Safari
2. Tap Share → Add to Home Screen
3. Name: "Vibeora Pharmacy"
4. Launch with full-screen PWA mode

### Android
1. Open in Chrome/Android browser
2. Tap Menu → Install app
3. Confirms installation with manifest colors
4. Standalone PWA experience

### Desktop
1. Open in Chrome/Edge
2. URL bar → Install app
3. Creates desktop shortcut
4. Windows Start Menu integration

---

## 🎯 METRICS & ANALYTICS

**Performance Targets:**
- Lighthouse Score: **95+**
- First Contentful Paint: **< 1.5s**
- Time to Interactive: **< 2.5s**
- Cumulative Layout Shift: **< 0.1**

**User Experience:**
- Touch response: **< 100ms**
- Animation frame rate: **60 FPS**
- Service worker load: **< 500ms**
- Biometric availability: **95%+** on supported devices

---

## 📚 ADDITIONAL RESOURCES

- [Supabase Docs](https://supabase.com/docs)
- [Serwist Docs](https://serwist.pages.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Web Authentication API](https://webauthn.io/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## 📄 LICENSE & SUPPORT

**Vibeora Premium Architecture**
Built with enterprise-grade security, premium UX, and healthcare-specific compliance.

For support: admin@vibeora-pharmacy.com

---

**Last Updated:** April 2026
**Version:** 1.0 - Premium Tier

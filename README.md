# FlashCart — Bangladesh's All-in-One Delivery Platform

A free, cash-on-delivery, all-in-one delivery & e-commerce platform that gives local
Bangladeshi businesses their own SEO-optimized landing page and ordering system at zero cost.

- **Developer:** Rizwan Rahim Chowdhury
- **Powered by:** [Bangladesh Software Development Community](https://www.bsdc.info.bd)

---

## Two applications (separate repos, shared Firebase)

| App | Folder | Target URL | Purpose |
|-----|--------|------------|---------|
| **Customer Portal** | [`flashcart-main/`](./flashcart-main) | https://flashcart.bsdc.info.bd | Browse stores, order with COD |
| **Partner Portal** | [`flashcart-partner/`](./flashcart-partner) | https://partner.flashcart.bsdc.info.bd | Manage store, orders, real-time alerts |

Each folder is an independent Vite + React 18 project. See each folder's `README.md`
for feature lists and deployment steps, and [`FIREBASE_RULES.md`](./FIREBASE_RULES.md)
for the shared security rules and auth setup.

---

## Tech stack (both apps)

- React 18 + Vite + React Router v6
- Firebase (Auth, Firestore, Realtime Database)
- Leaflet + OpenStreetMap + Nominatim (free maps/geocoding, no API key)
- ImgBB for image hosting
- react-helmet-async for SEO (JSON-LD, OG, canonical, hreflang)
- 3-language system (Bangla-English mix / Bangla / English)
- PWA-ready, mobile-first, SVG icons only (no emojis)
- Partner: OneSignal web push + Recharts + full notification stack

---

## The end-to-end order + notification flow

```
Customer (flashcart-main)                 Partner (flashcart-partner)
─────────────────────────                 ───────────────────────────
Place order at /checkout
   │
   ├─► Firestore  orders/{id}             ◄── reads full order history
   │
   ├─► Realtime DB orders/{partnerId}/{id}  ──► live listener fires:
   │     (isNew: true)                          • Web Audio chime
   │                                            • tab-title badge + blink
   │                                            • native system notification
   │                                            • sticky in-app banner
   │
   └─► OneSignal REST push  ───────────────►  background push
                                                (works when app closed /
                                                 phone locked) + service worker
```

When the partner opens the order, `isNew` is cleared and all badges reset.

---

## Build & deploy (no CLI on the device required)

Both apps deploy to **Cloudflare Pages** from GitHub:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- SPA deep-links handled by each app's `public/404.html` (no `_redirects` file).

---

## Status

A strong, **deployable functional core of both apps** is complete and builds cleanly.
Planned next iterations: Cloudflare Pages Function for dynamic `sitemap-stores.xml` +
edge meta injection, admin panel (password-gated), and extra customer features
(favorites, flash deals, refer & earn, loyalty points).

---

© FlashCart Bangladesh. Developed by Rizwan Rahim Chowdhury · Powered by BSDC.

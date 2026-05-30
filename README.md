# FlashCart — Customer Portal (flashcart-main)

Bangladesh's free, cash-on-delivery, all-in-one delivery & e-commerce platform.
This repository is **Application 1 — FlashCart Main (Customer Portal)**.

- **Live URL (target):** https://flashcart.bsdc.info.bd
- **Stack:** React 18 + Vite + React Router v6 + Firebase + Leaflet + react-helmet-async
- **Hosting:** Cloudflare Pages (free)
- **Developer:** Rizwan Rahim Chowdhury
- **Powered by:** [Bangladesh Software Development Community](https://www.bsdc.info.bd)

---

## What's implemented (functional core)

This is a working, deployable foundation. Everything below renders and works:

- **Homepage** — hero + search, 20 category grid (SVG icons), nearby stores
  (geolocation + Haversine), featured stores, popular items, COD banner.
- **Store listing** (`/stores`) — category filter, sort (relevance/rating/distance/popular).
- **Store landing page** (`/store/:slug`) — SEO-critical: LocalBusiness/FoodEstablishment
  JSON-LD, breadcrumb schema, OG/Twitter meta, canonical, Leaflet map with delivery
  radius, menu grouped by category, reviews.
- **Item detail** (`/store/:slug/item/:slug`) — Product JSON-LD, quantity selector,
  add-to-cart, related items.
- **Category page** (`/category/:id`) and **Search** (`/search`) — fuzzy multilingual
  search engine with localStorage history.
- **Cart** — single-store rule, quantity steppers, per-item notes, localStorage persistence.
- **Checkout** — COD only, BD phone validation, geolocation address detect, writes the
  order to Firestore AND mirrors to Realtime DB (so the Partner app gets a live alert).
- **Orders** — history + order detail with status timeline, cancel, rate/review, WhatsApp share.
- **Auth** — Google sign-in, email/password, password reset, email verification, profile
  edit with ImgBB photo upload.
- **Language system** — three modes (default Bangla-English mix / pure Bangla / pure English),
  persisted, updates `<html lang>`.
- **SEO** — `SEOHead` on every page, static `sitemap.xml`, `robots.txt`, meaningful
  `index.html` defaults + `<noscript>` fallback.
- **PWA-ready** — `manifest.json`, SVG favicon, theme color.
- **Cloudflare SPA routing** — `public/404.html` redirect technique (no `_redirects` needed).

> When Firestore has no stores yet, the app automatically falls back to rich demo data
> (`src/utils/demoData.js`) so the UI and SEO always render meaningful content.

---

## Project structure

```
flashcart-main/
├── index.html              # CDN links (fonts, Leaflet), default SEO, Organization JSON-LD
├── vite.config.js          # React plugin + manual code-splitting chunks
├── package.json
├── public/
│   ├── favicon.svg         # SVG favicon (no emojis)
│   ├── manifest.json       # PWA manifest
│   ├── robots.txt
│   ├── sitemap.xml
│   └── 404.html            # Cloudflare Pages SPA routing
└── src/
    ├── main.jsx            # Entry (also fixes Leaflet marker icons)
    ├── App.jsx             # Providers + router + lazy routes
    ├── firebase.js         # Shared Firebase init (auth, Firestore, Realtime DB)
    ├── contexts/           # Language, Auth, Cart, Location
    ├── hooks/              # useAuth, useCart, useLanguage, useUserLocation, useSEO
    ├── components/
    │   ├── layout/         # Header, Footer, MobileNav
    │   ├── common/         # SEOHead, Modal, ImageUpload, StarRating, LanguageSwitch, ...
    │   ├── home/           # Hero, CategoryGrid, FeaturedStores, NearbyStores, TopItems...
    │   ├── store/          # StoreCard, StoreHeader, StoreMenu, StoreMap, StoreReviews
    │   ├── cart/           # CartItem, CartSummary
    │   ├── auth/           # LoginForm, SignupForm, GoogleSignIn, PasswordStrength
    │   └── svgs/           # ALL icons as React components (no emojis)
    ├── pages/              # One file per route
    ├── utils/              # seo, ranking, search, maps, imgbb, dataService, demoData
    ├── data/               # translations, categories, bangladeshLocations
    └── styles/             # variables, typography, layout, components, animations, responsive
```

---

## Deploy to Cloudflare Pages (from Android tablet, no CLI)

1. Push this folder to the GitHub repo `flashcart-main`.
2. In the Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repo. Build settings:
   - **Framework preset:** None / Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. Add the custom domain `flashcart.bsdc.info.bd` under **Custom domains**.
5. SPA deep-links work automatically via `public/404.html` (copied into `dist` on build).

No `_redirects` or `_headers` files are used — routing is handled by React Router + 404.html.

---

## Firebase setup notes

- Enable **Authentication** providers: Google + Email/Password.
- Add your Pages domain to **Auth → Settings → Authorized domains**.
- Firestore collections used: `users`, `stores`, `items`, `menuCategories`, `orders`, `reviews`.
- Realtime DB path used for live partner alerts: `orders/{partnerId}/{orderId}`.

---

## Next iterations (planned)

- Partner Portal app (`flashcart-partner`) with OneSignal push + real-time order alerts.
- Cloudflare Pages Function for dynamic `sitemap-stores.xml` and edge meta injection.
- Favorites/wishlist, flash deals countdown, refer & earn, loyalty FlashPoints.
- Admin panel (password-gated) for partner approval & content.

---

© FlashCart Bangladesh. Developed by Rizwan Rahim Chowdhury · Powered by BSDC.

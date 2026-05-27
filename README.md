# FlashCart - Bangladesh's Free Delivery Platform

> **Customer Portal** | Order food, groceries, medicine, and more from local shops near you.

## About FlashCart

FlashCart is Bangladesh's first free, all-in-one Cash-on-Delivery delivery platform. Every small shop, restaurant, home kitchen, medical store, grocery, electronics shop, library, mobile shop, and clothing store in Bangladesh gets their own SEO-optimized digital storefront — completely free.

## Tech Stack

- **Frontend:** React 18 + Vite
- **Hosting:** Cloudflare Pages (Free)
- **Database:** Firebase Firestore + Realtime Database
- **Authentication:** Firebase Auth (Google OAuth + Email/Password)
- **Images:** ImgBB API
- **Maps:** Leaflet.js + OpenStreetMap (Free)
- **SEO:** React Helmet Async + Schema.org JSON-LD
- **PWA:** Service Worker + Web App Manifest

## Ecosystem

| App | URL | Purpose |
|-----|-----|---------|
| FlashCart Main | https://flashcart.bsdc.info.bd | Customer portal |
| FlashCart Partner | https://partner.flashcart.bsdc.info.bd | Business dashboard |
| FlashCart Docs | https://docs.flashcart.bsdc.info.bd | Documentation |

## Deployment (Cloudflare Pages)

1. Push code to GitHub repository
2. Connect repository in Cloudflare Pages dashboard
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables from `.env` file
6. Set custom domain in DNS settings

## Developer

**Rizwan Rahim Chowdhury**

Powered by [Bangladesh Software Development Community (BSDC)](https://www.bsdc.info.bd)

## Version

FlashCart v1.0.0 — "The Bangladesh Delivery Revolution"

## License

MIT

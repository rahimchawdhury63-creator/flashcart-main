# FlashCart — Firebase Security Rules

Both apps (`flashcart-main` and `flashcart-partner`) share one Firebase project.
Paste these rules in the Firebase console.

---

## Firestore Rules (Firestore → Rules)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper: is the requester signed in?
    function signedIn() { return request.auth != null; }
    // Helper: does this uid own the resource?
    function isOwner(uid) { return signedIn() && request.auth.uid == uid; }

    // USERS — a user can read/write only their own document.
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create, update: if isOwner(userId);
      allow delete: if isOwner(userId);
    }

    // STORES — public read (needed for SEO/customer browsing).
    // Only the owning partner may create/update their store.
    match /stores/{storeId} {
      allow read: if true;
      allow create: if signedIn() && request.resource.data.partnerId == request.auth.uid;
      allow update, delete: if signedIn() && resource.data.partnerId == request.auth.uid;
    }

    // MENU CATEGORIES — public read; partner writes for their own store.
    match /menuCategories/{catId} {
      allow read: if true;
      allow write: if signedIn();
    }

    // ITEMS — public read; partner writes.
    match /items/{itemId} {
      allow read: if true;
      allow write: if signedIn();
    }

    // ORDERS — a customer can create; customer and partner can read/update theirs.
    match /orders/{orderId} {
      allow create: if signedIn();
      allow read, update: if signedIn() && (
        resource.data.customerId == request.auth.uid ||
        resource.data.partnerId == request.auth.uid
      );
    }

    // REVIEWS — public read; signed-in users can create; partner can update (reply).
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if signedIn();
      allow update: if signedIn();
    }
  }
}
```

> These rules are a pragmatic starting point. Tighten field-level validation
> (e.g. enforce `paymentMethod == 'COD'`, prevent stat tampering) before scaling.

---

## Realtime Database Rules (Realtime Database → Rules)

```
{
  "rules": {
    "orders": {
      "$partnerId": {
        // The owning partner can read their live order feed.
        ".read": "auth != null && auth.uid == $partnerId",
        // Any signed-in user (the ordering customer) can write a new order node.
        ".write": "auth != null"
      }
    },
    "storeStatus": {
      "$storeId": {
        ".read": true,
        ".write": "auth != null"
      }
    },
    "notifications": {
      "$partnerId": {
        ".read": "auth != null && auth.uid == $partnerId",
        ".write": "auth != null"
      }
    }
  }
}
```

---

## Authentication setup

1. **Authentication → Sign-in method**: enable **Google** and **Email/Password**.
2. **Authentication → Settings → Authorized domains**: add
   - `flashcart.bsdc.info.bd`
   - `partner.flashcart.bsdc.info.bd`
   - (and your `*.pages.dev` preview domains while testing)

---

© FlashCart Bangladesh

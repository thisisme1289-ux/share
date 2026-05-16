# Firebase Backend

This project uses Firebase as the operational backend. Keep server-side trust boundaries strict.

## Firebase Services

Enable:

- Firebase Hosting
- Firebase Authentication
- Cloud Firestore
- Cloud Storage
- Cloud Functions

Auth providers:

- Anonymous auth for customers.
- Email/password auth for admins.

Cloud Functions runtime:

- Node.js 20
- Firebase Functions v2

Required dependencies:

```json
{
  "firebase-admin": "^12.5.0",
  "firebase-functions": "^5.1.1",
  "razorpay": "^2.9.5"
}
```

## Public Web Config

Create `js/firebase-config.js`:

```js
window.FIREBASE_CONFIG = {
  apiKey: "PUBLIC_WEB_API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.firebasestorage.app",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
  measurementId: "MEASUREMENT_ID"
};

window.RAZORPAY_KEY_ID = "PUBLIC_RAZORPAY_KEY_ID";
```

Firebase web config is public. Razorpay key ID is public. Razorpay key secret is private and must only live in Cloud Functions secrets.

## Secrets

Set secrets:

```bash
firebase functions:secrets:set RAZORPAY_KEY_ID
firebase functions:secrets:set RAZORPAY_KEY_SECRET
```

Functions that create or verify payments must declare the secrets.

## Admin Claim

Admins need a custom claim:

```js
admin.auth().setCustomUserClaims(uid, { admin: true });
```

Use a script such as `scripts/set-admin-claim.js` or Firebase Admin SDK. After setting the claim, the admin should sign out and sign back in.

## Required Cloud Functions

`createRazorpayOrder`

- Callable function.
- Requires authenticated anonymous or signed-in customer.
- Reads `settings/restaurant`.
- Rejects if restaurant is closed or not accepting orders.
- Validates customer name, phone, address, delivery mode, and location.
- Calculates delivery distance and fee.
- Reads each cart item from `menuItems`.
- Rejects unavailable or inactive items.
- Calculates subtotal, GST, delivery fee, discount, and total.
- Creates Razorpay order.
- Creates Firestore `orders` document in `payment_pending`.
- Stores hashed tracking token.
- Upserts `users/{customerUid}`.
- Returns Razorpay order details and public key ID.

`verifyRazorpayPayment`

- Callable function.
- Requires same customer auth.
- Validates Razorpay order ID, payment ID, and signature.
- Recomputes HMAC SHA-256 using key secret.
- Confirms order ownership and payment order match.
- Updates order to `pending` and payment status to `paid`.
- Returns order number, tracking URL, total, mode, and status.

`updateOrderStatus`

- Callable function.
- Requires admin claim.
- Accepts status from allowed list only.
- Updates `status`, `updatedAt`, and `statusHistory`.
- If accepted, validates estimated prep minutes and sets `estimatedReadyAt`.
- If cancelled, stores cancellation reason.

`resolveTrackingOrder`

- Callable function.
- Accepts order number and token.
- Finds order by order number.
- Compares token hash.
- Returns public-safe order payload only.

`submitOrderFeedback`

- Callable function.
- Accepts order number, token, rating, and optional message.
- Verifies token hash.
- Writes `orderFeedback/{orderId}`.

`setRestaurantAvailability`

- Callable function.
- Requires admin claim.
- Updates `settings/restaurant.isOpen` and `acceptingOrders`.

## Firestore Rules

Rule principles:

- Public can read active menu categories and menu items.
- Public can read `settings/restaurant`.
- Customers can create/read/update only their own `users/{uid}` profile.
- Customers cannot create orders directly.
- Customers can read their own orders.
- Admin can read/update/delete orders, menu, settings, analytics.
- Everything else denied.

Important order rule:

```js
match /orders/{orderId} {
  allow read: if isAdmin() || (signedIn() && resource.data.customerUid == request.auth.uid);
  allow create: if false;
  allow update: if isAdmin();
  allow delete: if isAdmin();
}
```

## Storage Rules

Only menu images should be public-read. Only admins can upload images.

```js
match /menu/{fileName} {
  allow read: if true;
  allow write: if isAdmin()
    && request.resource.size < 5 * 1024 * 1024
    && request.resource.contentType.matches('image/.*');
}
```

## Firestore Indexes

Required composite indexes:

- `orders`: `customerUid ASC`, `createdAt DESC`
- `orders`: `status ASC`, `createdAt DESC`
- `categories`: `isActive ASC`, `sortOrder ASC`

Add more only when a query requires them.

## Deployment

Typical deployment:

```bash
npm --prefix functions install
firebase deploy --only firestore:rules,firestore:indexes,storage,functions,hosting
```

Use emulators for backend testing:

```bash
firebase emulators:start --only functions,firestore,auth
```


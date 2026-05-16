# Data Model

Use these Firestore collections and document shapes. Keep server-side functions tolerant of missing optional fields, but strict about fields needed for payment and delivery.

## `settings/restaurant`

Stores global restaurant controls.

```js
{
  isOpen: true,
  acceptingOrders: true,
  gstPercent: 5,
  deliveryFee: 0,
  prepTimeDefaultMinutes: 30,
  deliveryTimeDefaultMinutes: 45,
  restaurantLocation: { lat: 25.5066, lng: 81.8676 },
  maxDeliveryKm: 10,
  googleReviewUrl: "https://...",
  updatedAt: serverTimestamp()
}
```

Notes:

- `isOpen` and `acceptingOrders` both gate checkout.
- `restaurantLocation` is required for distance-based delivery.
- `gstPercent` should be used in backend pricing.

## `categories/{categoryId}`

Stores menu categories.

```js
{
  id: "restaurant-south-indian",
  name: "South Indian",
  menuType: "restaurant",
  sortOrder: 25,
  meta: "",
  isActive: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

Rules:

- `menuType` is usually `restaurant` or `bakery`.
- `sortOrder` controls display order.
- Public reads only active categories.

## `menuItems/{itemId}`

Stores orderable items.

```js
{
  id: "restaurant-south-indian-classic-masala-dosa",
  name: "Classic Masala Dosa",
  price: 159,
  priceText: "INR 159",
  description: "",
  categoryId: "restaurant-south-indian",
  categoryName: "South Indian",
  menuType: "restaurant",
  imageUrl: "images/classic-masala-dosa.jpg",
  isVeg: true,
  isActive: true,
  isAvailable: true,
  sortOrder: 0,
  categorySortOrder: 25,
  updatedAt: serverTimestamp()
}
```

Rules:

- `price` must be numeric.
- Backend always reads `price` from this document.
- `isActive == false` hides item from normal customer menu.
- `isAvailable == false` shows disabled item or prevents ordering.
- `imageUrl` can be local path or Firebase Storage URL.

## `users/{uid}`

Stores lightweight customer profile for anonymous or signed-in users.

```js
{
  authType: "anonymous",
  name: "Customer Name",
  phone: "9876543210",
  defaultAddress: "Address text",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  lastSeenAt: serverTimestamp()
}
```

Rules:

- Customer can read/update own profile.
- Admin can read/update/delete.
- Avoid storing sensitive payment card data. Razorpay handles payment details.

## `orders/{orderId}`

Stores customer orders.

```js
{
  orderNumber: "ANN-20260516-0001",
  customerUid: "firebaseAuthUid",
  fulfillmentMode: "delivery",
  trackingTokenHash: "sha256-token-hash",
  customer: {
    name: "Customer Name",
    phone: "9876543210",
    address: "Address text",
    locationUrl: "https://maps.google.com/?q=lat,lng",
    location: { lat: 25.50, lng: 81.86 }
  },
  items: [
    {
      itemId: "restaurant-south-indian-classic-masala-dosa",
      name: "Classic Masala Dosa",
      price: 159,
      qty: 2,
      imageUrl: "images/classic-masala-dosa.jpg",
      categoryId: "restaurant-south-indian",
      categoryName: "South Indian"
    }
  ],
  pricing: {
    subtotal: 318,
    cgst: 8,
    sgst: 8,
    deliveryFee: 20,
    deliveryDistanceKm: 1.6,
    discount: 0,
    total: 354
  },
  status: "pending",
  payment: {
    provider: "razorpay",
    status: "paid",
    razorpayOrderId: "order_xxx",
    razorpayPaymentId: "pay_xxx",
    verifiedAt: serverTimestamp()
  },
  tracking: {
    publicUrl: "/track.html?order=ANN-20260516-0001&token=...",
    tokenCreatedAt: serverTimestamp()
  },
  estimatedPrepMinutes: 30,
  estimatedReadyAt: timestamp(),
  googleReviewUrl: "https://...",
  cancellationReason: "",
  statusHistory: [
    { status: "payment_pending", at: "2026-05-16T08:00:00.000Z", by: "system" },
    { status: "pending", at: "2026-05-16T08:01:00.000Z", by: "system" }
  ],
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

Allowed statuses:

- `payment_pending`
- `pending`
- `accepted`
- `preparing`
- `ready`
- `out_for_delivery`
- `delivered`
- `cancelled`

Status rules:

- New order before payment: `payment_pending`.
- After verified payment: `pending`.
- Admin moves status forward.
- Pickup flow skips `out_for_delivery`.
- Cancelled order should include optional customer-visible reason.

## `counters/{counterId}`

Used for daily order numbering.

```js
{
  value: 12,
  updatedAt: serverTimestamp()
}
```

Example ID:

```text
orders-20260516
```

Order number format:

```text
ANN-YYYYMMDD-0001
```

Change prefix per restaurant brand.

## `orderFeedback/{orderId}`

Stores post-order feedback.

```js
{
  orderId: "firestoreOrderId",
  orderNumber: "ANN-20260516-0001",
  rating: 5,
  message: "Great food",
  fulfillmentMode: "delivery",
  createdAt: serverTimestamp()
}
```

## `analyticsDaily/{dayId}`

Optional aggregated analytics.

```js
{
  day: "2026-05-16",
  orders: 42,
  grossSales: 22000,
  deliveredOrders: 39,
  cancelledOrders: 3,
  updatedAt: serverTimestamp()
}
```

The current admin can calculate simple daily metrics from recent orders. Use this collection only when analytics needs to scale.


# Order And Payment Flow

This file explains the behavior that makes the website operational.

## Status Flow

Delivery:

```text
payment_pending -> pending -> accepted -> preparing -> ready -> out_for_delivery -> delivered
```

Pickup:

```text
payment_pending -> pending -> accepted -> preparing -> ready -> delivered
```

Cancellation can happen from most admin-controlled states:

```text
pending/accepted/preparing/ready/out_for_delivery -> cancelled
```

## Customer Cart Flow

1. Menu item is added to local cart.
2. Cart stores `id`, `name`, `price`, `qty`, and display fields.
3. Frontend shows estimated totals.
4. Before payment, frontend sends only item IDs and quantities to backend.
5. Backend fetches the authoritative item docs.
6. Backend rejects inactive or unavailable items.
7. Backend recalculates final price.

Important: client-side totals are previews only.

## Delivery Location Flow

For delivery orders:

1. Customer enters address.
2. Customer clicks share location.
3. Browser geolocation returns latitude and longitude.
4. Frontend displays map preview.
5. Customer confirms the location.
6. Frontend calculates estimate for user display.
7. Backend recalculates distance and delivery fee before payment.

Distance formula:

- Use Haversine distance between restaurant location and customer location.

Default delivery fee pattern:

```text
0-1 km: INR 10
1-2 km: INR 20
2-3 km: INR 25
3-4 km: INR 30
4-maxDeliveryKm: INR 35
outside range: reject
```

Adjust this per restaurant.

## Payment Creation Flow

Frontend sends:

```js
{
  fulfillmentMode: "delivery",
  customer: {
    name: "Customer Name",
    phone: "9876543210",
    address: "Address",
    locationUrl: "https://maps.google.com/?q=lat,lng",
    location: { lat: 25.50, lng: 81.86 }
  },
  items: [
    { itemId: "menu-item-id", name: "Display Name", qty: 2 }
  ],
  source: "web"
}
```

Backend:

1. Requires auth.
2. Checks restaurant is accepting orders.
3. Validates customer name and phone.
4. Validates delivery address and location if delivery.
5. Fetches item docs.
6. Calculates pricing.
7. Creates daily order number.
8. Creates random tracking token.
9. Creates Razorpay order for total amount in paise.
10. Writes Firestore order with payment status `created`.
11. Returns checkout payload.

## Razorpay Checkout Flow

Frontend opens Razorpay with:

- Public key ID.
- Amount from backend.
- Razorpay order ID from backend.
- Customer name and phone.
- Notes: order ID and order number.

On successful payment, Razorpay returns:

```js
{
  razorpay_order_id: "...",
  razorpay_payment_id: "...",
  razorpay_signature: "..."
}
```

Frontend sends this to `verifyRazorpayPayment`.

## Payment Verification Flow

Backend:

1. Requires customer auth.
2. Reads order.
3. Confirms `customerUid` matches caller.
4. Confirms Razorpay order ID matches stored order.
5. Computes expected signature:

```js
crypto
  .createHmac("sha256", RAZORPAY_KEY_SECRET)
  .update(`${razorpayOrderId}|${razorpayPaymentId}`)
  .digest("hex")
```

6. Compares with Razorpay signature.
7. Updates payment status to `paid`.
8. Updates order status to `pending`.
9. Adds status history.
10. Returns tracking URL.

## Admin Order Flow

Admin sees paid orders only:

```js
payment.status == "paid"
```

Admin actions:

- Accept with ETA: status becomes `accepted`, `estimatedReadyAt` is set.
- Preparing: status becomes `preparing`.
- Ready: status becomes `ready`.
- Out for delivery: delivery orders only.
- Delivered/picked up: status becomes `delivered`.
- Cancel: status becomes `cancelled`, cancellation reason stored.

Each update appends to `statusHistory`.

## Tracking Flow

Tracking URL format:

```text
/track.html?order=ORDER_NUMBER&token=RANDOM_TOKEN
```

Backend stores only:

```text
sha256(RANDOM_TOKEN)
```

Tracking page calls:

```js
resolveTrackingOrder({ orderNumber, token })
```

The returned payload must exclude:

- Firestore document ID unless needed.
- Tracking token hash.
- Full internal payment metadata.
- Admin-only fields.

## Feedback Flow

After delivered:

1. Tracking page displays rating buttons.
2. Customer selects rating and optional message.
3. Page calls `submitOrderFeedback`.
4. Backend verifies tracking token again.
5. Feedback is stored in `orderFeedback/{orderId}`.
6. Page optionally displays Google review link.

## Edge Cases To Handle

- Customer closes Razorpay modal: do not create paid order. Keep cart.
- Payment succeeds but frontend fails after verification: tracking link should still be discoverable from customer order history.
- Admin changes menu price while cart is open: backend uses new price.
- Item becomes unavailable while cart is open: backend rejects, frontend removes or warns.
- Customer location outside range: backend rejects even if frontend estimate was wrong.
- Tracking function times out: show retry and call restaurant option.


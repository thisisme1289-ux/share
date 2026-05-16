# Master Brief

Build a production-ready restaurant and food delivery website with online ordering, payment, admin order management, live tracking, and menu management.

The website should feel like a real operational restaurant system, not a landing page. The first screen must make the restaurant identity clear and quickly lead customers to browse food, add items, checkout, pay, and track the order.

## Business Type

Use this pattern for:

- Restaurant delivery and pickup
- Bakery ordering
- Cloud kitchen ordering
- Cafe or fast food ordering
- Multi-menu businesses such as restaurant plus bakery

## Core Outcomes

The finished site must include:

- Customer homepage with brand, restaurant photos, featured dishes, menu access, contact, gallery, hours, and order entry points.
- Full menu browser with categories, search, images, availability states, restaurant/bakery menu switching, and add-to-cart.
- Cart drawer with quantity controls, subtotal, GST/tax, delivery fee, total, delivery/pickup mode, phone validation, address capture, and location confirmation.
- Secure payment flow through Razorpay.
- Firebase-backed order creation, payment verification, and status updates.
- Admin dashboard with login, order queue, status controls, receipt printing, menu item CRUD, image upload, settings, and basic analytics.
- Public tracking page with token-protected order lookup, ETA, timeline, cancellation reason, and feedback/review prompt.
- PWA setup with manifest, service worker, icons, cache strategy, and mobile install readiness.
- SEO basics: title, description, Open Graph image, robots, sitemap, structured metadata where useful.
- Firebase Hosting deployment config, Firestore rules, Storage rules, indexes, and Cloud Functions.

## Technology Stack

Default stack used by this project:

- Static frontend: HTML, CSS, vanilla JavaScript.
- Hosting: Firebase Hosting.
- Authentication: Firebase Auth with anonymous customer sessions and email/password admin accounts.
- Database: Cloud Firestore.
- Server-side logic: Firebase Cloud Functions v2 on Node.js 20.
- File storage: Firebase Storage for menu images.
- Payments: Razorpay Orders API and Checkout.
- PWA: web manifest and service worker.

If using a modern framework such as React, Next.js, Vue, or Svelte, keep the same product flows, data model, rules, and server-side responsibilities.

## Required Inputs Before Building

Collect these values before implementation:

- Restaurant name, short name, tagline, cuisine type, city, address, phone, email, WhatsApp number.
- Opening hours by weekday/weekend.
- Dine-in, delivery, pickup, or all modes.
- Max delivery radius in kilometers.
- Restaurant latitude and longitude.
- Delivery fee rules by distance.
- GST/tax percentage and invoice details.
- Menu categories, item names, descriptions, prices, veg/non-veg markers, availability, images.
- Logo, favicon, PWA icons, gallery images, Open Graph image.
- Firebase project ID and web app config.
- Razorpay key ID and key secret.
- Admin staff emails.
- Google review URL.
- Domain name and deployment target.

## Non-Negotiable Requirements

- Never trust client-side prices. Cloud Functions must fetch item prices from Firestore before creating payment orders.
- Never let the frontend write paid orders directly. Order creation must happen through a server function.
- Never expose Razorpay key secret in frontend files.
- Admin-only operations require Firebase custom claim `admin == true`.
- Tracking links must include a random token. Do not expose arbitrary order lookup by order number only.
- Delivery orders must require a confirmed location and address.
- Customers must not be able to create, update, or delete menu items, settings, orders, or analytics.
- The site must still show a useful menu preview if Firebase is not configured, but payment/order actions should fail clearly.

## Output Standard

The final project should be deployable with:

```bash
firebase deploy
```

The AI builder must also provide:

- What files were created or changed.
- What environment values/secrets are still required.
- How to seed the menu.
- How to create/admin-enable staff accounts.
- How to test customer ordering, admin status updates, and tracking.

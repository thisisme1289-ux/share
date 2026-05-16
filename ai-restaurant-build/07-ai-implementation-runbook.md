# AI Implementation Runbook

This is the file to paste into an AI builder when creating a new restaurant website from this pattern.

## Primary Prompt

```text
You are building a production-ready restaurant food delivery website.

Read all Markdown files in docs/ai-restaurant-build before coding.

Build the website using the architecture, Firebase backend, data model, order/payment flow, and design system described there. The website must support customer browsing, cart, delivery/pickup checkout, Razorpay payment, Firebase order creation, admin order management, menu management, tracking links, PWA, SEO, and Firebase deployment.

Use these restaurant-specific values:
- Restaurant name: [RESTAURANT_NAME]
- Short name: [SHORT_NAME]
- Cuisine/type: [CUISINE]
- Address: [ADDRESS]
- Phone: [PHONE]
- WhatsApp: [WHATSAPP]
- City/area: [CITY_AREA]
- Opening hours: [HOURS]
- Max delivery radius: [MAX_DELIVERY_KM]
- Restaurant latitude/longitude: [LAT], [LNG]
- GST/tax percent: [GST_PERCENT]
- Google review URL: [GOOGLE_REVIEW_URL]
- Firebase project ID: [FIREBASE_PROJECT_ID]
- Razorpay key ID: [RAZORPAY_KEY_ID]
- Domain: [DOMAIN]

Use the menu source I provide. If item images are missing, use a default fallback image and keep image URLs editable from admin.

After implementation, verify:
- Customer menu renders.
- Cart works.
- Delivery and pickup modes work.
- Location confirmation is required for delivery.
- Firebase config placeholders are isolated.
- Cloud Functions never trust client-side prices.
- Firestore rules block direct customer order creation.
- Admin login requires custom admin claim.
- Tracking requires order number plus token.
- PWA files are present.
- Firebase deploy config is complete.

Return a short summary of files changed, required secrets, setup commands, and manual tests.
```

## Build Order

1. Create or confirm folder structure.
2. Build customer HTML shell.
3. Build CSS tokens and responsive layout.
4. Build menu data fallback.
5. Build menu rendering, search, categories, and item cards.
6. Build cart state and drawer.
7. Build checkout with delivery/pickup and location confirmation.
8. Add Firebase config and client wrapper.
9. Add Cloud Functions.
10. Add Firestore rules, Storage rules, and indexes.
11. Add Razorpay checkout integration.
12. Add order tracking page.
13. Add admin dashboard.
14. Add image upload and menu management.
15. Add manifest, service worker, robots, sitemap, SEO helpers.
16. Add setup scripts for menu seeding and admin claim if needed.
17. Test locally or with Firebase emulators.
18. Deploy.

## Acceptance Checklist

Customer website:

- [ ] Homepage is not just a landing page; ordering is prominent.
- [ ] Menu categories render.
- [ ] Menu search works.
- [ ] Items can be added and removed.
- [ ] Quantity controls work.
- [ ] Cart persists locally.
- [ ] Checkout validates name and phone.
- [ ] Delivery requires address and confirmed location.
- [ ] Pickup hides address and location controls.
- [ ] Closed restaurant disables checkout.
- [ ] Unavailable items cannot be ordered.
- [ ] Payment flow opens Razorpay.
- [ ] Successful payment creates paid order and tracking link.
- [ ] Failed/cancelled payment leaves cart intact.

Backend:

- [ ] `createRazorpayOrder` validates auth, settings, customer, location, items, and total.
- [ ] Prices are read from Firestore.
- [ ] Razorpay secret is stored as a function secret.
- [ ] `verifyRazorpayPayment` verifies HMAC signature.
- [ ] Direct customer order creation is blocked by Firestore rules.
- [ ] Admin-only functions require `admin == true`.
- [ ] Tracking token is hashed in Firestore.

Admin:

- [ ] Email/password admin login works.
- [ ] Non-admin accounts are rejected.
- [ ] Paid orders appear in queue.
- [ ] ETA accept buttons work.
- [ ] Status buttons work.
- [ ] Pickup flow skips out-for-delivery.
- [ ] Cancel reason appears on tracking page.
- [ ] Receipt preview and print work.
- [ ] Menu item create/edit/delete/toggle works.
- [ ] Menu image upload is limited to admins.
- [ ] Accept/pause orders updates customer checkout in real time.

Tracking:

- [ ] Valid token shows order.
- [ ] Invalid token fails.
- [ ] ETA countdown appears after accepted.
- [ ] Delivered order shows feedback.
- [ ] Google review link appears when configured.

Launch:

- [ ] `firebase.json` has hosting, functions, firestore, storage.
- [ ] `firestore.indexes.json` includes required indexes.
- [ ] `manifest.json` uses correct brand.
- [ ] `sw.js` caches correct assets.
- [ ] `robots.txt` and `sitemap.xml` use correct domain.
- [ ] `CNAME` uses correct custom domain if needed.
- [ ] All placeholder keys are replaced or documented.

## Menu Seeding Guidance

Prefer a structured source:

```csv
menuType,categoryName,itemName,price,description,isVeg,isActive,isAvailable,imageUrl,sortOrder
restaurant,South Indian,Classic Masala Dosa,159,,true,true,true,images/classic-masala-dosa.jpg,0
```

Generate:

- `categories/{categoryId}`
- `menuItems/{itemId}`
- optional `js/menu-catalog.js` fallback

Slug rules:

- Lowercase.
- Replace non-alphanumeric runs with hyphen.
- Prefix IDs with menu type.
- Keep IDs stable after launch.

## Common Mistakes To Avoid

- Putting Razorpay key secret in frontend.
- Letting customers write orders directly.
- Trusting cart prices sent by browser.
- Forgetting anonymous auth.
- Forgetting admin custom claims.
- Making tracking pages public by order number only.
- Building only a beautiful homepage and forgetting admin operations.
- Making menu data editable only in code.
- Breaking mobile cart layout.
- Forgetting pickup mode.
- Forgetting unavailable item states.
- Forgetting GST/tax and receipt requirements.
- Caching old JS/CSS forever without version changes in service worker.

## Final Handover Format

The AI builder should finish with:

```text
Done.

Changed:
- path/to/file
- path/to/file

Setup required:
- Add Firebase web config in js/firebase-config.js
- Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET secrets
- Create admin user and set admin claim
- Seed menu data

Tested:
- Customer menu/cart
- Checkout validation
- Admin dashboard
- Tracking page

Deploy:
firebase deploy --only firestore:rules,firestore:indexes,storage,functions,hosting
```


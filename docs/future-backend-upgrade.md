# Dobara cafe Future Backend Upgrade

This first implementation is a pickup-first WhatsApp ordering site. It does not collect online payments or create Firebase orders yet.

## Add Live Backend

1. Add the real Firebase web config in `js/firebase-config.js`.
2. Set `window.DOBARA_DEMO_MODE = false`.
3. Enable Firebase Auth anonymous sign-in for customers and email/password for staff.
4. Add Cloud Functions for `createRazorpayOrder`, `verifyRazorpayPayment`, `updateOrderStatus`, `resolveTrackingOrder`, and `submitOrderFeedback`.
5. Store Razorpay secrets only as Firebase Functions secrets.
6. Seed menu data from the final owner menu into `categories` and `menuItems`.
7. Replace `images/temp` with real Dobara cafe food, logo, and gallery photos.

## Production Rules

- Do not trust browser prices.
- Do not let customers write directly to `orders`.
- Require admin custom claim for menu, order, and settings changes.
- Use token-protected tracking links.
- Add delivery location validation only when delivery launches.

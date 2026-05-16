# Project Architecture

This architecture describes the current restaurant website pattern and should be reused for new food delivery builds.

## Recommended Folder Structure

```text
project-root/
  index.html
  track.html
  kitchen.html
  graphify.html
  admin/
    index.html
  css/
    base.css
    menu.css
    ui.css
    wheel.css
  js/
    app.js
    data.js
    firebase-client.js
    firebase-config.js
    menu-catalog.js
    pwa.js
    seo.js
    wheel.js
  images/
    default.jpg
    icon-192.png
    icon-512.png
    og-cover.jpg
    menu-item-images...
  functions/
    package.json
    src/
      index.js
  docs/
  firebase.json
  firestore.rules
  firestore.indexes.json
  storage.rules
  manifest.json
  sw.js
  robots.txt
  sitemap.xml
  CNAME
```

## Page Responsibilities

`index.html`

- Main customer website.
- Loads CSS, menu data, Firebase client, cart/order logic, SEO/PWA helpers.
- Contains home, menu, gallery, cart drawer, checkout, location confirmation, and success modal shells.

`admin/index.html`

- Staff dashboard.
- Handles Firebase email/password login.
- Rejects users without `admin == true` custom claim.
- Lists paid orders.
- Allows status changes, ETA setting, cancellation, receipt printing, menu CRUD, image upload, order pause/resume, and simple analytics.

`track.html`

- Public order tracking page.
- Reads `order` and `token` from query string.
- Calls Cloud Function `resolveTrackingOrder`.
- Falls back to customer-owned order lookup when possible.
- Displays status timeline, ETA, cancellation reason, summary, feedback, and Google review link.

`kitchen.html`

- Redirects old kitchen/admin route to `/admin/`.
- Keep this for backward compatibility if old links exist.

`graphify.html`

- Optional visualization or preview page.
- Do not make it part of the critical order flow unless intentionally required.

## JavaScript Module Responsibilities

`js/firebase-config.js`

- Public Firebase web config.
- Public Razorpay key ID placeholder.
- No secrets.

`js/firebase-client.js`

- Initializes Firebase app.
- Manages anonymous customer auth.
- Reads settings and menu catalog.
- Calls Cloud Functions for order creation and payment verification.
- Opens Razorpay checkout.

`js/data.js`

- Local fallback menu, image map, category colors, cart state, and shared global state.
- Must work without Firebase so the menu can render before remote data is ready.

`js/menu-catalog.js`

- Generated or imported menu catalog.
- Can override fallback menu with restaurant plus bakery catalogs.
- Should be regenerated from a structured menu source when possible.

`js/app.js`

- Main customer UI behavior.
- Navigation, menu rendering, search, cart drawer, checkout, location capture, delivery fee estimate, order submission, success modal, live order widget, footer hours.

`js/wheel.js`

- Featured dish wheel or other special homepage interactive component.

`js/pwa.js`

- Service worker registration and install prompt behavior.

`js/seo.js`

- SEO metadata and structured data helpers.

## CSS Responsibilities

`css/base.css`

- Reset, typography, theme tokens, base layout, hero, nav, footer.

`css/menu.css`

- Menu browser, category rail, item cards, search, menu mode switch.

`css/ui.css`

- Cart drawer, checkout form, modal, toast, order widgets, responsive UI controls.

`css/wheel.css`

- Featured wheel or special interactive visual styles.

## Backend Responsibilities

Cloud Functions are responsible for:

- Validating customer auth.
- Validating restaurant availability.
- Validating customer fields and location.
- Fetching live item prices from Firestore.
- Calculating subtotal, GST, delivery fee, and total.
- Creating Razorpay order.
- Creating Firestore order in `payment_pending`.
- Verifying Razorpay signature.
- Moving order to `pending` after payment success.
- Updating order status for admins.
- Resolving token-protected tracking links.
- Recording order feedback.
- Updating restaurant availability.

Firestore rules and Storage rules must block unsafe client writes and permit only the intended reads.

## Hosting Routes

Use Firebase Hosting rewrites:

```json
[
  { "source": "/admin/**", "destination": "/admin/index.html" },
  { "source": "/track/**", "destination": "/track.html" },
  { "source": "/graphify", "destination": "/graphify.html" },
  { "source": "/graphify/**", "destination": "/graphify.html" }
]
```

For a framework build, adapt these routes to framework routing while preserving `/admin/` and `/track.html` behavior.


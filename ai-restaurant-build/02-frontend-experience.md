# Frontend Experience

The frontend should be designed around ordering speed and trust. Customers must be able to inspect food, understand price, add items, choose delivery or pickup, pay, and track without confusion.

## Customer Screens

Home screen:

- Brand and restaurant identity visible immediately.
- Strong food photography, not abstract decoration.
- Clear entry points: menu, order, call, location, gallery.
- Featured dishes or rotating dish wheel.
- Restaurant status: open/closed, delivery/pickup available.
- Hours, address, phone, gallery, and social/review links.

Menu screen:

- Category navigation.
- Search input.
- Restaurant/bakery menu switch if business has multiple menus.
- Item cards with image, name, price, short description when available, availability, and add button.
- Unavailable items remain visible but cannot be added.
- Empty states for search and categories.

Cart drawer:

- Opens from floating cart or add action.
- Shows line items, quantity controls, subtotal, tax, delivery fee, total.
- Supports removing items and changing quantity.
- Checkout button disabled until cart has items.
- Checkout view inside the drawer or modal.

Checkout:

- Delivery/pickup segmented mode.
- Name, phone, address for delivery.
- Indian phone validation if the restaurant is India-based.
- Location sharing and confirmation for delivery.
- Map preview for confirmed location.
- Delivery fee estimate and distance display.
- Secure payment button.
- Loading state while payment is being prepared.
- Success modal with order number and tracking link.

Tracking:

- Order number and current status.
- Timeline steps.
- ETA countdown after admin accepts order.
- Pickup-specific labels when mode is pickup.
- Delivery-specific labels when mode is delivery.
- Cancellation reason if cancelled.
- Order summary and paid total.
- Feedback form after delivery/pickup.
- Google review link after completion.

Admin:

- Login gate.
- Orders tab with paid orders only.
- Order cards with customer info, items, total, payment status, ETA, and address.
- Accept with preset ETA buttons and custom ETA.
- Stage controls: accepted, preparing, ready, out for delivery, delivered.
- Pickup orders should not show out for delivery.
- Cancel flow asks for reason.
- Receipt preview and print.
- Completed orders separated from live queue.
- Menu tab for add/edit/delete/toggle availability and upload images.
- Settings tab for accepting/pausing orders.
- Analytics tab for basic daily orders and sales.

## Frontend State

Persist locally:

- Cart: `restaurant_cart_v1` or brand-specific equivalent.
- Customer profile: name, phone, default address.
- Tracking links for recent orders.
- Reviewed orders to avoid repeated prompts.

Sync from backend:

- Restaurant settings from `settings/restaurant`.
- Menu catalog from `categories` and `menuItems`.
- Customer order history from `orders` filtered by `customerUid`.

## Customer Flow

1. Customer browses menu.
2. Customer adds items.
3. Customer opens cart.
4. Customer chooses delivery or pickup.
5. For delivery, customer enters address and confirms browser location.
6. Frontend asks backend to create Razorpay order.
7. Razorpay Checkout opens.
8. Backend verifies payment signature.
9. Frontend clears cart and shows tracking link.
10. Admin sees paid order.
11. Customer tracks order status.

## UI Behavior Rules

- Keep ordering controls visible and reachable on mobile.
- Avoid full-page reloads during normal ordering.
- Use modals and drawers for short workflows only.
- Disable buttons while async actions are running.
- Show friendly toasts for validation and backend errors.
- Escape all user-provided strings before inserting HTML.
- Use `safeHref` for dynamic URLs.
- Keep text short inside compact controls.
- Do not allow cart submission if any item became unavailable.

## Failure States

Handle these states clearly:

- Firebase config missing.
- Anonymous auth unavailable.
- Restaurant paused or closed.
- Cart empty.
- Invalid phone.
- Delivery location not shared.
- Delivery location outside range.
- Razorpay script unavailable.
- Payment cancelled.
- Payment verification failed.
- Tracking token invalid.
- Order lookup slow or temporarily unavailable.


# Design System

Use this file to keep new restaurant sites polished, food-focused, and operational.

## Experience Personality

The UI should feel:

- Fresh
- Trustworthy
- Food-first
- Fast to order from
- Mobile-native
- Warm, not cluttered
- Operational enough for repeated staff use

Avoid making the first screen a generic marketing landing page. The website is a working ordering product.

## Layout Rules

Customer site:

- First viewport should show restaurant identity, food imagery, and a clear order/menu action.
- Menu and cart must be easy to reach on mobile.
- Use full-width page sections rather than stacked decorative cards.
- Use cards for menu items, order cards, modals, and repeated content.
- Keep cart and checkout controls stable so totals and buttons do not jump.
- Use responsive grids with explicit min widths.

Admin site:

- Dense but readable.
- Prioritize order queue scanning.
- Use simple cards, tabs, badges, buttons, and forms.
- Avoid decorative hero sections.

Tracking page:

- Keep status and ETA highly visible.
- Timeline should be simple.
- Summary should be secondary but easy to inspect.

## Visual Assets

Required images:

- Restaurant hero or interior/exterior image.
- Food item images for high-priority menu items.
- Default fallback food image.
- Gallery images.
- PWA icons: 192x192 and 512x512.
- Open Graph image.

Asset rules:

- Use actual food or restaurant photos where possible.
- Do not use abstract gradient backgrounds as primary food visuals.
- Avoid dark, blurry, overly cropped images for menu items.
- Every menu item should gracefully fall back to `images/default.jpg`.

## Color Tokens

Use a brand palette with:

- Primary color for order/action buttons.
- Accent color for highlights.
- Warm neutral background.
- Strong text color.
- Muted text color.
- Success, warning, and danger colors.

Example:

```css
:root {
  --primary: #1f7a63;
  --primary-dark: #165a48;
  --accent: #e0a837;
  --bg: #f5f3ee;
  --surface: #ffffff;
  --text: #1a1916;
  --muted: #7a7570;
  --border: #e0dcd5;
  --danger: #b91c1c;
}
```

Do not make the whole interface one hue. Food websites need contrast between warm food photography, neutral surfaces, and clear action colors.

## Typography

Suggested:

- Display/brand: elegant serif or strong display face.
- UI/body: clean sans-serif.

Current project pattern:

- Brand/display: Cormorant Garamond.
- UI/body: DM Sans.

Rules:

- Do not scale font size with viewport width.
- Use compact headings in admin/cards.
- Avoid negative letter spacing.
- Keep button labels short.

## Components

Use these component patterns:

- Sticky navigation with raised state.
- Category tabs/rail.
- Search input.
- Menu item card.
- Quantity stepper.
- Cart drawer.
- Segmented delivery/pickup control.
- Location confirmation button.
- Toast.
- Success modal.
- Live order widget.
- Admin tabs.
- Status badges.
- Receipt preview modal.
- Timeline steps.

## Mobile Rules

- Cart drawer should fit small screens.
- Checkout button must remain reachable.
- Text inside buttons must not wrap awkwardly.
- Category navigation should scroll horizontally or collapse cleanly.
- Map preview should not push payment controls too far away.
- Admin dashboard should remain usable on tablets and phones.

## Accessibility

Minimum requirements:

- Buttons use `button` elements unless navigating.
- Links use `a` elements.
- Modals use dialog semantics when practical.
- Inputs have labels or clear accessible names.
- Dynamic pages set `aria-hidden` when hidden.
- Cart drawer traps focus when open.
- Escape key closes drawer/modal where appropriate.
- Color is not the only status indicator.

## Copy Tone

Use short operational copy:

- `Add`
- `View Menu`
- `Proceed to Checkout`
- `Pay Securely`
- `Track Order`
- `Accept Orders`
- `Pause Orders`
- `Ready for pickup`
- `Out for delivery`

Avoid long explanations in the UI. Put detailed instructions in docs, not on-screen.


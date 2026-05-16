# AI Restaurant Website Build Pack

Use this folder as the portable instruction pack for building another restaurant, bakery, cloud kitchen, or food delivery website from the same pattern as this project.

When starting a new project, give the AI these files first:

1. `00-master-brief.md` - the complete build goal and expected output.
2. `01-project-architecture.md` - folder structure, pages, modules, and ownership.
3. `02-frontend-experience.md` - customer-facing screens and UI behavior.
4. `03-firebase-backend.md` - Firebase services, rules, functions, secrets, and deployment.
5. `04-data-model.md` - Firestore collections and document shapes.
6. `05-order-payment-flow.md` - cart, delivery, Razorpay, tracking, admin status flow.
7. `06-design-system.md` - visual style, layout rules, responsive behavior, and assets.
8. `07-ai-implementation-runbook.md` - the step-by-step prompt and acceptance checklist for an AI builder.

Recommended use:

```text
Build a new food delivery website using the instructions in docs/ai-restaurant-build.
Treat 00-master-brief.md as the product goal and follow every requirement in the other files.
Use my restaurant details, menu, Firebase project, Razorpay keys, logo, images, and domain values where placeholders are marked.
```

The docs are intentionally split. Large AI builds work better when product intent, architecture, data, backend, flows, and design rules are separate but cross-referenced.


# Scrummy Munchies Website — Implementation Guide

This document outlines a start-to-finish plan to build the Scrummy Munchies website with modern styling, automation, and operational tooling. Follow the phases in order; each phase has deliverables, owner roles, and success checks.

## Stack and Foundations
- Framework: Next.js (App Router) + TypeScript
- UI: Tailwind CSS, Framer Motion (animations), icon set (Lucide/Phosphor)
- State/Forms: React Query or SWR (data), React Hook Form + Zod (validation)
- Backend: Next API routes (or Express if separated), PostgreSQL (primary DB), Redis (sessions/queues/rate limits)
- Payments: Stripe or Paystack + M-Pesa integration; Webhooks for payment events
- Messaging: WhatsApp Cloud API + SMS/email provider (e.g., Twilio/SendGrid)
- Storage/CDN: Cloudinary or S3 for images
- Infra: Vercel/Netlify (frontend), Railway/Fly/DigitalOcean (backend + DB), Sentry (errors), logging middleware

## Phase 0 — Project Setup
- Repo init: Next.js + TS + Tailwind + ESLint/Prettier; set path aliases; add commit hooks (lint-staged + husky)
- CI: GitHub Actions for lint/test/build
- Env management: .env.example with placeholders for DB, payment, WhatsApp, email, storage
- Design tokens: color palette (red→orange gradient primary, green accent), typography scale, spacing, radii, shadows
- Global layout: base layout, font loading, metadata, SEO defaults
- Accessibility: base focus states, skip links, semantic landmarks

## Phase 1 — Visual System & Landing Skeleton
- Build UI primitives: buttons, badges (BOGO), cards, nav, drawer/modal, tabs, form fields, toasts
- Layout shell: sticky top nav, footer, responsive grid, floating action bar (Call, WhatsApp, Order)
- Hero section: promo carousel, countdown to next Tue/Fri BOGO, CTAs (Order Now, Call/WhatsApp)
- Deals strip: active/upcoming promos with schedule hints
- About/Story + quality highlights; social proof placeholder
- Contentful copy slots for address, hours, delivery areas

## Phase 2 — Menu & Cart Experience
- Menu data model: categories, items, variants (sizes), add-ons/toppings, dietary tags, availability flag
- Menu UI: cards with imagery, price, tags; filters/search; load-more/pagination
- Cart: add/update/remove items; variant/add-on pricing; tax/fee toggles; pickup vs delivery
- Promo rules: implement BOGO (Tue/Fri recurring) + coupon codes; price calculation unit tests
- Persistence: cart stored in session/local storage; server-validated on checkout

## Phase 3 — Checkout & Payments
- Checkout form: contact, delivery address/area, instructions; validation (Zod)
- Payment methods: Cash on Delivery, M-Pesa/mobile money, card (Stripe/Paystack); handle COD separately
- Order confirmation: summary page, order ID, shareable link
- Notifications: email + WhatsApp/SMS confirmation with order details
- Webhooks: payment success/failure handlers; reconcile with order state

## Phase 4 — Order Operations & Automation
- Order status flow: Pending → Preparing → Out for Delivery → Delivered/Cancelled
- Ops board (customer-facing): live status updates via polling or SSE; ETA estimation
- Ops board (internal): Kanban view for staff; actions to advance status, edit notes, resend notifications
- Delivery workflow: driver assignment, mark delivered, record handoff time; simple SLA timers
- Inventory assists: decrement ingredients per order; low-stock alerts to admin channel
- Promo scheduler: define recurring rules (Tue/Fri BOGO) + flash deals with start/end times; override toggles

## Phase 5 — CRM, Loyalty, Feedback
- Accounts: login/OTP or passwordless email; profile with addresses, preferences
- Order history: reorder in one tap; favorites
- Loyalty: points or stamp model; earn/redeem at checkout; display balance
- Feedback: post-delivery survey; star rating + comments; flag unhappy feedback for follow-up

## Phase 6 — Admin Console
- Auth: role-based (admin, staff, driver, analyst)
- Menu manager: CRUD items, prices, photos, variants/add-ons, dietary tags, availability
- Promo manager: create/schedule promos, coupons, blackout dates; preview price impact
- Orders board: edit items, apply refunds/adjustments, comp items; resend receipts/status updates
- Delivery view: driver roster, assignments, capacity, SLA alerts
- Reports: sales by day/hour/item, promo performance, repeat rate, delivery SLA, low-stock history
- Audit logs: record admin actions; export CSV

## Phase 7 — Content & Marketing
- SEO: structured data for restaurant/menu, OG/Twitter cards, sitemap, robots.txt
- Blog/updates: lightweight CMS or MDX for promos and announcements
- UGC: pull top reviews; showcase Instagram-style grid if available
- Banners: scheduled homepage takeovers for special deals

## Phase 8 — Quality, Performance, Security
- Testing: unit (pricing/promo), integration (checkout), e2e (Playwright for add-to-cart → checkout → confirmation)
- Performance: image optimization, caching (ISR/SSR mix), React Query caching, code-splitting; monitor Core Web Vitals
- Accessibility: axe/lighthouse checks; keyboard flows; color contrast validation
- Security: input validation, rate limits, authZ on admin routes, webhook signature verification, secret management
- Observability: Sentry for errors, structured logs, uptime checks

## Data Model (outline)
- users(id, name, phone, email, role, loyalty_balance)
- addresses(id, user_id, line1, area, notes)
- menu_items(id, category_id, name, desc, price_base, image, tags, available)
- variants(id, item_id, name, price_delta)
- add_ons(id, item_id, name, price_delta)
- promos(id, type: bogo/percent/fixed, rule, schedule, active_from/to, days_of_week)
- coupons(code, type, amount, min_subtotal, expires_at, usage_limit)
- orders(id, user_id/null, status, totals, payment_method, payment_status, promo_applied, coupon_code)
- order_items(order_id, item_id, variant_id, qty, add_ons[], line_total)
- inventory_items(id, name, qty_on_hand, reorder_level)
- drivers(id, name, phone, status)
- deliveries(order_id, driver_id, status, eta, delivered_at)
- feedback(order_id, rating, comment, flagged)

## API Surface (representative)
- Public: GET /menu, GET /deals, GET /promos/active, POST /cart/price, POST /checkout, GET /order/:id/status
- Authenticated: GET /me/orders, POST /reorder/:id, POST /feedback
- Admin: CRUD /menu, /promos, /coupons; POST /orders/:id/status; POST /deliveries/assign; GET /reports/*
- Webhooks: /webhooks/payments/stripe|paystack|mpesa

## Delivery Milestones (sprints)
1) Setup + design system + landing hero/deals placeholders
2) Menu + cart with BOGO rules + unit tests for pricing
3) Checkout + payments + confirmations
4) Ops boards (customer + internal) + status notifications
5) Admin console (menu/promo/orders) + delivery workflow + inventory assists
6) CRM/loyalty + feedback + reports
7) Polish: SEO, performance, a11y, observability, launch readiness

## Definition of Done (launch)
- Critical user flows pass e2e: browse → add to cart → apply BOGO → checkout (COD/card/M-Pesa) → receive confirmation → track status
- Admin can manage menu, promos, orders, deliveries without code changes
- Payments and webhooks verified in sandbox and live keys
- Error logging, monitoring, uptime checks active; alerts wired
- Content (address, hours, FAQs, promos) up to date; analytics enabled
- Backup/restore verified for DB; secrets stored securely

## Next Actions
- Confirm payment provider choices (Stripe/Paystack, M-Pesa provider)
- Confirm messaging providers (WhatsApp Cloud API, SMS/email)
- Approve palette/typography and component direction
- Scaffold Next.js project with the chosen stack and add the design tokens and base layout

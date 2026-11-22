# ShopLedger

## Stack

Node.js with Express and body-parser; a vanilla HTML/CSS/JavaScript browser UI; JSON persistence in `data/db.json`.

## Module map

- `routes/products.js` — product catalog and active-coupon endpoints.
- `routes/orders.js` — order listing, creation, and cancellation endpoints.
- `routes/customers.js` — customer listing and Khata settlement endpoint.
- `routes/reports.js` — dashboard, GST reconciliation, pricing preview, and export endpoints.
- `lib/coupons.js` — coupon normalization, validation, and discount calculation.
- `lib/dates.js` — date formatting, normalization, and fiscal-year helpers.
- `lib/inventory.js` — product lookup, stock checks, stock changes, and inventory summary.
- `lib/invoice.js` — printable invoice figure calculation and HTML rendering.
- `lib/ledger.js` — customer lookup, Khata charges, reversals, and settlements.
- `lib/orders.js` — order creation, lookup, cancellation, and filtering.
- `lib/pricing.js` — subtotal, discount, and checkout-total calculation.
- `lib/reports.js` — dashboard summary and invoice-versus-ledger reconciliation.
- `lib/store.js` — JSON database reads, writes, and audit entries.
- `lib/tax.js` — GST rate lookup, GST-slab display, and CGST/SGST split.

## Commands

- Start the app: `npm start`
- Run tests: `node --test`

## Rules

1. Write characterization tests before changing behaviour.
2. Change only the module(s) the ticket is about.
3. Tests never read or write `data/db.json`; they use in-memory data.
4. Add no dependencies.
5. Make the smallest fix that works.

## Current ticket

Invoice total and GST breakdown do not match what the customer was billed.

Allowed files: `lib/invoice.js`; use `lib/tax.js` only if truly needed.

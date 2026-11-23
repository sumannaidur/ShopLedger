# ShopLedger invoice regression case study

This is a fork of a legacy Node/Express billing exercise. The change in this fork focuses on keeping printed invoice amounts consistent with checkout.

## Verify the regression

Run with Node.js 20 or newer:

    npm test

The suite covers mixed GST rates, discounted GST, the SAVE10 cap, all-18% items, and an order where the GST rate comes from HSN because the line has no explicit rate. The last case checks the invoice figures against checkout and asserts the line-level figures.

See test/invoice.test.js for expected values and lib/invoice.js for the implementation. The existing SVG under docs/ provides application context.

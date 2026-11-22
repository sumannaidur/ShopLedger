var test = require('node:test');
var assert = require('node:assert/strict');

var invoice = require('../lib/invoice');
var pricing = require('../lib/pricing');

function line(id, name, price, qty, hsn, gstRate) {
  return { id: id, name: name, sku: 'SKU-' + id, price: price, qty: qty, hsn: hsn, gstRate: gstRate };
}

test('CURRENT BEHAVIOUR: #1001 invoice uses explicit 5% and 12% GST rates without a coupon', function () {
  var order = {
    id: 1001,
    coupon: '',
    items: [
      line(2, 'Toor Dal', 165, 2, '0713', 5),
      line(7, 'Table Butter', 260, 1, '0405', 12)
    ]
  };
  var figures = invoice.computeInvoiceFigures(order);
  var billed = pricing.computeTotals(order.items, order.coupon);

  assert.deepEqual(figures, {
    subtotal: 590,
    discount: 0,
    tax: 47.7,
    cgst: 23.85,
    sgst: 23.85,
    total: 637.7,
    rows: [
      { name: 'Toor Dal', sku: 'SKU-2', hsn: '0713', qty: 2, price: 165, gstPercent: 5, line: 330, lineTax: 16.5 },
      { name: 'Table Butter', sku: 'SKU-7', hsn: '0405', qty: 1, price: 260, gstPercent: 12, line: 260, lineTax: 31.2 }
    ]
  });
  assert.equal(billed.total, 637.7);
  assert.equal(billed.tax, 47.7);
});

test('CURRENT BEHAVIOUR: #1002 SAVE10 invoice matches the discounted checkout GST', function () {
  var order = {
    id: 1002,
    coupon: 'SAVE10',
    items: [
      line(1, 'Basmati Rice', 640, 1, '1006', 5),
      line(4, 'Sunflower Oil', 190, 2, '1512', 5)
    ]
  };
  var figures = invoice.computeInvoiceFigures(order);
  var billed = pricing.computeTotals(order.items, order.coupon);

  assert.deepEqual(figures, {
    subtotal: 1020,
    discount: 102,
    tax: 45.9,
    cgst: 22.95,
    sgst: 22.95,
    total: 963.9,
    rows: [
      { name: 'Basmati Rice', sku: 'SKU-1', hsn: '1006', qty: 1, price: 640, gstPercent: 5, line: 640, lineTax: 28.8 },
      { name: 'Sunflower Oil', sku: 'SKU-4', hsn: '1512', qty: 2, price: 190, gstPercent: 5, line: 380, lineTax: 17.1 }
    ]
  });
  assert.equal(billed.tax, figures.tax);
  assert.equal(billed.discount, figures.discount);
  assert.equal(billed.total, figures.total);
});

test('CURRENT BEHAVIOUR: #1004 SAVE10 invoice applies the ₹150 coupon cap', function () {
  var order = {
    id: 1004,
    coupon: 'SAVE10',
    items: [line(5, 'Groundnut Oil', 1120, 2, '1508', 5)]
  };
  var figures = invoice.computeInvoiceFigures(order);
  var billed = pricing.computeTotals(order.items, order.coupon);

  assert.deepEqual(figures, {
    subtotal: 2240,
    discount: 150,
    tax: 104.5,
    cgst: 52.25,
    sgst: 52.25,
    total: 2194.5,
    rows: [
      { name: 'Groundnut Oil', sku: 'SKU-5', hsn: '1508', qty: 2, price: 1120, gstPercent: 5, line: 2240, lineTax: 104.5 }
    ]
  });
  assert.equal(billed.discount, figures.discount);
  assert.equal(billed.tax, figures.tax);
  assert.equal(billed.total, figures.total);
});

test('CURRENT BEHAVIOUR: #1008 all-18% items have matching invoice and checkout figures', function () {
  var order = {
    id: 1008,
    coupon: '',
    items: [
      line(8, 'Masala Chai', 140, 1, '0902', 18),
      line(12, 'Kokum Sherbet', 180, 2, '2106', 18)
    ]
  };
  var figures = invoice.computeInvoiceFigures(order);
  var billed = pricing.computeTotals(order.items, order.coupon);

  assert.deepEqual(figures, {
    subtotal: 500,
    discount: 0,
    tax: 90,
    cgst: 45,
    sgst: 45,
    total: 590,
    rows: [
      { name: 'Masala Chai', sku: 'SKU-8', hsn: '0902', qty: 1, price: 140, gstPercent: 18, line: 140, lineTax: 25.2 },
      { name: 'Kokum Sherbet', sku: 'SKU-12', hsn: '2106', qty: 2, price: 180, gstPercent: 18, line: 360, lineTax: 64.8 }
    ]
  });
  assert.equal(billed.tax, figures.tax);
  assert.equal(billed.total, figures.total);
});

test('invoice matches checkout for #1004 HSN GST and capped SAVE10 discount', function () {
  var order = {
    id: 1004,
    coupon: 'SAVE10',
    items: [{
      id: 5,
      name: 'Groundnut Oil',
      sku: 'SKU-5',
      price: 1120,
      qty: 2,
      hsn: '1508'
    }]
  };
  var billed = pricing.computeTotals(order.items, order.coupon);
  var figures = invoice.computeInvoiceFigures(order);

  assert.deepEqual(figures, {
    subtotal: billed.subtotal,
    discount: billed.discount,
    tax: billed.tax,
    cgst: billed.cgst,
    sgst: billed.sgst,
    total: billed.total,
    rows: [{
      name: 'Groundnut Oil',
      sku: 'SKU-5',
      hsn: '1508',
      qty: 2,
      price: 1120,
      gstPercent: 5,
      line: 2240,
      lineTax: 104.5
    }]
  });
});

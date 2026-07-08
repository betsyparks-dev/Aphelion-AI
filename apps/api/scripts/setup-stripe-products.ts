/**
 * Stripe Product Creation Script
 * 
 * Run this script with a valid STRIPE_SECRET_KEY to create the products.
 * Usage: STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/setup-stripe-products.ts
 */

import Stripe from 'stripe';

async function setupProducts() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey || apiKey === '') {
    console.log(`
⚠️  No STRIPE_SECRET_KEY found in environment.
To create products, set your Stripe secret key:

  export STRIPE_SECRET_KEY=sk_test_...
  npx tsx scripts/setup-stripe-products.ts

Below are the products that will be created once a key is provided:
    `);
    printExpectedProducts();
    return;
  }

  const stripe = new Stripe(apiKey, { apiVersion: '2025-02-24.acacia' });

  const products = [
    {
      name: 'Astral Lens Premium Monthly',
      description: 'Full birth-chart horoscopes, transit alerts, and compatibility insights — renewed monthly.',
      metadata: { plan_type: 'subscription', billing_period: 'monthly' },
      price: { amount: 499, currency: 'usd', interval: 'month' as const },
    },
    {
      name: 'Astral Lens Premium Yearly',
      description: 'Full birth-chart horoscopes, transit alerts, and compatibility insights — billed annually (2 months free).',
      metadata: { plan_type: 'subscription', billing_period: 'yearly' },
      price: { amount: 3999, currency: 'usd', interval: 'year' as const },
    },
    {
      name: 'Birth Chart Report',
      description: 'Downloadable detailed birth chart report with full planetary positions, house cusps, and aspect analysis.',
      metadata: { plan_type: 'one-time', product: 'birth_chart_report' },
      price: { amount: 999, currency: 'usd' },
    },
    {
      name: 'Compatibility Report',
      description: 'Downloadable synastry compatibility report between two charts with aspect scoring and relationship insights.',
      metadata: { plan_type: 'one-time', product: 'compatibility_report' },
      price: { amount: 1499, currency: 'usd' },
    },
  ];

  const results: Array<{ product: string; priceId: string; paymentLink?: string }> = [];

  for (const prod of products) {
    console.log(`Creating product: ${prod.name}...`);

    // Create the product
    const product = await stripe.products.create({
      name: prod.name,
      description: prod.description,
      metadata: prod.metadata,
    });

    // Create the price
    const priceData: Stripe.PriceCreateParams = {
      product: product.id,
      currency: prod.price.currency,
      unit_amount: prod.price.amount,
    };

    if ('interval' in prod.price) {
      priceData.recurring = { interval: prod.price.interval };
    }

    const price = await stripe.prices.create(priceData);

    // Create payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
    });

    results.push({
      product: product.id,
      priceId: price.id,
      paymentLink: paymentLink.url,
    });

    console.log(`  ✓ ${product.name}`);
    console.log(`    Product ID: ${product.id}`);
    console.log(`    Price ID:   ${price.id}`);
    console.log(`    Price:      $${(prod.price.amount / 100).toFixed(2)}${'interval' in prod.price ? ` / ${prod.price.interval}` : ' (one-time)'}`);
    console.log(`    Link:       ${paymentLink.url}`);
    console.log('');
  }

  // Output .env config
  console.log('=== ADD THESE TO apps/api/.env ===');
  console.log(`STRIPE_PREMIUM_MONTHLY_PRICE_ID=${results[0].priceId}`);
  console.log(`STRIPE_PREMIUM_YEARLY_PRICE_ID=${results[1].priceId}`);
  console.log(`STRIPE_BIRTH_CHART_REPORT_PRICE_ID=${results[2].priceId}`);
  console.log(`STRIPE_COMPATIBILITY_REPORT_PRICE_ID=${results[3].priceId}`);
  console.log(`STRIPE_PREMIUM_MONTHLY_LINK=${results[0].paymentLink}`);
  console.log(`STRIPE_PREMIUM_YEARLY_LINK=${results[1].paymentLink}`);
  console.log(`STRIPE_BIRTH_CHART_REPORT_LINK=${results[2].paymentLink}`);
  console.log(`STRIPE_COMPATIBILITY_REPORT_LINK=${results[3].paymentLink}`);
}

function printExpectedProducts() {
  const products = [
    { name: 'Premium Monthly', price: '$4.99/month', type: 'Subscription' },
    { name: 'Premium Yearly', price: '$39.99/year', type: 'Subscription' },
    { name: 'Birth Chart Report', price: '$9.99 one-time', type: 'One-time purchase' },
    { name: 'Compatibility Report', price: '$14.99 one-time', type: 'One-time purchase' },
  ];

  for (const p of products) {
    console.log(`  • ${p.name} — ${p.price} (${p.type})`);
  }
}

setupProducts().catch(console.error);
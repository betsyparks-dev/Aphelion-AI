import { FastifyInstance } from 'fastify';
import { getDb } from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';
import { config } from '../config.js';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

function getStripe(): Stripe | null {
  if (!config.stripe.secretKey) return null;
  return new Stripe(config.stripe.secretKey, { apiVersion: '2025-02-24.acacia' });
}

export function registerSubscriptionRoutes(app: FastifyInstance): void {
  // POST /api/subscription/create — Create a Stripe Checkout Session for subscription
  app.post('/api/subscription/create', { preHandler: [authenticate] }, async (request, reply) => {
    const { plan } = request.body as { plan?: string };
    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return reply.status(400).send({ error: 'Plan must be "monthly" or "yearly".' });
    }

    const priceId = plan === 'monthly' ? config.stripe.priceIds.premiumMonthly : config.stripe.priceIds.premiumYearly;
    if (!priceId) {
      return reply.status(500).send({ error: 'Stripe not configured. Set STRIPE_SECRET_KEY and price IDs.' });
    }

    const stripe = getStripe();
    if (!stripe) {
      return reply.status(500).send({ error: 'Stripe not configured. Set STRIPE_SECRET_KEY.' });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: request.user!.email,
        metadata: { userId: request.user!.userId, plan },
        success_url: 'https://app.astrallens.com/subscription/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://app.astrallens.com/subscription/cancel',
      });

      return reply.send({ url: session.url, sessionId: session.id });
    } catch (err) {
      console.error('Stripe session creation failed:', err);
      return reply.status(500).send({ error: 'Failed to create checkout session.' });
    }
  });

  // POST /api/purchase/create — Create a Stripe Checkout Session for one-time purchase
  app.post('/api/purchase/create', { preHandler: [authenticate] }, async (request, reply) => {
    const { productType } = request.body as { productType?: string };
    if (!productType || !['birth_chart_report', 'compatibility_report'].includes(productType)) {
      return reply.status(400).send({ error: 'productType must be "birth_chart_report" or "compatibility_report".' });
    }

    const priceId = productType === 'birth_chart_report' ? config.stripe.priceIds.birthChartReport : config.stripe.priceIds.compatibilityReport;
    if (!priceId) {
      return reply.status(500).send({ error: 'Stripe not configured. Set price IDs.' });
    }

    const stripe = getStripe();
    if (!stripe) {
      return reply.status(500).send({ error: 'Stripe not configured.' });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: request.user!.email,
        metadata: { userId: request.user!.userId, productType },
        success_url: 'https://app.astrallens.com/purchase/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://app.astrallens.com/purchase/cancel',
      });

      return reply.send({ url: session.url, sessionId: session.id });
    } catch (err) {
      console.error('Stripe session creation failed:', err);
      return reply.status(500).send({ error: 'Failed to create checkout session.' });
    }
  });

  // POST /api/stripe/webhook — Stripe webhook handler
  app.post('/api/stripe/webhook', async (request, reply) => {
    const stripe = getStripe();
    if (!stripe) {
      return reply.status(500).send({ error: 'Stripe not configured.' });
    }

    const sig = request.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        JSON.stringify(request.body),
        sig,
        config.stripe.webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return reply.status(400).send({ error: 'Invalid signature.' });
    }

    const db = getDb();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        const productType = session.metadata?.productType;

        if (!userId) {
          console.warn('Webhook received without userId in metadata');
          break;
        }

        if (session.mode === 'subscription' && plan) {
          // Create subscription record
          const subId = uuidv4();
          db.prepare(`
            INSERT INTO subscriptions (id, user_id, stripe_subscription_id, stripe_customer_id, plan, status, current_period_start, current_period_end)
            VALUES (?, ?, ?, ?, ?, 'active', datetime('now'), datetime('now', '+1 month'))
          `).run(subId, userId, session.subscription?.toString() || '', session.customer?.toString() || '', plan);
          console.log(`Subscription created for user ${userId}: ${plan}`);
        } else if (session.mode === 'payment' && productType) {
          // Create purchase record
          const purchaseId = uuidv4();
          db.prepare(`
            INSERT INTO purchases (id, user_id, stripe_payment_intent_id, product_type, amount, status)
            VALUES (?, ?, ?, ?, ?, 'completed')
          `).run(purchaseId, userId, session.payment_intent?.toString() || '', productType, session.amount_total ? session.amount_total / 100 : 0);
          console.log(`Purchase recorded for user ${userId}: ${productType}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        db.prepare("UPDATE subscriptions SET status = 'canceled', updated_at = datetime('now') WHERE stripe_subscription_id = ?")
          .run(subscription.id);
        console.log(`Subscription ${subscription.id} canceled.`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          db.prepare("UPDATE subscriptions SET status = 'past_due', updated_at = datetime('now') WHERE stripe_subscription_id = ?")
            .run(invoice.subscription.toString());
        }
        break;
      }
    }

    return reply.send({ received: true });
  });

  // GET /api/subscription — Get current user's subscription
  app.get('/api/subscription', { preHandler: [authenticate] }, async (request, reply) => {
    const db = getDb();
    const sub = db.prepare(
      "SELECT id, plan, status, current_period_start, current_period_end, created_at FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1"
    ).get(request.user!.userId);

    return reply.send({ subscription: sub || null });
  });

  // GET /api/purchases — Get user's purchase history
  app.get('/api/purchases', { preHandler: [authenticate] }, async (request, reply) => {
    const db = getDb();
    const purchases = db.prepare(
      'SELECT id, product_type, amount, currency, status, created_at FROM purchases WHERE user_id = ? ORDER BY created_at DESC'
    ).all(request.user!.userId);

    return reply.send({ purchases });
  });
}
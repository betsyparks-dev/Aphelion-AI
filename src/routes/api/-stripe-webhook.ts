/**
 * Stripe webhook endpoint for handling subscription events.
 *
 * Receives events from Stripe (checkout.session.completed) and updates
 * the user's subscription_tier in the database.
 *
 * Events handled:
 *   - checkout.session.completed → upgrade user's subscription_tier
 *   - customer.subscription.updated → sync tier changes
 *   - customer.subscription.deleted → downgrade to free
 *
 * NOTE: In production, verify the webhook signature using STRIPE_WEBHOOK_SECRET.
 * This development version skips signature verification.
 */

import { createAPIFileRoute } from "@tanstack/react-start/api";

// Map Stripe price IDs to subscription tiers
const PRICE_TO_TIER: Record<string, string> = {
  price_1TqyGsDyIytljhWHaI6azC6b: "starter",
  price_1TqyHZDyIytljhWHTcC9cK9J: "pro",
};

export const APIRoute = createAPIFileRoute("/api/stripe-webhook")({
  POST: async ({ request }) => {
    let event: any;

    try {
      const body = await request.json();
      event = body;
    } catch {
      return new Response("Invalid JSON body", { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const customerEmail =
          session.customer_email || session.customer_details?.email;

        if (!customerEmail) {
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Determine tier from price ID
        const priceId =
          session.line_items?.data?.[0]?.price?.id ||
          session.metadata?.price_id ||
          (session.payment_link?.includes("7sY6oHf090SkgimfyO1gs05")
            ? "price_1TqyGsDyIytljhWHaI6azC6b"
            : session.payment_link?.includes("dRm8wPg4dcB25DIcmC1gs06")
              ? "price_1TqyHZDyIytljhWHTcC9cK9J"
              : null);

        const tier = priceId ? PRICE_TO_TIER[priceId] : null;

        if (!tier) {
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Update user's subscription tier in DB
        try {
          const { sql } = await import("~/db");
          const db = sql();
          await db`
            UPDATE users
            SET subscription_tier = ${tier}, updated_at = NOW()
            WHERE email = ${customerEmail}
          `;
          console.log(
            `✅ Upgraded ${customerEmail} to ${tier} plan via Stripe checkout`,
          );
        } catch (dbErr: any) {
          console.error(
            "⚠️ Could not update subscription tier in DB:",
            dbErr.message,
          );
        }

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerEmail =
          subscription.customer_email ||
          subscription.customer_details?.email ||
          subscription.metadata?.email;

        if (!customerEmail) {
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const status = subscription.status;
        const newTier =
          status === "active" || status === "trialing"
            ? PRICE_TO_TIER[subscription.items?.data?.[0]?.price?.id || ""] ||
              "free"
            : "free";

        try {
          const { sql } = await import("~/db");
          const db = sql();
          await db`
            UPDATE users
            SET subscription_tier = ${newTier}, updated_at = NOW()
            WHERE email = ${customerEmail}
          `;
          console.log(
            `✅ Updated ${customerEmail} subscription to ${newTier} (status: ${status})`,
          );
        } catch (dbErr: any) {
          console.error(
            "⚠️ Could not update subscription in DB:",
            dbErr.message,
          );
        }

        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
});
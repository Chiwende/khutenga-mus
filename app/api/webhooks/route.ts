import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { stripe } from '@/lib/stripe/stripe';
import {
  upsertPriceRecord,
  upsertProductRecord,
  manageSubscriptionStatusChange,
} from '@/lib/supabase/supabase-admin';

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export async function POST(request: Request) {
  const body = await request.text();
  const head = await headers();
  const sig = head.get('Stripe-Signature');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error('❌ Error constructing event object', error);
    return new NextResponse(`Webhook Error: ${error}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription;
          console.log(
            '🚀 ~ file: route.ts ~ line 30 ~ subscription',
            subscription
          );
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === 'customer.subscription.created'
          );
          break;
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true,
              checkoutSession.metadata?.supabaseUUID as string | undefined
            );
          }
          break;
        default:
          throw new Error('Unhandled event type');
      }
    } catch (error) {
      console.error('❌ Error processing event', error);
      return new NextResponse(`Webhook Error: ${error}`, { status: 400 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

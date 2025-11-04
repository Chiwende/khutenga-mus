// lib/stripe-client.ts
import { loadStripe, type Stripe as StripeJs } from '@stripe/stripe-js';

let stripePromise: Promise<StripeJs | null>;

export const getStripe = (): Promise<StripeJs | null> => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
    if (!publishableKey) {
      throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing.');
    }

    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

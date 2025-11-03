import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

import { Price, Product } from '@/lib/types/types';
import { stripe } from '@/lib/stripe/stripe';
import { toDateTime } from '../stripe/helpers';
import { Database } from '../db/supabase';

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description!,
    image: product.images[0]!,
    metadata: product.metadata,
  };

  const { error } = await supabaseAdmin.from('products').upsert([productData]);

  if (error) {
    console.error('Error upserting product record', error);
    throw error;
  }

  console.log(`✅ Product record upserted: ${product.id}`);
};

const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    currency: price.currency,
    description: price.nickname!,
    type: price.type,
    unit_amount: price.unit_amount!,
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count,
    // trial_days: price.recurring?.trial_period_days,
    metadata: price.metadata,
  };

  const { error } = await supabaseAdmin.from('prices').upsert([priceData]);

  if (error) {
    console.error('Error upserting price record', error);
    throw error;
  }

  console.log(`✅ Price record upserted: ${price.id}`);
};

const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', uuid)
    .single();

  if (error || !data?.stripe_customer_id) {
    const customerData: { metadata: { supabaseUUID: string }; email: string } =
      {
        metadata: { supabaseUUID: uuid },
        email,
      };

    if (email) customerData.email = email;

    const customer = await stripe.customers.create(customerData);
    const { error: supabaseError } = await supabaseAdmin
      .from('customers')
      .insert([{ id: uuid, stripe_customer_id: customer.id }]);

    if (supabaseError) throw supabaseError;
    console.log(`✅ Customer record created: ${uuid}`);

    return customer.id;
  }

  return data.stripe_customer_id;
};

// 400 /3999/389

const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  const customer = payment_method.customer as string;
  const { name, phone, address, email } = payment_method.billing_details;
  if (!name || !phone || !address || !email) return;

  // @ts-expect-error Stripe types don't allow partial address/phone on update in this version
  await stripe.customers.update(customer, { name, phone, address });
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq('id', uuid);

  if (error) throw error;
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  const { data: customerData, error: customerLookupError } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (customerLookupError || !customerData) {
    throw (
      customerLookupError ?? new Error('Customer not found for subscription')
    );
  }

  const { id: uuid } = customerData;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  });

  const subscriptionData: Database['public']['Tables']['subscriptions']['Insert'] =
    {
      id: subscription.id,
      user_id: uuid,
      metadata: subscription.metadata,
      //@ts-expect-error Stripe's type for status is a union not matching DB enum
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      //@ts-expect-error Stripe omits quantity at top-level in some versions
      quantity: subscription.quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at
        ? toDateTime(subscription.cancel_at).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      current_period_start: subscription.start_date
        ? toDateTime(subscription.start_date).toISOString()
        : undefined,
      current_period_end: subscription.ended_at
        ? toDateTime(subscription.ended_at).toISOString()
        : undefined,
      created: toDateTime(subscription.created).toISOString(),
      ended_at: subscription.ended_at
        ? toDateTime(subscription.ended_at).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? toDateTime(subscription.trial_start).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? toDateTime(subscription.trial_end).toISOString()
        : null,
    };

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);

  if (error) throw error;

  console.log(
    `✅ Subscription record upserted: ${subscription.id} for ${uuid}`
  );

  if (createAction && subscription.default_payment_method && uuid) {
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
  }
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  copyBillingDetailsToCustomer,
  manageSubscriptionStatusChange,
};

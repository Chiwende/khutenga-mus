import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe/stripe';
import { getURL } from '@/lib/stripe/helpers';
import { createOrRetrieveCustomer } from '@/lib/supabase/supabase-admin';
import type { Database } from '@/lib/db/supabase';

export async function POST(request: Request) {
  const { price, quantity = 1, metadata = {} } = await request.json();

  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customer = await createOrRetrieveCustomer({
      uuid: user?.id || '',
      email: user?.email || '',
    });
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'required',
      customer,
      line_items: [{ price: price.id, quantity }],
      mode: 'subscription',
      allow_promotion_codes: true,
      client_reference_id: user.id,
      subscription_data: {
        metadata: {
          ...metadata,
          supabaseUUID: user.id,
        },
      },
      success_url: `${getURL()}/account`,
      cancel_url: `${getURL()}`,
      metadata: {
        ...metadata,
        supabaseUUID: user.id,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

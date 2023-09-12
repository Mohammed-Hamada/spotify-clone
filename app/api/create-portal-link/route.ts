import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { stripe } from '@/libs/stripe';
import { getUrl } from '@/libs/helpers';
import { createOrRetrieveCustomer } from '@/libs/supabaseAdmin';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({
      cookies,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Could not find user');

    const customer = await createOrRetrieveCustomer({
      uuid: user?.id || '',
      email: user?.email || '',
    });

    if (!customer) throw new Error('Could not find customer');

    const session = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getUrl()}/account`,
    });

    return NextResponse?.json({ url: session.url });
  } catch (error: any) {
    console.log(error);
    return new NextResponse('internal server error', { status: 500 });
  }
}

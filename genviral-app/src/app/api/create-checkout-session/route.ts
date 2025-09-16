import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PRICING_PLANS } from '@/lib/credits'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId, planKey } = await request.json()

    if (!userId || !planKey) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const plan = PRICING_PLANS[planKey as keyof typeof PRICING_PLANS]
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: `${plan.credits} video generation credits`,
              images: ['https://your-domain.com/logo.png'], // Replace with your logo
            },
            unit_amount: Math.round(plan.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/payment/cancelled`,
      metadata: {
        userId,
        planKey,
        credits: plan.credits.toString(),
      },
      customer_email: undefined, // Let user enter email
      allow_promotion_codes: true,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
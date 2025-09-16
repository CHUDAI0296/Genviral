import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { addCredits, createPaymentRecord, updatePaymentStatus } from '@/lib/credits'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const { userId, credits, planKey } = session.metadata!
        const paymentIntentId = session.payment_intent as string
        const amount = session.amount_total!

        // Create payment record
        await createPaymentRecord(
          userId,
          paymentIntentId,
          amount,
          parseInt(credits)
        )

        // Add credits to user account
        const success = await addCredits(userId, parseInt(credits))

        if (success) {
          await updatePaymentStatus(paymentIntentId, 'completed')
          console.log(`Successfully added ${credits} credits to user ${userId}`)
        } else {
          await updatePaymentStatus(paymentIntentId, 'failed')
          console.error(`Failed to add credits to user ${userId}`)
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await updatePaymentStatus(paymentIntent.id, 'failed')
        console.log(`Payment failed for payment intent ${paymentIntent.id}`)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await updatePaymentStatus(paymentIntent.id, 'completed')
        console.log(`Payment succeeded for payment intent ${paymentIntent.id}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
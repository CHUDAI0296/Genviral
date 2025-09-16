# Stripe Payment System Setup Guide

## Step 1: Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Sign up for a Stripe account if you don't have one
3. In the API keys section, you'll find:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode)

## Step 2: Update Environment Variables

Replace the placeholder values in `.env.local` with your actual Stripe keys:

```env
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

## Step 3: Create Products and Prices in Stripe

1. Go to [Stripe Products](https://dashboard.stripe.com/products)
2. Create 3 products:

### Basic Pack
- Name: Basic Pack
- Description: 60 video credits
- Price: $4.99 USD
- Copy the Price ID (starts with `price_`)

### Pro Pack
- Name: Pro Pack
- Description: 150 video credits
- Price: $9.99 USD
- Copy the Price ID (starts with `price_`)

### Enterprise Pack
- Name: Enterprise Pack
- Description: 350 video credits
- Price: $19.99 USD
- Copy the Price ID (starts with `price_`)

## Step 4: Update Price IDs

Update the `PRICING_PLANS` in `src/lib/credits.ts` with your actual Stripe Price IDs:

```typescript
export const PRICING_PLANS = {
  basic: {
    stripePriceId: 'price_your_actual_basic_price_id',
    // ... other fields
  },
  pro: {
    stripePriceId: 'price_your_actual_pro_price_id',
    // ... other fields
  },
  enterprise: {
    stripePriceId: 'price_your_actual_enterprise_price_id',
    // ... other fields
  }
}
```

## Step 5: Set Up Webhooks (Optional for now)

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy the webhook secret (starts with `whsec_`)
5. Update `STRIPE_WEBHOOK_SECRET` in `.env.local`

## Step 6: Test the Payment Flow

1. Restart your development server: `npm run dev`
2. Try purchasing credits using Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Declined**: `4000 0000 0000 0002`
   - Use any future expiry date and any 3-digit CVC

## Test Card Numbers for Different Scenarios

- **Visa**: `4242 4242 4242 4242`
- **Visa (debit)**: `4000 0560 0000 0004`
- **Mastercard**: `5555 5555 5555 4444`
- **American Express**: `3782 822463 10005`
- **Declined card**: `4000 0000 0000 0002`

## Important Notes

- Use **test keys** (starting with `sk_test_` and `pk_test_`) during development
- Only use **live keys** (starting with `sk_live_` and `pk_live_`) in production
- Never commit your secret keys to version control
- The webhook setup is optional for basic functionality but required for production

## Troubleshooting

If you get "Invalid API Key" errors:
1. Double-check your API keys are copied correctly
2. Make sure you're using test keys during development
3. Restart your development server after changing environment variables
4. Check the Stripe Dashboard to ensure your account is activated
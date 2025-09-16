'use client'

import { useState } from 'react'
import { AnimatedWrapper } from './AnimatedWrapper'
import { AnimatedCard } from './AnimatedCard'
import { AnimatedButton } from './AnimatedButton'
import { LoadingSpinner } from './LoadingSpinner'
import { PRICING_PLANS } from '@/lib/credits'
import { useAuth } from '@/contexts/AuthContext'
import stripePromise from '@/lib/stripe'

interface PricingCardProps {
  plan: {
    name: string
    price: number
    credits: number
    pricePerCredit: number
    stripePriceId: string
  }
  planKey: string
  popular?: boolean
  onPurchase: (planKey: string) => void
  loading: boolean
}

function PricingCard({ plan, planKey, popular = false, onPurchase, loading }: PricingCardProps) {
  return (
    <AnimatedCard className={`relative p-6 ${popular ? 'ring-2 ring-primary' : ''}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">{plan.name}</h3>

        <div className="space-y-1">
          <div className="text-4xl font-bold">${plan.price}</div>
          <div className="text-muted-foreground">{plan.credits} credits</div>
          <div className="text-sm text-muted-foreground">
            ${plan.pricePerCredit.toFixed(3)} per video
          </div>
        </div>

        <div className="space-y-2 py-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Generate {plan.credits} videos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">HD video quality</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Commercial license</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">24/7 support</span>
          </div>
        </div>

        <AnimatedButton
          variant={popular ? "primary" : "secondary"}
          className="w-full"
          onClick={() => onPurchase(planKey)}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner />
              <span>Processing...</span>
            </div>
          ) : (
            'Purchase Credits'
          )}
        </AnimatedButton>
      </div>
    </AnimatedCard>
  )
}

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  if (!isOpen) return null

  const handlePurchase = async (planKey: string) => {
    if (!user) return

    setLoading(true)

    try {
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to load')

      console.log('Creating checkout session for plan:', planKey)

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: PRICING_PLANS[planKey as keyof typeof PRICING_PLANS].stripePriceId,
          userId: user.id,
          planKey
        }),
      })

      console.log('API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Checkout session creation failed:', errorText)
        throw new Error(`Failed to create checkout session: ${response.status}`)
      }

      const data = await response.json()
      console.log('Received session data:', data)

      if (!data.sessionId) {
        throw new Error('No session ID received from server')
      }

      // Redirect to checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (error) {
        console.error('Stripe checkout error:', error)
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Purchase error:', error)
      // Show user-friendly error message
      alert(`Payment setup failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure Stripe is properly configured.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg">
              Generate amazing videos with AI. Choose the plan that fits your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <AnimatedWrapper
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: 0.1 },
                },
              }}>
              <PricingCard
                plan={PRICING_PLANS.basic}
                planKey="basic"
                onPurchase={handlePurchase}
                loading={loading}
              />
            </AnimatedWrapper>

            <AnimatedWrapper
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: 0.2 },
                },
              }}>
              <PricingCard
                plan={PRICING_PLANS.pro}
                planKey="pro"
                popular={true}
                onPurchase={handlePurchase}
                loading={loading}
              />
            </AnimatedWrapper>

            <AnimatedWrapper
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: 0.3 },
                },
              }}>
              <PricingCard
                plan={PRICING_PLANS.enterprise}
                planKey="enterprise"
                onPurchase={handlePurchase}
                loading={loading}
              />
            </AnimatedWrapper>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>✅ Secure payment powered by Stripe</p>
            <p>✅ Cancel anytime • No hidden fees • Instant credit delivery</p>
          </div>
        </div>
      </div>
    </div>
  )
}
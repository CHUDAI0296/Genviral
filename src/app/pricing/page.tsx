'use client'

import { useState } from 'react'
import { AnimatedWrapper } from '@/components/AnimatedWrapper'
import { AnimatedCard } from '@/components/AnimatedCard'
import { AnimatedButton } from '@/components/AnimatedButton'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { SimpleBreadcrumb } from '@/components/Breadcrumb'
import { PRICING_PLANS } from '@/lib/credits'
import { useAuth } from '@/contexts/AuthContext'
import stripePromise from '@/lib/stripe'
import Link from 'next/link'

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
    <AnimatedCard className={`relative p-8 transition-all duration-300 hover:scale-105 ${popular ? 'ring-2 ring-primary shadow-xl' : ''}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-bold shadow-lg">
            🔥 MOST POPULAR
          </span>
        </div>
      )}

      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <div className="text-5xl font-bold text-primary">${plan.price}</div>
          <div className="text-muted-foreground text-lg">{plan.credits} credits</div>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">
            ${plan.pricePerCredit.toFixed(3)} per video
          </div>
          <div className="text-sm text-green-600 font-medium">
            Save {Math.round((0.1 - plan.pricePerCredit) / 0.1 * 100)}% vs individual pricing
          </div>
        </div>

        <div className="space-y-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm">Generate {plan.credits} AI videos</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm">HD video quality (1080p)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm">Commercial license included</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm">24/7 email support</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm">Instant credit delivery</span>
          </div>
        </div>

        <AnimatedButton
          variant={popular ? "primary" : "secondary"}
          className="w-full font-bold text-lg py-4"
          onClick={() => onPurchase(planKey)}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner />
              <span>Processing...</span>
            </div>
          ) : (
            <>
              {popular && '🚀 '} Buy {plan.name}
            </>
          )}
        </AnimatedButton>
      </div>
    </AnimatedCard>
  )
}

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handlePurchase = async (planKey: string) => {
    if (!user) {
      // Redirect to sign in or show auth modal
      window.location.href = '/#auth'
      return
    }

    setLoading(true)

    try {
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to load')

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

      const { sessionId } = await response.json()

      // Redirect to checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        console.error('Stripe checkout error:', error)
      }
    } catch (error) {
      console.error('Purchase error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center bg-card/80 backdrop-blur-sm border-b border-border shadow-sm">
        <Link href="/" className="flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">GenViral</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link href="/">
            <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Home</span>
          </Link>
          {user && (
            <Link href="/dashboard">
              <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Dashboard</span>
            </Link>
          )}
        </nav>
      </header>

      {/* Breadcrumb */}
      <div className="px-4 lg:px-6 py-4 bg-muted/30">
        <SimpleBreadcrumb items={[{ label: 'Pricing' }]} />
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <AnimatedWrapper>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Generate amazing AI videos with flexible pricing. Each credit allows you to create one high-quality video.
            </p>
          </AnimatedWrapper>

          {/* Free Trial Callout */}
          <AnimatedWrapper>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              New users get 3 free credits to try our service!
            </div>
          </AnimatedWrapper>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
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

        {/* FAQ Section */}
        <AnimatedWrapper>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <AnimatedCard className="p-6">
                <h3 className="font-semibold mb-3">How do credits work?</h3>
                <p className="text-muted-foreground">Each credit allows you to generate one AI video. Credits never expire and can be used anytime.</p>
              </AnimatedCard>

              <AnimatedCard className="p-6">
                <h3 className="font-semibold mb-3">What video formats do you support?</h3>
                <p className="text-muted-foreground">We generate high-quality MP4 videos in 1080p resolution, perfect for all social media platforms.</p>
              </AnimatedCard>

              <AnimatedCard className="p-6">
                <h3 className="font-semibold mb-3">Can I use videos commercially?</h3>
                <p className="text-muted-foreground">Yes! All our plans include a commercial license, so you can use your videos for business purposes.</p>
              </AnimatedCard>

              <AnimatedCard className="p-6">
                <h3 className="font-semibold mb-3">How long does video generation take?</h3>
                <p className="text-muted-foreground">Most videos are generated within 2-5 minutes, depending on complexity and current server load.</p>
              </AnimatedCard>
            </div>
          </div>
        </AnimatedWrapper>

        {/* Security & Trust */}
        <div className="text-center mt-16 pt-12 border-t border-border">
          <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Secure payments by Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Instant credit delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
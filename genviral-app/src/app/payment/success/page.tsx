'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatedWrapper } from '@/components/AnimatedWrapper'
import { AnimatedButton } from '@/components/AnimatedButton'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [paymentVerified, setPaymentVerified] = useState(false)
  const [creditsAdded, setCreditsAdded] = useState(0)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { user } = useAuth()

  useEffect(() => {
    if (sessionId && user) {
      verifyPayment(sessionId)
    }
  }, [sessionId, user])

  const verifyPayment = async (sessionId: string) => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      })

      const data = await response.json()

      if (data.success) {
        setPaymentVerified(true)
        setCreditsAdded(data.credits)
      }
    } catch (error) {
      console.error('Payment verification failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <AnimatedWrapper>
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-xl p-8">
          {paymentVerified ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Payment Successful! 🎉
              </h1>

              <p className="text-gray-600 mb-6">
                Thank you for your purchase! <strong>{creditsAdded} credits</strong> have been added to your account.
              </p>

              <div className="space-y-3">
                <Link href="/#hero">
                  <AnimatedButton variant="primary" className="w-full">
                    Start Creating Videos
                  </AnimatedButton>
                </Link>

                <Link href="/dashboard">
                  <AnimatedButton variant="secondary" className="w-full">
                    View Dashboard
                  </AnimatedButton>
                </Link>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Receipt will be sent to your email address
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Payment Verification Failed
              </h1>

              <p className="text-gray-600 mb-6">
                We could not verify your payment. Please contact support if you believe this is an error.
              </p>

              <div className="space-y-3">
                <Link href="/">
                  <AnimatedButton variant="primary" className="w-full">
                    Go Home
                  </AnimatedButton>
                </Link>

                <AnimatedButton variant="secondary" className="w-full">
                  Contact Support
                </AnimatedButton>
              </div>
            </>
          )}
        </div>
      </AnimatedWrapper>
    </div>
  )
}
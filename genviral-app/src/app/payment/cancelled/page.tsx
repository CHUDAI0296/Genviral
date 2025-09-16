'use client'

import { AnimatedWrapper } from '@/components/AnimatedWrapper'
import { AnimatedButton } from '@/components/AnimatedButton'
import Link from 'next/link'

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange/10 via-background to-yellow/10">
      <AnimatedWrapper>
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-xl p-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>

          <p className="text-gray-600 mb-6">
            Your payment was cancelled. No charges were made to your account.
          </p>

          <div className="space-y-3">
            <Link href="/">
              <AnimatedButton variant="primary" className="w-full">
                Try Again
              </AnimatedButton>
            </Link>

            <Link href="/">
              <AnimatedButton variant="secondary" className="w-full">
                Go Home
              </AnimatedButton>
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Need help? Contact our support team
          </p>
        </div>
      </AnimatedWrapper>
    </div>
  )
}
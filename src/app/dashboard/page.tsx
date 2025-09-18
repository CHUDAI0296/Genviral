'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState, useCallback } from 'react'
import { AnimatedWrapper } from '@/components/AnimatedWrapper'
import { AnimatedCard } from '@/components/AnimatedCard'
import { AnimatedButton } from '@/components/AnimatedButton'
import { CreditsDisplay } from '@/components/CreditsDisplay'
import { PricingModal } from '@/components/PricingModal'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { SimpleBreadcrumb } from '@/components/Breadcrumb'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { VideoGeneration, Payment } from '@/lib/credits'

export default function DashboardPage() {
  const { user, loading, refreshCredits } = useAuth()
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [videoGenerations, setVideoGenerations] = useState<VideoGeneration[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  const loadUserData = useCallback(async () => {
    if (!user) return

    setDataLoading(true)
    try {
      // Load video generations
      const { data: generations } = await supabase
        .from('video_generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setVideoGenerations(generations || [])

      // Load payments
      const { data: paymentData } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setPayments(paymentData || [])
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setDataLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user?.id]) // Only depend on user.id instead of the entire user object and loadUserData

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Please Sign In</h1>
          <p className="text-muted-foreground">You need to be signed in to view your dashboard.</p>
          <Link href="/">
            <AnimatedButton variant="primary">Go Home</AnimatedButton>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
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
          <AnimatedButton
            variant="primary"
            onClick={() => setIsPricingModalOpen(true)}
          >
            Buy Credits
          </AnimatedButton>
        </nav>
      </header>

      {/* Breadcrumb */}
      <div className="px-4 lg:px-6 py-4 bg-muted/30">
        <SimpleBreadcrumb items={[{ label: 'Dashboard' }]} />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <AnimatedWrapper>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.email}</p>
          </AnimatedWrapper>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Account Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Credits Card */}
            <AnimatedWrapper>
              <AnimatedCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Account Balance</h3>
                  <button
                    onClick={refreshCredits}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <CreditsDisplay showDetails={true} />
                <div className="mt-4">
                  <AnimatedButton
                    variant="primary"
                    className="w-full"
                    onClick={() => setIsPricingModalOpen(true)}
                  >
                    Buy More Credits
                  </AnimatedButton>
                </div>
              </AnimatedCard>
            </AnimatedWrapper>

            {/* Quick Actions */}
            <AnimatedWrapper>
              <AnimatedCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/#hero">
                    <AnimatedButton variant="secondary" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Generate New Video
                    </AnimatedButton>
                  </Link>

                  <AnimatedButton
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={() => setIsPricingModalOpen(true)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    View Pricing Plans
                  </AnimatedButton>
                </div>
              </AnimatedCard>
            </AnimatedWrapper>
          </div>

          {/* Right Column - Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Video Generations */}
            <AnimatedWrapper>
              <AnimatedCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Video Generations</h3>
                {dataLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : videoGenerations.length > 0 ? (
                  <div className="space-y-4">
                    {videoGenerations.map((generation) => (
                      <div key={generation.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium truncate">{generation.topic}</h4>
                          <p className="text-sm text-muted-foreground">{formatDate(generation.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(generation.status)}
                          {generation.video_url && (
                            <Link href={generation.video_url} target="_blank">
                              <AnimatedButton variant="secondary">
                                View Video
                              </AnimatedButton>
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-medium mb-2 text-black">No videos yet</h4>
                    <p className="text-black mb-4">Generate your first video to see it here</p>
                    <Link href="/#hero">
                      <AnimatedButton variant="primary">
                        Generate Your First Video
                      </AnimatedButton>
                    </Link>
                  </div>
                )}
              </AnimatedCard>
            </AnimatedWrapper>

            {/* Payment History */}
            <AnimatedWrapper>
              <AnimatedCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                {dataLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{payment.credits_purchased} Credits</h4>
                          <p className="text-sm text-muted-foreground">{formatDate(payment.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">${(payment.amount / 100).toFixed(2)}</span>
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h4 className="font-medium mb-2 text-black">Get More Credits</h4>
                    <p className="text-black mb-4">Purchase credits to generate more videos</p>
                  </div>
                )}
              </AnimatedCard>
            </AnimatedWrapper>
          </div>
        </div>
      </div>

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
    </div>
  )
}
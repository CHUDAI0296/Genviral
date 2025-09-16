'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from './LoadingSpinner'

interface CreditsDisplayProps {
  showDetails?: boolean
  className?: string
}

export function CreditsDisplay({ showDetails = false, className = '' }: CreditsDisplayProps) {
  const { credits, creditsLoading, user } = useAuth()

  if (!user) return null

  if (creditsLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <LoadingSpinner />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  const currentCredits = credits?.credits || 0
  const totalPurchased = credits?.total_purchased || 0
  const totalUsed = credits?.total_used || 0

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
        <span className="font-semibold text-lg">{currentCredits} Credits</span>
        {currentCredits <= 5 && (
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
            Low Balance
          </span>
        )}
      </div>

      {showDetails && (
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Total Purchased:</span>
            <span className="font-medium">{totalPurchased}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Used:</span>
            <span className="font-medium">{totalUsed}</span>
          </div>
          <div className="flex justify-between">
            <span>Current Balance:</span>
            <span className="font-medium text-primary">{currentCredits}</span>
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        1 credit = 1 video generation
      </div>
    </div>
  )
}

// Compact header version
export function HeaderCreditsDisplay() {
  const { credits, creditsLoading, user } = useAuth()

  if (!user) return null

  if (creditsLoading) {
    return (
      <div className="flex items-center gap-1">
        <LoadingSpinner />
      </div>
    )
  }

  const currentCredits = credits?.credits || 0

  return (
    <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
      <div className="w-2 h-2 bg-primary rounded-full"></div>
      <span className="text-sm font-medium">{currentCredits}</span>
      {currentCredits <= 5 && (
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      )}
    </div>
  )
}
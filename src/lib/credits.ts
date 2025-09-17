import { supabase } from './supabase'

export interface UserCredits {
  id: string
  user_id: string
  credits: number
  total_purchased: number
  total_used: number
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  stripe_payment_intent_id: string
  amount: number
  credits_purchased: number
  status: string
  created_at: string
  updated_at: string
}

export interface VideoGeneration {
  id: string
  user_id: string
  topic: string
  video_url: string | null
  credits_used: number
  status: string
  created_at: string
  updated_at: string
}

export const PRICING_PLANS = {
  basic: {
    name: 'Basic Pack',
    price: 4.99,
    credits: 60,
    pricePerCredit: 0.083,
    stripePriceId: 'price_1234567890_basic_60_credits', // TODO: Replace with actual Stripe price ID from Dashboard
  },
  pro: {
    name: 'Pro Pack',
    price: 9.99,
    credits: 150,
    pricePerCredit: 0.067,
    stripePriceId: 'price_1234567890_pro_150_credits', // TODO: Replace with actual Stripe price ID from Dashboard
  },
  enterprise: {
    name: 'Enterprise Pack',
    price: 19.99,
    credits: 350,
    pricePerCredit: 0.057,
    stripePriceId: 'price_1234567890_enterprise_350_credits', // TODO: Replace with actual Stripe price ID from Dashboard
  }
}

// Get user credits
export async function getUserCredits(userId: string): Promise<UserCredits | null> {
  try {
    const { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // If table doesn't exist, return a default credits object
      if (error.code === 'PGRST205') {
        console.warn('user_credits table not found. Please create the database tables first.')
        return {
          id: 'temp',
          user_id: userId,
          credits: 0,
          total_purchased: 0,
          total_used: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
      console.error('Error fetching user credits:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Unexpected error fetching user credits:', error)
    return null
  }
}

// Check if user has enough credits
export async function hasEnoughCredits(userId: string, requiredCredits: number = 1): Promise<boolean> {
  const credits = await getUserCredits(userId)
  // If table doesn't exist, always return false (no credits)
  return credits ? credits.credits >= requiredCredits : false
}

// Deduct credits for video generation
export async function deductCredits(userId: string, generationId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('use_credit_for_generation', {
        p_user_id: userId,
        p_generation_id: generationId
      })

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('table') || error.message?.includes('function')) {
        console.warn('Database tables/functions not set up. Cannot deduct credits.')
        return false
      }
      console.error('Error deducting credits:', error)
      return false
    }

    return data
  } catch (error) {
    console.error('Unexpected error deducting credits:', error)
    return false
  }
}

// Add credits after successful payment
export async function addCredits(userId: string, credits: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .rpc('add_credits_after_payment', {
        p_user_id: userId,
        p_credits: credits
      })

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('table') || error.message?.includes('function')) {
        console.warn('Database tables/functions not set up. Cannot add credits.')
        return false
      }
      console.error('Error adding credits:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error adding credits:', error)
    return false
  }
}

// Create video generation record
export async function createVideoGeneration(userId: string, topic: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('video_generations')
      .insert({
        user_id: userId,
        topic: topic,
        status: 'pending'
      })
      .select('id')
      .single()

    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('video_generations table not found. Skipping record creation.')
        return 'temp-id-' + Date.now()
      }
      console.error('Error creating video generation:', error)
      return null
    }

    return data.id
  } catch (error) {
    console.error('Unexpected error creating video generation:', error)
    return null
  }
}

// Update video generation with result
export async function updateVideoGeneration(
  generationId: string,
  videoUrl: string,
  status: 'completed' | 'failed'
): Promise<boolean> {
  try {
    if (generationId.startsWith('temp-id-')) {
      console.warn('Skipping update for temp generation ID')
      return true
    }

    const { error } = await supabase
      .from('video_generations')
      .update({
        video_url: videoUrl,
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', generationId)

    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('video_generations table not found. Skipping update.')
        return true
      }
      console.error('Error updating video generation:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error updating video generation:', error)
    return false
  }
}

// Create payment record
export async function createPaymentRecord(
  userId: string,
  stripePaymentIntentId: string,
  amount: number,
  credits: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        stripe_payment_intent_id: stripePaymentIntentId,
        amount: amount,
        credits_purchased: credits,
        status: 'pending'
      })

    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('payments table not found. Skipping payment record creation.')
        return true
      }
      console.error('Error creating payment record:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error creating payment record:', error)
    return false
  }
}

// Update payment status
export async function updatePaymentStatus(
  stripePaymentIntentId: string,
  status: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('payments')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_payment_intent_id', stripePaymentIntentId)

    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('payments table not found. Skipping payment status update.')
        return true
      }
      console.error('Error updating payment status:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error updating payment status:', error)
    return false
  }
}
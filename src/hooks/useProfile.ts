import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { UserProfile } from '@/types/auth'

export function useProfile(userId?: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    if (error) {
      setError(error.message)
    }
    setProfile((data as unknown as UserProfile) || null)
    setLoading(false)
  }, [userId])

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!userId) throw new Error('No user id')
      const merged: Partial<UserProfile> = { ...updates, updated_at: new Date().toISOString() }
      const { data, error } = await supabase
        .from('profiles')
        .update(merged)
        .eq('id', userId)
        .select('*')
        .maybeSingle()
      if (error) throw error
      setProfile(data as unknown as UserProfile)
    },
    [userId]
  )

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { profile, loading, error, fetchProfile, updateProfile }
}



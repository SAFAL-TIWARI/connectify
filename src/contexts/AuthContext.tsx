import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile, SignupData } from '@/types/auth';

type Provider = 'google' | 'github' | 'linkedin'

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: SignupData) => Promise<void>;
  signIn: (email: string, password: string, selectedRole?: string, rememberMe?: boolean) => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<string>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  getRememberedCredentials: () => { email: string; role: string } | null;
  clearRememberedCredentials: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function upsertProfile(userId: string, email: string, partial: Partial<UserProfile>) {
  const payload: Partial<UserProfile> & { id: string; email: string } = {
    id: userId,
    email,
    ...partial,
  }
  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' })
  if (error) throw error
}

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data as unknown as UserProfile | null
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const { data } = await supabase.auth.getSession()
        const currentUser = data.session?.user ?? null
        setUser(currentUser)
        
        if (currentUser) {
          try {
            const dbProfile = await fetchProfile(currentUser.id)
            setProfile(dbProfile)
          } catch (e) {
            console.error('Error fetching initial profile:', e)
            setProfile(null)
          }
        } else {
          setProfile(null)
        }
      } catch (e) {
        console.error('Error getting session:', e)
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }
    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      const nextUser = session?.user ?? null
      setUser(nextUser)
      
      if (nextUser) {
        // Don't set loading to true here as it causes UI flicker
        try {
          let dbProfile = await fetchProfile(nextUser.id)
          
          // If profile doesn't exist and this is a confirmed signup, create it from user metadata
          if (!dbProfile && event === 'SIGNED_IN' && nextUser.user_metadata) {
            const metadata = nextUser.user_metadata
            try {
              await upsertProfile(nextUser.id, nextUser.email ?? '', {
                role: (metadata.role as any) || 'student',
                full_name: metadata.full_name,
                phone_number: metadata.phone_number,
                date_of_birth: metadata.date_of_birth,
                address: metadata.address,
                city: metadata.city,
                country: metadata.country,
                linkedin_profile: metadata.linkedin_profile,
                graduation_year: metadata.graduation_year,
                major_field: metadata.major_field,
                current_job_title: metadata.current_job_title,
                company: metadata.company,
                bio: metadata.bio,
                skills: metadata.skills ? metadata.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : undefined,
              } as Partial<UserProfile>)
              dbProfile = await fetchProfile(nextUser.id)
            } catch (upsertError) {
              console.error('Error creating profile from metadata:', upsertError);
            }
          }
          
          // For social logins, validate role selection after OAuth redirect
          if (event === 'SIGNED_IN' && dbProfile) {
            const selectedLoginRole = localStorage.getItem('selectedLoginRole')
            if (selectedLoginRole && selectedLoginRole !== dbProfile.role) {
              // Role mismatch - sign out and show error
              localStorage.removeItem('selectedLoginRole')
              await supabase.auth.signOut()
              console.error(`Role mismatch: Selected ${selectedLoginRole}, but account is ${dbProfile.role}`)
              // This will be handled by the component's auth state listener
              return
            } else if (selectedLoginRole) {
              // Clear the stored role on successful validation
              localStorage.removeItem('selectedLoginRole')
            }
          }
          
          setProfile(dbProfile)
        } catch (e) {
          console.error('Error in auth state change:', e)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, userData: SignupData) => {
    setLoading(true)
    
    // Include user data in metadata for email confirmation flow
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          role: userData.role,
          full_name: userData.fullName,
          phone_number: userData.phoneNumber,
          date_of_birth: userData.dateOfBirth,
          address: userData.address,
          city: userData.city,
          country: userData.country,
          linkedin_profile: userData.linkedinProfile,
          graduation_year: userData.graduationYear,
          major_field: userData.majorField,
          current_job_title: userData.currentJobTitle,
          company: userData.company,
          bio: userData.bio,
          skills: userData.skills,
        }
      }
    })
    
    if (error) {
      setLoading(false)
      throw error
    }
    
    const createdUser = data.user
    const sessionUser = data.session?.user
    
    // Only upsert immediately if we have a session JWT (email confirmations disabled)
    if (createdUser && sessionUser && sessionUser.id === createdUser.id) {
      await upsertProfile(createdUser.id, createdUser.email ?? email, {
        role: (userData.role as any) || 'student',
        full_name: userData.fullName,
        phone_number: userData.phoneNumber,
        date_of_birth: userData.dateOfBirth,
        address: userData.address,
        city: userData.city,
        country: userData.country,
        linkedin_profile: userData.linkedinProfile,
        graduation_year: userData.graduationYear,
        major_field: userData.majorField,
        current_job_title: userData.currentJobTitle,
        company: userData.company,
        bio: userData.bio,
        skills: userData.skills ? userData.skills.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      } as Partial<UserProfile>)
      const dbProfile = await fetchProfile(createdUser.id)
      setUser(createdUser)
      setProfile(dbProfile)
    }
    setLoading(false)
  }

  const signIn = async (email: string, password: string, selectedRole?: string, rememberMe?: boolean) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoading(false)
      throw error
    }
    const sessionUser = data.user
    if (sessionUser) {
      // Ensure profile exists and get user's registered role
      let dbProfile = await fetchProfile(sessionUser.id)
      if (!dbProfile) {
        // Use role from user metadata if available, otherwise default to 'student'
        const userRole = sessionUser.user_metadata?.role || 'student'
        await upsertProfile(sessionUser.id, sessionUser.email ?? email, {
          role: userRole,
          full_name: sessionUser.user_metadata?.full_name,
          profile_image_url: sessionUser.user_metadata?.avatar_url,
        })
        dbProfile = await fetchProfile(sessionUser.id)
      }
      
      // Validate that selected role matches registered role
      if (selectedRole && dbProfile?.role && selectedRole !== dbProfile.role) {
        // Sign out the user since they tried to login with wrong role
        await supabase.auth.signOut()
        setLoading(false)
        const registeredRoleLabel = ['alumni', 'student', 'faculty', 'employer', 'institute', 'admin']
          .find(role => role === dbProfile.role) || dbProfile.role
        const selectedRoleLabel = ['alumni', 'student', 'faculty', 'employer', 'institute', 'admin']
          .find(role => role === selectedRole) || selectedRole
        throw new Error(`Access denied. Your account is registered as "${registeredRoleLabel.charAt(0).toUpperCase() + registeredRoleLabel.slice(1)}", but you selected "${selectedRoleLabel.charAt(0).toUpperCase() + selectedRoleLabel.slice(1)}". Please select the correct role.`)
      }
      
      // Handle remember me functionality
      if (rememberMe && dbProfile?.role) {
        localStorage.setItem('rememberedCredentials', JSON.stringify({
          email: email,
          role: dbProfile.role
        }))
      } else if (rememberMe === false) {
        // Explicitly clear if user unchecked remember me
        localStorage.removeItem('rememberedCredentials')
      }
      
      setProfile(dbProfile)
    }
    setLoading(false)
  }

  const signInWithProvider = async (provider: Provider) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    })
    setLoading(false)
    if (error) throw error
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        // Even if there's an error, clear local state
      }
    } catch (e) {
      console.error('Sign out exception:', e)
    } finally {
      // Always clear local state regardless of API response
      setUser(null)
      setProfile(null)
      // Don't clear remembered credentials on sign out - user might want to sign back in
      // Don't set loading to true/false here as it can cause UI flicker
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('Not authenticated')
    const merged: Partial<UserProfile> = {
      ...profile,
      ...updates,
      updated_at: new Date().toISOString(),
    }
    console.log('Updating profile with data:', merged);
    const { data, error } = await supabase
      .from('profiles')
      .update(merged)
      .eq('id', user.id)
      .select('*')
      .maybeSingle()
    if (error) {
      console.error('Database update error:', error);
      throw error;
    }
    console.log('Profile updated successfully:', data);
    setProfile(data as unknown as UserProfile)
  }

  const uploadProfileImage = async (file: File): Promise<string> => {
    if (!user) throw new Error('Not authenticated')
    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('profile-images').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })
    if (uploadError) throw uploadError
    const { data: publicUrl } = supabase.storage.from('profile-images').getPublicUrl(filePath)
    const url = publicUrl.publicUrl
    await updateProfile({ profile_image_url: url })
    return url
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  }

  const getRememberedCredentials = (): { email: string; role: string } | null => {
    try {
      const stored = localStorage.getItem('rememberedCredentials')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  const clearRememberedCredentials = () => {
    localStorage.removeItem('rememberedCredentials')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signInWithProvider,
        signOut,
        updateProfile,
        uploadProfileImage,
        resetPassword,
        updatePassword,
        getRememberedCredentials,
        clearRememberedCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

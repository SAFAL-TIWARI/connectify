export type UserRole = 'alumni' | 'student' | 'faculty' | 'employer' | 'institute' | 'admin'

export interface Education {
  degree?: string
  university?: string
  gpa?: string
}

export interface Experience {
  position?: string
  company?: string
  duration?: string
  description?: string
}

export interface SocialProfiles {
  github?: string
  linkedin?: string
  twitter?: string
  instagram?: string
  facebook?: string
  website?: string
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  role: UserRole
  phone_number?: string
  date_of_birth?: string
  address?: string
  city?: string
  country?: string
  linkedin_profile?: string
  graduation_year?: string
  major_field?: string
  current_job_title?: string
  company?: string
  bio?: string
  skills?: string[]
  profile_image_url?: string
  work_start_year?: string
  work_end_year?: string
  education?: Education
  experience?: Experience[]
  achievements?: string[]
  social_profiles?: SocialProfiles
  created_at: string
  updated_at: string
}

export interface SignupData {
  fullName: string
  email: string
  password: string
  role: UserRole | string
  phoneNumber?: string
  dateOfBirth?: string
  address?: string
  city?: string
  country?: string
  linkedinProfile?: string
  graduationYear?: string
  majorField?: string
  currentJobTitle?: string
  company?: string
  bio?: string
  skills?: string
}

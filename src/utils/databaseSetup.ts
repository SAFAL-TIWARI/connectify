import { supabase } from '@/lib/supabase';

export const checkAndCreateProfileColumns = async () => {
  try {
    // Test if we can update a profile with the new columns
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      console.log('No authenticated user');
      return;
    }

    // Try to update with the new columns to see if they exist
    const testUpdate = {
      education: { degree: 'test', university: 'test', gpa: 'test' },
      experience: [{ position: 'test', company: 'test', duration: 'test', description: 'test' }],
      achievements: ['test achievement']
    };

    const { error } = await supabase
      .from('profiles')
      .update(testUpdate)
      .eq('id', user.user.id);

    if (error) {
      console.error('Database columns missing or incorrect type:', error);
      
      // If columns don't exist, we need to create them
      // This would typically be done through Supabase dashboard or migrations
      console.log('You need to add these columns to your profiles table:');
      console.log('1. education (jsonb)');
      console.log('2. experience (jsonb)');
      console.log('3. achievements (jsonb)');
      
      return false;
    } else {
      console.log('Database columns exist and are working correctly');
      return true;
    }
  } catch (error) {
    console.error('Error checking database columns:', error);
    return false;
  }
};

// SQL commands to run in Supabase SQL editor
export const getCreateColumnSQL = () => {
  return `
-- Add missing columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS education jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS experience jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS achievements jsonb DEFAULT '[]';

-- Update existing profiles to have default values
UPDATE profiles 
SET 
  education = COALESCE(education, '{}'),
  experience = COALESCE(experience, '[]'),
  achievements = COALESCE(achievements, '[]')
WHERE 
  education IS NULL 
  OR experience IS NULL 
  OR achievements IS NULL;
`;
};
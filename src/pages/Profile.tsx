import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { UserProfile } from '@/types/auth';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Plus, Trash2, Github, Instagram, Twitter, Facebook, Linkedin, Globe, Link2, FileText, Trophy, Eye, ChevronRight, Download, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateResumePDF, downloadPDF, shareResume, ProfileData } from '@/utils/pdfGenerator';
import { checkAndCreateProfileColumns, getCreateColumnSQL } from '@/utils/databaseSetup';

// Dropdown options
const professionalTitles = [
  'Software Engineer',
  'Senior Software Engineer',
  'Lead Software Engineer',
  'Principal Software Engineer',
  'Software Architect',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Data Analyst',
  'Product Manager',
  'Project Manager',
  'UX/UI Designer',
  'Business Analyst',
  'Quality Assurance Engineer',
  'System Administrator',
  'Database Administrator',
  'Cybersecurity Specialist',
  'Machine Learning Engineer',
  'Mobile App Developer',
  'Cloud Engineer',
  'Technical Lead',
  'Engineering Manager',
  'CTO',
  'Consultant',
  'Freelancer',
  'Entrepreneur',
  'Student',
  'Other'
];

// Generate graduation years (from 1970 to current year + 4)
const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: currentYear + 4 - 1970 + 1 }, (_, i) => (currentYear + 4 - i).toString());

// Generate work period years (from 1980 to current year)
const workYears = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => (currentYear - i).toString());

type ProfileView = {
  name: string;
  title: string;
  graduationYear: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  profileImage: string;
  about: string;
  currentPosition: string;
  company: string;
  workStartYear: string;
  workEndYear: string;
  skills: string[];
  education: { degree: string; university: string; gpa: string };
  experience: Array<{ position: string; company: string; duration: string; description: string }>;
  achievements: string[];
  socialProfiles: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

// Default minimal profile view when missing fields
const defaultProfileData: ProfileView = {
  name: '',
  title: '',
  graduationYear: '',
  email: '',
  phone: '',
  location: '',
  joinDate: '',
  profileImage: '',
  about: '',
  currentPosition: '',
  company: '',
  workStartYear: '',
  workEndYear: 'Present',
  skills: [] as string[],
  education: {
    degree: '',
    university: '',
    gpa: ''
  },
  experience: [] as Array<{ position: string; company: string; duration: string; description: string }>,
  achievements: [] as string[],
  socialProfiles: {
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    facebook: '',
    website: ''
  }
};

const Profile = () => {
  const { user, profile: dbProfile, updateProfile, uploadProfileImage, loading } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileView>(defaultProfileData);
  const [editData, setEditData] = useState<ProfileView>(defaultProfileData);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [openSocialPopover, setOpenSocialPopover] = useState<string | null>(null);
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false);
  const { toast } = useToast();

  // Mock user stats data
  const userStats = {
    profileViews: 1,
    globalRank: 8576,
    totalPoints: 100,
    totalBadges: 4
  };

  // Redirect to login if not authenticated (but only after loading is complete)
  useEffect(() => {
    if (!loading && !user) {
      // Clear cached profile data when user is not authenticated
      try {
        localStorage.removeItem('connectify_profile_cache');
      } catch (error) {
        console.log('Error clearing profile cache:', error);
      }
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Load profile from localStorage on component mount (for faster initial render during refresh)
  useEffect(() => {
    try {
      const cachedProfile = localStorage.getItem('connectify_profile_cache');
      if (cachedProfile && !profileData.name) {
        const parsed = JSON.parse(cachedProfile);
        setProfileData(parsed);
        setEditData(parsed);
      }
    } catch (error) {
      console.log('No cached profile data or error parsing:', error);
    }
  }, []);

  // Check database compatibility on component mount
  useEffect(() => {
    const checkDatabase = async () => {
      const isCompatible = await checkAndCreateProfileColumns();
      if (!isCompatible) {
        console.log('Database setup required. Run this SQL in your Supabase dashboard:');
        console.log(getCreateColumnSQL());
        toast({
          title: "Database Setup Required",
          description: "Please check the console for SQL commands to run in your Supabase dashboard.",
          variant: "destructive"
        });
      }
    };
    
    if (user) {
      checkDatabase();
    }
  }, [user, toast]);

  // Load profile from Supabase
  useEffect(() => {
    if (user && dbProfile) {
      const transformed = {
        name: dbProfile.full_name || '',
        title: dbProfile.current_job_title || dbProfile.role || '',
        graduationYear: dbProfile.graduation_year || '',
        email: dbProfile.email || '',
        phone: dbProfile.phone_number || '',
        location: dbProfile.city && dbProfile.country ? `${dbProfile.city}, ${dbProfile.country}` : '',
        joinDate: dbProfile.created_at ? `Joined ${new Date(dbProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : '',
        profileImage: dbProfile.profile_image_url || '',
        about: dbProfile.bio || '',
        currentPosition: dbProfile.current_job_title || '',
        company: dbProfile.company || '',
        workStartYear: dbProfile.work_start_year || '',
        workEndYear: dbProfile.work_end_year || 'Present',
        skills: dbProfile.skills || [],
        education: dbProfile.education || {
          degree: dbProfile.major_field ? `Bachelor of Science in ${dbProfile.major_field}` : '',
          university: '',
          gpa: '',
        },
        experience: (dbProfile.experience as any) || [],
        achievements: dbProfile.achievements || [],
        socialProfiles: (dbProfile.social_profiles as ProfileView['socialProfiles']) || defaultProfileData.socialProfiles,
      } as ProfileView
      
      // Always update with fresh data from database
      setProfileData(transformed)
      setEditData(transformed)
      
      // Cache the profile data for faster loading on refresh
      try {
        localStorage.setItem('connectify_profile_cache', JSON.stringify(transformed));
      } catch (error) {
        console.log('Error caching profile data:', error);
      }
    }
  }, [user, dbProfile]);

 

  const handleEditClick = () => {
    // Initialize edit form with current data, ensuring at least one empty entry for experience and achievements if none exist
    const initData = {
      ...profileData,
      experience: profileData.experience.length > 0 ? profileData.experience : [{
        position: '',
        company: '',
        duration: '',
        description: ''
      }],
      achievements: profileData.achievements.length > 0 ? profileData.achievements : ['']
    };
    setEditData(initData);
    setIsEditDialogOpen(true);
  };

  const handleSave = async () => {
    // Filter out empty experience entries and achievements
    const filteredExperience = editData.experience.filter(exp => 
      exp.position.trim() || exp.company.trim() || exp.duration.trim() || exp.description.trim()
    );
    const filteredAchievements = editData.achievements.filter(achievement => 
      achievement.trim()
    );

    const updatedData = {
      ...editData,
      experience: filteredExperience,
      achievements: filteredAchievements
    };

    setProfileData(updatedData);
    setIsEditDialogOpen(false);
    try {
      const profileUpdate = {
        full_name: updatedData.name,
        email: updatedData.email,
        phone_number: updatedData.phone,
        current_job_title: updatedData.currentPosition,
        company: updatedData.company,
        bio: updatedData.about,
        skills: updatedData.skills,
        graduation_year: updatedData.graduationYear,
        major_field: updatedData.education.degree?.replace('Bachelor of Science in ', ''),
        social_profiles: updatedData.socialProfiles as any,
        work_start_year: updatedData.workStartYear,
        work_end_year: updatedData.workEndYear,
        city: updatedData.location.split(',')[0]?.trim(),
        country: updatedData.location.split(',')[1]?.trim(),
        education: updatedData.education,
        experience: updatedData.experience,
        achievements: updatedData.achievements,
      } as Partial<UserProfile>;
      
      console.log('Saving profile data:', profileUpdate);
      await updateProfile(profileUpdate);
      toast({ title: 'Profile Updated', description: 'Your profile has been saved successfully.' })
    } catch (e: any) {
      console.error('Profile update error:', e);
      
      let errorMessage = 'Could not save your profile.';
      if (e?.message?.includes('column') && e?.message?.includes('does not exist')) {
        errorMessage = 'Database columns missing. Please check the console for setup instructions.';
        console.log('Missing database columns. Run this SQL in your Supabase dashboard:');
        console.log(getCreateColumnSQL());
      } else if (e?.message) {
        errorMessage = e.message;
      }
      
      toast({ 
        title: 'Update failed', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    }
  };

  const handleCancel = () => {
    setEditData(profileData); // Reset edit data to current profile data
    setIsEditDialogOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillsChange = (skillsString: string) => {
    const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setEditData(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  const handleEducationChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [field]: value
      }
    }));
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    setEditData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        position: '',
        company: '',
        duration: '',
        description: ''
      }]
    }));
  };

  const removeExperience = (index: number) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleAchievementChange = (index: number, value: string) => {
    setEditData(prev => ({
      ...prev,
      achievements: prev.achievements.map((achievement, i) =>
        i === index ? value : achievement
      )
    }));
  };

  const addAchievement = () => {
    setEditData(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }));
  };

  const removeAchievement = (index: number) => {
    setEditData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const handleSocialProfileChange = (platform: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      socialProfiles: {
        ...prev.socialProfiles,
        [platform]: value
      }
    }));
  };

  const saveSocialProfile = (platform: string) => {
    setOpenSocialPopover(null);
    toast({
      title: "Social Profile Updated",
      description: `Your ${platform} profile has been saved.`,
    });
  };

  // Resume functionality handlers
  const handleCreateResume = () => {
    setIsResumeDialogOpen(true);
  };

  const handleFetchFromProfile = () => {
    setIsResumeDialogOpen(false);
    setIsTemplateDialogOpen(true);
  };

  const handleCreateOwn = () => {
    setIsResumeDialogOpen(false);
    toast({
      title: "Feature Coming Soon",
      description: "Custom resume builder will be available soon!",
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsTemplateDialogOpen(false);
    setIsResumePreviewOpen(true);
  };

  const handleDownloadResume = async () => {
    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we create your resume.",
      });

      const pdfData: ProfileData = {
        name: profileData.name,
        title: profileData.title,
        graduationYear: profileData.graduationYear,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        about: profileData.about,
        currentPosition: profileData.currentPosition,
        company: profileData.company,
        skills: profileData.skills,
        education: profileData.education,
        experience: profileData.experience,
        achievements: profileData.achievements
      };

      const pdfBlob = await generateResumePDF(pdfData, selectedTemplate || 'classic');
      const filename = `${profileData.name.replace(/\s+/g, '_')}_Resume.pdf`;
      downloadPDF(pdfBlob, filename);

      toast({
        title: "Download Complete!",
        description: "Your resume has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShareResume = async () => {
    try {
      toast({
        title: "Preparing to share...",
        description: "Getting your resume ready for sharing.",
      });

      const pdfData: ProfileData = {
        name: profileData.name,
        title: profileData.title,
        graduationYear: profileData.graduationYear,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        about: profileData.about,
        currentPosition: profileData.currentPosition,
        company: profileData.company,
        skills: profileData.skills,
        education: profileData.education,
        experience: profileData.experience,
        achievements: profileData.achievements
      };

      const success = await shareResume(pdfData);
      
      if (success) {
        toast({
          title: "Ready to Share!",
          description: navigator.share 
            ? "Share dialog opened successfully." 
            : "Resume downloaded and share text copied to clipboard.",
        });
      } else {
        throw new Error('Share operation failed');
      }
    } catch (error) {
      console.error('Error sharing resume:', error);
      toast({
        title: "Share Failed",
        description: "There was an error preparing your resume for sharing. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Profile Not Available</h2>
            <p className="text-muted-foreground mb-6">
              Please log in or sign up to view and edit your profile.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage src={profileData.profileImage} alt={profileData.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
                <p className="text-muted-foreground mb-4">{profileData.title} | Batch of {profileData.graduationYear}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {profileData.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {profileData.phone}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {profileData.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {profileData.joinDate}
                  </div>
                </div>
              </div>

              {/* Edit Profile Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleEditClick}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save to update your information.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Select value={editData.title} onValueChange={(value) => handleInputChange('title', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your professional title" />
                          </SelectTrigger>
                          <SelectContent>
                            {professionalTitles.map((title) => (
                              <SelectItem key={title} value={title}>
                                {title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Select value={editData.graduationYear} onValueChange={(value) => handleInputChange('graduationYear', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select graduation year" />
                          </SelectTrigger>
                          <SelectContent>
                            {graduationYears.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="e.g., San Francisco, CA"
                        />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editData.email}
                          readOnly
                          disabled
                          placeholder="your.email@example.com"
                          className="bg-muted cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    {/* About Section */}
                    <div className="space-y-2">
                      <Label htmlFor="about">About</Label>
                      <Textarea
                        id="about"
                        value={editData.about}
                        onChange={(e) => handleInputChange('about', e.target.value)}
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                      />
                    </div>

                    {/* Current Position */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPosition">Current Position</Label>
                        <Select value={editData.currentPosition} onValueChange={(value) => handleInputChange('currentPosition', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your current position" />
                          </SelectTrigger>
                          <SelectContent>
                            {professionalTitles.map((title) => (
                              <SelectItem key={title} value={title}>
                                {title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={editData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="e.g., Tech Innovations Inc."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="workStartYear">Work Start Year</Label>
                        <Select value={editData.workStartYear} onValueChange={(value) => handleInputChange('workStartYear', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select start year" />
                          </SelectTrigger>
                          <SelectContent>
                            {workYears.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workEndYear">Work End Year</Label>
                        <Select value={editData.workEndYear} onValueChange={(value) => handleInputChange('workEndYear', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select end year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Present">Present</SelectItem>
                            {workYears.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <Input
                        id="skills"
                        value={editData.skills.join(', ')}
                        onChange={(e) => handleSkillsChange(e.target.value)}
                        placeholder="e.g., JavaScript, React, Node.js, Python (comma-separated)"
                      />
                      <p className="text-xs text-muted-foreground">Separate skills with commas</p>
                    </div>

                    {/* Social Profiles Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Social Links</h3>
                      <div className="flex flex-wrap gap-3">
                        {/* GitHub */}
                        <Popover open={openSocialPopover === 'github'} onOpenChange={(open) => setOpenSocialPopover(open ? 'github' : null)}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-10 w-10 p-0 rounded-full"
                            >
                              <Github className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-3">
                              <h4 className="font-medium">Add GitHub Profile's link</h4>
                              <div className="flex items-center space-x-2">
                                <Github className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Your github link"
                                  value={editData.socialProfiles.github}
                                  onChange={(e) => handleSocialProfileChange('github', e.target.value)}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => saveSocialProfile('github')}
                                >
                                  Save
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>

                        {/* LinkedIn */}
                        <Popover open={openSocialPopover === 'linkedin'} onOpenChange={(open) => setOpenSocialPopover(open ? 'linkedin' : null)}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-10 w-10 p-0 rounded-full"
                            >
                              <Linkedin className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-3">
                              <h4 className="font-medium">Add LinkedIn Profile's link</h4>
                              <div className="flex items-center space-x-2">
                                <Linkedin className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Your linkedin link"
                                  value={editData.socialProfiles.linkedin}
                                  onChange={(e) => handleSocialProfileChange('linkedin', e.target.value)}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => saveSocialProfile('linkedin')}
                                >
                                  Save
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>

                        {/* Twitter */}
                        <Popover open={openSocialPopover === 'twitter'} onOpenChange={(open) => setOpenSocialPopover(open ? 'twitter' : null)}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-10 w-10 p-0 rounded-full"
                            >
                              <Twitter className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-3">
                              <h4 className="font-medium">Add Twitter Profile's link</h4>
                              <div className="flex items-center space-x-2">
                                <Twitter className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Your twitter link"
                                  value={editData.socialProfiles.twitter}
                                  onChange={(e) => handleSocialProfileChange('twitter', e.target.value)}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => saveSocialProfile('twitter')}
                                >
                                  Save
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>

                        {/* Instagram */}
                        <Popover open={openSocialPopover === 'instagram'} onOpenChange={(open) => setOpenSocialPopover(open ? 'instagram' : null)}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-10 w-10 p-0 rounded-full"
                            >
                              <Instagram className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-3">
                              <h4 className="font-medium">Add Instagram Profile's link</h4>
                              <div className="flex items-center space-x-2">
                                <Instagram className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Your instagram link"
                                  value={editData.socialProfiles.instagram}
                                  onChange={(e) => handleSocialProfileChange('instagram', e.target.value)}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => saveSocialProfile('instagram')}
                                >
                                  Save
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>

                        {/* Facebook */}
                        <Popover open={openSocialPopover === 'facebook'} onOpenChange={(open) => setOpenSocialPopover(open ? 'facebook' : null)}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-10 w-10 p-0 rounded-full"
                            >
                              <Facebook className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-3">
                              <h4 className="font-medium">Add Facebook Profile's link</h4>
                              <div className="flex items-center space-x-2">
                                <Facebook className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Your facebook link"
                                  value={editData.socialProfiles.facebook}
                                  onChange={(e) => handleSocialProfileChange('facebook', e.target.value)}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => saveSocialProfile('facebook')}
                                >
                                  Save
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>

                        {/* Website */}
                        <Popover open={openSocialPopover === 'website'} onOpenChange={(open) => setOpenSocialPopover(open ? 'website' : null)}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-10 w-10 p-0 rounded-full"
                            >
                              <Globe className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-3">
                              <h4 className="font-medium">Add Website Profile's link</h4>
                              <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Your website link"
                                  value={editData.socialProfiles.website}
                                  onChange={(e) => handleSocialProfileChange('website', e.target.value)}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => saveSocialProfile('website')}
                                >
                                  Save
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Education Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Education</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="degree">Degree</Label>
                          <Input
                            id="degree"
                            value={editData.education.degree}
                            onChange={(e) => handleEducationChange('degree', e.target.value)}
                            placeholder="e.g., Bachelor of Science in Computer Science"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="university">University</Label>
                          <Input
                            id="university"
                            value={editData.education.university}
                            onChange={(e) => handleEducationChange('university', e.target.value)}
                            placeholder="e.g., Stanford University"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gpa">GPA</Label>
                        <Input
                          id="gpa"
                          value={editData.education.gpa}
                          onChange={(e) => handleEducationChange('gpa', e.target.value)}
                          placeholder="e.g., 3.8/4.0"
                          className="w-full md:w-1/2"
                        />
                      </div>
                    </div>

                    {/* Professional Experience Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Professional Experience</h3>
                        <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Experience
                        </Button>
                      </div>
                      {editData.experience.map((exp, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Experience {index + 1}</h4>
                            {editData.experience.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeExperience(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`position-${index}`}>Position</Label>
                              <Input
                                id={`position-${index}`}
                                value={exp.position}
                                onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                placeholder="e.g., Senior Software Engineer"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`company-${index}`}>Company</Label>
                              <Input
                                id={`company-${index}`}
                                value={exp.company}
                                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                placeholder="e.g., Tech Innovations Inc."
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`duration-${index}`}>Duration</Label>
                            <Input
                              id={`duration-${index}`}
                              value={exp.duration}
                              onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                              placeholder="e.g., 2022 - Present"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`description-${index}`}>Description</Label>
                            <Textarea
                              id={`description-${index}`}
                              value={exp.description}
                              onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                              placeholder="Describe your role and achievements..."
                              className="min-h-[80px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Achievements Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Achievements</h3>
                        <Button type="button" variant="outline" size="sm" onClick={addAchievement}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Achievement
                        </Button>
                      </div>
                      {editData.achievements.map((achievement, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Achievement {index + 1}</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeAchievement(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`achievement-${index}`}>Achievement</Label>
                            <Textarea
                              id={`achievement-${index}`}
                              value={achievement}
                              onChange={(e) => handleAchievementChange(index, e.target.value)}
                              placeholder="Describe your achievement..."
                              className="min-h-[80px]"
                            />
                          </div>
                        </div>
                      ))}
                      {editData.achievements.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No achievements added yet.</p>
                          <p className="text-sm">Click "Add Achievement" to get started.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </Card>

          {/* Profile Content */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-muted-foreground">
                {profileData.about}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Current Position</h2>
              <div className="space-y-2">
                <h3 className="font-medium">{profileData.currentPosition}</h3>
                <p className="text-muted-foreground">{profileData.company}</p>
                <p className="text-sm text-muted-foreground">
                  {profileData.workStartYear} - {profileData.workEndYear}
                </p>
              </div>
            </Card>
          </div>

          {/* Skills Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* Social Profiles Section */}
          {(profileData.socialProfiles.github || 
            profileData.socialProfiles.linkedin || 
            profileData.socialProfiles.twitter || 
            profileData.socialProfiles.instagram || 
            profileData.socialProfiles.facebook || 
            profileData.socialProfiles.website) && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Social Links</h2>
              <div className="flex flex-wrap gap-3">
                {profileData.socialProfiles.github && (
                  <a
                    href={profileData.socialProfiles.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-10 w-10 rounded-full border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {profileData.socialProfiles.linkedin && (
                  <a
                    href={profileData.socialProfiles.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-10 w-10 rounded-full border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {profileData.socialProfiles.twitter && (
                  <a
                    href={profileData.socialProfiles.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-10 w-10 rounded-full border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {profileData.socialProfiles.instagram && (
                  <a
                    href={profileData.socialProfiles.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-10 w-10 rounded-full border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {profileData.socialProfiles.facebook && (
                  <a
                    href={profileData.socialProfiles.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-10 w-10 rounded-full border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {profileData.socialProfiles.website && (
                  <a
                    href={profileData.socialProfiles.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-10 w-10 rounded-full border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
              </div>
            </Card>
          )}

          {/* Education Section */}
          {(profileData.education.degree || profileData.education.university || profileData.education.gpa) && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              <div className="space-y-2">
                {profileData.education.degree && <h3 className="font-medium">{profileData.education.degree}</h3>}
                {profileData.education.university && <p className="text-muted-foreground">{profileData.education.university}</p>}
                {profileData.education.gpa && <p className="text-sm text-muted-foreground">GPA: {profileData.education.gpa}</p>}
              </div>
            </Card>
          )}

          {/* Experience Section */}
          {profileData.experience.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Professional Experience</h2>
              <div className="space-y-6">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    {exp.position && <h3 className="font-medium">{exp.position}</h3>}
                    {exp.company && <p className="text-muted-foreground">{exp.company}</p>}
                    {exp.duration && <p className="text-sm text-muted-foreground mb-2">{exp.duration}</p>}
                    {exp.description && <p className="text-sm">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Achievements Section */}
          {profileData.achievements.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Key Achievements</h2>
              <ul className="space-y-3">
                {profileData.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">{achievement}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Resume Builder Section */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <Button 
                    onClick={handleCreateResume}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Create your Resume
                  </Button>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={async () => {
                        const pdfData: ProfileData = {
                          name: profileData.name,
                          title: profileData.title,
                          graduationYear: profileData.graduationYear,
                          email: profileData.email,
                          phone: profileData.phone,
                          location: profileData.location,
                          about: profileData.about,
                          currentPosition: profileData.currentPosition,
                          company: profileData.company,
                          skills: profileData.skills,
                          education: profileData.education,
                          experience: profileData.experience,
                          achievements: profileData.achievements
                        };
                        try {
                          const pdfBlob = await generateResumePDF(pdfData, 'classic');
                          downloadPDF(pdfBlob, `${profileData.name.replace(/\s+/g, '_')}_Resume.pdf`);
                          toast({
                            title: "Download Complete!",
                            description: "Your resume has been downloaded successfully.",
                          });
                        } catch (error) {
                          toast({
                            title: "Download Failed",
                            description: "There was an error generating your resume.",
                            variant: "destructive"
                          });
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Quick PDF
                    </Button>
                    <Button 
                      onClick={async () => {
                        const pdfData: ProfileData = {
                          name: profileData.name,
                          title: profileData.title,
                          graduationYear: profileData.graduationYear,
                          email: profileData.email,
                          phone: profileData.phone,
                          location: profileData.location,
                          about: profileData.about,
                          currentPosition: profileData.currentPosition,
                          company: profileData.company,
                          skills: profileData.skills,
                          education: profileData.education,
                          experience: profileData.experience,
                          achievements: profileData.achievements
                        };
                        try {
                          const success = await shareResume(pdfData);
                          if (success) {
                            toast({
                              title: "Ready to Share!",
                              description: navigator.share 
                                ? "Share dialog opened successfully." 
                                : "Resume downloaded and share text copied to clipboard.",
                            });
                          }
                        } catch (error) {
                          toast({
                            title: "Share Failed",
                            description: "There was an error preparing your resume for sharing.",
                            variant: "destructive"
                          });
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-yellow-600">{userStats.profileViews}</span>
                    </div>
                    <span className="text-sm font-medium">Profile Views</span>
                  </div>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Increase your profile Engagement by 3X 🚀 by filling the details below
                </div>
              </div>
            </Card>

            {/* Rankings Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Rankings</h3>
                <Button variant="link" className="text-sm text-primary p-0">
                  How it works?
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Global Rank</span>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ChevronRight className="h-3 w-3 rotate-180" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">Based on activity</div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{userStats.globalRank.toLocaleString()}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleViewLeaderboard}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  View Leaderboard
                </Button>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Total Points</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">{userStats.totalPoints}</span>
                      <Badge variant="secondary" className="text-xs">0</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Total Badges</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">{userStats.totalBadges}</span>
                      <Badge variant="secondary" className="text-xs">6</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Resume Creation Dialog */}
        <Dialog open={isResumeDialogOpen} onOpenChange={setIsResumeDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create your Resume</DialogTitle>
              <DialogDescription>
                Choose how you'd like to create your resume
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Button 
                onClick={handleFetchFromProfile}
                className="w-full justify-start h-auto p-4"
                variant="outline"
              >
                <div className="text-left">
                  <div className="font-medium">Fetch from Profile</div>
                  <div className="text-sm text-muted-foreground">Use your existing profile data</div>
                </div>
              </Button>
              <Button 
                onClick={handleCreateOwn}
                className="w-full justify-start h-auto p-4"
                variant="outline"
              >
                <div className="text-left">
                  <div className="font-medium">Create your own</div>
                  <div className="text-sm text-muted-foreground">Start from scratch</div>
                </div>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Template Selection Dialog */}
        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Choose from a wide variety of templates</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              {/* Template 1 - Classic */}
              <div className="space-y-3">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleTemplateSelect('create-new')}
                >
                  <div className="text-center">
                    <Plus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <div className="text-sm font-medium">Create a</div>
                    <div className="text-sm font-medium">new resume</div>
                  </div>
                </div>
              </div>

              {/* Template 2 - Modern Blue */}
              <div className="space-y-3">
                <div 
                  className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleTemplateSelect('modern-blue')}
                >
                  <div className="bg-white p-4 h-64">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-800 rounded mb-1"></div>
                        <div className="h-2 bg-gray-400 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-2 bg-gray-300 rounded"></div>
                      <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-300 rounded w-4/6"></div>
                    </div>
                    <div className="mt-4">
                      <div className="h-2 bg-gray-800 rounded w-1/3 mb-2"></div>
                      <div className="space-y-1">
                        <div className="h-1.5 bg-gray-300 rounded"></div>
                        <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm font-medium">Classic Template</div>
              </div>

              {/* Template 3 - Professional */}
              <div className="space-y-3">
                <div 
                  className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleTemplateSelect('professional')}
                >
                  <div className="bg-blue-600 text-white p-4 h-64">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-2"></div>
                      <div className="h-3 bg-white rounded mb-1"></div>
                      <div className="h-2 bg-white/70 rounded w-3/4 mx-auto"></div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="h-2 bg-white rounded w-1/2 mb-1"></div>
                        <div className="h-1.5 bg-white/70 rounded"></div>
                        <div className="h-1.5 bg-white/70 rounded w-4/5"></div>
                      </div>
                      <div>
                        <div className="h-2 bg-white rounded w-1/3 mb-1"></div>
                        <div className="flex space-x-1">
                          <div className="h-1.5 bg-white/70 rounded flex-1"></div>
                          <div className="h-1.5 bg-white/70 rounded flex-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm font-medium">Modern Blue</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Resume Preview Dialog */}
        <Dialog open={isResumePreviewOpen} onOpenChange={setIsResumePreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Resume Preview</DialogTitle>
              <div className="flex space-x-2">
                <Button onClick={handleDownloadResume} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={handleShareResume} size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </DialogHeader>
            
            {/* Resume Content */}
            <div className="bg-white text-black p-8 rounded-lg shadow-lg">
              {selectedTemplate === 'professional' ? (
                // Blue Professional Template
                <div className="grid grid-cols-3 gap-6 min-h-[800px]">
                  {/* Left Sidebar */}
                  <div className="bg-blue-600 text-white p-6 rounded-l-lg">
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <User className="h-12 w-12 text-white" />
                      </div>
                      <h1 className="text-xl font-bold">{profileData.name}</h1>
                      <p className="text-blue-100 text-sm">{profileData.title}</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3 text-lg">Contact</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-3 w-3" />
                            <span className="text-xs">{profileData.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">{profileData.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs">{profileData.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-3 text-lg">Skills</h3>
                        <div className="space-y-2">
                          {profileData.skills.slice(0, 6).map((skill, index) => (
                            <div key={index} className="text-sm">
                              <div className="flex justify-between mb-1">
                                <span>{skill}</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-1">
                                <div className="bg-white h-1 rounded-full" style={{width: '85%'}}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-3 text-lg">Education</h3>
                        <div className="text-sm">
                          <div className="font-medium">{profileData.education.degree}</div>
                          <div className="text-blue-100">{profileData.education.university}</div>
                          <div className="text-blue-200 text-xs">GPA: {profileData.education.gpa}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Content */}
                  <div className="col-span-2 p-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-2">Profile</h2>
                        <p className="text-gray-700 text-sm leading-relaxed">{profileData.about}</p>
                      </div>
                      
                      <div>
                        <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-2">Experience</h2>
                        <div className="space-y-4">
                          {profileData.experience.map((exp, index) => (
                            <div key={index}>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg">{exp.position}</h3>
                                  <p className="text-blue-600 font-medium">{exp.company}</p>
                                </div>
                                <span className="text-sm text-gray-500">{exp.duration}</span>
                              </div>
                              <p className="text-gray-700 text-sm">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Default Classic Template
                <div className="space-y-6">
                  <div className="text-center border-b pb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{profileData.name}</h1>
                    <p className="text-lg text-gray-600 mb-4">{profileData.title}</p>
                    <div className="flex justify-center space-x-6 text-sm text-gray-600">
                      <span>{profileData.email}</span>
                      <span>{profileData.phone}</span>
                      <span>{profileData.location}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">Professional Summary</h2>
                    <p className="text-gray-700">{profileData.about}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">Experience</h2>
                    <div className="space-y-4">
                      {profileData.experience.map((exp, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{exp.position}</h3>
                              <p className="text-gray-600">{exp.company}</p>
                            </div>
                            <span className="text-sm text-gray-500">{exp.duration}</span>
                          </div>
                          <p className="text-gray-700 text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">Education</h2>
                    <div>
                      <h3 className="font-semibold">{profileData.education.degree}</h3>
                      <p className="text-gray-600">{profileData.education.university}</p>
                      <p className="text-sm text-gray-500">GPA: {profileData.education.gpa}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;
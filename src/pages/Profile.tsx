import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Plus, Trash2, Github, Instagram, Twitter, Facebook, Linkedin, Globe, Link2 } from 'lucide-react';

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

// Default profile data
const defaultProfileData = {
  name: 'Rohan Sharma',
  title: 'Software Engineer',
  graduationYear: '2025',
  email: 'rohan.sharma@example.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, KA',
  joinDate: 'Joined March 2025',
  about: 'Passionate software engineer with 4+ years of experience in full-stack development. Alumni of Computer Science program, currently working at a leading tech company in Bengaluru. Always eager to connect with fellow alumni and share knowledge.',
  currentPosition: 'Senior Software Engineer',
  company: 'Infosys',
  workStartYear: '2025',
  workEndYear: 'Present',
  skills: ['Java', 'Spring Boot', 'React', 'Python', 'AWS', 'Docker', 'MySQL', 'TypeScript'],
  education: {
    degree: 'Bachelor of Technology in Computer Science',
    university: 'IIT Bombay',
    gpa: '8.8/10.0'
  },
  experience: [
    {
      position: 'Junior Software Engineer',
      company: 'Infosys',
      duration: '2015 - 2019',
      description: 'Lead development of scalable web applications using Spring Boot and React. Mentored junior developers and improved system performance by 40%.'
    },
    {
      position: 'Software Engineer',
      company: 'StartupConnect',
      duration: '2019 - Present',
      description: 'Developed full-stack applications and implemented CI/CD pipelines. Collaborated with cross-functional teams to deliver high-quality software solutions.'
    }
  ],
  achievements: [
    'Led a team of 5 developers in building a customer portal that increased user engagement by 60%',
    'Implemented automated testing framework that reduced bug reports by 45%',
    'Speaker at NASSCOM Tech Conference 2023 on "Modern Microservices Patterns"',
    'Contributed to open-source projects with 1000+ GitHub stars'
  ],
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
  const { isLoggedIn } = useAuth();
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [editData, setEditData] = useState(defaultProfileData);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [openSocialPopover, setOpenSocialPopover] = useState<string | null>(null);
  const { toast } = useToast();

  // Load user data from localStorage on component mount
  useEffect(() => {
    if (isLoggedIn) {
      const storedUserData = localStorage.getItem('userProfile');
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);

          // Transform signup data to profile format
          const transformedData = {
            name: userData.fullName || defaultProfileData.name,
            title: userData.currentJobTitle || userData.selectedRole || defaultProfileData.title,
            graduationYear: userData.graduationYear || defaultProfileData.graduationYear,
            email: userData.email || defaultProfileData.email,
            phone: userData.phoneNumber || defaultProfileData.phone,
            location: userData.city && userData.country ? `${userData.city}, ${userData.country}` : defaultProfileData.location,
            joinDate: userData.joinDate || defaultProfileData.joinDate,
            about: userData.bio || defaultProfileData.about,
            currentPosition: userData.currentJobTitle || defaultProfileData.currentPosition,
            company: userData.company || defaultProfileData.company,
            workStartYear: defaultProfileData.workStartYear,
            workEndYear: defaultProfileData.workEndYear,
            skills: userData.skills ? userData.skills.split(',').map((skill: string) => skill.trim()) : defaultProfileData.skills,
            education: {
              degree: userData.majorField ? `Bachelor of Science in ${userData.majorField}` : defaultProfileData.education.degree,
              university: defaultProfileData.education.university,
              gpa: defaultProfileData.education.gpa
            },
            experience: userData.currentJobTitle && userData.company ? [
              {
                position: userData.currentJobTitle,
                company: userData.company,
                duration: 'Present',
                description: `Working as ${userData.currentJobTitle} at ${userData.company}`
              }
            ] : defaultProfileData.experience,
            achievements: defaultProfileData.achievements,
            socialProfiles: userData.socialProfiles || defaultProfileData.socialProfiles
          };

          setProfileData(transformedData);
          setEditData(transformedData);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }
    }
  }, [isLoggedIn]);

  const handleEditClick = () => {
    setEditData(profileData); // Initialize edit form with current data
    setIsEditDialogOpen(true);
  };

  const handleSave = () => {
    setProfileData(editData); // Update the profile with edited data
    setIsEditDialogOpen(false);

    // Update localStorage with the new data
    const storedUserData = localStorage.getItem('userProfile');
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        const updatedUserData = {
          ...userData,
          fullName: editData.name,
          email: editData.email,
          phoneNumber: editData.phone,
          currentJobTitle: editData.currentPosition,
          company: editData.company,
          bio: editData.about,
          skills: editData.skills.join(', '),
          graduationYear: editData.graduationYear,
          majorField: editData.education.degree.replace('Bachelor of Science in ', ''),
          socialProfiles: editData.socialProfiles,
        };
        localStorage.setItem('userProfile', JSON.stringify(updatedUserData));
      } catch (error) {
        console.error('Error updating stored user data:', error);
      }
    }

    // Show success toast
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
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

  if (!isLoggedIn) {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
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
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your.email@example.com"
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
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            <div className="space-y-2">
              <h3 className="font-medium">{profileData.education.degree}</h3>
              <p className="text-muted-foreground">{profileData.education.university}</p>
              <p className="text-sm text-muted-foreground">GPA: {profileData.education.gpa}</p>
            </div>
          </Card>

          {/* Experience Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Professional Experience</h2>
            <div className="space-y-6">
              {profileData.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-primary/20 pl-4">
                  <h3 className="font-medium">{exp.position}</h3>
                  <p className="text-muted-foreground">{exp.company}</p>
                  <p className="text-sm text-muted-foreground mb-2">{exp.duration}</p>
                  <p className="text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements Section */}
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
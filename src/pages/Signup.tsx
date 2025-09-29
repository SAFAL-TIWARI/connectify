import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  GraduationCap, 
  User, 
  Building, 
  Users, 
  School, 
  UserCheck,
  Mail,
  Lock,
  Calendar,
  MapPin,
  Phone,
  Linkedin,
  Briefcase,
  BookOpen,
  Building2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import EmailConfirmationDialog from '@/components/EmailConfirmationDialog';
import type { SignupData } from '@/types/auth';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState('alumni');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
    phoneNumber: '',
    linkedinProfile: '',
    graduationYear: '',
    majorField: '',
    currentJobTitle: '',
    company: '',
    bio: '',
    skills: ''
  });

  const userRoles = [
    { id: 'alumni', label: 'Alumni', icon: User },
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'employer', label: 'Employer', icon: Building },
    { id: 'institute', label: 'Institute', icon: School },
    { id: 'admin', label: 'Admin', icon: UserCheck }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [error, setError] = useState<string | null>(null);
  const [showEmailConfirmDialog, setShowEmailConfirmDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    try {
      const payload: SignupData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        linkedinProfile: formData.linkedinProfile,
        graduationYear: formData.graduationYear,
        majorField: formData.majorField,
        currentJobTitle: formData.currentJobTitle,
        company: formData.company,
        bio: formData.bio,
        skills: formData.skills,
      }
      await signUp(payload.email, payload.password, payload)
      setShowEmailConfirmDialog(true)
    } catch (err: any) {
      setError(err.message ?? 'Failed to sign up')
      toast({ title: 'Signup failed', description: 'Please try again.', variant: 'destructive' })
    }
  };

  // Define which fields are relevant for each user type
  const getRelevantFields = (role: string) => {
    const commonFields = ['fullName', 'email', 'password', 'confirmPassword', 'phoneNumber'];
    
    switch (role) {
      case 'alumni':
        return [
          ...commonFields,
          'graduationYear',
          'majorField',
          'currentJobTitle',
          'company',
          'linkedinProfile',
          'city',
          'country',
          'bio',
          'skills'
        ];
      case 'student':
        return [
          ...commonFields,
          'dateOfBirth',
          'address',
          'city',
          'country',
          'majorField',
          'graduationYear', // Expected graduation year
          'bio',
          'skills'
        ];
      case 'faculty':
        return [
          ...commonFields,
          'currentJobTitle', // Academic position
          'company', // Department/Institution
          'majorField', // Area of expertise
          'linkedinProfile',
          'city',
          'country',
          'bio',
          'skills'
        ];
      case 'employer':
        return [
          ...commonFields,
          'currentJobTitle', // Position in company
          'company',
          'linkedinProfile',
          'city',
          'country',
          'bio'
        ];
      case 'institute':
        return [
          ...commonFields,
          'company', // Institution name
          'address',
          'city',
          'country',
          'bio'
        ];
      case 'admin':
        return [
          ...commonFields,
          'currentJobTitle', // Admin role
          'company', // Institution/Organization
          'city',
          'country'
        ];
      default:
        return commonFields;
    }
  };

  const isFieldRelevant = (fieldName: string) => {
    return getRelevantFields(selectedRole).includes(fieldName);
  };

  const getFieldPlaceholder = (fieldName: string, role: string) => {
    const placeholders: { [key: string]: { [role: string]: string } } = {
      graduationYear: {
        alumni: 'Graduation Year',
        student: 'Expected Graduation Year',
        faculty: 'Graduation Year',
        employer: 'Graduation Year',
        institute: 'Graduation Year',
        admin: 'Graduation Year'
      },
      currentJobTitle: {
        alumni: 'Current Job Title',
        student: 'Current Job Title',
        faculty: 'Academic Position (e.g., Professor, Lecturer)',
        employer: 'Your Position in Company',
        institute: 'Your Role',
        admin: 'Admin Role/Position'
      },
      company: {
        alumni: 'Current Company',
        student: 'Company/Institution',
        faculty: 'Department/Institution',
        employer: 'Company Name',
        institute: 'Institution Name',
        admin: 'Institution/Organization'
      },
      majorField: {
        alumni: 'Major/Field of Study',
        student: 'Current Major/Field of Study',
        faculty: 'Area of Expertise/Department',
        employer: 'Field of Study',
        institute: 'Field of Study',
        admin: 'Field of Study'
      }
    };

    return placeholders[fieldName]?.[role] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="flex min-h-screen">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Background Image */}
            <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/signup-preview.png')"
            }}
            ></div>
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 z-0"></div>

          {/* Main illustration content */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Join Our Network</h1>
           
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full lg:w-1/2 flex items-start justify-center p-8 bg-white dark:bg-gray-900 overflow-y-auto">
          <div className="w-full max-w-2xl space-y-6 mt-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Your Account</h2>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <div className="flex justify-center space-x-1">
                {userRoles.map((role) => {
                  const IconComponent = role.icon;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`flex flex-col items-center p-2 rounded-md border-2 transition-all min-w-[65px] ${
                        selectedRole === role.id
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mb-1" />
                      <span className="text-xs font-medium">{role.label}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* Role Description */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedRole === 'alumni' && 'Share your professional journey and connect with fellow graduates'}
                  {selectedRole === 'student' && 'Join the community and explore opportunities for your future'}
                  {selectedRole === 'faculty' && 'Connect with students and alumni in your field of expertise'}
                  {selectedRole === 'employer' && 'Find talented alumni and students for your organization'}
                  {selectedRole === 'institute' && 'Represent your educational institution in the network'}
                  {selectedRole === 'admin' && 'Manage and oversee the alumni network platform'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
              {error && (
                <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
              )}
              {/* Helper function to render fields in optimal layout */}
              {(() => {
                const relevantFields = getRelevantFields(selectedRole);
                const fieldComponents: JSX.Element[] = [];

                // Always show core fields first
                fieldComponents.push(
                  <div key="core-row-1" className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <Input
                          type="text"
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="pl-10 h-10 border-gray-300 dark:border-gray-600"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <Input
                          type="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10 h-10 border-gray-300 dark:border-gray-600"
                          required
                        />
                      </div>
                    </div>
                  </div>
                );

                fieldComponents.push(
                  <div key="core-row-2" className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-10 pr-10 h-10 border-gray-300 dark:border-gray-600"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="pl-10 pr-10 h-10 border-gray-300 dark:border-gray-600"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );

                // Create a queue of conditional fields to arrange optimally
                const conditionalFields: Array<{field: string, component: JSX.Element}> = [];

                // Phone Number
                conditionalFields.push({
                  field: 'phoneNumber',
                  component: (
                    <div className="space-y-1">
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <Input
                          type="tel"
                          placeholder="Phone Number"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          className="pl-10 h-10 border-gray-300 dark:border-gray-600"
                          required
                        />
                      </div>
                    </div>
                  )
                });

                // Date of Birth
                if (relevantFields.includes('dateOfBirth')) {
                  conditionalFields.push({
                    field: 'dateOfBirth',
                    component: (
                      <div className="space-y-1">
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            type="date"
                            placeholder="Date of Birth"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            className="pl-10 h-10 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    )
                  });
                }

                // City
                if (relevantFields.includes('city')) {
                  conditionalFields.push({
                    field: 'city',
                    component: (
                      <div className="space-y-1">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            type="text"
                            placeholder="City"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="pl-10 h-10 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    )
                  });
                }

                // Country
                if (relevantFields.includes('country')) {
                  conditionalFields.push({
                    field: 'country',
                    component: (
                      <div className="space-y-1">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            type="text"
                            placeholder="Country"
                            value={formData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            className="pl-10 h-10 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    )
                  });
                }

                // LinkedIn Profile
                if (relevantFields.includes('linkedinProfile')) {
                  conditionalFields.push({
                    field: 'linkedinProfile',
                    component: (
                      <div className="space-y-1">
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            type="url"
                            placeholder="LinkedIn Profile URL"
                            value={formData.linkedinProfile}
                            onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                            className="pl-10 h-10 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    )
                  });
                }

                // Graduation Year
                if (relevantFields.includes('graduationYear')) {
                  conditionalFields.push({
                    field: 'graduationYear',
                    component: (
                      <div className="space-y-1">
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            type="text"
                            placeholder={getFieldPlaceholder('graduationYear', selectedRole)}
                            value={formData.graduationYear}
                            onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                            className="pl-10 h-10 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    )
                  });
                }

                // Major Field
                if (relevantFields.includes('majorField')) {
                  conditionalFields.push({
                    field: 'majorField',
                    component: (
                      <div className="space-y-1">
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            type="text"
                            placeholder={getFieldPlaceholder('majorField', selectedRole)}
                            value={formData.majorField}
                            onChange={(e) => handleInputChange('majorField', e.target.value)}
                            className="pl-10 h-10 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    )
                  });
                }

                // Current Job Title
                if (relevantFields.includes('currentJobTitle')) {
                  conditionalFields.push({
                    field: 'currentJobTitle',
                    component: (
                      <div className="space-y-1">
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            type="text"
                            placeholder={getFieldPlaceholder('currentJobTitle', selectedRole)}
                            value={formData.currentJobTitle}
                            onChange={(e) => handleInputChange('currentJobTitle', e.target.value)}
                            className="pl-10 h-10 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    )
                  });
                }

                // Company
                if (relevantFields.includes('company')) {
                  conditionalFields.push({
                    field: 'company',
                    component: (
                      <div className="space-y-1">
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            type="text"
                            placeholder={getFieldPlaceholder('company', selectedRole)}
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            className="pl-10 h-10 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    )
                  });
                }

                // Arrange conditional fields in pairs
                for (let i = 0; i < conditionalFields.length; i += 2) {
                  const field1 = conditionalFields[i];
                  const field2 = conditionalFields[i + 1];

                  if (field2) {
                    // Two fields in a row
                    fieldComponents.push(
                      <div key={`row-${i}`} className="grid grid-cols-2 gap-4">
                        {field1.component}
                        {field2.component}
                      </div>
                    );
                  } else {
                    // Single field in a row
                    fieldComponents.push(
                      <div key={`row-${i}`} className="grid grid-cols-2 gap-4">
                        {field1.component}
                        <div></div>
                      </div>
                    );
                  }
                }

                // Address field (full width if present)
                if (relevantFields.includes('address')) {
                  fieldComponents.push(
                    <div key="address" className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            type="text"
                            placeholder="Address"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="pl-10 h-10 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  );
                }

                return fieldComponents;
              })()}

              {/* Bio */}
              {isFieldRelevant('bio') && (
                <div className="space-y-1">
                  <Textarea
                    placeholder="Bio: Tell us about yourself"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="min-h-[80px] border-gray-300 dark:border-gray-600 resize-none"
                    rows={3}
                  />
                </div>
              )}

              {/* Skills */}
              {isFieldRelevant('skills') && (
                <div className="space-y-1">
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-4 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Skills (comma-separated)"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      className="pl-10 h-10 border-gray-300"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg relative z-10 cursor-pointer"
                  disabled={loading}
                  style={{ pointerEvents: 'auto' }}
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </div>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Email Confirmation Dialog */}
      <EmailConfirmationDialog
        isOpen={showEmailConfirmDialog}
        onClose={() => {
          setShowEmailConfirmDialog(false);
          navigate('/profile');
        }}
        userEmail={formData.email}
      />
    </div>
  );
};

export default Signup;
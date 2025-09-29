import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  GraduationCap, 
  User, 
  Building, 
  Users, 
  School, 
  UserCheck,
  Github,
  Linkedin,
  Eye,
  EyeOff
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Google Icon Component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signInWithProvider, loading, profile, user, getRememberedCredentials } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const userRoles = [
    { id: 'alumni', label: 'Alumni', icon: User },
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'employer', label: 'Employer', icon: Building },
    { id: 'institute', label: 'Institute', icon: School },
    { id: 'admin', label: 'Admin', icon: UserCheck }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }
    try {
      await signIn(email, password, selectedRole, rememberMe);
      toast({ title: 'Login successful', description: 'Welcome back!' });
      navigate('/profile');
    } catch (err: any) {
      setError(err.message ?? 'Failed to sign in');
      // Clear selected role on error to force re-selection
      if (err.message && err.message.includes('Access denied')) {
        setSelectedRole('');
      }
      toast({ title: 'Login failed', description: err.message || 'Please check your credentials.', variant: 'destructive' });
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'linkedin') => {
    setError(null);
    if (!selectedRole) {
      setError('Please select a role before continuing with social login');
      return;
    }
    try {
      // Store selected role in localStorage to validate after OAuth redirect
      localStorage.setItem('selectedLoginRole', selectedRole);
      await signInWithProvider(provider);
      toast({ title: 'Continue with provider', description: 'Complete the OAuth flow in the opened window.' });
      // Redirect will occur; after return, session listener will navigate
    } catch (err: any) {
      setError(err.message ?? 'Failed to start social login');
      toast({ title: 'Social login failed', description: 'Please try again.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (profile) {
      navigate('/profile');
    }
  }, [profile, navigate]);

  // Load remembered credentials on component mount
  useEffect(() => {
    const remembered = getRememberedCredentials();
    if (remembered) {
      setEmail(remembered.email);
      setSelectedRole(remembered.role);
      setRememberMe(true);
    }
  }, [getRememberedCredentials]);

  // Handle role validation errors after social login redirects
  useEffect(() => {
    const checkSocialLoginRoleError = () => {
      const selectedLoginRole = localStorage.getItem('selectedLoginRole')
      if (selectedLoginRole && !user && !loading) {
        // User was signed out due to role mismatch
        const roleLabel = userRoles.find(role => role.id === selectedLoginRole)?.label || selectedLoginRole
        setError(`Access denied. Please select the correct role for your account or sign up as ${roleLabel}.`)
        localStorage.removeItem('selectedLoginRole')
      }
    }

    // Check immediately and also after a short delay to handle async auth state changes
    checkSocialLoginRoleError()
    const timer = setTimeout(checkSocialLoginRoleError, 1000)
    
    return () => clearTimeout(timer)
  }, [user, loading, userRoles]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/login-preview.png')"
          }}
        ></div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        {/* Illustration Content */}
        
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign in to your account</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            )}
            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Role
              </Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {userRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center space-x-2">
                        <role.icon className="w-4 h-4" />
                        <span>{role.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pr-10"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </Label>
              </div>
              <Link to="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                Forgot your password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium relative z-10 cursor-pointer"
              disabled={loading}
              style={{ pointerEvents: 'auto' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 relative z-10 cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                <GoogleIcon className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Google</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('github')}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 relative z-10 cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                <Github className="w-5 h-5 text-gray-900 dark:text-white" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">GitHub</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('linkedin')}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 relative z-10 cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                <Linkedin className="w-5 h-5 text-blue-700" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">LinkedIn</span>
              </Button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
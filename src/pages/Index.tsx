import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { 
  Users, 
  Calendar, 
  Briefcase, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Search, 
  MapPin, 
  Clock, 
  Mail, 
  Phone, 
  LinkedinIcon, 
  MessageCircle, 
  X,
  Send,
  ChevronRight,
  Star,
  Building,
  GraduationCap,
  Award,
  Filter,
  Heart,
  Share2,
  TrendingUp,
  Globe,
  Lightbulb,
  Target,
  Zap,
  Shield,
  BookOpen,
  Network,
  Rocket,
  BarChart3,
  Users2,
  Handshake,
  ArrowRight,
  CheckCircle,
  PlayCircle,
  DollarSign,
  Video,
  BookOpenCheck,
  Podcast,
  Library,
  Monitor,
  Quote
} from 'lucide-react';

// API Key Constant
const GEMINI_API_KEY = 'PASTE_YOUR_GEMINI_API_KEY_HERE';

// Mock Data
const mockAlumni = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    graduationYear: 2018,
    major: "Computer Science",
    industry: "Technology",
    company: "Google",
    position: "Senior Software Engineer",
    location: "Mountain View, CA",
    bio: "Passionate about AI and machine learning. Love mentoring new graduates and helping them navigate their tech careers.",
    skills: ["JavaScript", "Python", "Machine Learning", "Leadership"],
    workExperience: [
      { company: "Google", position: "Senior Software Engineer", duration: "2020-Present" },
      { company: "Microsoft", position: "Software Engineer", duration: "2018-2020" }
    ],
    isAvailableForMentoring: true,
    linkedinUrl: "https://linkedin.com/in/sarahjohnson"
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    graduationYear: 2019,
    major: "Business Administration",
    industry: "Finance",
    company: "Goldman Sachs",
    position: "Investment Analyst",
    location: "New York, NY",
    bio: "Finance professional with expertise in investment strategies and market analysis. Always eager to share knowledge with fellow alumni.",
    skills: ["Financial Analysis", "Investment Strategy", "Risk Management", "Excel"],
    workExperience: [
      { company: "Goldman Sachs", position: "Investment Analyst", duration: "2019-Present" }
    ],
    isAvailableForMentoring: true,
    linkedinUrl: "https://linkedin.com/in/michaelchen"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 345-6789",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    graduationYear: 2017,
    major: "Marketing",
    industry: "Healthcare",
    company: "Johnson & Johnson",
    position: "Marketing Director",
    location: "New Brunswick, NJ",
    bio: "Marketing executive with a passion for healthcare innovation. Love connecting with alumni and sharing career insights.",
    skills: ["Digital Marketing", "Brand Strategy", "Product Launch", "Team Leadership"],
    workExperience: [
      { company: "Johnson & Johnson", position: "Marketing Director", duration: "2021-Present" },
      { company: "Pfizer", position: "Senior Marketing Manager", duration: "2018-2021" },
      { company: "Novartis", position: "Marketing Coordinator", duration: "2017-2018" }
    ],
    isAvailableForMentoring: true,
    linkedinUrl: "https://linkedin.com/in/emilyrodriguez"
  },
  {
    id: 4,
    name: "David Park",
    email: "david.park@email.com",
    phone: "+1 (555) 456-7890",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    graduationYear: 2020,
    major: "Engineering",
    industry: "Automotive",
    company: "Tesla",
    position: "Mechanical Engineer",
    location: "Austin, TX",
    bio: "Mechanical engineer working on sustainable transportation solutions. Passionate about innovation and environmental impact.",
    skills: ["CAD Design", "Project Management", "Renewable Energy", "Problem Solving"],
    workExperience: [
      { company: "Tesla", position: "Mechanical Engineer", duration: "2020-Present" }
    ],
    isAvailableForMentoring: false,
    linkedinUrl: "https://linkedin.com/in/davidpark"
  }
];

const mockEvents = [
  {
    id: 1,
    title: "Annual Alumni Networking Gala",
    date: "2024-03-15",
    time: "6:00 PM - 10:00 PM",
    location: "Grand Ballroom, Downtown Hotel",
    description: "Join us for an evening of networking, reconnecting, and celebrating our alumni community. This year's gala features keynote speakers from various industries, live entertainment, and plenty of opportunities to make new connections.",
    longDescription: "Our Annual Alumni Networking Gala is the premier event of the year, bringing together hundreds of alumni from all graduating classes. The evening begins with a cocktail reception, followed by dinner and keynote presentations from distinguished alumni who have made significant impacts in their respective fields. This year's theme is 'Innovation and Impact' - celebrating how our alumni are changing the world through their work and leadership. The event includes networking sessions organized by industry, giving attendees the chance to connect with peers in similar fields. Don't miss this opportunity to reconnect with classmates, meet new contacts, and be inspired by the achievements of our alumni community.",
    attendees: ["Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Park"],
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
    category: "Networking",
    isUpcoming: true
  },
  {
    id: 2,
    title: "Tech Talk: AI in Modern Business",
    date: "2024-02-28",
    time: "7:00 PM - 9:00 PM",
    location: "University Auditorium",
    description: "A fascinating discussion on how artificial intelligence is transforming various industries. Led by alumni working at top tech companies.",
    longDescription: "Join us for an insightful evening exploring the transformative power of artificial intelligence in today's business landscape. Our panel of distinguished alumni, including engineers from Google, Microsoft, and OpenAI, will share their experiences and insights on how AI is reshaping industries from healthcare to finance. The session will cover practical applications, ethical considerations, and future trends in AI technology. This is an excellent opportunity for both recent graduates and experienced professionals to understand the implications of AI in their respective fields and learn about potential career opportunities in this rapidly growing sector.",
    attendees: ["Sarah Johnson"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
    category: "Technology",
    isUpcoming: true
  },
  {
    id: 3,
    title: "Career Development Workshop",
    date: "2024-01-20",
    time: "2:00 PM - 5:00 PM",
    location: "Student Center, Room 205",
    description: "Professional development workshop covering resume writing, interview skills, and career advancement strategies.",
    longDescription: "This comprehensive career development workshop is designed to help alumni at all stages of their careers. Whether you're a recent graduate looking for your first job or an experienced professional seeking advancement, this workshop provides valuable insights and practical tools. The session covers resume optimization for different industries, interview preparation techniques, salary negotiation strategies, and networking best practices. Interactive exercises and one-on-one coaching sessions with industry professionals make this a hands-on learning experience. All attendees will receive a digital toolkit with templates, checklists, and resources to continue their professional development journey.",
    attendees: ["Michael Chen", "Emily Rodriguez"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600",
    category: "Professional Development",
    isUpcoming: false
  },
  {
    id: 4,
    title: "Healthcare Innovation Summit",
    date: "2024-04-10",
    time: "9:00 AM - 4:00 PM",
    location: "Medical School Conference Center",
    description: "Full-day summit exploring the latest innovations in healthcare technology and patient care.",
    longDescription: "The Healthcare Innovation Summit brings together alumni working in various aspects of healthcare, from medical professionals to biotech entrepreneurs. This full-day event features presentations on cutting-edge medical technologies, discussions on healthcare policy, and networking opportunities with industry leaders. Topics include telemedicine, personalized medicine, medical AI, and healthcare accessibility. The summit provides a platform for alumni to share their research, discuss challenges in healthcare delivery, and explore collaborative opportunities. Whether you're a healthcare provider, researcher, entrepreneur, or work in health-related industries, this summit offers valuable insights into the future of healthcare.",
    attendees: ["Emily Rodriguez"],
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600",
    category: "Healthcare",
    isUpcoming: true
  }
];

const mockJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Meta",
    location: "Menlo Park, CA",
    type: "Full-time",
    description: "Join our team building the next generation of social technology. We're looking for experienced engineers to work on scalable systems.",
    longDescription: "We are seeking a Senior Software Engineer to join our dynamic team at Meta. In this role, you will be responsible for designing and implementing large-scale distributed systems that serve billions of users worldwide. You'll work closely with cross-functional teams to develop innovative features and improve existing products. The ideal candidate has experience with modern programming languages, system design, and a passion for solving complex technical challenges. You'll have the opportunity to mentor junior engineers and contribute to architectural decisions that impact millions of users. We offer competitive compensation, comprehensive benefits, and the chance to work on cutting-edge technology in a collaborative environment.",
    requirements: ["5+ years of software development experience", "Strong knowledge of system design", "Experience with distributed systems"],
    salary: "$180,000 - $250,000",
    postedBy: "Sarah Johnson",
    datePosted: "2024-01-15",
    applicationDeadline: "2024-02-15"
  },
  {
    id: 2,
    title: "Marketing Manager",
    company: "Apple",
    location: "Cupertino, CA",
    type: "Full-time",
    description: "Lead marketing campaigns for our consumer products division. Drive brand awareness and customer engagement.",
    longDescription: "Apple is looking for an innovative Marketing Manager to join our consumer products team. You'll be responsible for developing and executing comprehensive marketing strategies that enhance brand awareness and drive customer engagement. This role involves collaborating with creative teams, analyzing market trends, and managing multi-channel campaigns across digital and traditional media. The ideal candidate brings a deep understanding of consumer behavior, strong analytical skills, and the ability to think creatively about product positioning. You'll work on some of the world's most recognizable products and have the opportunity to influence how millions of customers interact with our brand. We're looking for someone who shares our passion for creating exceptional customer experiences.",
    requirements: ["3+ years of marketing experience", "Strong analytical skills", "Experience with digital marketing platforms"],
    salary: "$120,000 - $160,000",
    postedBy: "Emily Rodriguez",
    datePosted: "2024-01-18",
    applicationDeadline: "2024-02-20"
  },
  {
    id: 3,
    title: "Financial Analyst Intern",
    company: "JP Morgan Chase",
    location: "New York, NY",
    type: "Internship",
    description: "Summer internship program for finance students. Gain hands-on experience in investment banking and financial analysis.",
    longDescription: "Join JP Morgan Chase's prestigious summer internship program and gain invaluable experience in the world of finance. As a Financial Analyst Intern, you'll work alongside experienced professionals on real client engagements, financial modeling, and market analysis projects. This 10-week program provides comprehensive training in financial analysis, valuation techniques, and industry research. You'll have the opportunity to present your work to senior leadership and participate in networking events with professionals across the firm. The internship includes mentorship opportunities, professional development workshops, and exposure to various areas of investment banking. This is an excellent pathway to full-time opportunities and a chance to build lasting relationships in the finance industry.",
    requirements: ["Currently enrolled in finance, economics, or related field", "Strong analytical and communication skills", "Proficiency in Excel and financial modeling"],
    salary: "$8,000/month",
    postedBy: "Michael Chen",
    datePosted: "2024-01-10",
    applicationDeadline: "2024-03-01"
  },
  {
    id: 4,
    title: "Mechanical Engineer",
    company: "SpaceX",
    location: "Hawthorne, CA",
    type: "Full-time",
    description: "Design and develop rocket propulsion systems. Work on cutting-edge aerospace technology.",
    longDescription: "SpaceX is revolutionizing space technology with the ultimate goal of making life multiplanetary. We're seeking a talented Mechanical Engineer to join our propulsion team and contribute to the design and development of next-generation rocket engines. In this role, you'll work on critical components of our Raptor engines, collaborate with world-class engineers, and push the boundaries of what's possible in aerospace engineering. You'll be involved in the entire product development lifecycle, from initial concept through testing and flight operations. The position requires strong problem-solving skills, attention to detail, and the ability to work in a fast-paced, high-stakes environment. You'll have the opportunity to see your work launch into space and contribute to humanity's expansion beyond Earth.",
    requirements: ["BS in Mechanical Engineering or related field", "Experience with CAD software", "Knowledge of propulsion systems preferred"],
    salary: "$95,000 - $130,000",
    postedBy: "David Park",
    datePosted: "2024-01-12",
    applicationDeadline: "2024-02-25"
  }
];

// Hero Background Images
const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=1080&fit=crop",
    alt: "University campus with students walking"
  },
  {
    url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&h=1080&fit=crop",
    alt: "Professional networking event"
  },
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop",
    alt: "Business professionals collaborating"
  },
  {
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&h=1080&fit=crop",
    alt: "Modern office environment"
  },
  {
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&h=1080&fit=crop",
    alt: "Graduation ceremony celebration"
  }
];

// Main Connectify App Component
const Connectify = () => {
  // Core Navigation State
  const [currentPage, setCurrentPage] = useState('home');
  
  // User Authentication State
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  
  // Page-specific State
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [rsvpEvents, setRsvpEvents] = useState([]);
  
  // Filter and Search State
  const [alumniSearchTerm, setAlumniSearchTerm] = useState('');
  const [alumniFilterYear, setAlumniFilterYear] = useState('all');
  const [alumniFilterMajor, setAlumniFilterMajor] = useState('all');
  const [alumniFilterIndustry, setAlumniFilterIndustry] = useState('all');
  const [jobSearchTerm, setJobSearchTerm] = useState('');
  const [jobFilterType, setJobFilterType] = useState('all');
  
  // Chatbot State
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I\'m your Connectify assistant. How can I help you connect with our alumni community today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Hero Image Slider State
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // User Profile State for Dashboard
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 000-0000',
    graduationYear: '2021',
    major: 'Computer Science',
    company: 'Tech Corp',
    position: 'Software Developer',
    bio: 'Passionate about technology and connecting with fellow alumni.'
  });

  // LinkedIn Integration State
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);

  // Hero Image Slider Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Authentication Functions
  const handleLogin = (email, password) => {
    // Simulate login
    setUser({ 
      name: 'John Doe', 
      email: email,
      id: 99,
      graduationYear: 2021,
      major: 'Computer Science'
    });
    setShowLoginModal(false);
    toast({
      title: "Welcome back!",
      description: "You have successfully logged in to Connectify.",
    });
  };

  const handleSignUp = (formData) => {
    // Simulate sign up
    setUser({ 
      name: formData.name, 
      email: formData.email,
      id: 100,
      graduationYear: parseInt(formData.graduationYear),
      major: formData.major
    });
    setShowSignUpModal(false);
    toast({
      title: "Welcome to Connectify!",
      description: "Your account has been created successfully.",
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // RSVP Function
  const handleRSVP = (eventId) => {
    if (!rsvpEvents.includes(eventId)) {
      setRsvpEvents([...rsvpEvents, eventId]);
      toast({
        title: "RSVP Confirmed!",
        description: "You have successfully RSVP'd to this event.",
      });
    }
  };

  // Request Mentorship Function
  const handleMentorshipRequest = (alumniName) => {
    toast({
      title: "Mentorship Request Sent!",
      description: `Your mentorship request has been sent to ${alumniName}.`,
    });
  };

  // Job Application Function
  const handleJobApplication = (jobTitle, company) => {
    toast({
      title: "Application Submitted!",
      description: `Your application for ${jobTitle} at ${company} has been submitted.`,
    });
    setShowJobModal(false);
  };

  // Filter Functions
  const getFilteredAlumni = () => {
    return mockAlumni.filter(alumni => {
      const matchesSearch = alumni.name.toLowerCase().includes(alumniSearchTerm.toLowerCase()) ||
                          alumni.company.toLowerCase().includes(alumniSearchTerm.toLowerCase()) ||
                          alumni.position.toLowerCase().includes(alumniSearchTerm.toLowerCase());
      const matchesYear = alumniFilterYear === 'all' || !alumniFilterYear || alumni.graduationYear.toString() === alumniFilterYear;
      const matchesMajor = alumniFilterMajor === 'all' || !alumniFilterMajor || alumni.major === alumniFilterMajor;
      const matchesIndustry = alumniFilterIndustry === 'all' || !alumniFilterIndustry || alumni.industry === alumniFilterIndustry;
      
      return matchesSearch && matchesYear && matchesMajor && matchesIndustry;
    });
  };

  const getFilteredJobs = () => {
    return mockJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
                          job.location.toLowerCase().includes(jobSearchTerm.toLowerCase());
      const matchesType = jobFilterType === 'all' || !jobFilterType || job.type === jobFilterType;
      
      return matchesSearch && matchesType;
    });
  };

  // Chatbot Functions
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { sender: 'user', text: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful assistant for the Connectify alumni networking platform. You help users navigate the platform, connect with alumni, find events, and discover job opportunities. Keep responses concise and friendly. User asked: ${chatInput}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting right now. Please try again later.";
      
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "I'm having trouble connecting right now. Please make sure your API key is configured correctly." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Update Profile Function
  const handleUpdateProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    toast({
      title: "Profile Updated!",
      description: "Your profile has been successfully updated.",
    });
  };

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-card shadow-soft border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentPage('home')}
              className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent"
            >
              Connectify
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                <button 
                  onClick={() => setCurrentPage('home')}
                  className={`text-sm font-medium transition-colors hover:text-primary ${currentPage === 'home' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => setCurrentPage('alumni')}
                  className={`text-sm font-medium transition-colors hover:text-primary ${currentPage === 'alumni' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Alumni Directory
                </button>
                <button 
                  onClick={() => setCurrentPage('events')}
                  className={`text-sm font-medium transition-colors hover:text-primary ${currentPage === 'events' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Events
                </button>
                <button 
                  onClick={() => setCurrentPage('careers')}
                  className={`text-sm font-medium transition-colors hover:text-primary ${currentPage === 'careers' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Career Hub
                </button>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCurrentPage('dashboard')}
                  className="hidden md:flex"
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    size="sm"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  // Login Modal Component
  const LoginModal = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome Back</DialogTitle>
            <DialogDescription>
              Sign in to your Connectify account to access all features.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              className="flex-1"
              onClick={() => handleLogin(email, password)}
              disabled={!email || !password}
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowLoginModal(false);
                setShowSignUpModal(true);
              }}
            >
              Sign Up Instead
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Sign Up Modal Component
  const SignUpModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      graduationYear: '',
      major: ''
    });

    const handleSubmit = () => {
      handleSignUp(formData);
    };

    return (
      <Dialog open={showSignUpModal} onOpenChange={setShowSignUpModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join Connectify</DialogTitle>
            <DialogDescription>
              Create your account to start connecting with our alumni community.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="graduation-year">Graduation Year</Label>
              <Select value={formData.graduationYear} onValueChange={(value) => setFormData({...formData, graduationYear: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select graduation year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 10}, (_, i) => 2015 + i).map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="major">Major</Label>
              <Select value={formData.major} onValueChange={(value) => setFormData({...formData, major: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your major" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Business Administration">Business Administration</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              className="flex-1"
              onClick={handleSubmit}
              disabled={!formData.name || !formData.email || !formData.password || !formData.graduationYear || !formData.major}
            >
              Create Account
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowSignUpModal(false);
                setShowLoginModal(true);
              }}
            >
              Login Instead
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Job Detail Modal Component
  const JobDetailModal = () => (
    <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        {selectedJob && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedJob.title}</DialogTitle>
              <DialogDescription className="text-lg">
                {selectedJob.company} • {selectedJob.location} • {selectedJob.type}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div>
                <h4 className="font-semibold mb-2">Job Description</h4>
                <p className="text-muted-foreground">{selectedJob.longDescription}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {selectedJob.requirements?.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Salary: {selectedJob.salary}</p>
                  <p className="text-sm text-muted-foreground">Posted by: {selectedJob.postedBy}</p>
                </div>
                <Button 
                  onClick={() => handleJobApplication(selectedJob.title, selectedJob.company)}
                  className="bg-gradient-hero hover:bg-primary-hover"
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );

  // LinkedIn Integration Modal
  const LinkedInModal = () => (
    <Dialog open={showLinkedInModal} onOpenChange={setShowLinkedInModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkedinIcon className="h-5 w-5 text-primary" />
            Sync Your Profile
          </DialogTitle>
          <DialogDescription>
            Connect your LinkedIn account to automatically sync your professional information.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
              <LinkedinIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Why connect LinkedIn?</h3>
            <div className="text-left space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-success mt-1">•</span>
                <span className="text-sm">Automatically sync your work experience and skills</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-success mt-1">•</span>
                <span className="text-sm">Keep your alumni profile up-to-date effortlessly</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-success mt-1">•</span>
                <span className="text-sm">Enhanced networking opportunities</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-hero hover:bg-primary-hover"
            onClick={() => {
              setShowLinkedInModal(false);
              toast({
                title: "LinkedIn Connected!",
                description: "Your LinkedIn profile has been synced successfully.",
              });
            }}
          >
            <LinkedinIcon className="h-4 w-4 mr-2" />
            Connect with LinkedIn
          </Button>
          <Button variant="outline" onClick={() => setShowLinkedInModal(false)}>
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Chatbot Component
  const ChatBot = () => (
    <div className="fixed bottom-4 right-4 z-50">
      {!showChat ? (
        <Button
          onClick={() => setShowChat(true)}
          size="lg"
          className="rounded-full h-12 w-12 p-0 bg-gradient-hero hover:bg-primary-hover shadow-glow"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 h-96 shadow-card">
          <CardHeader className="pb-2 bg-gradient-hero text-primary-foreground rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Alumni Assistant</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
                className="h-6 w-6 p-0 hover:bg-white/20 text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-64 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted p-2 rounded-lg text-sm">
                    Bot is typing...
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button size="sm" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Homepage Component
  const HomePage = () => (
    <div className="space-y-0">
      {/* Hero Section with Sliding Background */}
      <section className="hero-background text-white py-32 min-h-screen flex items-center">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={image.alt}
            className={`hero-image ${index === currentHeroImage ? 'active' : 'inactive'}`}
          />
        ))}
        
        <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            Connect. Network. <span className="text-yellow-400">Thrive.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto opacity-95 leading-relaxed">
            Join thousands of alumni in building meaningful connections, discovering opportunities, and giving back to our community.
          </p>
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => setShowSignUpModal(true)}
                className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Join Our Community
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
             
            </div>
          ) : (
            <Button
              size="lg"
              onClick={() => setCurrentPage('alumni')}
              className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Welcome Back, {user.name}!
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center stat-item">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">15K+</div>
              <div className="text-muted-foreground font-medium">Active Alumni</div>
            </div>
            <div className="text-center stat-item">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground font-medium">Companies</div>
            </div>
            <div className="text-center stat-item">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">1.2K+</div>
              <div className="text-muted-foreground font-medium">Job Placements</div>
            </div>
            <div className="text-center stat-item">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Connectify?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the powerful features that make Connectify the premier platform for alumni networking and career advancement.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="feature-card p-8 text-center border-0 shadow-lg bg-gradient-card">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Network className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Networking</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI-powered matching connects you with alumni who share your interests, career goals, and industry focus.
              </p>
            </Card>
            
            <Card className="feature-card p-8 text-center border-0 shadow-lg bg-gradient-card">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Career Acceleration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access exclusive job opportunities, mentorship programs, and industry insights from successful alumni.
              </p>
            </Card>
            
            <Card className="feature-card p-8 text-center border-0 shadow-lg bg-gradient-card">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Trusted Community</h3>
              <p className="text-muted-foreground leading-relaxed">
                Verified alumni profiles and secure communication ensure authentic, meaningful professional relationships.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What We Offer</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Alumni Directory</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Connect with classmates and expand your professional network.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Job Board</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Explore career opportunities exclusively for our alumni.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Events & Reunions</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Stay connected with alumni events and class reunions.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto">
                <Video className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Mentorship Program</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Give back by mentoring current students or fellow alumni.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto">
                <BookOpenCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Continuing Education</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Access exclusive courses and workshops for lifelong learning.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Fundraising Campaigns</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Support your alma mater through various initiatives.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Impact */}
      <section className="py-24 bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Impact</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-lg mb-6 mx-auto">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-lg text-gray-300">Alumni</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-lg mb-6 mx-auto">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-lg text-gray-300">Countries</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-lg mb-6 mx-auto">
                <Handshake className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-lg text-gray-300">Mentorships</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-lg mb-6 mx-auto">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">$10M+</div>
              <div className="text-lg text-gray-300">Raised</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Informed & Engaged */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Stay Informed & Engaged</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Alumni Newsletter</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Get monthly updates on alumni achievements and university news.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto">
                <Podcast className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Alumni Podcast</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Listen to inspiring stories from successful alumni.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto">
                <Library className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Resource Library</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Access exclusive e-books, webinars, and career resources.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto">
                <Monitor className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Virtual Events</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Participate in online networking sessions and workshops.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* What Our Alumni Say */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Alumni Say</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white relative">
              <Quote className="h-8 w-8 text-blue-600 mb-4" />
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "The alumni network has been an invaluable resource for my career growth. I've made connections that have led to amazing opportunities."
              </p>
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" alt="Alumni" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">John Doe</div>
                  <div className="text-sm text-muted-foreground">Class of 2010</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white relative">
              <Quote className="h-8 w-8 text-blue-600 mb-4" />
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "I love attending the alumni events. It's a great way to stay connected with old friends and make new ones in my industry."
              </p>
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400" alt="Alumni" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">Jane Smith</div>
                  <div className="text-sm text-muted-foreground">Class of 2015</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white relative">
              <Quote className="h-8 w-8 text-blue-600 mb-4" />
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "The mentorship program helped me transition into a new career field. I'm grateful for the guidance and support from fellow alumni."
              </p>
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" alt="Alumni" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">Alex Johnson</div>
                  <div className="text-sm text-muted-foreground">Class of 2018</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Industry Insights */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Industry Insights</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay ahead with exclusive insights and trends from our alumni network across various industries.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <Badge variant="secondary">Technology</Badge>
              </div>
              <h3 className="font-semibold mb-2">AI Revolution</h3>
              <p className="text-sm text-muted-foreground">How AI is reshaping the tech industry and creating new opportunities.</p>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <Badge variant="secondary">Finance</Badge>
              </div>
              <h3 className="font-semibold mb-2">Market Trends</h3>
              <p className="text-sm text-muted-foreground">Latest financial market trends and investment opportunities.</p>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <Badge variant="secondary">Healthcare</Badge>
              </div>
              <h3 className="font-semibold mb-2">Innovation</h3>
              <p className="text-sm text-muted-foreground">Breakthrough innovations transforming healthcare delivery.</p>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
                <Badge variant="secondary">Global</Badge>
              </div>
              <h3 className="font-semibold mb-2">Remote Work</h3>
              <p className="text-sm text-muted-foreground">The future of work and global collaboration trends.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl mb-10 opacity-90 leading-relaxed">
            Join thousands of successful alumni who have accelerated their careers through meaningful connections and opportunities on Connectify.
          </p>
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => setShowSignUpModal(true)}
                className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Journey
                <Rocket className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setCurrentPage('events')}
                className="border-white text-white hover:bg-white hover:text-primary text-lg px-10 py-4 rounded-full font-semibold transition-all duration-300"
              >
                View Events
                <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              onClick={() => setCurrentPage('dashboard')}
              className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Go to Dashboard
              <BarChart3 className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => setCurrentPage('events')}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Events Calendar
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('career-hub')}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Job Board
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Mentorship Program
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Make a Donation
                  </button>
                </li>
              </ul>
            </div>

            {/* Stay Connected */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Stay Connected</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <LinkedinIcon className="h-4 w-4 mr-2" />
                  <button className="text-gray-300 hover:text-white transition-colors duration-200">
                    LinkedIn
                  </button>
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <button className="text-gray-300 hover:text-white transition-colors duration-200">
                    Newsletter
                  </button>
                </li>
                <li className="flex items-center">
                  <Podcast className="h-4 w-4 mr-2" />
                  <button className="text-gray-300 hover:text-white transition-colors duration-200">
                    Podcast
                  </button>
                </li>
                <li className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <button className="text-gray-300 hover:text-white transition-colors duration-200">
                    Tech Blog
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">123 University Ave, City, State 12345</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-gray-300">alumni@university.edu</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-gray-300">(123) 456-7890</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Saanthi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );

  // Alumni Directory Page Component
  const AlumniDirectoryPage = () => {
    const filteredAlumni = getFilteredAlumni();
    
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Alumni Directory</h1>
          <p className="text-muted-foreground">Connect with our vibrant community of {mockAlumni.length} alumni worldwide.</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-gradient-card">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="alumni-search">Search</Label>
                <Input
                  id="alumni-search"
                  placeholder="Name, company, position..."
                  value={alumniSearchTerm}
                  onChange={(e) => setAlumniSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="year-filter">Graduation Year</Label>
                <Select value={alumniFilterYear} onValueChange={setAlumniFilterYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {Array.from(new Set(mockAlumni.map(a => a.graduationYear))).sort().map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="major-filter">Major</Label>
                <Select value={alumniFilterMajor} onValueChange={setAlumniFilterMajor}>
                  <SelectTrigger>
                    <SelectValue placeholder="All majors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Majors</SelectItem>
                    {Array.from(new Set(mockAlumni.map(a => a.major))).map(major => (
                      <SelectItem key={major} value={major}>{major}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="industry-filter">Industry</Label>
                <Select value={alumniFilterIndustry} onValueChange={setAlumniFilterIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="All industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {Array.from(new Set(mockAlumni.map(a => a.industry))).map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Showing {filteredAlumni.length} of {mockAlumni.length} alumni
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alumni) => (
            <Card 
              key={alumni.id}
              className="cursor-pointer hover:shadow-card transition-all duration-300 transform hover:-translate-y-1 bg-gradient-card"
              onClick={() => {
                setSelectedAlumni(alumni);
                setCurrentPage('alumni-profile');
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={alumni.profilePicture} alt={alumni.name} />
                    <AvatarFallback>{alumni.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{alumni.name}</h3>
                    <p className="text-primary font-medium">{alumni.position}</p>
                    <p className="text-muted-foreground text-sm">{alumni.company}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {alumni.major} '{alumni.graduationYear.toString().slice(-2)}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {alumni.location}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {alumni.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {alumni.isAvailableForMentoring && (
                  <Badge className="bg-success-light text-success w-full justify-center">
                    <Star className="h-3 w-3 mr-1" />
                    Available for Mentoring
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Alumni Profile Page Component
  const AlumniProfilePage = () => {
    if (!selectedAlumni) return <div>Alumni not found</div>;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => setCurrentPage('alumni')}
          className="mb-6"
        >
          ← Back to Directory
        </Button>

        {/* Profile Header */}
        <Card className="mb-8 bg-gradient-card">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={selectedAlumni.profilePicture} alt={selectedAlumni.name} />
                  <AvatarFallback className="text-2xl">
                    {selectedAlumni.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{selectedAlumni.name}</h1>
                    <p className="text-xl text-primary font-medium mb-1">{selectedAlumni.position}</p>
                    <p className="text-lg text-muted-foreground mb-4">{selectedAlumni.company}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm">
                      <LinkedinIcon className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                  <p className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {selectedAlumni.major} • Class of {selectedAlumni.graduationYear}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {selectedAlumni.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedAlumni.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedAlumni.phone}
                  </p>
                </div>

                {selectedAlumni.isAvailableForMentoring && (
                  <div className="flex gap-2">
                    <Badge className="bg-success-light text-success">
                      <Star className="h-3 w-3 mr-1" />
                      Available for Mentoring
                    </Badge>
                    <Button 
                      size="sm"
                      onClick={() => handleMentorshipRequest(selectedAlumni.name)}
                    >
                      Request Mentorship
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{selectedAlumni.bio}</p>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedAlumni.workExperience.map((job, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                  <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">{job.position}</h4>
                    <p className="text-primary">{job.company}</p>
                    <p className="text-sm text-muted-foreground">{job.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Skills & Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedAlumni.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Events Page Component
  const EventsPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Alumni Events</h1>
        <p className="text-muted-foreground">Join us for networking, learning, and community building opportunities.</p>
      </div>

      <div className="space-y-6">
        {mockEvents.map((event) => (
          <Card 
            key={event.id}
            className="cursor-pointer hover:shadow-card transition-all duration-300 bg-gradient-card"
            onClick={() => {
              setSelectedEvent(event);
              setCurrentPage('event-detail');
            }}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <Badge className={event.isUpcoming ? "bg-success text-success-foreground" : "bg-muted"}>
                      {event.isUpcoming ? 'Upcoming' : 'Past'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-muted-foreground mb-4">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()} • {event.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </p>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {event.attendees.length} attending
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Event Detail Page Component
  const EventDetailPage = () => {
    if (!selectedEvent) return <div>Event not found</div>;
    
    const isRSVPed = rsvpEvents.includes(selectedEvent.id);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => setCurrentPage('events')}
          className="mb-6"
        >
          ← Back to Events
        </Button>

        {/* Event Header */}
        <div className="mb-8">
          <img
            src={selectedEvent.image}
            alt={selectedEvent.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{selectedEvent.title}</h1>
              <div className="space-y-2 text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedEvent.date).toLocaleDateString()} • {selectedEvent.time}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {selectedEvent.location}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {user && selectedEvent.isUpcoming && (
                <Button
                  onClick={() => handleRSVP(selectedEvent.id)}
                  disabled={isRSVPed}
                  className={isRSVPed ? "bg-success hover:bg-success" : ""}
                >
                  {isRSVPed ? (
                    <>
                      <Heart className="h-4 w-4 mr-2 fill-current" />
                      RSVP'd
                    </>
                  ) : (
                    'RSVP Now'
                  )}
                </Button>
              )}
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {selectedEvent.longDescription}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Attendees ({selectedEvent.attendees.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedEvent.attendees.map((attendeeName, index) => {
                    const attendee = mockAlumni.find(a => a.name === attendeeName);
                    return (
                      <div key={index} className="flex items-center gap-3">
                        {attendee ? (
                          <>
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={attendee.profilePicture} alt={attendee.name} />
                              <AvatarFallback className="text-xs">
                                {attendee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{attendee.name}</p>
                              <p className="text-xs text-muted-foreground">{attendee.position}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {attendeeName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <p className="font-medium text-sm">{attendeeName}</p>
                          </>
                        )}
                      </div>
                    );
                  })}
                  {user && isRSVPed && (
                    <div className="flex items-center gap-3 pt-2 border-t">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sm">{user.name} (You)</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Career Hub Page Component
  const CareerHubPage = () => {
    const filteredJobs = getFilteredJobs();
    
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Career Hub</h1>
          <p className="text-muted-foreground">Discover job opportunities shared by our alumni community.</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-gradient-card">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="job-search">Search</Label>
                <Input
                  id="job-search"
                  placeholder="Job title, company, location..."
                  value={jobSearchTerm}
                  onChange={(e) => setJobSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="type-filter">Job Type</Label>
                <Select value={jobFilterType} onValueChange={setJobFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Showing {filteredJobs.length} of {mockJobs.length} opportunities
          </p>
        </div>

        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card 
              key={job.id}
              className="cursor-pointer hover:shadow-card transition-all duration-300 bg-gradient-card"
              onClick={() => {
                setSelectedJob(job);
                setShowJobModal(true);
              }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                        <p className="text-primary font-medium mb-1">{job.company}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {job.salary}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{job.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Posted by {job.postedBy} • {new Date(job.datePosted).toLocaleDateString()}
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="self-start">
                    {job.type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Dashboard Page Component
  const DashboardPage = () => {
    if (!user) {
      setCurrentPage('home');
      return null;
    }

    const [editMode, setEditMode] = useState(false);
    const [editedProfile, setEditedProfile] = useState(userProfile);

    const handleSaveProfile = () => {
      handleUpdateProfile(editedProfile);
      setEditMode(false);
    };

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <Card className="bg-gradient-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  My Profile
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                >
                  {editMode ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editMode ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="profile-name">Name</Label>
                    <Input
                      id="profile-name"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="profile-email">Email</Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="profile-phone">Phone</Label>
                    <Input
                      id="profile-phone"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="profile-company">Company</Label>
                    <Input
                      id="profile-company"
                      value={editedProfile.company}
                      onChange={(e) => setEditedProfile({...editedProfile, company: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="profile-position">Position</Label>
                    <Input
                      id="profile-position"
                      value={editedProfile.position}
                      onChange={(e) => setEditedProfile({...editedProfile, position: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="profile-bio">Bio</Label>
                    <Textarea
                      id="profile-bio"
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {userProfile.name}</p>
                    <p><strong>Email:</strong> {userProfile.email}</p>
                    <p><strong>Phone:</strong> {userProfile.phone}</p>
                    <p><strong>Graduation Year:</strong> {userProfile.graduationYear}</p>
                    <p><strong>Major:</strong> {userProfile.major}</p>
                    <p><strong>Company:</strong> {userProfile.company}</p>
                    <p><strong>Position:</strong> {userProfile.position}</p>
                    <p><strong>Bio:</strong> {userProfile.bio}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* LinkedIn Integration Section */}
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkedinIcon className="h-5 w-5 text-primary" />
                Sync Your Profile
              </CardTitle>
              <CardDescription>
                Keep your alumni profile up-to-date with your LinkedIn information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mb-4">
                  <LinkedinIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Connect with LinkedIn</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Automatically sync your work experience and skills, keeping your alumni profile up-to-date effortlessly.
                </p>
                <Button 
                  onClick={() => setShowLinkedInModal(true)}
                  className="bg-gradient-hero hover:bg-primary-hover"
                >
                  <LinkedinIcon className="h-4 w-4 mr-2" />
                  Connect with LinkedIn
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCurrentPage('alumni')}
              >
                <Users className="h-4 w-4 mr-2" />
                Browse Alumni Directory
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCurrentPage('events')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Upcoming Events
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCurrentPage('careers')}
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Explore Career Opportunities
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Joined Connectify community</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Profile created successfully</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Main Render Function
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'alumni':
        return <AlumniDirectoryPage />;
      case 'alumni-profile':
        return <AlumniProfilePage />;
      case 'events':
        return <EventsPage />;
      case 'event-detail':
        return <EventDetailPage />;
      case 'careers':
        return <CareerHubPage />;
      case 'dashboard':
        return <DashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {renderCurrentPage()}
      </main>
      
      {/* Modals */}
      <LoginModal />
      <SignUpModal />
      <JobDetailModal />
      <LinkedInModal />
      
      {/* Chatbot */}
      <ChatBot />
    </div>
  );
};

export default Connectify;
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { 
  Search,
  Filter,
  Users,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  MessageCircle,
  Calendar,
  Award,
  TrendingUp,
  Heart,
  Plus
} from 'lucide-react';

// Mock data for mentors
const mentors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Senior Software Engineer",
    company: "Google",
    location: "San Francisco, CA",
    graduationYear: "2015",
    expertise: ["Software Engineering", "AI/ML", "Leadership"],
    rating: 4.9,
    reviews: 47,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "Passionate about helping new graduates navigate their tech careers. Specialized in software engineering and machine learning.",
    availability: "Available",
    sessions: 156
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Product Manager",
    company: "Microsoft",
    location: "Seattle, WA",
    graduationYear: "2012",
    expertise: ["Product Management", "Strategy", "Analytics"],
    rating: 4.8,
    reviews: 32,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Helping aspiring product managers build successful careers in tech. 8+ years of experience in product strategy.",
    availability: "Busy",
    sessions: 89
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Marketing Director",
    company: "Adobe",
    location: "Austin, TX",
    graduationYear: "2014",
    expertise: ["Digital Marketing", "Brand Strategy", "Growth"],
    rating: 4.9,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Experienced marketing professional passionate about helping others build impactful marketing careers.",
    availability: "Available",
    sessions: 73
  },
  {
    id: 4,
    name: "David Kim",
    title: "Data Scientist",
    company: "Netflix",
    location: "Los Angeles, CA",
    graduationYear: "2016",
    expertise: ["Data Science", "Machine Learning", "Analytics"],
    rating: 4.7,
    reviews: 41,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Data science expert helping mentees break into the field and advance their analytical skills.",
    availability: "Available",
    sessions: 112
  },
  {
    id: 5,
    name: "Lisa Thompson",
    title: "UX Design Lead",
    company: "Airbnb",
    location: "San Francisco, CA",
    graduationYear: "2013",
    expertise: ["UX Design", "Design Systems", "User Research"],
    rating: 4.8,
    reviews: 35,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    bio: "Design leader passionate about mentoring the next generation of UX professionals.",
    availability: "Available",
    sessions: 94
  },
  {
    id: 6,
    name: "James Wilson",
    title: "Financial Analyst",
    company: "Goldman Sachs",
    location: "New York, NY",
    graduationYear: "2011",
    expertise: ["Finance", "Investment Banking", "Financial Modeling"],
    rating: 4.6,
    reviews: 22,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    bio: "Finance professional helping students and early-career professionals navigate the financial services industry.",
    availability: "Busy",
    sessions: 67
  }
];

const Mentorship = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isBecomeDialogOpen, setIsBecomeDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<typeof mentors[0] | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchSectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

  const expertiseOptions = [
    'All', 'Software Engineering', 'Product Management', 'Data Science', 
    'UX Design', 'Marketing', 'Finance', 'AI/ML', 'Leadership'
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExpertise = selectedExpertise === '' || selectedExpertise === 'All' ||
                            mentor.expertise.some(exp => exp.includes(selectedExpertise));
    
    return matchesSearch && matchesExpertise;
  });

  const handleRequestMentorship = (mentor: typeof mentors[0]) => {
    setSelectedMentor(mentor);
    setIsRequestDialogOpen(true);
  };

  const handleFindMentor = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 500);
  };

  const handleBecomeMentor = () => {
    setIsBecomeDialogOpen(true);
  };

  const handleSendRequest = () => {
    // Close the dialog
    setIsRequestDialogOpen(false);
    
    // Show success toast
    toast({
      title: "Request Sent Successfully!",
      description: `Your mentorship request has been sent to ${selectedMentor?.name}. They will get back to you soon.`,
      variant: "default",
    });
  };

  const handleScheduleSession = (mentor: typeof mentors[0]) => {
    setSelectedMentor(mentor);
    setIsScheduleDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Mentorship Program
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-95">
              Connect with experienced alumni mentors who can guide your career journey and help you achieve your professional goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={handleFindMentor}
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 rounded-full font-semibold"
              >
                <Users className="mr-2 h-5 w-5" />
                Find a Mentor
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleBecomeMentor}
                className="border-white text-white bg-transparent hover:bg-white hover:text-primary text-lg px-8 py-4 rounded-full font-semibold"
              >
                <Heart className="mr-2 h-5 w-5" />
                Become a Mentor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground font-medium">Active Mentors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">2.5K+</div>
              <div className="text-muted-foreground font-medium">Mentorship Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground font-medium">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">4.8</div>
              <div className="text-muted-foreground font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section ref={searchSectionRef} className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                ref={searchInputRef}
                placeholder="Search mentors by name, title, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {expertiseOptions.map((expertise) => (
                <Button
                  key={expertise}
                  variant={selectedExpertise === expertise ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedExpertise(expertise === 'All' ? '' : expertise)}
                  className="rounded-full"
                >
                  {expertise}
                </Button>
              ))}
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <Card key={mentor.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={mentor.image} alt={mentor.name} />
                    <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{mentor.name}</h3>
                    <p className="text-muted-foreground mb-1">{mentor.title}</p>
                    <p className="text-sm text-muted-foreground mb-2">{mentor.company}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {mentor.location}
                    </div>
                  </div>
                  <Badge 
                    variant={mentor.availability === 'Available' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {mentor.availability}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {mentor.bio}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {mentor.expertise.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{mentor.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({mentor.reviews} reviews)</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {mentor.sessions} sessions
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    onClick={() => handleRequestMentorship(mentor)}
                    disabled={mentor.availability === 'Busy'}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Request Mentorship
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleScheduleSession(mentor)}
                    disabled={mentor.availability === 'Busy'}
                    title="Schedule a session"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Getting started with our mentorship program is simple and straightforward.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-0 shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Find Your Mentor</h3>
              <p className="text-muted-foreground leading-relaxed">
                Browse through our extensive network of experienced alumni mentors and find someone who matches your career goals and interests.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Connect & Schedule</h3>
              <p className="text-muted-foreground leading-relaxed">
                Send a mentorship request with your goals and schedule a convenient time for your first session with your chosen mentor.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Grow & Succeed</h3>
              <p className="text-muted-foreground leading-relaxed">
                Engage in regular mentorship sessions, receive personalized guidance, and accelerate your career growth with expert insights.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Request Mentorship Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Mentorship</DialogTitle>
          </DialogHeader>
          {selectedMentor && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedMentor.image} alt={selectedMentor.name} />
                  <AvatarFallback>{selectedMentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{selectedMentor.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedMentor.title} at {selectedMentor.company}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goals">What are your career goals?</Label>
                  <Textarea
                    id="goals"
                    placeholder="Tell your mentor about your career aspirations and what you hope to achieve through this mentorship..."
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="experience">Your current experience level</Label>
                  <Textarea
                    id="experience"
                    placeholder="Briefly describe your current role, experience, and background..."
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="expectations">What do you expect from this mentorship?</Label>
                  <Textarea
                    id="expectations"
                    placeholder="Describe what kind of guidance and support you're looking for..."
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1"
                  onClick={handleSendRequest}
                >
                  Send Request
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsRequestDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Become a Mentor Dialog */}
      <Dialog open={isBecomeDialogOpen} onOpenChange={setIsBecomeDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Become a Mentor</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentTitle">Current Job Title *</Label>
                <Input
                  id="currentTitle"
                  placeholder="e.g., Senior Software Engineer"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  placeholder="e.g., Google, Microsoft"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="graduationYear">Graduation Year *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 30 }, (_, i) => 2024 - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="11-15">11-15 years</SelectItem>
                    <SelectItem value="15+">15+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="expertise">Areas of Expertise *</Label>
              <Textarea
                id="expertise"
                placeholder="List your areas of expertise (e.g., Software Engineering, AI/ML, Leadership, Product Management)"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="bio">Professional Bio *</Label>
              <Textarea
                id="bio"
                placeholder="Write a brief professional bio that describes your background, experience, and what you're passionate about mentoring..."
                className="mt-1"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="mentorshipGoals">Mentorship Goals</Label>
              <Textarea
                id="mentorshipGoals"
                placeholder="What do you hope to achieve as a mentor? What kind of guidance do you want to provide?"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="availability">Availability *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="limited">Limited Availability</SelectItem>
                  <SelectItem value="busy">Currently Busy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="linkedinProfile">LinkedIn Profile (Optional)</Label>
              <Input
                id="linkedinProfile"
                placeholder="https://linkedin.com/in/yourprofile"
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                className="flex-1"
                onClick={() => {
                  // Here you would typically submit the form data
                  alert('Mentor application submitted successfully! We will review your application and get back to you soon.');
                  setIsBecomeDialogOpen(false);
                }}
              >
                Submit Application
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsBecomeDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Session Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule a Session with {selectedMentor?.name}</DialogTitle>
          </DialogHeader>
          {selectedMentor && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedMentor.image} alt={selectedMentor.name} />
                  <AvatarFallback>{selectedMentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedMentor.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMentor.title} at {selectedMentor.company}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="sessionType">Session Type *</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select session type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="career-guidance">Career Guidance</SelectItem>
                    <SelectItem value="technical-review">Technical Review</SelectItem>
                    <SelectItem value="interview-prep">Interview Preparation</SelectItem>
                    <SelectItem value="general-mentorship">General Mentorship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="preferredDate">Preferred Date *</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  className="mt-1"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="preferredTime">Preferred Time *</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select preferred time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                    <SelectItem value="17:00">5:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sessionDuration">Session Duration *</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sessionNotes">Session Notes</Label>
                <Textarea
                  id="sessionNotes"
                  placeholder="What would you like to discuss in this session? Any specific topics or questions?"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setIsScheduleDialogOpen(false);
                    toast({
                      title: "Session Request Sent!",
                      description: `Your session request has been sent to ${selectedMentor?.name}. They will confirm the availability and get back to you.`,
                      variant: "default",
                    });
                  }}
                >
                  Send Session Request
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsScheduleDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Mentorship;
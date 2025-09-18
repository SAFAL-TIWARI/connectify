import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/Navigation';
import MessageDialog from '@/components/MessageDialog';
import { 
  Search, 
  MapPin, 
  Building, 
  GraduationCap, 
  Filter,
  MessageCircle,
  LinkedinIcon,
  Mail,
  Phone,
  X,
  ExternalLink
} from 'lucide-react';

// Mock Alumni Data
const mockAlumni = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "demo.sharma@email.com",
    phone: "+91 98765 43210",
    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    graduationYear: 2018,
    major: "Computer Science",
    industry: "Technology",
    company: "Infosys",
    position: "Senior Software Engineer",
    location: "Bengaluru, KA",
    bio: "Passionate about AI and machine learning. Love mentoring new graduates and helping them navigate their tech careers.",
    skills: ["JavaScript", "Python", "Machine Learning", "Leadership"],
    workExperience: [
      { company: "Infosys", position: "Senior Software Engineer", duration: "2020-Present" },
      { company: "TCS", position: "Software Engineer", duration: "2018-2020" }
    ],
    isAvailableForMentoring: true,
    linkedinUrl: "https://linkedin.com/"
  },
  {
    id: 2,
    name: "Rohan Mehta",
    email: "demo.mehta@email.com",
    phone: "+91 91234 56789",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    graduationYear: 2019,
    major: "Business Administration",
    industry: "Finance",
    company: "HDFC Bank",
    position: "Investment Analyst",
    location: "Mumbai, MH",
    bio: "Finance professional with expertise in investment strategies and market analysis. Always eager to share knowledge with fellow alumni.",
    skills: ["Financial Analysis", "Investment Strategy", "Risk Management", "Excel"],
    workExperience: [
      { company: "HDFC Bank", position: "Investment Analyst", duration: "2019-Present" }
    ],
    isAvailableForMentoring: true,
    linkedinUrl: "https://linkedin.com/"
  },
  {
    id: 3,
    name: "Ananya Gupta",
    email: "demo.gupta@email.com",
    phone: "+91 87654 32109",
    profilePicture: "https://randomuser.me/api/portraits/women/8.jpg",
    graduationYear: 2017,
    major: "Marketing",
    industry: "Healthcare",
    company: "Sun Pharma",
    position: "Marketing Director",
    location: "Mumbai, MH",
    bio: "Marketing executive with a passion for healthcare innovation. Love connecting with alumni and sharing career insights.",
    skills: ["Digital Marketing", "Brand Strategy", "Product Launch", "Team Leadership"],
    workExperience: [
      { company: "Sun Pharma", position: "Marketing Director", duration: "2021-Present" },
      { company: "Cipla", position: "Senior Marketing Manager", duration: "2018-2021" },
      { company: "Dr. Reddy's", position: "Marketing Coordinator", duration: "2017-2018" }
    ],
    isAvailableForMentoring: true,
    linkedinUrl: "https://linkedin.com/"
  },
  {
    id: 4,
    name: "Aditya Kumar",
    email: "demo.kumar@email.com",
    phone: "+91 76543 21098",
    profilePicture: "https://randomuser.me/api/portraits/men/9.jpg",
    graduationYear: 2020,
    major: "Engineering",
    industry: "Automotive",
    company: "Tata Motors",
    position: "Mechanical Engineer",
    location: "Pune, MH",
    bio: "Mechanical engineer working on sustainable transportation solutions. Passionate about innovation and environmental impact.",
    skills: ["CAD Design", "Project Management", "Electric Vehicles", "Problem Solving"],
    workExperience: [
      { company: "Tata Motors", position: "Mechanical Engineer", duration: "2020-Present" }
    ],
    isAvailableForMentoring: false,
    linkedinUrl: "https://linkedin.com/"
  }
];

const AlumniDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterMajor, setFilterMajor] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [selectedAlumni, setSelectedAlumni] = useState<typeof mockAlumni[0] | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState<typeof mockAlumni[0] | null>(null);
  const { toast } = useToast();

  // Filter Functions
  const getFilteredAlumni = () => {
    return mockAlumni.filter(alumni => {
      const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alumni.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alumni.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = filterYear === 'all' || !filterYear || alumni.graduationYear.toString() === filterYear;
      const matchesMajor = filterMajor === 'all' || !filterMajor || alumni.major === filterMajor;
      const matchesIndustry = filterIndustry === 'all' || !filterIndustry || alumni.industry === filterIndustry;
      
      return matchesSearch && matchesYear && matchesMajor && matchesIndustry;
    });
  };

  const filteredAlumni = getFilteredAlumni();

  const handleViewProfile = (alumni: typeof mockAlumni[0]) => {
    setSelectedAlumni(alumni);
    setIsDetailModalOpen(true);
  };

  const handleConnect = (alumni: typeof mockAlumni[0]) => {
    toast({
      title: "Connection Request Sent!",
      description: `Your connection request has been sent to ${alumni.name}. They will be notified via email.`,
    });
  };

  const handleMessage = (alumni: typeof mockAlumni[0]) => {
    setMessageRecipient(alumni);
    setIsMessageDialogOpen(true);
  };

  const handleEmail = (alumni: typeof mockAlumni[0]) => {
    window.open(`mailto:${alumni.email}`, '_blank');
  };

  const handleLinkedIn = (alumni: typeof mockAlumni[0]) => {
    window.open(alumni.linkedinUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Alumni Directory</h1>
        <p className="text-muted-foreground">Connect with fellow alumni from your university community.</p>
      </div>

      {/* Filters */}
      <Card className="mb-8 bg-gradient-card">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Name, company, position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="year-filter">Graduation Year</Label>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger>
                  <SelectValue placeholder="All years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2019">2019</SelectItem>
                  <SelectItem value="2018">2018</SelectItem>
                  <SelectItem value="2017">2017</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="major-filter">Major</Label>
              <Select value={filterMajor} onValueChange={setFilterMajor}>
                <SelectTrigger>
                  <SelectValue placeholder="All majors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Majors</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Business Administration">Business Administration</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="industry-filter">Industry</Label>
              <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="All industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Automotive">Automotive</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
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
            className="cursor-pointer hover:shadow-card transition-all duration-300 bg-gradient-card"
            onClick={() => handleViewProfile(alumni)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={alumni.profilePicture} alt={alumni.name} />
                  <AvatarFallback>{alumni.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-1 truncate">{alumni.name}</h3>
                  <p className="text-primary font-medium mb-1 truncate">{alumni.position}</p>
                  <p className="text-muted-foreground text-sm truncate">{alumni.company}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-3 w-3" />
                  <span>{alumni.major} • Batch of {alumni.graduationYear}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{alumni.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="h-3 w-3" />
                  <span>{alumni.industry}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {alumni.bio}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {alumni.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {alumni.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{alumni.skills.length - 3} more
                  </Badge>
                )}
              </div>

              {alumni.isAvailableForMentoring && (
                <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
                  Available for Mentoring
                </Badge>
              )}

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMessage(alumni);
                  }}
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Message
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnect(alumni);
                  }}
                >
                  Connect
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEmail(alumni);
                  }}
                >
                  <Mail className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLinkedIn(alumni);
                  }}
                >
                  <LinkedinIcon className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAlumni.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No alumni found matching your criteria.</p>
            <p className="text-sm">Try adjusting your filters or search terms.</p>
          </div>
        </div>
      )}

      {/* Alumni Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedAlumni && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedAlumni.profilePicture} alt={selectedAlumni.name} />
                    <AvatarFallback>{selectedAlumni.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedAlumni.name}</h2>
                    <p className="text-primary font-medium">{selectedAlumni.position}</p>
                    <p className="text-muted-foreground">{selectedAlumni.company}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAlumni.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAlumni.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAlumni.location}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Education & Background */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Education & Background</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAlumni.major} • Batch of {selectedAlumni.graduationYear}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAlumni.industry}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">About</h3>
                  <p className="text-muted-foreground">{selectedAlumni.bio}</p>
                </div>

                <Separator />

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAlumni.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Work Experience */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Work Experience</h3>
                  <div className="space-y-3">
                    {selectedAlumni.workExperience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h4 className="font-medium">{exp.position}</h4>
                        <p className="text-primary">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedAlumni.isAvailableForMentoring && (
                  <>
                    <Separator />
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          Available for Mentoring
                        </Badge>
                      </div>
                      <p className="text-sm text-green-700">
                        This alumni is available to mentor students and recent graduates.
                      </p>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMessage(selectedAlumni);
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnect(selectedAlumni);
                    }}
                  >
                    Connect
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEmail(selectedAlumni);
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLinkedIn(selectedAlumni);
                    }}
                  >
                    <LinkedinIcon className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      {messageRecipient && (
        <MessageDialog
          isOpen={isMessageDialogOpen}
          onClose={() => setIsMessageDialogOpen(false)}
          recipient={messageRecipient}
        />
      )}
      </div>
    </div>
  );
};

export default AlumniDirectory;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/Navigation';
import { 
  Search, 
  MapPin, 
  Clock, 
  Briefcase, 
  Building,
  DollarSign,
  Calendar,
  User,
  ChevronRight,
  X,
  Plus,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

// Mock Jobs Data
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
    description: "Design and develop mechanical systems for next-generation spacecraft and launch vehicles.",
    longDescription: "SpaceX is seeking a talented Mechanical Engineer to join our mission of making life multiplanetary. You'll be responsible for designing, analyzing, and testing mechanical systems for our spacecraft and launch vehicles. This role involves working on cutting-edge projects including the Starship program, Falcon 9 rockets, and Dragon spacecraft. You'll collaborate with multidisciplinary teams to solve complex engineering challenges and push the boundaries of space technology. The ideal candidate has experience with CAD software, finite element analysis, and mechanical design principles. You'll have the opportunity to see your designs come to life and contribute to historic space missions. We're looking for engineers who are passionate about space exploration and want to help humanity become a spacefaring civilization.",
    requirements: ["Bachelor's degree in Mechanical Engineering", "Experience with CAD software (SolidWorks, CATIA)", "Knowledge of materials science and manufacturing processes"],
    salary: "$95,000 - $130,000",
    postedBy: "David Park",
    datePosted: "2024-01-22",
    applicationDeadline: "2024-02-25"
  }
];

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null);
  const [isJobDetailModalOpen, setIsJobDetailModalOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [jobs, setJobs] = useState(mockJobs);
  const { toast } = useToast();

  // New job form state
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: '',
    longDescription: '',
    requirements: [''],
    salary: '',
    applicationDeadline: ''
  });

  // Filter Functions
  const getFilteredJobs = () => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || !filterType || job.type === filterType;
      
      return matchesSearch && matchesType;
    });
  };

  const filteredJobs = getFilteredJobs();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysUntilDeadline = (deadlineString: string) => {
    const deadline = new Date(deadlineString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleApplyNow = (job: typeof mockJobs[0]) => {
    toast({
      title: "Application Submitted!",
      description: `Your application for "${job.title}" at ${job.company} has been submitted successfully. You will receive a confirmation email shortly.`,
    });
  };

  const handleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
      toast({
        title: "Job Removed",
        description: "Job has been removed from your saved jobs.",
      });
    } else {
      setSavedJobs([...savedJobs, jobId]);
      toast({
        title: "Job Saved!",
        description: "Job has been added to your saved jobs.",
      });
    }
  };

  const handleViewJobDetails = (job: typeof mockJobs[0]) => {
    setSelectedJob(job);
    setIsJobDetailModalOpen(true);
  };

  const handlePostJob = () => {
    setIsPostJobModalOpen(true);
  };

  const handleSubmitNewJob = () => {
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.description || !newJob.applicationDeadline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newJobData = {
      id: jobs.length + 1,
      ...newJob,
      requirements: newJob.requirements.filter(req => req.trim() !== ''),
      postedBy: "Current User", // In a real app, this would be the logged-in user
      datePosted: new Date().toISOString().split('T')[0]
    };

    setJobs([newJobData, ...jobs]); // Add to the beginning to show as recent
    setIsPostJobModalOpen(false);
    setNewJob({
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      description: '',
      longDescription: '',
      requirements: [''],
      salary: '',
      applicationDeadline: ''
    });

    toast({
      title: "Job Posted Successfully!",
      description: "Your job posting has been published and is now visible to all alumni.",
    });
  };

  const addRequirement = () => {
    setNewJob({
      ...newJob,
      requirements: [...newJob.requirements, '']
    });
  };

  const updateRequirement = (index: number, value: string) => {
    const updatedRequirements = [...newJob.requirements];
    updatedRequirements[index] = value;
    setNewJob({
      ...newJob,
      requirements: updatedRequirements
    });
  };

  const removeRequirement = (index: number) => {
    if (newJob.requirements.length > 1) {
      const updatedRequirements = newJob.requirements.filter((_, i) => i !== index);
      setNewJob({
        ...newJob,
        requirements: updatedRequirements
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="job-search"
                  placeholder="Job title, company, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="type-filter">Job Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
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
          Showing {filteredJobs.length} of {jobs.length} opportunities
        </p>
      </div>

      <div className="space-y-6">
        {filteredJobs.map((job) => (
          <Card 
            key={job.id}
            className="cursor-pointer hover:shadow-card transition-all duration-300 bg-gradient-card"
            onClick={() => handleViewJobDetails(job)}
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
                          <DollarSign className="h-3 w-3" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requirements.slice(0, 2).map((req, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                    {job.requirements.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.requirements.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Posted by {job.postedBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Posted {formatDate(job.datePosted)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:items-end">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Application Deadline</div>
                    <div className="font-medium">{formatDate(job.applicationDeadline)}</div>
                    <div className="text-xs text-muted-foreground">
                      {getDaysUntilDeadline(job.applicationDeadline)} days left
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyNow(job);
                      }}
                    >
                      Apply Now
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveJob(job.id);
                      }}
                    >
                      {savedJobs.includes(job.id) ? (
                        <BookmarkCheck className="h-3 w-3" />
                      ) : (
                        <Bookmark className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No job opportunities found matching your criteria.</p>
            <p className="text-sm">Try adjusting your search terms or filters.</p>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <Card className="mt-12 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Want to Post a Job?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Help fellow alumni find their next opportunity by posting job openings from your company. 
            It's a great way to give back to the community and find talented candidates.
          </p>
          <Button size="lg" onClick={handlePostJob}>
            Post a Job Opportunity
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Job Detail Modal */}
      <Dialog open={isJobDetailModalOpen} onOpenChange={setIsJobDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedJob.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Company Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center">
                    <Building className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedJob.company}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedJob.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {selectedJob.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {selectedJob.salary}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Job Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedJob.longDescription}
                  </p>
                </div>

                <Separator />

                {/* Requirements */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Job Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Job Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Posted by {selectedJob.postedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Posted {formatDate(selectedJob.datePosted)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Application Deadline</h3>
                    <div className="text-lg font-medium">{formatDate(selectedJob.applicationDeadline)}</div>
                    <div className="text-sm text-muted-foreground">
                      {getDaysUntilDeadline(selectedJob.applicationDeadline)} days left
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      handleApplyNow(selectedJob);
                      setIsJobDetailModalOpen(false);
                    }}
                  >
                    Apply Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleSaveJob(selectedJob.id)}
                  >
                    {savedJobs.includes(selectedJob.id) ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 mr-2" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save Job
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Post Job Modal */}
      <Dialog open={isPostJobModalOpen} onOpenChange={setIsPostJobModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Post a Job Opportunity</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="job-title">Job Title *</Label>
                <Input
                  id="job-title"
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={newJob.company}
                  onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                  placeholder="e.g. Google"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={newJob.location}
                  onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
              <div>
                <Label htmlFor="job-type">Job Type</Label>
                <Select value={newJob.type} onValueChange={(value) => setNewJob({...newJob, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                value={newJob.salary}
                onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                placeholder="e.g. $120,000 - $160,000"
              />
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={newJob.description}
                onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                placeholder="Brief description of the role..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="long-description">Detailed Description</Label>
              <Textarea
                id="long-description"
                value={newJob.longDescription}
                onChange={(e) => setNewJob({...newJob, longDescription: e.target.value})}
                placeholder="Detailed job description, responsibilities, and what makes this role exciting..."
                rows={5}
              />
            </div>

            <div>
              <Label>Requirements</Label>
              <div className="space-y-2">
                {newJob.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder="e.g. 3+ years of experience in..."
                    />
                    {newJob.requirements.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRequirement}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="deadline">Application Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={newJob.applicationDeadline}
                onChange={(e) => setNewJob({...newJob, applicationDeadline: e.target.value})}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSubmitNewJob} className="flex-1">
                Post Job
              </Button>
              <Button variant="outline" onClick={() => setIsPostJobModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default Careers;
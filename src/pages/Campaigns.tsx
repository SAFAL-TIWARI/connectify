import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import { 
  Search,
  Filter,
  Plus,
  Users,
  Calendar,
  Heart,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Lightbulb,
  Building,
  GraduationCap,
  Zap
} from 'lucide-react';

// Mock data for campaigns
const campaigns = [
  {
    id: 1,
    title: "Vidyarthi Sahayata Kosh: Empowering Rural Students",
    description: "Provide educational opportunities for talented students from rural and economically disadvantaged backgrounds across India.",
    image: "https://static.toiimg.com/thumb/msid-119605395,imgsize-98793,width-400,resizemode-4/119605395.jpg?w=600&h=400&fit=crop",
    category: "Education",
    tags: ["Education", "Rural Development", "Empowerment"],
    supporters: 520,
    raised: 1500000,
    goal: 2500000,
    progress: 60,
    endDate: "2025-12-31",
    organizer: "Connectify Foundation",
    featured: true
  },
  {
    id: 2,
    title: "Atmanirbhar Innovation Lab Expansion",
    description: "Support the expansion of our university's innovation lab to foster entrepreneurship and cutting-edge research in line with Make in India initiative.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
    category: "Research",
    tags: ["Research", "Innovation", "Make in India"],
    supporters: 180,
    raised: 750000,
    goal: 1200000,
    progress: 63,
    endDate: "2025-11-30",
    organizer: "Alumni Innovation Committee",
    featured: false
  },
  {
    id: 3,
    title: "Digital Library Infrastructure Development",
    description: "Modernize our university library with digital resources, e-books, and advanced research databases to support student learning.",
    image: "https://learningmole.com/wp-content/uploads/2024/05/image-1420.jpeg?w=600&h=400&fit=crop",
    category: "Infrastructure",
    tags: ["Education", "Technology", "Library"],
    supporters: 340,
    raised: 890000,
    goal: 1500000,
    progress: 59,
    endDate: "2025-01-15",
    organizer: "Library Development Committee",
    featured: false
  },
  {
    id: 4,
    title: "Green Campus Sustainability Initiative",
    description: "Transform our campus into a model of environmental sustainability with solar panels, waste management, and green spaces.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    category: "Environment",
    tags: ["Environment", "Sustainability", "Green Energy"],
    supporters: 275,
    raised: 620000,
    goal: 1000000,
    progress: 62,
    endDate: "2025-10-31",
    organizer: "Green Campus Committee",
    featured: false
  },
  {
    id: 5,
    title: "Alumni Scholarship Fund",
    description: "Create a permanent scholarship fund to support deserving students with financial assistance throughout their academic journey.",
    image: "https://worldacademynh.com/wp-content/uploads/2023/11/WA-careers-hero-02.jpg.webp?w=600&h=400&fit=crop",
    category: "Education",
    tags: ["Education", "Scholarship", "Student Support"],
    supporters: 450,
    raised: 1200000,
    goal: 2000000,
    progress: 60,
    endDate: "2025-12-15",
    organizer: "Alumni Scholarship Committee",
    featured: true
  },
  {
    id: 6,
    title: "Sports Complex Modernization",
    description: "Upgrade our sports facilities with modern equipment and infrastructure to promote physical fitness and competitive sports.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    category: "Sports",
    tags: ["Sports", "Infrastructure", "Health"],
    supporters: 195,
    raised: 480000,
    goal: 800000,
    progress: 60,
    endDate: "2025-11-20",
    organizer: "Sports Development Committee",
    featured: false
  }
];

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<typeof campaigns[0] | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [campaignsList, setCampaignsList] = useState(campaigns);
  
  // Form state for creating new campaign
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    category: '',
    goal: '',
    endDate: '',
    image: '',
    tags: ''
  });

  const categories = ['All', 'Education', 'Research', 'Infrastructure', 'Environment', 'Sports'];

  const filteredCampaigns = campaignsList.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' ||
                           campaign.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDonate = (campaign: typeof campaigns[0]) => {
    setSelectedCampaign(campaign);
    setIsDonationDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const predefinedAmounts = [1000, 2500, 5000, 10000, 25000, 50000];

  const handleCreateCampaign = () => {
    if (!newCampaign.title || !newCampaign.description || !newCampaign.category || !newCampaign.goal) {
      alert('Please fill in all required fields');
      return;
    }

    const campaignData = {
      id: campaignsList.length + 1,
      title: newCampaign.title,
      description: newCampaign.description,
      image: newCampaign.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop",
      category: newCampaign.category.charAt(0).toUpperCase() + newCampaign.category.slice(1),
      tags: newCampaign.tags ? newCampaign.tags.split(',').map(tag => tag.trim()) : [newCampaign.category],
      supporters: 0,
      raised: 0,
      goal: parseInt(newCampaign.goal),
      progress: 0,
      endDate: newCampaign.endDate,
      organizer: "User Created Campaign",
      featured: false
    };

    setCampaignsList([...campaignsList, campaignData]);
    
    // Reset form
    setNewCampaign({
      title: '',
      description: '',
      category: '',
      goal: '',
      endDate: '',
      image: '',
      tags: ''
    });
    
    setIsCreateDialogOpen(false);
    alert('Campaign created successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Fundraising Campaigns
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-95">
              The Donation Portal enables both alumni and the institution to contribute to and manage financial donations through various campaigns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 rounded-full font-semibold"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Campaign
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Featured Campaigns */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Campaigns</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {filteredCampaigns.filter(campaign => campaign.featured).map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-64 object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary text-white">
                      {campaign.category}
                    </Badge>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3">{campaign.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {campaign.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {campaign.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {campaign.supporters} supporters
                        </span>
                        <span className="font-semibold text-primary">
                          {campaign.progress}%
                        </span>
                      </div>
                      
                      <Progress value={campaign.progress} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-lg">
                          {formatCurrency(campaign.raised)} raised
                        </span>
                        <span className="text-muted-foreground">
                          Goal: {formatCurrency(campaign.goal)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Ends {campaign.endDate}
                        </span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleDonate(campaign)}
                    >
                      <span className="mr-2 text-lg font-bold">₹</span>
                      Donate Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* All Campaigns */}
          <div>
            <h2 className="text-2xl font-bold mb-6">All Campaigns</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.filter(campaign => !campaign.featured).map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-primary text-white text-xs">
                      {campaign.category}
                    </Badge>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">{campaign.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {campaign.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {campaign.supporters} supporters
                        </span>
                        <span className="font-semibold text-primary">
                          {campaign.progress}%
                        </span>
                      </div>
                      
                      <Progress value={campaign.progress} className="h-1.5" />
                      
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold">
                          {formatCurrency(campaign.raised)}
                        </span>
                        <span className="text-muted-foreground">
                          of {formatCurrency(campaign.goal)}
                        </span>
                      </div>
                    </div>

                    <Button 
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleDonate(campaign)}
                    >
                      <span className="mr-2 text-sm font-bold">₹</span>
                      Donate Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Donation Dialog */}
      <Dialog open={isDonationDialogOpen} onOpenChange={setIsDonationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Make a Donation</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold mb-2">{selectedCampaign.title}</h4>
                <div className="flex items-center justify-between text-sm">
                  <span>{formatCurrency(selectedCampaign.raised)} raised</span>
                  <span className="text-primary font-semibold">{selectedCampaign.progress}% complete</span>
                </div>
                <Progress value={selectedCampaign.progress} className="h-2 mt-2" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Select Amount</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {predefinedAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={donationAmount === amount.toString() ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDonationAmount(amount.toString())}
                        className="text-sm"
                      >
                        ₹{amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="custom-amount">Or enter custom amount</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Enter amount in ₹"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Leave a message of support..."
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => setIsDonationDialogOpen(false)}
                  disabled={!donationAmount}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Donate ₹{donationAmount ? parseInt(donationAmount).toLocaleString() : '0'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDonationDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Campaign Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="campaign-title">Campaign Title *</Label>
              <Input
                id="campaign-title"
                placeholder="Enter campaign title..."
                className="mt-1"
                value={newCampaign.title}
                onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="campaign-description">Description *</Label>
              <Textarea
                id="campaign-description"
                placeholder="Describe your campaign and its goals..."
                className="mt-1"
                rows={4}
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaign-category">Category *</Label>
                <Select value={newCampaign.category} onValueChange={(value) => setNewCampaign({...newCampaign, category: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="campaign-goal">Funding Goal (₹) *</Label>
                <Input
                  id="campaign-goal"
                  type="number"
                  placeholder="Enter target amount..."
                  className="mt-1"
                  value={newCampaign.goal}
                  onChange={(e) => setNewCampaign({...newCampaign, goal: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="campaign-end-date">End Date</Label>
              <Input
                id="campaign-end-date"
                type="date"
                className="mt-1"
                value={newCampaign.endDate}
                onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="campaign-image">Campaign Image URL (Optional)</Label>
              <Input
                id="campaign-image"
                placeholder="Enter image URL..."
                className="mt-1"
                value={newCampaign.image}
                onChange={(e) => setNewCampaign({...newCampaign, image: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="campaign-tags">Tags (Optional)</Label>
              <Input
                id="campaign-tags"
                placeholder="Enter tags separated by commas (e.g., Education, Technology, Innovation)"
                className="mt-1"
                value={newCampaign.tags}
                onChange={(e) => setNewCampaign({...newCampaign, tags: e.target.value})}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                className="flex-1"
                onClick={handleCreateCampaign}
              >
                Create Campaign
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setNewCampaign({
                    title: '',
                    description: '',
                    category: '',
                    goal: '',
                    endDate: '',
                    image: '',
                    tags: ''
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Campaigns;
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { 
  ChevronRight,
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
  Quote,
  ChevronLeft,
  Circle
} from 'lucide-react';

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

const Home = () => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentHeroImage(index);
  };

  const goToPrevious = () => {
    setCurrentHeroImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToNext = () => {
    setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="space-y-0">
        {/* Hero Section with Sliding Background */}
      <section className="relative text-white py-32 min-h-screen flex items-center overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentHeroImage ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentHeroImage
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            Connect. Network. <span className="text-yellow-400">Thrive.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto opacity-95 leading-relaxed">
            Join thousands of alumni in building meaningful connections, discovering opportunities, and giving back to our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Join Our Community
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
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
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Data-Driven Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track your networking progress and discover trending opportunities in your field with advanced analytics.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What We Offer</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive tools and resources to help you succeed in your career and stay connected with your alma mater.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Users2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Alumni Directory</h3>
              <p className="text-muted-foreground">
                Connect with thousands of alumni across different industries and graduation years.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Job Board</h3>
              <p className="text-muted-foreground">
                Discover exclusive job opportunities posted by alumni and partner companies.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <PlayCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Events & Reunions</h3>
              <p className="text-muted-foreground">
                Join networking events, reunions, and professional development workshops.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Handshake className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Mentorship Program</h3>
              <p className="text-muted-foreground">
                Get guidance from experienced alumni or become a mentor to recent graduates.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <BookOpenCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Continuing Education</h3>
              <p className="text-muted-foreground">
                Access courses, certifications, and learning resources to advance your skills.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fundraising Campaigns</h3>
              <p className="text-muted-foreground">
                Support your alma mater through various fundraising initiatives and campaigns.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="py-24 bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Impact</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how our alumni community is making a difference around the world.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users2 className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-gray-300">Alumni Connected</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Network className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-gray-300">Countries Reached</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Handshake className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-gray-300">Mentorship Connections</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">$10M+</div>
              <div className="text-gray-300">Funds Raised</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Informed & Engaged Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Stay Informed & Engaged</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Keep up with the latest news, insights, and opportunities from our alumni community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Alumni Newsletter</h3>
              <p className="text-muted-foreground">
                Monthly updates on alumni achievements, events, and opportunities.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Podcast className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Alumni Podcast</h3>
              <p className="text-muted-foreground">
                Listen to inspiring stories and career insights from successful alumni.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Library className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Resource Library</h3>
              <p className="text-muted-foreground">
                Access career guides, templates, and professional development resources.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Monitor className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Virtual Events</h3>
              <p className="text-muted-foreground">
                Join online networking sessions, webinars, and virtual meetups.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* What Our Alumni Say Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Alumni Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear from our community members about their experiences with Connectify.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <Quote className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
              <p className="text-muted-foreground mb-6 italic">
                "Connectify helped me find my dream job through an alumni connection. The platform made networking so much easier and more meaningful."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">Class of 2018</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <Quote className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
              <p className="text-muted-foreground mb-6 italic">
                "The mentorship program connected me with an industry leader who guided my career transition. Invaluable experience!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
                  alt="Michael Chen"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold">Michael Chen</div>
                  <div className="text-sm text-muted-foreground">Class of 2019</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <Quote className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
              <p className="text-muted-foreground mb-6 italic">
                "I love how easy it is to stay connected with my classmates and discover new opportunities. Connectify is a game-changer!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
                  alt="Emily Rodriguez"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold">Emily Rodriguez</div>
                  <div className="text-sm text-muted-foreground">Class of 2017</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Connect?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of alumni who are already building meaningful connections and advancing their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-4 rounded-full font-semibold"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 rounded-full font-semibold border-white text-white bg-transparent hover:bg-white hover:text-primary"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/events" className="text-gray-300 hover:text-white transition-colors">
                    Events Calendar
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-300 hover:text-white transition-colors">
                    Job Board
                  </Link>
                </li>
                <li>
                  <Link to="/mentorship" className="text-gray-300 hover:text-white transition-colors">
                    Mentorship Program
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                    Make a Donation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Stay Connected */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                    <Network className="w-4 h-4 mr-2" />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                    <Video className="w-4 h-4 mr-2" />
                    Newsletter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                    <Podcast className="w-4 h-4 mr-2" />
                    Podcast
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                    <Monitor className="w-4 h-4 mr-2" />
                    Tech Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-start">
                  <Network className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                  123 University Ave, Campus City, State 12345
                </p>
                <p className="flex items-center">
                  <Video className="w-4 h-4 mr-2 flex-shrink-0" />
                  alumni@university.edu
                </p>
                <p className="flex items-center">
                  <Podcast className="w-4 h-4 mr-2 flex-shrink-0" />
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Saanthi. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Home;
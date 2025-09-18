import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  Globe, 
  Lightbulb,
  Shield,
  Zap,
  ArrowRight,
  Linkedin,
  Twitter,
  Mail,
  GraduationCap,
  Building,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      bio: 'Former university administrator with 15+ years in alumni relations and educational technology.',
      linkedin: '#',
      twitter: '#',
      email: 'demo@connectify.edu'
    },
    {
      name: 'Rohan Mehta',
      role: 'CTO & Co-founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Tech entrepreneur and alumni networking advocate with expertise in scalable platform development.',
      linkedin: '#',
      twitter: '#',
      email: 'demo@connectify.edu'
    },
    {
      name: 'Dr. Ananya Gupta',
      role: 'Head of Community',
      image: 'https://randomuser.me/api/portraits/women/8.jpg',
      bio: 'Career counselor and networking expert focused on building meaningful professional relationships.',
      linkedin: '#',
      twitter: '#',
      email: 'demo@connectify.edu'
    },
    {
      name: 'Aditya Kumar',
      role: 'Head of Product',
      image: 'https://randomuser.me/api/portraits/men/9.jpg',
      bio: 'Product strategist with a passion for creating user-centered experiences in educational technology.',
      linkedin: '#',
      twitter: '#',
      email: 'demo@connectify.edu'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'We believe in the power of authentic connections and meaningful relationships that last a lifetime.'
    },
    {
      icon: Shield,
      title: 'Trust & Privacy',
      description: 'Your data and privacy are paramount. We maintain the highest standards of security and transparency.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We continuously evolve our platform with cutting-edge technology to enhance your networking experience.'
    },
    {
      icon: Globe,
      title: 'Inclusivity',
      description: 'We welcome alumni from all backgrounds, creating a diverse and inclusive Indian community.'
    },
    {
      icon: Zap,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from user experience to customer support.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We foster collaboration between alumni, institutions, and industry partners for mutual growth.'
    }
  ];

  const milestones = [
    {
      year: '2018',
      title: 'Founded',
      description: 'Connectify was founded with a vision to revolutionize alumni networking.'
    },
    {
      year: '2019',
      title: 'First 1,000 Users',
      description: 'Reached our first milestone of 1,000 active alumni members.'
    },
    {
      year: '2020',
      title: 'Platform Expansion',
      description: 'Launched mobile app and expanded to 50+ universities.'
    },
    {
      year: '2021',
      title: 'AI Integration',
      description: 'Introduced AI-powered matching and networking recommendations.'
    },
    {
      year: '2022',
      title: 'Global Reach',
      description: 'Expanded to 200+ partner institutions across India.'
    },
    {
      year: '2023',
      title: '50K+ Alumni',
      description: 'Celebrated reaching 50,000+ active alumni members nationwide.'
    },
    {
      year: '2024',
      title: 'Industry Recognition',
      description: 'Received "Best Alumni Platform" award from EdTech Innovation Awards.'
    },
    {
      year: '2025',
      title: 'Future Vision',
      description: 'Continuing to innovate with new features and expansion across India.'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Active Alumni' },
    { number: '500+', label: 'Partner Universities' },
    { number: '28+', label: 'States & UTs' },
    { number: '95%', label: 'User Satisfaction' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Connectify</h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto opacity-90 leading-relaxed">
            Empowering alumni communities across India through innovative technology, 
            meaningful connections, and lifelong learning opportunities.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Mission */}
            <Card className="p-6 text-center bg-white dark:bg-gray-800 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To create India's most comprehensive and engaging alumni networking platform, 
                fostering lifelong connections that drive personal and professional growth.
              </p>
            </Card>

            {/* Vision */}
            <Card className="p-6 text-center bg-white dark:bg-gray-800 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                A nation where every graduate stays connected to their alma mater and fellow alumni, 
                creating a national network of support, opportunity, and collaboration.
              </p>
            </Card>

            {/* Impact */}
            <Card className="p-6 text-center bg-white dark:bg-gray-800 shadow-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Our Impact</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Over 1.2 million connections made, 50,000+ job placements facilitated, 
                and countless mentorship relationships formed through our platform.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Our Growing Community
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Numbers that reflect our commitment to connecting alumni across India.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our platform's culture
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="p-4 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-3">
                    <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

     
      

      {/* What Makes Us Different */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Why thousands of alumni choose Connectify for their networking needs
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    AI-Powered Matching
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our advanced algorithms connect you with the most relevant alumni based on your interests, career goals, and background.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    Verified Alumni Network
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Every member is verified through their institution, ensuring authentic connections and maintaining network quality.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    Privacy-First Approach
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your data is protected with enterprise-grade security, and you control exactly what information you share.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    National Reach, Local Impact
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Connect with alumni nationwide while staying engaged with your local alumni chapter and community events.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-blue-600/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Connect with thousands of alumni, discover new opportunities, and build lasting professional relationships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold"
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                Join as Alumni
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 font-semibold transition-all duration-200"
              >
                <Building className="mr-2 h-5 w-5" />
                Partner with Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
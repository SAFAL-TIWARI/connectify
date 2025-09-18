import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Users,
  GraduationCap,
  Star,
  Crown,
  Target
} from 'lucide-react';

// Mock data for leaderboard
const topThreeWinners = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    organization: 'Infosys - Senior Software Engineer',
    points: 745348,
    rank: 1,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    badge: 'gold',
    certificates: 156,
    gender: 'female',
    category: 'global'
  },
  {
    id: 2,
    name: 'Rohan Mehta',
    organization: 'Flipkart - Product Manager',
    points: 731741,
    rank: 2,
    avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
    badge: 'silver',
    certificates: 89,
    gender: 'male',
    category: 'global'
  },
  {
    id: 3,
    name: 'Ananya Gupta',
    organization: 'Myntra - Marketing Director',
    points: 636374,
    rank: 3,
    avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
    badge: 'bronze',
    certificates: 73,
    gender: 'female',
    category: 'global'
  }
];

const currentUser = {
  id: 4,
  name: 'Rohan Sharma',
  organization: 'StartupConnect',
  points: 100,
  rank: 8576,
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  certificates: 2,
  globalRank: '8,576',
  gender: 'male',
  category: 'college'
};

const rankingsData = [
  {
    id: 5,
    name: 'Isha Singh',
    organization: 'Zomato - UX Design Lead',
    rank: 4,
    points: 598062,
    certificates: 94,
    change: 0,
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    gender: 'female',
    category: 'global'
  },
  {
    id: 6,
    name: 'Vikram Rao',
    organization: 'ICICI Bank - Financial Analyst',
    rank: 5,
    points: 585675,
    certificates: 67,
    change: 0,
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    gender: 'male',
    category: 'global'
  },
  {
    id: 7,
    name: 'Kavya Sharma',
    organization: 'Microsoft - Software Developer',
    rank: 6,
    points: 581217,
    certificates: 45,
    change: 0,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    gender: 'female',
    category: 'college'
  },
  {
    id: 8,
    name: 'Arjun Patel',
    organization: 'Google - Data Scientist',
    rank: 7,
    points: 567890,
    certificates: 38,
    change: 1,
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    gender: 'male',
    category: 'college'
  },
  {
    id: 9,
    name: 'Sneha Reddy',
    organization: 'Amazon - Cloud Architect',
    rank: 8,
    points: 554321,
    certificates: 52,
    change: -1,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    gender: 'female',
    category: 'global'
  },
  {
    id: 10,
    name: 'Rahul Singh',
    organization: 'Wipro - Technical Lead',
    rank: 9,
    points: 543210,
    certificates: 29,
    change: 2,
    avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
    gender: 'male',
    category: 'college'
  },
  {
    id: 11,
    name: 'Meera Patel',
    organization: 'IIT Delhi - Computer Science Student',
    rank: 10,
    points: 532100,
    certificates: 35,
    change: 1,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    gender: 'female',
    category: 'college'
  },
  {
    id: 12,
    name: 'Riya Sharma',
    organization: 'NIT Trichy - Electronics Student',
    rank: 11,
    points: 521000,
    certificates: 28,
    change: 0,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    gender: 'female',
    category: 'college'
  },
  {
    id: 13,
    name: 'Aditi Verma',
    organization: 'Adobe - UX Designer',
    rank: 12,
    points: 510000,
    certificates: 42,
    change: -1,
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    gender: 'female',
    category: 'global'
  }
];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'previous'>('live');
  const [selectedFilter, setSelectedFilter] = useState<'global' | 'female' | 'college'>('global');

  // Filter functions
  const getFilteredTopWinners = () => {
    if (selectedFilter === 'global') {
      return topThreeWinners;
    } else if (selectedFilter === 'female') {
      // Get top 3 female performers from all data
      const femaleWinners = [...topThreeWinners, ...rankingsData]
        .filter(winner => winner.gender === 'female')
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
        .map((winner, index) => ({ ...winner, rank: index + 1, badge: index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze' }));
      return femaleWinners;
    } else if (selectedFilter === 'college') {
      // Get top 3 college performers from all data
      const collegeWinners = [...topThreeWinners, ...rankingsData]
        .filter(winner => winner.category === 'college')
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
        .map((winner, index) => ({ ...winner, rank: index + 1, badge: index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze' }));
      return collegeWinners;
    }
    return topThreeWinners;
  };

  const getFilteredRankings = () => {
    if (selectedFilter === 'global') {
      return rankingsData;
    } else if (selectedFilter === 'female') {
      return rankingsData
        .filter(student => student.gender === 'female')
        .sort((a, b) => b.points - a.points)
        .map((student, index) => ({ ...student, rank: index + 4 })); // Start from rank 4 after top 3
    } else if (selectedFilter === 'college') {
      return rankingsData
        .filter(student => student.category === 'college')
        .sort((a, b) => b.points - a.points)
        .map((student, index) => ({ ...student, rank: index + 4 })); // Start from rank 4 after top 3
    }
    return rankingsData;
  };

  const filteredTopWinners = getFilteredTopWinners();
  const filteredRankings = getFilteredRankings();

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'gold':
        return 'bg-yellow-500';
      case 'silver':
        return 'bg-gray-400';
      case 'bronze':
        return 'bg-orange-600';
      default:
        return 'bg-gray-300';
    }
  };

  const getBadgeIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-600" />;
      default:
        return null;
    }
  };

  const getCardGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 2:
        return 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800';
      case 3:
        return 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-card border-r border-border p-6 min-h-screen">
          {/* Live/Previous Tabs */}
          <div className="mb-8">
            <div className="flex border-b border-border">
              <Button
                variant={activeTab === 'live' ? 'default' : 'ghost'}
                className={`flex-1 rounded-none border-b-2 ${
                  activeTab === 'live' 
                    ? 'border-primary bg-primary text-primary-foreground' 
                    : 'border-transparent hover:bg-accent'
                }`}
                onClick={() => setActiveTab('live')}
              >
                Live
              </Button>
              <Button
                variant={activeTab === 'previous' ? 'default' : 'ghost'}
                className={`flex-1 rounded-none border-b-2 ${
                  activeTab === 'previous' 
                    ? 'border-primary bg-primary text-primary-foreground' 
                    : 'border-transparent hover:bg-accent'
                }`}
                onClick={() => setActiveTab('previous')}
              >
                Previous
              </Button>
            </div>
          </div>

          {/* Filter Options */}
          <div className="space-y-2">
            <Button
              variant={selectedFilter === 'global' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedFilter('global')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Global
            </Button>
            <Button
              variant={selectedFilter === 'female' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedFilter('female')}
            >
              <Users className="h-4 w-4 mr-2" />
              Female
            </Button>
            <Button
              variant={selectedFilter === 'college' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedFilter('college')}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              College
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              {activeTab === 'live' ? 'Live' : 'Previous'} Leaderboard ({selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)})
              <Trophy className="h-8 w-8 text-yellow-500" />
            </h1>
          </div>

          {/* Top 3 Winners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {filteredTopWinners.length > 0 ? filteredTopWinners.map((winner) => (
              <Card key={winner.id} className={`${getCardGradient(winner.rank)} border-2 hover:shadow-lg transition-all duration-300`}>
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-20 w-20 mx-auto border-4 border-white dark:border-gray-800 shadow-lg">
                      <AvatarImage src={winner.avatar} alt={winner.name} />
                      <AvatarFallback className="text-lg font-bold">
                        {winner.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2">
                      {getBadgeIcon(winner.rank)}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg text-foreground mb-1">{winner.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {winner.organization}
                  </p>
                  
                  <div className={`${getBadgeColor(winner.badge)} text-white px-4 py-2 rounded-full font-bold text-lg mb-2`}>
                    {winner.points.toLocaleString()}
                  </div>
                  
                  <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4" />
                    <span>{winner.certificates} Certificates</span>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-muted-foreground">No winners found for the selected filter.</p>
              </div>
            )}
          </div>

          {/* Current User Rank */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-blue-300 dark:border-blue-600">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-foreground">{currentUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentUser.organization}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-foreground">{currentUser.points} Points</span>
                      <Badge variant="secondary" className="ml-2">
                        {currentUser.certificates} Certificates
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <TrendingUp className="h-8 w-8" />
                    {currentUser.globalRank}
                  </div>
                  <p className="text-sm text-muted-foreground">Global Rank</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rankings Table */}
          <Card>
            <CardContent className="p-0">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Rankings</h2>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-16 text-center font-bold">Rank</TableHead>
                    <TableHead className="font-bold">Student Name</TableHead>
                    <TableHead className="text-center font-bold">Rank Change</TableHead>
                    <TableHead className="text-center font-bold">Certificates</TableHead>
                    <TableHead className="text-right font-bold">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRankings.length > 0 ? filteredRankings.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-bold">
                          # {student.rank}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback className="text-sm font-medium">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{student.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {student.organization}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {student.change === 0 ? (
                          <span className="text-muted-foreground">-</span>
                        ) : student.change > 0 ? (
                          <div className="flex items-center justify-center text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">+{student.change}</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center text-red-600">
                            <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
                            <span className="text-sm font-medium">{student.change}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">
                          {student.certificates}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-primary">
                          {student.points.toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <p className="text-muted-foreground">No rankings found for the selected filter.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
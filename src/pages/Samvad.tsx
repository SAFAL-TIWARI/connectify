import React, { useMemo, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Search,
  Home,
  TrendingUp,
  MessageSquare,
  Plus,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Share,
  Bookmark,
} from 'lucide-react';

// Types
interface Post {
  id: number;
  type: 'question' | 'answer' | 'post';
  title: string;
  author: string;
  community: string;
  upvotes: number;
  comments: number; // base comments count from seed
  timeAgo: string;
  content: string;
  answers: number;
  isAnswered: boolean;
  bestAnswer?: string;
  imageUrl?: string; // optional image for image posts
  videoUrl?: string; // optional video for video posts
}

interface CommentItem {
  id: number;
  author: string;
  text: string;
  timeAgo: string;
  upvotes?: number;
}

// Seed data (added demo image + video posts)
const mockPosts: Record<'home' | 'popular' | 'answers', Post[]> = {
  home: [
    {
      id: 1,
      type: 'question',
      title: 'How to transition from college to industry software development?',
      author: 'freshgrad2025',
      community: 'Software Development',
      upvotes: 42,
      comments: 18,
      timeAgo: '3 hours ago',
      content:
        "I'm graduating this year and want to know the best practices for transitioning into software development. Any tips from alumni?",
      answers: 5,
      isAnswered: true,
    },
    {
      id: 2,
      type: 'post',
      title: 'Exciting opportunity: Senior Developer position at Google',
      author: 'alumni_recruiter',
      community: 'Career Advice',
      upvotes: 156,
      comments: 45,
      timeAgo: '2 hours ago',
      content:
        "Great news! We're hiring senior developers at Google. If you're interested in working on cutting-edge AI projects, DM me for more details.",
      answers: 0,
      isAnswered: false,
    },
    {
      id: 3,
      type: 'answer',
      title: 'Best resources for learning data structures and algorithms?',
      author: 'cs_student',
      community: 'Computer Science',
      upvotes: 67,
      comments: 25,
      timeAgo: '1 day ago',
      content:
        'As a computer science student, I want to strengthen my DSA knowledge. What books/courses do you recommend?',
      answers: 8,
      isAnswered: true,
      bestAnswer:
        "The 'Introduction to Algorithms' by CLRS is the gold standard. Also check out LeetCode for practice problems.",
    },
    // Demo image post (LinkedIn-style)
    {
      id: 10,
      type: 'post',
      title: 'Alumni meetup highlights 🎉',
      author: 'community_team',
      community: 'Career Advice',
      upvotes: 98,
      comments: 22,
      timeAgo: '5 hours ago',
      content: 'Had an amazing alumni meetup today! Great networking and insights from senior folks.',
      answers: 0,
      isAnswered: false,
      imageUrl:
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80&auto=format&fit=crop',
    },
    // Demo video post
    {
      id: 11,
      type: 'post',
      title: 'Quick project demo (video)',
      author: 'product_builder',
      community: 'Web Development',
      upvotes: 120,
      comments: 31,
      timeAgo: '7 hours ago',
      content: 'Sharing a short demo of our new Project SATI ChatBot. Check it out!',
      answers: 0,
      isAnswered: false,
      videoUrl: new URL('../assets/video.mp4', import.meta.url).href,
    },
  ],
  popular: [
    {
      id: 4,
      type: 'question',
      title: 'Top companies hiring fresh graduates in 2025',
      author: 'alumni_network',
      community: 'Career Advice',
      upvotes: 89,
      comments: 34,
      timeAgo: '2 hours ago',
      content:
        'Which companies are known for good entry-level positions and work culture for new graduates?',
      answers: 12,
      isAnswered: true,
    },
    {
      id: 5,
      type: 'answer',
      title: 'Building a portfolio as a developer',
      author: 'portfolio_expert',
      community: 'Web Development',
      upvotes: 156,
      comments: 67,
      timeAgo: '6 hours ago',
      content:
        'What are the essential projects every developer should have in their portfolio?',
      answers: 23,
      isAnswered: true,
      bestAnswer:
        'Start with a personal website, then add 2-3 substantial projects. Include READMEs with detailed descriptions.',
    },
    {
      id: 6,
      type: 'post',
      title: 'Interview tips for technical roles',
      author: 'tech_recruiter',
      community: 'Interview Prep',
      upvotes: 203,
      comments: 89,
      timeAgo: '1 day ago',
      content:
        'Share your best tips for cracking technical interviews at top tech companies.',
      answers: 45,
      isAnswered: true,
    },
    // Demo image post (LinkedIn-style)
    {
      id: 12,
      type: 'post',
      title: 'My portfolio redesign ✨',
      author: 'ui_crafter',
      community: 'UI/UX Design',
      upvotes: 240,
      comments: 52,
      timeAgo: '1 day ago',
      content: 'Just shipped a complete overhaul of my portfolio. Thoughts on the typography and spacing?',
      answers: 0,
      isAnswered: false,
      imageUrl:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80&auto=format&fit=crop',
    },
    // Demo video post (local asset)
    {
      id: 13,
      type: 'post',
      title: 'Product teaser video',
      author: 'connectify_team',
      community: 'Internet Culture',
      upvotes: 310,
      comments: 80,
      timeAgo: '2 days ago',
      content:
        'Sharing our platform teaser video. Feedback welcome!',
      answers: 0,
      isAnswered: false,
      videoUrl: new URL('../assets/stock.mp4', import.meta.url).href,
    },
  ],
  answers: [
    {
      id: 7,
      type: 'question',
      title: 'How do I prepare for system design interviews?',
      author: 'sde_candidate',
      community: 'Interview Prep',
      upvotes: 78,
      comments: 23,
      timeAgo: '4 hours ago',
      content:
        "I'm preparing for senior developer roles. What are the best resources for system design?",
      answers: 15,
      isAnswered: true,
    },
    {
      id: 8,
      type: 'question',
      title: 'Should I learn Rust or Go for backend development?',
      author: 'backend_dev',
      community: 'Software Development',
      upvotes: 45,
      comments: 31,
      timeAgo: '8 hours ago',
      content:
        "I'm experienced in Node.js and want to learn a new language. Which one should I choose?",
      answers: 18,
      isAnswered: false,
    },
    {
      id: 9,
      type: 'question',
      title: 'How to negotiate salary as a new graduate?',
      author: 'negotiate_pro',
      community: 'Career Advice',
      upvotes: 92,
      comments: 28,
      timeAgo: '12 hours ago',
      content:
        'Got my first offer but not sure about the salary. How to approach negotiation?',
      answers: 22,
      isAnswered: true,
    },
  ],
};

const communities = [
  { name: 'Software Development', members: '2.1k', icon: '💻' },
  { name: 'Web Development', members: '1.8k', icon: '🌐' },
  { name: 'Data Science', members: '1.5k', icon: '📊' },
  { name: 'AI & Machine Learning', members: '1.2k', icon: '🤖' },
  { name: 'Cybersecurity', members: '950', icon: '🔒' },
  { name: 'Mobile Development', members: '780', icon: '📱' },
  { name: 'DevOps', members: '650', icon: '⚙️' },
  { name: 'UI/UX Design', members: '580', icon: '🎨' },
  { name: 'Career Advice', members: '3.2k', icon: '💼' },
  { name: 'Interview Prep', members: '2.8k', icon: '📝' },
  { name: 'Internet Culture', members: '1.1k', icon: '🌐' },
];

const trendingTopics = [
  { name: '#CareerTransition', posts: '2.1k' },
  { name: '#Mentorship', posts: '1.8k' },
  { name: '#TechJobs', posts: '1.5k' },
  { name: '#LearningResources', posts: '980' },
  { name: '#CodingTips', posts: '756' },
];

export default function Samvad() {
  // Tabs and view
  const [activeTab, setActiveTab] = useState<'home' | 'popular' | 'answers'>('popular');
  const [currentView, setCurrentView] = useState<'feed' | 'community' | 'post' | 'search'>('feed');

  // Selections
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTab, setSearchTab] = useState<'all' | 'posts' | 'communities'>('all');

  // Ephemeral created posts and comments (reset on refresh)
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<Record<number, CommentItem[]>>({});

  // Create Post dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [formType, setFormType] = useState<'post' | 'question' | 'answer'>('post');
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCommunity, setFormCommunity] = useState<string>('Software Development');
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helpers
  const getAllSeedPosts = (): Post[] => [
    ...mockPosts.home,
    ...mockPosts.popular,
    ...mockPosts.answers,
  ];

  const getAllPosts = useMemo<Post[]>(
    () => [...getAllSeedPosts(), ...localPosts],
    [localPosts]
  );

  const getFeedPosts = (tab: 'home' | 'popular' | 'answers'): Post[] => {
    const base =
      tab === 'home'
        ? [...mockPosts.home]
        : tab === 'popular'
        ? [...mockPosts.popular]
        : [...mockPosts.answers];

    // Include local posts according to type
    const locals = localPosts.filter((p) => {
      if (tab === 'answers') return p.type === 'answer';
      return true; // home and popular accept all
    });

    const merged = [...locals, ...base];

    if (tab === 'popular') {
      return merged.sort((a, b) => b.upvotes - a.upvotes);
    }
    // Home: mixed ordering (newest local first)
    return merged;
  };

  const maxId = useMemo(
    () => Math.max(...getAllPosts.map((p) => p.id), 0),
    [getAllPosts]
  );

  // Create Post Handlers
  const handleImagePick = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const submitCreatePost = () => {
    if (!formTitle.trim() || !formContent.trim()) return;
    const newPost: Post = {
      id: maxId + 1,
      type: formType,
      title: formTitle,
      author: 'you',
      community: formCommunity,
      upvotes: formType === 'post' ? 5 : 0,
      comments: 0,
      timeAgo: 'just now',
      content: formContent,
      answers: formType === 'answer' ? 1 : 0,
      isAnswered: formType === 'answer',
      imageUrl: imagePreview,
    };

    setLocalPosts((prev) => [newPost, ...prev]);

    // Reset form
    setFormTitle('');
    setFormContent('');
    setFormType('post');
    setFormCommunity('Software Development');
    setImagePreview(undefined);
    setCreateOpen(false);
  };

  // Comment Handlers
  const addComment = (postId: number, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setCommentsByPost((prev) => {
      const next: CommentItem[] = [
        ...(prev[postId] || []),
        {
          id: (prev[postId]?.slice(-1)[0]?.id || 0) + 1,
          author: 'you',
          text: trimmed,
          timeAgo: 'just now',
          upvotes: 0,
        },
      ];
      return { ...prev, [postId]: next };
    });
  };

  // UI data
  const sidebarItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'popular' as const, label: 'Popular', icon: TrendingUp },
    { id: 'answers' as const, label: 'Answers', icon: MessageSquare },
  ];

  const topics = [
    { name: 'Internet Culture', count: 234 },
    { name: 'Q&As', count: 156 },
    { name: 'Resources', count: 89 },
  ];

  const topicFilter = (post: Post, topicName: string) => {
    if (topicName === 'Q&As') return post.type === 'question' || post.type === 'answer';
    if (topicName === 'Resources')
      return /resource|portfolio|learn|course|book/i.test(post.title + ' ' + post.content);
    if (topicName === 'Internet Culture') return /community|culture|internet|trend/i.test(post.title + ' ' + post.content);
    if (topicName.startsWith('#')) return post.title.includes(topicName.slice(1)) || post.content.includes(topicName.slice(1));
    return true;
  };

  const renderMedia = (post: Post, size: 'feed' | 'detail') => {
    const maxH = size === 'feed' ? 'max-h-[420px]' : 'max-h-[480px]';
    if (post.videoUrl) {
      return (
        <div className={`mb-3 overflow-hidden rounded-lg border ${size === 'detail' ? 'mb-4' : ''}`}>
          <video
            src={post.videoUrl}
            controls
            playsInline
            autoPlay
            muted
            loop
            className={`w-full ${maxH} object-contain bg-black`}
          />
        </div>
      );
    }
    if (post.imageUrl) {
      return (
        <div className={`mb-3 overflow-hidden rounded-lg border ${size === 'detail' ? 'mb-4' : ''}`}>
          <img src={post.imageUrl} alt="post" className={`w-full object-cover ${maxH}`} />
        </div>
      );
    }
    return null;
  };

  const renderPostCard = (post: Post) => {
    const totalComments = post.comments + (commentsByPost[post.id]?.length || 0);
    return (
      <Card key={post.id} className="p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center gap-1">
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
              <ArrowUp className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium">{post.upvotes}</span>
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Post Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="font-medium text-foreground">{post.community}</span>
              <span>•</span>
              <span>Posted by {post.author}</span>
              <span>•</span>
              <span>{post.timeAgo}</span>
              {post.isAnswered && (
                <>
                  <span>•</span>
                  <span className="text-green-600 font-medium">Answered</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h3
                className="text-lg font-semibold hover:text-primary cursor-pointer flex-1"
                onClick={() => {
                  setSelectedPost(post);
                  setCurrentView('post');
                }}
              >
                {post.title}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  post.type === 'question'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : post.type === 'answer'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                {post.type}
              </span>
            </div>

            {renderMedia(post, 'feed')}

            <p className="text-muted-foreground mb-3">{post.content}</p>

            {post.bestAnswer && (
              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-3 mb-3">
                <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Best Answer</div>
                <p className="text-sm text-green-700 dark:text-green-300">{post.bestAnswer}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <button className="flex items-center gap-1 hover:text-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>{totalComments} Comments</span>
              </button>
              <button className="flex items-center gap-1 hover:text-foreground">
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center gap-1 hover:text-foreground">
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // Derived lists
  const feedPosts = getFeedPosts(activeTab);

  const communityPosts = selectedCommunity
    ? getAllPosts.filter((p) => {
        // If selected is a known community name
        if (communities.some((c) => c.name === selectedCommunity)) {
          return p.community === selectedCommunity;
        }
        // Topic-like filter
        return topicFilter(p, selectedCommunity);
      })
    : [];

  const searchPostResults = getAllPosts.filter((post) => {
    const q = searchQuery.toLowerCase();
    const match =
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      post.community.toLowerCase().includes(q);
    if (!match) return false;
    if (searchTab === 'posts') return true;
    if (searchTab === 'communities') return false; // posts not shown in communities tab
    return true; // all
  });

  const searchCommunityResults = communities.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card className="p-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setCurrentView('feed');
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id && currentView === 'feed'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </Card>

            {/* Topics Section */}
            <Card className="p-4 mt-4">
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Topics</h3>
              <div className="space-y-2">
                {topics.map((topic) => (
                  <div
                    key={topic.name}
                    className="flex items-center justify-between text-sm hover:bg-accent px-2 py-1 rounded cursor-pointer"
                    onClick={() => {
                      setSelectedCommunity(topic.name);
                      setCurrentView('community');
                    }}
                  >
                    <span>{topic.name}</span>
                    <span className="text-muted-foreground">{topic.count}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Trending Topics */}
            <Card className="p-4 mt-4">
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Trending Topics</h3>
              <div className="space-y-2">
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.name}
                    className="flex items-center justify-between text-sm hover:bg-accent px-2 py-1 rounded cursor-pointer"
                    onClick={() => {
                      setSelectedCommunity(topic.name);
                      setCurrentView('community');
                    }}
                  >
                    <span>{topic.name}</span>
                    <span className="text-muted-foreground">{topic.posts}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-2xl">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search संवाद..."
                  value={searchQuery}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSearchQuery(v);
                    if (v) setCurrentView('search');
                    else setCurrentView('feed');
                  }}
                  className="pl-10"
                />
              </div>

              {/* Search Tabs */}
              {searchQuery && currentView === 'search' && (
                <div className="flex gap-6 border-b">
                  {(['All', 'Posts', 'Communities'] as const).map((tab) => (
                    <button
                      key={tab}
                      className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                        (searchTab === 'all' && tab === 'All') ||
                        (searchTab === 'posts' && tab === 'Posts') ||
                        (searchTab === 'communities' && tab === 'Communities')
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() =>
                        setSearchTab(
                          tab.toLowerCase() as 'all' | 'posts' | 'communities'
                        )
                      }
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Create Post Bar */}
            {currentView === 'feed' && (
              <Card className="p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <Input
                    placeholder="Create a post..."
                    className="flex-1"
                    onFocus={() => setCreateOpen(true)}
                    readOnly
                  />
                  <Button size="sm" onClick={() => setCreateOpen(true)}>
                    Post
                  </Button>
                </div>
              </Card>
            )}

            {/* FEED VIEW */}
            {currentView === 'feed' && (
              <div className="space-y-4">
                {feedPosts.map((post) => renderPostCard(post))}
              </div>
            )}

            {/* COMMUNITY VIEW */}
            {currentView === 'community' && selectedCommunity && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentView('feed')}
                    className="flex items-center gap-2"
                  >
                    ← Back to Feed
                  </Button>
                  <h2 className="text-2xl font-bold">{selectedCommunity}</h2>
                </div>

                {communityPosts.length === 0 && (
                  <Card className="p-6 text-muted-foreground">
                    No posts yet for this selection.
                  </Card>
                )}

                <div className="space-y-4">
                  {communityPosts.map((post) => renderPostCard(post))}
                </div>
              </div>
            )}

            {/* POST DETAIL VIEW */}
            {currentView === 'post' && selectedPost && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentView('feed')}
                    className="flex items-center gap-2"
                  >
                    ← Back
                  </Button>
                </div>

                <Card className="p-6">
                  <div className="flex gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center gap-1">
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium">{selectedPost.upvotes}</span>
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span className="font-medium text-foreground">{selectedPost.community}</span>
                        <span>•</span>
                        <span>Posted by {selectedPost.author}</span>
                        <span>•</span>
                        <span>{selectedPost.timeAgo}</span>
                        {selectedPost.isAnswered && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">Answered</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <h1 className="text-2xl font-bold flex-1">{selectedPost.title}</h1>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            selectedPost.type === 'question'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : selectedPost.type === 'answer'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {selectedPost.type}
                        </span>
                      </div>

                      {renderMedia(selectedPost, 'detail')}

                      <p className="text-lg text-muted-foreground mb-6">
                        {selectedPost.content}
                      </p>

                      {selectedPost.bestAnswer && (
                        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mb-6">
                          <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                            ✅ Best Answer
                          </div>
                          <p className="text-green-700 dark:text-green-300">
                            {selectedPost.bestAnswer}
                          </p>
                        </div>
                      )}

                      {/* Answers Section (static sample) */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Answers ({selectedPost.answers})
                        </h3>
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-medium">A</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">mentor_alumni</span>
                                <span className="text-sm text-muted-foreground">2 hours ago</span>
                              </div>
                              <p className="text-muted-foreground">
                                Great question! Here are some tips for transitioning from college to industry...
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <button className="flex items-center gap-1 hover:text-foreground">
                                  <ArrowUp className="w-3 h-3" />
                                  <span>12</span>
                                </button>
                                <button className="hover:text-foreground">Reply</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Comments Section */}
                      <div className="border-t pt-6 mt-6">
                        <h3 className="text-lg font-semibold mb-4">Comments</h3>
                        <div className="space-y-4">
                          {/* Existing example comment */}
                          <div className="flex gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-medium">C</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">student_user</span>
                                <span className="text-sm text-muted-foreground">1 hour ago</span>
                              </div>
                              <p className="text-muted-foreground">
                                Thanks for the detailed answer! This really helps.
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <button className="flex items-center gap-1 hover:text-foreground">
                                  <ArrowUp className="w-3 h-3" />
                                  <span>5</span>
                                </button>
                                <button className="hover:text-foreground">Reply</button>
                              </div>
                            </div>
                          </div>

                          {/* Ephemeral user comments */}
                          {(commentsByPost[selectedPost.id] || []).map((c) => (
                            <div key={c.id} className="flex gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium">U</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">{c.author}</span>
                                  <span className="text-sm text-muted-foreground">{c.timeAgo}</span>
                                </div>
                                <p className="text-muted-foreground">{c.text}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <button className="flex items-center gap-1 hover:text-foreground">
                                    <ArrowUp className="w-3 h-3" />
                                    <span>{c.upvotes ?? 0}</span>
                                  </button>
                                  <button className="hover:text-foreground">Reply</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Comment */}
                        <AddCommentBox onSubmit={(text) => addComment(selectedPost.id, text)} />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* SEARCH VIEW */}
            {currentView === 'search' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold">Search Results for "{searchQuery}"</h2>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentView('feed');
                    }}
                  >
                    Clear
                  </Button>
                </div>

                {(searchTab === 'all' || searchTab === 'posts') && (
                  <div className="space-y-4">
                    {searchPostResults.map((post) => renderPostCard(post))}
                  </div>
                )}

                {(searchTab === 'all' || searchTab === 'communities') && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">Communities</h3>
                    <div className="space-y-2">
                      {searchCommunityResults.length === 0 && (
                        <div className="text-sm text-muted-foreground">No communities found.</div>
                      )}
                      {searchCommunityResults.map((c) => (
                        <div
                          key={c.name}
                          className="flex items-center justify-between hover:bg-accent px-2 py-2 rounded cursor-pointer"
                          onClick={() => {
                            setSelectedCommunity(c.name);
                            setCurrentView('community');
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{c.icon}</span>
                            <div>
                              <div className="text-sm font-medium">{c.name}</div>
                              <div className="text-xs text-muted-foreground">{c.members} members</div>
                            </div>
                          </div>
                          <Button size="sm" variant="secondary">View</Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex-shrink-0">
            {/* Popular Communities */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                Popular Communities
              </h3>
              <div className="space-y-2">
                {communities.map((community) => (
                  <div
                    key={community.name}
                    className="flex items-center gap-3 hover:bg-accent px-2 py-2 rounded cursor-pointer"
                    onClick={() => {
                      setSelectedCommunity(community.name);
                      setCurrentView('community');
                    }}
                  >
                    <span className="text-lg">{community.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{community.name}</div>
                      <div className="text-xs text-muted-foreground">{community.members} members</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Post Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create a post</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formType} onValueChange={(v) => setFormType(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="post">Post</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="answer">Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Community</Label>
                <Select value={formCommunity} onValueChange={setFormCommunity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select community" />
                  </SelectTrigger>
                  <SelectContent>
                    {communities.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Write a clear, descriptive title" />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={formContent} onChange={(e) => setFormContent(e.target.value)} rows={5} placeholder="Share details, context, or your answer..." />
            </div>

            <div className="space-y-2">
              <Label>Image (optional)</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImagePick(e.target.files?.[0])}
              />
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Image
                </Button>
                {imagePreview && (
                  <div className="border rounded overflow-hidden">
                    <img src={imagePreview} alt="preview" className="h-16 w-24 object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitCreatePost}>Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddCommentBox({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [val, setVal] = useState('');
  return (
    <div className="mt-6">
      <Textarea
        placeholder="Add a comment..."
        className="w-full resize-none"
        rows={3}
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <div className="flex justify-end mt-2 gap-2">
        <Button
          variant="secondary"
          onClick={() => setVal('')}
        >
          Clear
        </Button>
        <Button
          size="sm"
          onClick={() => {
            onSubmit(val);
            setVal('');
          }}
        >
          Post Comment
        </Button>
      </div>
    </div>
  );
}
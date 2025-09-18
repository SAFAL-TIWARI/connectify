import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/Navigation';
import CalendarDialog from '@/components/CalendarDialog';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ChevronRight,
  Filter,
  Search,
  X
} from 'lucide-react';

// Mock Events Data
const mockEvents = [
  {
    id: 1,
    title: "Annual Alumni Networking Gala",
    date: "2024-03-15",
    time: "6:00 PM - 10:00 PM",
    location: "Taj Palace, New Delhi",
    description: "Join us for an evening of networking, reconnecting, and celebrating our alumni community. This year's gala features keynote speakers from various industries, live entertainment, and plenty of opportunities to make new connections.",
    longDescription: "Our Annual Alumni Networking Gala is the premier event of the year, bringing together hundreds of alumni from all graduating classes. The evening begins with a cocktail reception, followed by dinner and keynote presentations from distinguished alumni who have made significant impacts in their respective fields. This year's theme is 'Innovation and Impact' - celebrating how our alumni are changing India through their work and leadership. The event includes networking sessions organized by industry, giving attendees the chance to connect with peers in similar fields. Don't miss this opportunity to reconnect with classmates, meet new contacts, and be inspired by the achievements of our alumni community.",
    attendees: ["Priya Sharma", "Rohan Mehta", "Ananya Gupta", "Aditya Kumar"],
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
    category: "Networking",
    isUpcoming: true,
    attendeeCount: 150,
    maxAttendees: 200
  },
  {
    id: 2,
    title: "Tech Talk: AI in Modern Business",
    date: "2024-02-28",
    time: "7:00 PM - 9:00 PM",
    location: "IIT Bombay Auditorium",
    description: "A fascinating discussion on how artificial intelligence is transforming various industries. Led by alumni working at top tech companies in India.",
    longDescription: "Join us for an insightful evening exploring the transformative power of artificial intelligence in today's business landscape. Our panel of distinguished alumni, including engineers from Infosys, TCS, and Jio, will share their experiences and insights on how AI is reshaping industries from healthcare to finance. The session will cover practical applications, ethical considerations, and future trends in AI technology. This is an excellent opportunity for both recent graduates and experienced professionals to understand the implications of AI in their respective fields and learn about potential career opportunities in this rapidly growing sector.",
    attendees: ["Priya Sharma"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
    category: "Technology",
    isUpcoming: true,
    attendeeCount: 75,
    maxAttendees: 100
  },
  {
    id: 3,
    title: "Career Development Workshop",
    date: "2024-01-20",
    time: "2:00 PM - 5:00 PM",
    location: "IIM Ahmedabad Campus",
    description: "Professional development workshop covering resume writing, interview skills, and career advancement strategies.",
    longDescription: "This comprehensive career development workshop is designed to help alumni at all stages of their careers. Whether you're a recent graduate looking for your first job or an experienced professional seeking advancement, this workshop provides valuable insights and practical tools. The session covers resume optimization for different industries, interview preparation techniques, salary negotiation strategies, and networking best practices. Interactive exercises and one-on-one coaching sessions with industry professionals make this a hands-on learning experience. All attendees will receive a digital toolkit with templates, checklists, and resources to continue their professional development journey.",
    attendees: ["Rohan Mehta", "Ananya Gupta"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600",
    category: "Professional Development",
    isUpcoming: false,
    attendeeCount: 45,
    maxAttendees: 50
  },
  {
    id: 4,
    title: "Healthcare Innovation Summit",
    date: "2024-04-10",
    time: "9:00 AM - 4:00 PM",
    location: "AIIMS New Delhi Conference Center",
    description: "Full-day summit exploring the latest innovations in healthcare technology and patient care in India.",
    longDescription: "The Healthcare Innovation Summit brings together alumni working in various aspects of healthcare, from medical professionals to biotech entrepreneurs. This full-day event features presentations on cutting-edge medical technologies, discussions on healthcare policy, and networking opportunities with industry leaders. Topics include telemedicine, personalized medicine, medical AI, and healthcare accessibility in the Indian context. The summit provides a platform for alumni to share their research, discuss challenges in healthcare delivery, and explore collaborative opportunities. Whether you're a healthcare provider, researcher, entrepreneur, or work in health-related industries, this summit offers valuable insights into the future of healthcare in India.",
    attendees: ["Ananya Gupta"],
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600",
    category: "Healthcare",
    isUpcoming: true,
    attendeeCount: 120,
    maxAttendees: 150
  }
];

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
  const [calendarEvent, setCalendarEvent] = useState<typeof mockEvents[0] | null>(null);
  const { toast } = useToast();

  const filteredEvents = selectedCategory === 'all' 
    ? mockEvents 
    : mockEvents.filter(event => event.category === selectedCategory);

  const upcomingEvents = filteredEvents.filter(event => event.isUpcoming);
  const pastEvents = filteredEvents.filter(event => !event.isUpcoming);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleRegister = (event: typeof mockEvents[0]) => {
    toast({
      title: "Registration Successful!",
      description: `You have successfully registered for "${event.title}". A confirmation email has been sent to you.`,
    });
  };

  const handleLearnMore = (event: typeof mockEvents[0]) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleAddToCalendar = (event: typeof mockEvents[0]) => {
    setCalendarEvent(event);
    setIsCalendarDialogOpen(true);
  };

  const categories = ['all', 'Networking', 'Technology', 'Professional Development', 'Healthcare'];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Alumni Events</h1>
        <p className="text-muted-foreground">Discover and join events to connect with fellow alumni and advance your career.</p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === 'all' ? 'All Events' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <Card 
                key={event.id}
                className="cursor-pointer hover:shadow-card transition-all duration-300 bg-gradient-card overflow-hidden"
              >
                <div className="aspect-video relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 hover:bg-green-600">
                      Upcoming
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-2">
                      {event.category}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.attendeeCount}/{event.maxAttendees} attendees</span>
                    </div>
                  </div>

                  {/* Attendee Avatars */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex -space-x-2">
                      {event.attendees.slice(0, 3).map((attendee, index) => (
                        <Avatar key={index} className="h-8 w-8 border-2 border-background">
                          <AvatarFallback className="text-xs">
                            {attendee.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {event.attendees.length > 3 && (
                        <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            +{event.attendees.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">attending</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegister(event);
                      }}
                    >
                      Register Now
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCalendar(event);
                      }}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLearnMore(event);
                      }}
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Past Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <Card 
                key={event.id}
                className="cursor-pointer hover:shadow-card transition-all duration-300 bg-gradient-card overflow-hidden opacity-75"
              >
                <div className="aspect-video relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover grayscale"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">
                      Past Event
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-2">
                      {event.category}
                    </Badge>
                    <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.attendeeCount} attended</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLearnMore(event);
                    }}
                  >
                    View Summary
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No events found in this category.</p>
            <p className="text-sm">Check back later for new events or try a different category.</p>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedEvent.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Event Image */}
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={selectedEvent.isUpcoming ? "bg-green-500 hover:bg-green-600" : ""} variant={selectedEvent.isUpcoming ? "default" : "secondary"}>
                      {selectedEvent.isUpcoming ? "Upcoming" : "Past Event"}
                    </Badge>
                  </div>
                </div>

                {/* Event Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Event Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <span>{formatDate(selectedEvent.date)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <span>{selectedEvent.time}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <span>{selectedEvent.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <span>
                            {selectedEvent.isUpcoming 
                              ? `${selectedEvent.attendeeCount}/${selectedEvent.maxAttendees} registered`
                              : `${selectedEvent.attendeeCount} attended`
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Badge variant="outline" className="mb-2">
                        {selectedEvent.category}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Attendees</h3>
                    <div className="space-y-2">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {attendee.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{attendee}</span>
                        </div>
                      ))}
                      {selectedEvent.attendeeCount > selectedEvent.attendees.length && (
                        <div className="text-sm text-muted-foreground">
                          +{selectedEvent.attendeeCount - selectedEvent.attendees.length} more attendees
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">About This Event</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedEvent.longDescription}
                  </p>
                </div>

                {/* Action Buttons */}
                {selectedEvent.isUpcoming && (
                  <div className="flex gap-3 pt-4">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        handleRegister(selectedEvent);
                        setIsDetailModalOpen(false);
                      }}
                    >
                      Register Now
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleAddToCalendar(selectedEvent)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Add to Calendar
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Calendar Dialog */}
      {calendarEvent && (
        <CalendarDialog
          isOpen={isCalendarDialogOpen}
          onClose={() => setIsCalendarDialogOpen(false)}
          event={calendarEvent}
        />
      )}
      </div>
    </div>
  );
};

export default Events;
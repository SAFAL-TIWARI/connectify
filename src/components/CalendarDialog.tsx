import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Calendar,
  Download,
  ExternalLink
} from 'lucide-react';
import {
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  generateYahooCalendarUrl,
  downloadICSFile,
  parseEventDateTime,
  calculateEndTime,
  CalendarEvent
} from '@/utils/calendar';

interface CalendarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    longDescription?: string;
  };
}

const CalendarDialog: React.FC<CalendarDialogProps> = ({ isOpen, onClose, event }) => {
  const { toast } = useToast();

  const createCalendarEvent = (): CalendarEvent => {
    const startDate = parseEventDateTime(event.date, event.time);
    const endDate = calculateEndTime(startDate, event.time);

    return {
      title: event.title,
      description: event.longDescription || event.description,
      location: event.location,
      startDate,
      endDate,
      url: window.location.href,
    };
  };

  const handleAddToCalendar = (provider: string) => {
    const calendarEvent = createCalendarEvent();
    let url = '';

    switch (provider) {
      case 'google':
        url = generateGoogleCalendarUrl(calendarEvent);
        break;
      case 'outlook':
        url = generateOutlookCalendarUrl(calendarEvent);
        break;
      case 'yahoo':
        url = generateYahooCalendarUrl(calendarEvent);
        break;
      case 'download':
        downloadICSFile(calendarEvent);
        toast({
          title: "Calendar file downloaded!",
          description: "The event has been saved as an ICS file. You can import it into any calendar application.",
        });
        onClose();
        return;
      default:
        return;
    }

    if (url) {
      window.open(url, '_blank');
      toast({
        title: "Opening calendar...",
        description: `Adding "${event.title}" to your ${provider} calendar.`,
      });
      onClose();
    }
  };

  const calendarOptions = [
    {
      id: 'google',
      name: 'Google Calendar',
      icon: '📅',
      description: 'Add to Google Calendar',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      id: 'outlook',
      name: 'Outlook',
      icon: '📧',
      description: 'Add to Outlook Calendar',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 'yahoo',
      name: 'Yahoo Calendar',
      icon: '🟣',
      description: 'Add to Yahoo Calendar',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      id: 'download',
      name: 'Download ICS',
      icon: '💾',
      description: 'Download calendar file',
      color: 'bg-gray-500 hover:bg-gray-600',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Add to Calendar
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">{event.title}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>📅 {new Date(event.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p>🕐 {event.time}</p>
              <p>📍 {event.location}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">
              Choose your preferred calendar application:
            </p>
            
            {calendarOptions.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => handleAddToCalendar(option.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{option.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {option.description}
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </div>
              </Button>
            ))}
          </div>

          <div className="pt-2">
            <Button variant="ghost" onClick={onClose} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDialog;
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Send, X, Paperclip, Smile } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

interface MessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    id: number;
    name: string;
    profilePicture?: string;
    position: string;
    company: string;
  };
}

// Mock messages for demonstration
const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'Sarah Johnson',
    content: 'Hi! Thanks for reaching out. I\'d be happy to help with any questions you have about transitioning into tech.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isCurrentUser: false,
  },
  {
    id: '2',
    senderId: 'current',
    senderName: 'You',
    content: 'Thank you so much! I\'m particularly interested in machine learning roles. What skills should I focus on developing?',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    isCurrentUser: true,
  },
  {
    id: '3',
    senderId: '1',
    senderName: 'Sarah Johnson',
    content: 'Great question! I\'d recommend focusing on Python, TensorFlow/PyTorch, and getting hands-on experience with real datasets. Also, don\'t underestimate the importance of understanding the business side of ML applications.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isCurrentUser: false,
  },
];

const MessageDialog: React.FC<MessageDialogProps> = ({ isOpen, onClose, recipient }) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'current',
      senderName: 'You',
      content: newMessage.trim(),
      timestamp: new Date(),
      isCurrentUser: true,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: recipient.id.toString(),
        senderName: recipient.name,
        content: 'Thanks for your message! I\'ll get back to you soon with more details.',
        timestamp: new Date(),
        isCurrentUser: false,
      };
      setMessages(prev => [...prev, response]);
    }, 2000);

    toast({
      title: "Message sent!",
      description: `Your message has been sent to ${recipient.name}.`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={recipient.profilePicture} alt={recipient.name} />
              <AvatarFallback>
                {recipient.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <h3 className="font-semibold">{recipient.name}</h3>
              <p className="text-sm text-muted-foreground">
                {recipient.position} at {recipient.company}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => {
              const showDate = index === 0 || 
                formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
              
              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex gap-3 ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    {!message.isCurrentUser && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={recipient.profilePicture} alt={recipient.name} />
                        <AvatarFallback className="text-xs">
                          {recipient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[70%] ${message.isCurrentUser ? 'order-first' : ''}`}>
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          message.isCurrentUser
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className={`text-xs text-muted-foreground mt-1 ${
                        message.isCurrentUser ? 'text-right' : 'text-left'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    
                    {message.isCurrentUser && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          You
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={recipient.profilePicture} alt={recipient.name} />
                  <AvatarFallback className="text-xs">
                    {recipient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        {/* Message Input */}
        <div className="p-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                placeholder={`Message ${recipient.name}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="resize-none"
              />
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
                disabled
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
                disabled
              >
                <Smile className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
                className="h-9 w-9 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
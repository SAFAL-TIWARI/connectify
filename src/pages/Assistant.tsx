import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Assistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! How can I help you today?',
      avatar: '/placeholder.svg',
    },
    {
      sender: 'user',
      text: 'I have a question about the mentorship program.',
      avatar: '/placeholder.svg',
    },
    {
      sender: 'ai',
      text: 'Of course! What would you like to know about the mentorship program?',
      avatar: '/placeholder.svg',
    },
    {
      sender: 'user',
      text: 'How can I find a mentor?',
      avatar: '/placeholder.svg',
    },
    {
      sender: 'ai',
      text: 'You can browse the alumni directory and filter for users who have opted-in to be mentors. You can also post a request on the mentorship board.',
      avatar: '/placeholder.svg',
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        {
          sender: 'user',
          text: inputValue,
          avatar: '/placeholder.svg',
        },
      ]);
      // Simulate AI response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: 'ai',
            text: 'This is a simulated response.',
            avatar: '/placeholder.svg',
          },
        ]);
      }, 1000);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">AI Assistant</h1>
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 ${
              message.sender === 'user' ? 'justify-end' : ''
            }`}
          >
            {message.sender === 'ai' && (
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={message.avatar} alt="AI Avatar" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-lg p-3 max-w-md ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
            {message.sender === 'user' && (
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={message.avatar} alt="User Avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
      <div className="bg-card border-t p-4">
        <div className="relative">
          <Input
            placeholder="Type your message..."
            className="pr-12"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute top-1/2 right-2 -translate-y-1/2"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;

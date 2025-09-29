import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Mail,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

interface EmailConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

const EmailConfirmationDialog: React.FC<EmailConfirmationDialogProps> = ({ 
  isOpen, 
  onClose, 
  userEmail 
}) => {
  const { toast } = useToast();

  const emailPlatforms = [
    {
      id: 'gmail',
      name: 'Gmail',
      icon: '📧',
      color: 'bg-red-500 hover:bg-red-600',
      url: 'https://mail.google.com',
      description: 'Open Gmail to confirm your email'
    },
    {
      id: 'outlook',
      name: 'Outlook',
      icon: '📮',
      color: 'bg-blue-500 hover:bg-blue-600',
      url: 'https://outlook.live.com',
      description: 'Open Outlook to confirm your email'
    },
    {
      id: 'yahoo',
      name: 'Yahoo Mail',
      icon: '💌',
      color: 'bg-purple-500 hover:bg-purple-600',
      url: 'https://mail.yahoo.com',
      description: 'Open Yahoo Mail to confirm your email'
    },
    {
      id: 'apple',
      name: 'Apple Mail',
      icon: '📬',
      color: 'bg-gray-800 hover:bg-gray-900',
      url: 'https://www.icloud.com/mail',
      description: 'Open iCloud Mail to confirm your email'
    },
    {
      id: 'other',
      name: 'Other Email App',
      icon: '📭',
      color: 'bg-green-500 hover:bg-green-600',
      url: '#',
      description: 'Open your default email application'
    }
  ];

  const handleEmailPlatformClick = (platform: typeof emailPlatforms[0]) => {
    if (platform.id === 'other') {
      // Try to open default email client
      if (userEmail) {
        window.location.href = `mailto:${userEmail}`;
      } else {
        toast({
          title: "Email App",
          description: "Please check your default email application for the confirmation email.",
        });
      }
    } else {
      // Open web-based email platform
      window.open(platform.url, '_blank', 'noopener,noreferrer');
    }
    
    toast({
      title: "Email Platform Opened",
      description: `Please check your ${platform.name} inbox for the confirmation email.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Confirm Your Email
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold">Thank you for signing up for Connectify!</h3>
            <p className="text-sm text-muted-foreground">
              Please confirm your email address by clicking the verification link we sent to{' '}
              {userEmail && (
                <span className="font-medium text-primary">{userEmail}</span>
              )}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-center">
              Choose your email platform to check for the confirmation email:
            </p>
            
            {emailPlatforms.map((platform) => (
              <Button
                key={platform.id}
                variant="outline"
                className="w-full justify-start h-auto p-4 hover:bg-accent"
                onClick={() => handleEmailPlatformClick(platform)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{platform.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{platform.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {platform.description}
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </div>
              </Button>
            ))}
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder or contact support.
            </p>
          </div>

          <div className="pt-2">
            <Button variant="ghost" onClick={onClose} className="w-full">
              I'll confirm later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailConfirmationDialog;
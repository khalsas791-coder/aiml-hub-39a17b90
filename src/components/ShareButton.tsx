import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';

const SHARE_URL = 'https://aimlpanel.netlify.app/';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AIML Resource Portal',
          text: 'Check out this amazing AIML study resource portal!',
          url: SHARE_URL,
        });
        setOpen(false);
      } catch (err) {
        // User cancelled or error
      }
    }
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=Check out AIML Resource Portal: ${SHARE_URL}`, '_blank');
    setOpen(false);
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${SHARE_URL}&text=Check out AIML Resource Portal`, '_blank');
    setOpen(false);
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${SHARE_URL}&text=Check out this AIML Resource Portal!`, '_blank');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 rounded-full border-border/50 hover:border-primary/50 hover:shadow-glow-sm transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 glass border-border/50" align="end">
        <h3 className="font-semibold text-foreground text-sm mb-3">Share Portal</h3>
        
        <div className="space-y-2">
          {/* Copy Link */}
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-sm text-foreground">Copy Link</span>
          </button>

          {/* Native Share (if available) */}
          {navigator.share && (
            <button
              onClick={shareNative}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <Share2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Share via...</span>
            </button>
          )}

          {/* WhatsApp */}
          <button
            onClick={shareWhatsApp}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">W</div>
            <span className="text-sm text-foreground">WhatsApp</span>
          </button>

          {/* Telegram */}
          <button
            onClick={shareTelegram}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">T</div>
            <span className="text-sm text-foreground">Telegram</span>
          </button>

          {/* Twitter/X */}
          <button
            onClick={shareTwitter}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="w-4 h-4 bg-foreground rounded-full flex items-center justify-center text-background text-xs font-bold">X</div>
            <span className="text-sm text-foreground">Twitter / X</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

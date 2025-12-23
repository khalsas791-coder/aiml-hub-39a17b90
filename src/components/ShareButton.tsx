import { Share2, Copy, Check, Mail } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

const SHARE_URL = 'https://aimlpanel.netlify.app/';
const SHARE_TEXT = 'Check out this AIML Resource Portal!';

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
          text: SHARE_TEXT,
          url: SHARE_URL,
        });
        setOpen(false);
      } catch (err) {
        // User cancelled or error
      }
    }
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + ' ' + SHARE_URL)}`, '_blank');
    setOpen(false);
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`, '_blank');
    setOpen(false);
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`, '_blank');
    setOpen(false);
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`, '_blank');
    setOpen(false);
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`, '_blank');
    setOpen(false);
  };

  const shareReddit = () => {
    window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(SHARE_URL)}&title=${encodeURIComponent(SHARE_TEXT)}`, '_blank');
    setOpen(false);
  };

  const shareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent('Check out AIML Resource Portal')}&body=${encodeURIComponent(SHARE_TEXT + '\n\n' + SHARE_URL)}`, '_blank');
    setOpen(false);
  };

  const shareInstagram = () => {
    // Instagram doesn't have a direct share URL, so we copy the link and inform user
    navigator.clipboard.writeText(SHARE_URL);
    toast.success('Link copied! Open Instagram and paste in your story or DM');
    setOpen(false);
  };

  const shareSnapchat = () => {
    window.open(`https://www.snapchat.com/share?url=${encodeURIComponent(SHARE_URL)}`, '_blank');
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
      <PopoverContent className="w-72 p-3 glass border-border/50" align="end">
        <h3 className="font-semibold text-foreground text-sm mb-3">Share Portal</h3>
        
        <ScrollArea className="h-[320px] pr-2">
          <div className="space-y-1">
            {/* Copy Link */}
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="text-sm text-foreground">Copy Link</span>
            </button>

            {/* Native Share (if available) */}
            {navigator.share && (
              <button
                onClick={shareNative}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <Share2 className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">Share via...</span>
              </button>
            )}

            {/* WhatsApp */}
            <button
              onClick={shareWhatsApp}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="w-5 h-5 bg-[#25D366] rounded-full flex items-center justify-center text-white text-xs font-bold">W</div>
              <span className="text-sm text-foreground">WhatsApp</span>
            </button>

            {/* Telegram */}
            <button
              onClick={shareTelegram}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="w-5 h-5 bg-[#0088cc] rounded-full flex items-center justify-center text-white text-xs font-bold">T</div>
              <span className="text-sm text-foreground">Telegram</span>
            </button>

            {/* Instagram */}
            <button
              onClick={shareInstagram}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="w-5 h-5 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] rounded-full flex items-center justify-center text-white text-xs font-bold">I</div>
              <span className="text-sm text-foreground">Instagram</span>
            </button>

            {/* Snapchat */}
            <button
              onClick={shareSnapchat}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="w-5 h-5 bg-[#FFFC00] rounded-full flex items-center justify-center text-black text-xs font-bold">S</div>
              <span className="text-sm text-foreground">Snapchat</span>
            </button>

            {/* Twitter/X */}
            <button
              onClick={shareTwitter}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="w-5 h-5 bg-foreground rounded-full flex items-center justify-center text-background text-xs font-bold">X</div>
              <span className="text-sm text-foreground">Twitter / X</span>
            </button>

            {/* Facebook */}
            <button
              onClick={shareFacebook}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center text-white text-xs font-bold">f</div>
              <span className="text-sm text-foreground">Facebook</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={shareLinkedIn}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="w-5 h-5 bg-[#0A66C2] rounded-full flex items-center justify-center text-white text-xs font-bold">in</div>
              <span className="text-sm text-foreground">LinkedIn</span>
            </button>

            {/* Reddit */}
            <button
              onClick={shareReddit}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="w-5 h-5 bg-[#FF4500] rounded-full flex items-center justify-center text-white text-xs font-bold">r</div>
              <span className="text-sm text-foreground">Reddit</span>
            </button>

            {/* Email */}
            <button
              onClick={shareEmail}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-foreground">Email</span>
            </button>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
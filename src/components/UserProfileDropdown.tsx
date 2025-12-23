import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  ChevronRight, 
  Settings, 
  Bell, 
  Share2, 
  HelpCircle, 
  LogOut,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface ProfileData {
  full_name: string | null;
  usn: string | null;
  phone_number: string | null;
}

export default function UserProfileDropdown() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>({
    full_name: null,
    usn: null,
    phone_number: null,
  });
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, usn, phone_number')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
    } else if (data) {
      setProfile({
        full_name: data.full_name,
        usn: data.usn,
        phone_number: data.phone_number,
      });
    } else {
      setProfile({
        full_name: user.user_metadata?.full_name || null,
        usn: user.user_metadata?.usn || null,
        phone_number: null,
      });
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    toast.success('Signed out successfully');
    navigate('/auth');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'AIML Portal',
      text: 'Check out this amazing AI/ML Resource Portal!',
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
    setIsOpen(false);
  };

  const displayName = profile.full_name || 
                      profile.usn || 
                      user?.email?.split('@')[0] || 
                      'User';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-3 py-1.5 glass rounded-full hover:shadow-glow-sm transition-all">
          <span className="text-sm font-medium text-foreground hidden sm:inline">{displayName}</span>
          {role === 'admin' ? (
            <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
              Admin
            </span>
          ) : (
            <span className="px-2 py-0.5 text-xs font-semibold bg-primary/20 text-primary rounded-full">
              Student
            </span>
          )}
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-2 bg-card border border-border shadow-xl z-50" align="end" sideOffset={8}>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* User Info Header */}
            <div className="flex items-center gap-3 p-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{displayName}</p>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-border" />

            {/* Menu Items */}
            <DropdownMenuItem 
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/50 rounded-lg"
              onClick={() => {
                setIsOpen(false);
                toast.info('Profile page coming soon!');
              }}
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">My Profile</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/50 rounded-lg"
              onClick={() => {
                setIsOpen(false);
                toast.info('Settings page coming soon!');
              }}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </DropdownMenuItem>

            <div 
              className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Notification</span>
              </div>
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={setNotificationsEnabled}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <DropdownMenuItem 
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/50 rounded-lg"
              onClick={handleShare}
            >
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Share App</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/50 rounded-lg"
              onClick={() => {
                setIsOpen(false);
                toast.info('Help & Support coming soon!');
              }}
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Help & Support</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuItem 
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-destructive/10 rounded-lg text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

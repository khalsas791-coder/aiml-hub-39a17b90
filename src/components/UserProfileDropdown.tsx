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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  ChevronRight, 
  Settings, 
  Bell, 
  Share2, 
  HelpCircle, 
  LogOut,
  Loader2,
  X
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
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

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
    <>
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
                setProfileDialogOpen(true);
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
                setHelpDialogOpen(true);
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

    {/* Help & Support Dialog */}
    <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            <DialogTitle className="text-xl font-bold">Help & Support</DialogTitle>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Need assistance? Contact our support team.
          </p>
        </DialogHeader>
        
        <div className="px-6 pb-4 space-y-3">
          <div className="bg-secondary/50 dark:bg-secondary/30 rounded-xl p-4 border border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-lg">JS</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Jaspreet Singh</h4>
                <p className="text-sm text-muted-foreground">Developer & Support</p>
              </div>
            </div>
            <div className="mt-3 pl-16">
              <p className="text-sm">
                <span className="text-muted-foreground">USN:</span>{' '}
                <span className="text-primary font-semibold">3GN24CI047</span>
              </p>
            </div>
          </div>
          
          <div className="bg-secondary/50 dark:bg-secondary/30 rounded-xl p-4 border border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-lg">GK</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Gursharanjeet Kaur</h4>
                <p className="text-sm text-muted-foreground">Developer & Support</p>
              </div>
            </div>
            <div className="mt-3 pl-16">
              <p className="text-sm">
                <span className="text-muted-foreground">USN:</span>{' '}
                <span className="text-primary font-semibold">3GN24CI015</span>
              </p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground text-center pt-2">
            For any help, queries, or issues with the portal, feel free to reach out!
          </p>
        </div>
        
        <div className="border-t border-border px-6 py-4">
          <p className="text-center text-muted-foreground text-sm">
            You can also report bugs or suggest features.
          </p>
        </div>
      </DialogContent>
    </Dialog>

    {/* Profile Dialog */}
    <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            <DialogTitle className="text-xl font-bold">My Profile</DialogTitle>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Your account information
          </p>
        </DialogHeader>
        
        <div className="px-6 pb-4">
          <div className="bg-secondary/50 dark:bg-secondary/30 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-2xl">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-lg">{profile.full_name || 'Not set'}</h4>
                <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                  {role === 'admin' ? 'Admin' : 'Student'}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground text-sm">Full Name</span>
                <span className="text-foreground font-medium">{profile.full_name || user?.user_metadata?.full_name || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground text-sm">USN / Admission No.</span>
                <span className="text-primary font-semibold">{profile.usn || user?.user_metadata?.usn || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground text-sm">Email</span>
                <span className="text-foreground font-medium text-sm truncate max-w-[180px]">{user?.email || 'Not set'}</span>
              </div>
              {profile.phone_number && (
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-muted-foreground text-sm">Phone</span>
                  <span className="text-foreground font-medium">{profile.phone_number}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground text-sm">Role</span>
                <span className="text-foreground font-medium capitalize">{role || 'Student'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border px-6 py-4">
          <Button 
            variant="outline" 
            className="w-full rounded-xl"
            onClick={() => setProfileDialogOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}

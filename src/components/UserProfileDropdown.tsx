import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileData {
  full_name: string | null;
  usn: string | null;
  phone_number: string | null;
}

export default function UserProfileDropdown() {
  const { user, role } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    full_name: null,
    usn: null,
    phone_number: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      // Set from user metadata if no profile exists
      setProfile({
        full_name: user.user_metadata?.full_name || null,
        usn: user.user_metadata?.usn || null,
        phone_number: null,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        full_name: profile.full_name,
        usn: profile.usn,
        phone_number: profile.phone_number,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      toast.error('Failed to save profile');
      console.error('Error saving profile:', error);
    } else {
      toast.success('Profile saved successfully');
    }
    setSaving(false);
  };

  const displayName = profile.full_name || 
                      profile.usn || 
                      user?.email?.split('@')[0] || 
                      'User';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-3 py-1.5 glass rounded-full hover:shadow-glow-sm transition-all">
          <User className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground hidden sm:inline">{displayName}</span>
          {role === 'admin' && (
            <span className="px-2 py-0.5 text-xs font-semibold gradient-primary text-primary-foreground rounded-full">
              Admin
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Student Details</h3>
              <p className="text-xs text-muted-foreground">Manage your profile information</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs text-muted-foreground">Full Name</Label>
                <Input
                  id="name"
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="Enter your name"
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="usn" className="text-xs text-muted-foreground">USN</Label>
                <Input
                  id="usn"
                  value={profile.usn || ''}
                  onChange={(e) => setProfile({ ...profile, usn: e.target.value.toUpperCase() })}
                  placeholder="3GN24CI000"
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="h-9 bg-muted/50"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs text-muted-foreground">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone_number || ''}
                  onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                  placeholder="+91 XXXXXXXXXX"
                  className="h-9"
                />
              </div>

              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="w-full gap-2 mt-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

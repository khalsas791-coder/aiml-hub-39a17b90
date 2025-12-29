import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Shield, 
  Users, 
  UserPlus, 
  Trash2, 
  AlertCircle,
  Loader2,
  Search,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'student';
  created_at: string;
}

interface Profile {
  user_id: string;
  full_name: string | null;
  usn: string | null;
  email: string | null;
}

export default function AdminPanel() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'student'>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  const fetchUserRoles = async () => {
    setIsLoading(true);
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (rolesError) throw rolesError;

      setUserRoles(rolesData || []);

      if (rolesData && rolesData.length > 0) {
        const userIds = [...new Set(rolesData.map(r => r.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, full_name, usn, email')
          .in('user_id', userIds);

        if (profilesError) throw profilesError;

        const profilesMap: Record<string, Profile> = {};
        profilesData?.forEach(p => {
          profilesMap[p.user_id] = p;
        });
        setProfiles(profilesMap);
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast.error('Failed to load user roles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'admin') {
      fetchUserRoles();
    }
  }, [role]);

  // Check if user is admin - moved after all hooks
  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-0 shadow-elevated">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access this page. Only admins can manage user roles.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="rounded-xl">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddRole = async () => {
    if (!newUserId.trim()) {
      toast.error('Please enter a user ID');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: newUserId.trim(),
          role: newRole
        });

      if (error) throw error;

      toast.success(`Role "${newRole}" added successfully`);
      setIsAddDialogOpen(false);
      setNewUserId('');
      setNewRole('student');
      fetchUserRoles();
    } catch (error: any) {
      console.error('Error adding role:', error);
      if (error.code === '23505') {
        toast.error('This user already has this role');
      } else {
        toast.error('Failed to add role');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (roleId: string, userId: string) => {
    if (userId === user?.id) {
      toast.error("You cannot remove your own admin role");
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast.success('Role removed successfully');
      fetchUserRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to remove role');
    }
  };

  const handleRoleChange = async (roleId: string, userId: string, newRoleValue: 'admin' | 'student') => {
    if (userId === user?.id) {
      toast.error("You cannot change your own role");
      return;
    }

    setUpdatingRoleId(roleId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRoleValue })
        .eq('id', roleId);

      if (error) throw error;

      toast.success(`Role updated to "${newRoleValue}"`);
      fetchUserRoles();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const filteredRoles = userRoles.filter(r => {
    const profile = profiles[r.user_id];
    const searchLower = searchTerm.toLowerCase();
    return (
      r.user_id.toLowerCase().includes(searchLower) ||
      r.role.toLowerCase().includes(searchLower) ||
      profile?.full_name?.toLowerCase().includes(searchLower) ||
      profile?.usn?.toLowerCase().includes(searchLower) ||
      profile?.email?.toLowerCase().includes(searchLower)
    );
  });

  const totalUsers = userRoles.length;
  const adminCount = userRoles.filter(r => r.role === 'admin').length;
  const studentCount = userRoles.filter(r => r.role === 'student').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage user roles and permissions</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-3 animate-slide-up">
          {/* Total Users */}
          <Card className="border border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>

          {/* Admins */}
          <Card className="border border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{adminCount}</p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </CardContent>
          </Card>

          {/* Students */}
          <Card className="border border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{studentCount}</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management Section */}
        <Card className="border border-primary/20 bg-card/50 backdrop-blur-sm animate-slide-up">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">User Management</CardTitle>
                <CardDescription>View and manage user roles</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl border-primary/30">
                    <UserPlus className="w-4 h-4" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add User Role</DialogTitle>
                    <DialogDescription>
                      Assign a role to a user by their user ID
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">User ID (UUID)</label>
                      <Input
                        placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
                        value={newUserId}
                        onChange={(e) => setNewUserId(e.target.value)}
                        className="h-11 rounded-xl"
                      />
                      <p className="text-xs text-muted-foreground">
                        You can find user IDs in the profiles table in your backend
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Role</label>
                      <Select value={newRole} onValueChange={(v: 'admin' | 'student') => setNewRole(v)}>
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl">
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddRole} 
                      disabled={isSubmitting}
                      className="rounded-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Adding...
                        </>
                      ) : (
                        'Add Role'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or USN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-secondary/50 border-border/50"
              />
            </div>

            {/* User List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
                <p className="text-muted-foreground text-sm">
                  {searchTerm ? 'Try a different search term' : 'Add a user to get started'}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Table Header */}
                <div className="grid grid-cols-3 gap-4 px-3 py-2 text-sm text-muted-foreground font-medium">
                  <span>Name</span>
                  <span className="text-center">Role</span>
                  <span className="text-right">Actions</span>
                </div>

                {/* User Rows */}
                <div className="space-y-2">
                  {filteredRoles.map((roleItem) => {
                    const profile = profiles[roleItem.user_id];
                    const isCurrentUser = roleItem.user_id === user?.id;
                    
                    return (
                      <div 
                        key={roleItem.id} 
                        className="grid grid-cols-3 gap-4 items-center px-3 py-3 rounded-xl bg-secondary/30 border border-border/30"
                      >
                        {/* Name Column */}
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium text-foreground truncate">
                            {profile?.full_name || 'Unknown'}
                          </span>
                          {isCurrentUser && (
                            <Badge variant="outline" className="text-xs shrink-0 border-muted-foreground/50">
                              You
                            </Badge>
                          )}
                        </div>

                        {/* Role Column */}
                        <div className="flex items-center justify-center gap-1">
                          {isCurrentUser ? (
                            <div className="flex items-center gap-1">
                              <Badge 
                                variant="outline" 
                                className="text-xs border-primary/50 text-primary"
                              >
                                {roleItem.role}
                              </Badge>
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                            </div>
                          ) : (
                            <Select 
                              value={roleItem.role} 
                              onValueChange={(v: 'admin' | 'student') => handleRoleChange(roleItem.id, roleItem.user_id, v)}
                              disabled={updatingRoleId === roleItem.id}
                            >
                              <SelectTrigger className="h-8 w-[100px] text-xs rounded-lg bg-secondary/50 border-border/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="student">student</SelectItem>
                                <SelectItem value="admin">admin</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>

                        {/* Actions Column */}
                        <div className="flex justify-end">
                          {isCurrentUser ? (
                            <span className="text-muted-foreground">—</span>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRole(roleItem.id, roleItem.user_id)}
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

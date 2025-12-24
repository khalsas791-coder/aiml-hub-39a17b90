import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  UserPlus, 
  Trash2, 
  AlertCircle,
  Loader2,
  Search,
  RefreshCw
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

  // Check if user is admin
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

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    setIsLoading(true);
    try {
      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (rolesError) throw rolesError;

      setUserRoles(rolesData || []);

      // Fetch profiles for all users with roles
      if (rolesData && rolesData.length > 0) {
        const userIds = [...new Set(rolesData.map(r => r.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, full_name, usn')
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
    // Prevent deleting own admin role
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

  const filteredRoles = userRoles.filter(r => {
    const profile = profiles[r.user_id];
    const searchLower = searchTerm.toLowerCase();
    return (
      r.user_id.toLowerCase().includes(searchLower) ||
      r.role.toLowerCase().includes(searchLower) ||
      profile?.full_name?.toLowerCase().includes(searchLower) ||
      profile?.usn?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container flex items-center h-16 px-4 gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage user roles and permissions</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 max-w-4xl mx-auto">
        <Card className="border-0 shadow-elevated animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>User Roles</CardTitle>
                  <CardDescription>
                    Manage admin and student roles
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={fetchUserRoles}
                  className="rounded-full"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="hero" className="gap-2 rounded-xl">
                      <UserPlus className="w-4 h-4" />
                      Add Role
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
                        variant="hero" 
                        onClick={handleAddRole} 
                        disabled={isSubmitting}
                        className="rounded-xl"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
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
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, USN, or user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-xl"
              />
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No roles found</h3>
                <p className="text-muted-foreground text-sm">
                  {searchTerm ? 'Try a different search term' : 'Add a role to get started'}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((roleItem) => {
                      const profile = profiles[roleItem.user_id];
                      return (
                        <TableRow key={roleItem.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">
                                {profile?.full_name || 'Unknown User'}
                              </p>
                              {profile?.usn && (
                                <p className="text-sm text-muted-foreground">{profile.usn}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={roleItem.role === 'admin' ? 'default' : 'secondary'}
                              className="capitalize"
                            >
                              {roleItem.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                              {roleItem.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-secondary px-2 py-1 rounded">
                              {roleItem.user_id.slice(0, 8)}...
                            </code>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRole(roleItem.id, roleItem.user_id)}
                              disabled={roleItem.user_id === user?.id}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

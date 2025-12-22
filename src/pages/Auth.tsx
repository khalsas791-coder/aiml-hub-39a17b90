import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Shield, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import NetworkBackground from '@/components/NetworkBackground';

const studentSchema = z.object({
  usn: z.string().min(6, 'USN must be at least 6 characters').max(20, 'USN must be less than 20 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const adminSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [studentForm, setStudentForm] = useState({ usn: '', password: '', name: '' });
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleStudentAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      studentSchema.parse({ usn: studentForm.usn, password: studentForm.password });
      const email = `${studentForm.usn.toLowerCase()}@student.aiml.edu`;
      
      if (isSignUp) {
        const { error } = await signUp(email, studentForm.password, {
          usn: studentForm.usn.toUpperCase(),
          full_name: studentForm.name,
        });
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This USN is already registered. Please sign in instead.');
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success('Account created successfully! You can now sign in.');
        setIsSignUp(false);
      } else {
        const { error } = await signIn(email, studentForm.password);
        if (error) {
          toast.error('Invalid USN or password');
          return;
        }
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      adminSchema.parse(adminForm);
      const { error } = await signIn(adminForm.email, adminForm.password);
      
      if (error) {
        toast.error('Invalid email or password');
        return;
      }
      
      toast.success('Welcome, Admin!');
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <NetworkBackground />
      
      <header className="p-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow-sm">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">AIML Portal</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 text-glow">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp ? 'Sign up to access your study materials' : 'Sign in to access your study materials'}
            </p>
          </div>

          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 p-1 glass rounded-xl mb-6 border border-border/50">
              <TabsTrigger value="student" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow-sm flex items-center gap-2 transition-all">
                <GraduationCap className="w-4 h-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="admin" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow-sm flex items-center gap-2 transition-all">
                <Shield className="w-4 h-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <Card className="border-0 glass glow-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Student Login</CardTitle>
                  <CardDescription>Use your University Seat Number (USN)</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStudentAuth} className="space-y-4">
                    {isSignUp && (
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" type="text" placeholder="Enter your full name" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="usn">USN</Label>
                      <Input id="usn" type="text" placeholder="e.g., 1MS21AI001" value={studentForm.usn} onChange={(e) => setStudentForm({ ...studentForm, usn: e.target.value })} className="h-12 rounded-xl uppercase bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-password">Password</Label>
                      <Input id="student-password" type="password" placeholder="Enter your password" value={studentForm.password} onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all" />
                    </div>
                    <Button type="submit" size="lg" className="w-full rounded-xl gradient-primary shadow-glow hover:shadow-glow transition-all" disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isSignUp ? 'Create Account' : 'Sign In'}<ArrowRight className="w-5 h-5" /></>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card className="border-0 glass glow-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Admin Login</CardTitle>
                  <CardDescription>Use your admin email and password</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminAuth} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="admin@aiml.edu" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input id="admin-password" type="password" placeholder="Enter your password" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all" />
                    </div>
                    <Button type="submit" size="lg" className="w-full rounded-xl gradient-primary shadow-glow hover:shadow-glow transition-all" disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In<ArrowRight className="w-5 h-5" /></>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account? (Students only)"}{' '}
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-semibold hover:underline">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
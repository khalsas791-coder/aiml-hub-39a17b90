import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { GraduationCap, Shield, Loader2, ArrowLeft, Mail, Users } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { validateName } from '@/lib/profanityFilter';
import aimlLogo from '@/assets/aiml-logo-new.png';

// Floating bubble component for animation
const FloatingBubbles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-gradient-to-br from-sky-400/20 to-blue-500/20 animate-float-bubble"
        style={{
          width: `${Math.random() * 100 + 40}px`,
          height: `${Math.random() * 100 + 40}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${6 + Math.random() * 4}s`,
        }}
      />
    ))}
  </div>
);

// Rotating glow ring component
const GlowRing = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="w-[600px] h-[600px] rounded-full border-2 border-sky-400/20 animate-rotate-glow" />
    <div className="absolute w-[500px] h-[500px] rounded-full border border-blue-400/15 animate-rotate-glow" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />
    <div className="absolute w-[400px] h-[400px] rounded-full border border-cyan-400/10 animate-rotate-glow" style={{ animationDuration: '30s' }} />
  </div>
);

const studentSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const adminSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const emailSchema = z.string().email('Invalid email address');

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [studentForm, setStudentForm] = useState({ email: '', password: '', name: '', usn: '' });
  const [isTeacher, setIsTeacher] = useState(false);
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      emailSchema.parse(forgotPasswordEmail);

      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: 'https://aiml-hub.vercel.app/reset-password',
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
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

  const handleStudentAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      studentSchema.parse({ email: studentForm.email, password: studentForm.password });
      
      if (isSignUp) {
        // Validate name for profanity
        const nameValidation = validateName(studentForm.name);
        if (!nameValidation.valid) {
          toast.error(nameValidation.message);
          setIsLoading(false);
          return;
        }
        
        if (!studentForm.name.trim()) {
          toast.error('Full name is required');
          setIsLoading(false);
          return;
        }
        
        const { error } = await signUp(studentForm.email, studentForm.password, {
          full_name: studentForm.name,
          usn: isTeacher ? undefined : studentForm.usn,
        });
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in instead.');
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success('Account created successfully! You can now sign in.');
        setIsSignUp(false);
      } else {
        // For login, use email directly
        const { error } = await signIn(studentForm.email, studentForm.password);
        
        if (error) {
          toast.error('Invalid email or password');
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

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden sky-blue-bg">
        {/* Animated background elements */}
        <FloatingBubbles />
        <GlowRing />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-blue-600/5 animate-gradient-shift pointer-events-none" />
        
        <header className="p-6 relative z-10">
          <div className="flex items-center gap-3">
            <img src={aimlLogo} alt="AIML Logo" className="w-[80px] h-[80px] object-cover rounded-full shadow-glow-sm" />
            <span className="text-xl font-bold text-foreground">AIML Portal</span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-md animate-card-entrance">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Forgot Password
                </span>
              </h1>
              <p className="text-muted-foreground">
                Enter your email to receive a password reset link
              </p>
            </div>

            <Card className="border-0 glass glow-border relative overflow-hidden">
              <div className="absolute inset-0 animate-shimmer opacity-50 pointer-events-none" />
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Reset Password</CardTitle>
                <CardDescription>We'll send you a recovery link</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email Address</Label>
                    <Input 
                      id="reset-email" 
                      type="email" 
                      placeholder="e.g. youremail@gmail.com" 
                      value={forgotPasswordEmail} 
                      onChange={(e) => setForgotPasswordEmail(e.target.value)} 
                      className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all relative z-10" 
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full rounded-xl gradient-primary shadow-glow hover:shadow-glow transition-all" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Send Reset Link
                        <Mail className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <button 
              type="button" 
              onClick={() => setShowForgotPassword(false)} 
              className="flex items-center gap-2 text-primary font-semibold hover:underline mx-auto mt-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden sky-blue-bg">
      {/* Animated background elements */}
      <FloatingBubbles />
      <GlowRing />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-blue-600/5 animate-gradient-shift pointer-events-none" />
      
      <header className="p-6 relative z-10">
        <div className="flex items-center gap-3">
          <img src={aimlLogo} alt="AIML Logo" className="w-[80px] h-[80px] object-cover rounded-full shadow-glow-sm" />
          <span className="text-xl font-bold text-foreground">AIML Portal</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-card-entrance">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSignUp ? 'Register to get started' : 'Sign in to access your study materials'}
            </p>
          </div>

          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-secondary/50 rounded-full mb-6 border border-border/30">
              <TabsTrigger value="student" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 transition-all text-sm">
                <GraduationCap className="w-4 h-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="admin" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 transition-all text-sm">
                <Shield className="w-4 h-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <Card className="border-0 bg-transparent shadow-none">
                <CardContent className="p-0 space-y-5">
                  {isSignUp && (
                    <>
                      {/* Teacher toggle */}
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border/30">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-foreground">I am a Teacher</span>
                        </div>
                        <Switch 
                          checked={isTeacher} 
                          onCheckedChange={setIsTeacher}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    </>
                  )}
                  
                  <form onSubmit={handleStudentAuth} className="space-y-4">
                    {isSignUp && (
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                        <Input 
                          id="name" 
                          type="text" 
                          placeholder="Enter your full name" 
                          value={studentForm.name} 
                          onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} 
                          className="h-12 rounded-xl bg-secondary/30 border-border/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50" 
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="student-email" className="text-sm font-medium text-foreground">
                        Email Address {isSignUp && <span className="text-destructive">*</span>}
                      </Label>
                      <Input 
                        id="student-email" 
                        type="email" 
                        placeholder="your.email@example.com" 
                        value={studentForm.email} 
                        onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} 
                        className="h-12 rounded-xl bg-secondary/30 border-border/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50" 
                      />
                      {isSignUp && (
                        <p className="text-xs text-muted-foreground">Required for password recovery</p>
                      )}
                    </div>
                    
                    {isSignUp && !isTeacher && (
                      <div className="space-y-2">
                        <Label htmlFor="usn" className="text-sm font-medium text-foreground">University Seat Number (USN)</Label>
                        <Input 
                          id="usn" 
                          type="text" 
                          placeholder="E.G., 3GN24CD000" 
                          value={studentForm.usn} 
                          onChange={(e) => setStudentForm({ ...studentForm, usn: e.target.value.toUpperCase() })} 
                          className="h-12 rounded-xl bg-secondary/30 border-border/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50" 
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="student-password" className="text-sm font-medium text-foreground">Password</Label>
                      <Input 
                        id="student-password" 
                        type="password" 
                        placeholder="Enter your password" 
                        value={studentForm.password} 
                        onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} 
                        className="h-12 rounded-xl bg-secondary/30 border-border/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50" 
                      />
                    </div>
                    {!isSignUp && (
                      <button 
                        type="button" 
                        onClick={() => setShowForgotPassword(true)} 
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all mt-2" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        isSignUp ? 'Create Account' : 'Sign In'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card className="border-0 bg-transparent shadow-none">
                <CardContent className="p-0">
                  <form onSubmit={handleAdminAuth} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="admin@aiml.edu" 
                        value={adminForm.email} 
                        onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} 
                        className="h-12 rounded-xl bg-secondary/30 border-border/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password" className="text-sm font-medium text-foreground">Password</Label>
                      <Input 
                        id="admin-password" 
                        type="password" 
                        placeholder="Enter your password" 
                        value={adminForm.password} 
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} 
                        className="h-12 rounded-xl bg-secondary/30 border-border/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50" 
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowForgotPassword(true)} 
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot Password?
                    </button>
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              type="button" 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-primary font-semibold hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign Up'}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
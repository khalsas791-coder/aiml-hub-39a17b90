import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Shield, ArrowRight, Loader2, ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { validateName } from '@/lib/profanityFilter';
import aimlLogo from '@/assets/aiml-logo.png';

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
  usn: z.string().min(6, 'USN must be at least 6 characters').max(20, 'USN must be less than 20 characters'),
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
  const [studentForm, setStudentForm] = useState({ usn: '', password: '', name: '', email: '' });
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      emailSchema.parse(forgotPasswordEmail);
      
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: 'https://aimlpanel.netlify.app/reset-password',
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
      studentSchema.parse({ usn: studentForm.usn, password: studentForm.password });
      
      if (isSignUp) {
        // For signup, use the provided email
        if (!studentForm.email) {
          toast.error('Email is required for signup');
          setIsLoading(false);
          return;
        }
        
        try {
          emailSchema.parse(studentForm.email);
        } catch {
          toast.error('Please enter a valid email address');
          setIsLoading(false);
          return;
        }
        
        // Validate name for profanity
        const nameValidation = validateName(studentForm.name);
        if (!nameValidation.valid) {
          toast.error(nameValidation.message);
          setIsLoading(false);
          return;
        }
        
        const { error } = await signUp(studentForm.email, studentForm.password, {
          usn: studentForm.usn.toUpperCase(),
          full_name: studentForm.name,
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
        // For login, try USN-based email first, then regular email
        const usnEmail = `${studentForm.usn.toLowerCase()}@student.aiml.edu`;
        let { error } = await signIn(usnEmail, studentForm.password);
        
        // If USN login fails, try with USN as email directly (for users who signed up with email)
        if (error) {
          // Check if USN looks like an email
          if (studentForm.usn.includes('@')) {
            const result = await signIn(studentForm.usn, studentForm.password);
            error = result.error;
          }
        }
        
        if (error) {
          toast.error('Invalid USN/Email or password');
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
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-blue-600/5 animate-gradient-shift" />
        
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
              <div className="absolute inset-0 animate-shimmer opacity-50" />
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
                      placeholder="Enter your email" 
                      value={forgotPasswordEmail} 
                      onChange={(e) => setForgotPasswordEmail(e.target.value)} 
                      className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all" 
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
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-blue-600/5 animate-gradient-shift" />
      
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
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </span>
            </h1>
            <p className="text-muted-foreground">
              {isSignUp ? 'Sign up to access your study materials' : 'Sign in to access your study materials'}
            </p>
          </div>

          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 p-1 glass rounded-xl mb-6 border border-sky-400/30">
              <TabsTrigger value="student" className="rounded-lg data-[state=active]:sky-blue-gradient data-[state=active]:text-white data-[state=active]:shadow-glow-sm flex items-center gap-2 transition-all">
                <GraduationCap className="w-4 h-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="admin" className="rounded-lg data-[state=active]:sky-blue-gradient data-[state=active]:text-white data-[state=active]:shadow-glow-sm flex items-center gap-2 transition-all">
                <Shield className="w-4 h-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <Card className="border-0 glass glow-border relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer opacity-30" />
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="text-lg">Student {isSignUp ? 'Sign Up' : 'Login'}</CardTitle>
                  <CardDescription>
                    {isSignUp ? 'Create your account with USN and email' : 'Use your USN or email to sign in'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <form onSubmit={handleStudentAuth} className="space-y-4">
                    {isSignUp && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            type="text" 
                            placeholder="Enter your full name" 
                            value={studentForm.name} 
                            onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} 
                            className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input 
                            id="signup-email" 
                            type="email" 
                            placeholder="Enter your email" 
                            value={studentForm.email} 
                            onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} 
                            className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all" 
                          />
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="usn">{isSignUp ? 'USN' : 'USN or Email'}</Label>
                      <Input 
                        id="usn" 
                        type="text" 
                        placeholder={isSignUp ? 'e.g., 3GN24CI000' : 'USN or email'} 
                        value={studentForm.usn} 
                        onChange={(e) => setStudentForm({ ...studentForm, usn: e.target.value })} 
                        className="h-12 rounded-xl uppercase bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-password">Password</Label>
                      <Input 
                        id="student-password" 
                        type="password" 
                        placeholder="Enter your password" 
                        value={studentForm.password} 
                        onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} 
                        className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all" 
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
                      className="w-full rounded-xl gradient-primary shadow-glow hover:shadow-glow transition-all" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          {isSignUp ? 'Create Account' : 'Sign In'}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card className="border-0 glass glow-border relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer opacity-30" />
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="text-lg">Admin Login</CardTitle>
                  <CardDescription>Use your admin email and password</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <form onSubmit={handleAdminAuth} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="admin@aiml.edu" 
                        value={adminForm.email} 
                        onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} 
                        className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input 
                        id="admin-password" 
                        type="password" 
                        placeholder="Enter your password" 
                        value={adminForm.password} 
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} 
                        className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all" 
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
                      className="w-full rounded-xl gradient-primary shadow-glow hover:shadow-glow transition-all" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account? (Students only)"}{' '}
            <button 
              type="button" 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-primary font-semibold hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
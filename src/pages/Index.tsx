import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, ArrowRight, FileText, Upload, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AIML Portal</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="gap-2"
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center max-w-2xl mx-auto animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-accent-foreground text-sm font-medium mb-6">
            <GraduationCap className="w-4 h-4" />
            AIML Department Resource Portal
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Your Study Materials,{' '}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              All in One Place
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Access lecture notes, PDFs, and study resources for your AIML courses. 
            Organized by semester and subject for easy navigation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => navigate('/auth')}
              className="gap-2 w-full sm:w-auto"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              onClick={() => navigate('/auth')}
              className="gap-2 w-full sm:w-auto"
            >
              Admin Login
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
          <FeatureCard
            icon={FileText}
            title="Organized Resources"
            description="Study materials organized by semester and subject for quick access"
          />
          <FeatureCard
            icon={Upload}
            title="Easy Downloads"
            description="Download PDFs and documents instantly with a single click"
          />
          <FeatureCard
            icon={Users}
            title="Role-Based Access"
            description="Separate interfaces for students and administrators"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-sm text-muted-foreground">
          © 2024 AIML Department. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

function FeatureCard({ icon: Icon, title, description }: { 
  icon: React.ComponentType<{ className?: string }>; 
  title: string; 
  description: string 
}) {
  return (
    <div className="p-6 bg-card rounded-2xl shadow-card border border-border/50 text-center hover:shadow-elevated transition-shadow">
      <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default Index;

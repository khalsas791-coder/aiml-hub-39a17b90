import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Upload, Users, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import NetworkBackground from '@/components/NetworkBackground';
import aimlLogo from '@/assets/aiml-logo.png';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <NetworkBackground />
      
      {/* Header */}
      <header className="p-6 relative z-10">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={aimlLogo} alt="AIML Logo" className="w-[100px] h-[100px] object-contain" />
            <span className="text-xl font-bold text-foreground">AIML Portal</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="gap-2 border-border/50 hover:border-primary/50 hover:shadow-glow-sm transition-all"
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-primary text-sm font-medium mb-6 border border-primary/30 shadow-glow-sm">
            <Zap className="w-4 h-4" />
            AIML Department Resource Portal
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Your Study Materials,{' '}
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-blue-500 bg-clip-text text-transparent text-glow">
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
              size="lg"
              onClick={() => navigate('/auth')}
              className="gap-2 w-full sm:w-auto gradient-primary shadow-glow hover:shadow-glow transition-all text-primary-foreground"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/auth')}
              className="gap-2 w-full sm:w-auto border-border/50 hover:border-primary/50 hover:shadow-glow-sm transition-all"
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
      <footer className="p-6 text-center relative z-10">
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
    <div className="p-6 glass rounded-2xl border border-border/50 text-center hover:shadow-glow-sm hover:border-primary/30 transition-all group">
      <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow-sm group-hover:shadow-glow transition-all">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default Index;
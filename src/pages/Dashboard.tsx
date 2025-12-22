import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NetworkBackground from '@/components/NetworkBackground';
import NotificationBell from '@/components/NotificationBell';
import ThemeToggle from '@/components/ThemeToggle';
import ProfileStats from '@/components/ProfileStats';
import ShareButton from '@/components/ShareButton';
import { 
  BookOpen, 
  Upload, 
  LogOut, 
  ChevronRight, 
  GraduationCap,
  Calculator,
  Cpu,
  Code2,
  Coffee,
  Monitor,
  FolderOpen,
  User,
  Sparkles,
  Brain
} from 'lucide-react';
import { toast } from 'sonner';

const subjects3rdSem = [
  { id: 'mathematics', name: 'Mathematics', icon: Calculator, color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400' },
  { id: 'ddco', name: 'DDCO', icon: Cpu, color: 'from-purple-500/20 to-pink-500/20 text-purple-400' },
  { id: 'dsa', name: 'DSA', icon: Code2, color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400' },
  { id: 'java', name: 'Java', icon: Coffee, color: 'from-orange-500/20 to-amber-500/20 text-orange-400' },
  { id: 'os', name: 'Operating Systems', icon: Monitor, color: 'from-rose-500/20 to-red-500/20 text-rose-400' },
];

export default function Dashboard() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/auth');
  };

  const handleSubjectClick = (semester: number, subjectId: string) => {
    navigate(`/semester/${semester}/subject/${subjectId}`);
  };

  const handleQuizClick = (subjectId: string) => {
    navigate(`/quiz/${subjectId}`);
  };

  const displayName = user?.user_metadata?.full_name || 
                      user?.user_metadata?.usn || 
                      user?.email?.split('@')[0] || 
                      'User';

  return (
    <div className="min-h-screen relative">
      <NetworkBackground />
      
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border dark:glass-strong dark:border-0">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow-sm">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground hidden sm:block">AIML Portal</span>
          </div>

          <div className="flex items-center gap-2">
            <ShareButton />
            <Button variant="outline" size="sm" onClick={() => navigate('/calculator')} className="gap-2 rounded-full border-border/50 hover:border-primary/50 hover:shadow-glow-sm transition-all">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Calculator</span>
            </Button>
            {role === 'admin' && (
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/upload')} className="gap-2 rounded-full border-border/50 hover:border-primary/50 hover:shadow-glow-sm transition-all">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
            )}
            <ThemeToggle />
            <NotificationBell />
            <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground hidden sm:inline">{displayName}</span>
              {role === 'admin' && <span className="px-2 py-0.5 text-xs font-semibold gradient-primary text-primary-foreground rounded-full">Admin</span>}
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-muted-foreground hover:text-primary rounded-full hover:shadow-glow-sm transition-all">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 relative z-10">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-glow">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {displayName.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">Access your study materials and resources</p>
        </div>

        <ProfileStats />

        <Card className="mb-8 border overflow-hidden animate-slide-up shadow-lg dark:border-0 dark:glow-border">
          <div className="gradient-primary p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium mb-1">Welcome back to</p>
                <p className="text-3xl font-bold text-primary-foreground flex items-center gap-2">AI/ML Portal! 👋</p>
                <p className="text-primary-foreground/80 text-sm mt-1">Continue your learning journey and master artificial intelligence</p>
              </div>
              <div className="w-16 h-16 bg-primary-foreground/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <GraduationCap className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />3rd Semester
              </h2>
              <span className="text-sm text-muted-foreground">{subjects3rdSem.length} Subjects</span>
            </div>
            <Card className="border shadow-md dark:border-0 dark:glass dark:glow-border">
              <CardContent className="p-2">
                {subjects3rdSem.map((subject, index) => (
                  <div key={subject.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-all group" style={{ animationDelay: `${(index + 1) * 50}ms` }}>
                    <button onClick={() => handleSubjectClick(3, subject.id)} className="flex-1 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${subject.color}`}>
                        <subject.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{subject.name}</p>
                        <p className="text-sm text-muted-foreground">View materials</p>
                      </div>
                    </button>
                    <Button variant="outline" size="sm" onClick={() => handleQuizClick(subject.id)} className="gap-1 rounded-full border-primary/30 text-primary hover:bg-primary/10 hover:shadow-glow-sm">
                      <Brain className="w-3 h-3" />Quiz
                    </Button>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all cursor-pointer" onClick={() => handleSubjectClick(3, subject.id)} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">4th Semester</h2>
              <span className="px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full border border-primary/30">Coming Soon</span>
            </div>
            <Card className="border shadow-md dark:border-0 dark:glass">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow">
                  <FolderOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Subjects Yet</h3>
                <p className="text-muted-foreground text-sm max-w-xs">4th semester subjects will be added here when available. Check back later!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

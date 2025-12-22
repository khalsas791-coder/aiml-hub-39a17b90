import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  User
} from 'lucide-react';
import { toast } from 'sonner';

const subjects3rdSem = [
  { id: 'mathematics', name: 'Mathematics', icon: Calculator, color: 'bg-blue-500/10 text-blue-600' },
  { id: 'ddco', name: 'DDCO', icon: Cpu, color: 'bg-purple-500/10 text-purple-600' },
  { id: 'dsa', name: 'DSA', icon: Code2, color: 'bg-green-500/10 text-green-600' },
  { id: 'java', name: 'Java', icon: Coffee, color: 'bg-orange-500/10 text-orange-600' },
  { id: 'os', name: 'Operating Systems', icon: Monitor, color: 'bg-red-500/10 text-red-600' },
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

  // Get display name
  const displayName = user?.user_metadata?.full_name || 
                      user?.user_metadata?.usn || 
                      user?.email?.split('@')[0] || 
                      'User';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground hidden sm:block">AIML Portal</span>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/calculator')}
              className="gap-2 rounded-full"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Calculator</span>
            </Button>

            {role === 'admin' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/admin/upload')}
                className="gap-2 rounded-full"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
            )}
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground hidden sm:inline">{displayName}</span>
              {role === 'admin' && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                  Admin
                </span>
              )}
            </div>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground rounded-full"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {displayName.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Access your study materials and resources
          </p>
        </div>

        {/* Quick Stats Card */}
        <Card className="mb-8 border-0 shadow-card gradient-primary overflow-hidden animate-slide-up">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium mb-1">Your Resources</p>
                <p className="text-3xl font-bold text-primary-foreground">AIML Department</p>
                <p className="text-primary-foreground/80 text-sm mt-1">2 Semesters Available</p>
              </div>
              <div className="w-16 h-16 bg-primary-foreground/20 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Semesters Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 3rd Semester */}
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">3rd Semester</h2>
              <span className="text-sm text-muted-foreground">{subjects3rdSem.length} Subjects</span>
            </div>
            <Card className="border-0 shadow-card">
              <CardContent className="p-2">
                {subjects3rdSem.map((subject, index) => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectClick(3, subject.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors group"
                    style={{ animationDelay: `${(index + 1) * 50}ms` }}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${subject.color}`}>
                      <subject.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">{subject.name}</p>
                      <p className="text-sm text-muted-foreground">View materials</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 4th Semester */}
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">4th Semester</h2>
              <span className="px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                Coming Soon
              </span>
            </div>
            <Card className="border-0 shadow-card bg-secondary/30">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
                  <FolderOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Subjects Yet</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  4th semester subjects will be added here when available. Check back later!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

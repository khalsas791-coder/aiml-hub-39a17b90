import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NetworkBackground from '@/components/NetworkBackground';
import ThemeToggle from '@/components/ThemeToggle';
import ProfileStats from '@/components/ProfileStats';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import aimlLogo from '@/assets/aiml-logo.png';
import { 
  Upload, 
  ChevronRight, 
  GraduationCap,
  Calculator,
  Cpu,
  Code2,
  Coffee,
  Monitor,
  Sparkles,
  CalendarDays,
  BookOpen,
  FlaskConical,
  BarChart3,
  FolderOpen
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface SubjectData {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  iconBg: string;
}

const subjects3rdSem: SubjectData[] = [
  { 
    id: 'dsa', 
    code: 'BCS304',
    name: 'Data Structures and Algorithms', 
    description: 'Fundamental data structures and algorithm design',
    icon: Code2, 
    color: 'text-purple-500',
    iconBg: 'bg-purple-500'
  },
  { 
    id: 'ddco', 
    code: 'BCS302',
    name: 'Digital Design & Computer Organization', 
    description: 'Digital logic design and computer architecture',
    icon: Cpu, 
    color: 'text-purple-500',
    iconBg: 'bg-purple-500'
  },
  { 
    id: 'lab-manuals', 
    code: 'LAB301',
    name: 'Lab Manuals', 
    description: 'Laboratory manuals and practical guides for all subjects',
    icon: BookOpen, 
    color: 'text-pink-500',
    iconBg: 'bg-pink-500'
  },
  { 
    id: 'mathematics', 
    code: 'BCS301',
    name: 'Mathematics', 
    description: 'Advanced mathematical concepts and applications',
    icon: Calculator, 
    color: 'text-purple-500',
    iconBg: 'bg-purple-500'
  },
  { 
    id: 'os', 
    code: 'BCS303',
    name: 'Operating Systems', 
    description: 'Operating system concepts and design',
    icon: Monitor, 
    color: 'text-purple-500',
    iconBg: 'bg-purple-500'
  },
  { 
    id: 'java', 
    code: 'BDS306C',
    name: 'Java Programming', 
    description: 'Object-oriented programming with Java',
    icon: Coffee, 
    color: 'text-pink-500',
    iconBg: 'bg-pink-500'
  },
];

export default function Dashboard() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [resourceCounts, setResourceCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchResourceCounts();
  }, []);

  const fetchResourceCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('subject')
        .eq('semester', 3);

      if (error) throw error;

      const counts: Record<string, number> = {};
      data?.forEach(resource => {
        counts[resource.subject] = (counts[resource.subject] || 0) + 1;
      });
      
      // Count lab manuals separately
      const { data: labData } = await supabase
        .from('resources')
        .select('id')
        .eq('semester', 3)
        .eq('resource_type', 'lab_manual');
      
      counts['lab-manuals'] = labData?.length || 0;
      
      setResourceCounts(counts);
    } catch (error) {
      console.error('Error fetching resource counts:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/auth');
  };

  const handleSubjectClick = (subjectId: string) => {
    if (subjectId === 'lab-manuals') {
      // Navigate to a lab manuals page or show all lab manuals
      navigate(`/semester/3/subject/dsa?tab=lab_manual`);
    } else {
      navigate(`/semester/3/subject/${subjectId}`);
    }
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
            <img src={aimlLogo} alt="AIML Logo" className="w-[100px] h-[100px] object-cover rounded-full" />
            <span className="text-lg font-semibold text-foreground hidden sm:block">AIML Portal</span>
          </div>

          <div className="flex items-center gap-2">
            {role === 'admin' && (
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/upload')} className="gap-2 rounded-full border-border/50 hover:border-primary/50 hover:shadow-glow-sm transition-all">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
            )}
            <ThemeToggle />
            <UserProfileDropdown />
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 relative z-10">
        <div className="mb-6 animate-fade-in">
          <p className="text-muted-foreground text-sm mb-1">Hello,</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
            {displayName.split(' ')[0]}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-default">
              <Sparkles className="w-3.5 h-3.5" />
              Student
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/calculator')} 
              className="gap-1.5 rounded-full border-border hover:border-primary/50 text-foreground"
            >
              <Calculator className="w-3.5 h-3.5" />
              CGPA Calculator
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/timetable')}
              className="gap-1.5 rounded-full border-border hover:border-primary/50 text-foreground"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Timetable
            </Button>
          </div>
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

        {/* 3rd Semester Section */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">3rd Semester</h2>
              <p className="text-sm text-muted-foreground">Core subjects</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects3rdSem.map((subject, index) => (
              <Card 
                key={subject.id}
                onClick={() => handleSubjectClick(subject.id)}
                className="group cursor-pointer border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden
                  transition-all duration-300 ease-out
                  hover:shadow-2xl hover:shadow-purple-500/10
                  hover:-translate-y-2 hover:rotate-1
                  active:scale-[0.98]
                  dark:bg-card/40 dark:hover:bg-card/60
                  animate-fade-in"
                style={{ 
                  animationDelay: `${(index + 1) * 100}ms`,
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                <CardContent className="p-5 relative">
                  {/* Decorative Ring */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full border-2 border-purple-200 dark:border-purple-800/50 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 ${subject.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <subject.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Subject Code */}
                  <p className={`text-sm font-medium ${subject.color} mb-1`}>{subject.code}</p>
                  
                  {/* Subject Name */}
                  <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {subject.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {subject.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FolderOpen className="w-4 h-4" />
                      <span className="text-sm">{resourceCounts[subject.id] || 0} resources</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 4th Semester Coming Soon */}
        <div className="mt-10 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">4th Semester</h2>
                <p className="text-sm text-muted-foreground">Upcoming subjects</p>
              </div>
            </div>
            <span className="px-3 py-1.5 text-xs font-medium bg-accent text-accent-foreground rounded-full border border-primary/30">
              Coming Soon
            </span>
          </div>
          
          <Card className="border shadow-md dark:border-0 dark:glass opacity-60">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4 animate-pulse">
                <FolderOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Subjects Yet</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                4th semester subjects will be added here when available. Check back later!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

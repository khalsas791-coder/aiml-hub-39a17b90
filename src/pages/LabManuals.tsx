import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import NetworkBackground from '@/components/NetworkBackground';
import ThemeToggle from '@/components/ThemeToggle';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import aimlLogo from '@/assets/aiml-logo.png';
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  FileText,
  Loader2,
  FolderOpen,
  BookOpen,
  Trash2,
  Calculator,
  Cpu,
  Code2,
  Coffee,
  Monitor,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Resource {
  id: string;
  title: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
  created_at: string;
  subject: string;
}

interface SubjectData {
  id: string;
  code: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

const subjects: SubjectData[] = [
  { id: 'dsa', code: 'BCS304', name: 'Data Structures and Algorithms', icon: Code2, color: 'bg-purple-500' },
  { id: 'ddco', code: 'BCS302', name: 'Digital Design & Computer Organization', icon: Cpu, color: 'bg-purple-500' },
  { id: 'mathematics', code: 'BCS301', name: 'Mathematics', icon: Calculator, color: 'bg-purple-500' },
  { id: 'os', code: 'BCS303', name: 'Operating Systems', icon: Monitor, color: 'bg-purple-500' },
  { id: 'java', code: 'BDS306C', name: 'Java Programming', icon: Coffee, color: 'bg-pink-500' },
];

export default function LabManuals() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [labManuals, setLabManuals] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchLabManuals();
  }, []);

  const fetchLabManuals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('semester', 3)
        .eq('resource_type', 'lab_manual')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLabManuals(data || []);
    } catch (error) {
      console.error('Error fetching lab manuals:', error);
      toast.error('Failed to load lab manuals');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (resource: Resource) => {
    try {
      const { data, error } = await supabase.storage
        .from('resources')
        .createSignedUrl(resource.file_path, 3600);
      
      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Error viewing file:', error);
      toast.error('Failed to open file');
    }
  };

  const handleDownload = async (resource: Resource) => {
    try {
      const { data, error } = await supabase.storage
        .from('resources')
        .download(resource.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = resource.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const handleDelete = async (resource: Resource) => {
    setDeleting(resource.id);
    try {
      const { error: storageError } = await supabase.storage
        .from('resources')
        .remove([resource.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('resources')
        .delete()
        .eq('id', resource.id);

      if (dbError) throw dbError;

      setLabManuals(labManuals.filter(r => r.id !== resource.id));
      toast.success('Lab manual deleted successfully');
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete lab manual');
    } finally {
      setDeleting(null);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      const kb = bytes / 1024;
      return `${kb.toFixed(1)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const getSubjectManuals = (subjectId: string) => {
    return labManuals.filter(m => m.subject === subjectId);
  };

  const getSubjectInfo = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId);
  };

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
            <ThemeToggle />
            <UserProfileDropdown />
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => selectedSubject ? setSelectedSubject(null) : navigate('/dashboard')}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-pink-500" />
              {selectedSubject ? getSubjectInfo(selectedSubject)?.name : 'Lab Manuals'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {selectedSubject ? 'Lab manual resources' : 'Select a subject to view lab manuals'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : selectedSubject ? (
          // Show lab manuals for selected subject
          <div className="space-y-4">
            {getSubjectManuals(selectedSubject).length === 0 ? (
              <Card className="border-0 glass">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
                  <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow">
                    <FolderOpen className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">No Lab Manuals Yet</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    Lab manuals for this subject will appear here once uploaded by admins.
                  </p>
                </CardContent>
              </Card>
            ) : (
              getSubjectManuals(selectedSubject).map((resource, index) => (
                <Card 
                  key={resource.id} 
                  className="border-0 glass glow-border animate-slide-up hover:shadow-glow-sm transition-all"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-pink-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground line-clamp-2">{resource.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground font-mono">
                            {formatFileSize(resource.file_size)}
                          </span>
                          <span className="text-primary">•</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(resource.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleView(resource)}
                        className="flex-1 gap-2 rounded-xl border-border/50 hover:border-primary/50 hover:shadow-glow-sm transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleDownload(resource)}
                        className="flex-1 gap-2 rounded-xl shadow-glow-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      {isAdmin && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              className="gap-2 rounded-xl"
                              disabled={deleting === resource.id}
                            >
                              {deleting === resource.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-strong border-border/50">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Lab Manual</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{resource.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(resource)} className="rounded-xl">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          // Show subject selection
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject, index) => {
              const manualCount = getSubjectManuals(subject.id).length;
              return (
                <Card 
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
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
                    <div className={`w-12 h-12 ${subject.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <subject.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Subject Code */}
                    <p className="text-sm font-medium text-purple-500 mb-1">{subject.code}</p>
                    
                    {/* Subject Name */}
                    <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {subject.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4">
                      Lab manual and practical guides
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FolderOpen className="w-4 h-4" />
                        <span className="text-sm">{manualCount} {manualCount === 1 ? 'manual' : 'manuals'}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

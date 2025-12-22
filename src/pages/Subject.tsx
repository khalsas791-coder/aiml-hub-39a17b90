import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  FileText,
  Loader2,
  FolderOpen,
  BookOpen,
  Trash2,
  FileQuestion
} from 'lucide-react';
import { toast } from 'sonner';

interface Resource {
  id: string;
  title: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
  created_at: string;
  resource_type: string;
}

const subjectNames: Record<string, string> = {
  mathematics: 'Mathematics',
  ddco: 'Digital Design & Computer Organization',
  dsa: 'Data Structures and Algorithms',
  java: 'Java Programming',
  os: 'Operating Systems',
};

export default function Subject() {
  const { semester, subjectId } = useParams<{ semester: string; subjectId: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [materials, setMaterials] = useState<Resource[]>([]);
  const [pyqs, setPyqs] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const isAdmin = role === 'admin';
  const subjectName = subjectId ? subjectNames[subjectId] || subjectId : 'Subject';

  useEffect(() => {
    fetchResources();
  }, [semester, subjectId]);

  const fetchResources = async () => {
    if (!semester || !subjectId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('semester', parseInt(semester))
        .eq('subject', subjectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const allResources = data || [];
      setMaterials(allResources.filter(r => r.resource_type === 'material'));
      setPyqs(allResources.filter(r => r.resource_type === 'pyq'));
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
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

      if (resource.resource_type === 'material') {
        setMaterials(materials.filter(r => r.id !== resource.id));
      } else {
        setPyqs(pyqs.filter(r => r.id !== resource.id));
      }
      toast.success('Resource deleted successfully');
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
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

  const ResourceList = ({ resources, emptyMessage }: { resources: Resource[]; emptyMessage: string }) => (
    <>
      {resources.length === 0 ? (
        <Card className="border-0 shadow-card bg-secondary/30">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-4">
              <FolderOpen className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">No Files Yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs">{emptyMessage}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {resources.map((resource, index) => (
            <Card 
              key={resource.id} 
              className="border-0 shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground line-clamp-2">{resource.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {formatFileSize(resource.file_size)}
                      </span>
                      <span className="text-muted-foreground">•</span>
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
                    className="flex-1 gap-2 rounded-xl"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleDownload(resource)}
                    className="flex-1 gap-2 rounded-xl"
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
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{resource.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(resource)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );

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
            <h1 className="text-lg font-semibold text-foreground line-clamp-1">{subjectName}</h1>
            <p className="text-sm text-muted-foreground">Semester {semester}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="materials" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-secondary/50 rounded-xl mb-6">
              <TabsTrigger 
                value="materials" 
                className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Materials
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{materials.length}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pyq"
                className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center gap-2"
              >
                <FileQuestion className="w-4 h-4" />
                PYQs
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{pyqs.length}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="materials">
              <ResourceList 
                resources={materials} 
                emptyMessage="Study materials will appear here once uploaded by admins." 
              />
            </TabsContent>

            <TabsContent value="pyq">
              <ResourceList 
                resources={pyqs} 
                emptyMessage="Past year question papers will appear here once uploaded by admins." 
              />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}

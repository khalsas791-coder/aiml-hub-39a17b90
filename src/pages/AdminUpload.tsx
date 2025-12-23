import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, FileUp, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const subjects = [
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'ddco', name: 'DDCO' },
  { id: 'dsa', name: 'DSA' },
  { id: 'java', name: 'Java' },
  { id: 'os', name: 'Operating Systems' },
];

export default function AdminUpload() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [form, setForm] = useState({
    semester: '',
    subject: '',
    title: '',
    resourceType: 'material',
    file: null as File | null,
  });

  // Check if user is admin
  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-0 shadow-elevated">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access this page. Only admins can upload resources.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="rounded-xl">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF and Word documents are allowed');
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      
      setForm({ ...form, file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.semester || !form.subject || !form.title || !form.file) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const fileExt = form.file.name.split('.').pop();
      const fileName = `${Date.now()}_${form.file.name}`;
      const folderPrefix = form.resourceType === 'pyq' ? 'pyq' : form.resourceType === 'lab_manual' ? 'lab-manuals' : 'materials';
      const filePath = `semester-${form.semester}/${form.subject}/${folderPrefix}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, form.file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('resources')
        .insert({
          title: form.title,
          semester: parseInt(form.semester),
          subject: form.subject,
          file_path: filePath,
          file_name: form.file.name,
          file_size: form.file.size,
          uploaded_by: user?.id,
          resource_type: form.resourceType,
        });

      if (dbError) throw dbError;

      setUploadSuccess(true);
      toast.success('Resource uploaded successfully!');
      
      setForm({
        semester: '',
        subject: '',
        title: '',
        resourceType: 'material',
        file: null,
      });
      
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload resource');
    } finally {
      setIsUploading(false);
    }
  };

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
            <h1 className="text-lg font-semibold text-foreground">Upload Resources</h1>
            <p className="text-sm text-muted-foreground">Add study materials or PYQs</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 max-w-lg mx-auto">
        <Card className="border-0 shadow-elevated animate-slide-up">
          <CardHeader>
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-2">
              <Upload className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle>Upload Resource</CardTitle>
            <CardDescription>
              Add PDF or Word documents for students to access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Resource Type */}
              <div className="space-y-2">
                <Label htmlFor="resourceType">Resource Type</Label>
                <Select 
                  value={form.resourceType} 
                  onValueChange={(value) => setForm({ ...form, resourceType: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="material">Study Material</SelectItem>
                    <SelectItem value="pyq">Past Year Question (PYQ)</SelectItem>
                    <SelectItem value="lab_manual">Lab Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Semester Selection */}
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select 
                  value={form.semester} 
                  onValueChange={(value) => setForm({ ...form, semester: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3rd Semester</SelectItem>
                    <SelectItem value="4">4th Semester</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject Selection */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={form.subject} 
                  onValueChange={(value) => setForm({ ...form, subject: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder={form.resourceType === 'pyq' ? 'e.g., VTU Dec 2023' : form.resourceType === 'lab_manual' ? 'e.g., DSA Lab Manual' : 'e.g., Module 1 - Introduction'}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file-upload">File</Label>
                <div className="relative">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors"
                  >
                    {form.file ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle className="w-8 h-8 text-primary mb-2" />
                        <span className="text-sm font-medium text-foreground">{form.file.name}</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {(form.file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <FileUp className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Click to upload PDF or Word</span>
                        <span className="text-xs text-muted-foreground mt-1">Max 50MB</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full rounded-xl"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : uploadSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Uploaded Successfully!
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Resource
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

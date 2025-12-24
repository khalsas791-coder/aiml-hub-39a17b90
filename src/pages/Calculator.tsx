import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calculator, Plus, Trash2, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import NetworkBackground from '@/components/NetworkBackground';
import appLogo from '@/assets/app-logo.png';

interface Subject {
  id: string;
  credits: number;
  grade: string;
}

interface Semester {
  id: string;
  sgpa: number;
  credits: number;
}

const gradePoints: Record<string, number> = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0,
};

export default function CalculatorPage() {
  const navigate = useNavigate();
  
  // SGPA State
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', credits: 4, grade: 'O' },
    { id: '2', credits: 4, grade: 'A+' },
    { id: '3', credits: 3, grade: 'A' },
  ]);
  const [sgpaResult, setSgpaResult] = useState<number | null>(null);

  // CGPA State
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', sgpa: 8.5, credits: 20 },
    { id: '2', sgpa: 8.0, credits: 22 },
  ]);
  const [cgpaResult, setCgpaResult] = useState<number | null>(null);

  const addSubject = () => {
    setSubjects([...subjects, { id: Date.now().toString(), credits: 4, grade: 'O' }]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id: string, field: 'credits' | 'grade', value: number | string) => {
    setSubjects(subjects.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const calculateSGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach(subject => {
      const gradePoint = gradePoints[subject.grade] || 0;
      totalCredits += subject.credits;
      totalPoints += subject.credits * gradePoint;
    });

    if (totalCredits === 0) {
      toast.error('Please add at least one subject');
      return;
    }

    const sgpa = totalPoints / totalCredits;
    setSgpaResult(Math.round(sgpa * 100) / 100);
    toast.success('SGPA calculated successfully!');
  };

  const addSemester = () => {
    setSemesters([...semesters, { id: Date.now().toString(), sgpa: 8.0, credits: 20 }]);
  };

  const removeSemester = (id: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(s => s.id !== id));
    }
  };

  const updateSemester = (id: string, field: 'sgpa' | 'credits', value: number) => {
    setSemesters(semesters.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const calculateCGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    semesters.forEach(semester => {
      totalCredits += semester.credits;
      totalPoints += semester.sgpa * semester.credits;
    });

    if (totalCredits === 0) {
      toast.error('Please add at least one semester');
      return;
    }

    const cgpa = totalPoints / totalCredits;
    setCgpaResult(Math.round(cgpa * 100) / 100);
    toast.success('CGPA calculated successfully!');
  };

  return (
    <div className="min-h-screen relative">
      <NetworkBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong">
        <div className="container flex items-center h-16 px-4 gap-4">
          <img src={appLogo} alt="AIML Logo" className="w-10 h-10 object-contain" />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="rounded-full hover:shadow-glow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground text-glow">VTU Calculator</h1>
            <p className="text-sm text-muted-foreground">CGPA & SGPA</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 max-w-2xl mx-auto relative z-10">
        <Card className="border-0 mb-6 overflow-hidden glow-border">
          <div className="gradient-primary p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-primary-foreground">VTU Grade Calculator</h2>
                <p className="text-primary-foreground/80 text-sm">Calculate your SGPA and CGPA as per VTU grading system</p>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="sgpa" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12 p-1 glass rounded-xl mb-6 border border-border/50">
            <TabsTrigger 
              value="sgpa" 
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow-sm transition-all"
            >
              SGPA
            </TabsTrigger>
            <TabsTrigger 
              value="cgpa"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow-sm transition-all"
            >
              CGPA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sgpa">
            <Card className="border-0 glass glow-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  SGPA Calculator
                </CardTitle>
                <CardDescription>
                  Enter your subjects with credits and grades to calculate SGPA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjects.map((subject, index) => (
                  <div key={subject.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-border/30">
                    <span className="text-sm font-mono font-medium text-primary w-8">
                      #{index + 1}
                    </span>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Credits</Label>
                        <Input
                          type="number"
                          min={1}
                          max={6}
                          value={subject.credits}
                          onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value) || 1)}
                          className="h-10 rounded-lg bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Grade</Label>
                        <Select
                          value={subject.grade}
                          onValueChange={(value) => updateSubject(subject.id, 'grade', value)}
                        >
                          <SelectTrigger className="h-10 rounded-lg bg-secondary/50 border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-strong border-border/50">
                            {Object.keys(gradePoints).map((grade) => (
                              <SelectItem key={grade} value={grade}>
                                {grade} ({gradePoints[grade]} points)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSubject(subject.id)}
                      disabled={subjects.length === 1}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addSubject}
                  className="w-full rounded-xl gap-2 border-border/50 hover:border-primary/50 hover:shadow-glow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Subject
                </Button>

                <Button
                  onClick={calculateSGPA}
                  className="w-full rounded-xl h-12 gradient-primary shadow-glow hover:shadow-glow transition-all"
                >
                  Calculate SGPA
                </Button>

                {sgpaResult !== null && (
                  <div className="p-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl text-center border border-primary/30 shadow-glow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Your SGPA</p>
                    <p className="text-4xl font-bold text-primary text-glow font-mono">{sgpaResult}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cgpa">
            <Card className="border-0 glass glow-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  CGPA Calculator
                </CardTitle>
                <CardDescription>
                  Enter your semester-wise SGPA and total credits to calculate CGPA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {semesters.map((semester, index) => (
                  <div key={semester.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-border/30">
                    <span className="text-sm font-mono font-medium text-primary w-16">
                      Sem {index + 1}
                    </span>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">SGPA</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          max={10}
                          value={semester.sgpa}
                          onChange={(e) => updateSemester(semester.id, 'sgpa', parseFloat(e.target.value) || 0)}
                          className="h-10 rounded-lg bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Credits</Label>
                        <Input
                          type="number"
                          min={1}
                          value={semester.credits}
                          onChange={(e) => updateSemester(semester.id, 'credits', parseInt(e.target.value) || 1)}
                          className="h-10 rounded-lg bg-secondary/50 border-border/50 focus:border-primary/50 focus:shadow-glow-sm transition-all"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSemester(semester.id)}
                      disabled={semesters.length === 1}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addSemester}
                  className="w-full rounded-xl gap-2 border-border/50 hover:border-primary/50 hover:shadow-glow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Semester
                </Button>

                <Button
                  onClick={calculateCGPA}
                  className="w-full rounded-xl h-12 gradient-primary shadow-glow hover:shadow-glow transition-all"
                >
                  Calculate CGPA
                </Button>

                {cgpaResult !== null && (
                  <div className="p-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl text-center border border-primary/30 shadow-glow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Your CGPA</p>
                    <p className="text-4xl font-bold text-primary text-glow font-mono">{cgpaResult}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Grade Reference */}
        <Card className="border-0 glass mt-6">
          <CardHeader>
            <CardTitle className="text-sm">VTU Grade Points Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 text-sm">
              {Object.entries(gradePoints).map(([grade, points]) => (
                <div key={grade} className="p-2 bg-secondary/30 rounded-lg text-center border border-border/30">
                  <span className="font-semibold text-primary">{grade}</span>
                  <span className="text-muted-foreground font-mono"> = {points}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
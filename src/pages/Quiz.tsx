import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NetworkBackground from '@/components/NetworkBackground';
import QuizLeaderboard from '@/components/QuizLeaderboard';
import { 
  ArrowLeft, 
  Brain, 
  CheckCircle2, 
  XCircle, 
  Trophy,
  Clock,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

const SUBJECT_NAMES: Record<string, string> = {
  mathematics: 'Mathematics',
  ddco: 'DDCO',
  dsa: 'Data Structures',
  java: 'Java',
  os: 'Operating Systems'
};

const SAMPLE_QUESTIONS: Record<string, Question[]> = {
  mathematics: [
    { id: '1', question: 'What is the derivative of x²?', options: ['x', '2x', '2x²', 'x/2'], correct_answer: 1 },
    { id: '2', question: 'What is the integral of 1/x?', options: ['x', 'ln|x|', '1/x²', 'e^x'], correct_answer: 1 },
    { id: '3', question: 'What is the value of e^0?', options: ['0', '1', 'e', 'undefined'], correct_answer: 1 },
    { id: '4', question: 'What is the Laplace transform of 1?', options: ['1/s', 's', '1', '1/s²'], correct_answer: 0 },
    { id: '5', question: 'What is the eigenvalue equation?', options: ['Av = λv', 'A = λI', 'Av = v', 'A = v'], correct_answer: 0 },
    { id: '6', question: 'What is the determinant of identity matrix?', options: ['0', '1', '-1', 'n'], correct_answer: 1 },
    { id: '7', question: 'What is ∫sin(x)dx?', options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], correct_answer: 1 },
    { id: '8', question: 'What is the Taylor series centered at?', options: ['0', 'a', '1', '∞'], correct_answer: 1 },
    { id: '9', question: 'What is lim(x→0) sin(x)/x?', options: ['0', '1', '∞', 'undefined'], correct_answer: 1 },
    { id: '10', question: 'What is the rank of a zero matrix?', options: ['1', '0', 'n', 'undefined'], correct_answer: 1 }
  ],
  ddco: [
    { id: '1', question: 'What is the basic building block of digital circuits?', options: ['Transistor', 'Capacitor', 'Resistor', 'Inductor'], correct_answer: 0 },
    { id: '2', question: 'What does ALU stand for?', options: ['Arithmetic Logic Unit', 'Array Logic Unit', 'Advanced Logic Unit', 'Analog Logic Unit'], correct_answer: 0 },
    { id: '3', question: 'How many bits are in a byte?', options: ['4', '8', '16', '32'], correct_answer: 1 },
    { id: '4', question: 'What is the purpose of a flip-flop?', options: ['Amplification', 'Memory storage', 'Logic operation', 'Signal conversion'], correct_answer: 1 },
    { id: '5', question: 'What is RISC?', options: ['Reduced Instruction Set Computer', 'Random Instruction Set Computer', 'Regular Instruction Set Computer', 'Rapid Instruction Set Computer'], correct_answer: 0 },
    { id: '6', question: 'What is the function of a multiplexer?', options: ['Add signals', 'Select one of many inputs', 'Store data', 'Convert analog to digital'], correct_answer: 1 },
    { id: '7', question: 'What is a half adder?', options: ['Adds two 1-bit numbers', 'Adds two 8-bit numbers', 'Subtracts numbers', 'Multiplies numbers'], correct_answer: 0 },
    { id: '8', question: 'What is the clock frequency unit?', options: ['Volt', 'Ampere', 'Hertz', 'Ohm'], correct_answer: 2 },
    { id: '9', question: 'What does CPU stand for?', options: ['Central Process Unit', 'Central Processing Unit', 'Computer Process Unit', 'Core Processing Unit'], correct_answer: 1 },
    { id: '10', question: 'What is cache memory?', options: ['Secondary storage', 'Fast temporary storage', 'Main memory', 'Virtual memory'], correct_answer: 1 }
  ],
  dsa: [
    { id: '1', question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct_answer: 1 },
    { id: '2', question: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Array', 'Tree'], correct_answer: 1 },
    { id: '3', question: 'What is the worst case complexity of quicksort?', options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'], correct_answer: 1 },
    { id: '4', question: 'Which traversal visits root first?', options: ['Inorder', 'Preorder', 'Postorder', 'Level order'], correct_answer: 1 },
    { id: '5', question: 'What is a complete binary tree?', options: ['All levels fully filled', 'All levels filled except possibly last', 'Only root exists', 'No children'], correct_answer: 1 },
    { id: '6', question: 'What is the space complexity of merge sort?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correct_answer: 1 },
    { id: '7', question: 'Which data structure uses FIFO?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correct_answer: 1 },
    { id: '8', question: 'What is a leaf node?', options: ['Root node', 'Node with no children', 'Node with one child', 'Parent node'], correct_answer: 1 },
    { id: '9', question: 'What is the height of empty tree?', options: ['0', '-1', '1', 'undefined'], correct_answer: 1 },
    { id: '10', question: 'What is Big O notation used for?', options: ['Memory usage', 'Time complexity', 'Both', 'Neither'], correct_answer: 2 }
  ],
  java: [
    { id: '1', question: 'What is Java?', options: ['Procedural language', 'Object-oriented language', 'Functional language', 'Assembly language'], correct_answer: 1 },
    { id: '2', question: 'What is JVM?', options: ['Java Variable Machine', 'Java Virtual Machine', 'Java Visual Machine', 'Java Version Machine'], correct_answer: 1 },
    { id: '3', question: 'What is inheritance in Java?', options: ['Creating new classes', 'Acquiring properties from parent class', 'Hiding data', 'Overloading methods'], correct_answer: 1 },
    { id: '4', question: 'What keyword is used to create an object?', options: ['class', 'new', 'object', 'create'], correct_answer: 1 },
    { id: '5', question: 'What is encapsulation?', options: ['Hiding implementation details', 'Multiple inheritance', 'Method overloading', 'Exception handling'], correct_answer: 0 },
    { id: '6', question: 'What is the default value of int in Java?', options: ['null', '0', '1', 'undefined'], correct_answer: 1 },
    { id: '7', question: 'What is polymorphism?', options: ['One name, many forms', 'Single inheritance', 'Data hiding', 'Exception handling'], correct_answer: 0 },
    { id: '8', question: 'Which keyword prevents inheritance?', options: ['static', 'final', 'private', 'abstract'], correct_answer: 1 },
    { id: '9', question: 'What is an interface in Java?', options: ['Concrete class', 'Abstract type', 'Variable type', 'Package'], correct_answer: 1 },
    { id: '10', question: 'What is the entry point of Java program?', options: ['start()', 'main()', 'run()', 'init()'], correct_answer: 1 }
  ],
  os: [
    { id: '1', question: 'What is an Operating System?', options: ['Hardware component', 'System software', 'Application software', 'Compiler'], correct_answer: 1 },
    { id: '2', question: 'What is a process?', options: ['A file', 'Program in execution', 'Hardware device', 'Memory location'], correct_answer: 1 },
    { id: '3', question: 'What is deadlock?', options: ['Process termination', 'Circular waiting for resources', 'Memory overflow', 'CPU overload'], correct_answer: 1 },
    { id: '4', question: 'What is virtual memory?', options: ['RAM', 'Memory extension technique', 'Cache memory', 'ROM'], correct_answer: 1 },
    { id: '5', question: 'What is a thread?', options: ['Heavy process', 'Lightweight process', 'File system', 'Memory block'], correct_answer: 1 },
    { id: '6', question: 'What is CPU scheduling?', options: ['Memory management', 'Allocating CPU to processes', 'File management', 'I/O operations'], correct_answer: 1 },
    { id: '7', question: 'What is paging?', options: ['Memory management scheme', 'CPU scheduling', 'File system', 'Process creation'], correct_answer: 0 },
    { id: '8', question: 'What is a semaphore?', options: ['Memory unit', 'Synchronization tool', 'Scheduling algorithm', 'File type'], correct_answer: 1 },
    { id: '9', question: 'What is FCFS?', options: ['First Come First Served', 'Fast CPU Fast Service', 'File Control File System', 'First Check First Start'], correct_answer: 0 },
    { id: '10', question: 'What is thrashing?', options: ['High CPU usage', 'Excessive paging', 'Process termination', 'Memory leak'], correct_answer: 1 }
  ]
};

export default function Quiz() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const subjectName = SUBJECT_NAMES[subjectId || ''] || subjectId;

  useEffect(() => {
    if (!user || !subjectId) return;

    // Check if already attempted today
    const checkAttempt = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('quiz_attempts')
        .select('score, total_questions')
        .eq('user_id', user.id)
        .eq('subject', subjectId)
        .eq('attempt_date', today)
        .maybeSingle();
      
      if (data) {
        setAlreadyAttempted(true);
        setPreviousScore(data.score);
      }
    };

    // Load questions (using sample for now)
    const loadQuestions = () => {
      const subjectQuestions = SAMPLE_QUESTIONS[subjectId] || [];
      // Shuffle and take 10
      const shuffled = [...subjectQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, 10));
      setAnswers(new Array(10).fill(null));
    };

    checkAttempt();
    loadQuestions();
  }, [user, subjectId]);

  // Timer
  useEffect(() => {
    if (quizCompleted || alreadyAttempted || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizCompleted, alreadyAttempted, questions.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = index;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(answers[currentIndex + 1]);
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedAnswer(answers[currentIndex - 1]);
      setShowResult(false);
    }
  };

  const handleSubmit = async () => {
    // Calculate score
    let finalScore = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct_answer) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setQuizCompleted(true);
    setShowResult(true);

    // Save attempt
    if (user && subjectId) {
      const today = new Date().toISOString().split('T')[0];
      await supabase
        .from('quiz_attempts')
        .upsert({
          user_id: user.id,
          subject: subjectId,
          score: finalScore,
          total_questions: questions.length,
          attempt_date: today
        }, {
          onConflict: 'user_id,subject,attempt_date'
        });

      // Update stats
      await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          quizzes_completed: 1,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      toast.success(`Quiz completed! Score: ${finalScore}/${questions.length}`);
    }
  };

  const currentQuestion = questions[currentIndex];

  if (alreadyAttempted) {
    return (
      <div className="min-h-screen relative">
        <NetworkBackground />
        <div className="container px-4 py-8 relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6 gap-2 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Card className="max-w-lg mx-auto glass border-0 glow-border">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Already Attempted Today!</h2>
              <p className="text-muted-foreground mb-4">
                You've already taken the {subjectName} quiz today.
              </p>
              <p className="text-2xl font-bold text-primary mb-6">
                Your Score: {previousScore}/10
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Come back tomorrow for new questions!
              </p>
              <Button onClick={() => navigate('/dashboard')} className="gradient-primary">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen relative">
        <NetworkBackground />
        <div className="container px-4 py-8 relative z-10">
          <Card className="max-w-lg mx-auto glass border-0 glow-border">
            <CardContent className="p-8 text-center">
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
                score >= 7 ? "bg-green-500/20" : score >= 5 ? "bg-yellow-500/20" : "bg-red-500/20"
              )}>
                <Trophy className={cn(
                  "w-10 h-10",
                  score >= 7 ? "text-green-400" : score >= 5 ? "text-yellow-400" : "text-red-400"
                )} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Complete!</h2>
              <p className="text-muted-foreground mb-4">{subjectName} Daily Quiz</p>
              
              <div className="text-5xl font-bold text-primary mb-2">
                {score}/{questions.length}
              </div>
              <p className="text-muted-foreground mb-6">
                {score >= 7 ? 'Excellent work!' : score >= 5 ? 'Good effort!' : 'Keep practicing!'}
              </p>

              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((q, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium",
                      answers[i] === q.correct_answer 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-red-500/20 text-red-400"
                    )}
                  >
                    {answers[i] === q.correct_answer ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>
                ))}
              </div>

              <Button onClick={() => navigate('/dashboard')} className="gradient-primary">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
          
          <QuizLeaderboard subjectId={subjectId || ''} />
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <NetworkBackground />
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <NetworkBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong">
        <div className="container flex items-center justify-between h-16 px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="gap-2 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Quiz
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full">
              <Clock className="w-4 h-4 text-primary" />
              <span className={cn(
                "font-mono font-medium",
                timeLeft < 60 ? "text-red-400" : "text-foreground"
              )}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {currentIndex + 1}/{questions.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 relative z-10">
        {/* Progress */}
        <div className="flex gap-1 mb-8">
          {questions.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-all",
                i === currentIndex 
                  ? "bg-primary" 
                  : answers[i] !== null 
                    ? "bg-primary/50" 
                    : "bg-secondary"
              )}
            />
          ))}
        </div>

        <Card className="max-w-2xl mx-auto glass border-0 glow-border">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-muted-foreground mb-2">
              Question {currentIndex + 1}
            </h2>
            <p className="text-xl font-medium text-foreground mb-6">
              {currentQuestion.question}
            </p>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={cn(
                    "w-full p-4 rounded-xl text-left transition-all border",
                    selectedAnswer === index
                      ? "bg-primary/20 border-primary text-foreground"
                      : "bg-secondary/30 border-transparent hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="font-medium mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="rounded-full"
              >
                Previous
              </Button>
              
              {currentIndex === questions.length - 1 ? (
                <Button 
                  onClick={handleSubmit}
                  className="gradient-primary rounded-full"
                  disabled={answers.includes(null)}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button 
                  onClick={handleNext}
                  className="gradient-primary rounded-full"
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

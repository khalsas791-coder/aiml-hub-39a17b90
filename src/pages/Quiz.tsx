import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NetworkBackground from '@/components/NetworkBackground';
import QuizLeaderboard from '@/components/QuizLeaderboard';
import appLogo from '@/assets/app-logo.png';
import { 
  ArrowLeft, 
  Brain, 
  CheckCircle2, 
  XCircle, 
  Trophy,
  Clock,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  solution?: string;
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
    { id: '1', question: 'What is the derivative of x²?', options: ['x', '2x', '2x²', 'x/2'], correct_answer: 1, solution: 'Using the power rule: d/dx(xⁿ) = n·xⁿ⁻¹. So d/dx(x²) = 2·x¹ = 2x' },
    { id: '2', question: 'What is the integral of 1/x?', options: ['x', 'ln|x|', '1/x²', 'e^x'], correct_answer: 1, solution: 'The antiderivative of 1/x is the natural logarithm: ∫(1/x)dx = ln|x| + C' },
    { id: '3', question: 'What is the value of e^0?', options: ['0', '1', 'e', 'undefined'], correct_answer: 1, solution: 'Any number raised to power 0 equals 1. Therefore e⁰ = 1' },
    { id: '4', question: 'What is the Laplace transform of 1?', options: ['1/s', 's', '1', '1/s²'], correct_answer: 0, solution: 'L{1} = ∫₀^∞ e^(-st)·1 dt = [-e^(-st)/s]₀^∞ = 1/s for s > 0' },
    { id: '5', question: 'What is the eigenvalue equation?', options: ['Av = λv', 'A = λI', 'Av = v', 'A = v'], correct_answer: 0, solution: 'The eigenvalue equation is Av = λv, where A is a matrix, v is an eigenvector, and λ is the corresponding eigenvalue.' },
    { id: '6', question: 'What is the determinant of identity matrix?', options: ['0', '1', '-1', 'n'], correct_answer: 1, solution: 'The identity matrix has 1s on the diagonal and 0s elsewhere. Its determinant is always 1 regardless of size.' },
    { id: '7', question: 'What is ∫sin(x)dx?', options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], correct_answer: 1, solution: 'The antiderivative of sin(x) is -cos(x) + C because d/dx(-cos(x)) = sin(x)' },
    { id: '8', question: 'What is the Taylor series centered at?', options: ['0', 'a', '1', '∞'], correct_answer: 1, solution: 'Taylor series is centered at point "a". When a=0, it is specifically called Maclaurin series.' },
    { id: '9', question: 'What is lim(x→0) sin(x)/x?', options: ['0', '1', '∞', 'undefined'], correct_answer: 1, solution: 'This is a famous limit. Using L\'Hôpital\'s rule or geometric proof: lim(x→0) sin(x)/x = 1' },
    { id: '10', question: 'What is the rank of a zero matrix?', options: ['1', '0', 'n', 'undefined'], correct_answer: 1, solution: 'A zero matrix has no non-zero rows, so its rank is 0.' }
  ],
  ddco: [
    { id: '1', question: 'What is the basic building block of digital circuits?', options: ['Transistor', 'Capacitor', 'Resistor', 'Inductor'], correct_answer: 0, solution: 'Transistors are the fundamental building blocks. They act as switches and amplifiers in digital circuits.' },
    { id: '2', question: 'What does ALU stand for?', options: ['Arithmetic Logic Unit', 'Array Logic Unit', 'Advanced Logic Unit', 'Analog Logic Unit'], correct_answer: 0, solution: 'ALU stands for Arithmetic Logic Unit - it performs arithmetic and logical operations in a CPU.' },
    { id: '3', question: 'How many bits are in a byte?', options: ['4', '8', '16', '32'], correct_answer: 1, solution: 'A byte consists of 8 bits. 4 bits make a nibble, and 8 bits make a byte.' },
    { id: '4', question: 'What is the purpose of a flip-flop?', options: ['Amplification', 'Memory storage', 'Logic operation', 'Signal conversion'], correct_answer: 1, solution: 'Flip-flops are bistable circuits that store 1 bit of data. They are basic memory elements.' },
    { id: '5', question: 'What is RISC?', options: ['Reduced Instruction Set Computer', 'Random Instruction Set Computer', 'Regular Instruction Set Computer', 'Rapid Instruction Set Computer'], correct_answer: 0, solution: 'RISC = Reduced Instruction Set Computer. It uses simple, fixed-length instructions for faster execution.' },
    { id: '6', question: 'What is the function of a multiplexer?', options: ['Add signals', 'Select one of many inputs', 'Store data', 'Convert analog to digital'], correct_answer: 1, solution: 'A multiplexer (MUX) selects one of many input signals and forwards it to a single output line.' },
    { id: '7', question: 'What is a half adder?', options: ['Adds two 1-bit numbers', 'Adds two 8-bit numbers', 'Subtracts numbers', 'Multiplies numbers'], correct_answer: 0, solution: 'A half adder adds two 1-bit numbers and produces a sum and carry. It uses XOR and AND gates.' },
    { id: '8', question: 'What is the clock frequency unit?', options: ['Volt', 'Ampere', 'Hertz', 'Ohm'], correct_answer: 2, solution: 'Clock frequency is measured in Hertz (Hz). Modern CPUs operate in GHz (billions of cycles per second).' },
    { id: '9', question: 'What does CPU stand for?', options: ['Central Process Unit', 'Central Processing Unit', 'Computer Process Unit', 'Core Processing Unit'], correct_answer: 1, solution: 'CPU = Central Processing Unit. It is the brain of the computer that executes instructions.' },
    { id: '10', question: 'What is cache memory?', options: ['Secondary storage', 'Fast temporary storage', 'Main memory', 'Virtual memory'], correct_answer: 1, solution: 'Cache is a small, fast memory between CPU and RAM that stores frequently used data for quick access.' }
  ],
  dsa: [
    { id: '1', question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct_answer: 1, solution: 'Binary search halves the search space each time, resulting in O(log n) time complexity.' },
    { id: '2', question: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Array', 'Tree'], correct_answer: 1, solution: 'Stack uses Last In First Out (LIFO) - the last element added is the first to be removed.' },
    { id: '3', question: 'What is the worst case complexity of quicksort?', options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'], correct_answer: 1, solution: 'Quicksort\'s worst case is O(n²) when the pivot is always the smallest or largest element.' },
    { id: '4', question: 'Which traversal visits root first?', options: ['Inorder', 'Preorder', 'Postorder', 'Level order'], correct_answer: 1, solution: 'Preorder traversal visits: Root → Left → Right. The root is visited first.' },
    { id: '5', question: 'What is a complete binary tree?', options: ['All levels fully filled', 'All levels filled except possibly last', 'Only root exists', 'No children'], correct_answer: 1, solution: 'A complete binary tree has all levels filled except possibly the last, which is filled left to right.' },
    { id: '6', question: 'What is the space complexity of merge sort?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correct_answer: 1, solution: 'Merge sort requires O(n) auxiliary space for the temporary arrays during merging.' },
    { id: '7', question: 'Which data structure uses FIFO?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correct_answer: 1, solution: 'Queue uses First In First Out (FIFO) - elements are removed in the order they were added.' },
    { id: '8', question: 'What is a leaf node?', options: ['Root node', 'Node with no children', 'Node with one child', 'Parent node'], correct_answer: 1, solution: 'A leaf node (external node) is a node that has no children - it is at the end of a branch.' },
    { id: '9', question: 'What is the height of empty tree?', options: ['0', '-1', '1', 'undefined'], correct_answer: 1, solution: 'By convention, the height of an empty tree is -1. A single node tree has height 0.' },
    { id: '10', question: 'What is Big O notation used for?', options: ['Memory usage', 'Time complexity', 'Both', 'Neither'], correct_answer: 2, solution: 'Big O notation describes the upper bound of both time and space complexity of algorithms.' }
  ],
  java: [
    { id: '1', question: 'What is Java?', options: ['Procedural language', 'Object-oriented language', 'Functional language', 'Assembly language'], correct_answer: 1, solution: 'Java is primarily an object-oriented programming language, though it also supports functional features since Java 8.' },
    { id: '2', question: 'What is JVM?', options: ['Java Variable Machine', 'Java Virtual Machine', 'Java Visual Machine', 'Java Version Machine'], correct_answer: 1, solution: 'JVM = Java Virtual Machine. It executes Java bytecode and provides platform independence.' },
    { id: '3', question: 'What is inheritance in Java?', options: ['Creating new classes', 'Acquiring properties from parent class', 'Hiding data', 'Overloading methods'], correct_answer: 1, solution: 'Inheritance allows a class to inherit properties and methods from a parent class using "extends" keyword.' },
    { id: '4', question: 'What keyword is used to create an object?', options: ['class', 'new', 'object', 'create'], correct_answer: 1, solution: 'The "new" keyword is used to create objects: Object obj = new Object();' },
    { id: '5', question: 'What is encapsulation?', options: ['Hiding implementation details', 'Multiple inheritance', 'Method overloading', 'Exception handling'], correct_answer: 0, solution: 'Encapsulation is bundling data and methods together while hiding internal details using access modifiers.' },
    { id: '6', question: 'What is the default value of int in Java?', options: ['null', '0', '1', 'undefined'], correct_answer: 1, solution: 'Primitive int has default value 0. Only reference types have default value null.' },
    { id: '7', question: 'What is polymorphism?', options: ['One name, many forms', 'Single inheritance', 'Data hiding', 'Exception handling'], correct_answer: 0, solution: 'Polymorphism means "many forms" - same method name can behave differently based on the object.' },
    { id: '8', question: 'Which keyword prevents inheritance?', options: ['static', 'final', 'private', 'abstract'], correct_answer: 1, solution: 'The "final" keyword prevents a class from being inherited: final class ClassName {}' },
    { id: '9', question: 'What is an interface in Java?', options: ['Concrete class', 'Abstract type', 'Variable type', 'Package'], correct_answer: 1, solution: 'An interface is an abstract type that defines a contract of methods that implementing classes must provide.' },
    { id: '10', question: 'What is the entry point of Java program?', options: ['start()', 'main()', 'run()', 'init()'], correct_answer: 1, solution: 'The main() method is the entry point: public static void main(String[] args) {}' }
  ],
  os: [
    { id: '1', question: 'What is an Operating System?', options: ['Hardware component', 'System software', 'Application software', 'Compiler'], correct_answer: 1, solution: 'An OS is system software that manages hardware resources and provides services to applications.' },
    { id: '2', question: 'What is a process?', options: ['A file', 'Program in execution', 'Hardware device', 'Memory location'], correct_answer: 1, solution: 'A process is a program in execution, including its code, data, stack, and system resources.' },
    { id: '3', question: 'What is deadlock?', options: ['Process termination', 'Circular waiting for resources', 'Memory overflow', 'CPU overload'], correct_answer: 1, solution: 'Deadlock occurs when processes are waiting for resources held by each other in a circular chain.' },
    { id: '4', question: 'What is virtual memory?', options: ['RAM', 'Memory extension technique', 'Cache memory', 'ROM'], correct_answer: 1, solution: 'Virtual memory uses disk space to extend RAM, allowing programs larger than physical memory to run.' },
    { id: '5', question: 'What is a thread?', options: ['Heavy process', 'Lightweight process', 'File system', 'Memory block'], correct_answer: 1, solution: 'A thread is a lightweight process - the smallest unit of execution within a process.' },
    { id: '6', question: 'What is CPU scheduling?', options: ['Memory management', 'Allocating CPU to processes', 'File management', 'I/O operations'], correct_answer: 1, solution: 'CPU scheduling determines which process runs on the CPU and for how long.' },
    { id: '7', question: 'What is paging?', options: ['Memory management scheme', 'CPU scheduling', 'File system', 'Process creation'], correct_answer: 0, solution: 'Paging divides memory into fixed-size pages, eliminating external fragmentation.' },
    { id: '8', question: 'What is a semaphore?', options: ['Memory unit', 'Synchronization tool', 'Scheduling algorithm', 'File type'], correct_answer: 1, solution: 'A semaphore is a synchronization tool that controls access to shared resources using wait() and signal().' },
    { id: '9', question: 'What is FCFS?', options: ['First Come First Served', 'Fast CPU Fast Service', 'File Control File System', 'First Check First Start'], correct_answer: 0, solution: 'FCFS = First Come First Served. Processes are executed in the order they arrive.' },
    { id: '10', question: 'What is thrashing?', options: ['High CPU usage', 'Excessive paging', 'Process termination', 'Memory leak'], correct_answer: 1, solution: 'Thrashing occurs when the system spends more time paging than executing, causing performance degradation.' }
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
  const [showSolutions, setShowSolutions] = useState(false);
  const [userUsn, setUserUsn] = useState<string | null>(null);

  const subjectName = SUBJECT_NAMES[subjectId || ''] || subjectId;

  useEffect(() => {
    if (!user || !subjectId) return;

    // Check if already attempted today and fetch user's USN
    const checkAttemptAndProfile = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch user profile for USN
      const { data: profile } = await supabase
        .from('profiles')
        .select('usn')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (profile?.usn) {
        setUserUsn(profile.usn);
      }
      
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

    checkAttemptAndProfile();
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
          <Card className="max-w-2xl mx-auto glass border-0 glow-border">
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

              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSolutions(!showSolutions)} 
                  className="rounded-full"
                >
                  {showSolutions ? 'Hide Solutions' : 'View Solutions'}
                </Button>
                <Button onClick={() => navigate('/dashboard')} className="gradient-primary rounded-full">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Solutions Section */}
          {showSolutions && (
            <Card className="max-w-2xl mx-auto mt-6 glass border-0 glow-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Answers & Solutions
                </h3>
                <div className="space-y-4">
                  {questions.map((q, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "p-4 rounded-xl border",
                        answers[i] === q.correct_answer 
                          ? "bg-green-500/5 border-green-500/20" 
                          : "bg-red-500/5 border-red-500/20"
                      )}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                          answers[i] === q.correct_answer 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-red-500/20 text-red-400"
                        )}>
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-foreground mb-2">{q.question}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            {q.options.map((option, optIndex) => (
                              <div 
                                key={optIndex}
                                className={cn(
                                  "px-3 py-2 rounded-lg text-sm",
                                  optIndex === q.correct_answer 
                                    ? "bg-green-500/20 text-green-400 font-medium"
                                    : answers[i] === optIndex 
                                      ? "bg-red-500/20 text-red-400"
                                      : "bg-secondary/30 text-muted-foreground"
                                )}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
                                {optIndex === q.correct_answer && " ✓"}
                              </div>
                            ))}
                          </div>
                          {q.solution && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-primary">Solution: </span>
                                {q.solution}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
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
          <div className="flex items-center gap-3">
            <img src={appLogo} alt="AIML Logo" className="w-10 h-10 object-contain" />
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="gap-2 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit Quiz
            </Button>
          </div>
          
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

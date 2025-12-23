import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  usn: string;
  score: number;
  total: number;
  isCurrentUser: boolean;
}

interface QuizLeaderboardProps {
  subjectId: string;
}

export default function QuizLeaderboard({ subjectId }: QuizLeaderboardProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's quiz attempts for this subject
      const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select('user_id, score, total_questions')
        .eq('subject', subjectId)
        .eq('attempt_date', today)
        .order('score', { ascending: false })
        .limit(10);

      if (!attempts || attempts.length === 0) {
        setLeaderboard([]);
        setLoading(false);
        return;
      }

      // Make leaderboard anonymous - only show "You" for current user
      const leaderboardData: LeaderboardEntry[] = attempts.map((attempt, index) => ({
        rank: index + 1,
        usn: attempt.user_id === user?.id ? 'You' : `Student #${index + 1}`,
        score: attempt.score,
        total: attempt.total_questions,
        isCurrentUser: attempt.user_id === user?.id,
      }));

      setLeaderboard(leaderboardData);
      setLoading(false);
    };

    fetchLeaderboard();
  }, [subjectId, user?.id]);

  const getRankDisplay = (rank: number) => {
    const rankColors = {
      1: 'text-yellow-500 font-bold',
      2: 'text-gray-400 font-bold',
      3: 'text-amber-600 font-bold',
    };
    
    return (
      <span className={cn(
        "text-lg",
        rankColors[rank as keyof typeof rankColors] || 'text-muted-foreground font-medium'
      )}>
        #{rank}
      </span>
    );
  };

  if (loading) {
    return (
      <Card className="glass border-0 mt-6">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
        </CardContent>
      </Card>
    );
  }

  if (leaderboard.length === 0) {
    return null;
  }

  return (
    <Card className="glass border-0 glow-border mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          {t('quiz.leaderboard')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
            <span>{t('quiz.rank')}</span>
            <span>Participant</span>
            <span className="text-right">{t('quiz.score')}</span>
          </div>
          
          {/* Entries */}
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={cn(
                "grid grid-cols-3 gap-4 px-3 py-3 rounded-lg transition-all",
                entry.isCurrentUser ? "bg-primary/20 border border-primary/30" :
                entry.rank === 1 ? "bg-yellow-500/10" : 
                entry.rank === 2 ? "bg-gray-500/10" :
                entry.rank === 3 ? "bg-amber-600/10" : "bg-secondary/30"
              )}
            >
              <div className="flex items-center">
                {getRankDisplay(entry.rank)}
              </div>
              <span className={cn(
                "font-medium",
                entry.isCurrentUser ? "text-primary font-bold" : "text-foreground"
              )}>
                {entry.usn}
              </span>
              <span className="text-right font-bold text-primary">
                {entry.score}/{entry.total}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

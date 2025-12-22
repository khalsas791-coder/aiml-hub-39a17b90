import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  usn: string;
  score: number;
  total: number;
}

interface QuizLeaderboardProps {
  subjectId: string;
}

export default function QuizLeaderboard({ subjectId }: QuizLeaderboardProps) {
  const { t } = useLanguage();
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

      // Fetch USNs for these users
      const userIds = attempts.map(a => a.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, usn')
        .in('user_id', userIds);

      const usnMap = new Map(profiles?.map(p => [p.user_id, p.usn || 'Unknown']) || []);

      const leaderboardData: LeaderboardEntry[] = attempts.map((attempt, index) => ({
        rank: index + 1,
        usn: usnMap.get(attempt.user_id) || 'Unknown',
        score: attempt.score,
        total: attempt.total_questions,
      }));

      setLeaderboard(leaderboardData);
      setLoading(false);
    };

    fetchLeaderboard();
  }, [subjectId]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
    }
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
            <span>{t('quiz.usn')}</span>
            <span className="text-right">{t('quiz.score')}</span>
          </div>
          
          {/* Entries */}
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={cn(
                "grid grid-cols-3 gap-4 px-3 py-3 rounded-lg transition-all",
                entry.rank === 1 ? "bg-yellow-500/10" : 
                entry.rank === 2 ? "bg-gray-500/10" :
                entry.rank === 3 ? "bg-amber-600/10" : "bg-secondary/30"
              )}
            >
              <div className="flex items-center gap-2">
                {getRankIcon(entry.rank)}
              </div>
              <span className="font-medium text-foreground">{entry.usn}</span>
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

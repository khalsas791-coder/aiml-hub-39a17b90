import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  displayName: string;
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
  const [currentUserUsn, setCurrentUserUsn] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch current user's USN
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('usn')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (profile?.usn) {
          setCurrentUserUsn(profile.usn);
        }
      }
      
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

      // Fetch USNs for all users in leaderboard
      const userIds = attempts.map(a => a.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, usn')
        .in('user_id', userIds);

      const usnMap = new Map(profiles?.map(p => [p.user_id, p.usn]) || []);

      // Build leaderboard with anonymous display
      const leaderboardData: LeaderboardEntry[] = attempts.map((attempt, index) => {
        const isCurrentUser = attempt.user_id === user?.id;
        const usn = usnMap.get(attempt.user_id);
        
        return {
          rank: index + 1,
          displayName: isCurrentUser && usn ? usn : `Participant #${index + 1}`,
          score: attempt.score,
          total: attempt.total_questions,
          isCurrentUser,
        };
      });

      setLeaderboard(leaderboardData);
      setLoading(false);
    };

    fetchLeaderboard();
  }, [subjectId, user?.id]);

  const getRankDisplay = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center gap-1">
          <Medal className="w-5 h-5 text-yellow-500" />
          <span className="text-yellow-500 font-bold text-lg">#1</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center gap-1">
          <Medal className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400 font-bold text-lg">#2</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center gap-1">
          <Medal className="w-5 h-5 text-amber-600" />
          <span className="text-amber-600 font-bold text-lg">#3</span>
        </div>
      );
    }
    return (
      <span className="text-muted-foreground font-medium text-lg">#{rank}</span>
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
    <Card className="glass border-0 glow-border mt-6 max-w-2xl mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Today's Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
            <span>Rank</span>
            <span>Participant</span>
            <span className="text-right">Score</span>
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
                "font-medium flex items-center",
                entry.isCurrentUser ? "text-primary font-bold" : "text-foreground"
              )}>
                {entry.displayName}
                {entry.isCurrentUser && (
                  <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">You</span>
                )}
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

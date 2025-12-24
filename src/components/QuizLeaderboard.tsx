import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Calendar, CalendarDays } from 'lucide-react';
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
  const [dailyLeaderboard, setDailyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      setLoading(true);
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      // Calculate week start (Monday)
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() + mondayOffset);
      const weekStartStr = weekStart.toISOString().split('T')[0];
      
      // Fetch daily attempts
      const { data: dailyAttempts } = await supabase
        .from('quiz_attempts')
        .select('user_id, score, total_questions')
        .eq('subject', subjectId)
        .eq('attempt_date', todayStr)
        .order('score', { ascending: false })
        .limit(10);

      // Fetch weekly attempts (all subjects)
      const { data: weeklyAttempts } = await supabase
        .from('quiz_attempts')
        .select('user_id, score, total_questions')
        .gte('attempt_date', weekStartStr)
        .lte('attempt_date', todayStr);

      // Get all unique user IDs
      const allUserIds = new Set<string>();
      dailyAttempts?.forEach(a => allUserIds.add(a.user_id));
      weeklyAttempts?.forEach(a => allUserIds.add(a.user_id));

      // Fetch USNs for all users
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, usn')
        .in('user_id', Array.from(allUserIds));

      const usnMap = new Map(profiles?.map(p => [p.user_id, p.usn]) || []);

      // Build daily leaderboard
      if (dailyAttempts && dailyAttempts.length > 0) {
        const dailyData: LeaderboardEntry[] = dailyAttempts.map((attempt, index) => {
          const isCurrentUser = attempt.user_id === user?.id;
          const usn = usnMap.get(attempt.user_id);
          
          return {
            rank: index + 1,
            displayName: usn || `User ${index + 1}`,
            score: attempt.score,
            total: attempt.total_questions,
            isCurrentUser,
          };
        });
        setDailyLeaderboard(dailyData);
      } else {
        setDailyLeaderboard([]);
      }

      // Aggregate weekly scores by user (across all subjects)
      if (weeklyAttempts && weeklyAttempts.length > 0) {
        const userScores = new Map<string, { total: number; questions: number }>();
        
        weeklyAttempts.forEach(attempt => {
          const existing = userScores.get(attempt.user_id) || { total: 0, questions: 0 };
          userScores.set(attempt.user_id, {
            total: existing.total + attempt.score,
            questions: existing.questions + attempt.total_questions,
          });
        });

        // Sort by total score
        const sortedUsers = Array.from(userScores.entries())
          .sort((a, b) => b[1].total - a[1].total)
          .slice(0, 10);

        const weeklyData: LeaderboardEntry[] = sortedUsers.map(([userId, data], index) => {
          const isCurrentUser = userId === user?.id;
          const usn = usnMap.get(userId);
          
          return {
            rank: index + 1,
            displayName: usn || `User ${index + 1}`,
            score: data.total,
            total: data.questions,
            isCurrentUser,
          };
        });
        setWeeklyLeaderboard(weeklyData);
      } else {
        setWeeklyLeaderboard([]);
      }

      setLoading(false);
    };

    fetchLeaderboards();
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

  const renderLeaderboard = (entries: LeaderboardEntry[], emptyMessage: string) => {
    if (entries.length === 0) {
      return (
        <div className="text-center py-6 text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-3 gap-4 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
          <span>Rank</span>
          <span>Participant</span>
          <span className="text-right">Score</span>
        </div>
        
        {/* Entries */}
        {entries.map((entry) => (
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
    );
  };

  if (loading) {
    return (
      <Card className="glass border-0 mt-6 max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
        </CardContent>
      </Card>
    );
  }

  if (dailyLeaderboard.length === 0 && weeklyLeaderboard.length === 0) {
    return null;
  }

  return (
    <Card className="glass border-0 glow-border mt-6 max-w-2xl mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="daily" className="gap-2">
              <Calendar className="w-4 h-4" />
              Today
            </TabsTrigger>
            <TabsTrigger value="weekly" className="gap-2">
              <CalendarDays className="w-4 h-4" />
              This Week
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily">
            {renderLeaderboard(dailyLeaderboard, "No quiz attempts today. Be the first!")}
          </TabsContent>
          
          <TabsContent value="weekly">
            {renderLeaderboard(weeklyLeaderboard, "No quiz attempts this week yet.")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

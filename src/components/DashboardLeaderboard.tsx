import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  totalScore: number;
  totalQuestions: number;
  quizCount: number;
  isCurrentUser: boolean;
}

export default function DashboardLeaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's quiz attempts across all subjects
      const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select('user_id, score, total_questions')
        .eq('attempt_date', today);

      if (!attempts || attempts.length === 0) {
        setLeaderboard([]);
        setLoading(false);
        return;
      }

      // Aggregate scores by user
      const userScores = new Map<string, { total: number; questions: number; count: number }>();
      
      attempts.forEach(attempt => {
        const existing = userScores.get(attempt.user_id) || { total: 0, questions: 0, count: 0 };
        userScores.set(attempt.user_id, {
          total: existing.total + attempt.score,
          questions: existing.questions + attempt.total_questions,
          count: existing.count + 1,
        });
      });

      // Get all user IDs
      const userIds = Array.from(userScores.keys());

      // Fetch USNs for all users
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, usn')
        .in('user_id', userIds);

      const usnMap = new Map(profiles?.map(p => [p.user_id, p.usn]) || []);

      // Sort by total score and build leaderboard
      const sortedUsers = Array.from(userScores.entries())
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 5);

      const leaderboardData: LeaderboardEntry[] = sortedUsers.map(([userId, data], index) => {
        const isCurrentUser = userId === user?.id;
        const usn = usnMap.get(userId);
        
        return {
          rank: index + 1,
          displayName: usn || `User ${index + 1}`,
          totalScore: data.total,
          totalQuestions: data.questions,
          quizCount: data.count,
          isCurrentUser,
        };
      });

      setLeaderboard(leaderboardData);
      setLoading(false);
    };

    fetchLeaderboard();
  }, [user?.id]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return null;
  };

  if (loading) {
    return (
      <Card className="border shadow-md dark:border-0 dark:glass animate-pulse">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Today's Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-secondary/30 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card className="border shadow-md dark:border-0 dark:glass">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Today's Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No quiz attempts today yet.</p>
            <p className="text-xs">Be the first to take a quiz!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-md dark:border-0 dark:glass dark:glow-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Today's Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-all",
                entry.isCurrentUser ? "bg-primary/20 border border-primary/30" :
                entry.rank === 1 ? "bg-yellow-500/10" : 
                entry.rank === 2 ? "bg-gray-500/10" :
                entry.rank === 3 ? "bg-amber-600/10" : "bg-secondary/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-8">
                  {getRankIcon(entry.rank)}
                  <span className={cn(
                    "font-bold text-sm",
                    entry.rank === 1 ? "text-yellow-500" :
                    entry.rank === 2 ? "text-gray-400" :
                    entry.rank === 3 ? "text-amber-600" : "text-muted-foreground"
                  )}>
                    #{entry.rank}
                  </span>
                </div>
                <div>
                  <span className={cn(
                    "font-medium text-sm",
                    entry.isCurrentUser ? "text-primary" : "text-foreground"
                  )}>
                    {entry.displayName}
                  </span>
                  {entry.isCurrentUser && (
                    <span className="ml-2 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">You</span>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {entry.quizCount} quiz{entry.quizCount > 1 ? 'zes' : ''}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-primary text-sm">
                  {entry.totalScore}/{entry.totalQuestions}
                </span>
                <p className="text-xs text-muted-foreground">
                  {Math.round((entry.totalScore / entry.totalQuestions) * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

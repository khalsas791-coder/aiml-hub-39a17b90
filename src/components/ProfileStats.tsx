import { useState, useEffect } from 'react';
import { BookOpen, Brain, Target, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  resources_viewed: number;
  resources_growth: number;
  resources_period: string;
  quizzes_completed: number;
  quizzes_growth: number;
  quizzes_period: string;
  subjects_explored: number;
  subjects_growth: number;
  subjects_period: string;
  study_streak: number;
}

export default function ProfileStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    resources_viewed: 0,
    resources_growth: 0,
    resources_period: 'this week',
    quizzes_completed: 0,
    quizzes_growth: 0,
    quizzes_period: 'this month',
    subjects_explored: 0,
    subjects_growth: 0,
    subjects_period: 'this week',
    study_streak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('dashboard-stats');
        
        if (error) {
          console.error('Error fetching dashboard stats:', error);
          // Fallback to legacy user_stats
          const { data: legacyData } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (legacyData) {
            setStats({
              resources_viewed: legacyData.resources_viewed || 0,
              resources_growth: 0,
              resources_period: 'this week',
              quizzes_completed: legacyData.quizzes_completed || 0,
              quizzes_growth: 0,
              quizzes_period: 'this month',
              subjects_explored: legacyData.subjects_explored || 0,
              subjects_growth: 0,
              subjects_period: 'this week',
              study_streak: legacyData.study_streak || 0
            });
          }
        } else if (data) {
          setStats(data);
        }
      } catch (err) {
        console.error('Error in fetchStats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const formatGrowth = (growth: number, period: string) => {
    if (growth > 0) return `+${growth} ${period}`;
    if (growth < 0) return `${growth} ${period}`;
    return `No change ${period}`;
  };

  const statCards = [
    { 
      label: 'Resources Viewed', 
      value: stats.resources_viewed, 
      icon: BookOpen, 
      bgClass: 'bg-[hsl(var(--stat-blue-bg))]',
      iconClass: 'text-[hsl(var(--stat-blue-icon))]',
      change: formatGrowth(stats.resources_growth, stats.resources_period),
      isPositive: stats.resources_growth >= 0
    },
    { 
      label: 'Quizzes Completed', 
      value: stats.quizzes_completed, 
      icon: Brain, 
      bgClass: 'bg-[hsl(var(--stat-green-bg))]',
      iconClass: 'text-[hsl(var(--stat-green-icon))]',
      change: formatGrowth(stats.quizzes_growth, stats.quizzes_period),
      isPositive: stats.quizzes_growth >= 0
    },
    { 
      label: 'Subjects Explored', 
      value: stats.subjects_explored, 
      icon: Target, 
      bgClass: 'bg-[hsl(var(--stat-purple-bg))]',
      iconClass: 'text-[hsl(var(--stat-purple-icon))]',
      change: formatGrowth(stats.subjects_growth, stats.subjects_period),
      isPositive: stats.subjects_growth >= 0
    },
    { 
      label: 'Study Streak', 
      value: `${stats.study_streak} days`, 
      icon: TrendingUp, 
      bgClass: 'bg-[hsl(var(--stat-orange-bg))]',
      iconClass: 'text-[hsl(var(--stat-orange-icon))]',
      change: stats.study_streak > 0 ? 'Keep it up!' : 'Start today!',
      isPositive: true
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="p-4 glass border-0 animate-pulse">
            <div className="h-16 bg-secondary/50 rounded-lg" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <Card 
          key={stat.label}
          className="p-4 border shadow-md hover:shadow-lg dark:glass dark:border-0 dark:hover:shadow-glow-sm transition-all animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className={`text-xs mt-1 ${stat.isPositive ? 'text-primary' : 'text-destructive'}`}>
                {stat.isPositive ? '↑' : '↓'} {stat.change}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bgClass}`}>
              <stat.icon className={`w-5 h-5 ${stat.iconClass}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

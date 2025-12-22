import { useState, useEffect } from 'react';
import { BookOpen, Brain, Target, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Stats {
  resources_viewed: number;
  quizzes_completed: number;
  subjects_explored: number;
  study_streak: number;
}

export default function ProfileStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    resources_viewed: 0,
    quizzes_completed: 0,
    subjects_explored: 0,
    study_streak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const { data } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data) {
        setStats({
          resources_viewed: data.resources_viewed || 0,
          quizzes_completed: data.quizzes_completed || 0,
          subjects_explored: data.subjects_explored || 0,
          study_streak: data.study_streak || 0
        });
      } else {
        // Create initial stats
        await supabase
          .from('user_stats')
          .insert({ user_id: user.id });
      }
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  const statCards = [
    { 
      label: 'Resources Viewed', 
      value: stats.resources_viewed, 
      icon: BookOpen, 
      color: 'bg-blue-500/20 text-blue-400',
      change: '+2 this week'
    },
    { 
      label: 'Quizzes Completed', 
      value: stats.quizzes_completed, 
      icon: Brain, 
      color: 'bg-emerald-500/20 text-emerald-400',
      change: '+3 this month'
    },
    { 
      label: 'Subjects Explored', 
      value: stats.subjects_explored, 
      icon: Target, 
      color: 'bg-purple-500/20 text-purple-400',
      change: '+1 this week'
    },
    { 
      label: 'Study Streak', 
      value: `${stats.study_streak} days`, 
      icon: TrendingUp, 
      color: 'bg-amber-500/20 text-amber-400',
      change: 'Keep it up!'
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
          className="p-4 glass border-0 hover:shadow-glow-sm transition-all animate-slide-up"
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
              <p className="text-xs text-primary mt-1">
                ↑ {stat.change}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

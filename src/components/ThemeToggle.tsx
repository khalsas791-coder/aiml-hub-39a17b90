import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function ThemeToggle() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Check local storage first
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }

    // Fetch from DB if user is logged in
    if (user) {
      supabase
        .from('user_preferences')
        .select('theme')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.theme) {
            setTheme(data.theme as 'dark' | 'light');
            document.documentElement.classList.toggle('dark', data.theme === 'dark');
            localStorage.setItem('theme', data.theme);
          }
        });
    }
  }, [user]);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);

    if (user) {
      // Upsert preference
      await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: user.id, 
          theme: newTheme,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'user_id' 
        });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={toggleTheme}
      className="text-muted-foreground hover:text-primary rounded-full hover:shadow-glow-sm transition-all"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  );
}

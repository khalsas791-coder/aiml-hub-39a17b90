import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const decodeBase64Url = (input: string) => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
};

const getUserIdFromJwt = (token: string): string | null => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const json = decodeBase64Url(payload);
    const parsed = JSON.parse(json);
    return typeof parsed?.sub === 'string' ? parsed.sub : null;
  } catch {
    return null;
  }
};

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

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const jwt = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!jwt) {
      console.error('Authorization header present but JWT missing');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = getUserIdFromJwt(jwt);
    if (!userId) {
      console.error('Could not read user id from JWT');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${jwt}` } } }
    );

    const now = new Date();

    console.log(`Fetching dashboard stats for user: ${userId}`);

    // Calculate date boundaries
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    // 1. Resources Viewed - total and last 7 days growth
    const { count: totalResources } = await supabase
      .from('resource_views')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: resourcesThisWeek } = await supabase
      .from('resource_views')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('viewed_at', sevenDaysAgo.toISOString());

    const { count: resourcesLastWeek } = await supabase
      .from('resource_views')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('viewed_at', fourteenDaysAgo.toISOString())
      .lt('viewed_at', sevenDaysAgo.toISOString());

    const resourcesGrowth = (resourcesThisWeek || 0) - (resourcesLastWeek || 0);

    // 2. Quizzes Completed - total and this month growth
    const { count: totalQuizzes } = await supabase
      .from('quiz_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: quizzesThisMonth } = await supabase
      .from('quiz_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString());

    const { count: quizzesLastMonth } = await supabase
      .from('quiz_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfLastMonth.toISOString())
      .lt('created_at', startOfMonth.toISOString());

    const quizzesGrowth = (quizzesThisMonth || 0) - (quizzesLastMonth || 0);

    // 3. Subjects Explored - unique subjects this week
    const { data: allSubjects } = await supabase
      .from('subject_explorations')
      .select('subject')
      .eq('user_id', userId);

    const uniqueSubjects = new Set(allSubjects?.map(s => s.subject) || []);
    
    const { data: subjectsThisWeek } = await supabase
      .from('subject_explorations')
      .select('subject')
      .eq('user_id', userId)
      .gte('explored_at', startOfWeek.toISOString());

    const { data: subjectsLastWeek } = await supabase
      .from('subject_explorations')
      .select('subject')
      .eq('user_id', userId)
      .gte('explored_at', startOfLastWeek.toISOString())
      .lt('explored_at', startOfWeek.toISOString());

    const uniqueThisWeek = new Set(subjectsThisWeek?.map(s => s.subject) || []);
    const uniqueLastWeek = new Set(subjectsLastWeek?.map(s => s.subject) || []);
    const subjectsGrowth = uniqueThisWeek.size - uniqueLastWeek.size;

    // 4. Study Streak - consecutive days with activity
    // Efficient algorithm: fetch activity dates in descending order and count consecutive days
    const { data: activityLogs } = await supabase
      .from('activity_logs')
      .select('activity_date')
      .eq('user_id', userId)
      .order('activity_date', { ascending: false })
      .limit(365); // Max 1 year of streak

    let streak = 0;
    if (activityLogs && activityLogs.length > 0) {
      const todayStr = today.toISOString().split('T')[0];
      const yesterdayDate = new Date(today);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
      
      // Check if the most recent activity is today or yesterday
      const mostRecentDate = activityLogs[0].activity_date;
      if (mostRecentDate === todayStr || mostRecentDate === yesterdayStr) {
        streak = 1;
        let expectedDate = new Date(mostRecentDate);
        
        for (let i = 1; i < activityLogs.length; i++) {
          expectedDate.setDate(expectedDate.getDate() - 1);
          const expectedStr = expectedDate.toISOString().split('T')[0];
          
          if (activityLogs[i].activity_date === expectedStr) {
            streak++;
          } else {
            break; // Streak broken
          }
        }
      }
    }

    const stats: DashboardStats = {
      resources_viewed: totalResources || 0,
      resources_growth: resourcesGrowth,
      resources_period: 'this week',
      quizzes_completed: totalQuizzes || 0,
      quizzes_growth: quizzesGrowth,
      quizzes_period: 'this month',
      subjects_explored: uniqueSubjects.size,
      subjects_growth: subjectsGrowth,
      subjects_period: 'this week',
      study_streak: streak,
    };

    console.log('Dashboard stats calculated:', stats);

    return new Response(
      JSON.stringify(stats),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

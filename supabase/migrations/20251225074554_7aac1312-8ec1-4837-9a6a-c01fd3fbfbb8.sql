-- Create resource_views table to track when users view resources
CREATE TABLE public.resource_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subject_explorations table to track subject access
CREATE TABLE public.subject_explorations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  explored_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity_logs table for streak calculation
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL, -- 'resource_view', 'quiz_complete', 'subject_explore'
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, activity_date) -- One entry per user per day for streak tracking
);

-- Enable RLS on all tables
ALTER TABLE public.resource_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_explorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for resource_views
CREATE POLICY "Users can view their own resource views" 
ON public.resource_views FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resource views" 
ON public.resource_views FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS policies for subject_explorations
CREATE POLICY "Users can view their own explorations" 
ON public.subject_explorations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own explorations" 
ON public.subject_explorations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS policies for activity_logs
CREATE POLICY "Users can view their own activity logs" 
ON public.activity_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity logs" 
ON public.activity_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create indexes for efficient querying
CREATE INDEX idx_resource_views_user_date ON public.resource_views(user_id, viewed_at);
CREATE INDEX idx_subject_explorations_user_date ON public.subject_explorations(user_id, explored_at);
CREATE INDEX idx_activity_logs_user_date ON public.activity_logs(user_id, activity_date DESC);
CREATE INDEX idx_quiz_attempts_user_date ON public.quiz_attempts(user_id, created_at);
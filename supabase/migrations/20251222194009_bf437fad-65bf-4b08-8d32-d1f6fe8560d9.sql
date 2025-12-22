-- Add language column to user_preferences
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'english';

-- Add unique constraint for quiz_attempts to prevent duplicates
ALTER TABLE public.quiz_attempts 
ADD CONSTRAINT quiz_attempts_unique_daily UNIQUE (user_id, subject, attempt_date);

-- Allow authenticated users to view all quiz attempts for leaderboard
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON public.quiz_attempts;

CREATE POLICY "Users can view their own quiz attempts" 
ON public.quiz_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view leaderboard" 
ON public.quiz_attempts 
FOR SELECT 
USING (true);
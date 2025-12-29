-- Add email column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- Update the handle_new_user function to also store email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, usn, full_name, is_teacher, email)
    VALUES (
        new.id, 
        new.raw_user_meta_data ->> 'usn', 
        new.raw_user_meta_data ->> 'full_name',
        COALESCE((new.raw_user_meta_data ->> 'is_teacher')::boolean, false),
        new.email
    );
    RETURN new;
END;
$$;
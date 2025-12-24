-- Add is_teacher column to profiles table
ALTER TABLE public.profiles ADD COLUMN is_teacher boolean NOT NULL DEFAULT false;

-- Update the handle_new_user function to also store is_teacher
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, usn, full_name, is_teacher)
    VALUES (
        new.id, 
        new.raw_user_meta_data ->> 'usn', 
        new.raw_user_meta_data ->> 'full_name',
        COALESCE((new.raw_user_meta_data ->> 'is_teacher')::boolean, false)
    );
    RETURN new;
END;
$$;
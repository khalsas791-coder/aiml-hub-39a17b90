
-- Allow authenticated users to insert their own student role
CREATE POLICY "Users can insert their own student role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND role = 'student'::app_role
);

-- Create a function to bootstrap the first admin (when no admins exist)
CREATE OR REPLACE FUNCTION public.bootstrap_admin(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow if no admins exist yet
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'Admin already exists. Use admin privileges to add more admins.';
  END IF;
  
  -- Insert the admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN true;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.bootstrap_admin(uuid) TO authenticated;

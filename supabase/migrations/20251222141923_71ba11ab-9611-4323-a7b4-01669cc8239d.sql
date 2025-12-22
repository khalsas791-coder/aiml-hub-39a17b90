-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    usn TEXT, -- University Seat Number for students
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resources table for study materials
CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    semester INTEGER NOT NULL CHECK (semester IN (3, 4)),
    subject TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for resources timestamp updates
CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, usn, full_name)
    VALUES (new.id, new.raw_user_meta_data ->> 'usn', new.raw_user_meta_data ->> 'full_name');
    RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for resources (all authenticated users can view)
CREATE POLICY "Authenticated users can view resources"
ON public.resources
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert resources"
ON public.resources
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update resources"
ON public.resources
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete resources"
ON public.resources
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for resources
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true);

-- Storage policies for resources bucket
CREATE POLICY "Anyone can view resource files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resources');

CREATE POLICY "Admins can upload resource files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'resources' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update resource files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'resources' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete resource files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'resources' AND public.has_role(auth.uid(), 'admin'));
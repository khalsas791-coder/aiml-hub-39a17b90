-- Add resource_type column to distinguish between study materials and PYQ
ALTER TABLE public.resources 
ADD COLUMN resource_type TEXT NOT NULL DEFAULT 'material';

-- Add a check constraint for valid resource types
ALTER TABLE public.resources 
ADD CONSTRAINT valid_resource_type CHECK (resource_type IN ('material', 'pyq'));
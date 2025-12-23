-- Drop the existing constraint and add a new one that includes lab_manual
ALTER TABLE public.resources DROP CONSTRAINT IF EXISTS valid_resource_type;

ALTER TABLE public.resources ADD CONSTRAINT valid_resource_type 
CHECK (resource_type IN ('material', 'pyq', 'lab_manual'));
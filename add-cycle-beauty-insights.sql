-- Add cycle insights and hormone impact columns to scanned_products table
-- Run this SQL script in your Supabase SQL Editor to add beauty cycle insights

-- First, add the new columns if they don't exist
DO $$ 
BEGIN
    -- Add cycle_insights column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'scanned_products' 
        AND column_name = 'cycle_insights'
    ) THEN
        ALTER TABLE public.scanned_products 
        ADD COLUMN cycle_insights JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- Add hormone_impact column  
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'scanned_products' 
        AND column_name = 'hormone_impact'
    ) THEN
        ALTER TABLE public.scanned_products 
        ADD COLUMN hormone_impact JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- Update existing scanned products with default values
UPDATE public.scanned_products 
SET 
    cycle_insights = '{
        "menstrual_phase": {"recommended": true, "reason": "No specific cycle insights available"},
        "follicular_phase": {"recommended": true, "reason": "No specific cycle insights available"}, 
        "ovulatory_phase": {"recommended": true, "reason": "No specific cycle insights available"},
        "luteal_phase": {"recommended": true, "reason": "No specific cycle insights available"}
    }'::jsonb,
    hormone_impact = '{
        "may_worsen_pms": false,
        "may_cause_breakouts": false, 
        "good_for_sensitive_skin": true,
        "description": "No specific hormone impact information available"
    }'::jsonb
WHERE cycle_insights IS NULL OR cycle_insights = '{}'::jsonb;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scanned_products_cycle_insights 
ON public.scanned_products USING GIN (cycle_insights);

CREATE INDEX IF NOT EXISTS idx_scanned_products_hormone_impact 
ON public.scanned_products USING GIN (hormone_impact);

-- Update RLS policies if needed (they should already exist from the main table creation)
-- The existing RLS policies on scanned_products will automatically apply to the new columns

-- Add helpful comments
COMMENT ON COLUMN public.scanned_products.cycle_insights IS 'AI-generated insights about product suitability for different menstrual cycle phases';
COMMENT ON COLUMN public.scanned_products.hormone_impact IS 'Information about how product ingredients may affect hormonal symptoms';

-- Verify the changes
DO $$
BEGIN
    RAISE NOTICE 'Successfully added cycle insights columns to scanned_products table';
    RAISE NOTICE 'Columns added: cycle_insights, hormone_impact';
    RAISE NOTICE 'Indexes created for better performance';
END $$;

-- ================================================================
-- Cycle Tracking Database Setup - Safe Version
-- Handles existing tables and policies gracefully
-- ================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- 1. CYCLE SETTINGS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.cycle_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cycle_length INTEGER DEFAULT 28 CHECK (cycle_length >= 21 AND cycle_length <= 35),
  period_length INTEGER DEFAULT 5 CHECK (period_length >= 2 AND period_length <= 8),
  last_period_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ================================================================
-- 2. PERIOD LOGS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.period_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_start_day BOOLEAN DEFAULT false,
  flow_intensity TEXT CHECK (flow_intensity IN ('light', 'moderate', 'heavy')),
  mood TEXT CHECK (mood IN ('happy', 'normal', 'sad', 'irritable', 'anxious')),
  symptoms JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ================================================================
-- 3. SUPPLEMENT LOGS TABLE  
-- ================================================================
CREATE TABLE IF NOT EXISTS public.supplement_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  supplement_name TEXT NOT NULL,
  dosage TEXT,
  taken BOOLEAN DEFAULT false,
  time_logged TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, supplement_name)
);

-- ================================================================
-- 4. USER SUPPLEMENTS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.user_supplements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  default_dosage TEXT,
  frequency TEXT DEFAULT 'Daily' CHECK (frequency IN ('Daily', '3x/week', '2x/week', 'Weekly')),
  reminder_time TIME,
  importance TEXT DEFAULT 'medium' CHECK (importance IN ('high', 'medium', 'low')),
  days_of_week JSONB DEFAULT '["Daily"]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- ================================================================
-- 5. BEAUTY RECOMMENDATIONS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.beauty_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cycle_phase TEXT CHECK (cycle_phase IN ('menstrual', 'follicular', 'ovulatory', 'luteal')),
  product_category TEXT NOT NULL,
  recommended_ingredients JSONB DEFAULT '[]'::jsonb,
  ingredients_to_avoid JSONB DEFAULT '[]'::jsonb,
  recommendation_text TEXT,
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 6. Update scanned_products table with cycle insights
-- ================================================================
DO $$ 
BEGIN
    -- Add cycle_insights column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'scanned_products' 
        AND column_name = 'cycle_insights'
    ) THEN
        ALTER TABLE public.scanned_products 
        ADD COLUMN cycle_insights JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- Add hormone_impact column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'scanned_products' 
        AND column_name = 'hormone_impact'
    ) THEN
        ALTER TABLE public.scanned_products 
        ADD COLUMN hormone_impact JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- ================================================================
-- 7. CREATE UPDATED_AT TRIGGER FUNCTION
-- ================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- 8. CREATE TRIGGERS (DROP FIRST IF EXISTS)
-- ================================================================
DROP TRIGGER IF EXISTS handle_cycle_settings_updated_at ON public.cycle_settings;
CREATE TRIGGER handle_cycle_settings_updated_at
    BEFORE UPDATE ON public.cycle_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_period_logs_updated_at ON public.period_logs;
CREATE TRIGGER handle_period_logs_updated_at
    BEFORE UPDATE ON public.period_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_supplement_logs_updated_at ON public.supplement_logs;
CREATE TRIGGER handle_supplement_logs_updated_at
    BEFORE UPDATE ON public.supplement_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_user_supplements_updated_at ON public.user_supplements;
CREATE TRIGGER handle_user_supplements_updated_at
    BEFORE UPDATE ON public.user_supplements
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_beauty_recommendations_updated_at ON public.beauty_recommendations;
CREATE TRIGGER handle_beauty_recommendations_updated_at
    BEFORE UPDATE ON public.beauty_recommendations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ================================================================
-- 9. ENABLE ROW LEVEL SECURITY
-- ================================================================
ALTER TABLE public.cycle_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.period_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplement_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beauty_recommendations ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- 10. CREATE RLS POLICIES (DROP EXISTING FIRST)
-- ================================================================

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Cycle Settings Policies
    DROP POLICY IF EXISTS "Users can view their own cycle settings" ON public.cycle_settings;
    DROP POLICY IF EXISTS "Users can insert their own cycle settings" ON public.cycle_settings;
    DROP POLICY IF EXISTS "Users can update their own cycle settings" ON public.cycle_settings;
    DROP POLICY IF EXISTS "Users can delete their own cycle settings" ON public.cycle_settings;
    
    -- Period Logs Policies
    DROP POLICY IF EXISTS "Users can view their own period logs" ON public.period_logs;
    DROP POLICY IF EXISTS "Users can insert their own period logs" ON public.period_logs;
    DROP POLICY IF EXISTS "Users can update their own period logs" ON public.period_logs;
    DROP POLICY IF EXISTS "Users can delete their own period logs" ON public.period_logs;
    
    -- Supplement Logs Policies
    DROP POLICY IF EXISTS "Users can view their own supplement logs" ON public.supplement_logs;
    DROP POLICY IF EXISTS "Users can insert their own supplement logs" ON public.supplement_logs;
    DROP POLICY IF EXISTS "Users can update their own supplement logs" ON public.supplement_logs;
    DROP POLICY IF EXISTS "Users can delete their own supplement logs" ON public.supplement_logs;
    
    -- User Supplements Policies
    DROP POLICY IF EXISTS "Users can view their own supplements" ON public.user_supplements;
    DROP POLICY IF EXISTS "Users can insert their own supplements" ON public.user_supplements;
    DROP POLICY IF EXISTS "Users can update their own supplements" ON public.user_supplements;
    DROP POLICY IF EXISTS "Users can delete their own supplements" ON public.user_supplements;
    
    -- Beauty Recommendations Policies
    DROP POLICY IF EXISTS "Users can view beauty recommendations" ON public.beauty_recommendations;
    DROP POLICY IF EXISTS "Admins can manage beauty recommendations" ON public.beauty_recommendations;
END $$;

-- Create new policies
-- Cycle Settings
CREATE POLICY "Users can view their own cycle settings" ON public.cycle_settings
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own cycle settings" ON public.cycle_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cycle settings" ON public.cycle_settings
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cycle settings" ON public.cycle_settings
    FOR DELETE USING (auth.uid() = user_id);

-- Period Logs
CREATE POLICY "Users can view their own period logs" ON public.period_logs
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own period logs" ON public.period_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own period logs" ON public.period_logs
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own period logs" ON public.period_logs
    FOR DELETE USING (auth.uid() = user_id);

-- Supplement Logs
CREATE POLICY "Users can view their own supplement logs" ON public.supplement_logs
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own supplement logs" ON public.supplement_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own supplement logs" ON public.supplement_logs
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own supplement logs" ON public.supplement_logs
    FOR DELETE USING (auth.uid() = user_id);

-- User Supplements
CREATE POLICY "Users can view their own supplements" ON public.user_supplements
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own supplements" ON public.user_supplements
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own supplements" ON public.user_supplements
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own supplements" ON public.user_supplements
    FOR DELETE USING (auth.uid() = user_id);

-- Beauty Recommendations
CREATE POLICY "Users can view beauty recommendations" ON public.beauty_recommendations
    FOR SELECT USING (true);

-- ================================================================
-- 11. CREATE INDEXES FOR PERFORMANCE
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_period_logs_user_date ON public.period_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_period_logs_start_day ON public.period_logs(user_id, is_start_day, date DESC);
CREATE INDEX IF NOT EXISTS idx_supplement_logs_user_date ON public.supplement_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_user_supplements_active ON public.user_supplements(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_beauty_recommendations_phase ON public.beauty_recommendations(cycle_phase, product_category);

-- ================================================================
-- 12. INSERT DEFAULT BEAUTY RECOMMENDATIONS (SAFE)
-- ================================================================
-- Clear existing recommendations first
DELETE FROM public.beauty_recommendations WHERE user_id IS NULL;

-- Insert new recommendations
INSERT INTO public.beauty_recommendations (cycle_phase, product_category, recommended_ingredients, ingredients_to_avoid, recommendation_text, priority) VALUES
-- Menstrual Phase
('menstrual', 'cleanser', '["ceramides", "hyaluronic acid", "glycerin"]', '["fragrance", "sulfates", "alcohol denat"]', 'Use gentle, hydrating cleansers to comfort sensitive skin during your period.', 1),
('menstrual', 'moisturizer', '["ceramides", "niacinamide", "shea butter"]', '["retinoids", "alpha hydroxy acids"]', 'Focus on barrier repair and comfort with rich, soothing moisturizers.', 1),
('menstrual', 'serum', '["hyaluronic acid", "vitamin E", "allantoin"]', '["vitamin C", "salicylic acid"]', 'Gentle, hydrating serums work best when your skin is most sensitive.', 2),

-- Follicular Phase  
('follicular', 'cleanser', '["salicylic acid", "glycolic acid", "tea tree oil"]', '["harsh sulfates"]', 'Light exfoliating cleansers help prep your skin as energy builds.', 1),
('follicular', 'serum', '["vitamin C", "niacinamide", "peptides"]', '["high concentration retinoids"]', 'Perfect time to introduce active ingredients as your skin becomes more resilient.', 1),
('follicular', 'sunscreen', '["zinc oxide", "titanium dioxide"]', '["oxybenzone", "octinoxate"]', 'Lightweight, broad-spectrum protection for your increasingly active lifestyle.', 2),

-- Ovulatory Phase
('ovulatory', 'cleanser', '["salicylic acid", "benzoyl peroxide"]', '["over-drying ingredients"]', 'Oil-control cleansers help manage increased sebum production.', 1),
('ovulatory', 'serum', '["niacinamide", "zinc", "retinoids"]', '["heavy oils"]', 'Active ingredients work best now - your skin can handle stronger treatments.', 1),
('ovulatory', 'moisturizer', '["hyaluronic acid", "lightweight humectants"]', '["heavy creams", "occlusives"]', 'Light, oil-free moisturizers prevent clogged pores during peak hormone levels.', 1),

-- Luteal Phase
('luteal', 'cleanser', '["gentle surfactants", "ceramides"]', '["harsh actives", "strong fragrance"]', 'Return to gentle cleansing as your skin becomes more reactive.', 1),
('luteal', 'serum', '["niacinamide", "azelaic acid", "zinc"]', '["high-strength retinoids", "glycolic acid"]', 'Anti-inflammatory ingredients help prevent PMS breakouts.', 1),
('luteal', 'moisturizer', '["ceramides", "cholesterol", "fatty acids"]', '["comedogenic oils"]', 'Barrier-supporting ingredients prepare your skin for the next cycle.', 1);

-- ================================================================
-- 13. SUCCESS MESSAGE
-- ================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Cycle tracking database setup complete!';
    RAISE NOTICE '📋 Tables: cycle_settings, period_logs, supplement_logs, user_supplements, beauty_recommendations';
    RAISE NOTICE '🔒 RLS policies enabled and updated';
    RAISE NOTICE '💄 Beauty recommendations inserted';
    RAISE NOTICE '🚀 Ready for your cycle tracking app!';
END $$;

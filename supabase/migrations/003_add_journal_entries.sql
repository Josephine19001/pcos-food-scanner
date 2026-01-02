-- ============================================
-- FOOD REACTIONS TABLE
-- For tracking how foods affect PCOS symptoms
-- ============================================

CREATE TABLE IF NOT EXISTS food_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,

    -- Food reference (optional - can link to a scan or be manual entry)
    scan_id UUID REFERENCES scans(id) ON DELETE SET NULL,
    food_name VARCHAR(255) NOT NULL,
    food_image_url TEXT,

    -- Meal type category
    meal_type VARCHAR(20) CHECK (meal_type IS NULL OR meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),

    -- Overall reaction
    reaction VARCHAR(20) NOT NULL CHECK (reaction IN ('good', 'okay', 'bad')),

    -- Symptoms triggered (array of symptom keys)
    symptoms TEXT[] DEFAULT '{}',

    -- Severity of symptoms (1-5 scale, null if no symptoms)
    severity INTEGER CHECK (severity IS NULL OR (severity >= 1 AND severity <= 5)),

    -- Time after eating when symptoms appeared
    time_after_eating VARCHAR(20) CHECK (time_after_eating IN ('immediate', '30min', '1hour', '2hours', 'next_day', NULL)),

    -- Energy level after eating (1-5 scale)
    energy_level INTEGER CHECK (energy_level IS NULL OR (energy_level >= 1 AND energy_level <= 5)),

    -- Optional notes
    notes TEXT,

    -- When the food was consumed
    consumed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_food_reactions_user_id ON food_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_food_reactions_consumed_at ON food_reactions(user_id, consumed_at DESC);
CREATE INDEX IF NOT EXISTS idx_food_reactions_scan_id ON food_reactions(scan_id);
CREATE INDEX IF NOT EXISTS idx_food_reactions_reaction ON food_reactions(user_id, reaction);
CREATE INDEX IF NOT EXISTS idx_food_reactions_meal_type ON food_reactions(user_id, meal_type);

-- Apply auto-update trigger for updated_at
CREATE TRIGGER update_food_reactions_updated_at
    BEFORE UPDATE ON food_reactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE food_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own food reactions"
    ON food_reactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food reactions"
    ON food_reactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food reactions"
    ON food_reactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food reactions"
    ON food_reactions FOR DELETE
    USING (auth.uid() = user_id);

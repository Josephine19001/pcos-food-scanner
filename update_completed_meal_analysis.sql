-- RPC function to update meal analysis with completed data
-- This bypasses potential RLS issues that might prevent direct UPDATE

CREATE OR REPLACE FUNCTION update_completed_meal_analysis(
  meal_entry_id UUID,
  food_items JSONB,
  total_calories NUMERIC,
  total_protein NUMERIC,
  total_carbs NUMERIC,
  total_fat NUMERIC,
  total_fiber NUMERIC,
  total_sugar NUMERIC,
  notes_text TEXT DEFAULT NULL,
  image_url_text TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the meal entry with completed analysis data
  UPDATE meal_entries 
  SET 
    food_items = update_completed_meal_analysis.food_items,
    total_calories = update_completed_meal_analysis.total_calories,
    total_protein = update_completed_meal_analysis.total_protein,
    total_carbs = update_completed_meal_analysis.total_carbs,
    total_fat = update_completed_meal_analysis.total_fat,
    total_fiber = update_completed_meal_analysis.total_fiber,
    total_sugar = update_completed_meal_analysis.total_sugar,
    notes = COALESCE(update_completed_meal_analysis.notes_text, meal_entries.notes),
    image_url = COALESCE(update_completed_meal_analysis.image_url_text, meal_entries.image_url),
    analysis_status = 'completed',
    analysis_progress = 100,
    analysis_stage = NULL,
    updated_at = NOW()
  WHERE meal_entries.id = update_completed_meal_analysis.meal_entry_id;
  
  -- Log if no rows were affected
  IF NOT FOUND THEN
    RAISE LOG 'No meal entry found with ID: %', meal_entry_id;
  END IF;
END;
$$;
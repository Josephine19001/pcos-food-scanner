# 🌸 Cycle & Beauty Backend Setup Guide

## 📋 Prerequisites

Make sure you have:

- Supabase project set up
- GROQ API key for AI analysis
- Access to Supabase dashboard

## 🗄️ Database Setup

### 1. Run Database Migrations

Execute these SQL scripts in your Supabase SQL Editor **in this order**:

```sql
-- 1. Create the main cycle tracking tables
-- Run: create-cycle-tracking-tables.sql
-- This creates: cycle_settings, period_logs, supplement_logs, user_supplements, beauty_recommendations

-- 2. Update existing scanned_products table (if you already have products)
-- Run: add-cycle-beauty-insights.sql
-- This adds: cycle_insights and hormone_impact columns
```

### 2. Verify Database Schema

After running the scripts, verify these tables exist:

- ✅ `cycle_settings`
- ✅ `period_logs`
- ✅ `supplement_logs`
- ✅ `user_supplements`
- ✅ `beauty_recommendations`
- ✅ `scanned_products` (with new columns)

## 🔧 Edge Functions Setup

### 1. Deploy Edge Functions

Deploy these new edge functions to Supabase:

```bash
# Deploy cycle management function
supabase functions deploy cycle-manager

# Deploy supplement tracking function
supabase functions deploy supplement-manager

# Deploy beauty recommendations function
supabase functions deploy beauty-cycle-recommendations
```

### 2. Set Environment Variables

In your Supabase dashboard, add these environment variables:

```env
GROQ_API_KEY=your_groq_api_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Test Edge Functions

Test each function is working:

```bash
# Test cycle manager
curl -X GET "https://your-project.supabase.co/functions/v1/cycle-manager/settings" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Test supplement manager
curl -X GET "https://your-project.supabase.co/functions/v1/supplement-manager/supplements" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Test beauty recommendations
curl -X GET "https://your-project.supabase.co/functions/v1/beauty-cycle-recommendations/recommendations?cycle_phase=follicular"
```

## 📱 Frontend Integration

### 1. New Hooks Available

Your frontend now has these powerful hooks:

#### Cycle Tracking

```typescript
import {
  useCycleSettings,
  useCurrentCyclePhase,
  useCycleStats,
  usePeriodLogs,
  useUpdateCycleSettings,
  useLogPeriodData,
} from '@/lib/hooks/use-cycle-data';
```

#### Supplement Management

```typescript
import {
  useUserSupplements,
  useTodaysSupplements,
  useSupplementRecommendations,
  useAddSupplement,
  useLogSupplement,
} from '@/lib/hooks/use-supplements';
```

#### Beauty Recommendations

```typescript
import {
  useBeautyRecommendations,
  useCycleIngredients,
  useAnalyzeProduct,
  useSaveScanWithInsights,
} from '@/lib/hooks/use-beauty-recommendations';
```

### 2. Component Updates

Your existing components now have enhanced functionality:

- **CycleDashboard**: Shows current phase with personalized insights
- **MoodSymptomInsights**: Tracks patterns and correlations
- **DailyGuide**: Provides cycle-specific recommendations
- **CycleInsights**: Shows product suitability by cycle phase
- **SupplementsTab**: Integrates with cycle recommendations

## 🎯 Features Now Available

### ✨ Cycle Tracking

- Real-time cycle phase calculation
- Mood and symptom pattern analysis
- Exercise recommendations by phase
- Fertility window predictions

### 💊 Smart Supplements

- Cycle-aware supplement recommendations
- Daily tracking and adherence analytics
- Personalized timing suggestions
- Integration with cycle phases

### 🌟 Beauty Intelligence

- AI-powered product analysis for cycle compatibility
- Ingredient recommendations by cycle phase
- Hormone impact warnings
- Personalized beauty routines

### 🔄 Enhanced Product Scanning

- Every scanned product now includes cycle insights
- Phase-specific usage recommendations
- Hormone impact analysis
- Personalized timing suggestions

## 🚀 Usage Examples

### Get Current Cycle Phase

```typescript
const { data: currentPhase } = useCurrentCyclePhase();
// Returns: phase, name, day_in_cycle, energy_level, recommended_exercises
```

### Log Period Data

```typescript
const logPeriod = useLogPeriodData();
logPeriod.mutate({
  date: '2024-01-15',
  is_start_day: true,
  flow_intensity: 'moderate',
  mood: 'normal',
  symptoms: ['cramps', 'bloating'],
});
```

### Get Beauty Recommendations

```typescript
const { data: recommendations } = useBeautyRecommendations('follicular', true);
// Returns personalized recommendations for follicular phase
```

### Analyze Product for Cycles

```typescript
const analyzeProduct = useAnalyzeProduct();
analyzeProduct.mutate(productData);
// Returns cycle insights and hormone impact analysis
```

## 🔍 Debugging

### Common Issues

1. **Edge functions not working**

   - Check environment variables are set
   - Verify function deployment
   - Check function logs in Supabase dashboard

2. **Database permissions**

   - Ensure RLS policies are enabled
   - Check user authentication
   - Verify table permissions

3. **AI analysis failing**
   - Check GROQ API key is valid
   - Monitor rate limits
   - Check function timeout settings

### Monitoring

Check these regularly:

- Edge function logs in Supabase dashboard
- Database query performance
- AI API usage and limits
- User authentication status

## 🎉 You're All Set!

Your app now has the most advanced cycle-aware beauty and wellness tracking system available! Users can:

- 📊 Track their complete cycle with smart insights
- 💄 Get beauty recommendations that adapt to their hormones
- 💊 Manage supplements with cycle-optimized timing
- 🔬 Analyze products for cycle compatibility
- 📈 See patterns and correlations in their health data

The combination of cycle science + beauty intelligence + supplement optimization creates a truly unique and valuable experience for women! 🌸

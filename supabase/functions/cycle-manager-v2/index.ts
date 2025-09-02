import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface PeriodCycle {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string | null; // Nullable for ongoing periods
  cycle_length: number | null;
  period_length: number | null; // Nullable for ongoing periods
  flow_intensity?: 'light' | 'moderate' | 'heavy';
  notes?: string;
  created_at: string;
}


interface CycleSettings {
  cycle_length: number;
  period_length: number;
  average_cycle_length?: number;
}

interface CurrentCycleInfo {
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  name: string;
  day_in_cycle: number;
  days_remaining: number;
  energy_level: 'low' | 'building' | 'high' | 'declining';
  description: string;
  recommended_exercises: string[];
  pregnancy_chances: {
    level: string;
    color: string;
    description: string;
  };
  next_period_prediction?: {
    date: string;
    daysUntil: number;
    confidence: 'high' | 'medium' | 'low';
  };
}

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status);
}

// Calculate pregnancy chances based on cycle day
function calculatePregnancyChances(dayInCycle: number) {
  if (dayInCycle <= 5) {
    return {
      level: 'Very Low',
      color: '#10B981',
      description: 'Menstrual phase - very low fertility',
    };
  } else if (dayInCycle <= 9) {
    return {
      level: 'Low',
      color: '#10B981',
      description: 'Early follicular phase - low fertility',
    };
  } else if (dayInCycle <= 11) {
    return {
      level: 'Medium',
      color: '#F59E0B',
      description: 'Late follicular phase - fertility increasing',
    };
  } else if (dayInCycle >= 12 && dayInCycle <= 16) {
    return {
      level: 'High',
      color: '#EF4444',
      description: 'Ovulatory phase - peak fertility window',
    };
  } else if (dayInCycle <= 21) {
    return {
      level: 'Medium',
      color: '#F59E0B',
      description: 'Early luteal phase - moderate fertility',
    };
  } else {
    return {
      level: 'Low',
      color: '#10B981',
      description: 'Late luteal phase - low fertility',
    };
  }
}

// Calculate next period prediction from period cycles
function calculateNextPeriod(cycles: PeriodCycle[]): CurrentCycleInfo['next_period_prediction'] {
  if (cycles.length === 0) return undefined;

  // Sort cycles by start date (most recent first)
  const sortedCycles = cycles.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
  const lastCycle = sortedCycles[0];
  
  // Calculate average cycle length from recent cycles
  const cycleLengths = sortedCycles
    .filter(cycle => cycle.cycle_length && cycle.cycle_length >= 21 && cycle.cycle_length <= 35)
    .slice(0, 6) // Use last 6 cycles
    .map(cycle => cycle.cycle_length!);

  if (cycleLengths.length === 0) {
    // Use default 28 days if no cycle length data
    const nextDate = new Date(lastCycle.start_date);
    nextDate.setDate(nextDate.getDate() + 28);
    
    const today = new Date();
    const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      date: nextDate.toISOString().split('T')[0],
      daysUntil,
      confidence: 'low'
    };
  }

  const avgCycleLength = Math.round(cycleLengths.reduce((sum, len) => sum + len, 0) / cycleLengths.length);
  
  // Predict next period
  const nextDate = new Date(lastCycle.start_date);
  nextDate.setDate(nextDate.getDate() + avgCycleLength);
  
  const today = new Date();
  const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Determine confidence based on cycle regularity
  const variance = cycleLengths.reduce((sum, len) => sum + Math.pow(len - avgCycleLength, 2), 0) / cycleLengths.length;
  const standardDeviation = Math.sqrt(variance);
  
  let confidence: 'high' | 'medium' | 'low' = 'high';
  if (standardDeviation > 4) confidence = 'medium';
  if (standardDeviation > 7) confidence = 'low';
  
  return {
    date: nextDate.toISOString().split('T')[0],
    daysUntil,
    confidence
  };
}

// Calculate current cycle phase and info
function calculateCurrentCycleInfo(cycles: PeriodCycle[], selectedDate?: string): CurrentCycleInfo | null {
  if (cycles.length === 0) return null;

  // Sort cycles by start date (most recent first)
  const sortedCycles = cycles.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
  const lastCycle = sortedCycles[0];
  
  const referenceDate = selectedDate ? new Date(selectedDate) : new Date();
  const lastPeriodStart = new Date(lastCycle.start_date);
  
  // Calculate days since last period
  const daysSinceStart = Math.floor((referenceDate.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Calculate average cycle length for this user
  const cycleLengths = sortedCycles
    .filter(cycle => cycle.cycle_length && cycle.cycle_length >= 21 && cycle.cycle_length <= 35)
    .slice(0, 6)
    .map(cycle => cycle.cycle_length!);
  
  const avgCycleLength = cycleLengths.length > 0 
    ? Math.round(cycleLengths.reduce((sum, len) => sum + len, 0) / cycleLengths.length)
    : 28;

  // Calculate current day in cycle
  let dayInCycle = daysSinceStart;
  if (dayInCycle > avgCycleLength) {
    // If we've gone past a full cycle, wrap around
    dayInCycle = ((daysSinceStart - 1) % avgCycleLength) + 1;
  }
  
  // Ensure dayInCycle is within valid range
  if (dayInCycle <= 0) dayInCycle = 1;
  if (dayInCycle > avgCycleLength) dayInCycle = avgCycleLength;

  // Determine phase based on day in cycle
  let phase: CurrentCycleInfo['phase'];
  let name: string;
  let energy_level: CurrentCycleInfo['energy_level'];
  let recommended_exercises: string[];
  let days_remaining: number;
  let description: string;

  const periodLength = lastCycle.period_length || 5;

  if (dayInCycle <= periodLength) {
    phase = 'menstrual';
    name = 'Menstrual Phase';
    energy_level = 'low';
    days_remaining = Math.max(0, periodLength - dayInCycle + 1);
    description = 'Your period - time for gentle self-care and rest';
    recommended_exercises = ['Gentle yoga', 'Light walking', 'Stretching', 'Meditation'];
  } else if (dayInCycle <= Math.floor(avgCycleLength * 0.5)) {
    phase = 'follicular';
    name = 'Follicular Phase';
    energy_level = 'building';
    days_remaining = Math.max(0, Math.floor(avgCycleLength * 0.5) - dayInCycle + 1);
    description = 'Energy is building - great time to start new projects';
    recommended_exercises = ['Cardio', 'Strength training', 'High-intensity workouts', 'New activities'];
  } else if (dayInCycle <= Math.floor(avgCycleLength * 0.6)) {
    phase = 'ovulatory';
    name = 'Ovulatory Phase';
    energy_level = 'high';
    days_remaining = Math.max(0, Math.floor(avgCycleLength * 0.6) - dayInCycle + 1);
    description = 'Peak energy and confidence - you can handle anything';
    recommended_exercises = ['High-intensity training', 'Group fitness', 'Challenging workouts', 'Outdoor activities'];
  } else {
    phase = 'luteal';
    name = 'Luteal Phase';
    energy_level = 'declining';
    days_remaining = Math.max(0, avgCycleLength - dayInCycle + 1);
    description = 'Winding down - focus on comfort and preparation for your next cycle';
    recommended_exercises = ['Yoga', 'Pilates', 'Moderate cardio', 'Strength training'];
  }

  return {
    phase,
    name,
    day_in_cycle: dayInCycle,
    days_remaining,
    energy_level,
    description,
    recommended_exercises,
    pregnancy_chances: calculatePregnancyChances(dayInCycle),
    next_period_prediction: calculateNextPeriod(cycles),
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    const {
      data: { user },
    } = await supabase.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', '') || '');

    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    switch (req.method) {
      case 'GET':
        if (path === 'current-info') {
          // Get current cycle info with pregnancy chances and predictions
          const selectedDate = url.searchParams.get('date'); // Optional specific date
          
          const { data: cycles } = await supabase
            .from('period_cycles')
            .select('*')
            .eq('user_id', user.id)
            .order('start_date', { ascending: false })
            .limit(10);

          const currentInfo = calculateCurrentCycleInfo(cycles || [], selectedDate || undefined);
          return jsonResponse(currentInfo);
        }

        if (path === 'cycles') {
          // Get period cycles
          const limit = parseInt(url.searchParams.get('limit') || '10');
          
          const { data: cycles, error } = await supabase
            .from('period_cycles')
            .select('*')
            .eq('user_id', user.id)
            .order('start_date', { ascending: false })
            .limit(limit);

          if (error) {
            return errorResponse(error.message);
          }

          return jsonResponse(cycles);
        }


        if (path === 'settings') {
          // Get cycle settings
          const { data: settings, error } = await supabase
            .from('cycle_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            return errorResponse(error.message);
          }

          return jsonResponse(settings || null);
        }

        break;

      case 'POST':
        if (path === 'log-cycle') {
          // Log a complete period cycle
          const body = await req.json();
          const { start_date, end_date, flow_intensity, notes } = body;

          if (!start_date || !end_date) {
            return errorResponse('start_date and end_date are required');
          }

          if (new Date(end_date) < new Date(start_date)) {
            return errorResponse('end_date must be after start_date');
          }

          const { data, error } = await supabase
            .from('period_cycles')
            .insert({
              user_id: user.id,
              start_date,
              end_date,
              flow_intensity: flow_intensity || 'moderate',
              notes,
            })
            .select()
            .single();

          if (error) {
            return errorResponse(error.message);
          }

          return jsonResponse(data);
        }

        if (path === 'start-period') {
          // Start a new ongoing period
          const body = await req.json();
          const { start_date, flow_intensity, notes } = body;

          if (!start_date) {
            return errorResponse('start_date is required');
          }

          // Check if there's already an ongoing period
          const { data: ongoing } = await supabase
            .from('period_cycles')
            .select('*')
            .eq('user_id', user.id)
            .is('end_date', null)
            .single();

          if (ongoing) {
            return errorResponse('Cannot start new period - you have an ongoing period');
          }

          const { data, error } = await supabase
            .from('period_cycles')
            .insert({
              user_id: user.id,
              start_date,
              end_date: null,
              flow_intensity: flow_intensity || 'moderate',
              notes,
            })
            .select()
            .single();

          if (error) {
            return errorResponse(error.message);
          }

          return jsonResponse(data);
        }

        if (path === 'end-period') {
          // End the current ongoing period
          const body = await req.json();
          const { end_date } = body;

          if (!end_date) {
            return errorResponse('end_date is required');
          }

          // Find ongoing period
          const { data: ongoing } = await supabase
            .from('period_cycles')
            .select('*')
            .eq('user_id', user.id)
            .is('end_date', null)
            .single();

          if (!ongoing) {
            return errorResponse('No ongoing period found to end');
          }

          if (new Date(end_date) < new Date(ongoing.start_date)) {
            return errorResponse('end_date must be after start_date');
          }

          const { data, error } = await supabase
            .from('period_cycles')
            .update({ end_date })
            .eq('id', ongoing.id)
            .eq('user_id', user.id)
            .select()
            .single();

          if (error) {
            return errorResponse(error.message);
          }

          return jsonResponse(data);
        }


        if (path === 'settings') {
          // Update cycle settings
          const body: CycleSettings = await req.json();

          const { data, error } = await supabase
            .from('cycle_settings')
            .upsert({
              user_id: user.id,
              ...body,
            })
            .select()
            .single();

          if (error) {
            return errorResponse(error.message);
          }

          return jsonResponse(data);
        }

        break;

      case 'DELETE':
        if (path === 'cycle') {
          // Delete a period cycle
          const { id } = await req.json();

          const { error } = await supabase
            .from('period_cycles')
            .delete()
            .eq('user_id', user.id)
            .eq('id', id);

          if (error) {
            return errorResponse(error.message);
          }

          return jsonResponse({ success: true });
        }


        break;

      default:
        return errorResponse('Method not allowed', 405);
    }

    return errorResponse('Invalid endpoint', 404);
  } catch (error) {
    console.error('Cycle manager v2 error:', error);
    return errorResponse('Internal server error', 500);
  }
});
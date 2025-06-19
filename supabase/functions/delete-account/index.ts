import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

function jsonError(message: string, status = 500) {
  return new Response(
    JSON.stringify({
      error: message,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    }
  );
}

function jsonSuccess(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    },
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  if (req.method !== 'POST') {
    return jsonError('Method Not Allowed', 405);
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return jsonError('Missing or invalid authorization header', 401);
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the JWT token and get user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return jsonError('Invalid or expired token', 401);
    }

    const userId = user.id;

    // Start a transaction-like deletion process
    try {
      // Delete user's scanned products
      const { error: scansError } = await supabase
        .from('scanned_products')
        .delete()
        .eq('user_id', userId);

      if (scansError) {
        console.error('Error deleting scanned products:', scansError);
        // Continue with deletion even if this fails
      }

      // Delete user's account data
      const { error: accountError } = await supabase
        .from('accounts')
        .delete()
        .eq('user_id', userId);

      if (accountError) {
        console.error('Error deleting account data:', accountError);
        // Continue with deletion even if this fails
      }

      // Delete any other user-related data (add more tables as needed)
      // Example: favorites, settings, etc.

      // Finally, delete the user from Supabase Auth
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(userId);

      if (deleteUserError) {
        console.error('Error deleting user from auth:', deleteUserError);
        return jsonError('Failed to delete user account', 500);
      }

      return jsonSuccess({
        message: 'Account successfully deleted',
        deleted_at: new Date().toISOString(),
      });
    } catch (deletionError) {
      console.error('Error during account deletion:', deletionError);
      return jsonError('Failed to delete account data', 500);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonError('Internal server error', 500);
  }
});

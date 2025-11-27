import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Debt {
  id: string;
  name: string;
  current_balance: number;
  original_balance: number;
  interest_rate: number;
}

interface PaymentSummary {
  total_paid: number;
  payment_count: number;
}

function getSupabaseServiceClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
}

function generateCheckinMessage(
  accountName: string,
  debts: Debt[],
  paymentSummary: PaymentSummary,
  paidOffThisWeek: number
): string {
  const firstName = accountName?.split(' ')[0] || 'there';
  const totalBalance = debts.reduce((sum, d) => sum + d.current_balance, 0);
  const totalOriginal = debts.reduce((sum, d) => sum + d.original_balance, 0);
  const overallProgress =
    totalOriginal > 0 ? Math.round(((totalOriginal - totalBalance) / totalOriginal) * 100) : 0;

  // Different messages based on user's situation
  const messages: string[] = [];

  // Celebration for paid off debts
  if (paidOffThisWeek > 0) {
    messages.push(
      `Hey ${firstName}! Huge news - you paid off ${paidOffThisWeek} debt${
        paidOffThisWeek > 1 ? 's' : ''
      } this week! That's amazing progress. Keep that momentum going! You're doing incredible.`
    );
  }
  // Great progress with payments
  else if (paymentSummary.total_paid > 0) {
    const paidFormatted = paymentSummary.total_paid.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    messages.push(
      `Hey ${firstName}! Just checking in - you made ${paidFormatted} in payments this week across ${
        paymentSummary.payment_count
      } payment${
        paymentSummary.payment_count > 1 ? 's' : ''
      }. Every payment counts. You're ${overallProgress}% of the way to being debt-free!`,
      `Hi ${firstName}! You put ${paidFormatted} toward your debts this week. That's real progress! Your total balance is now $${totalBalance.toLocaleString()}. Keep it up!`,
      `${firstName}, quick update: ${paidFormatted} paid this week! You're chipping away at it. Remember, slow and steady wins the race.`
    );
  }
  // No payments but has debts - encouragement
  else if (debts.length > 0) {
    messages.push(
      `Hey ${firstName}! Just wanted to check in. Life gets busy, and that's okay. When you're ready, even a small extra payment can make a difference. I'm here whenever you need me!`,
      `Hi ${firstName}! Hope your week is going well. Remember, having a plan is half the battle. If you want to chat about your debt strategy, I'm here to help!`,
      `${firstName}, checking in! Dealing with debt can feel overwhelming sometimes. Take it one step at a time. What's one small thing you could do this week toward your goal?`
    );
  }
  // No debts - congratulations or onboarding
  else {
    messages.push(
      `Hey ${firstName}! I noticed you haven't added any debts yet. If you're ready to start your debt-free journey, just add your first debt and we can make a plan together!`
    );
  }

  // Pick a random message from the appropriate category
  return messages[Math.floor(Math.random() * messages.length)];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // TODO: Re-enable auth after testing
    // Auth temporarily disabled for testing - the function uses service role internally
    // and should only be called by cron jobs or admin actions

    const supabase = getSupabaseServiceClient();

    // Get all accounts
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('id, name');

    if (accountsError) {
      throw new Error(`Failed to fetch accounts: ${accountsError.message}`);
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoISO = oneWeekAgo.toISOString();

    let messagesSent = 0;
    const errors: string[] = [];

    // Process each account
    for (const account of accounts || []) {
      try {
        // Get user's active debts
        const { data: debts } = await supabase
          .from('debts')
          .select('id, name, current_balance, original_balance, interest_rate')
          .eq('account_id', account.id)
          .eq('status', 'active');

        // Get debts paid off this week
        const { data: paidOffDebts } = await supabase
          .from('debts')
          .select('id')
          .eq('account_id', account.id)
          .eq('status', 'paid_off')
          .gte('paid_off_date', oneWeekAgoISO);

        // Get payment summary for the week
        const { data: payments } = await supabase
          .from('debt_payments')
          .select('amount, debt_id, debts!inner(account_id)')
          .eq('debts.account_id', account.id)
          .gte('payment_date', oneWeekAgoISO);

        const paymentSummary: PaymentSummary = {
          total_paid: payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0,
          payment_count: payments?.length || 0,
        };

        // Generate personalized message
        const message = generateCheckinMessage(
          account.name,
          debts || [],
          paymentSummary,
          paidOffDebts?.length || 0
        );

        // Insert the check-in message as an assistant message
        const { error: insertError } = await supabase.from('chat_messages').insert({
          account_id: account.id,
          role: 'assistant',
          content: message,
          is_checkin: true, // Mark as automated check-in
        });

        if (insertError) {
          errors.push(`Account ${account.id}: ${insertError.message}`);
        } else {
          messagesSent++;
        }
      } catch (err: any) {
        errors.push(`Account ${account.id}: ${err.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        messagesSent,
        totalAccounts: accounts?.length || 0,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Weekly checkin error:', error);
    return new Response(JSON.stringify({ error: error.message || 'An error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

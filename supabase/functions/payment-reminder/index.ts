import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Debt {
  id: string;
  name: string;
  minimum_payment: number;
  due_date: number;
  account_id: string;
}

interface Account {
  id: string;
  name: string;
  push_token: string | null;
}

interface ExpoPushMessage {
  to: string;
  sound: 'default';
  title: string;
  body: string;
  data?: Record<string, any>;
  channelId?: string;
}

async function sendExpoPushNotifications(messages: ExpoPushMessage[]) {
  if (messages.length === 0) return { success: true, sent: 0 };

  // Expo push API accepts batches of up to 100 messages
  const batches: ExpoPushMessage[][] = [];
  for (let i = 0; i < messages.length; i += 100) {
    batches.push(messages.slice(i, i + 100));
  }

  let totalSent = 0;
  const errors: string[] = [];

  for (const batch of batches) {
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(batch),
      });

      const result = await response.json();

      if (result.data) {
        totalSent += result.data.filter((r: any) => r.status === 'ok').length;
        // Collect errors for logging
        result.data.forEach((r: any, i: number) => {
          if (r.status === 'error') {
            errors.push(`${batch[i].to}: ${r.message}`);
          }
        });
      }
    } catch (err: any) {
      errors.push(`Batch send error: ${err.message}`);
    }
  }

  return { success: true, sent: totalSent, errors: errors.length > 0 ? errors : undefined };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const today = new Date();
    const dayOfMonth = today.getDate();

    // Get all active debts due today with their account info
    const { data: debts, error: debtsError } = await supabase
      .from('debts')
      .select(`
        id,
        name,
        minimum_payment,
        due_date,
        account_id
      `)
      .eq('status', 'active')
      .eq('due_date', dayOfMonth);

    if (debtsError) {
      throw new Error(`Failed to fetch debts: ${debtsError.message}`);
    }

    if (!debts || debts.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No payments due today', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get unique account IDs
    const accountIds = [...new Set(debts.map((d: Debt) => d.account_id))];

    // Fetch accounts with push tokens
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('id, name, push_token')
      .in('id', accountIds)
      .not('push_token', 'is', null);

    if (accountsError) {
      throw new Error(`Failed to fetch accounts: ${accountsError.message}`);
    }

    if (!accounts || accounts.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No accounts with push tokens', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a map of account ID to account info
    const accountMap = new Map<string, Account>();
    accounts.forEach((acc: Account) => {
      accountMap.set(acc.id, acc);
    });

    // Group debts by account
    const debtsByAccount = new Map<string, Debt[]>();
    debts.forEach((debt: Debt) => {
      const existing = debtsByAccount.get(debt.account_id) || [];
      existing.push(debt);
      debtsByAccount.set(debt.account_id, existing);
    });

    // Build push notification messages
    const messages: ExpoPushMessage[] = [];

    debtsByAccount.forEach((accountDebts, accountId) => {
      const account = accountMap.get(accountId);
      if (!account?.push_token) return;

      const firstName = account.name?.split(' ')[0] || 'Hey';
      const totalDue = accountDebts.reduce((sum, d) => sum + d.minimum_payment, 0);

      let title: string;
      let body: string;

      if (accountDebts.length === 1) {
        const debt = accountDebts[0];
        title = `${debt.name} payment due`;
        body = `${firstName}, your ${formatCurrency(debt.minimum_payment)} payment is due today. Tap to mark it paid.`;
      } else {
        title = `${accountDebts.length} payments due today`;
        body = `${firstName}, you have ${formatCurrency(totalDue)} in payments due. Tap to review.`;
      }

      messages.push({
        to: account.push_token,
        sound: 'default',
        title,
        body,
        data: {
          type: 'payment_reminder',
          debtIds: accountDebts.map((d) => d.id),
        },
        channelId: 'payment-reminders',
      });
    });

    // Send notifications
    const result = await sendExpoPushNotifications(messages);

    return new Response(
      JSON.stringify({
        success: true,
        totalDebts: debts.length,
        accountsNotified: messages.length,
        sent: result.sent,
        errors: result.errors,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Payment reminder error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

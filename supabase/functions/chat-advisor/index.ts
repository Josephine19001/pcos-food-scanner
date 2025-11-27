import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function getSupabaseClient(authHeader: string | null) {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: authHeader! },
      },
    }
  );
}

async function getAuthenticatedUser(supabaseClient: any) {
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();

  if (error || !user) {
    return { user: null, error: error || new Error("Unauthorized") };
  }

  return { user, error: null };
}

interface ChatPayload {
  message: string;
  focusedDebtId?: string | null;
}

interface Debt {
  id: string;
  name: string;
  category: string;
  current_balance: number;
  original_balance: number;
  interest_rate: number;
  minimum_payment: number;
  status: string;
}

function buildSystemPrompt(focusedDebt: Debt | null, allDebtsCount: number, totalBalance: number): string {
  // Minimal context - only what's needed
  let context = "";

  if (focusedDebt) {
    // Single debt focus - very minimal
    context = `FOCUSED DEBT: ${focusedDebt.name}
Balance: $${focusedDebt.current_balance.toLocaleString()}
APR: ${(focusedDebt.interest_rate * 100).toFixed(1)}%
Min payment: $${focusedDebt.minimum_payment}/mo`;
  } else if (allDebtsCount > 0) {
    // All debts - just summary
    context = `Total debt: $${totalBalance.toLocaleString()} across ${allDebtsCount} ${allDebtsCount === 1 ? 'debt' : 'debts'}`;
  } else {
    context = "No debts recorded yet.";
  }

  return `You're a friendly debt buddy. Supportive, chill, helpful.

${context}

RULES:
- 2-4 sentences MAX
- Only greet if user greets first
- Answer questions directly without filler
- DON'T end every message with encouragement like "You've got this!" or "Keep going!" - save that for when they actually need a boost
- DON'T be repetitive - vary your tone
- Be specific to their numbers
- Sound like a real friend texting, not a motivational poster
- 1 emoji max, only if it fits naturally`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseClient(req.headers.get("Authorization"));
    const { user, error: authError } = await getAuthenticatedUser(supabase);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { message, focusedDebtId }: ChatPayload = await req.json();

    if (!message || !message.trim()) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch user's debts for context
    const { data: debts, error: debtsError } = await supabase
      .from("debts")
      .select("id, name, category, current_balance, interest_rate, minimum_payment")
      .eq("account_id", user.id)
      .eq("status", "active");

    if (debtsError) {
      console.error("Error fetching debts:", debtsError);
    }

    const userDebts: Debt[] = debts || [];
    const totalBalance = userDebts.reduce((sum, d) => sum + Number(d.current_balance), 0);

    // Find focused debt if specified
    const focusedDebt = focusedDebtId
      ? userDebts.find((d) => d.id === focusedDebtId) || null
      : null;

    // Get recent chat history for context (last 6 messages - reduced for less context)
    const { data: recentMessages } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("account_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6);

    const chatHistory = (recentMessages || [])
      .reverse()
      .map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

    // Call OpenAI API
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const systemPrompt = buildSystemPrompt(focusedDebt, userDebts.length, totalBalance);

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory,
          { role: "user", content: message },
        ],
        max_tokens: 250,
        temperature: 0.8,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error("OpenAI error:", errorData);
      throw new Error("Failed to get AI response");
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0]?.message?.content || "I apologize, I couldn't generate a response. Please try again.";

    // Save AI response to database
    const { error: insertError } = await supabase
      .from("chat_messages")
      .insert({
        account_id: user.id,
        role: "assistant",
        content: aiResponse,
      });

    if (insertError) {
      console.error("Error saving AI response:", insertError);
    }

    return new Response(
      JSON.stringify({ success: true, response: aiResponse }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Chat advisor error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

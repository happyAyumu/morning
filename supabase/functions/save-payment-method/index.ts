import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { paymentMethodId } = await req.json();

    if (!paymentMethodId) {
      throw new Error("Payment method ID is required");
    }

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    const paymentMethodResponse = await fetch(
      `https://api.stripe.com/v1/payment_methods/${paymentMethodId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${stripeSecretKey}`,
        },
      }
    );

    if (!paymentMethodResponse.ok) {
      throw new Error("Failed to retrieve payment method");
    }

    const paymentMethod = await paymentMethodResponse.json();

    await supabaseClient
      .from("user_profiles")
      .update({
        stripe_payment_method_id: paymentMethodId,
        payment_method_last4: paymentMethod.card.last4,
        payment_method_brand: paymentMethod.card.brand,
        payment_method_exp_month: paymentMethod.card.exp_month,
        payment_method_exp_year: paymentMethod.card.exp_year,
      })
      .eq("id", user.id);

    return new Response(
      JSON.stringify({
        success: true,
        paymentMethod: {
          last4: paymentMethod.card.last4,
          brand: paymentMethod.card.brand,
          exp_month: paymentMethod.card.exp_month,
          exp_year: paymentMethod.card.exp_year,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
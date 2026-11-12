import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const cronSecret = Deno.env.get("REMINDER_CRON_SECRET");
  if (!cronSecret || req.headers.get("Authorization") !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const fromEmail = Deno.env.get("REMINDER_FROM_EMAIL");
  if (!supabaseUrl || !serviceKey || !resendKey || !fromEmail) {
    return Response.json({ error: "Reminder service configuration is incomplete" }, { status: 500 });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const now = Date.now();
  const start = new Date(now + 23.75 * 60 * 60 * 1000).toISOString();
  const end = new Date(now + 24.25 * 60 * 60 * 1000).toISOString();
  const { data: appointments, error } = await admin
    .from("appointments")
    .select("id,patient_id,starts_at")
    .eq("status", "scheduled")
    .eq("reminder_enabled", true)
    .is("reminder_sent_at", null)
    .gte("starts_at", start)
    .lt("starts_at", end)
    .limit(100);
  if (error) return Response.json({ error: "Could not load reminders" }, { status: 500 });

  let sent = 0;
  let failed = 0;
  for (const appointment of appointments ?? []) {
    const { data: userResult, error: userError } = await admin.auth.admin.getUserById(appointment.patient_id);
    const email = userResult?.user?.email;
    if (userError || !email) { failed++; continue; }

    const date = new Date(appointment.starts_at).toLocaleString("en-IN", {
      dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata",
    });
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: "A gentle reminder from Serene Mind",
        text: `A reminder that you have an appointment scheduled for ${date}. Sign in to your Serene Mind portal to view your appointment details. This email does not contain private journal or health information.`,
      }),
    });
    if (!response.ok) { failed++; continue; }

    const { error: updateError } = await admin.from("appointments")
      .update({ reminder_sent_at: new Date().toISOString() })
      .eq("id", appointment.id)
      .is("reminder_sent_at", null);
    if (updateError) failed++; else sent++;
  }
  return Response.json({ sent, failed });
});

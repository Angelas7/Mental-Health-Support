import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_PORTAL_ORIGIN") ?? "https://your-portal-domain.example",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceKey) {
    return Response.json({ error: "Server configuration is incomplete" }, { status: 500, headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token || token === authHeader) {
    return Response.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });
  }

  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: caller, error: authError } = await callerClient.auth.getUser();
  if (authError || !caller.user) return Response.json({ error: "Invalid session" }, { status: 401, headers: corsHeaders });

  const { data: profile, error: profileError } = await adminClient
    .from("profiles").select("role").eq("id", caller.user.id).single();
  if (profileError || profile?.role !== "platform_admin") {
    return Response.json({ error: "Administrator permission required" }, { status: 403, headers: corsHeaders });
  }

  let body: { email?: string; display_name?: string; role?: string };
  try { body = await req.json(); } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400, headers: corsHeaders });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  const displayName = (body.display_name ?? "").trim();
  const role = body.role;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || displayName.length < 1 || displayName.length > 100 || !["patient", "therapist"].includes(role ?? "")) {
    return Response.json({ error: "Provide a valid email, display name and patient/therapist role" }, { status: 400, headers: corsHeaders });
  }

  const redirectTo = Deno.env.get("AUTH_REDIRECT_URL");
  const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: { display_name: displayName },
    ...(redirectTo ? { redirectTo } : {}),
  });
  if (inviteError || !invited.user) {
    return Response.json({ error: inviteError?.message ?? "Invitation could not be created" }, { status: 400, headers: corsHeaders });
  }

  const { error: updateError } = await adminClient.from("profiles").upsert({
    id: invited.user.id, display_name: displayName, role,
  });
  if (updateError) {
    return Response.json({ error: "Invitation created but role provisioning failed; review the account in the admin console" }, { status: 500, headers: corsHeaders });
  }

  return Response.json({ invited: true, role }, { status: 200, headers: corsHeaders });
});

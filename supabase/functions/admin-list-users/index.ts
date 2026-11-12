import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_PORTAL_ORIGIN") ?? "https://your-portal-domain.example",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!url || !anon || !service || !token) return Response.json({ error: "Configuration or authentication missing" }, { status: 401, headers: corsHeaders });

  const caller = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${token}` } } });
  const admin = createClient(url, service);
  const { data: auth } = await caller.auth.getUser();
  if (!auth.user) return Response.json({ error: "Invalid session" }, { status: 401, headers: corsHeaders });
  const { data: profile } = await admin.from("profiles").select("role").eq("id", auth.user.id).single();
  if (profile?.role !== "platform_admin") return Response.json({ error: "Administrator permission required" }, { status: 403, headers: corsHeaders });

  const { data: users, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 100 });
  if (error) return Response.json({ error: "Could not list accounts" }, { status: 500, headers: corsHeaders });
  const { data: profiles } = await admin.from("profiles").select("id,display_name,role");
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  const result = (users.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? "",
    display_name: byId.get(u.id)?.display_name ?? "",
    role: byId.get(u.id)?.role ?? "patient",
    created_at: u.created_at,
  }));
  return Response.json({ users: result }, { headers: corsHeaders });
});

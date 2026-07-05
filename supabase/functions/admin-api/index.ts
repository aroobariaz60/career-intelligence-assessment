import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_PASSWORD = "admin123"; // Same as frontend for demo

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Verify admin password from header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "list";
    const page = parseInt(url.searchParams.get("page") || "0");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const search = url.searchParams.get("search") || "";
    const filter = url.searchParams.get("filter") || "";
    const id = url.searchParams.get("id") || "";

    if (req.method === "GET") {
      // Get single submission
      if (action === "get" && id) {
        const { data, error } = await supabase
          .from("submissions")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify(data),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get statistics
      if (action === "stats") {
        const { count: totalCount, error: countError } = await supabase
          .from("submissions")
          .select("*", { count: "exact", head: true });

        if (countError) {
          return new Response(
            JSON.stringify({ error: countError.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: allSubmissions, error: dataError } = await supabase
          .from("submissions")
          .select("highest_intelligence, body_score, picture_score, word_score, logic_score, music_score, people_score, created_at");

        if (dataError) {
          return new Response(
            JSON.stringify({ error: dataError.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const distribution: Record<string, number> = {};
        const scoresSum = { body: 0, picture: 0, word: 0, logic: 0, music: 0, people: 0 };

        allSubmissions?.forEach((s) => {
          distribution[s.highest_intelligence] = (distribution[s.highest_intelligence] || 0) + 1;
          scoresSum.body += s.body_score || 0;
          scoresSum.picture += s.picture_score || 0;
          scoresSum.word += s.word_score || 0;
          scoresSum.logic += s.logic_score || 0;
          scoresSum.music += s.music_score || 0;
          scoresSum.people += s.people_score || 0;
        });

        const count = allSubmissions?.length || 0;

        return new Response(
          JSON.stringify({
            totalCount: totalCount || 0,
            avgScores: count > 0 ? {
              body: Math.round(scoresSum.body / count),
              picture: Math.round(scoresSum.picture / count),
              word: Math.round(scoresSum.word / count),
              logic: Math.round(scoresSum.logic / count),
              music: Math.round(scoresSum.music / count),
              people: Math.round(scoresSum.people / count),
            } : { body: 0, picture: 0, word: 0, logic: 0, music: 0, people: 0 },
            distribution,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // List submissions with pagination, search, and filter
      let query = supabase
        .from("submissions")
        .select("*", { count: "exact" });

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      if (filter) {
        query = query.eq("highest_intelligence", filter);
      }

      const from = page * limit;
      const to = from + limit - 1;
      query = query.range(from, to).order("created_at", { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ submissions: data, totalCount: count }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error in admin API:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

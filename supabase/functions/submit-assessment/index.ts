import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SubmissionData {
  fullName: string;
  email: string;
  answers: Record<number, number>;
  scores: {
    body: number;
    picture: number;
    word: number;
    logic: number;
    music: number;
    people: number;
  };
  highestIntelligence: string;
  recommendedCareers: string[];
  feedback: {
    easyToUse: string;
    enjoyedTest: string;
    quickFeedback?: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const data: SubmissionData = await req.json();

    // Validate required fields
    if (!data.fullName || !data.email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: fullName, email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert submission into database
    const { error: insertError } = await supabase
      .from("submissions")
      .insert({
        full_name: data.fullName,
        email: data.email,
        answers: data.answers,
        body_score: data.scores.body,
        picture_score: data.scores.picture,
        word_score: data.scores.word,
        logic_score: data.scores.logic,
        music_score: data.scores.music,
        people_score: data.scores.people,
        highest_intelligence: data.highestIntelligence,
        recommended_careers: data.recommendedCareers,
        feedback_easy: data.feedback?.easyToUse || null,
        feedback_interesting: data.feedback?.enjoyedTest || null,
        feedback_quick: data.feedback?.quickFeedback || null,
      });

    if (insertError) {
      console.error("Database insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save submission" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send to Google Apps Script Web App (always called after successful Supabase save)
    const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzqHswxFsoTCZupLJwUDGsjsQsoSNk4J7BJwm_yHhzDvjX6ZPKjBMwGqZillORHBH8Xtw/exec";

    try {
      const timestamp = new Date().toISOString();

      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          answers: data.answers,
          bodyScore: data.scores.body,
          pictureScore: data.scores.picture,
          wordScore: data.scores.word,
          logicScore: data.scores.logic,
          musicScore: data.scores.music,
          peopleScore: data.scores.people,
          highestIntelligence: data.highestIntelligence,
          recommendedCareers: data.recommendedCareers,
          feedbackEasyToUse: data.feedback?.easyToUse || "",
          feedbackEnjoyedTest: data.feedback?.enjoyedTest || "",
          feedbackQuick: data.feedback?.quickFeedback || "",
          timestamp: timestamp,
        }),
      });
    } catch (err) {
      console.error("Google Apps Script webhook error:", err);
      // Don't fail the request if Google Sheets fails
    }

    // Send email notification to admin (if configured)
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    const emailWebhook = Deno.env.get("EMAIL_WEBHOOK_URL");

    if (adminEmail && emailWebhook) {
      try {
        const emailContent = {
          to: adminEmail,
          subject: `New Career Assessment Submission from ${data.fullName}`,
          body: `
New Career Intelligence Assessment Submitted

Student Name: ${data.fullName}
Email: ${data.email}

INTELLIGENCE SCORES:
- Body Smart: ${data.scores.body}/24
- Picture Smart: ${data.scores.picture}/24
- Word Smart: ${data.scores.word}/24
- Logic/Math Smart: ${data.scores.logic}/24
- Music Smart: ${data.scores.music}/24
- People Smart: ${data.scores.people}/24

HIGHEST INTELLIGENCE: ${data.highestIntelligence}

RECOMMENDED CAREERS:
${data.recommendedCareers.map(c => `- ${c}`).join("\n")}

FEEDBACK:
- Website easy to use: ${data.feedback?.easyToUse || "Not provided"}
- Enjoyed the test: ${data.feedback?.enjoyedTest || "Not provided"}
- Quick feedback: ${data.feedback?.quickFeedback || "Not provided"}

Submitted at: ${new Date().toLocaleString()}
          `.trim(),
        };

        await fetch(emailWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailContent),
        });
      } catch (err) {
        console.error("Email webhook error:", err);
        // Don't fail the request if email fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Submission saved successfully",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error processing submission:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

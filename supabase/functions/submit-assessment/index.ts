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

    // Send email notification to admin via Resend (if configured)
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");

    if (resendApiKey && adminEmail) {
      try {
        const timestamp = new Date().toLocaleString("en-US", {
          dateStyle: "full",
          timeStyle: "long",
        });

        const totalScore = data.scores.body + data.scores.picture + data.scores.word +
          data.scores.logic + data.scores.music + data.scores.people;

        const careersList = data.recommendedCareers.map((c: string) => `<li style="margin: 4px 0;">${c}</li>`).join("");

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background: linear-gradient(135deg, #0ea5e9, #10b981); padding: 20px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Assessment Submission</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Career Intelligence Assessment</p>
            </div>
            <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Student Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #6b7280; width: 140px;">Name:</td><td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${data.fullName}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Email:</td><td style="padding: 8px 0; color: #1f2937;">${data.email}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Submitted:</td><td style="padding: 8px 0; color: #1f2937;">${timestamp}</td></tr>
              </table>

              <h2 style="color: #1f2937; margin-top: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Intelligence Scores (Max 24 each)</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; color: #6b7280;">Body Smart:</td><td style="padding: 6px 0; color: #1f2937; font-weight: 500;">${data.scores.body}/24</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Picture Smart:</td><td style="padding: 6px 0; color: #1f2937; font-weight: 500;">${data.scores.picture}/24</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Word Smart:</td><td style="padding: 6px 0; color: #1f2937; font-weight: 500;">${data.scores.word}/24</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Logic/Math Smart:</td><td style="padding: 6px 0; color: #1f2937; font-weight: 500;">${data.scores.logic}/24</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Music Smart:</td><td style="padding: 6px 0; color: #1f2937; font-weight: 500;">${data.scores.music}/24</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">People Smart:</td><td style="padding: 6px 0; color: #1f2937; font-weight: 500;">${data.scores.people}/24</td></tr>
              </table>

              <div style="background: linear-gradient(135deg, #0ea5e9, #10b981); color: white; padding: 16px; border-radius: 8px; margin-top: 20px; text-align: center;">
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">Highest Intelligence</p>
                <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: bold;">${data.highestIntelligence}</p>
                <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">Total Score: ${totalScore}/144</p>
              </div>

              <h2 style="color: #1f2937; margin-top: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Recommended Careers</h2>
              <ul style="margin: 8px 0; padding-left: 20px; color: #1f2937;">${careersList}</ul>

              <h2 style="color: #1f2937; margin-top: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Feedback</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Easy to use:</td><td style="padding: 6px 0; color: #1f2937;">${data.feedback?.easyToUse || 'Not provided'}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Enjoyed test:</td><td style="padding: 6px 0; color: #1f2937;">${data.feedback?.enjoyedTest || 'Not provided'}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Quick feedback:</td><td style="padding: 6px 0; color: #1f2937;">${data.feedback?.quickFeedback || 'Not provided'}</td></tr>
              </table>
            </div>
            <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
              Career Intelligence Assessment - Based on Multiple Intelligences Theory
            </p>
          </div>
        `;

        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Career Assessment <noreply@resend.dev>",
            to: adminEmail,
            subject: `New Assessment: ${data.fullName} - ${data.highestIntelligence}`,
            html: emailHtml,
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Resend API error:", errorData);
        }
      } catch (err) {
        console.error("Email notification error:", err);
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

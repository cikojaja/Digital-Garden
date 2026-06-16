// Deno Edge Function to securely forward chef feedback to Notion database
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY")
const NOTION_DATABASE_ID = Deno.env.get("NOTION_DATABASE_ID")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, email } = await req.json()

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
      return new Response(
        JSON.stringify({ error: "Missing Notion secrets NOTION_API_KEY or NOTION_DATABASE_ID in Supabase environment." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Post to Notion API
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          "Feedback": {
            "title": [
              {
                "text": { "content": text }
              }
            ]
          },
          "User Email": {
            "email": email || "guest@gastro.com"
          },
          "Date": {
            "date": { "start": new Date().toISOString() }
          }
        }
      })
    })

    const responseData = await response.json()
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to add entry to Notion database.")
    }

    return new Response(
      JSON.stringify({ success: true, data: responseData }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Notion forward error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})

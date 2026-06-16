# Supabase & Notion Feedback Automation Workflow

This repository contains a reusable workflow to securely sync user feedback from any web application to a Notion database using Supabase Edge Functions.

---

## How it Works (Data Flow)

Here is a simple layout of how the feedback flows from your user's screen into Notion:

```text
[ Chef Types Feedback ]
         │
         ▼
[ Your Web App / Browser ] 
         │
         │ (Calls Supabase Function)
         ▼
[ Supabase Edge Function ]  ◄─── [ Hidden Notion API Key ] (Kept secure in Cloud)
         │
         │ (Sends request to Notion)
         ▼
[ Notion API ]
         │
         ▼
[ Notion Database Table ]   ◄─── (Adds a new feedback row instantly!)
```

### Why do we use this workflow?
By sending the feedback through the **Supabase Edge Function** instead of directly from the app, **we never expose your Notion API key to the public**. The key remains locked safely in Supabase.

---

## What's Included:
1. **`setup.py`**: An interactive python script. Run it in your project root to auto-generate Supabase config files and create the corresponding feedback database in your Notion workspace.
2. **`supabase/functions/send-feedback/index.ts`**: The Deno Edge Function that proxies requests to Notion safely.
3. **`SKILL.md`**: An AI Agent skill definition. Drop this into your `.agents/skills/` directory so AI assistants instantly understand how to configure and deploy this setup.

---

## Setup & Installation

### Step 1: Copy Files
Copy the `setup.py`, `supabase/` directory, and `SKILL.md` into your target web application's root directory.

### Step 2: Share a Notion Page
1. Create a blank page in Notion.
2. Go to **Share** (top right) -> search for your Notion integration (e.g. `Gastroly`) -> click **Invite**.

### Step 3: Run the Bootstrapper
In your project directory, run:
```bash
python3 setup.py
```
This will:
* Write your Supabase project keys to `js/config.js`.
* Contact the Notion API, find your shared page, and create the `Chef Feedback` database table with the required schema automatically.

### Step 4: Deploy to Supabase
Run these commands in your project root to save the credentials as environment secrets and deploy the edge function:
```bash
# Log in to your Supabase CLI
npx supabase login

# Set Notion credentials in Supabase
npx supabase secrets set NOTION_API_KEY="your-notion-token" NOTION_DATABASE_ID="your-created-database-id" --project-ref your-project-ref

# Deploy the Edge Function
npx supabase functions deploy send-feedback --project-ref your-project-ref
```

---
name: supabase-notion-bootstrap
description: Activates when the user wants to connect a web application to Supabase database, set up authentication, build secure file storage, or connect Notion feedback databases with Edge Functions.
---
# Supabase & Notion Bootstrap Skill

Use this skill to automatically bootstrap Supabase credentials, deploy database tables, configure public storage buckets, and link Notion database connectors.

## Workflow Instructions

1. **Configure Credentials (`js/config.js`)**
   * Put the Supabase URL (no `/rest/v1/` suffix) and Anon Key in `js/config.js`.

2. **Supabase Database SQL Schema**
   * Create the `profiles` table (id references `auth.users`, username, paypal_username, lang, updated_at).
   * Create the `recipes` table (id, user_id references `auth.users`, title, description, source, image_url, ingredients jsonb, steps jsonb, notes, is_favorite, is_shared, local_id unique).
   * Enable RLS on both tables.
   * Enable a select policy for public viewing of shared recipes (`is_shared = true`).

3. **Storage Bucket & Policy**
   * Create a public storage bucket named `recipe-images`.
   * Add a custom policy allowing `SELECT, INSERT, UPDATE, DELETE` operations for target role `authenticated` where folder name matches `auth.uid()::text`.

4. **Notion Feedback Integration**
   * Help the user create a Notion integration at `notion.so/my-integrations` and link it to a blank page.
   * Run the interactive setup script `python3 setup.py` to search the shared page, create the `Chef Feedback` database, and configure columns (`Feedback` [title], `User Email` [email], `Date` [date]).
   * Instruct the user to save `NOTION_API_KEY` and `NOTION_DATABASE_ID` in the Supabase Edge Functions Secrets console.
   * Deploy the edge function using:
     ```bash
     npx supabase functions deploy send-feedback --project-ref <project-ref>
     ```

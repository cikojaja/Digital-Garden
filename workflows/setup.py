#!/usr/bin/env python3
import os
import json
import urllib.request
import urllib.error

def print_banner():
    print("=" * 60)
    print("        GASTROLY SYSTEM BOOTSTRAPPER & SETUP TOOL")
    print("=" * 60)
    print("This script will configure your Supabase connection, create your")
    print("Notion feedback database, and verify your API keys.")
    print("-" * 60)

def prompt_credentials():
    # 1. Supabase credentials
    print("\n--- 1. SUPABASE CONFIGURATION ---")
    project_ref = input("Enter your Supabase Project Reference (e.g., gppmjoyizrrigudbgqst): ").strip()
    while not project_ref:
        project_ref = input("Project Reference cannot be empty: ").strip()

    supabase_url = f"https://{project_ref}.supabase.co"
    print(f"Supabase URL set to: {supabase_url}")

    anon_key = input("Enter your Supabase anon/public API key (starts with eyJ...): ").strip()
    while not anon_key or not anon_key.startswith("eyJ"):
        anon_key = input("Invalid Anon Key. It must start with 'eyJ': ").strip()

    # 2. Notion credentials
    print("\n--- 2. NOTION CONFIGURATION ---")
    notion_token = input("Enter your Notion Integration Token (starts with ntn_): ").strip()
    while not notion_token or not notion_token.startswith("ntn_"):
        notion_token = input("Invalid Notion Token. It must start with 'ntn_': ").strip()

    return project_ref, supabase_url, anon_key, notion_token

def search_notion_pages(token):
    url = "https://api.notion.com/v1/search"
    headers = {
        "Authorization": f"Bearer {token}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
    data = {"filter": {"value": "page", "property": "object"}}
    
    req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            response = json.loads(res.read().decode())
            return response.get("results", [])
    except urllib.error.HTTPError as e:
        print(f"\n[Error] Notion API returned error {e.code}: {e.reason}")
        return None
    except Exception as e:
        print(f"\n[Error] Could not search Notion pages: {e}")
        return None

def create_notion_database(token, parent_page_id):
    url = "https://api.notion.com/v1/databases"
    headers = {
        "Authorization": f"Bearer {token}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
    data = {
        "parent": {"type": "page_id", "page_id": parent_page_id},
        "title": [{"type": "text", "text": {"content": "Chef Feedback"}}],
        "properties": {
            "Feedback": {"title": {}},
            "User Email": {"email": {}},
            "Date": {"date": {}}
        }
    }
    
    req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            return json.loads(res.read().decode())
    except Exception as e:
        print(f"\n[Error] Failed to create Notion database: {e}")
        return None

def write_supabase_config(project_dir, supabase_url, anon_key):
    config_path = os.path.join(project_dir, "js", "config.js")
    content = f"""// Supabase Connection Credentials
// Replace the values below with your credentials from the Supabase Settings -> API dashboard.
export const SUPABASE_URL = "{supabase_url}";
export const SUPABASE_ANON_KEY = "{anon_key}";
"""
    try:
        with open(config_path, "w") as f:
            f.write(content)
        print(f"\n[Success] Written credentials to {config_path}")
        return True
    except Exception as e:
        print(f"\n[Error] Could not write to config.js: {e}")
        return False

def main():
    print_banner()
    project_dir = os.path.dirname(os.path.abspath(__file__))
    
    project_ref, supabase_url, anon_key, notion_token = prompt_credentials()
    
    # Write config file
    if not write_supabase_config(project_dir, supabase_url, anon_key):
        return

    # Verify Notion Page & Create Database
    print("\nConnecting to Notion API...")
    pages = search_notion_pages(notion_token)
    
    if pages is None:
        print("[Abort] Notion verification failed. Please verify your Notion Token.")
        return
        
    if not pages:
        print("\n" + "!" * 60)
        print("ALERT: No pages are shared with your Notion integration yet!")
        print("Please do the following:")
        print("  1. Open a page in Notion.")
        print("  2. Click 'Share' in the top right.")
        print("  3. Search for your integration name, select it, and click 'Invite'.")
        print("!" * 60)
        input("\nPress Enter once you have shared the page to retry...")
        pages = search_notion_pages(notion_token)
        if not pages:
            print("[Abort] Still no shared pages found. Aborting Notion database creation.")
            return

    target_page = pages[0]
    print(f"Found shared parent page. Creating database inside...")
    
    db_response = create_notion_database(notion_token, target_page['id'])
    if not db_response:
        print("[Error] Notion database creation failed.")
        return
        
    db_id = db_response['id']
    print(f"\n[Success] Created Notion Database!")
    print(f"  * Database ID: {db_id}")
    print(f"  * Database URL: {db_response['url']}")

    print("\n" + "=" * 60)
    print("                SETUP COMPLETE!")
    print("=" * 60)
    print("Next Steps to deploy your Backend (Supabase):")
    print("-" * 60)
    print("1. Set your Notion Secrets in your Supabase Dashboard:")
    print(f"   * NOTION_API_KEY = {notion_token}")
    print(f"   * NOTION_DATABASE_ID = {db_id}")
    print("   (Go to Settings -> Edge Functions on Supabase to enter them)")
    print("")
    print("2. Deploy the Feedback Edge Function via terminal:")
    print("   npx supabase login")
    print(f"   npx supabase functions deploy send-feedback --project-ref {project_ref}")
    print("=" * 60)

if __name__ == "__main__":
    main()

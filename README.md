# Ciko's Developer Workspace & Personal Brand OS

Welcome to my unified developer workspace! This monorepo consolidates my developer portfolio, Notion feedback automation workflows, and custom Claude Code skills.

---

## 🗺️ Workspace Directory Structure

This repository is organized into three main modules:

*   **[📁 claude-skills/](./claude-skills)** — Custom skills and prompt playbooks built for Claude Code to automate brand research, content strategy, and session wrapups.
*   **[📁 workflows/](./workflows)** — Serverless cloud configurations (Supabase Edge Functions & Notion API) to capture feedback and sync it securely.
*   **[📁 portfolio/](./portfolio)** — My personal developer portfolio site showcasing active projects, apps, and client landing pages.

---

## 🛠️ Module Overview

| Module | Description | Key Files / Subfolders | How to Use |
| :--- | :--- | :--- | :--- |
| **`claude-skills`** | Automation skills for brand identity definition, Google NotebookLM automation, and prompt strategy. | `brand-identity-skill.skill`, `prompt-playbook.md`, `NotebookLMSkill.md`, `learning_skill.md` | Drag into Claude Code or run custom slash commands. |
| **`workflows`** | Secure Notion database logger with Supabase secrets. | `setup.py`, `supabase/functions/send-feedback/` | Run `setup.py` to bootstrap Notion database & push Edge Functions. |
| **`portfolio`** | Developer portfolio site showcasing client work. | `GermanApps/`, `dev/`, `horst-koenig/`, `planten-coffee/` | Host on Vercel with root directory set to `/portfolio`. |

---

## 🔄 How the Systems Connect

This ecosystem is designed to run in parallel:

```text
       ┌──────────────────────── Ciko's Workspace ────────────────────────┐
       │                                                                  │
       ├─► [ claude-skills ] ──────► Brand Analysis & Content Strategy    │
       │                                                                  │
       ├─► [ portfolio ] ──────────► Showcases apps & captures user input  │
       │                                                                  │
       └─► [ workflows ] ──────────► Syncs user input to Notion securely   │
                                                                          │
       ==================== SECURE FEEDBACK LOGGING FLOW ====================
       
       [ User in Portfolio App ] ──► [ Supabase Edge Function ] ──► [ Notion DB ]
                                       (Hides Notion API Key)
```

---

## 🚀 Getting Started

### 1. Clone this Repository
```bash
git clone https://github.com/cikojaja/Personal-Brand.git
cd Personal-Brand
```

### 2. Local Setup for Modules

*   **Portfolio:**
    ```bash
    cd portfolio
    # Start your local server or configure build settings
    ```
    *Note: When deploying the portfolio to Vercel, make sure to set the **Root Directory** settings to `portfolio`.*

*   **Workflows (Supabase & Notion):**
    ```bash
    cd workflows
    # Install Python packages and run database bootstrap script
    python setup.py
    ```

---

## 👤 About the Author

Built by Ciko — Indonesian chef in Hamburg, building web solutions and workflows in the hours before work.
*   **Instagram:** [@cikojaja](https://instagram.com/cikojaja)
*   **Website:** [smartkartoffel.com](https://smartkartoffel.com)

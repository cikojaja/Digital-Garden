// ── Mobile Menu Toggle ───────────────────────────────────
const mobileToggle = document.querySelector('.mobile-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (mobileToggle && mobileNav) {
  mobileToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    mobileToggle.classList.toggle('active');
    
    // Animate lines to X
    const lines = mobileToggle.querySelectorAll('span');
    if (mobileNav.classList.contains('open')) {
      lines[0].style.transform = 'translateY(8px) rotate(45deg)';
      lines[1].style.transform = 'translateY(-8px) rotate(-45deg)';
      if (lines[2]) lines[2].style.opacity = '0';
    } else {
      lines[0].style.transform = 'none';
      lines[1].style.transform = 'none';
      if (lines[2]) lines[2].style.opacity = '1';
    }
  });

  // Close mobile nav on click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      const lines = mobileToggle.querySelectorAll('span');
      lines[0].style.transform = 'none';
      lines[1].style.transform = 'none';
      if (lines[2]) lines[2].style.opacity = '1';
    });
  });
}

// ── Interactive Terminal Engine ──────────────────────────
const terminalInput = document.getElementById('terminal-input');
const terminalOutputs = document.getElementById('terminal-outputs');
const terminalBody = document.getElementById('terminal-body');

let commandHistory = [];
let historyIndex = 0;

const MOCK_FILESYSTEM = {
  'bio.json': {
    name: "Ciko",
    age: 26,
    origin: "Bandung, Indonesia 🇮🇩",
    location: "Hamburg, Germany 🇩🇪",
    status: "Chef in Hamburg // AI Builder at 4AM",
    mission: "Building SaaS products from scratch. No coach, no code, no excuses."
  },
  'grind.json': {
    indonesia_savings: "250€ (money saved to move to Germany)",
    past_setback: "$40,000 lost in past venture, woke up the next morning to rebuild",
    routine: "04:00 wake-up, build SaaS, learn AI & software, 08:00 calisthenics, work 10h chef shift",
    philosophy: "This is not a highlight reel — it's a documentary. The build never stops."
  },
  'skills.json': {
    learning_path: ["100% Self-taught developer", "No CS degree or bootcamps", "Learning by building at 4AM"],
    connected_systems: ["Designing end-to-end workflows (UI + AI + Backend)", "Notion API integrations (Webhooks)", "Connecting OpenAI GPT"],
    logic_and_data: ["Cost calculations (room sizing/prices)", "Cart persistence (localStorage)", "PostgreSQL database logs"],
    stack: ["React", "Node.js", "Express", "PostgreSQL", "REST APIs", "Git"]
  },
  'experience.json': {
    roles: [
      {
        company: "SmartKartoffel (EdTech SaaS)",
        role: "Founder & Lead Engineer",
        period: "2025 - Present",
        details: "Conceived and coded an AI German tutor explaining grammar in 25 native languages. Designed prompts, APIs, and Postgres schema from zero."
      },
      {
        company: "Gastronomy Industry (Hamburg)",
        role: "Chef",
        period: "2023 - Present",
        details: "Executing fast-paced culinary service in 10-hour shifts, funding the AI build independently, executing under high stress."
      },
      {
        company: "Freelance Web Engineering",
        role: "Full-Stack Developer",
        period: "2025",
        details: "Built booking systems, calculators, and API pipelines scoring >95 on Lighthouse audits."
      }
    ]
  },
const COMMANDS = {
  help: () => {
    return `Available commands:
  <span class="cmd-highlight">about</span>              Show Ciko's background summary
  <span class="cmd-highlight">routine</span>            Print daily timeline CET
  <span class="cmd-highlight">numbers</span>            Show raw metrics (setbacks/capital)
  <span class="cmd-highlight">skills</span>             Print tech stack & automations
  <span class="cmd-highlight">tools</span>              List primary software & dev tools
  <span class="cmd-highlight">timeline</span>           View journey log timeline
  <span class="cmd-highlight">projects</span>           List selected web systems
  <span class="cmd-highlight">contact</span>            Show direct contact details & socials
  <span class="cmd-highlight">cat [file.json]</span>    Inspect files (e.g. cat bio.json)
  <span class="cmd-highlight">clear</span>              Reset terminal history`;
  },
  
  about: () => {
    return `<span style="color: var(--accent-cyan); font-weight: bold;">Ciko — Self-taught Builder & Chef.</span>
--------------------------------------------------
A 26-year-old Indonesian immigrant in Germany. 
<span style="color: var(--accent-gold);">No computer science degree. No coding bootcamps.</span>
Learned 100% by myself building at 4AM before 
working 10-hour kitchen shifts in Hamburg.

- <span style="color: var(--accent-purple);">No coach. No code. No excuses.</span>
- Documenting the climb in real-time.`;
  },

  routine: () => {
    return `<span style="color: var(--accent-cyan); font-weight: bold;">Daily Routine CET Timeline:</span>
--------------------------------------------------
<span style="color: var(--accent-purple);">04:00 - 06:30</span> | 💻 Coding SmartKartoffel, AI automation, & learning AI/software
<span style="color: var(--accent-purple);">06:30 - 08:00</span> | 📝 Documenting/editing content for socials
<span style="color: var(--accent-purple);">08:00 - 10:00</span> | 🤸 Calisthenics bodyweight training
<span style="color: var(--accent-purple);">10:00 - 20:00</span> | 🍳 10-hour kitchen chef shift
<span style="color: var(--accent-purple);">22:00</span>         | 💤 Sleep & reset`;
  },

  numbers: () => {
    return `<span style="color: var(--accent-cyan); font-weight: bold;">Brand Metrics:</span>
--------------------------------------------------
<span style="color: var(--accent-gold);">Arrived in DE with</span> │ <span style="color: var(--accent-emerald);">250€</span> (Total Savings)
<span style="color: var(--accent-gold);">Past Failure</span>       │ <span style="color: #ef4444;">-$40,000</span> (Lost, woke up and rebuilt)
<span style="color: var(--accent-gold);">Current Age</span>        │ 26
<span style="color: var(--accent-gold);">Wake-up Time</span>       │ 04:00 AM every day
<span style="color: var(--accent-gold);">Social Handle</span>      │ @cikojaja`;
  },

  skills: () => {
    return `<span style="color: var(--accent-cyan); font-weight: bold;">How I Build Systems & Automations:</span>
--------------------------------------------------
<span style="color: var(--accent-gold); font-weight: bold;">[Creating Connected Systems]</span>
  - Designing end-to-end workflows (connecting frontend UI, AI models, and backend APIs)
  - Notion API integration (creating cards automatically via webhooks)
  - Connecting OpenAI (GPT) to web applications
  
<span style="color: var(--accent-gold); font-weight: bold;">[Logic & Data Flows]</span>
  - Quiz bots that screen and filter leads based on budget/needs
  - Cost calculators (computing rooms & prices in Malerei König)
  - Cart memory & state persistence (localStorage)
  - Storing user history & query logs in PostgreSQL
  
<span style="color: var(--accent-gold); font-weight: bold;">[The Stack I Use]</span>
  <span style="color: var(--accent-purple);">React</span>, <span style="color: var(--accent-purple);">Node.js</span>, <span style="color: var(--accent-purple);">Express</span>, <span style="color: var(--accent-purple);">PostgreSQL</span>, <span style="color: var(--accent-purple);">REST APIs</span>, <span style="color: var(--accent-purple);">Git</span> (Self-taught)`;
  },

  tools: () => {
    return `<span style="color: var(--accent-cyan); font-weight: bold;">Tools of the Builder:</span>
--------------------------------------------------
- AI Coding:        <span style="color: var(--accent-purple);">Antigravity, Claude, Gemini</span>
- Research & Study: <span style="color: var(--accent-gold);">NotebookLM</span>
- Version Control:  <span style="color: var(--accent-purple);">GitHub</span>
- Hosting & DB:     <span style="color: var(--accent-emerald);">Vercel, Railway, Supabase</span>
- Integrations:     <span style="color: var(--accent-gold);">Notion API, Resend (Emails)</span>`;
  },

  timeline: () => {
    return `<span style="color: var(--accent-cyan); font-weight: bold;">Journey Log:</span>
--------------------------------------------------
● <span style="color: var(--accent-gold);">[2025] Founder & Solo Engineer (SmartKartoffel SaaS)</span>
  ├── Engineered LLM translation pipeline & SQL logs
  └── Built in public at 4AM before kitchen shifts
● <span style="color: var(--accent-gold);">[2023 - Present] Chef (Gastronomy, Hamburg)</span>
  ├── Managing high-stress kitchen service (10-hour shifts)
  └── Funding capital for SaaS builds independently
● <span style="color: var(--accent-gold);">[2025] Freelance Web Developer</span>
  └── Created custom client booking estimators & interfaces`;
  },

  projects: () => {
    return `<span style="color: var(--accent-cyan); font-weight: bold;">Selected Web Systems:</span>
--------------------------------------------------
1. <span style="color: var(--accent-gold);">SmartKartoffel</span>       [SaaS Startup] React/Node.js, OpenAI API
   ↳ AI German tutor explaining grammar in 25 languages with Camera OCR Scan.
2. <span style="color: var(--accent-gold);">JPKE</span>                 [Concept Prototype] Notion CRM Integration
   ↳ Automated lead-qualification chatbot that syncs to Notion CRM.
3. <span style="color: var(--accent-gold);">Malerei König</span>        [Concept Study] CSS Grid, Perf Optimization
   ↳ Painting service concept with cost calculator, 98/100 Lighthouse.
4. <span style="color: var(--accent-gold);">Planten Coffee</span>       [Concept Redesign] SVG Custom Animations
   ↳ Specialty café menu with clientside localStorage cart.

<span style="color: var(--accent-purple);">Click any project card below to view detailed pipeline flow charts!</span>`;
  },

  sudo: (arg) => {
    if (arg === 'unlock-bonus') {
      return `<span style="color: var(--accent-emerald); font-weight: bold;">Access Granted: Root privileges active.</span>
--------------------------------------------------
<span style="color: var(--accent-cyan); font-weight: bold;">CIKO'S CORE STRENGTHS:</span>

● <span style="color: var(--accent-gold); font-weight: bold;">Learn Smart & Learn Fast</span>
  No CS degree. No coding bootcamps. Self-taught developer 
  who understands systems, logic flows, and architectures 
  entirely by building real-world products.
  
● <span style="color: var(--accent-gold); font-weight: bold;">Execute Fast</span>
  Turning concepts into working web tools at speed. Waking up 
  at 4AM to write, deploy, and refine code daily before chef shifts.
  
● <span style="color: var(--accent-gold); font-weight: bold;">AI-Native Daily Workflows</span>
  Applying AI to everything. If a process in my daily life or 
  work is manual, I write a script or connect GPT/Claude to automate it.`;
    }
    return `sudo: permission denied. Try <span class="cmd-highlight">sudo unlock-bonus</span>.`;
  },

  contact: () => {
    return `<span style="color: var(--accent-cyan); font-weight: bold;">Connect directly:</span>
--------------------------------------------------
- Email:      <a href="mailto:rico.jonathan80@gmail.com" style="color: var(--accent-cyan); text-decoration: underline;">rico.jonathan80@gmail.com</a>
- GitHub:     <a href="https://github.com/cikojaja" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">github.com/cikojaja</a>
- Socials:    <span style="color: var(--accent-gold);">@cikojaja</span> (Instagram, TikTok, YouTube)
- Status:     Documenting the climb. Let's build together.`;
  }
};

// JSON Syntax Highlighter function
function syntaxHighlightJson(jsonObj) {
  let jsonStr = JSON.stringify(jsonObj, null, 2);
  jsonStr = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return jsonStr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
    let cls = 'json-number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'json-key';
      } else {
        cls = 'json-string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'json-boolean';
    } else if (/null/.test(match)) {
      cls = 'json-null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

// Interpret input command
function handleCommand(inputStr) {
  const cleanInput = inputStr.trim();
  if (cleanInput === '') return;

  commandHistory.push(cleanInput);
  historyIndex = commandHistory.length;

  appendLine(`ciko@workspace:~$ ${cleanInput}`, 'user-cmd');

  const parts = cleanInput.split(' ');
  const cmd = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ');

  if (cmd === 'clear') {
    terminalOutputs.innerHTML = '';
    return;
  }

  let output = '';
  const fs = MOCK_FILESYSTEM;

  if (cmd === 'cat') {
    if (!arg) {
      output = `Error: Please specify a file name. Example: cat bio.json`;
    } else if (fs[arg]) {
      output = syntaxHighlightJson(fs[arg]);
    } else {
      output = `cat: ${arg}: No such file or directory. Type <span class="cmd-highlight">help</span> to list commands.`;
    }
  } else if (COMMANDS[cmd]) {
    output = COMMANDS[cmd](arg);
  } else {
    output = `Command not found: "${cmd}". Type <span class="cmd-highlight">help</span> for a list of available commands.`;
  }

  appendLine(output);
}

// Append line helper
function appendLine(text, className = '') {
  const line = document.createElement('div');
  line.className = `terminal-line ${className}`;
  line.innerHTML = text;
  terminalOutputs.appendChild(line);
  
  // Auto scroll to bottom
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Global invocation helper (linked to bento card triggers)
window.runTerminalCommand = function(cmdString) {

  if (terminalInput) {
    terminalInput.value = cmdString;
    setTimeout(() => {
      handleCommand(cmdString);
      terminalInput.value = '';
      terminalInput.focus();
    }, 450);
  }
};

// Input event listeners
if (terminalInput) {
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const value = terminalInput.value;
      handleCommand(value);
      terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  if (terminalBody) {
    terminalBody.addEventListener('click', () => {
      terminalInput.focus();
    });
  }
}

// ── Project Modal Pipeline Database ───────────────────────
const MODAL_PROJECTS = {
  'smartkartoffel': {
    title: "SmartKartoffel",
    liveUrl: "../GermanApps/index.html",
    appUrl: "../GermanApps/app.html",
    githubUrl: "https://github.com/cikojaja/Portfolio/tree/main/GermanApps",
    iconSvg: `<svg class="modal-proj-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3c-4.5 0-8 3-8 7.5s2.5 7.5 6 8.5c1.5.5 3 .5 4.5 0 3.5-1 6-4 6-8.5S16.5 3 12 3z" />
      <circle cx="8" cy="9" r="1" fill="currentColor"/>
      <circle cx="16" cy="11" r="1" fill="currentColor"/>
      <circle cx="12" cy="14" r="1" fill="currentColor"/>
      <path d="M19 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="currentColor" stroke="none"/>
    </svg>`,
    badges: ["SaaS Startup", "AI Integration", "Product Design"],
    workflow: [
      { 
        name: "1. Speech/Text Input", 
        desc: "User inputs German sentence",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>`
      },
      { 
        name: "2. Camera Scan / OCR", 
        desc: "Scans real-world German text from menus/signs via camera",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><circle cx="12" cy="13" r="4"/></svg>`
      },
      { 
        name: "3. LLM Parse Pipeline", 
        desc: "GPT-4o audits grammar & rules",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>`
      },
      { 
        name: "4. Multi-lang Translation", 
        desc: "Translates explanation to 25 languages",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM12 7v10M9 10h6"/></svg>`
      },
      { 
        name: "5. SQL Metric Sync", 
        desc: "Updates Postgres analytics logs",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4"/></svg>`
      }
    ],
    guidelines: [
      "AI Pipeline optimization: Response context latency minimized to &lt; 1.2s.",
      "Reliability architecture: Redundant REST API fallbacks implemented on network timeouts.",
      "Database strategy: PostgreSQL triggers monitor daily prompts to detect subscription abuse.",
      "Vision API & OCR: Integrated image scan parser that extracts text from menus and signage to look up German words instantly."
    ]
  },
  'jpke': {
    title: "JPKE Lead Funnel Pipeline",
    liveUrl: "https://jpke.vercel.app/",
    githubUrl: "https://github.com/cikojaja/Portfolio",
    iconSvg: `<svg class="modal-proj-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
      <circle cx="18.7" cy="8" r="2" fill="currentColor" />
      <circle cx="7" cy="14.3" r="2" fill="currentColor" />
      <path d="M21 5h-4v4" />
    </svg>`,
    badges: ["Notion CRM Integration", "DE/EN Translation", "Funnels & API Automation"],
    workflow: [
      { 
        name: "1. Visitor Inbound", 
        desc: "User triggers site dialog",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.18 7.18A9 9 0 1 1 12 3v4"/></svg>`
      },
      { 
        name: "2. Interactive Bot Quiz", 
        desc: "Assesses serious buyer criteria",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>`
      },
      { 
        name: "3. AI Translation & Format", 
        desc: "Translates German inputs to English summaries",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4"/></svg>`
      },
      { 
        name: "4. Notion Database Sync", 
        desc: "Pushes CRM card to Notion board",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4-4m-4 4l4 4"/></svg>`
      }
    ],
    guidelines: [
      "Bilingual Translation Engine: Integrates GPT models to translate prospect requests (German) into formatted English logs for CRM uniformity.",
      "Lead scoring logic: Automatically filters out spam based on budget thresholds.",
      "CRM pipeline modularity: Designed layout to be easily integrated into any service business model.",
      "Notification pipeline: Automatically alerts Slack/Email channels on lead creation."
    ]
  },
  'malerei-koenig': {
    title: "Malerei König Estimation Tool",
    liveUrl: "../horst-koenig/index.html",
    githubUrl: "https://github.com/cikojaja/Portfolio/tree/main/horst-koenig",
    iconSvg: `<svg class="modal-proj-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 3h12v4H6z" />
      <path d="M19 7v2a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7" />
      <path d="M12 12v6" />
      <path d="M9 18h6" />
      <path d="M8 5l2-2 2 2 2-2 2 2" />
    </svg>`,
    badges: ["Dynamic Cost Estimator", "98/100 Speed Optimization", "Custom Javascript Grid"],
    workflow: [
      { 
        name: "1. Paint Dimensions", 
        desc: "User input of room sizes",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zM8 4v16M16 4v16M4 8h16M4 16h16"/></svg>`
      },
      { 
        name: "2. Quote Generator", 
        desc: "Estimator computes paint/cost values",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 11h.01M9 11h.01M12 8h.01M15 11h.01M15 8h.01M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/></svg>`
      },
      { 
        name: "3. Scheduling Slot", 
        desc: "Client books direct appointment calendar",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/></svg>`
      },
      { 
        name: "4. Automation Gateway", 
        desc: "Pushes form to serverless Sheet logs",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 0 0-1.022-.547l-2.387-.477a6 6 0 0 0-3.86.517l-.318.158a6 6 0 0 1-3.86.517L5.05 15.02a2 2 0 0 1-1.154-1.994V4.722c0-1.01.7-1.84 1.685-1.96l2.19-.267a6 6 0 0 1 4.37 1.135l.07.053a6 6 0 0 0 4.37 1.135l2.8-.342A1.82 1.82 0 0 1 21 6.3c0 10.38-7 12.7-7 12.7"/></svg>`
      }
    ],
    guidelines: [
      "Custom Javascript calculator logic avoids heavy third-party script load times.",
      "Lighthouse performance audited at 98/100 through layout lazy-loading patterns.",
      "Responsive CSS Grid setup maintains layout structure on any phone viewport."
    ]
  },
  'planten-coffee': {
    title: "Planten Coffee Interface",
    liveUrl: "../planten-coffee/index.html",
    githubUrl: "https://github.com/cikojaja/Portfolio/tree/main/planten-coffee",
    iconSvg: `<svg class="modal-proj-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <path d="M10 2c0 2-2 3-2 3s3-1 3-3z" />
      <path d="M14 2c0 2-2 3-2 3s3-1 3-3z" />
    </svg>`,
    badges: ["Digital Retail Menu", "SVG Vector Animations", "Clientside Shopping Cart"],
    workflow: [
      { 
        name: "1. Order Selection", 
        desc: "Customer clicks café items",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`
      },
      { 
        name: "2. localStorage Sync", 
        desc: "Adds item objects to local arrays",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4-4m-4 4l4 4"/></svg>`
      },
      { 
        name: "3. Micro-Interaction UI", 
        desc: "Spring menu drawer recalculates total sum",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.286L13 21l-2.286-6.857L5 12l5.714-2.286L13 3z"/></svg>`
      },
      { 
        name: "4. Checkout Payload", 
        desc: "Pushes shopping items data to checkout API",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`
      }
    ],
    guidelines: [
      "Bespoke cart mechanics handled entirely on clientside for instant feedback.",
      "SVG custom vectors scale dynamically to look smooth on high-density screens.",
      "Animations utilize CSS transform transitions to trigger GPU-acceleration."
    ]
  }
};

const projectModal = document.getElementById('project-modal');
const modalMeta = document.getElementById('modal-project-meta');
const modalTitle = document.getElementById('modal-project-title');
const modalWorkflow = document.getElementById('modal-workflow-flow');
const modalGuidelines = document.getElementById('modal-guidelines-list');

let activeOriginCard = null; // Store card that opened modal for reverse animation

window.openProjectModal = function(projectId, clickedCard) {
  const proj = MODAL_PROJECTS[projectId];
  if (!proj) return;

  activeOriginCard = clickedCard;

  // Clear contents
  modalMeta.innerHTML = '';
  modalWorkflow.innerHTML = '';
  modalGuidelines.innerHTML = '';

  // Setup Title with dynamic SVG icon
  modalTitle.innerHTML = `${proj.iconSvg || ''} <span>${proj.title}</span>`;

  // Setup Badges
  proj.badges.forEach(b => {
    const span = document.createElement('span');
    span.className = 'badge';
    span.textContent = b;
    modalMeta.appendChild(span);
  });

  // Setup Workflow Flowchart
  proj.workflow.forEach((step, idx) => {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'flow-step';
    stepDiv.innerHTML = `
      <div class="flow-step-icon">${step.iconSvg || ''}</div>
      <strong>${step.name}</strong>
      <div class="flow-step-desc">${step.desc}</div>
    `;
    modalWorkflow.appendChild(stepDiv);

    if (idx < proj.workflow.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'flow-arrow';
      arrow.textContent = '→';
      modalWorkflow.appendChild(arrow);
    }
  });

  // Setup Guidelines
  proj.guidelines.forEach(g => {
    const li = document.createElement('li');
    li.innerHTML = g;
    modalGuidelines.appendChild(li);
  });

  // Setup Project Links
  const linksContainer = document.getElementById('modal-project-links');
  if (linksContainer) {
    linksContainer.innerHTML = '';
    
    if (proj.liveUrl) {
      const liveBtn = document.createElement('a');
      liveBtn.className = 'btn-visit-project';
      liveBtn.href = proj.liveUrl;
      liveBtn.target = '_blank';
      liveBtn.innerHTML = `🔗 Live Website ↗`;
      linksContainer.appendChild(liveBtn);
    }
    
    if (proj.githubUrl) {
      const ghBtn = document.createElement('a');
      ghBtn.className = 'btn-visit-project';
      ghBtn.href = proj.githubUrl;
      ghBtn.target = '_blank';
      ghBtn.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      ghBtn.style.color = '#ffffff';
      ghBtn.innerHTML = `🐙 View Source Code ↗`;
      
      ghBtn.onmouseenter = () => {
        ghBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        ghBtn.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.1)';
      };
      ghBtn.onmouseleave = () => {
        ghBtn.style.background = 'transparent';
        ghBtn.style.boxShadow = 'none';
      };
      
      linksContainer.appendChild(ghBtn);
    }
    
    if (proj.appUrl) {
      const appBtn = document.createElement('a');
      appBtn.className = 'btn-visit-project';
      appBtn.href = proj.appUrl;
      appBtn.target = '_blank';
      appBtn.style.borderColor = 'rgba(74, 222, 128, 0.25)';
      appBtn.style.color = 'var(--accent-emerald)';
      appBtn.innerHTML = `⚡ Launch Web App ↗`;
      
      // Dynamic hover effects
      appBtn.onmouseenter = () => {
        appBtn.style.background = 'var(--accent-emerald)';
        appBtn.style.color = '#0b0b0e';
        appBtn.style.boxShadow = '0 0 15px rgba(74, 222, 128, 0.35)';
      };
      appBtn.onmouseleave = () => {
        appBtn.style.background = 'rgba(74, 222, 128, 0.06)';
        appBtn.style.color = 'var(--accent-emerald)';
        appBtn.style.boxShadow = 'none';
      };
      
      linksContainer.appendChild(appBtn);
    }
  }

  const modalCard = document.querySelector('.modal-card');

  if (clickedCard && modalCard) {
    // 1. First state: Get coordinates of the clicked bento card
    const firstRect = clickedCard.getBoundingClientRect();

    // Show overlay but temporarily disable transition on the modal card
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // 2. Last state: Get coordinates of the final modal card layout
    const lastRect = modalCard.getBoundingClientRect();

    // 3. Invert state: Calculate position offsets and scale factors
    const invertX = firstRect.left + (firstRect.width / 2) - (lastRect.left + (lastRect.width / 2));
    const invertY = firstRect.top + (firstRect.height / 2) - (lastRect.top + (lastRect.height / 2));
    const invertScaleX = firstRect.width / lastRect.width;
    const invertScaleY = firstRect.height / lastRect.height;

    // Apply invert transform instantly
    modalCard.style.transition = 'none';
    modalCard.style.transform = `translate(${invertX}px, ${invertY}px) scale(${invertScaleX}, ${invertScaleY})`;
    modalCard.style.opacity = '0';

    // Hide internal elements during expansion for high visual quality
    const children = modalCard.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i] !== modalTitle && !children[i].classList.contains('modal-close-btn')) {
        children[i].style.opacity = '0';
        children[i].style.transition = 'opacity 0.2s ease';
      }
    }

    // 4. Play state: Remove transforms to trigger browser layout transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modalCard.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        modalCard.style.transform = 'none';
        modalCard.style.opacity = '1';

        // Fade in children slightly delayed
        setTimeout(() => {
          for (let i = 0; i < children.length; i++) {
            children[i].style.opacity = '1';
          }
        }, 150);
      });
    });
  } else {
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeProjectModal = function() {
  const modalCard = document.querySelector('.modal-card');
  
  if (activeOriginCard && modalCard) {
    const firstRect = activeOriginCard.getBoundingClientRect();
    const lastRect = modalCard.getBoundingClientRect();

    const invertX = firstRect.left + (firstRect.width / 2) - (lastRect.left + (lastRect.width / 2));
    const invertY = firstRect.top + (firstRect.height / 2) - (lastRect.top + (lastRect.height / 2));
    const invertScaleX = firstRect.width / lastRect.width;
    const invertScaleY = firstRect.height / lastRect.height;

    // Fade out children first
    const children = modalCard.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i] !== modalTitle && !children[i].classList.contains('modal-close-btn')) {
        children[i].style.opacity = '0';
      }
    }

    modalCard.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    modalCard.style.transform = `translate(${invertX}px, ${invertY}px) scale(${invertScaleX}, ${invertScaleY})`;
    modalCard.style.opacity = '0';
    projectModal.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    projectModal.classList.remove('active');

    setTimeout(() => {
      document.body.style.overflow = '';
      modalCard.style.transform = 'none';
      modalCard.style.opacity = '';
      projectModal.style.transition = '';
      for (let i = 0; i < children.length; i++) {
        children[i].style.opacity = '';
      }
      activeOriginCard = null;
    }, 500);
  } else {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Close modal on background click
if (projectModal) {
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      closeProjectModal();
    }
  });
}

// ── Glow Card Effect Interaction & 3D Hover Tilt ─────────
(function() {
  // 1. Hover Glow effect for all bento, blueprint, and CTA cards
  const glowCards = document.querySelectorAll('.bento-card, .blueprint-card, .cta-card');
  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(56, 189, 248, 0.08), transparent 80%)`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.background = 'none';
      }
    });
  });

  // 2. 3D Hover Tilt effect (excluding fanned project cards and service cards)
  const tiltCards = document.querySelectorAll('.blueprint-card, .bento-card:not(.project-deck-card):not(.service-card), .cta-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      // Normalized coordinates relative to card center [-1, 1]
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      
      // Smooth, elegant 3D tilt limits (max 10 deg rotation)
      const rotateY = x * 10;
      const rotateX = -y * 8;
      
      // Apply transform with perspective, scaling it up slightly (1.02)
      card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.02)`;
      card.style.transition = 'transform 0.1s ease'; // real-time responsive tracking
      
      // Displacement offset for the box shadow to enhance the 3D depth perception
      const shadowX = -x * 6;
      const shadowY = -y * 6;
      card.style.boxShadow = `${shadowX}px ${shadowY}px 32px rgba(0, 0, 0, 0.35), 0 0 20px rgba(56, 189, 248, 0.04) inset`;
    });
    
    card.addEventListener('mouseleave', () => {
      // Gracefully restore back to the original position and look
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.boxShadow = '';
      
      // Clear temporary transition after restore is complete
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });
  });
})();

// ── Premium GSAP Timed Slider Engine Removed (Fanned deck replaces slider) ──

// ── Preloader Animation Logic ──────────────────────────
(function() {
  const loader = document.getElementById('loader');
  const loaderLogo = document.querySelector('.loader-logo');
  const loaderPct = document.querySelector('.loader-pct');
  const loaderMsg = document.querySelector('.loader-msg');
  
  if (!loader || !loaderLogo || !loaderPct || !loaderMsg) return;
  
  // Disable body scroll while loading
  document.body.style.overflow = 'hidden';
  
  const statusMessages = [
    { threshold: 15, text: "Initializing 4AM session..." },
    { threshold: 35, text: "Loading system workflows..." },
    { threshold: 55, text: "Compiling chef shift logs..." },
    { threshold: 75, text: "Syncing Notion automations..." },
    { threshold: 90, text: "Finalizing interface nodes..." },
    { threshold: 100, text: "Launching workspace!" }
  ];
  
  let progress = 0;
  let pageLoaded = false;
  
  // Check if browser loading is done
  window.addEventListener('load', () => {
    pageLoaded = true;
  });
  
  const interval = setInterval(() => {
    // Increment loading percentage
    if (progress < 85) {
      progress += Math.floor(Math.random() * 2) + 1; // slower increment speed
    } else if (progress < 99 && pageLoaded) {
      progress += 1; // wait for window load or complete slowly
    } else if (progress >= 99 && pageLoaded) {
      progress = 100;
    }
    
    // Clamp progress
    if (progress > 100) progress = 100;
    
    // Update elements
    loaderLogo.style.backgroundSize = `${progress}% 100%`;
    loaderPct.textContent = `${String(progress).padStart(2, '0')}%`;
    
    // Update status text messages based on percentage thresholds
    const activeMsg = statusMessages.find(m => progress <= m.threshold);
    if (activeMsg) {
      loaderMsg.textContent = activeMsg.text;
    }
    
    if (progress === 100) {
      clearInterval(interval);
      
      // Delay slightly at 100% to let users feel the finish, then open curtains
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Trigger reveal animations for hero elements
        if (typeof window.triggerHeroReveal === 'function') {
          window.triggerHeroReveal();
        }
        
        // Fully remove preloader element from DOM layout after transition ends (matching 1.6s transition duration)
        setTimeout(() => {
          loader.style.display = 'none';
        }, 1700);
      }, 500); // 500ms delay at 100%
    }
  }, 38); // slower interval (from 22ms to 38ms)
  
  // Hard fallback: never lock user screen more than 8s
  setTimeout(() => {
    clearInterval(interval);
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    
    if (typeof window.triggerHeroReveal === 'function') {
      window.triggerHeroReveal();
    }
    
    setTimeout(() => {
      loader.style.display = 'none';
    }, 1700);
  }, 8000);
})();

// ── Header Scrolled State & Scroll Spy ───────────────────
(function() {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.desktop-nav a');
  const sections = document.querySelectorAll('section[id], .bento-card[id], .bento-utilities-grid[id]');

  function onScroll() {
    // 1. Toggle scrolled class
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // 2. Scroll Spy active nav link
    let currentId = '';
    const scrollPos = window.scrollY + 120; // offset for sticky/fixed nav

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Run on init in case page is already scrolled on load
  onScroll();
})();

// ── Folder Interaction Navigation & Eye Tracking ─────────
(function() {
  window.scrollSection = function(selector) {
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  window.focusWorkspaceTerminal = function() {
    const term = document.getElementById('terminal');
    const input = document.getElementById('terminal-input');
    
    if (term) {
      term.classList.add('terminal-glow-active');
      term.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        term.classList.remove('terminal-glow-active');
      }, 1500);
    }
    
    if (input) {
      input.focus();
    }
  };

  // ── Character Video Autoplay ──
  const charVideo = document.getElementById('character-video');
  if (charVideo) {
    charVideo.play().catch(() => {});
  }
})();

// ── Premium Reveal Scroll Animations ─────────────────────
(function() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-scale');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal-stagger')) {
          // Trigger all child reveals inside this container sequentially
          const children = entry.target.querySelectorAll('.reveal, .reveal-scale');
          children.forEach(child => child.classList.add('active'));
        } else {
          entry.target.classList.add('active');
        }
        // Unobserve after showing so we don't repeat animations on scroll back
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05, // trigger when 5% is visible
    rootMargin: "0px 0px -40px 0px" // trigger slightly before entering viewport
  });
  // 1. Process all staggered containers
  const staggerContainers = document.querySelectorAll('.reveal-stagger');
  staggerContainers.forEach(container => {
    // Skip hero container so we can run our custom timeline sequence
    if (container.closest('#hero')) return;
    
    const children = container.querySelectorAll('.reveal, .reveal-scale');
    children.forEach((child, index) => {
      // Set transition-delay programmatically based on element order
      child.style.transitionDelay = `${(index + 1) * 0.12}s`;
    });
    
    revealObserver.observe(container);
  });

  // 2. Process all standalone reveal elements
  revealElements.forEach(el => {
    // Skip if element is in hero section or managed by a stagger container
    if (el.closest('#hero') || el.closest('.reveal-stagger')) return;
    revealObserver.observe(el);
  });

  // Boot typing/reveal effect for terminal lines inside the hero
  window.bootTerminalLines = function() {
    const lines = document.querySelectorAll('#terminal-body > .terminal-line');
    lines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add('revealed');
      }, index * 220); // 220ms stagger between each system log line
    });
  };

  // Global function to trigger hero section entry reveal animations (Option G - Stagger)
  window.triggerHeroReveal = function() {
    const character = document.querySelector('.hero-bg-character-container');
    const introH1 = document.querySelector('#hero .hero-intro-text h1');
    const introP = document.querySelector('#hero .hero-intro-text p');
    const folders = document.querySelectorAll('#hero .mac-folders-dock .reveal-scale');
    const terminal = document.querySelector('#hero .terminal-widget');
    const social = document.querySelector('#hero .hero-social-dock');
    const header = document.querySelector('header.reveal-header');

    // 0. Character fades and scales in first, as curtains open
    if (character) {
      setTimeout(() => {
        character.classList.add('active');
      }, 50);
    }

    // 1. Text fades & slides in first
    if (introH1) {
      setTimeout(() => {
        introH1.classList.add('active');
      }, 200);
    }
    
    if (introP) {
      setTimeout(() => {
        introP.classList.add('active');
      }, 450);
    }

    // 2. Folder icons scale up one-by-one after the text
    folders.forEach((folder, idx) => {
      setTimeout(() => {
        folder.classList.add('active');
      }, 800 + (idx * 200)); // 200ms delay between folder icon slide-ins (800ms, 1000ms, 1200ms)
    });

    // 3. Terminal widget container appears next
    if (terminal) {
      setTimeout(() => {
        terminal.classList.add('active');
        
        // 4. Text inside the terminal boot sequence prints line-by-line after it enters
        setTimeout(() => {
          if (typeof window.bootTerminalLines === 'function') {
            window.bootTerminalLines();
          }
        }, 850);
      }, 1550);
    }

    // 5. Social dock links and header navigation menu appear last
    if (social) {
      setTimeout(() => {
        social.classList.add('active');
      }, 2450);
    }

    if (header) {
      setTimeout(() => {
        header.classList.add('active');
      }, 2700);
    }
  };
})();

// ── Mobile Layout Switching & Interactions Demo ──
(function() {
  // Generic Deck Manager Class
  class DeckManager {
    constructor(containerSelector, cardSelector) {
      this.container = document.querySelector(containerSelector);
      if (!this.container) return;
      
      this.cards = this.container.querySelectorAll(cardSelector);
      this.order = Array.from({ length: this.cards.length }, (_, i) => i);
      this.isAnimating = false;
      this.init();
    }
    
    init() {
      // 1. Initial positioning
      this.updateClasses();
      
      // 2. Click intercept handler (using capture to block onclick if background card is clicked)
      this.cards.forEach((card, idx) => {
        card.addEventListener('click', (e) => {
          // Verify if layout-deck is active on container
          if (this.container.classList.contains('layout-deck')) {
            const isFront = card.classList.contains('deck-front');
            if (!isFront) {
              e.preventDefault();
              e.stopPropagation();
              this.cycle();
            }
          }
        }, { capture: true });
      });
    }
    
    updateClasses() {
      this.cards.forEach((card, idx) => {
        card.classList.remove('deck-front', 'deck-middle', 'deck-back', 'deck-far-back', 'deck-hidden', 'deck-transition-out');
        
        const orderPos = this.order.indexOf(idx);
        if (orderPos === 0) {
          card.classList.add('deck-front');
        } else if (orderPos === 1) {
          card.classList.add('deck-middle');
        } else if (orderPos === 2) {
          card.classList.add('deck-back');
        } else if (orderPos === 3) {
          card.classList.add('deck-far-back');
        } else {
          card.classList.add('deck-hidden');
        }
      });
    }
    
    cycle() {
      if (this.isAnimating) return;
      this.isAnimating = true;
      
      const frontIdx = this.order[0];
      const frontCard = this.cards[frontIdx];
      
      // Animate slide-out
      frontCard.classList.add('deck-transition-out');
      
      setTimeout(() => {
        this.order.push(this.order.shift());
        this.updateClasses();
        this.isAnimating = false;
      }, 350);
    }
  }

  let projectsDeck = null;

  // Global Tab switcher for Services Bento Dash-Tab
  window.setServiceActiveTab = function(index) {
    const tabs = document.querySelectorAll('.services-tabs-menu .tab-btn');
    const cards = document.querySelectorAll('#services .service-card');
    
    tabs.forEach((tab, idx) => {
      if (idx === index) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    cards.forEach((card, idx) => {
      if (idx === index) {
        card.classList.add('tab-active');
        if (window.gsap) {
          window.gsap.fromTo(card, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" });
        }
      } else {
        card.classList.remove('tab-active');
      }
    });
  };

  // Initialize decks on load
  function initDecks() {
    projectsDeck = new DeckManager('.project-deck-container', '.project-deck-card');
    
    // Stacked social cards expand/collapse logic
    const stackedCards = document.getElementById('stacked-social-cards');
    const toggleBtn = document.getElementById('btn-toggle-social');
    
    if (stackedCards && toggleBtn) {
      stackedCards.addEventListener('click', function(e) {
        if (!stackedCards.classList.contains('is-active')) {
          stackedCards.classList.add('is-active');
          toggleBtn.textContent = 'Show less';
        }
      });

      toggleBtn.addEventListener('click', function(e) {
        if (stackedCards.classList.contains('is-active')) {
          e.stopPropagation(); // Prevent container click from re-expanding
          stackedCards.classList.remove('is-active');
          toggleBtn.textContent = 'Show more';
        }
      });
    }
  }

    });
  }

  function initLangSwitchers() {
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
      });
    });

    const savedLang = localStorage.getItem('portfolio-lang') || 'en';
    setLanguage(savedLang);
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
      initDecks();
      initLangSwitchers();
    });
  } else {
    initDecks();
    initLangSwitchers();
  }
})();




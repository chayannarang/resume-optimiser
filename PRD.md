PRD — ResumeOptimiser
Version: 4.0
Author: Chayan Narang
Status: Final — Ready to Build

Problem Statement
Job seekers spend hours manually tailoring CVs for each application with no way to measure effectiveness. ATS systems reject strong candidates because of poor keyword matching, not poor experience. There is no free, simple tool that shows you exactly where you stand — and fixes it instantly.

Design Principle
Minimal cognitive load at every step.

User makes as few decisions as possible
Toggles and checkboxes over text input
Smart defaults everywhere
One primary action per screen state
Never show empty results — always guide user to next step


User Personas
PersonaExperienceKey PainPrimary WorkflowFresh Graduate0-2 yearsCV not ATS readyW2 — Platform OptimiseMid Level Professional3-6 yearsNot getting shortlistedW1 — JD MatchSenior Professional7+ yearsRepositioning for new roleW1 — JD MatchCareer SwitcherAnySkill gap too visibleW1 — JD MatchReturning ProfessionalAnyCareer gap on CVW1 — JD Match

Landing Page — Empty State
┌─────────────────────────────────────────┐
│         ResumeOptimiser                 │
│   AI-powered CV optimisation. Free.     │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ JD Match Mode  │ Platform Mode  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [JD input field — empty]               │
│  [CV input field — empty]               │
│                                         │
│  [ Analyse ] ← greyed out / disabled    │
│                                         │
│  🔒 Your data is never stored.          │
│     Powered by Groq Llama 3.3 70B.     │
│     All processing in real time.        │
└─────────────────────────────────────────┘
Rules:

Analyse button disabled until all required fields filled
Tab defaults to JD Match Mode
Privacy notice always visible at bottom
Score cards hidden until analysis runs
Placeholder JD field: "Paste job description here or enter a URL above"
Placeholder CV field: "Paste your CV as plain text or upload a file below"


Two Workflows

Workflow 1 — JD Match Mode
"I have a specific job I want to apply to"
Step 1 — Inputs
Enter JD URL (optional):
[ https://... ] → [ Fetch ]
— or —
Paste JD text:
[ ________________________________ ]

Upload CV (PDF or Word):
[ Choose File ] — max 5MB
— or —
Paste CV as text:
[ ________________________________ ]
Step 2 — Selections
Which ATS are you applying through? (optional)
( ) Generic ATS  ← default
( ) Workday
( ) Greenhouse
( ) Lever
( ) Naukri
( ) LinkedIn Easy Apply

[ Analyse My CV ] ← enabled once required fields filled
Step 3 — Loading States
[▓▓░░░░░░░░] Uploading your resume...
[▓▓▓▓░░░░░░] Extracting resume content...
[▓▓▓▓▓░░░░░] Reading the job description...
[▓▓▓▓▓▓░░░░] Matching keywords and skills...
[▓▓▓▓▓▓▓░░░] Scoring your ATS compatibility...
[▓▓▓▓▓▓▓▓░░] Generating your recommendations...
[▓▓▓▓▓▓▓▓▓▓] Done!
Step 4 — Before Score Display
YOUR CURRENT CV SCORE

ATS Match         [████░░░░░░]  43%  ⚠️  Needs Work
Keyword Coverage  [███░░░░░░░]  38%  ⚠️  Needs Work
Formatting        [███████░░░]  72%  ✅  Strong Match

Missing Keywords: stakeholder management,
                  product-led growth, agile delivery

Skills Gap:
  🔴 Critical:     SQL, CDP experience
  🟡 Recommended:  A/B testing, Agile
Step 5 — CV Rewriter
Rewrite my CV for this role:
( ) Keep original structure
( ) Make it more strategic / senior
( ) Make it more execution / hands-on

[ Rewrite CV ]
Step 6 — After Score Display
YOUR OPTIMISED CV SCORE

ATS Match         [█████████░]  87%  ✅  Strong Match  ↑ +44%
Keyword Coverage  [█████████░]  91%  ✅  Strong Match  ↑ +53%
Formatting        [██████████]  95%  ✅  Strong Match  ↑ +23%

What changed:
→ 12 keywords injected
→ 4 bullet points rewritten
→ Summary section updated
→ Skills section reorganised
Step 7 — Before / After View
┌──────────────────┬──────────────────┐
│   BEFORE  43%    │   AFTER   87%    │
│                  │                  │
│ [Original CV]    │ [Rewritten CV]   │
└──────────────────┴──────────────────┘
Step 8 — Recommendations Panel
RECOMMENDATIONS
→ Add SQL to your skills section
→ Reframe bullet point 3 to show business impact
→ Add a summary section targeting this role
→ Remove table formatting — ATS unfriendly
Step 9 — Download
Download your optimised CV as:
( ) PDF      — best for email applications
( ) Word     — best for further editing

[ Download ]

Workflow 2 — Platform Optimise Mode
"I want a stronger CV for a platform, no specific JD"
Step 1 — Input
Upload CV (PDF or Word): [ Choose File ]
— or —
Paste CV as text: [ ________________________________ ]

Optimise for:
( ) Naukri
( ) LinkedIn
( ) Indeed
( ) Glassdoor
( ) Generic ATS

Industry / role hint (optional, max 100 chars):
[ ________________________________ ]

[ Optimise My CV ]
Step 2 — Loading
[▓▓▓░░░░░░░] Uploading your resume...
[▓▓▓▓▓░░░░░] Applying Naukri formatting rules...
[▓▓▓▓▓▓▓░░░] Checking keyword coverage...
[▓▓▓▓▓▓▓▓▓▓] Done!
Step 3 — Output
Formatting Score  [████████░░]  81%  ✅  Strong Match
Keyword Coverage  [██████░░░░]  61%  🟡  Good Start

Platform Tips:
→ Rewrite headline for Naukri search visibility
→ Reorganise skills section to top
→ Add expected CTC field guidance

Skills Gap:
  🔴 Critical:     Python, SQL
  🟡 Recommended:  Agile, Stakeholder Management
Step 4 — Download
Download as:
( ) PDF
( ) Word

[ Download ]

Input Validation
FieldRuleError MessageJD textMin 150 characters"JD seems too short. Please paste the full job description"JD textMax 1500 words"JD is too long. Please trim to key sections"CV textMin 100 characters"CV seems too short. Please paste your full CV"CV textMax 1500 words"CV is too long. Please trim to 2 pages of content"CV filePDF or .docx only"Only PDF and Word (.docx) files are supported"CV fileMax 5MB"File exceeds 5MB limit. Please upload a smaller file"Both fieldsCannot be emptyAnalyse button stays disabledLanguageEnglish only"Only English CVs and JDs are supported currently"Combined lengthMax 3000 words"Combined CV and JD too long. Please trim one or both. Recommended max: 2000-2500 words"Role hintMax 100 characters"Role hint must be under 100 characters"Platform selectionMust select one"Please select a target platform"

Error Scenarios
ScenarioUser MessageActionJD URL scrape fails"Couldn't fetch this URL. Please paste the JD text below"Show JD text fieldJD URL is LinkedIn"LinkedIn URLs can't be scraped. Please paste the JD text below"Show JD text fieldFile parse failure"Couldn't read your file. Please try a different file or paste as text"Show paste fallbackScanned/image PDF"Scanned CVs aren't supported. Please paste your CV as text"Show paste fallbackGroq API down"Our AI service is temporarily unavailable. Please try again in a few minutes"Show retry buttonGroq API timeout >30s"This is taking longer than usual. Please try again"Show retry buttonGroq rate limit hit"You've hit the free usage limit. Please try again in a few minutes"Show 60s countdown + retryGroq malformed response"Something went wrong. Please try again"Log error, show retryToken limit exceeded"Your inputs are too long. Please shorten your resume or JD and try again"Inline guidanceNetwork failure"Connection lost. Please check your network and try again"Show retry buttonEmpty analysis result"Analysis incomplete. Please check your inputs and try again"Show retryDownload fails"Download failed. Copy your CV below instead"Show copy to clipboard

Scoring Methodology
All scores computed by Groq via structured prompt. Returned as JSON. App parses and renders.
ATS Match Score (0-100)
Weighted:
Role / title alignment:        25%
Required skills match:         35%
Nice to have skills match:     15%
Years of experience match:     15%
Education / certification:     10%
Keyword Coverage % (0-100)
= (JD keywords found in CV / Total JD keywords) x 100
Top 20 keywords extracted from JD, checked against CV
Formatting Score (0-100)
Presence of standard sections (Contact, Summary, Experience, Education, Skills)
Appropriate bullet point usage
Chronological ordering
Length (1-2 pages ideal)
No tables or graphics
Consistent date formats
Skills Gap
Critical — required skills in JD completely absent from CV
Recommended — preferred skills absent from CV
Shown as categorised list with one suggested action per gap
Not a numeric score

Score Display
Progress bar + % + colour label + delta after rewrite

[████░░░░░░]  43%  ⚠️  Needs Work        ← before
[█████████░]  87%  ✅  Strong Match  ↑ +44%  ← after

0–40%   = Red    ⚠️  "Needs Work"
41–70%  = Amber  🟡  "Good Start"
71–100% = Green  ✅  "Strong Match"

Progress bar fill and % label both colour coded
Background track always light grey

Download Spec
ItemSpecFormat selectionRadio button — PDF (default) or WordButton label"Download Report"PDF contentOptimised CV + all scores + recommendations + privacy footerWord contentOptimised CV + all scores + recommendations + privacy footerFile namingResumeOptimiser_JDMatch_2026-03-31.pdfFallbackCopy to clipboard if download fails

Privacy & Data

No user data stored anywhere
CV and JD sent to Groq API for real time processing only
No database, no user accounts, no content logging
No cookies, no analytics tracking
Always visible on app and in downloaded report:
"Your data is never stored. Powered by Groq Llama 3.3 70B. All processing happens in real time."


LLM & API Constraints
ItemDetailProviderGroqModelLlama 3.3 70B (llama-3.3-70b-versatile)Max tokens per request4000 tokensMax input tokens~3000 tokensMax completion tokens~1000 tokensTemperature0.3 (low — consistent scoring)Expected response time2-5 secondsFree tier rate limit~30 requests/minuteRate limit handling60s countdown + retry, no auto loopMalformed responseCatch JSON parse errors, show retryAPI key storage.env file only, never pushed to GitHub

Tech Stack
LayerToolCostBuilderClaude CodePro planFrontendReact + Vite + TailwindFreeFile parsingpdf-parse, mammothFreeReport generationjsPDF, docxFreeLLMGroq Llama 3.3 70BFree tierHostingVercelFreeRepoGitHubFree
Total cost: $0

Folder Structure
resume-optimiser/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx
│   │   ├── UploadForm.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── ResultsPage.jsx
│   │   ├── ScoreCard.jsx
│   │   ├── BeforeAfterView.jsx
│   │   ├── SkillsGap.jsx
│   │   ├── DownloadPanel.jsx
│   │   ├── HRMSSelector.jsx
│   │   ├── RecommendationsPanel.jsx
│   │   └── PrivacyNotice.jsx
│   ├── api/
│   │   └── analyse.js
│   ├── utils/
│   │   ├── parseFile.js
│   │   ├── tokenEstimate.js
│   │   └── generateReport.js
│   ├── hooks/
│   │   └── useAnalysis.js
│   ├── constants/
│   │   └── platforms.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── PRD.md
├── .env.example
├── .env
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js

MVP Feature Scope
FeatureWorkflowMVPEmpty landing stateBoth✅JD text inputW1✅JD URL scraper (graceful fail)W1✅CV text inputBoth✅CV file upload (PDF/Word)Both✅Input validationBoth✅HRMS selectorW1✅Loading progress barBoth✅ATS score before (bar + colour)W1✅CV Rewriter with tone optionsW1✅ATS score after (bar + delta)W1✅Skills Gap (Critical + Recommended)Both✅Recommendations panelBoth✅Before/After side by sideW1✅Output format selectorBoth✅Download PDF / WordBoth✅Copy to clipboard fallbackBoth✅Naukri optimiserW2✅LinkedIn optimiserW2✅Privacy notice (UI + report)Both✅Error handling all scenariosBoth✅Mobile responsiveBoth✅

Out of Scope (V2+)

User accounts / login
Saved sessions / multi-JD tracker
Cover letter generator
LinkedIn summary generator
Multi-language support
Dark mode
Chrome extension
Mobile app (iOS/Android)
Paid tier / subscription
Team or recruiter features
Batch processing
Direct job board integrations
Analytics tracking


Success Metrics
MetricTarget (3 months)Weekly active users500Analysis completion rate> 80%Download rate> 40%Error rate< 5%Time to results< 15 secondsReturn usage> 25%User satisfaction (thumbs up)> 70% positiveData breach incidents0

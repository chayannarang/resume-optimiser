DESIGN_SYSTEM — ResumeOptimiser
Version: 1.0
Status: Final — Ready to Implement

Design Direction
Dark mode. Linear-inspired. Sharp, modern, premium.
Deep dark backgrounds. Crisp typography. Subtle borders. Clean whitespace.
Smooth animations on score bars and loading states.
No gradients on white. No generic AI aesthetics.


---


COLOR PALETTE

Background Colors
--bg-base:        #0A0A0A   — primary page background (near-black)
--bg-surface:     #111111   — card / panel backgrounds
--bg-elevated:    #1A1A1A   — input fields, code blocks, hover states
--bg-overlay:     #222222   — modal backgrounds, dropdown menus

Border Colors
--border-subtle:  #2A2A2A   — default card and input borders
--border-default: #333333   — slightly more visible borders
--border-active:  #4A4A4A   — focused inputs, active states

Text Colors
--text-primary:   #F5F5F5   — headlines, primary content
--text-secondary: #A0A0A0   — labels, supporting text, captions
--text-muted:     #5A5A5A   — placeholder text, disabled states
--text-inverse:   #0A0A0A   — text on light/accent backgrounds

Accent — Electric Blue
--accent:         #2B7FFF   — primary CTA buttons, links, active tabs
--accent-hover:   #1A6EEE   — hover state for accent elements
--accent-muted:   #1A3A66   — accent background chips, subtle highlights
--accent-glow:    rgba(43, 127, 255, 0.15)  — card hover glow, focus rings

Score Colors
--score-red:      #EF4444   — 0–40%   "Needs Work"
--score-amber:    #F59E0B   — 41–70%  "Good Start"
--score-green:    #22C55E   — 71–100% "Strong Match"

--score-red-bg:   rgba(239, 68,  68,  0.10)
--score-amber-bg: rgba(245, 158, 11,  0.10)
--score-green-bg: rgba(34,  197, 94,  0.10)

Score track (progress bar background)
--track:          #222222   — unfilled portion of all progress bars

Status / Semantic Colors
--error:          #EF4444
--error-bg:       rgba(239, 68, 68, 0.10)
--warning:        #F59E0B
--warning-bg:     rgba(245, 158, 11, 0.10)
--success:        #22C55E
--success-bg:     rgba(34, 197, 94, 0.10)
--info:           #2B7FFF
--info-bg:        rgba(43, 127, 255, 0.10)


---


TYPOGRAPHY

Font Choices
Display / Headlines:  Space Grotesk       — bold, geometric, distinctly non-generic
Body / UI:            DM Sans             — clean, readable, modern sans
Mono / Code / Scores: JetBrains Mono      — sharp mono for percentages, labels, snippets

Google Fonts import order:
  Space Grotesk: weights 500, 600, 700
  DM Sans: weights 400, 500
  JetBrains Mono: weights 400, 500

Type Scale
Size     Token         Usage
------   ------        ------
40px     --text-4xl    Hero headline (landing page title)
32px     --text-3xl    Section headline (e.g. "YOUR CURRENT CV SCORE")
24px     --text-2xl    Card title, modal heading
20px     --text-xl     Sub-section label, large body
16px     --text-base   Default body, input text, button label
14px     --text-sm     Secondary labels, captions, helper text
12px     --text-xs     Microlabels, badges, timestamps
11px     --text-2xs    Legal text, privacy notice fine print

Score Percentage Display
  Font:   JetBrains Mono, 700
  Size:   24px (--text-2xl)
  Color:  Matches score band (red / amber / green)

Score Band Label ("Needs Work", "Good Start", "Strong Match")
  Font:   DM Sans, 500
  Size:   13px
  Color:  Matches score band

Delta Label ("↑ +44%")
  Font:   JetBrains Mono, 500
  Size:   13px
  Color:  --score-green (#22C55E)

Line Heights
  Display:  1.1
  Body:     1.6
  Mono:     1.4

Letter Spacing
  Display headlines:   -0.02em  (tight)
  Section labels:      0.08em   (slightly tracked out — uppercase labels)
  Body:                0em      (default)

Text Transform
  Section labels (e.g. "RECOMMENDATIONS", "YOUR CURRENT CV SCORE"):
    font-family: Space Grotesk
    font-weight: 600
    font-size: 11px
    letter-spacing: 0.10em
    text-transform: uppercase
    color: --text-secondary


---


COMPONENT STYLES

Buttons

Primary Button (CTA — "Analyse My CV", "Rewrite CV", "Download")
  Background:       --accent (#2B7FFF)
  Text:             #FFFFFF, DM Sans 500, 15px
  Border radius:    4px   — sharp, not rounded
  Padding:          12px 24px
  Border:           none
  Hover:            background --accent-hover (#1A6EEE), translate Y -1px
  Active:           background #1660D6, translate Y 0
  Disabled:         background #1A1A1A, text --text-muted, cursor not-allowed
  Transition:       background 150ms ease, transform 150ms ease

Secondary Button ("Fetch", "Copy to Clipboard")
  Background:       transparent
  Text:             --text-primary, DM Sans 500, 14px
  Border:           1px solid --border-default (#333333)
  Border radius:    4px
  Padding:          10px 18px
  Hover:            border-color --border-active (#4A4A4A), background --bg-elevated
  Transition:       border-color 150ms ease, background 150ms ease

Danger / Retry Button
  Background:       --error-bg
  Text:             --error (#EF4444), DM Sans 500, 14px
  Border:           1px solid rgba(239, 68, 68, 0.3)
  Border radius:    4px
  Padding:          10px 18px
  Hover:            border-color --error, background rgba(239, 68, 68, 0.15)


Cards

Default Card
  Background:       --bg-surface (#111111)
  Border:           1px solid --border-subtle (#2A2A2A)
  Border radius:    8px
  Padding:          24px
  Box shadow:       none (default)
  Hover:            border-color --border-default (#333333),
                    box-shadow 0 0 0 1px --accent-glow,
                    0 4px 24px rgba(43, 127, 255, 0.06)
  Transition:       border-color 200ms ease, box-shadow 200ms ease

Score Card (extends Default Card)
  Same as Default Card +
  On render (first appearance):
    Animate in from opacity 0, translateY 8px → opacity 1, translateY 0
    Duration: 300ms, easing: ease-out
    Delay: stagger 100ms per card (card 1: 0ms, card 2: 100ms, card 3: 200ms)

Before/After Card
  Background:       --bg-surface
  Border:           1px solid --border-subtle
  Border radius:    8px
  Padding:          20px
  Label badge:      "BEFORE" or "AFTER" — 10px uppercase, Space Grotesk 600,
                    letter-spacing 0.10em, color --text-secondary,
                    displayed above the card content

Error Banner
  Background:       --error-bg
  Border:           1px solid rgba(239, 68, 68, 0.3)
  Border radius:    6px
  Padding:          14px 18px
  Text:             --error, DM Sans 400, 14px
  Icon:             ⚠ left-aligned, same color


Inputs

Text Input / Textarea
  Background:       --bg-elevated (#1A1A1A)
  Border:           1px solid --border-subtle (#2A2A2A)
  Border radius:    6px
  Padding:          12px 16px
  Text:             --text-primary, DM Sans 400, 15px
  Placeholder:      --text-muted, DM Sans 400, 15px
  Focus:            border-color --accent (#2B7FFF),
                    box-shadow 0 0 0 3px rgba(43, 127, 255, 0.15),
                    outline none
  Error state:      border-color --error (#EF4444),
                    box-shadow 0 0 0 3px rgba(239, 68, 68, 0.12)
  Transition:       border-color 150ms ease, box-shadow 150ms ease

  Textarea min-height:  120px (JD input), 160px (CV input)
  Textarea resize:      vertical only

File Upload Zone
  Background:       --bg-elevated
  Border:           1px dashed --border-default (#333333)
  Border radius:    6px
  Padding:          32px 24px
  Text:             --text-secondary, DM Sans 400, 14px, center-aligned
  Icon:             Upload icon, --text-muted, 20px, centered above text
  Hover:            border-color --accent, background rgba(43, 127, 255, 0.04)
  Drag active:      border-color --accent, background rgba(43, 127, 255, 0.08)
  Transition:       border-color 150ms ease, background 150ms ease

Radio Button Group (ATS / Platform selector)
  Layout:           horizontal wrap, gap 8px
  Each option:      pill-style toggle button
    Background (unselected):  --bg-elevated
    Border (unselected):      1px solid --border-subtle
    Background (selected):    --accent-muted (#1A3A66)
    Border (selected):        1px solid --accent (#2B7FFF)
    Text (unselected):        --text-secondary, DM Sans 400, 13px
    Text (selected):          --text-primary, DM Sans 500, 13px
    Border radius:            4px
    Padding:                  8px 14px
    Transition:               all 150ms ease

Tab Switcher (JD Match / Platform Mode)
  Container:        background --bg-elevated, border-radius 6px, padding 4px
  Active tab:       background --bg-surface, border 1px solid --border-default,
                    border-radius 4px, text --text-primary, DM Sans 500, 14px
  Inactive tab:     background transparent, border none,
                    text --text-secondary, DM Sans 400, 14px
  Transition:       background 150ms ease


Progress Bars

Score Progress Bar
  Track height:     8px
  Track color:      --track (#222222)
  Track radius:     4px
  Fill radius:      4px
  Fill color:       matches score band (--score-red / --score-amber / --score-green)

  Animation (on mount):
    Width animates from 0% → actual score %
    Duration: 800ms
    Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)  — ease-out-quart
    Delay: 200ms after score card appears

Loading Progress Bar
  Track height:     3px
  Track color:      --border-subtle (#2A2A2A)
  Fill color:       --accent (#2B7FFF)
  Position:         fixed top of viewport (like a page-level loader)
  Width:            controlled by stage index (stage 1 = 14%, stage 7 = 100%)
  Animation:        width transition 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)

  Stage-to-width mapping (JD Match Mode, 7 stages):
    Stage 1:  14%
    Stage 2:  28%
    Stage 3:  42%
    Stage 4:  56%
    Stage 5:  70%
    Stage 6:  85%
    Stage 7:  100%

  Stage-to-width mapping (Platform Mode, 4 stages):
    Stage 1:  25%
    Stage 2:  50%
    Stage 3:  75%
    Stage 4:  100%


Badges / Chips

Score Band Badge ("Needs Work", "Good Start", "Strong Match")
  Border radius:    4px
  Padding:          3px 8px
  Font:             DM Sans 500, 12px
  Needs Work:       background --score-red-bg, text --score-red
  Good Start:       background --score-amber-bg, text --score-amber
  Strong Match:     background --score-green-bg, text --score-green

Skills Gap Badge
  Critical:         background --score-red-bg, text --score-red, 🔴 prefix
  Recommended:      background --score-amber-bg, text --score-amber, 🟡 prefix
  Border radius:    4px
  Padding:          3px 8px
  Font:             DM Sans 500, 12px

Keyword Chip (missing keyword list)
  Background:       --bg-elevated
  Border:           1px solid --border-subtle
  Border radius:    4px
  Padding:          4px 10px
  Font:             JetBrains Mono 400, 12px
  Color:            --text-secondary


---


ANIMATION SPECS

Score Bar Fill (on results appear)
  Property:         width
  From:             0%
  To:               {score}%
  Duration:         800ms
  Easing:           cubic-bezier(0.25, 0.46, 0.45, 0.94)
  Delay:            200ms + (card-index × 100ms stagger)

Score Card Entrance
  Properties:       opacity, transform (translateY)
  From:             opacity: 0, translateY: 8px
  To:               opacity: 1, translateY: 0
  Duration:         300ms
  Easing:           ease-out
  Delay:            stagger 100ms per card

Loading Stage Message
  Properties:       opacity, transform (translateY)
  Entering:         opacity 0 → 1, translateY 4px → 0, duration 200ms ease-out
  Exiting:          opacity 1 → 0, translateY 0 → -4px, duration 150ms ease-in

Loading Progress Bar Width
  Property:         width
  Duration:         400ms
  Easing:           cubic-bezier(0.25, 0.46, 0.45, 0.94)

Page / View Transitions (between states: form → loading → results)
  Properties:       opacity, transform (translateY)
  Entering view:    opacity 0 → 1, translateY 12px → 0, duration 350ms ease-out
  Exiting view:     opacity 1 → 0, translateY 0 → -8px, duration 200ms ease-in

Button hover lift
  Property:         transform (translateY)
  From:             translateY: 0
  To:               translateY: -1px
  Duration:         150ms ease

Card hover glow
  Property:         box-shadow, border-color
  Duration:         200ms ease

Delta label entrance ("↑ +44%")
  Properties:       opacity, transform (translateX)
  From:             opacity: 0, translateX: -6px
  To:               opacity: 1, translateX: 0
  Duration:         250ms ease-out
  Delay:            400ms after bar completes fill

Reduce motion
  All animations respect:
    @media (prefers-reduced-motion: reduce) → durations set to 0ms
    Progress bars still update value, just without animation


---


SPACING SYSTEM

Base unit: 4px

Token    px     Usage
------   ---    ------
space-1    4px   micro gaps (icon-to-label, inline badge padding)
space-2    8px   tight spacing (between radio pills, between badge and text)
space-3   12px   button padding vertical, input padding vertical
space-4   16px   input padding horizontal, between form fields
space-5   20px   card padding (compact), between score rows
space-6   24px   card padding (default), section gaps within a card
space-8   32px   between major sections on results page
space-10  40px   between top-level page sections
space-12  48px   hero / landing page vertical rhythm
space-16  64px   page top padding on desktop

Container max-width:  860px
Page horizontal padding:  16px (mobile), 24px (tablet), 32px (desktop)
Card gap (grid):  16px

Form field vertical gap:  16px (between input groups)
Label-to-input gap:       6px
Input-to-error gap:       6px
Error text:               DM Sans 400, 12px, --error color


---


RESPONSIVE BREAKPOINTS (Tailwind)

sm:   640px   — single column layout kicks in below this
md:   768px   — tablet: side-by-side panels become stacked
lg:   1024px  — desktop: full layout, max-width container centered
xl:   1280px  — no additional layout changes, max-width still 860px

Before/After View:
  Desktop (lg+):  two equal columns side by side
  Mobile (<lg):   stacked, AFTER on top, BEFORE below
                  "BEFORE" label visually de-emphasised on mobile

Radio/Pill groups:
  Desktop:  single row wrap
  Mobile:   two-column grid

Score cards:
  Desktop:  single column list within results card
  Mobile:   same — no change, already narrow

Tab switcher (JD Match / Platform Mode):
  Always full width of its container


---


ICONOGRAPHY

Source:    Lucide React (consistent, minimal, sharp)
Size:      16px default, 20px for emphasis icons
Color:     Inherits from context (--text-secondary for decorative, score color for status)
Stroke:    1.5px (Lucide default — do not override)

Key icons used:
  Upload:       lucide:upload-cloud
  Fetch/URL:    lucide:link
  Check:        lucide:check-circle-2   (used inline in "What changed" list)
  Warning:      lucide:alert-triangle
  Error:        lucide:x-circle
  Download:     lucide:download
  Copy:         lucide:clipboard
  Retry:        lucide:refresh-cw
  Lock:         lucide:lock            (privacy notice)
  Arrow up:     lucide:trending-up     (delta increase)
  Chevron:      lucide:chevron-right   (recommendation list items)


---


PRIVACY NOTICE COMPONENT

Position:  Bottom of every page, below all content
Style:
  Background:   transparent
  Border-top:   1px solid --border-subtle
  Padding:      16px 0
  Text:         DM Sans 400, 12px, --text-muted, center-aligned
  Icon:         lucide:lock, 12px, --text-muted, inline left of text

Content:
  "🔒 Your data is never stored.
   Powered by Groq Llama 3.3 70B.
   All processing happens in real time."


---


TAILWIND CONFIG TOKENS

The following custom tokens should be added to tailwind.config.js:

colors:
  bg:
    base:     '#0A0A0A'
    surface:  '#111111'
    elevated: '#1A1A1A'
    overlay:  '#222222'
  border:
    subtle:   '#2A2A2A'
    default:  '#333333'
    active:   '#4A4A4A'
  text:
    primary:   '#F5F5F5'
    secondary: '#A0A0A0'
    muted:     '#5A5A5A'
  accent:
    DEFAULT:  '#2B7FFF'
    hover:    '#1A6EEE'
    muted:    '#1A3A66'
  score:
    red:      '#EF4444'
    amber:    '#F59E0B'
    green:    '#22C55E'
  track:      '#222222'

fontFamily:
  display: ['Space Grotesk', 'sans-serif']
  body:    ['DM Sans', 'sans-serif']
  mono:    ['JetBrains Mono', 'monospace']

borderRadius:
  none:   '0px'
  sm:     '4px'     ← default for buttons, badges
  md:     '6px'     ← inputs, error banners
  lg:     '8px'     ← cards
  full:   '9999px'  ← only for circular avatar/icon containers if needed

animation:
  score-fill:   'scoreFill 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
  fade-up:      'fadeUp 300ms ease-out forwards'
  fade-in:      'fadeIn 200ms ease-out forwards'

keyframes:
  scoreFill:
    '0%':   { width: '0%' }
    '100%': { width: 'var(--score-width)' }
  fadeUp:
    '0%':   { opacity: '0', transform: 'translateY(8px)' }
    '100%': { opacity: '1', transform: 'translateY(0)' }
  fadeIn:
    '0%':   { opacity: '0' }
    '100%': { opacity: '1' }

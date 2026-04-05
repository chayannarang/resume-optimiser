code TESTING.md
```

VS Code will open a new empty file. Then come back here, copy the content I'm about to give you in one block, and paste it directly into VS Code. Then Cmd+S to save.

Ready? Here's the full content to paste:

---
```
# TESTING.md — ResumeOptimiser White Box Test Report

**Date:** 05 April 2026
**Tester:** Chayan Narang
**Method:** White Box Testing — code review + manual edge case execution
**App version:** commit fe48679
**Stack:** React + Vite + Tailwind, Groq Llama 3.3 70B

---

## 1. CODE REVIEW FINDINGS (41 test cases identified)

### analyse.js
| ID | Finding | Severity |
|---|---|---|
| T1 | CV truncated at 3000 chars — Groq scores partial CV silently | 🔴 High |
| T2 | JD truncated at 2000 chars — silent, no user warning | 🟡 Medium |
| T3 | Empty CV string passes to Groq — no upstream guard | 🔴 High |
| T4 | Groq returns malformed JSON — handled via PARSE_ERROR | 🟡 Medium |
| T5 | Groq returns JSON missing a key — handled via PARSE_ERROR | 🟡 Medium |
| T6 | API timeout at 30s — user sees timeout message | 🟡 Medium |
| T7 | 429 rate limit — user sees rate limit message | 🟡 Medium |
| T8 | Very long CV in rewriteCV() — response may be cut mid-sentence | 🔴 High |
| T9 | cvText2.length < 100 guard — throws "Rewrite incomplete" | 🟢 Low |
| T10 | Wrong/expired API key — shows generic error, not "invalid key" | 🟢 Low |

### parseFile.js
| ID | Finding | Severity |
|---|---|---|
| T11 | PDF.js CDN fails to load — throws "PDF.js failed to load" | 🟡 Medium |
| T12 | Two-column PDF CV — text extracted in wrong order | 🔴 High |
| T13 | Scanned/image PDF — correctly throws unsupported error | 🟢 Low |
| T14 | .docx with tables — content extracted but structure lost | 🟡 Medium |
| T15 | .doc file (old format) — may return garbled text, no warning | 🟡 Medium |
| T16 | .txt renamed to .docx — mammoth throws unhandled internal error | 🔴 High |
| T17 | Empty .docx — mammoth returns empty string, no error shown | 🔴 High |

### downloadWord.js
| ID | Finding | Severity |
|---|---|---|
| T18 | Groq prepends blank line — name styled as body not heading | 🔴 High |
| T19 | Non-standard heading e.g. "PROFESSIONAL EXPERIENCE" — styled as body | 🟡 Medium |
| T20 | All-caps skills line e.g. "AWS, GCP" — misclassified as heading | 🟡 Medium |
| T21 | Windows line endings \r\n — heading match fails, all sections body | 🔴 High |
| T22 | ***bold italic*** in rewrite — stray asterisk in output | 🟢 Low |
| T23 | URL revoked before download starts on slow connection | 🟡 Medium |
| T24 | null passed to parseInlineMarkdown — unhandled TypeError | 🟡 Medium |

### constants/platforms.js
| ID | Finding | Severity |
|---|---|---|
| T25 | ATS selector value never reaches Groq prompt | 🔴 High |
| T26 | PLATFORM_OPTIONS never imported — dead code | 🟡 Medium |

### App.jsx
| ID | Finding | Severity |
|---|---|---|
| T27 | Loading state — plain text only, no spinner (20s+ wait) | 🔴 High |
| T28 | handleTailorAnother — duplicate of handleSwitchToTailor | 🟡 Medium |
| T29 | ATS dropdown missing from UI entirely | 🔴 High |
| T30 | replaceAll vs replace on error codes — multi-underscore codes broken | 🟢 Low |

### UploadForm.jsx
| ID | Finding | Severity |
|---|---|---|
| T31 | Drag and drop multiple files — only first taken, no warning | 🟡 Medium |
| T32 | CV = exactly 100 chars of gibberish — passes validation | 🟡 Medium |
| T33 | Upload file then switch tabs — state persistence untested | 🟡 Medium |
| T34 | Combined error shown in two places simultaneously | 🟢 Low |
| T35 | ATS_OPTIONS imported nowhere — feature absent from UI | 🔴 High |
| T36 | Submit throws synchronously — isSubmitting stays true permanently | 🟢 Low |

### ResultsPage.jsx
| ID | Finding | Severity |
|---|---|---|
| T37 | Generate Tailored CV — 20s wait, no spinner | 🔴 High |
| T38 | Copy on HTTP — clipboard API fails silently | 🟢 Low |
| T39 | Filename with spaces on Windows — may break download | 🟢 Low |
| T40 | Both result and error null — page renders blank | 🟡 Medium |
| T41 | Rewrite preview in pre tag — markdown asterisks show as literal text | 🟡 Medium |

---

## 2. MANUAL TEST RESULTS

| Test | Scenario | Result | Notes |
|---|---|---|---|
| T-M1 | Empty CV — submit | ✅ PASS | Button correctly disabled |
| T-M2 | Short CV < 100 chars | ✅ PASS | Inline error shown, button disabled |
| T-M3 | Gibberish CV 100+ chars | ✅ PASS | Groq returned 0/0, no hallucination |
| T-M4 | Long CV word limit | ❌ FAIL | Word limit not enforced + truncation bug confirmed |
| T-M5 | Missing JD, valid CV (Tab 2) | ✅ PASS | Button correctly disabled |
| T-M6 | Real CV + Real JD — full happy path | ⚠️ PASS with bugs | See findings below |
| T-M7 | Empty .docx upload | ⚠️ PARTIAL | Silent failure — no error message shown |

### T-M6 Detailed Findings
- Scores (80 Formatting / 70 Keyword) — accurate and honest ✅
- "What to Change" — relevant, not hallucinated ✅
- Rewrite generated successfully ✅
- Summary appended TWO sentences not one — Rule 2 violation 🔴
- Filename downloaded as "Tailored_Tailored_..." — double prefix bug 🟡
- On-screen preview shows raw markdown asterisks, not formatted text 🟡

---

## 3. DEAD CODE TO CLEAN

| Item | Location | Action |
|---|---|---|
| PLATFORM_OPTIONS | constants/platforms.js | Delete — never imported |
| ATS_OPTIONS | constants/platforms.js | Delete — never imported |
| handleTailorAnother | App.jsx | Delete — duplicate of handleSwitchToTailor |

---

## 4. BUG FIX PRIORITY LIST

| Priority | Bug | File | Fix |
|---|---|---|---|
| 🔴 P1 | CV truncated at 3000 chars | analyse.js | Increase to 6000 chars |
| 🔴 P1 | Empty .docx — no error message | parseFile.js | Add empty string check |
| 🔴 P1 | Summary appends two sentences | analyse.js | Tighten rewrite prompt |
| 🟡 P2 | Double "Tailored_" filename prefix | ResultsPage.jsx | Strip existing prefix before adding |
| 🟡 P2 | No spinner during loading/rewriting | App.jsx + ResultsPage | Add spinner component |
| 🟡 P2 | Windows line endings breaking headings | downloadWord.js | Strip \r before processing |
| 🟢 P3 | Dead code cleanup | platforms.js, App.jsx | Delete unused code |

---

## 5. KNOWN ACCEPTABLE RISKS (not fixing in MVP)

- Two-column PDF CVs (T12) — edge case, low frequency
- .doc old format support (T15) — best effort, documented
- clipboard API on HTTP (T38) — only affects non-HTTPS, Vercel deploy will be HTTPS
- Filename spaces on Windows (T39) — low risk, Mac primary target

---

*Testing conducted by Chayan Narang as part of white box testing exercise before Vercel deployment.*
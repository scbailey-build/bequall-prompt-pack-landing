import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = '/Users/scottsmacbookpro2023/Work/clients/active/Bequall-Deals/Bequall-Assets/Lead-Magnets';
const outputPath = join(outputDir, 'ai-operating-baseline-prompt-pack-v1.pdf');

try { mkdirSync(outputDir, { recursive: true }); } catch {}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; color: #111827; background: #fff; }

  /* ── COVER PAGE ── */
  .cover {
    page-break-after: always;
    height: 100vh;
    background: #0f1117;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
  }
  .cover-tag { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; margin-bottom: 24px; }
  .cover h1 { font-size: 42px; font-weight: 800; line-height: 1.1; margin-bottom: 20px; }
  .cover h1 span { color: #3b82f6; }
  .cover .sub { font-size: 17px; color: #94a3b8; max-width: 480px; line-height: 1.6; margin-bottom: 40px; }
  .cover .meta { display: flex; gap: 32px; }
  .cover .meta-item { display: flex; flex-direction: column; gap: 4px; }
  .cover .meta-label { font-size: 11px; color: #4b5563; text-transform: uppercase; letter-spacing: 0.08em; }
  .cover .meta-value { font-size: 14px; color: #e5e7eb; font-weight: 500; }
  .cover-footer { position: absolute; bottom: 40px; left: 60px; right: 60px; display: flex; justify-content: space-between; align-items: flex-end; }
  .cover-footer .brand { font-size: 13px; color: #6b7280; }
  .cover-footer .brand strong { color: #9ca3af; display: block; font-size: 16px; font-weight: 700; margin-bottom: 2px; }

  /* ── TOC PAGE ── */
  .toc { page-break-after: always; padding: 60px; }
  .toc h2 { font-size: 22px; font-weight: 700; color: #111827; margin-bottom: 32px; padding-bottom: 12px; border-bottom: 2px solid #e5e7eb; }
  .toc-section { margin-bottom: 24px; }
  .toc-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #3b82f6; margin-bottom: 8px; }
  .toc-items { display: flex; flex-direction: column; gap: 6px; }
  .toc-item { display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #374151; padding: 4px 0; border-bottom: 1px dotted #e5e7eb; }
  .toc-item span { color: #9ca3af; font-size: 12px; }
  .toc-note { margin-top: 32px; padding: 16px 20px; background: #f3f4f6; border-radius: 8px; font-size: 13px; color: #6b7280; line-height: 1.6; }

  /* ── PROMPT PAGES ── */
  .prompt-page { page-break-after: always; padding: 52px 56px; display: flex; flex-direction: column; min-height: 100vh; }
  .prompt-header { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 28px; }
  .prompt-num { width: 40px; height: 40px; border-radius: 10px; background: #eff6ff; border: 1px solid #bfdbfe; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 800; color: #2563eb; flex-shrink: 0; }
  .prompt-title-block {}
  .prompt-category { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #3b82f6; margin-bottom: 4px; }
  .prompt-title { font-size: 22px; font-weight: 700; color: #111827; line-height: 1.2; }
  .prompt-use { background: #f0fdf4; border-left: 3px solid #22c55e; padding: 10px 14px; border-radius: 0 6px 6px 0; margin-bottom: 20px; font-size: 13px; color: #15803d; line-height: 1.5; }
  .prompt-use strong { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #16a34a; margin-bottom: 2px; }
  .prompt-box { background: #0f1117; border-radius: 10px; padding: 24px 28px; flex: 1; }
  .prompt-box-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #4b5563; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
  .prompt-box-label::after { content: ''; flex: 1; height: 1px; background: #1f2937; }
  .prompt-text { font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #e5e7eb; line-height: 1.8; white-space: pre-wrap; }
  .prompt-text .placeholder { color: #6b7280; font-style: italic; }
  .page-footer { margin-top: 24px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #9ca3af; }

  /* ── UPGRADE PAGE ── */
  .upgrade-page { page-break-after: always; padding: 60px; background: #0f1117; color: #fff; min-height: 100vh; }
  .upgrade-page h2 { font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 16px; }
  .upgrade-page .sub { color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 36px; max-width: 500px; }
  .upgrade-steps { display: flex; flex-direction: column; gap: 16px; margin-bottom: 36px; }
  .upgrade-step { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px 20px; display: flex; gap: 14px; }
  .upgrade-step-num { font-size: 18px; font-weight: 800; color: #3b82f6; flex-shrink: 0; min-width: 24px; }
  .upgrade-step-content h4 { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 4px; }
  .upgrade-step-content p { font-size: 13px; color: #6b7280; line-height: 1.5; }
  .upgrade-cta { background: #2563eb; color: #fff; padding: 14px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block; text-decoration: none; }
  .upgrade-contact { margin-top: 16px; font-size: 13px; color: #6b7280; }
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div class="cover-tag">Bequall · Free Resource · v1 May 2026</div>
  <h1>AI Operating Baseline<br /><span>Prompt Pack</span></h1>
  <p class="sub">12 production-ready prompts for real estate developers, operators, and investors who want to start using AI for real — not just experiment with it.</p>
  <div class="meta">
    <div class="meta-item"><span class="meta-label">Prompts</span><span class="meta-value">12 prompts</span></div>
    <div class="meta-item"><span class="meta-label">Compatible with</span><span class="meta-value">Claude, ChatGPT, any AI tool</span></div>
    <div class="meta-item"><span class="meta-label">Setup required</span><span class="meta-value">None — just copy &amp; paste</span></div>
  </div>
  <div class="cover-footer">
    <div class="brand"><strong>Bequall</strong>AI Systems and Operations for Real Estate<br />scott@bequall.com · bequall.com</div>
  </div>
</div>

<!-- TABLE OF CONTENTS -->
<div class="toc">
  <h2>Table of Contents</h2>

  <div class="toc-section">
    <div class="toc-section-title">Deal &amp; Underwriting</div>
    <div class="toc-items">
      <div class="toc-item">Prompt 1 — First-Pass Deal Screen <span>p.3</span></div>
      <div class="toc-item">Prompt 2 — IC Memo First Draft <span>p.4</span></div>
      <div class="toc-item">Prompt 3 — Comparable Analysis Narrative <span>p.5</span></div>
    </div>
  </div>

  <div class="toc-section">
    <div class="toc-section-title">Investor &amp; LP Communications</div>
    <div class="toc-items">
      <div class="toc-item">Prompt 4 — LP Update Draft <span>p.6</span></div>
      <div class="toc-item">Prompt 5 — Investor FAQ Response <span>p.7</span></div>
    </div>
  </div>

  <div class="toc-section">
    <div class="toc-section-title">Operations &amp; Reporting</div>
    <div class="toc-items">
      <div class="toc-item">Prompt 6 — Monthly Reporting Package Narrative <span>p.8</span></div>
      <div class="toc-item">Prompt 7 — Meeting Summary and Action Items <span>p.9</span></div>
    </div>
  </div>

  <div class="toc-section">
    <div class="toc-section-title">Modular &amp; Construction (Bonus)</div>
    <div class="toc-items">
      <div class="toc-item">Prompt 8 — Scope Gap Analysis <span>p.10</span></div>
      <div class="toc-item">Prompt 9 — Site Visit Notes → Action Report <span>p.11</span></div>
    </div>
  </div>

  <div class="toc-section">
    <div class="toc-section-title">General Productivity</div>
    <div class="toc-items">
      <div class="toc-item">Prompt 10 — Email Response Drafts <span>p.12</span></div>
      <div class="toc-item">Prompt 11 — Executive Briefing Summary <span>p.13</span></div>
      <div class="toc-item">Prompt 12 — SOP / Process Documentation <span>p.14</span></div>
    </div>
  </div>

  <div class="toc-note">
    <strong>How to use this pack:</strong> Pick the workflow closest to your biggest pain point. Copy that prompt. Paste your real data where indicated. Review the output and refine the prompt to match your firm's voice. Save your refined version as a reusable template.
  </div>
</div>

<!-- PROMPT 1 -->
<div class="prompt-page">
  <div class="prompt-header">
    <div class="prompt-num">1</div>
    <div class="prompt-title-block">
      <div class="prompt-category">Deal &amp; Underwriting</div>
      <div class="prompt-title">First-Pass Deal Screen</div>
    </div>
  </div>
  <div class="prompt-use"><strong>When to use</strong>Quickly filter deal flow before committing analyst time to full underwriting. Go/no-go in 30 seconds.</div>
  <div class="prompt-box">
    <div class="prompt-box-label">Copy this prompt</div>
    <div class="prompt-text">You are an experienced real estate acquisitions analyst.

Review this deal summary and provide:
1. A go/no-go recommendation (with 1-sentence rationale)
2. Top 3 risks to underwrite further
3. Top 3 reasons to pursue
4. The single most important question to answer before proceeding

Use a blunt, operator-first tone. Be concise.

DEAL SUMMARY:
<span class="placeholder">[Paste: deal memo, email, OM summary, or your notes]</span></div>
  </div>
  <div class="page-footer"><span>Bequall · AI Operating Baseline Prompt Pack v1</span><span>Prompt 1 of 12</span></div>
</div>

<!-- PROMPT 2 -->
<div class="prompt-page">
  <div class="prompt-header">
    <div class="prompt-num">2</div>
    <div class="prompt-title-block">
      <div class="prompt-category">Deal &amp; Underwriting</div>
      <div class="prompt-title">IC Memo First Draft</div>
    </div>
  </div>
  <div class="prompt-use"><strong>When to use</strong>Draft an investment committee memo from raw underwriting notes. Saves 1–2 hours per deal.</div>
  <div class="prompt-box">
    <div class="prompt-box-label">Copy this prompt</div>
    <div class="prompt-text">You are a senior real estate analyst drafting an IC memo for our investment committee.

Write a 1-page memo covering:
- Executive summary (3 sentences: what, where, why now)
- Deal overview (property type, location, deal structure, purchase price, projected returns)
- Market thesis (2-3 bullets: why this market, why this asset)
- Key risks and mitigants (3 risks, 1-sentence mitigation each)
- Recommended action and next steps

Tone: analytical, direct, no fluff. Avoid jargon. Write for a principal who reads 10 of these per week.

RAW NOTES:
<span class="placeholder">[Paste your underwriting notes, financial model summary, market research]</span></div>
  </div>
  <div class="page-footer"><span>Bequall · AI Operating Baseline Prompt Pack v1</span><span>Prompt 2 of 12</span></div>
</div>

<!-- PROMPT 3 -->
<div class="prompt-page">
  <div class="prompt-header">
    <div class="prompt-num">3</div>
    <div class="prompt-title-block">
      <div class="prompt-category">Deal &amp; Underwriting</div>
      <div class="prompt-title">Comparable Analysis Narrative</div>
    </div>
  </div>
  <div class="prompt-use"><strong>When to use</strong>Turn a comp table into a readable market narrative for memos or LP updates.</div>
  <div class="prompt-box">
    <div class="prompt-box-label">Copy this prompt</div>
    <div class="prompt-text">Turn this comparable sales/lease data into a 2-paragraph market analysis narrative suitable for an investor memo.

Paragraph 1: What the comps show about market pricing and demand.
Paragraph 2: How this deal positions relative to the comps and why.

Keep it analytical. Avoid superlatives. Use specific numbers.

COMP TABLE:
<span class="placeholder">[Paste your comp data — address, sale price, price/SF or price/unit, date, notes]</span></div>
  </div>
  <div class="page-footer"><span>Bequall · AI Operating Baseline Prompt Pack v1</span><span>Prompt 3 of 12</span></div>
</div>

<!-- PROMPT 4 -->
<div class="prompt-page">
  <div class="prompt-header">
    <div class="prompt-num">4</div>
    <div class="prompt-title-block">
      <div class="prompt-category">Investor &amp; LP Communications</div>
      <div class="prompt-title">LP Update Draft</div>
    </div>
  </div>
  <div class="prompt-use"><strong>When to use</strong>Draft a quarterly or monthly LP update from raw performance data. Professional, transparent, no spin.</div>
  <div class="prompt-box">
    <div class="prompt-box-label">Copy this prompt</div>
    <div class="prompt-text">Draft a professional LP update email for our real estate fund/project.

Tone: confident, transparent, no spin. Acknowledge challenges honestly.

Structure:
1. Opening: portfolio summary in 2 sentences
2. Performance highlights: what went well and by how much
3. Challenges and what we're doing about them
4. Outlook: what to expect next quarter
5. Closing CTA: next update date or call invitation

Keep it under 400 words. No bullet forests — use short paragraphs.

PERFORMANCE DATA:
<span class="placeholder">[Paste: occupancy, NOI, collections, construction progress, key events this period]</span></div>
  </div>
  <div class="page-footer"><span>Bequall · AI Operating Baseline Prompt Pack v1</span><span>Prompt 4 of 12</span></div>
</div>

<!-- PROMPT 5 -->
<div class="prompt-page">
  <div class="prompt-header">
    <div class="prompt-num">5</div>
    <div class="prompt-title-block">
      <div class="prompt-category">Investor &amp; LP Communications</div>
      <div class="prompt-title">Investor FAQ Response</div>
    </div>
  </div>
  <div class="prompt-use"><strong>When to use</strong>Quickly draft responses to common investor questions without spending 30 minutes on each email.</div>
  <div class="prompt-box">
    <div class="prompt-box-label">Copy this prompt</div>
    <div class="prompt-text">Draft a professional, direct response to this investor question on behalf of our real estate firm.

Rules:
- Acknowledge the question directly
- Give a specific, honest answer (no vague reassurances)
- If we don't have full information, say so and state when we will
- Close with a clear next step or action

INVESTOR QUESTION:
<span class="placeholder">[Paste the question or paraphrase it]</span>

CONTEXT / FACTS WE HAVE:
<span class="placeholder">[Paste any relevant data, dates, or context to inform the answer]</span></div>
  </div>
  <div class="page-footer"><span>Bequall · AI Operating Baseline Prompt Pack v1</span><span>Prompt 5 of 12</span></div>
</div>

<!-- PROMPT 6 -->
<div class="prompt-page">
  <div class="prompt-header">
    <div class="prompt-num">6</div>
    <div class="prompt-title-block">
      <div class="prompt-category">Operations &amp; Reporting</div>
      <div class="prompt-title">Monthly Reporting Package Narrative</div>
    </div>
  </div>
  <div class="prompt-use"><strong>When to use</strong>Turn raw data into the written narrative sections of your monthly operations report.</div>
  <div class="prompt-box">
    <div class="prompt-box-label">Copy this prompt</div>
    <div class="prompt-text">Write the narrative summary for our monthly operations report.

Cover:
1. Portfolio performance summary (2-3 sentences: what moved, what's flat, what's down)
2. Key operational highlights (3 bullets: things that went right)
3. Active issues and status (3 bullets: issues + current status + expected resolution)
4. Next month priorities (3 bullets)

Tone: operator-direct. No jargon. Specific numbers over vague claims.

THIS MONTH'S DATA:
<span class="placeholder">[Paste: occupancy rates, collections, maintenance tickets, capex status, leasing activity, anything notable]</span></div>
  </div>
  <div class="page-footer"><span>Bequall · AI Operating Baseline Prompt Pack v1</span><span>Prompt 6 of 12</span></div>
</div>

<!-- PROMPT 7 -->
<div class="prompt-page">
  <div class="prompt-header">
    <div class="prompt-num">7</div>
    <div class="prompt-title-block">
      <div class="prompt-category">Operations &amp; Reporting</div>
      <div class="prompt-title">Meeting Summary and Action Items</div>
    </div>
  </div>
  <div class="prompt-use"><strong>When to use</strong>Turn messy meeting notes or transcripts into a clean action-item summary with owners and dates.</div>
  <div class="prompt-box">
    <div class="prompt-box-label">Copy this prompt</div>
    <div class="prompt-text">Summarize this meeting and extract action items.

Format:
SUMMARY (3 sentences max): What was discussed and decided.

ACTION ITEMS:
- [Owner]: [Task] by [Date]
- [Owner]: [Task] by [Date]
(continue for all actions)

OPEN QUESTIONS (if any):
- [Question] — owned by [Person] — due [Date]

Be specific. If an owner or date isn't clear, write "TBD" — don't invent them.

MEETING NOTES / TRANSCRIPT:
<span class="placeholder">[Paste your notes or transcript]</span></div>
  </div>
  <div class="page-footer"><span>Bequall · AI Operating Baseline Prompt Pack v1</span><span>Prompt 7 of 12</span></div>
</div>

<!-- PROMPT 8 -->
<div class="prompt-page">
  <div class="prompt-header">
    <div class="prompt-num">8</div>
    <div class="prompt-title-block">
      <div class="prompt-category">Modular &amp; Construction</div>
      <div class="prompt-title">Scope Gap Analysis</div>
    </div>
  </div>
  <div class="prompt-use"><strong>When to use</strong>Compare two vendor quotes and identify scope gaps, exclusions, and risk items before committing.</div>
  <div class="prompt-box">
    <div class="prompt-box-label">Copy this prompt</div>
    <div class="prompt-text">You are a modular construction project manager reviewing two vendor quotes.

Compare these quotes and produce:
1. Side-by-side scope summary (what's included in each, in plain language)
2. Items present in Quote A but not Quote B (and vice versa)
3. Ambiguous or unclear scope items that need clarification
4. Top 3 risk items — things that could cause cost overruns if not clarified

Format as a table where possible.

QUOTE A:
<span class="placeholder">[Paste or summarize Quote A]</span>

QUOTE B:
<span class="placeholder">[Paste or summarize Quote B]</span></div>
  </div>
  <div class="page-footer"><span>Bequall · AI Operating Baseline Prompt Pack v1</span><span>Prompt 8 of 12</span></div>
</div>

<!-- PROMPT 9 -->
<div class="prompt-page">
  <div class="prompt-header">
    <div class="prompt-num">9</div>
    <div class="prompt-title-block">
      <div class="prompt-category">Modular &amp; Construction</div>
      <div class="prompt-title">Site Visit Notes → Action Report</div>
    </div>
  </div>
  <div class="prompt-use"><strong>When to use</strong>Turn rough site visit notes into a structured report for your file or project team.</div>
  <div class="prompt-box">
    <div class="prompt-box-label">Copy this prompt</div>
    <div class="prompt-text">Convert these site visit notes into a professional site visit report.

Format:
- Project: [name/address]
- Visit date: [date]
- Attendees: [names/roles]

OBSERVATIONS: (bullet list, specific, factual)

ISSUES REQUIRING ACTION: (table: Issue | Owner | Priority | Due Date)

PHOTOS TO REVIEW: (list any photo-referenced items)

NEXT VISIT: (recommended timing and focus)

SITE VISIT NOTES:
<span class="placeholder">[Paste your rough notes]</span></div>
  </div>
  <div class="page-footer"><span>Bequall · AI Operating Baseline Prompt Pack v1</span><span>Prompt 9 of 12</span></div>
</div>

<!-- PROMPT 10 -->
<div class="prompt-page">
  <div class="prompt-header">
    <div class="prompt-num">10</div>
    <div class="prompt-title-block">
      <div class="prompt-category">General Productivity</div>
      <div class="prompt-title">Email Response Drafts</div>
    </div>
  </div>
  <div class="prompt-use"><strong>When to use</strong>Draft professional responses to complex or sensitive emails in your firm's voice.</div>
  <div class="prompt-box">
    <div class="prompt-box-label">Copy this prompt</div>
    <div class="prompt-text">Draft a professional email response on behalf of [your firm name].

Tone: [direct / warm / formal — pick one]
Length: [short (under 100 words) / medium (100-200 words)]
Goal: [What should this email accomplish?]

Rules:
- Get to the point in the first sentence
- Be specific about next steps and dates
- No corporate filler ("I hope this finds you well", "per my last email")

ORIGINAL EMAIL:
<span class="placeholder">[Paste the email you're responding to]</span>

CONTEXT / OUR POSITION:
<span class="placeholder">[What do we actually want to say? Any constraints?]</span></div>
  </div>
  <div class="page-footer"><span>Bequall · AI Operating Baseline Prompt Pack v1</span><span>Prompt 10 of 12</span></div>
</div>

<!-- PROMPT 11 -->
<div class="prompt-page">
  <div class="prompt-header">
    <div class="prompt-num">11</div>
    <div class="prompt-title-block">
      <div class="prompt-category">General Productivity</div>
      <div class="prompt-title">Executive Briefing Summary</div>
    </div>
  </div>
  <div class="prompt-use"><strong>When to use</strong>Summarize a long document, report, or article into a 5-bullet executive briefing for a principal who has 2 minutes.</div>
  <div class="prompt-box">
    <div class="prompt-box-label">Copy this prompt</div>
    <div class="prompt-text">Summarize this document for a real estate executive who has 2 minutes to read it.

Format:
HEADLINE (1 sentence: what this document is about and why it matters)

KEY POINTS:
1. [Most important finding/decision/fact]
2. [Second most important]
3. [Third most important]
4. [Fourth]
5. [Fifth]

IMPLICATIONS FOR US: (1-2 sentences: what should we do differently or pay attention to?)

DOCUMENT:
<span class="placeholder">[Paste the document, article, or report]</span></div>
  </div>
  <div class="page-footer"><span>Bequall · AI Operating Baseline Prompt Pack v1</span><span>Prompt 11 of 12</span></div>
</div>

<!-- PROMPT 12 -->
<div class="prompt-page">
  <div class="prompt-header">
    <div class="prompt-num">12</div>
    <div class="prompt-title-block">
      <div class="prompt-category">General Productivity</div>
      <div class="prompt-title">SOP / Process Documentation</div>
    </div>
  </div>
  <div class="prompt-use"><strong>When to use</strong>Turn a tribal-knowledge process into a documented SOP your team can follow consistently without asking for help.</div>
  <div class="prompt-box">
    <div class="prompt-box-label">Copy this prompt</div>
    <div class="prompt-text">Document this process as a standard operating procedure (SOP) that a new team member could follow without asking for help.

Format:
PROCESS NAME: [name]
OWNER: [role responsible]
FREQUENCY: [how often this runs]
INPUTS NEEDED: [what you need before starting]

STEPS:
1. [Action] → [Expected output]
2. [Action] → [Expected output]
(continue for all steps)

COMMON MISTAKES: (2-3 things that go wrong and how to avoid them)
QUALITY CHECK: (how do you know the output is correct?)

RAW PROCESS DESCRIPTION:
<span class="placeholder">[Describe the process in plain language — messy is fine]</span></div>
  </div>
  <div class="page-footer"><span>Bequall · AI Operating Baseline Prompt Pack v1</span><span>Prompt 12 of 12</span></div>
</div>

<!-- UPGRADE / NEXT STEPS -->
<div class="upgrade-page">
  <h2>These prompts are a starting point.</h2>
  <p class="sub">The gap between a one-time prompt and a system that compounds is four things. Most firms skip all four.</p>

  <div class="upgrade-steps">
    <div class="upgrade-step">
      <div class="upgrade-step-num">1</div>
      <div class="upgrade-step-content">
        <h4>Your firm's voice baked in</h4>
        <p>So output doesn't sound generic and doesn't need 20 minutes of editing.</p>
      </div>
    </div>
    <div class="upgrade-step">
      <div class="upgrade-step-num">2</div>
      <div class="upgrade-step-content">
        <h4>Reusable templates</h4>
        <p>Saved and used the same way every time — not reinvented per person per task.</p>
      </div>
    </div>
    <div class="upgrade-step">
      <div class="upgrade-step-num">3</div>
      <div class="upgrade-step-content">
        <h4>Team training</h4>
        <p>Everyone knows which prompt to use for which task. No tribal knowledge about AI.</p>
      </div>
    </div>
    <div class="upgrade-step">
      <div class="upgrade-step-num">4</div>
      <div class="upgrade-step-content">
        <h4>Governance</h4>
        <p>What gets reviewed, what ships, who owns quality. AI without governance creates risk.</p>
      </div>
    </div>
  </div>

  <p style="color:#94a3b8;font-size:14px;margin-bottom:20px;">If you want to build that system in 30 days, book a free 45-min Workflow Assessment. We'll tell you honestly if it's a fit.</p>
  <a href="https://calendly.com/bequall/workflow-assessment" class="upgrade-cta">Book a Free 45-Min Assessment →</a>
  <p class="upgrade-contact">scott@bequall.com · bequall.com</p>

  <p style="color:#374151;font-size:11px;margin-top:48px;padding-top:20px;border-top:1px solid #1f2937;">AI Operating Baseline Prompt Pack v1 — © Bequall 2026. Free to use and share with attribution.</p>
</div>

</body>
</html>`;

writeFileSync('/tmp/prompt-pack-print.html', html);
console.log('HTML written to /tmp/prompt-pack-print.html');

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.goto('file:///tmp/prompt-pack-print.html', { waitUntil: 'networkidle0' });

await page.pdf({
  path: outputPath,
  format: 'Letter',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  displayHeaderFooter: false,
});

await browser.close();
console.log('PDF saved to:', outputPath);

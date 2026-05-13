// Vercel serverless function — handles email capture for prompt pack
// Adds subscriber to Resend Audiences and sends the prompt pack via Campaign 3 Email 1
//
// Required env vars (drop in Vercel dashboard → Settings → Environment Variables):
//   RESEND_API_KEY         — from resend.com/api-keys
//   RESEND_AUDIENCE_ID     — from resend.com/audiences (create one named "Prompt Pack Downloads")
//   RESEND_FROM_EMAIL      — e.g. scott@bequall.com (must be a verified sender in Resend)
//   PROMPT_PACK_URL        — public URL of the PDF (e.g. https://pack.bequall.com/prompt-pack.pdf)
//                            OR upload the PDF as a Vercel blob / CDN asset and paste its URL here

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email address required.' });
  }

  const RESEND_API_KEY    = process.env.RESEND_API_KEY;
  const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
  const FROM_EMAIL        = process.env.RESEND_FROM_EMAIL || 'scott@bequall.com';
  const PROMPT_PACK_URL   = process.env.PROMPT_PACK_URL  || 'https://bequall.com/prompt-pack.pdf';

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set');
    return res.status(500).json({ error: 'Email service not configured — contact scott@bequall.com' });
  }

  try {
    // 1. Add contact to Resend Audience with `prompt-pack-download` tag
    if (RESEND_AUDIENCE_ID) {
      const audienceRes = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
          // Resend contacts support custom fields via data attributes
        }),
      });

      if (!audienceRes.ok) {
        const err = await audienceRes.text();
        console.error('Resend audience add failed:', err);
        // Non-fatal — still send the email even if audience add fails
      }
    }

    // 2. Send Campaign 3 — Email 1 (immediate delivery of prompt pack)
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Scott at Bequall <${FROM_EMAIL}>`,
        to: email,
        subject: "Your AI Operating Baseline Prompt Pack",
        html: buildEmailHtml(PROMPT_PACK_URL),
        tags: [
          { name: 'campaign', value: 'campaign-3' },
          { name: 'email', value: 'email-1' },
          { name: 'source', value: 'prompt-pack-landing' },
        ],
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error('Resend send failed:', err);
      throw new Error('Email delivery failed — please try again.');
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('subscribe handler error:', err);
    return res.status(500).json({ error: err.message || 'Something went wrong.' });
  }
}

function buildEmailHtml(packUrl) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { background: #f9fafb; font-family: Inter, system-ui, sans-serif; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; }
    .header { background: #0f1117; padding: 28px 32px; }
    .header h1 { color: #fff; font-size: 20px; font-weight: 700; margin: 0; }
    .header p { color: #9ca3af; font-size: 13px; margin: 4px 0 0; }
    .body { padding: 32px; }
    .body p { color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
    .btn { display: inline-block; background: #2563eb; color: #fff !important; text-decoration: none; font-weight: 600; font-size: 15px; padding: 12px 24px; border-radius: 8px; margin: 8px 0 24px; }
    .prompts { background: #f3f4f6; border-radius: 8px; padding: 16px 20px; margin: 0 0 24px; }
    .prompts p { font-weight: 600; color: #111827; margin: 0 0 8px; font-size: 14px; }
    .prompts ul { margin: 0; padding: 0 0 0 16px; }
    .prompts li { color: #6b7280; font-size: 13px; line-height: 1.8; }
    .footer { border-top: 1px solid #e5e7eb; padding: 20px 32px; }
    .footer p { color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.6; }
    .footer a { color: #6b7280; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>AI Operating Baseline Prompt Pack</h1>
      <p>Bequall · 12 production-ready prompts for real estate operators</p>
    </div>
    <div class="body">
      <p>Your pack is ready. Click below to download:</p>

      <a href="${packUrl}" class="btn" target="_blank">Download the Prompt Pack →</a>

      <div class="prompts">
        <p>What's inside — all 12 prompts:</p>
        <ul>
          <li>First-pass deal screen</li>
          <li>IC memo first draft</li>
          <li>Comparable analysis narrative</li>
          <li>LP update draft</li>
          <li>Investor FAQ response</li>
          <li>Monthly reporting narrative</li>
          <li>Meeting summary + action items</li>
          <li>Scope gap analysis</li>
          <li>Site visit notes → report</li>
          <li>Email response drafts</li>
          <li>Executive briefing summary</li>
          <li>SOP / process documentation</li>
        </ul>
      </div>

      <p><strong>How to get value from this in under 30 minutes:</strong><br />
      Pick the workflow closest to your biggest time sink. Copy that prompt. Paste your real data. Save the version that works for your firm's voice.</p>

      <p>I'll follow up in a few days to see which prompt was most useful — and whether a 30-day sprint to build the full system makes sense for your firm.</p>

      <p>— Scott<br /><small>Bequall · <a href="mailto:scott@bequall.com">scott@bequall.com</a></small></p>
    </div>
    <div class="footer">
      <p>You're receiving this because you downloaded the AI Operating Baseline Prompt Pack at bequall.com. No further emails except one optional follow-up. <a href="#">Unsubscribe</a>.</p>
    </div>
  </div>
</body>
</html>`;
}

// Supabase Edge Function: send-contact-email
// Notifies the site owner when a contact submission arrives.
// Deploy:  supabase functions deploy send-contact-email
// Secrets: supabase secrets set RESEND_API_KEY=... CONTACT_NOTIFY_EMAIL=...
//          (RESEND_API_KEY optional — without it, submissions are still saved,
//           the function just reports emailSent=false. Never fake success.)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { submissionId } = await req.json()
    if (!submissionId || typeof submissionId !== 'string') {
      return json({ error: 'missing submissionId' }, 400)
    }

    // Service-role client stays server-side in the edge runtime.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: submission, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', submissionId)
      .maybeSingle()

    if (error || !submission) {
      return json({ error: 'submission not found' }, 404)
    }

    const resendKey = Deno.env.get('RESEND_API_KEY')
    const notifyTo = Deno.env.get('CONTACT_NOTIFY_EMAIL')
    const fromAddr = Deno.env.get('CONTACT_FROM_EMAIL') || 'onboarding@resend.dev'

    if (!resendKey || !notifyTo) {
      // Deliberate honest failure — submission is saved in DB regardless.
      return json({ saved: true, emailSent: false, reason: 'email provider not configured' })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `BIMZ Contact <${fromAddr}>`,
        to: [notifyTo],
        reply_to: submission.email,
        subject: `[bimz.dev] Pesan baru dari ${submission.name}`,
        text: `Dari: ${submission.name} <${submission.email}>\n\n${submission.message}`,
      }),
    })

    const ok = res.ok
    return json({ saved: true, emailSent: ok, providerStatus: res.status })
  } catch (err) {
    return json({ error: String(err) }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

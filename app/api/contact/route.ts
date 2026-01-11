import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const emailjsServerKey = process.env.EMAILJS_SERVER_KEY
    const web3formsKey = process.env.WEB3FORMS_API_KEY

    // If EMAILJS_SERVER_KEY is set, proxy the request to EmailJS server REST API
    if (emailjsServerKey) {
      const service_id = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE || ''
      const template_id = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE || ''
      const user_id = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY || ''

      if (!service_id || !template_id) {
        console.error('Missing EmailJS service/template configuration')
        return NextResponse.json({ success: false, message: 'Missing EmailJS configuration' }, { status: 500 })
      }

      const payload = {
        service_id,
        template_id,
        user_id,
        template_params: body || {},
        accessToken: emailjsServerKey,
      }

      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'User-Agent': 'Next.js API Route (server)'
        },
        body: JSON.stringify(payload),
      })

      const text = await res.text()
      const ctype = res.headers.get('content-type') || ''
      if (ctype.includes('application/json')) {
        const data = JSON.parse(text || '{}')
        return NextResponse.json(data, { status: res.ok ? 200 : 502 })
      }

      return NextResponse.json({ success: res.ok, message: text }, { status: res.ok ? 200 : 502 })
    }

    // Fallback to Web3Forms if EMAILJS_SERVER_KEY is not present
    if (!web3formsKey) {
      console.error('WEB3FORMS_API_KEY is not set')
      return NextResponse.json({ success: false, message: 'Missing API key' }, { status: 500 })
    }

    // Build multipart/form-data payload expected by Web3Forms
    const form = new FormData()
    for (const [k, v] of Object.entries(body || {})) {
      form.append(k, typeof v === 'string' ? v : JSON.stringify(v))
    }
    form.append('access_key', web3formsKey)

    const incomingOrigin = request.headers.get('origin') || request.headers.get('referer') || ''
    const incomingLang = request.headers.get('accept-language') || ''

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      // Let fetch set Content-Type with boundary for FormData
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': 'Next.js API Route (server)',
        Referer: incomingOrigin,
        Origin: incomingOrigin,
        'Accept-Language': incomingLang,
      },
      body: form as any,
    })

    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const data = await res.json()
      return NextResponse.json(data, { status: res.ok ? 200 : 502 })
    }

    const text = await res.text()
    const looksLikeHtml = contentType.includes('text/html') || /^\s*<!DOCTYPE html>/i.test(text) || /Enable JavaScript and cookies to continue/i.test(text) || /Just a moment/i.test(text)
    if (looksLikeHtml) {
      console.error('Upstream returned HTML (possible anti-bot):', res.status)
      console.error('Upstream HTML (truncated):', text.slice(0, 2000))
      return NextResponse.json({ success: false, message: 'Upstream blocked the request', statusCode: res.status, details: text.slice(0, 2000) }, { status: 502 })
    }

    console.error('Web3Forms returned non-JSON response:', res.status, text.slice(0, 2000))
    return NextResponse.json({ success: false, message: 'Upstream returned non-JSON', details: text.slice(0, 2000) }, { status: 502 })
  } catch (err: any) {
    console.error('Contact API error:', err)
    return NextResponse.json({ success: false, message: err?.message || 'Internal server error' }, { status: 500 })
  }
}

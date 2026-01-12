import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const emailjsServerKey = process.env.EMAILJS_SERVER_KEY

    // Use EmailJS when service/template/user IDs are available
    const service_id = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE || ''
    const template_id = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE || ''
    const user_id = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY || ''

    if (!service_id || !template_id || !user_id) {
      console.error('EmailJS credentials are missing')
      return NextResponse.json({ ok: false, success: false, message: 'Missing EmailJS keys' }, { status: 400 })
    }

    const payload: any = {
      service_id,
      template_id,
      user_id,
      template_params: body || {},
    }

    // If a server/private EmailJS key is provided, include it as accessToken
    if (emailjsServerKey) {
      payload.accessToken = emailjsServerKey
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
      return NextResponse.json({ ok: res.ok, success: res.ok, data }, { status: res.ok ? 200 : 502 })
    }

    return NextResponse.json({ ok: res.ok, success: res.ok, message: text }, { status: res.ok ? 200 : 502 })
  } catch (err: any) {
    console.error('Contact API error:', err)
    return NextResponse.json({ ok: false, success: false, message: err?.message || 'Internal server error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const access_key = process.env.WEB3FORMS_API_KEY
    if (!access_key) {
      return NextResponse.json({ success: false, message: '11be7d38-65b5-4e68-8d07-ec346305297b' }, { status: 500 })
    }

    // Web3Forms expects form-style submissions; send as multipart/form-data
    const form = new FormData()
    for (const [k, v] of Object.entries(body || {})) {
      // ensure values are strings
      form.append(k, typeof v === 'string' ? v : JSON.stringify(v))
    }
    form.append('access_key', access_key)

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      // Do not set Content-Type; fetch will set the multipart boundary
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Next.js API Route (server)',
      },
      body: form as any,
    })

    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const data = await res.json()
      return NextResponse.json(data, { status: res.ok ? 200 : 500 })
    } else {
      const text = await res.text()
      // Detect HTML responses (Cloudflare challenge / blocking page) and return clearer message
      const looksLikeHtml = contentType.includes('text/html') || /^\s*<!DOCTYPE html>/i.test(text) || /Enable JavaScript and cookies to continue/i.test(text) || /Just a moment/i.test(text)
      if (looksLikeHtml) {
        console.error('Web3Forms returned HTML (possible Cloudflare challenge):', res.status)
        return NextResponse.json({ success: false, message: `Upstream returned HTML (possible Cloudflare/anti-bot block)`, statusCode: res.status, details: text.slice(0, 1000) }, { status: 502 })
      }

      console.error('Web3Forms returned non-JSON response:', res.status, text)
      return NextResponse.json({ success: false, message: `Upstream returned non-JSON (${res.status})`, details: text.slice(0, 200) }, { status: 502 })
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const access_key = process.env.WEB3FORMS_API_KEY;
    if (!access_key) {
      console.error('WEB3FORMS_API_KEY is not set');
      return NextResponse.json({ success: false, message: 'Missing API key' }, { status: 500 });
    }

    // Build multipart/form-data payload expected by Web3Forms
    const form = new FormData();
    for (const [k, v] of Object.entries(body || {})) {
      form.append(k, typeof v === 'string' ? v : JSON.stringify(v));
    }
    form.append('access_key', access_key);

    const incomingOrigin = request.headers.get('origin') || request.headers.get('referer') || '';
    const incomingLang = request.headers.get('accept-language') || '';

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
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.ok ? 200 : 502 });
    }

    const text = await res.text();
    const looksLikeHtml = contentType.includes('text/html') || /^\s*<!DOCTYPE html>/i.test(text) || /Enable JavaScript and cookies to continue/i.test(text) || /Just a moment/i.test(text);
    if (looksLikeHtml) {
      console.error('Upstream returned HTML (possible anti-bot):', res.status);
      console.error('Upstream HTML (truncated):', text.slice(0, 2000));
      return NextResponse.json({ success: false, message: 'Upstream blocked the request', statusCode: res.status, details: text.slice(0, 2000) }, { status: 502 });
    }

    console.error('Web3Forms returned non-JSON response:', res.status, text.slice(0, 2000));
    return NextResponse.json({ success: false, message: 'Upstream returned non-JSON', details: text.slice(0, 2000) }, { status: 502 });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return NextResponse.json({ success: false, message: err?.message || 'Internal server error' }, { status: 500 });
  }
}

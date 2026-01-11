import { NextResponse } from 'next/server'

type EnvReport = {
  present: boolean
  masked: string | null
}

function mask(value: string | null | undefined) {
  if (!value) return null
  const s = String(value)
  if (s.length <= 6) return '••••'
  return `${s.slice(0, 3)}...${s.slice(-3)}`
}

export async function GET() {
  const envsRaw: Record<string, string | undefined | null> = {
    EMAILJS_SERVICE: process.env.EMAILJS_SERVICE ?? null,
    EMAILJS_TEMPLATE: process.env.EMAILJS_TEMPLATE ?? null,
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? null,
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? null,
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? null,
  }

  const report: Record<string, EnvReport> = {}
  for (const [k, v] of Object.entries(envsRaw)) {
    report[k] = { present: !!v, masked: mask(v) }
  }

  return NextResponse.json({ ok: true, env: report })
}

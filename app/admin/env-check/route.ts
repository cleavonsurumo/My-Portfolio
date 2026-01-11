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
  const envs: Record<string, string | undefined | null> = {
    service: process.env.EMAILJS_SERVICE ?? null,
    template: process.env.EMAILJS_TEMPLATE ?? null,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? null,
  }

  const report: Record<string, EnvReport> = {}
  for (const [k, v] of Object.entries(envs)) {
    report[k] = { present: !!v, masked: mask(v) }
  }

  return NextResponse.json({ ok: true, env: report })
}

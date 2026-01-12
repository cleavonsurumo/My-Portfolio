"use client"

import { useState, useRef, useEffect } from 'react'
import emailjs from '@emailjs/browser'

export default function Contact2() {
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const formRef = useRef<HTMLFormElement | null>(null)
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)

  // Using server-side send endpoint at `/api/contact` so client doesn't rely on build-time env
    useEffect(() => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
      if (!siteKey) return

      // Dynamically load reCAPTCHA v3
      const id = 'recaptcha-v3'
      if (document.getElementById(id)) {
        setRecaptchaLoaded(true)
        return
      }
      const s = document.createElement('script')
      s.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
      s.async = true
      s.defer = true
      s.id = id
      s.onload = () => setRecaptchaLoaded(true)
      s.onerror = () => setRecaptchaLoaded(false)
      document.head.appendChild(s)
      return () => { s.remove() }
    }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')
    const form = formRef.current || (e.currentTarget as HTMLFormElement)
    // Honeypot check
    const hp = (form.querySelector('input[name="hp"]') as HTMLInputElement | null)?.value
    if (hp && hp.trim() !== '') {
      setErrorMessage('Spam detected')
      setStatus('error')
      return
    }

    const data: any = {
      from_name: (form.querySelector('input[name="name"]') as HTMLInputElement)?.value,
      from_email: (form.querySelector('input[name="email"]') as HTMLInputElement)?.value,
      phone: (form.querySelector('input[name="phone"]') as HTMLInputElement)?.value,
      subject: (form.querySelector('input[name="subject"]') as HTMLInputElement)?.value,
      message: (form.querySelector('textarea[name="message"]') as HTMLTextAreaElement)?.value,
    }

    // If reCAPTCHA v3 site key provided, execute and attach token
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
    if (recaptchaSiteKey) {
      if (!(window as any).grecaptcha || !recaptchaLoaded) {
        setErrorMessage('reCAPTCHA not loaded; please refresh the page')
        setStatus('error')
        return
      }
      try {
        const token = await new Promise<string>((resolve, reject) => {
          try {
            ;(window as any).grecaptcha.ready(() => {
              ;(window as any).grecaptcha.execute(recaptchaSiteKey, { action: 'contact' })
                .then((t: string) => resolve(t))
                .catch((e: any) => reject(e))
            })
          } catch (e) { reject(e) }
        })
        console.debug('reCAPTCHA token:', token)
        if (token) {
          // Attach token under several common names to satisfy different template expectations
          data['g-recaptcha-response'] = token
          data['recaptcha'] = token
          data['recaptcha_token'] = token
        } else {
          setErrorMessage('reCAPTCHA failed to return a token')
          setStatus('error')
          return
        }
      } catch (recapErr: any) {
        console.error('reCAPTCHA execution error:', recapErr)
        setErrorMessage('reCAPTCHA execution failed')
        setStatus('error')
        return
      }
    }

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ''
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''

      if (!serviceId || !templateId || !publicKey) {
        setErrorMessage('EmailJS public keys are not configured')
        setStatus('error')
        return
      }

      // Send via EmailJS client SDK
      const result = await emailjs.send(serviceId, templateId, data, publicKey)
      // emailjs returns an array-like response; treat 200-range as success
      if ((result as any)?.status && (result as any).status >= 200 && (result as any).status < 300) {
        setStatus('success')
        setErrorMessage('')
        form.reset()
        return
      }

      console.error('EmailJS send unexpected response:', result)
      setErrorMessage('EmailJS send failed')
      setStatus('error')
    } catch (err: any) {
      console.error('EmailJS send error:', err)
        const txt = err?.text || err?.message || String(err)
        // Map common provider guidance to actionable message
        if (typeof txt === 'string' && txt.includes('honeypot') || typeof txt === 'string' && txt.includes('reduce spam')) {
          setErrorMessage('Provider rejected the message — ensure honeypot is empty or reduce spam content')
        } else {
          setErrorMessage(txt)
        }
      setStatus('error')
    }
  }

  

  return (
    <>
      <section id="contact" className="section-contact-2 position-relative pb-60 overflow-hidden">
        <div className="container position-relative z-1">
          <div className="row align-items-center">
            <div className="col-lg-7 pb-5 pb-lg-0">
              <div className="position-relative">
                <div className="position-relative z-2">
                  <h3 className="text-primary-2 mb-3">Let's connect</h3>
                  <form ref={formRef} onSubmit={handleSubmit}>
                    {/* Honeypot field for spam bots (should remain empty) */}
                    <input type="text" name="hp" autoComplete="off" tabIndex={-1} style={{display: 'none'}} />
                    <div className="row g-3">
                      <div className="col-md-6 ">
                        <input type="text" className="form-control bg-3 border border-1 rounded-3" id="name" name="name" placeholder="Your name" aria-label="username" required />
                      </div>
                      <div className="col-md-6">
                        <input type="text" className="form-control bg-3 border border-1 rounded-3" id="phone" name="phone" placeholder="Phone" aria-label="phone" />
                      </div>
                      <div className="col-md-6">
                        <input type="email" className="form-control bg-3 border border-1 rounded-3" id="email" name="email" placeholder="Email" aria-label="email" required />
                      </div>
                      <div className="col-md-6">
                        <input type="text" className="form-control bg-3 border border-1 rounded-3" id="subject" name="subject" placeholder="Subject" aria-label="subject" />
                      </div>
                      <div className="col-12">
                        <textarea className="form-control bg-3 border border-1 rounded-3" id="message" name="message" placeholder="Message" aria-label="With textarea" required defaultValue={""} />
                      </div>
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-primary-2 rounded-2"
                          disabled={status === 'sending'}
                        >
                          {status === 'sending' ? 'Sending...' : 'Send Message'}
                          <i className="ri-arrow-right-up-line" />
                        </button>
                        {status === 'success' && <div className="mt-3 text-success">Message sent — thank you!</div>}
                        {status === 'error' && (
                          <div className="mt-3 text-danger">
                            Failed to send message. Try again later.
                            {errorMessage && <div className="small mt-1 text-wrap">{errorMessage}</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
                <div className="z-0 bg-primary-dark rectangle-bg z-1 rounded-3" />
              </div>
            </div>
            <div className="col-lg-5 d-flex flex-column ps-lg-8">
              <div className="d-flex align-items-center mb-3 position-relative d-inline-flex">
                <div className="d-inline-block">
                  <div className="icon-flip flex-nowrap icon-shape icon-xxl border border-1 rounded-3 bg-3">
                    <i className="ri-phone-fill text-primary-2 fs-26" />
                  </div>
                </div>
                <div className="ps-3 h-100">
                  <span className="text-400 fs-6">Phone Number</span>
                  <h6 className="mb-0">+(254)-746-952861</h6>
                </div>
                <a href="tel:+(254)-746-952861" target="_blank" rel="noopener noreferrer" className="position-absolute top-0 start-0 w-100 h-100" />
              </div>
              <div className="d-flex align-items-center mb-3 position-relative d-inline-flex">
                <div className="d-inline-block">
                  <div className="icon-flip flex-nowrap icon-shape icon-xxl border border-1 rounded-3 bg-3">
                    <i className="ri-mail-fill text-primary-2 fs-26" />
                  </div>
                </div>
                <div className="ps-3 h-100">
                  <span className="text-400 fs-6">Email</span>
                  <h6 className="mb-0">Cleavon@cleavon.ke</h6>
                </div>
                <a href="mailto:Cleavon@cleavon.ke" target="_blank" rel="noopener noreferrer" className="position-absolute top-0 start-0 w-100 h-100" />
              </div>
              <div className="d-flex align-items-center mb-3 position-relative d-inline-flex">
                <div className="d-inline-block">
                  <div className="icon-flip flex-nowrap icon-shape icon-xxl border border-1 rounded-3 bg-3">
                    <i className="ri-skype-fill text-primary-2 fs-26" />
                  </div>
                </div>
                <div className="ps-3 h-100">
                  <span className="text-400 fs-6">Teams</span>
                  <h6 className="mb-0">cleavonsurumo</h6>
                </div>
                <a href="https://teams.live.com/v2" target="_blank" rel="noopener noreferrer" className="position-absolute top-0 start-0 w-100 h-100" />
              </div>
              <div className="d-flex align-items-center mb-3 position-relative d-inline-flex">
                <div className="d-inline-block">
                  <div className="icon-flip flex-nowrap icon-shape icon-xxl border border-1 rounded-3 bg-3">
                    <i className="ri-map-2-fill text-primary-2 fs-26" />
                  </div>
                </div>
                <div className="ps-3 h-100">
                  <span className="text-400 fs-6">Address</span>
                  <h6 className="mb-0">Embassy House, Nairobi</h6>
                </div>
                <a href="https://maps.app.goo.gl/bo6f38HguGvkdwJZ8" target="_blank" rel="noopener noreferrer" className="position-absolute top-0 start-0 w-100 h-100" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
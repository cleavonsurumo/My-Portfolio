"use client"

import { useEffect } from 'react'

export default function Contact2() {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  useEffect(() => {
    console.log('EmailJS envs:', { serviceId, templateId, publicKey })
  }, [serviceId, templateId, publicKey])

  return (
    <section id="contact" className="section-contact-2 position-relative pb-60 overflow-hidden">
      <div className="container position-relative z-1">
	<div className="row align-items-center">
	  <div className="col-lg-7">
	    <h3 className="text-primary-2 mb-3">Let's connect</h3>
	    <p className="small text-muted">Contact form temporarily simplified for deployment check.</p>
	  </div>
	</div>
      </div>
    </section>
  )
}
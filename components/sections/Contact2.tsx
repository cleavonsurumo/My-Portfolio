"use client"

import { useState, useRef, useEffect } from 'react'
import emailjs from '@emailjs/browser'

export default function Contact2() {
	const [status, setStatus] = useState('idle')
	const [errorMessage, setErrorMessage] = useState<string>('') // Changed from null to empty string

	const formRef = useRef<HTMLFormElement | null>(null)

	const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
	const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
	const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

	useEffect(() => {
		console.log('EmailJS envs:', {
			service: serviceId,
			template: templateId,
			publicKey,
		})

		if (publicKey) {
			try {
				if (typeof emailjs.init === 'function') emailjs.init(publicKey)
			} catch (e) {
				console.warn('EmailJS init warning:', e)
			}
		}
	}, [publicKey, serviceId, templateId])

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setStatus('sending')
		setErrorMessage('')

		const form = formRef.current || (e.currentTarget as HTMLFormElement)

		const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
		const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
		const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

		if (!serviceId || !templateId || !publicKey) {
			setErrorMessage('EmailJS configuration is missing')
			setStatus('error')
			console.error('Missing EmailJS env vars: NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, NEXT_PUBLIC_EMAILJS_PUBLIC_KEY')
			return
		}

		try {
			await emailjs.sendForm(serviceId, templateId, form as HTMLFormElement, publicKey)
			setStatus('success')
			setErrorMessage('')
			form.reset()
		} catch (err: any) {
			const msg = err?.text || err?.message || String(err) || 'Email send failed'
			console.error('EmailJS send error:', err)
			setErrorMessage(msg)
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
								<a href="tel:+(254)-746-952861" className="position-absolute top-0 start-0 w-100 h-100" />
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
								<a href="mailto:Cleavon@cleavon.ke" className="position-absolute top-0 start-0 w-100 h-100" />
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
								<a href="teams:cleavonsurumo?add" className="position-absolute top-0 start-0 w-100 h-100" />
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
								<a href="https://maps.app.goo.gl/bo6f38HguGvkdwJZ8" className="position-absolute top-0 start-0 w-100 h-100" />
							</div>
						</div>
					</div>
				</div>
			</section>
		)
	}
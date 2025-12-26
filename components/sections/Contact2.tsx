"use client"

import { useState } from 'react'

export default function Contact2() {
	const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
	const [errorMessage, setErrorMessage] = useState<string>('') // Changed from null to empty string

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setStatus('sending');
		setErrorMessage('');

		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})
			
			// Handle non-JSON responses
			const text = await res.text()
			let json = {}
			try {
				json = text ? JSON.parse(text) : {}
			} catch {
				json = {}
			}
			
			if (res.ok && (json.success === undefined || json.success !== false)) {
				setStatus('success');
				setErrorMessage('');
				form.reset();
			} else {
				const msg = json?.message || json?.error || 'Unknown error'
				console.error('Form error response:', res.status, msg)
				setErrorMessage(msg)
				setStatus('error')
			}
		} catch (err: any) {
			const msg = err?.message || String(err) || 'Network error'
			console.error('Submission failed:', msg)
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
									<form onSubmit={handleSubmit}>
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
		</>
	)
}
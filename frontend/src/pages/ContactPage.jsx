import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ClickSparkButton from '../components/ClickSparkButton'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setIsSuccess(false), 5000)
    }, 1500)
  }

  const contactMethods = [
    {
      icon: 'call',
      title: 'Phone Support',
      desc: 'Mon - Fri, 9:00 - 18:00',
      action: '02-123-4567',
      link: 'tel:021234567'
    },
    {
      icon: 'mail',
      title: 'Email Us',
      desc: 'Drop us a line anytime.',
      action: 'hello@udee.com',
      link: 'mailto:hello@udee.com'
    },
    {
      icon: 'location_on',
      title: 'Visit Showroom',
      desc: '123 Sukhumvit Rd, BKK',
      action: 'Get Directions',
      link: '#'
    }
  ]

  const inputClass = "w-full rounded-xl border border-[#EAEAEA] bg-[#F9F9F9] px-4 py-3 text-sm text-[#111111] outline-none transition-all focus:border-[#111111] focus:bg-white focus:ring-1 focus:ring-[#111111] hover:border-[#CCCCCC]"
  const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wider text-[#666666]"

  return (
    <main className="min-h-screen bg-white text-[#111111] pb-24">
      {/* ── Hero Section ── */}
      <section className="bg-[#F9F9F9] py-20 border-b border-[#EAEAEA]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl font-semibold tracking-tight text-[#111111] sm:text-5xl"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
          >
            Get in touch
          </motion.h1>
          <motion.p
            className="mt-6 text-base text-[#666666] max-w-2xl mx-auto"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.1 }}
          >
            Have a question about our products, an order, or a general inquiry? We'd love to hear from you.
            Fill out the form below or contact us directly.
          </motion.p>
        </div>
      </section>

      {/* ── Contact Methods ── */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid gap-6 sm:grid-cols-3">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.title}
              href={method.link}
              className="flex flex-col items-center justify-center rounded-2xl bg-white border border-[#EAEAEA] p-8 text-center shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-[#CCCCCC] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111111]"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.2 + index * 0.1 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F9F9F9] border border-[#EAEAEA]">
                <span className="material-symbols-outlined text-[#111111] text-[20px]">
                  {method.icon}
                </span>
              </div>
              <h3 className="text-base font-semibold text-[#111111]">{method.title}</h3>
              <p className="mt-1 text-xs text-[#666666] mb-4">{method.desc}</p>
              <span className="text-sm font-semibold text-[#111111]">{method.action}</span>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pt-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* ── Contact Form ── */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#111111] mb-2">Send a message</h2>
              <p className="text-sm text-[#666666] mb-8">
                We'll aim to get back to you within 24 hours.
              </p>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                  <span className="material-symbols-outlined text-3xl text-[#10B981]">
                    check_circle
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#047857] mb-2">Message Sent!</h3>
                <p className="text-sm text-[#065F46] max-w-sm mx-auto">
                  Thank you for reaching out. We have received your message and will respond shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 text-sm font-semibold text-[#047857] underline hover:text-[#065F46]"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={labelClass}>Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Jane Doe"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClass}>Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="08x-xxx-xxxx"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="jane@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className={labelClass}>Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Tell us everything..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="pt-2">
                  <ClickSparkButton>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center rounded-xl bg-[#111111] px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-[#333333] hover:shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111111] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </ClickSparkButton>
                </div>
              </form>
            )}
          </motion.div>

          {/* ── Map / Office Info ── */}
          <motion.div
            className="h-full flex flex-col"
            initial={reduceMotion ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div className="overflow-hidden rounded-2xl bg-[#F9F9F9] border border-[#EAEAEA] flex-1 min-h-[400px] relative shadow-sm">
              <iframe
                title="Google Maps Udee Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x30e29e0000000000%3A0x0000000000000000!2sSukhumvit%20Rd%2C%20Bangkok%2C%20Thailand!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale contrast-125 opacity-90 transition-all hover:grayscale-0 hover:opacity-100 duration-700"
              />
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-[#111111] uppercase mb-2">Headquarters</h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  123 Sukhumvit Road<br />
                  Watthana, Bangkok 10110<br />
                  Thailand
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-[#111111] uppercase mb-2">Social</h3>
                <div className="flex gap-4">
                  {['instagram', 'facebook', 'twitter'].map((social) => (
                    <a key={social} href="#" className="text-[#888888] hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111111] rounded">
                      <img src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${social}.svg`} alt={social} className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity" style={{ filter: 'brightness(0)' }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default ContactPage

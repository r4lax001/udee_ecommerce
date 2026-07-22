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
      title: 'โทรศัพท์',
      desc: 'จันทร์ - ศุกร์, 9:00 - 18:00',
      action: '02-123-4567',
      link: 'tel:021234567'
    },
    {
      icon: 'mail',
      title: 'อีเมล',
      desc: 'ส่งอีเมลหาเราได้ตลอดเวลา',
      action: 'hello@udee.com',
      link: 'mailto:hello@udee.com'
    },
    {
      icon: 'location_on',
      title: 'เยี่ยมชมโชว์รูม',
      desc: '123 ถนนสุขุมวิท, กทม.',
      action: 'ดูเส้นทาง',
      link: '#'
    }
  ]

  const inputClass = "w-full rounded-xl border border-[#E8E1DF] bg-white px-4 py-3 text-sm text-[#3D2B1F] outline-none transition-all focus:border-[#A0724A] focus:bg-white focus:ring-1 focus:ring-[#A0724A] hover:border-[#CCCCCC]"
  const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wider text-[#5a4e46]"

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#3D2B1F] pb-24" style={{ fontFamily: 'Kanit, Inter, Prompt, Mitr, sans-serif' }}>
      {/* ── Hero Section ── */}
      <section className="bg-white py-20 border-b border-[#E8E1DF]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl font-semibold tracking-tight text-[#3D2B1F] sm:text-5xl"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
          >
            ติดต่อเรา
          </motion.h1>
          <motion.p
            className="mt-6 text-base text-[#5a4e46] max-w-2xl mx-auto"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.1 }}
          >
            หากคุณมีคำถามเกี่ยวกับสินค้า คำสั่งซื้อ หรือข้อสงสัยอื่นๆ สามารถติดต่อเราได้เลย กรอกแบบฟอร์มด้านล่าง หรือติดต่อเราโดยตรงผ่านช่องทางต่างๆ
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
              className="flex flex-col items-center justify-center rounded-2xl bg-white border border-[#E8E1DF] p-8 text-center shadow-sm hover:shadow-[0_8px_30px_rgb(160,114,74,0.1)] hover:border-[#A0724A] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A0724A]"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.2 + index * 0.1 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF6F1] border border-[#E8E1DF]">
                <span className="material-symbols-outlined text-[#A0724A] text-[20px]">
                  {method.icon}
                </span>
              </div>
              <h3 className="text-base font-semibold text-[#3D2B1F]">{method.title}</h3>
              <p className="mt-1 text-xs text-[#5a4e46] mb-4">{method.desc}</p>
              <span className="text-sm font-semibold text-[#3D2B1F]">{method.action}</span>
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
              <h2 className="text-2xl font-semibold tracking-tight text-[#3D2B1F] mb-2">ส่งข้อความหาเรา</h2>
              <p className="text-sm text-[#5a4e46] mb-8">
                เราจะติดต่อกลับภายใน 24 ชั่วโมง
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
                <h3 className="text-lg font-semibold text-[#047857] mb-2">ส่งข้อความสำเร็จ!</h3>
                <p className="text-sm text-[#065F46] max-w-sm mx-auto">
                  ขอบคุณที่ติดต่อเรา เราได้รับข้อความของคุณแล้วและจะรีบตอบกลับโดยเร็วที่สุด
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 text-sm font-semibold text-[#047857] underline hover:text-[#065F46]"
                >
                  ส่งข้อความอื่น
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={labelClass}>ชื่อ</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="สมชาย ใจดี"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClass}>เบอร์โทรศัพท์</label>
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
                  <label htmlFor="email" className={labelClass}>ที่อยู่อีเมล</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className={labelClass}>หัวข้อ</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="คุณมีเรื่องให้เราช่วยหรือไม่?"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>ข้อความ</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="บอกรายละเอียดเราได้เลย..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="pt-2">
                  <ClickSparkButton>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center rounded-xl bg-[#3D2B1F] px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-[#5a4e46] hover:shadow-[0_4px_14px_0_rgb(61,43,31,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3D2B1F] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                          กำลังส่ง...
                        </span>
                      ) : (
                        'ส่งข้อความ'
                      )}
                    </button>
                  </ClickSparkButton>
                </div>
              </form>
            )}
          </motion.div>

          {/* ── Office Info ── */}
          <motion.div
            className="h-full flex flex-col"
            initial={reduceMotion ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <div className="bg-white border border-[#E8E1DF] rounded-2xl p-10 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-[#3D2B1F] uppercase mb-2">สำนักงานใหญ่</h3>
                <p className="text-sm text-[#5a4e46] leading-relaxed">
                  123 ถนนสุขุมวิท<br />
                  เขตวัฒนา, กรุงเทพมหานคร 10110<br />
                  ประเทศไทย
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-[#3D2B1F] uppercase mb-2">โซเชียลมีเดีย</h3>
                <div className="flex gap-4">
                  {['instagram', 'facebook', 'twitter'].map((social) => (
                    <a key={social} href="#" className="text-[#A0724A] hover:text-[#3D2B1F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3D2B1F] rounded">
                      <img src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${social}.svg`} alt={social} className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity" style={{ filter: 'invert(19%) sepia(21%) saturate(1142%) hue-rotate(345deg) brightness(97%) contrast(93%)' }} />
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

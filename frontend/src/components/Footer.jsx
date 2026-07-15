import { motion, useReducedMotion } from 'framer-motion'

const Footer = () => {
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }

  return (
    <motion.footer
      className="bg-[#3D2B1F] text-[#FAF6F1]"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={transition}
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-[#A0724A]">UDEE</h2>
            <p className="text-sm leading-7 text-[#C8A882]">
              การันตีโต๊ะเฟอร์นิเจอร์ดีไซน์ไทย คุณภาพสูง พร้อมบริการจัดส่งฟรีทั่วไทยเมื่อสั่งซื้อครบกำหนด
            </p>
            <div className="flex gap-4 pt-2">
              <motion.a
                href="#"
                whileHover={{ y: -2, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#C8A882] hover:text-[#A0724A] transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -2, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#C8A882] hover:text-[#A0724A] transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -2, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#C8A882] hover:text-[#A0724A] transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#A0724A]">หมวดหมู่สินค้า</h3>
            <div className="space-y-2 text-sm">
              {['โต๊ะกินข้าว', 'โต๊ะทำงาน', 'โต๊ะตกแต่ง', 'โต๊ะคอมพิวเตอร์'].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="block text-[#C8A882] hover:text-[#A0724A] transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#A0724A]">บริการลูกค้า</h3>
            <div className="space-y-2 text-sm">
              {['ติดตามสถานะสินค้า', 'นโยบายการคืนสินค้า', 'การจัดส่ง', 'คำถามที่พบบ่อย'].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="block text-[#C8A882] hover:text-[#A0724A] transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#A0724A]">ติดต่อเรา</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[#A0724A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-[#C8A882]">support@udee.co.th</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[#A0724A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-[#C8A882]">02-123-4567</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[#A0724A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[#C8A882]">จันทร์ - ศุกร์ 9:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        {/* <div className="mt-12 pt-8 border-t border-[#5a4e46]/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#A0724A] mb-2">รับข่าวสารและโปรโมชั่น</h3>
              <p className="text-sm text-[#C8A882]">สมัครรับจดหมายข่าวเพื่อรับโปรโมชั่นพิเศษ</p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="อีเมลของคุณ"
                className="flex-1 min-w-[250px] px-4 py-2 rounded-lg bg-[#5a4e46]/20 border border-[#5a4e46]/30 text-[#FAF6F1] placeholder-[#C8A882] focus:outline-none focus:border-[#A0724A] transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg bg-[#A0724A] text-white font-medium hover:bg-[#8B5E3A] transition-colors"
              >
                สมัคร
              </motion.button>
            </div>
          </div>
        </div> */}

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[#5a4e46]/30 text-center text-sm text-[#C8A882]">
          <p>© 2024 UDEE. สงวนลิขสิทธิ์ทุกประการ</p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer

import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cartPageData } from '../data/cartPageData'

const defaultCart = cartPageData

const formatPrice = (value) => `฿${value.toLocaleString('th-TH')}`

const CartPage = ({ cart = defaultCart }) => {
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState(false)

  const subtotal = useMemo(() => cart.items.reduce((sum, item) => sum + item.price * item.qty, 0), [cart.items])
  const discount = applied ? cart.promo : 0
  const total = subtotal - discount + cart.shipping

  return (
    <motion.main
      className="min-h-screen bg-[#F7F2EC] text-[#1D1B1A]"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
    >
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <motion.div
              className="rounded-[2rem] bg-white p-10 shadow-[0_2px_25px_rgba(61,43,31,0.08)]"
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={transition}
            >
              <h1 className="text-4xl font-semibold text-[#3D2B1F] mb-4">ตะกร้าสินค้าของคุณ</h1>
              <p className="text-sm text-[#5a4e46]">พร้อมสำหรับการชำระเงินและจัดส่ง</p>
            </motion.div>
            <motion.div
              className="rounded-[2rem] bg-white p-8 shadow-[0_2px_15px_rgba(61,43,31,0.08)]"
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...transition, delay: 0.1 }}
            >
              <div className="space-y-6">
                {cart.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-[1.5rem] border border-[#E8E1DF] p-5 sm:flex-row sm:items-center"
                    initial={reduceMotion ? false : { y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ ...transition, delay: 0.15 + index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="h-28 w-full overflow-hidden rounded-3xl bg-[#F3ECEA] sm:w-36">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-semibold text-[#3D2B1F]">{item.name}</p>
                      <p className="text-sm text-[#81756e] mt-2">จำนวน: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-[#A0724A]">{formatPrice(item.price * item.qty)}</p>
                      <p className="text-sm text-[#81756e]">หน่วยละ {formatPrice(item.price)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          <aside className="space-y-8">
            <div className="rounded-[2rem] bg-white p-8 shadow-[0_2px_15px_rgba(61,43,31,0.08)]">
              <h2 className="text-2xl font-semibold text-[#3D2B1F] mb-6">สรุปคำสั่งซื้อ</h2>
              <div className="space-y-4 text-sm text-[#5a4e46]">
                <div className="flex justify-between">
                  <span>ยอดรวมสินค้า</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>คูปอง</span>
                  <span>{applied ? `- ${formatPrice(discount)}` : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span>{cart.shipping === 0 ? 'ฟรี' : formatPrice(cart.shipping)}</span>
                </div>
              </div>
              <div className="mt-6 border-t border-[#E8E1DF] pt-6 flex items-center justify-between text-lg font-bold text-[#3D2B1F]">
                <span>ยอดชำระทั้งหมด</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button className="mt-8 w-full rounded-2xl bg-[#3D2B1F] px-6 py-4 text-white font-semibold hover:opacity-90 transition">
                ไปที่การชำระเงิน
              </button>
            </div>
            <div className="rounded-[2rem] bg-[#FEF4EA] p-8 shadow-[0_2px_15px_rgba(61,43,31,0.08)]">
              <h3 className="text-xl font-semibold text-[#3D2B1F] mb-4">มีโค้ดส่วนลด?</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={coupon}
                  onChange={(event) => setCoupon(event.target.value)}
                  placeholder="กรอกโค้ดส่วนลด"
                  className="w-full rounded-2xl border border-[#D2C4BC] bg-white px-4 py-3 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                />
                <button
                  type="button"
                  onClick={() => setApplied(Boolean(coupon))}
                  className="w-full rounded-2xl bg-[#3D2B1F] px-6 py-3 text-white hover:opacity-90 transition"
                >
                  ใช้คูปอง
                </button>
                {applied && <p className="text-sm text-[#3D2B1F]">โค้ดส่วนลดของคุณถูกนำไปใช้แล้ว</p>}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </motion.main>
  )
}

export default CartPage

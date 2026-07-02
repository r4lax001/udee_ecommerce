import { useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { checkoutPageData } from '../data/checkoutPageData'

const formatPrice = (value) => `฿${value.toLocaleString('th-TH')}`

const CheckoutPage = ({ checkout = checkoutPageData }) => {
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingInfo, setShippingInfo] = useState({ name: '', phone: '', address: '', city: '', district: '', zip: '' })
  const [paymentInfo, setPaymentInfo] = useState({ transferDate: '', amount: '', slip: null })
  const [success, setSuccess] = useState(false)

  const total = useMemo(
    () => checkout.totals.subtotal - checkout.totals.discount + checkout.totals.shipping,
    [checkout.totals],
  )

  return (
    <motion.main
      className="min-h-screen bg-[#F2EBE2] text-[#1D1B1A]"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
    >
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              className="rounded-3xl bg-white p-10 shadow-[0_2px_8px_rgba(61,43,31,0.08)]"
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={transition}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-[#3D2B1F]">{checkout.title}</h1>
                  <p className="text-sm text-[#5a4e46] mt-2">เลือกขั้นตอนแล้วกรอกข้อมูลให้ครบถ้วน</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {checkout.steps.map((step, index) => (
                    <span
                      key={step}
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        index + 1 === currentStep
                          ? 'bg-[#3D2B1F] text-white'
                          : 'bg-[#F3ECEA] text-[#5a4e46]'
                      }`}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
            {success ? (
              <div className="rounded-3xl bg-white p-10 shadow-[0_2px_8px_rgba(61,43,31,0.08)] text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#C8A882] text-white">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <h2 className="text-2xl font-semibold text-[#3D2B1F]">ได้รับคำสั่งซื้อเรียบร้อยแล้ว</h2>
                <p className="mt-4 text-sm text-[#5a4e46]">ขอบคุณที่ไว้วางใจเลือก UDEE เฟอร์นิเจอร์ ทางเราจะตรวจสอบยอดเงินและเตรียมจัดส่งให้คุณโดยเร็วที่สุด</p>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1) || setSuccess(false)}
                  className="mt-8 rounded-2xl bg-[#3D2B1F] px-10 py-3 text-white hover:opacity-90 transition"
                >
                  กลับสู่หน้าหลัก
                </button>
              </div>
            ) : currentStep === 1 ? (
              <div className="rounded-3xl bg-white p-10 shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
                <h2 className="text-2xl font-semibold mb-8 text-[#3D2B1F]">ข้อมูลการจัดส่ง</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    { label: 'ชื่อ-นามสกุล', name: 'name', type: 'text' },
                    { label: 'เบอร์โทรศัพท์', name: 'phone', type: 'tel' },
                    { label: 'ที่อยู่', name: 'address', type: 'text', full: true },
                    { label: 'จังหวัด', name: 'city', type: 'text' },
                    { label: 'เขต/อำเภอ', name: 'district', type: 'text' },
                    { label: 'รหัสไปรษณีย์', name: 'zip', type: 'text' },
                  ].map((field) => (
                    <label key={field.name} className={`${field.full ? 'md:col-span-2' : ''} flex flex-col gap-2`}>
                      <span className="text-sm font-medium text-[#81756E]">{field.label}</span>
                      <input
                        type={field.type}
                        value={shippingInfo[field.name]}
                        onChange={(event) => setShippingInfo((prev) => ({ ...prev, [field.name]: event.target.value }))}
                        className="rounded-2xl border border-[#D2C4BC] bg-[#F9F2F0] px-4 py-3 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                      />
                    </label>
                  ))}
                </div>
                <div className="mt-10 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="rounded-2xl bg-[#3D2B1F] px-8 py-3 text-white hover:opacity-90 transition"
                  >
                    ถัดไป: ชำระเงิน
                  </button>
                </div>
              </div>
            ) : currentStep === 2 ? (
              <div className="rounded-3xl bg-white p-10 shadow-[0_2px_8px_rgba(61,43,31,0.08)] space-y-10">
                <div>
                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">ช่องทางการชำระเงิน</h2>
                  <div className="mt-6 grid gap-6">
                    <div className="rounded-3xl bg-[#FEF4EA] p-6 border border-[#E8E1DF]">
                      <p className="font-semibold text-[#3D2B1F]">โอนผ่านธนาคาร</p>
                      <p className="text-sm text-[#5a4e46] mt-3">ธนาคารกสิกรไทย (K-Bank)</p>
                      <p className="text-sm text-[#5a4e46]">ชื่อบัญชี: บจก. ยูดี เฟอร์นิเจอร์ (UDEE Furniture)</p>
                      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                        <p className="font-semibold">123-4-56789-0</p>
                        <button type="button" className="text-[#A0724A] font-medium">คัดลอก</button>
                      </div>
                    </div>
                    <div className="rounded-3xl p-6 border border-[#E8E1DF]">
                      <div className="grid gap-6 md:grid-cols-2">
                        <label className="flex flex-col gap-2 text-sm text-[#81756E]">
                          วันที่โอน
                          <input
                            type="date"
                            value={paymentInfo.transferDate}
                            onChange={(event) => setPaymentInfo((prev) => ({ ...prev, transferDate: event.target.value }))}
                            className="rounded-2xl border border-[#D2C4BC] bg-[#F9F2F0] px-4 py-3 outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                          />
                        </label>
                        <label className="flex flex-col gap-2 text-sm text-[#81756E]">
                          จำนวนเงิน (บาท)
                          <input
                            type="number"
                            value={paymentInfo.amount}
                            onChange={(event) => setPaymentInfo((prev) => ({ ...prev, amount: event.target.value }))}
                            placeholder="0.00"
                            className="rounded-2xl border border-[#D2C4BC] bg-[#F9F2F0] px-4 py-3 outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                          />
                        </label>
                      </div>
                      <label className="mt-6 flex flex-col gap-2 text-sm text-[#81756E]">
                        อัปโหลดสลิป
                        <input
                          type="file"
                          onChange={(event) => setPaymentInfo((prev) => ({ ...prev, slip: event.target.files?.[0] ?? null }))}
                          className="rounded-2xl border border-[#D2C4BC] bg-[#F9F2F0] px-4 py-3 outline-none"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="rounded-2xl border border-[#3D2B1F] px-8 py-3 text-[#3D2B1F] hover:bg-[#F3ECEA] transition"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="rounded-2xl bg-[#3D2B1F] px-8 py-3 text-white hover:opacity-90 transition"
                  >
                    ยืนยันการสั่งซื้อ
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          <aside className="lg:col-span-4 sticky top-24 self-start space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-[0_2px_8px_rgba(61,43,31,0.08)] border border-[#E8E1DF]">
              <h3 className="text-2xl font-semibold text-[#3D2B1F] mb-6">สรุปคำสั่งซื้อ</h3>
              {checkout.products.map((product) => (
                <div key={product.name} className="flex gap-4 border-b border-[#E8E1DF] pb-4 mb-4">
                  <div className="h-20 w-20 overflow-hidden rounded-2xl bg-[#F3ECEA]">
                    <img className="h-full w-full object-cover" src={product.image} alt={product.name} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#3D2B1F]">{product.name}</p>
                    <p className="text-sm text-[#81756E]">จำนวน: {product.qty}</p>
                  </div>
                  <p className="font-semibold text-[#A0724A]">{product.price}</p>
                </div>
              ))}
              <div className="space-y-3 text-sm text-[#5a4e46]">
                <div className="flex justify-between">
                  <span>รวมรายการสินค้า</span>
                  <span>{formatPrice(checkout.totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ส่วนลด</span>
                  <span className="text-[#A0724A]">-{formatPrice(checkout.totals.discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span>{checkout.totals.shipping === 0 ? 'ฟรี' : formatPrice(checkout.totals.shipping)}</span>
                </div>
              </div>
              <div className="mt-4 border-t border-[#E8E1DF] pt-4 flex justify-between text-lg font-bold text-[#3D2B1F]">
                <span>ยอดสุทธิ</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="mt-6 rounded-2xl bg-[#FFF1E7] p-4 text-sm text-[#5a4e46]">
                บริการจัดส่งและประกอบหน้างานฟรี พร้อมรับประกันคุณภาพจาก UDEE
              </div>
            </div>
          </aside>
        </div>
      </section>
    </motion.main>
  )
}

export default CheckoutPage

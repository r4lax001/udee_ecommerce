import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { productDetailPageData } from '../data/productDetailPageData'
import { getProductById } from '../services/products'
import ClickSparkButton from '../components/ClickSparkButton'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [mainImage, setMainImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  const reduceMotion = useReducedMotion()
  const scrollRef = useRef(null)

  const transition = { duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  useEffect(() => {
    if (!id) return
    setLoading(true)

    getProductById(id)
      .then((data) => {
        if (data) {
          setProduct(data)
          setSelectedVariant(data.variants?.[0] || null)
          setSelectedColor(data.colors?.[0] || null)
          setSelectedMaterial(data.materialOptions?.[0] || null)
          setMainImage(data.gallery?.[0] || '')
        } else {
          setProduct(null)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF6F1]">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#E8E1DF] border-t-[#A0724A]" />
          <p className="text-sm font-medium text-[#5a4e46]">กำลังโหลดข้อมูลสินค้า...</p>
        </motion.div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF6F1] px-6">
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-[0_24px_70px_rgba(61,43,31,0.08)]">
          <p className="text-xl font-semibold text-[#3D2B1F]">ไม่พบสินค้าที่ร้องขอ</p>
          <p className="mt-3 text-sm text-[#5a4e46]">กรุณาลองกลับไปยังหน้าสินค้าหรือเลือกสินค้าที่ใช้งานได้อีกครั้ง</p>
        </div>
      </main>
    )
  }

  const scrollRelated = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF6F1]">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#E8E1DF] border-t-[#A0724A]" />
          <p className="text-sm font-medium text-[#5a4e46]">กำลังโหลดข้อมูลสินค้า...</p>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#1D1B1A]">
      {/* ── Breadcrumbs ── */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-4">
        <motion.nav 
          className="flex items-center gap-2 text-sm text-[#81756E]"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={transition}
        >
          <Link to="/" className="hover:text-[#A0724A] transition">หน้าแรก</Link>
          <span className="text-[10px]">▶</span>
          <Link to="/products" className="hover:text-[#A0724A] transition">เฟอร์นิเจอร์</Link>
          <span className="text-[10px]">▶</span>
          <span className="text-[#3D2B1F] font-medium">{product.name}</span>
        </motion.nav>
      </div>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 pb-16"
      >
        <div className="grid gap-12 lg:grid-cols-2">
          
          {/* ── Left Column: Images ── */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="space-y-6"
          >
            {/* Main Image */}
            <motion.div 
              className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-[0_24px_50px_rgba(61,43,31,0.06)] group"
              whileHover={{ scale: 1.01 }}
              transition={transition}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={mainImage}
                  src={mainImage}
                  alt={product.name}
                  className="h-[500px] w-full object-cover sm:h-[600px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                />
              </AnimatePresence>
              
              {/* Badges */}
              {product.badge && (
                <motion.div 
                  className="absolute left-6 top-6 rounded-full bg-[#3D2B1F] px-5 py-2 text-xs font-semibold tracking-wider text-white shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, ...transition }}
                >
                  {product.badge}
                </motion.div>
              )}
            </motion.div>

            {/* Thumbnails */}
            <motion.div 
              className="grid grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ...transition }}
            >
              {product.gallery.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setMainImage(src)}
                  className={`relative overflow-hidden rounded-2xl bg-white border-2 transition-all duration-300 ${
                    mainImage === src ? 'border-[#A0724A] shadow-md scale-100' : 'border-transparent hover:border-[#E8E1DF] opacity-70 hover:opacity-100 scale-95 hover:scale-100'
                  }`}
                >
                  <img src={src} alt="Gallery thumbnail" className="h-28 w-full object-cover" />
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right Column: Details & Actions ── */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ...transition }}
            className="flex flex-col h-full"
          >
            {/* Title & Price Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <motion.h1 
                  className="text-4xl font-semibold leading-tight text-[#3D2B1F] sm:text-5xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, ...transition }}
                >
                  {product.name}
                </motion.h1>
                <motion.div 
                  className="mt-3 flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex text-[#C8A882] text-sm">★★★★★</div>
                  <span className="text-sm font-medium text-[#5a4e46]">4.9 (124 รีวิว)</span>
                  <span className="h-4 w-px bg-[#D2C4BC]" />
                  <span className="text-sm font-medium text-[#4A7C59]">ขายแล้ว 850 ชิ้น</span>
                </motion.div>
              </div>
              
              {/* Quick Actions (Wishlist/Share) */}
              <motion.div 
                className="flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
                    isFavorite ? 'border-red-500 bg-red-50 text-red-500' : 'border-[#E8E1DF] bg-white text-[#81756E] hover:border-[#A0724A] hover:text-[#A0724A]'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
                    favorite
                  </span>
                </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E8E1DF] bg-white text-[#81756E] transition hover:border-[#A0724A] hover:text-[#A0724A]">
                  <span className="material-symbols-outlined">share</span>
                </button>
              </motion.div>
            </div>

            <motion.div 
              className="mt-8 flex items-baseline gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ...transition }}
            >
              <span className="text-4xl font-bold text-[#A0724A]">{product.price}</span>
              {product.oldPrice && (
                <span className="text-lg text-[#81756E] line-through decoration-1">{product.oldPrice}</span>
              )}
            </motion.div>
            
            <motion.p 
              className="mt-6 text-base leading-8 text-[#5a4e46]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {product.description}
            </motion.p>

            {/* Selection Card */}
            <motion.div 
              className="mt-8 rounded-[2rem] bg-white p-8 shadow-[0_12px_40px_rgba(61,43,31,0.06)] border border-transparent hover:border-[#E8E1DF] transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, ...transition }}
            >
              <div className="space-y-8">
                
                {/* Variant (Size) */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <p className="font-medium text-[#3D2B1F]">ขนาดความยาว</p>
                    <button className="text-xs text-[#A0724A] hover:underline">คู่มือวัดขนาด</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant}
                        onClick={() => setSelectedVariant(variant)}
                        className={`rounded-2xl border px-6 py-3 text-sm font-medium transition-all ${
                          selectedVariant === variant
                            ? 'border-[#3D2B1F] bg-[#3D2B1F] text-white shadow-md'
                            : 'border-[#D2C4BC] text-[#5a4e46] hover:border-[#A0724A] hover:bg-[#F8F3EB]'
                        }`}
                      >
                        {variant}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors & Material Row */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="font-medium text-[#3D2B1F] mb-3">เฉดสีไม้</p>
                    <div className="flex flex-wrap items-center gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`relative h-12 w-12 rounded-full border-2 transition-all ${
                            selectedColor === color ? 'border-[#3D2B1F] scale-110' : 'border-[#E8E1DF] hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        >
                          {selectedColor === color && (
                            <span className="absolute inset-0 flex items-center justify-center text-white mix-blend-difference">
                              <span className="material-symbols-outlined text-[18px]">check</span>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-[#3D2B1F] mb-3">วัสดุหน้าท็อป</p>
                    <select
                      value={selectedMaterial}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      className="w-full rounded-2xl border border-[#D2C4BC] bg-[#F8F3EB] px-5 py-3.5 text-sm text-[#3D2B1F] outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20 transition-all"
                    >
                      {product.materialOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quantity & CTA */}
                <div className="pt-4 border-t border-[#E8E1DF] space-y-4">
                  <div className="flex gap-4">
                    <div className="flex w-32 items-center justify-between rounded-2xl border border-[#D2C4BC] bg-[#F8F3EB] p-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-[#5a4e46] hover:bg-white transition"
                      >
                        -
                      </button>
                      <span className="font-semibold text-[#3D2B1F]">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-[#5a4e46] hover:bg-white transition"
                      >
                        +
                      </button>
                    </div>
                    <ClickSparkButton 
                      className="flex-1 rounded-2xl bg-[#3D2B1F] px-8 py-4 text-white font-semibold hover:bg-[#2A1F14] transition shadow-lg shadow-[#3D2B1F]/20"
                    >
                      สั่งซื้อทันที
                    </ClickSparkButton>
                  </div>
                  <button className="w-full rounded-2xl border border-[#3D2B1F] px-8 py-4 font-semibold text-[#3D2B1F] hover:bg-[#F8F3EB] transition flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                    เพิ่มลงตะกร้า
                  </button>
                </div>
                
              </div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              className="mt-8 grid gap-4 grid-cols-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, ...transition }}
            >
              {[
                { title: 'จัดส่งฟรี', desc: 'ยอด 5,000.- ขึ้นไป', icon: 'local_shipping' },
                { title: 'รับประกัน 5 ปี', desc: 'โครงสร้างไม้แท้', icon: 'verified' },
                { title: 'คืนสินค้า 30 วัน', desc: 'เปลี่ยนคืนได้ง่าย', icon: 'assignment_return' }
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 text-center shadow-sm">
                  <span className="material-symbols-outlined text-[#A0724A] text-[28px] mb-2">{item.icon}</span>
                  <p className="text-xs font-semibold text-[#3D2B1F]">{item.title}</p>
                  <p className="mt-1 text-[10px] text-[#81756E]">{item.desc}</p>
                </div>
              ))}
            </motion.div>
            
          </motion.div>
        </div>
      </motion.section>

      {/* ── Additional Details Section ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={transition}
        className="max-w-7xl mx-auto px-6 pb-20"
      >
        <div className="rounded-[2.5rem] bg-white p-10 md:p-14 shadow-[0_12px_40px_rgba(61,43,31,0.04)]">
          <h2 className="text-2xl font-semibold text-[#3D2B1F] mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#A0724A]">info</span>
            รายละเอียดสินค้า
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-semibold text-[#3D2B1F] mb-4 text-lg">ภาพรวม</h3>
              <p className="text-sm leading-8 text-[#5a4e46]">
                {product.description}
                <br/><br/>
                โต๊ะตัวนี้ถูกออกแบบมาด้วยแนวคิด Minimalist ที่ผสมผสานความอบอุ่นของไม้ธรรมชาติเข้ากับดีไซน์ที่ทันสมัย เหมาะสำหรับทุกมุมของบ้าน ไม่ว่าจะเป็นห้องรับประทานอาหาร หรือพื้นที่ทำงาน
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#3D2B1F] mb-4 text-lg">ข้อมูลเชิงเทคนิค</h3>
              <ul className="space-y-4 text-sm text-[#5a4e46]">
                {product.specs.map((spec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#C8A882] text-[18px]">check_circle</span>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Related Products ── */}
      <motion.section 
        className="max-w-7xl mx-auto px-6 pb-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold text-[#3D2B1F]">สินค้าที่คุณอาจจะชอบ</h2>
          <div className="flex gap-2">
            <button onClick={() => scrollRelated('left')} className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E8E1DF] bg-white text-[#3D2B1F] transition hover:border-[#A0724A] hover:text-[#A0724A]">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button onClick={() => scrollRelated('right')} className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E8E1DF] bg-white text-[#3D2B1F] transition hover:border-[#A0724A] hover:text-[#A0724A]">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar snap-x snap-mandatory"
        >
          {product.gallery.map((src, index) => (
            <motion.div 
              key={index} 
              className="min-w-[280px] md:min-w-[320px] snap-start rounded-[2rem] bg-white p-5 shadow-sm border border-transparent transition-all duration-300 hover:shadow-xl hover:border-[#E8E1DF] cursor-pointer group"
              whileHover={{ y: -5 }}
            >
              <div className="relative h-[320px] overflow-hidden rounded-[1.5rem] bg-[#F8F3EB]">
                <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={src} alt="Related product" />
              </div>
              <div className="mt-5">
                <p className="text-xs uppercase tracking-widest text-[#A0724A] mb-1">คอลเลกชันใหม่</p>
                <p className="font-semibold text-[#3D2B1F] text-lg">โต๊ะไม้สไตล์มินิมอล</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-lg font-bold text-[#3D2B1F]">฿5,200</p>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F3EB] text-[#3D2B1F] transition group-hover:bg-[#3D2B1F] group-hover:text-white">
                    <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  )
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { productDetailPageData } from '../data/productDetailPageData'

const ProductDetailPage = ({ product = productDetailPageData }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedMaterial, setSelectedMaterial] = useState(product.materialOptions[0])
  const [quantity, setQuantity] = useState(1)
  const [mainImage, setMainImage] = useState(product.gallery[0])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const reduceMotion = useReducedMotion()

  const transition = { duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  useEffect(() => {
    setLoading(true)
    // Simulate data loading
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#1D1B1A]">
      {loading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center min-h-screen"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#A0724A] border-t-transparent" />
        </motion.div>
      ) : error ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center min-h-screen"
        >
          <div className="text-center">
            <p className="text-[#3D2B1F] text-xl">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 rounded-2xl bg-[#3D2B1F] px-6 py-3 text-white hover:opacity-90 transition"
            >
              ลองใหม่
            </button>
          </div>
        </motion.div>
      ) : (
        <>
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6 py-16"
        >
          <div className="grid gap-10 lg:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={transition}
              className="space-y-6"
            >
              <motion.div 
                className="relative overflow-hidden rounded-[2rem] bg-[#FAF6F1] shadow-2xl cursor-zoom-in group"
                whileHover={{ scale: 1.02 }}
                transition={transition}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={mainImage}
                    src={mainImage}
                    alt={product.name}
                    className="h-full min-h-[420px] w-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={transition}
                  />
                </AnimatePresence>
                <motion.div 
                  className="absolute left-6 top-6 rounded-full bg-[#C8A882] px-4 py-2 text-sm font-semibold text-[#2A1F14]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, ...transition }}
                >
                  {product.badge}
                </motion.div>
              </motion.div>
            <motion.div 
              className="grid grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ...transition }}
            >
              {product.gallery.map((src, index) => (
                <motion.button
                  key={src}
                  type="button"
                  onClick={() => setMainImage(src)}
                  className={`overflow-hidden rounded-2xl border-2 transition-all ${
                    mainImage === src ? 'border-[#A0724A] ring-2 ring-[#A0724A]/20' : 'border-[#E8E1DF] hover:border-[#A0724A]'
                  } bg-white`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, ...transition }}
                >
                  <img src={src} alt="Gallery" className="h-24 w-full object-cover" />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={transition}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...transition }}
            >
              <h1 className="text-4xl font-semibold text-[#3D2B1F]">{product.name}</h1>
              <div className="mt-4 flex items-end gap-4">
                <span className="text-4xl font-bold text-[#3D2B1F]">{product.price}</span>
                <span className="text-sm line-through text-[#81756E]">{product.oldPrice}</span>
              </div>
            </motion.div>
            <motion.p 
              className="text-sm leading-7 text-[#5a4e46]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ...transition }}
            >
              {product.description}
            </motion.p>
            <motion.div 
              className="rounded-3xl bg-white p-6 shadow-[0_2px_8px_rgba(61,43,31,0.08)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, ...transition }}
            >
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-[#81756E]">ขนาดความยาว</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {product.variants.map((variant) => (
                      <motion.button
                        key={variant}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`rounded-2xl px-5 py-3 text-sm font-medium transition ${
                          selectedVariant === variant
                            ? 'bg-[#3D2B1F] text-white'
                            : 'border border-[#D2C4BC] text-[#5a4e46] hover:bg-[#F3ECEA]'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                          scale: selectedVariant === variant ? 1 : 1,
                          backgroundColor: selectedVariant === variant ? '#3D2B1F' : 'transparent'
                        }}
                      >
                        {variant}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#81756E]">เฉดสีไม้</p>
                  <div className="mt-3 flex items-center gap-3">
                    {product.colors.map((color) => (
                      <motion.button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`h-10 w-10 rounded-full border-2 ${
                          selectedColor === color ? 'border-[#3D2B1F]' : 'border-[#E8E1DF]'
                        }`}
                        style={{ backgroundColor: color }}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{
                          scale: selectedColor === color ? 1.1 : 1,
                          borderColor: selectedColor === color ? '#3D2B1F' : '#E8E1DF'
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[#81756E] block mb-3">วัสดุหน้าท็อป</label>
                  <select
                    value={selectedMaterial}
                    onChange={(event) => setSelectedMaterial(event.target.value)}
                    className="w-full rounded-2xl border border-[#D2C4BC] bg-[#F9F2F0] px-4 py-3 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                  >
                    {product.materialOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center border border-[#D2C4BC] rounded-2xl overflow-hidden">
                    <motion.button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-4 py-3 text-[#5a4e46] hover:bg-[#F3ECEA]"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      -
                    </motion.button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                      className="w-16 border-none text-center text-lg outline-none"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-4 py-3 text-[#5a4e46] hover:bg-[#F3ECEA]"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      +
                    </motion.button>
                  </div>
                  <motion.button 
                    className="w-full rounded-2xl bg-[#3D2B1F] px-8 py-4 text-white font-semibold hover:opacity-90 transition sm:w-auto"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    เพิ่มลงตะกร้า
                  </motion.button>
                </div>
                <motion.button 
                  className="w-full rounded-2xl border border-[#3D2B1F] px-8 py-4 text-[#3D2B1F] font-semibold hover:bg-[#F3ECEA] transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  สั่งซื้อเลย
                </motion.button>
              </div>
            </motion.div>
            <motion.div 
              className="grid gap-4 sm:grid-cols-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, ...transition }}
            >
              {[
                { title: 'จัดส่งฟรี', desc: 'ทั่วประเทศเมื่อสั่งซื้อครบตามเงื่อนไข' },
                { title: 'รับประกัน 5 ปี', desc: 'คุณภาพไม้แท้ที่มั่นใจได้' },
                { title: 'คืนสินค้า 30 วัน', desc: 'นโยบายง่ายและเป็นมิตร' }
              ].map((item, index) => (
                <motion.div 
                  key={item.title}
                  className="rounded-3xl bg-white p-6 text-sm shadow-[0_2px_8px_rgba(61,43,31,0.08)]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, ...transition }}
                  whileHover={{ y: -2 }}
                >
                  <p className="font-semibold text-[#3D2B1F]">{item.title}</p>
                  <p className="text-[#81756e] mt-2">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, ...transition }}
          className="max-w-7xl mx-auto px-6 pb-16"
        >
        <motion.div 
          className="rounded-3xl bg-white p-10 shadow-[0_2px_8px_rgba(61,43,31,0.08)]"
          whileHover={{ y: -2 }}
          transition={transition}
        >
          <h2 className="text-2xl font-semibold text-[#3D2B1F] mb-6">รายละเอียดสินค้า</h2>
          <p className="text-sm leading-7 text-[#5a4e46]">{product.description}</p>
          <ul className="mt-6 list-disc space-y-3 pl-5 text-sm text-[#5a4e46]">
            {product.specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
        </motion.div>
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, ...transition }}
        >
          <h2 className="text-2xl font-semibold text-[#3D2B1F] mb-6">สินค้าที่คล้ายกัน</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {product.gallery.map((src, index) => (
              <motion.div 
                key={index} 
                className="min-w-[260px] rounded-3xl bg-white p-4 shadow-[0_2px_8px_rgba(61,43,31,0.08)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, ...transition }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <img className="h-[320px] w-full rounded-3xl object-cover" src={src} alt="Related product" />
                <div className="mt-4">
                  <p className="font-semibold text-[#3D2B1F]">Related Product</p>
                  <p className="text-sm text-[#A0724A]">฿5,200</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>
        </>
      )}
    </main>
  )
}

export default ProductDetailPage

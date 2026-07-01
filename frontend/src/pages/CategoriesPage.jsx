import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { homePageData } from '../data/homePageData'
import ClickSparkButton from '../components/ClickSparkButton'

const productCards = [
  {
    id: 1,
    title: 'โต๊ะกินข้าวไม้โอ๊ค รุ่น Minimalist',
    subtitle: 'โต๊ะกินข้าว',
    price: '฿12,900',
    originalPrice: '฿15,500',
    badge: 'NEW',
    image:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=900&q=80',
  },
  {
    id: 2,
    title: 'โต๊ะกินข้าว Oak Gatherer 6 ที่นั่ง',
    subtitle: 'โต๊ะกินข้าว',
    price: '฿18,500',
    originalPrice: '฿22,500',
    badge: '-15% OFF',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80',
  },
  {
    id: 3,
    title: 'โต๊ะกลางทรงกลม Dark Walnut',
    subtitle: 'โต๊ะตกแต่ง',
    price: '฿4,200',
    soldOut: true,
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&w=900&q=80',
  },
  {
    id: 4,
    title: 'โต๊ะทำงานปรับระดับไฟฟ้า รุ่น Pro',
    subtitle: 'โต๊ะทำงาน',
    price: '฿14,900',
    image:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?crop=entropy&w=900&q=80',
  },
  {
    id: 5,
    title: 'โต๊ะข้างเตียง Maple Soft',
    subtitle: 'โต๊ะข้าง',
    price: '฿3,500',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&w=900&q=80',
  },
  {
    id: 6,
    title: 'โต๊ะเขียนหนังสือ Classic Walnut',
    subtitle: 'โต๊ะทำงาน',
    price: '฿9,800',
    badge: 'BEST SELLER',
    image:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?crop=entropy&w=900&q=80',
  },
]

const CategoriesPage = () => {
  const reduceMotion = useReducedMotion()
  const [sortBy, setSortBy] = useState('ยอดนิยม')
  const [priceValue, setPriceValue] = useState(20000)
  const [selectedSizes, setSelectedSizes] = useState(['120 x 60 ซม.'])
  const [selectedColors, setSelectedColors] = useState(['#3D2B1F'])
  const [selectedMaterials, setSelectedMaterials] = useState(['ไม้โอ๊ค'])
  const transition = { duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }

  const toggleItem = (item, current, setCurrent) => {
    setCurrent((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
    )
  }

  return (
    <motion.main
      className="bg-[#FAF6F1] text-[#1D1B1A] overflow-x-hidden"
      style={{ fontFamily: 'Kanit, Inter, Prompt, Mitr, sans-serif' }}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      <section className="py-12">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            className="mb-10 rounded-[2rem] bg-white p-8 shadow-[0_24px_70px_rgba(61,43,31,0.08)]"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.05 }}
          >
            <p className="text-sm text-[#5a4e46]">หน้าแรก / โต๊ะทั้งหมด</p>
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-[#A0724A]">โต๊ะทั้งหมด</p>
                <h1 className="text-4xl font-semibold text-[#3D2B1F] sm:text-5xl">โต๊ะที่ใช่ในทุกไซซ์และสไตล์</h1>
                <p className="max-w-2xl text-base leading-8 text-[#5a4e46]">
                  ค้นพบโต๊ะคุณภาพพรีเมียม ออกแบบเพื่อความอบอุ่นและฟังก์ชันการใช้งานในบ้านของคุณ
                </p>
              </div>
              <div className="flex items-center rounded-3xl border border-[#E8E1DF] bg-[#F8F3EB] p-4">
                <span className="text-sm text-[#5a4e46]">เรียงตาม</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="ml-4 rounded-2xl border border-[#E8E1DF] bg-white px-4 py-2 text-sm text-[#3D2B1F] outline-none"
                >
                  <option>ยอดนิยม</option>
                  <option>ราคา: ต่ำไปสูง</option>
                  <option>ราคา: สูงไปต่ำ</option>
                  <option>สินค้าใหม่</option>
                </select>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
            <motion.aside
              className="space-y-6 rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(61,43,31,0.08)]"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#3D2B1F]">ตัวกรอง</h2>
                <button className="text-sm font-medium text-[#A0724A]">ล้างตัวกรอง</button>
              </div>

              <div className="space-y-3 rounded-[1.5rem] border border-[#E8E1DF] bg-[#FAF6F1] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A0724A]">หมวดหมู่</p>
                {['โต๊ะทำงาน', 'โต๊ะกินข้าว', 'โต๊ะกลาง', 'โต๊ะข้าง'].map((item) => (
                  <label key={item} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent px-3 py-3 transition hover:border-[#A0724A]/30">
                    <input type="checkbox" className="h-4 w-4 accent-[#A0724A]" />
                    <span className="text-sm text-[#3D2B1F]">{item}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-3 rounded-[1.5rem] border border-[#E8E1DF] bg-[#FAF6F1] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A0724A]">ช่วงราคา</p>
                  <span className="text-sm text-[#5a4e46]">฿8,000 - ฿{priceValue.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="8000"
                  max="20000"
                  step="500"
                  value={priceValue}
                  onChange={(e) => setPriceValue(Number(e.target.value))}
                  className="w-full accent-[#A0724A]"
                />
              </div>

              <div className="space-y-3 rounded-[1.5rem] border border-[#E8E1DF] bg-[#FAF6F1] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A0724A]">ขนาด</p>
                {['120 x 60 ซม.', '140 x 70 ซม.', '160 x 80 ซม.'].map((size) => (
                  <label key={size} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent px-3 py-3 transition hover:border-[#A0724A]/30">
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => toggleItem(size, selectedSizes, setSelectedSizes)}
                      className="h-4 w-4 accent-[#A0724A]"
                    />
                    <span className="text-sm text-[#3D2B1F]">{size}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-3 rounded-[1.5rem] border border-[#E8E1DF] bg-[#FAF6F1] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A0724A]">สี</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { color: '#3D2B1F', label: 'เข้ม' },
                    { color: '#A0764B', label: 'น้ำตาล' },
                    { color: '#E7D6C6', label: 'ครีม' },
                    { color: '#F4EFE7', label: 'ขาว' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() => toggleItem(item.color, selectedColors, setSelectedColors)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border ${selectedColors.includes(item.color) ? 'border-[#A0724A]' : 'border-[#E8E1DF]'}`}
                      style={{ backgroundColor: item.color }}
                      aria-label={item.label}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-[1.5rem] border border-[#E8E1DF] bg-[#FAF6F1] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A0724A]">วัสดุ</p>
                {['ไม้โอ๊ค', 'ไม้เมเปิล', 'โครงเหล็กพ่นสี'].map((material) => (
                  <label key={material} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent px-3 py-3 transition hover:border-[#A0724A]/30">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(material)}
                      onChange={() => toggleItem(material, selectedMaterials, setSelectedMaterials)}
                      className="h-4 w-4 accent-[#A0724A]"
                    />
                    <span className="text-sm text-[#3D2B1F]">{material}</span>
                  </label>
                ))}
              </div>
            </motion.aside>

            <div className="space-y-6">
              <motion.div
                className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition, delay: 0.14 }}
              >
                {productCards.map((product, index) => (
                  <motion.article
                    key={product.id}
                    className="group overflow-hidden rounded-[2rem] bg-white shadow-[0_12px_30px_rgba(61,43,31,0.08)] transition-all duration-500 hover:-translate-y-1"
                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...transition, delay: 0.16 + index * 0.04 }}
                  >
                    <div className="relative overflow-hidden rounded-t-[2rem]">
                      {product.badge && (
                        <span className="absolute left-4 top-4 z-10 rounded-full bg-[#3D2B1F] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-lg shadow-black/10">
                          {product.badge}
                        </span>
                      )}
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-4 p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-[#A0724A]">{product.subtitle}</p>
                          <h3 className="mt-2 text-xl font-semibold text-[#3D2B1F]">{product.title}</h3>
                        </div>
                        {product.soldOut && (
                          <span className="rounded-full bg-[#F2EBE2] px-3 py-1 text-xs font-semibold text-[#5a4e46]">
                            สินค้าหมด
                          </span>
                        )}
                      </div>
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-2xl font-semibold text-[#3D2B1F]">{product.price}</p>
                          {product.originalPrice && (
                            <p className="text-sm text-[#5a4e46] line-through">{product.originalPrice}</p>
                          )}
                        </div>
                        <ClickSparkButton
                          as="link"
                          to="/cart"
                          className={`rounded-full px-4 py-3 text-sm font-semibold text-white transition ${product.soldOut ? 'bg-[#C8C2BB] pointer-events-none' : 'bg-[#3D2B1F] hover:bg-[#1f1913]'}`}
                        >
                          เพิ่มในตะกร้า
                        </ClickSparkButton>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>

              <div className="flex items-center justify-center gap-3 rounded-full bg-white p-4 shadow-[0_12px_30px_rgba(61,43,31,0.08)]">
                <button className="h-11 w-11 rounded-full border border-[#E8E1DF] text-[#5a4e46] transition hover:border-[#A0724A]">‹</button>
                {[1, 2, 3, 4].map((page) => (
                  <button
                    key={page}
                    className={`h-11 min-w-[44px] rounded-full ${page === 1 ? 'bg-[#3D2B1F] text-white' : 'bg-[#F8F3EB] text-[#5a4e46]'}`}
                  >
                    {page}
                  </button>
                ))}
                <button className="h-11 w-11 rounded-full border border-[#E8E1DF] text-[#5a4e46] transition hover:border-[#A0724A]">›</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  )
}

export default CategoriesPage

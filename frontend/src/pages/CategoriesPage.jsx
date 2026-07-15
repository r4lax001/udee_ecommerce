import { useEffect, useState, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ClickSparkButton from '../components/ClickSparkButton'
import { getProducts } from '../services/products'
import { formatPrice } from '../utils/format'

const CategoriesPage = () => {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('ยอดนิยม')
  const [priceValue, setPriceValue] = useState(5000)
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedMaterials, setSelectedMaterials] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const transition = { duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [sortBy, priceValue, selectedSizes, selectedColors, selectedMaterials, selectedCategories])

  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      setLoading(true)
      try {
        const data = await getProducts()
        if (isMounted) setProducts(data || [])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const toggleItem = (item, current, setCurrent) => {
    setCurrent((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
    )
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Filter out empty templates
      if (!product.title || product.price <= 0) return false

      // 2. Filter by category
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(product.category)) {
          return false
        }
      }

      // 3. Filter by price
      if (product.price > priceValue) {
        return false
      }

      // 4. Filter by size
      if (selectedSizes.length > 0) {
        const match = selectedSizes.some((s) => {
          const cleanS = s.replace(/\s+/g, '')
          const cleanP = (product.size || '').replace(/\s+/g, '')
          if (cleanS.includes('120') && (cleanP.includes('120') || product.title.includes('120'))) return true
          if (cleanS.includes('140') && (cleanP.includes('140') || product.title.includes('140'))) return true
          if (cleanS.includes('160') && (cleanP.includes('160') || product.title.includes('160'))) return true
          return false
        })
        if (!match) return false
      }

      // 5. Filter by color
      if (selectedColors.length > 0) {
        const hasColor = selectedColors.some((c) => product.colors?.includes(c))
        if (!hasColor) return false
      }

      // 6. Filter by material
      if (selectedMaterials.length > 0) {
        const hasMaterial = selectedMaterials.some((m) => {
          if (Array.isArray(product.material)) {
            return product.material.includes(m)
          }
          return product.material === m
        })
        if (!hasMaterial) return false
      }

      return true
    })
  }, [products, selectedCategories, priceValue, selectedSizes, selectedColors, selectedMaterials])

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]
    if (sortBy === 'ราคา: ต่ำไปสูง') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'ราคา: สูงไปต่ำ') {
      list.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'สินค้าใหม่') {
      list.sort((a, b) => {
        const aNew = a.badge === 'NEW' ? 1 : 0
        const bNew = b.badge === 'NEW' ? 1 : 0
        return bNew - aNew
      })
    } else {
      // Default: 'ยอดนิยม'
      list.sort((a, b) => (b.sold || 0) - (a.sold || 0))
    }
    return list
  }, [filteredProducts, sortBy])

  const itemsPerPage = 6
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedProducts, currentPage])

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
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSizes([])
                    setSelectedColors([])
                    setSelectedMaterials([])
                    setSelectedCategories([])
                    setPriceValue(5000)
                  }}
                  className="text-sm font-medium text-[#A0724A] hover:text-[#3D2B1F] transition"
                >
                  ล้างตัวกรอง
                </button>
              </div>

              <div className="space-y-3 rounded-[1.5rem] border border-[#E8E1DF] bg-[#FAF6F1] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A0724A]">ประเภทโต๊ะ</p>
                {['โต๊ะทำงาน', 'โต๊ะกินข้าว', 'โต๊ะตกแต่ง',].map((item) => (
                  <label key={item} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent px-3 py-3 transition hover:border-[#A0724A]/30">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(item)}
                      onChange={() => toggleItem(item, selectedCategories, setSelectedCategories)}
                      className="h-4 w-4 accent-[#A0724A]"
                    />
                    <span className="text-sm text-[#3D2B1F]">{item}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-3 rounded-[1.5rem] border border-[#E8E1DF] bg-[#FAF6F1] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A0724A]">ช่วงราคา</p>
                  <span className="text-sm text-[#5a4e46]">฿0 - ฿{priceValue.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
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
                {loading && (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse overflow-hidden rounded-[2rem] bg-white shadow-[0_12px_30px_rgba(61,43,31,0.08)]">
                      <div className="h-72 bg-[#F2EBE2]" />
                      <div className="space-y-3 p-6">
                        <div className="h-4 w-24 rounded bg-[#F2EBE2]" />
                        <div className="h-6 w-2/3 rounded bg-[#F2EBE2]" />
                        <div className="h-10 w-full rounded-full bg-[#F2EBE2]" />
                      </div>
                    </div>
                  ))
                )}

                {!loading && paginatedProducts.map((product, index) => (
                  <motion.article
                    key={product.id}
                    onClick={(e) => {
                      if (!e.target.closest('button') && !e.target.closest('a')) {
                        navigate(`/product-detail/${product.id}`)
                      }
                    }}
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
                          <p className="text-2xl font-semibold text-[#3D2B1F]">{formatPrice(product.price)}</p>
                          {product.originalPrice && (
                            <p className="text-sm text-[#5a4e46] line-through">{formatPrice(product.originalPrice)}</p>
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
                {!loading && paginatedProducts.length === 0 && (
                  <div className="col-span-full py-20 text-center text-[#5a4e46]">
                    ไม่พบสินค้าที่ตรงตามเงื่อนไขการค้นหา
                  </div>
                )}
              </motion.div>

              {sortedProducts.length > 0 && (
                <div className="flex items-center justify-center gap-3 rounded-full bg-white p-4 shadow-[0_12px_30px_rgba(61,43,31,0.08)]">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`h-11 w-11 rounded-full border border-[#E8E1DF] text-[#5a4e46] transition hover:border-[#A0724A] ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`h-11 min-w-[44px] rounded-full transition ${page === currentPage ? 'bg-[#3D2B1F] text-white' : 'bg-[#F8F3EB] text-[#5a4e46] hover:bg-[#FAF6F1]'}`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`h-11 w-11 rounded-full border border-[#E8E1DF] text-[#5a4e46] transition hover:border-[#A0724A] ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  )
}

export default CategoriesPage

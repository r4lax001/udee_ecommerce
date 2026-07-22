import { useEffect, useState, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ClickSparkButton from '../components/ClickSparkButton'
import { getProducts } from '../services/products'
import { formatPrice } from '../utils/format'

const CategoriesPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const reduceMotion = useReducedMotion()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('ยอดนิยม')
  const [priceValue, setPriceValue] = useState(100000)
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedMaterials, setSelectedMaterials] = useState([])
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('category') ? [searchParams.get('category')] : []
  )
  const [currentPage, setCurrentPage] = useState(1)
  const transition = { duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }

  const maxPrice = useMemo(() => {
    if (!products.length) return 100000
    const highest = Math.max(...products.map(p => Number(p.price) || 0))
    return Math.max(100000, highest)
  }, [products])

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [sortBy, priceValue, selectedSizes, selectedColors, selectedMaterials, selectedCategories])

  // Update selected category if URL parameter changes
  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setSelectedCategories([category])
    }
  }, [searchParams])

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

  const availableCategories = useMemo(() => {
    const defaultCats = ['โต๊ะทำงาน', 'โต๊ะกินข้าว', 'โต๊ะตกแต่ง']
    const fromProducts = products.map(p => p.category).filter(Boolean)
    return Array.from(new Set([...defaultCats, ...fromProducts]))
  }, [products])

  const availableSizes = useMemo(() => {
    const sizes = products.map(p => p.size?.trim()).filter(Boolean)
    return Array.from(new Set(sizes)).sort()
  }, [products])

  const availableColors = useMemo(() => {
    const colors = products.flatMap(p => p.colors || []).map(c => c.trim()).filter(Boolean)
    return Array.from(new Set(colors))
  }, [products])

  const availableMaterials = useMemo(() => {
    const materials = products.flatMap(p => {
      if (Array.isArray(p.material)) return p.material
      return p.material ? [p.material] : []
    }).map(m => m.trim()).filter(Boolean)
    return Array.from(new Set(materials))
  }, [products])

  const toggleItem = (item, current, setCurrent) => {
    setCurrent((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
    )
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Filter out empty templates
      if (!product.title || product.price < 0) return false

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
        if (!selectedSizes.includes(product.size)) {
          return false
        }
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
        if (bNew !== aNew) return bNew - aNew
        return b.id - a.id
      })
    } else {
      // Default: 'ยอดนิยม' - secondary sort by ID desc so new products show at top of same sold count
      list.sort((a, b) => {
        const soldDiff = (b.sold || 0) - (a.sold || 0)
        if (soldDiff !== 0) return soldDiff
        return b.id - a.id
      })
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
                <h1 className="text-4xl font-semibold text-[#3D2B1F] sm:text-5xl">โต๊ะที่ใช่ในทุกไซส์และสไตล์</h1>
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
                    setPriceValue(maxPrice)
                  }}
                  className="text-sm font-medium text-[#A0724A] hover:text-[#3D2B1F] transition"
                >
                  ล้างตัวกรอง
                </button>
              </div>

              <div className="space-y-3 rounded-[1.5rem] border border-[#E8E1DF] bg-[#FAF6F1] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A0724A]">ประเภทโต๊ะ</p>
                {availableCategories.map((item) => (
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
                  max={maxPrice}
                  step="100"
                  value={priceValue}
                  onChange={(e) => setPriceValue(Number(e.target.value))}
                  className="w-full accent-[#A0724A]"
                />
              </div>

              {availableSizes.length > 0 && (
                <div className="space-y-3 rounded-[1.5rem] border border-[#E8E1DF] bg-[#FAF6F1] p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A0724A]">ขนาด</p>
                  {availableSizes.map((size) => (
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
              )}

              {availableColors.length > 0 && (
                <div className="space-y-3 rounded-[1.5rem] border border-[#E8E1DF] bg-[#FAF6F1] p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A0724A]">สี</p>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((color) => (
                      <button
                        type="button"
                        key={color}
                        onClick={() => toggleItem(color, selectedColors, setSelectedColors)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border ${selectedColors.includes(color) ? 'border-[#A0724A] scale-110 shadow-md' : 'border-[#E8E1DF] hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                        title={color}
                        aria-label={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {availableMaterials.length > 0 && (
                <div className="space-y-3 rounded-[1.5rem] border border-[#E8E1DF] bg-[#FAF6F1] p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A0724A]">วัสดุ</p>
                  {availableMaterials.map((material) => (
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
              )}
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
                    className="group flex flex-col h-full overflow-hidden rounded-[2rem] bg-white shadow-[0_12px_30px_rgba(61,43,31,0.08)] transition-all duration-500 hover:-translate-y-1"
                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...transition, delay: 0.16 + index * 0.04 }}
                  >
                    <div className="relative overflow-hidden rounded-t-[2rem]">
                      {product.badge && (
                        <span className="absolute left-4 top-4 z-10 rounded-full bg-[#FF0000] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-lg shadow-black/10">
                          {product.badge}
                        </span>
                      )}
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col flex-grow justify-between p-6">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-[#A0724A]">{product.subtitle}</p>
                          {product.soldOut && (
                            <span className="shrink-0 rounded-full bg-[#F2EBE2] px-2.5 py-0.5 text-[10px] font-semibold text-[#5a4e46]">
                              สินค้าหมด
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 text-base font-semibold text-[#3D2B1F] line-clamp-3 h-[4.5rem] overflow-hidden leading-relaxed">
                          {product.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-end justify-between gap-4 mt-6 pt-4 border-t border-[#FAF6F1]">
                        <div>
                          <p className="text-2xl font-bold text-[#3D2B1F]">{formatPrice(product.price)}</p>
                          {product.originalPrice && (
                            <p className="text-xs text-[#81756E] line-through">{formatPrice(product.originalPrice)}</p>
                          )}
                        </div>
                        <ClickSparkButton
                          as="link"
                          to="/cart"
                          className={`rounded-full px-5 py-2.5 text-xs font-semibold text-white transition ${product.soldOut ? 'bg-[#C8C2BB] pointer-events-none' : 'bg-[#3D2B1F] hover:bg-[#1f1913]'}`}
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

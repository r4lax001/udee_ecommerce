import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getProducts } from '../services/products'
import { formatPrice } from '../utils/format'
import { useCart } from '../contexts'

const CategoriesPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('ยอดนิยม')
  const [priceValue, setPriceValue] = useState(100000)

  // Filter States
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedMaterials, setSelectedMaterials] = useState([])
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('category') ? [searchParams.get('category')] : []
  )
  const [currentPage, setCurrentPage] = useState(1)

  const { addItem } = useCart()
  const [favorites, setFavorites] = useState(new Set())

  const maxPrice = useMemo(() => {
    if (!products.length) return 100000
    const highest = Math.max(...products.map(p => Number(p.price) || 0))
    return Math.max(100000, highest)
  }, [products])

  useEffect(() => {
    setCurrentPage(1)
  }, [sortBy, priceValue, selectedSizes, selectedColors, selectedMaterials, selectedCategories])

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

  // Derived Filter Options
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

  const toggleFavorite = (e, productId) => {
    e.stopPropagation()
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(productId)) next.delete(productId)
      else next.add(productId)
      return next
    })
  }

  const handleAddToCart = (e, product) => {
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.title || product.name,
      image: product.image || product.gallery?.[0] || '',
      price: product.price,
      qty: 1,
      variant: product.variants?.[0] || null,
      color: product.colors?.[0] || null,
      material: product.materialOptions?.[0] || null,
    })
    navigate('/cart')
  }

  const clearAllFilters = () => {
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedMaterials([])
    setSelectedCategories([])
    setPriceValue(maxPrice)
  }

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product.title || product.price < 0) return false
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false
      if (product.price > priceValue) return false
      if (selectedSizes.length > 0 && !selectedSizes.includes(product.size)) return false
      if (selectedColors.length > 0 && !selectedColors.some((c) => product.colors?.includes(c))) return false
      if (selectedMaterials.length > 0 && !selectedMaterials.some((m) => {
        return Array.isArray(product.material) ? product.material.includes(m) : product.material === m
      })) return false
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

  const activeFilterCount = selectedCategories.length + selectedSizes.length + selectedColors.length + selectedMaterials.length + (priceValue < maxPrice ? 1 : 0)

  return (
    <main className="bg-[#faf6f1] text-[#111111] min-h-screen selection:bg-[#111111] selection:text-white pb-24" style={{ fontFamily: 'Kanit, Inter, Prompt, Mitr, sans-serif' }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-10 pb-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[#EAEAEA] pb-8">
          <div>
            <nav className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#888888] mb-6">
              <span className="cursor-pointer hover:text-[#111111] transition-colors" onClick={() => navigate('/')}>Home</span>
              <span>/</span>
              <span className="text-[#111111]">Products</span>
            </nav>
            <h1 className="text-5xl font-semibold tracking-tight text-[#111111]">
              Shop All
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <p className="text-xs font-medium text-[#888888]">
              {loading ? '...' : `${sortedProducts.length} Items`}
            </p>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#F9F9F9] border border-[#EAEAEA] rounded-md text-xs font-medium text-[#111111] pl-3 pr-8 py-2 outline-none cursor-pointer hover:border-[#CCCCCC] transition-colors"
              >
                <option>ยอดนิยม</option>
                <option>ราคา: ต่ำไปสูง</option>
                <option>ราคา: สูงไปต่ำ</option>
                <option>สินค้าใหม่</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none text-[#111111]">
                expand_more
              </span>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

          {/* ── Left Sidebar (Highlighted with #FAF6F1) ── */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8 bg-[#FAF6F1] px-6 rounded-2xl h-max">
            <div className="flex items-center justify-between mb-2">
              {/* <h2 className="text-sm font-bold tracking-wide text-[#111111] uppercase">Filters</h2> */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] font-semibold uppercase tracking-wider text-[#888888] hover:text-[#111111] transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-4">
              {availableCategories.length > 0 && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E8E1DF]">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111] mb-4">Category</h3>
                  <ul className="space-y-3">
                    {availableCategories.map((item) => (
                      <li key={item}>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(item)}
                            onChange={() => toggleItem(item, selectedCategories, setSelectedCategories)}
                            className="appearance-none h-4 w-4 border border-[#CCCCCC] checked:bg-[#111111] checked:border-[#111111] rounded-[4px] transition-colors cursor-pointer relative focus:ring-2 focus:ring-offset-1 focus:ring-[#111111]"
                          />
                          <span className="text-sm text-[#444444] group-hover:text-[#111111] transition-colors">{item}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E8E1DF]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">Price</h3>
                  <span className="text-xs text-[#888888]">฿{priceValue.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="500"
                  value={priceValue}
                  onChange={(e) => setPriceValue(Number(e.target.value))}
                  className="w-full h-1 bg-[#EAEAEA] rounded-full appearance-none cursor-pointer accent-[#111111]"
                />
              </div>

              {availableSizes.length > 0 && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E8E1DF]">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111] mb-4">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleItem(size, selectedSizes, setSelectedSizes)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] ${selectedSizes.includes(size)
                            ? 'border-[#111111] bg-[#111111] text-white'
                            : 'border-[#EAEAEA] text-[#444444] hover:border-[#CCCCCC]'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableColors.length > 0 && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E8E1DF]">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111] mb-4">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => toggleItem(color, selectedColors, setSelectedColors)}
                        className={`relative flex h-7 w-7 items-center justify-center rounded-full border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111111] ${selectedColors.includes(color)
                            ? 'border-[#111111] shadow-sm ring-1 ring-[#111111] ring-offset-2'
                            : 'border-[#EAEAEA] hover:border-[#111111]'
                          }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {availableMaterials.length > 0 && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E8E1DF]">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111] mb-4">Material</h3>
                  <ul className="space-y-3">
                    {availableMaterials.map((material) => (
                      <li key={material}>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedMaterials.includes(material)}
                            onChange={() => toggleItem(material, selectedMaterials, setSelectedMaterials)}
                            className="appearance-none h-4 w-4 border border-[#CCCCCC] checked:bg-[#111111] checked:border-[#111111] rounded-[4px] transition-colors cursor-pointer relative focus:ring-2 focus:ring-offset-1 focus:ring-[#111111]"
                          />
                          <span className="text-sm text-[#444444] group-hover:text-[#111111] transition-colors">{material}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          {/* ── Product Grid ── */}
          <div className="flex-1 min-w-0">
            <div className="grid gap-x-6 gap-y-12 grid-cols-2 lg:grid-cols-3 py-7 ">
              {loading && (
                Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="animate-pulse flex flex-col p-4 rounded-xl border border-[#EAEAEA]">
                    <div className="w-full aspect-[4/5] bg-[#F5F5F5] rounded-lg mb-4" />
                    <div className="h-4 w-3/4 bg-[#F5F5F5] rounded mb-2" />
                    <div className="h-4 w-1/4 bg-[#F5F5F5] rounded" />
                  </div>
                ))
              )}

              {!loading && paginatedProducts.map((product) => (
                <article
                  key={product.id}
                  onClick={() => navigate(`/product-detail/${product.id}`)}
                  className="group flex flex-col cursor-pointer bg-white rounded-xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-4 border border-transparent hover:border-[#EAEAEA] p-3"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/product-detail/${product.id}`)}
                >
                  <div className="w-full aspect-[4/5] bg-[#F9F9F9] rounded-lg mb-4 overflow-hidden relative">
                    {product.badge && (
                      <span className="absolute left-2 top-2 z-10 rounded bg-[#ff0000] px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
                        {product.badge}
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-col flex-1 px-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-semibold text-[#111111] leading-snug line-clamp-1 pr-4">
                        {product.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-medium text-[#111111]">{formatPrice(product.price)}</p>
                      {product.originalPrice && (
                        <p className="text-xs text-[#888888] line-through">{formatPrice(product.originalPrice)}</p>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#EAEAEA] flex gap-2">
                      <button
                        disabled={product.soldOut}
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${product.soldOut
                            ? 'bg-[#F0F0F0] text-[#AAAAAA] cursor-not-allowed'
                            : 'bg-[#111111] text-white hover:bg-[#333333]'
                          }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                        {product.soldOut ? 'Sold Out' : 'Add to Cart'}
                      </button>
                      <button
                        onClick={(e) => toggleFavorite(e, product.id)}
                        className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-lg border-1 transition-colors ${favorites.has(product.id)
                            ? ' text-red-500 bg-white'
                            : ' text-[#666666] hover:text-red-500'
                          }`}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: favorites.has(product.id) ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          favorite
                        </span>
                      </button>
                    </div>

                  </div>
                </article>
              ))}

              {!loading && paginatedProducts.length === 0 && (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-4xl text-[#CCCCCC] mb-4">search_off</span>
                  <p className="text-sm text-[#666666] mb-4">No products found for this selection.</p>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-medium underline underline-offset-4 text-[#111111] hover:text-[#666666]"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* ── Pagination ── */}
            {!loading && sortedProducts.length > itemsPerPage && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-8 mt-6 border-t border-[#EAEAEA]">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-[#EAEAEA] text-[#111111] transition-all hover:border-[#CCCCCC] hover:bg-[#F9F9F9] focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        aria-label={`Page ${page}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                        className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-semibold transition-all focus-visible:outline-none ${page === currentPage
                            ? 'bg-[#111111] text-white'
                            : 'text-[#666666] border border-transparent hover:border-[#EAEAEA] hover:bg-[#F9F9F9]'
                          }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-[#EAEAEA] text-[#111111] transition-all hover:border-[#CCCCCC] hover:bg-[#F9F9F9] focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default CategoriesPage

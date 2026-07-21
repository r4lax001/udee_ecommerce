import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getProducts, deleteProduct, createProduct, updateProduct } from '../services/products'
import ProductModal from '../components/admin/ProductModal'
import { formatPrice } from '../utils/format'

export default function AdminProductsPage({ reduceMotion = false, transition = { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      console.error('Failed to fetch products', err)
      alert('ไม่สามารถดึงข้อมูลสินค้าได้')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) {
      try {
        await deleteProduct(id)
        setProducts(prev => prev.filter(p => p.id !== id))
      } catch (err) {
        console.error('Failed to delete product', err)
        alert('ไม่สามารถลบสินค้าได้')
      }
    }
  }

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
      } else {
        await createProduct(productData)
      }
      await fetchProducts()
    } catch (err) {
      throw err
    }
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="max-w-7xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#9CA3AF]">
            search
          </span>
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 rounded-xl border border-[#E5E7EB] bg-white py-2 pl-9 pr-4 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20 transition"
          />
        </div>
        <button onClick={handleAddProduct} className="inline-flex items-center gap-1.5 rounded-xl bg-[#3D2B1F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d2318] shadow-sm">
          <span className="material-symbols-outlined text-[18px]">add</span>
          เพิ่มสินค้า
        </button>
      </div>

      <motion.div
        className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden"
        initial={reduceMotion ? false : { y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...transition, delay: 0.1 }}
      >
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-[#9CA3AF]">กำลังโหลดข้อมูล...</div>
          ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB]">
              <tr>
                {['สินค้า', 'หมวดหมู่', 'ราคา', 'สต็อก', 'สถานะ', 'จัดการ'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  className="hover:bg-[#FAFAFA] transition-colors"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...transition, delay: 0.15 + index * 0.04 }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={product.image || 'https://via.placeholder.com/40'} alt={product.name} className="h-10 w-10 rounded-lg object-cover border border-[#E5E7EB]" />
                      <div>
                        <p className="text-xs font-bold text-[#111827] line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#6B7280]">{product.category || '-'}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-[#111827]">{formatPrice(product.price)}</td>
                  <td className="px-5 py-3.5 text-xs text-[#6B7280]">{product.stock}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        product.stock > 10
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : product.stock > 0
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {product.stock > 10 ? 'มีสินค้า' : product.stock > 0 ? 'ใกล้หมด' : 'หมด'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleEditProduct(product)} className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#3D2B1F] transition">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-[#9CA3AF]">
                    ไม่พบสินค้าที่คุณค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </motion.div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  )
}

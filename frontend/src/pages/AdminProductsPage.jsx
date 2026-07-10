import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/product'
import { getCategories } from '../services/category'

export default function AdminProductsPage({ reduceMotion = false, transition = { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    stock: '',
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── Fetch Data ─────────────────────────────────────────────────────────────
  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      console.error(err)
      setError('ไม่สามารถดึงข้อมูลได้')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleOpenModal = (product = null) => {
    setEditingProduct(product)
    if (product) {
      setFormData({
        name: product.name,
        categoryId: product.categoryId,
        price: product.price,
        stock: product.stock,
      })
      setImagePreview(product.images?.[0] ? `http://localhost:5000${product.images[0].imageUrl}` : null)
      setSelectedImage(null)
    } else {
      setFormData({ name: '', categoryId: '', price: '', stock: '' })
      setImagePreview(null)
      setSelectedImage(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('categoryId', formData.categoryId)
      data.append('price', formData.price)
      data.append('stock', formData.stock)
      if (selectedImage) {
        data.append('image', selectedImage)
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, data)
      } else {
        await createProduct(data)
      }

      await fetchData()
      handleCloseModal()
    } catch (err) {
      console.error(err)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) {
      try {
        await deleteProduct(id)
        await fetchData()
      } catch (err) {
        console.error(err)
        alert('ลบข้อมูลไม่สำเร็จ')
      }
    }
  }

  // ── Render Helpers ─────────────────────────────────────────────────────────
  const getStatus = (stock) => {
    if (stock > 5) return { label: 'มีสินค้า', style: 'bg-green-50 text-green-700 border-green-200' }
    if (stock > 0) return { label: 'ใกล้หมด', style: 'bg-amber-50 text-amber-700 border-amber-200' }
    return { label: 'หมด', style: 'bg-red-50 text-red-700 border-red-200' }
  }

  if (loading) {
    return <div className="py-10 text-center text-[#6B7280]">กำลังโหลดข้อมูล...</div>
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>
  }

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
            className="w-64 rounded-xl border border-[#E5E7EB] bg-white py-2 pl-9 pr-4 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20 transition"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#3D2B1F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d2318] shadow-sm"
        >
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
        <div className="overflow-x-auto">
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
              {products.map((product, index) => {
                const status = getStatus(product.stock)
                const imageUrl = product.images?.[0] ? `http://localhost:5000${product.images[0].imageUrl}` : 'https://placehold.co/100x100?text=No+Image'

                return (
                  <motion.tr
                    key={product.id}
                    className="hover:bg-[#FAFAFA] transition-colors"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ ...transition, delay: 0.15 + index * 0.04 }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={imageUrl} alt={product.name} className="h-10 w-10 rounded-lg object-cover border border-[#E5E7EB]" />
                        <div>
                          <p className="text-xs font-bold text-[#111827]">{product.name}</p>
                          <p className="text-[10px] text-[#9CA3AF] mt-0.5">SKU: PRD-{String(product.id).padStart(4, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#6B7280]">{product.category?.name || 'ไม่ระบุ'}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-[#111827]">฿{Number(product.price).toLocaleString('th-TH')}</td>
                    <td className="px-5 py-3.5 text-xs text-[#6B7280]">{product.stock}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold border ${status.style}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#3D2B1F] transition"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-[#6B7280]">
                    ไม่พบข้อมูลสินค้า
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Modal Add / Edit Product ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
                <h3 className="text-lg font-bold text-[#111827]">
                  {editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}
                </h3>
                <button onClick={handleCloseModal} className="text-[#9CA3AF] hover:text-[#111827]">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-[#374151]">ชื่อสินค้า</label>
                    <input
                      required
                      type="text"
                      className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#A0724A] focus:ring-1 focus:ring-[#A0724A]"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-[#374151]">หมวดหมู่</label>
                    <select
                      required
                      className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#A0724A] focus:ring-1 focus:ring-[#A0724A]"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    >
                      <option value="">เลือกหมวดหมู่</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#374151]">ราคา (บาท)</label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#A0724A] focus:ring-1 focus:ring-[#A0724A]"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#374151]">สต็อก</label>
                    <input
                      required
                      type="number"
                      min="0"
                      className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#A0724A] focus:ring-1 focus:ring-[#A0724A]"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-[#374151]">รูปภาพสินค้า</label>
                    <div className="flex items-center gap-4">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-xl object-cover border border-[#E5E7EB]" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-[#D1D5DB] bg-[#F9FAFB]">
                          <span className="material-symbols-outlined text-[#9CA3AF]">image</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-sm text-[#6B7280] file:mr-4 file:rounded-full file:border-0 file:bg-[#F3F4F6] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#3D2B1F] hover:file:bg-[#E5E7EB]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-[#4B5563] transition hover:bg-[#F3F4F6]"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-[#3D2B1F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d2318] disabled:opacity-50"
                  >
                    {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

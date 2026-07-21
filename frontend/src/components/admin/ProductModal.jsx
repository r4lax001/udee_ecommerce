import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCategories } from '../../services/categories'

export default function ProductModal({ isOpen, onClose, onSave, product = null }) {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    price: '',
    stock: '',
    categoryId: '',
    badge: '',
    description: '',
    images: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      getCategories().then(setCategories).catch(console.error)
      if (product) {
        setFormData({
          name: product.name || '',
          subtitle: product.subtitle || '',
          price: product.price || '',
          stock: product.stock || '',
          categoryId: '',
          badge: product.badge || '',
          description: product.description || '',
          images: product.gallery?.join('\n') || product.image || ''
        })
      } else {
        setFormData({
          name: '',
          subtitle: '',
          price: '',
          stock: '',
          categoryId: '',
          badge: '',
          description: '',
          images: ''
        })
      }
    }
  }, [isOpen, product])

  useEffect(() => {
    if (product && categories.length > 0 && !formData.categoryId) {
      const cat = categories.find(c => c.name === product.category)
      if (cat) {
        setFormData(prev => ({ ...prev, categoryId: cat.id }))
      }
    }
  }, [categories, product])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const imageUrls = formData.images
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)
      .map(url => ({ imageUrl: url }))

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      categoryId: Number(formData.categoryId),
      images: imageUrls
    }

    try {
      await onSave(payload)
      onClose()
    } catch (err) {
      console.error(err)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          className="absolute inset-0 bg-[#1D1B1A]/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div 
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#3D2B1F]">
              {product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
            </h2>
            <button type="button" onClick={onClose} className="text-[#81756E] hover:text-[#3D2B1F]">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[#5a4e46] mb-1">ชื่อสินค้า *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#F8F3EB] px-4 py-2.5 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[#5a4e46] mb-1">คำบรรยายสั้น (Subtitle)</label>
                <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#F8F3EB] px-4 py-2.5 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20" />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[#5a4e46] mb-1">ราคา (บาท) *</label>
                <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#F8F3EB] px-4 py-2.5 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[#5a4e46] mb-1">จำนวนสต็อก *</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#F8F3EB] px-4 py-2.5 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20" />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[#5a4e46] mb-1">หมวดหมู่ *</label>
                <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#F8F3EB] px-4 py-2.5 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20">
                  <option value="">เลือกหมวดหมู่</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[#5a4e46] mb-1">ป้ายกำกับ (Badge)</label>
                <input type="text" name="badge" placeholder="เช่น NEW, HOT" value={formData.badge} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#F8F3EB] px-4 py-2.5 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5a4e46] mb-1">รายละเอียดสินค้า</label>
              <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#F8F3EB] px-4 py-3 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5a4e46] mb-1">ลิงก์รูปภาพ (บรรทัดละ 1 ลิงก์)</label>
              <textarea name="images" rows="3" placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" value={formData.images} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#F8F3EB] px-4 py-3 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20 font-mono"></textarea>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-[#E8E1DF]">
              <button type="button" onClick={onClose} className="rounded-xl px-6 py-2.5 text-sm font-semibold text-[#5a4e46] hover:bg-[#F8F3EB] transition">ยกเลิก</button>
              <button type="submit" disabled={loading} className="rounded-xl bg-[#3D2B1F] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#2A1F14] transition disabled:opacity-50 flex items-center gap-2">
                {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>}
                บันทึกข้อมูล
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

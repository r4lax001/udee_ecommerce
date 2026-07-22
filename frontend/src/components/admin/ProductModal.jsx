import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCategories } from '../../services/categories'
import { uploadImage } from '../../services/upload'

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
    images: '',
    specs: '',
    highlights: '',
    warranty: '',
    size: '',
    material: '',
    colors: ''
  })
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

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
          description: Array.isArray(product.description) ? product.description.join('\n') : (product.description || ''),
          images: product.gallery?.join('\n') || product.image || '',
          specs: product.generalProperties?.join('\n') || product.specs?.join('\n') || '',
          highlights: product.highlights?.map(h => h.text).join('\n') || '',
          warranty: product.warranty || '',
          size: product.size || '',
          material: product.material || '',
          colors: product.colors?.join(', ') || ''
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
          images: '',
          specs: '',
          highlights: '',
          warranty: '',
          size: '',
          material: '',
          colors: ''
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
  }, [categories, product, formData.categoryId])

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const result = await uploadImage(file)
      if (result?.url) {
        setFormData(prev => ({
          ...prev,
          images: prev.images ? `${prev.images.trim()}\n${result.url}` : result.url
        }))
      }
    } catch (err) {
      console.error('Upload failed:', err)
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (indexToRemove) => {
    const lines = formData.images.split('\n').map(l => l.trim()).filter(Boolean)
    const updated = lines.filter((_, idx) => idx !== indexToRemove).join('\n')
    setFormData(prev => ({ ...prev, [ 'images' ]: updated }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const imageUrls = formData.images
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)
      .map(url => ({ imageUrl: url }))

    const specsArray = formData.specs.split('\n').map(s => s.trim()).filter(s => s.length > 0)
    const highlightsArray = formData.highlights.split('\n').map(s => s.trim()).filter(s => s.length > 0).map(text => ({ icon: 'check_circle', text }))
    const colorsArray = formData.colors.split(',').map(c => c.trim()).filter(c => c.length > 0)

    const payload = {
      name: formData.name,
      subtitle: formData.subtitle,
      description: formData.description,
      badge: formData.badge,
      price: Number(formData.price),
      stock: Number(formData.stock),
      categoryId: Number(formData.categoryId),
      images: imageUrls,
      details: {
        generalProperties: specsArray,
        highlights: highlightsArray,
        warranty: formData.warranty,
        size: formData.size,
        material: formData.material,
        colors: colorsArray
      }
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

  const imageList = formData.images
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0)

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

          <form onSubmit={handleSubmit} className="space-y-8 mt-2">
            
            {/* ข้อมูลทั่วไป */}
            <section>
              <div className="flex items-center gap-2 border-b border-[#E8E1DF] pb-2 mb-4">
                <span className="material-symbols-outlined text-[#A0724A] text-[20px]">info</span>
                <h3 className="text-[15px] font-bold text-[#3D2B1F]">ข้อมูลทั่วไป</h3>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[#5a4e46] mb-1.5">ชื่อสินค้า <span className="text-red-500">*</span></label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#FAF8F5] px-4 py-2.5 text-sm outline-none focus:border-[#A0724A] focus:bg-white focus:ring-2 focus:ring-[#A0724A]/20 transition-all" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[#5a4e46] mb-1.5">คำบรรยายสั้น (Subtitle)</label>
                  <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#FAF8F5] px-4 py-2.5 text-sm outline-none focus:border-[#A0724A] focus:bg-white focus:ring-2 focus:ring-[#A0724A]/20 transition-all" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[#5a4e46] mb-1.5">หมวดหมู่ <span className="text-red-500">*</span></label>
                  <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#FAF8F5] px-4 py-2.5 text-sm outline-none focus:border-[#A0724A] focus:bg-white focus:ring-2 focus:ring-[#A0724A]/20 transition-all">
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[#5a4e46] mb-1.5">ป้ายกำกับ (Badge)</label>
                  <input type="text" name="badge" placeholder="เช่น NEW, HOT" value={formData.badge} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#FAF8F5] px-4 py-2.5 text-sm outline-none focus:border-[#A0724A] focus:bg-white focus:ring-2 focus:ring-[#A0724A]/20 transition-all" />
                </div>
              </div>
            </section>

            {/* ราคาและสต็อก */}
            <section>
              <div className="flex items-center gap-2 border-b border-[#E8E1DF] pb-2 mb-4">
                <span className="material-symbols-outlined text-[#A0724A] text-[20px]">payments</span>
                <h3 className="text-[15px] font-bold text-[#3D2B1F]">ราคาและคลังสินค้า</h3>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[#5a4e46] mb-1.5">ราคา (บาท) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">฿</span>
                    <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#FAF8F5] py-2.5 pl-8 pr-4 text-sm outline-none focus:border-[#A0724A] focus:bg-white focus:ring-2 focus:ring-[#A0724A]/20 transition-all" />
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[#5a4e46] mb-1.5">จำนวนสต็อก <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#9CA3AF]">inventory_2</span>
                    <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#FAF8F5] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#A0724A] focus:bg-white focus:ring-2 focus:ring-[#A0724A]/20 transition-all" />
                  </div>
                </div>
              </div>
            </section>

            {/* ข้อมูลจำเพาะ */}
            <section>
              <div className="flex items-center gap-2 border-b border-[#E8E1DF] pb-2 mb-4">
                <span className="material-symbols-outlined text-[#A0724A] text-[20px]">straighten</span>
                <h3 className="text-[15px] font-bold text-[#3D2B1F]">คุณสมบัติและขนาด</h3>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[#5a4e46] mb-1.5">ขนาดสินค้า (Size)</label>
                  <input type="text" name="size" placeholder="เช่น 120 x 60 ซม." value={formData.size} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#FAF8F5] px-4 py-2.5 text-sm outline-none focus:border-[#A0724A] focus:bg-white focus:ring-2 focus:ring-[#A0724A]/20 transition-all" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[#5a4e46] mb-1.5">วัสดุ (Material)</label>
                  <input type="text" name="material" placeholder="เช่น ไม้โอ๊ค" value={formData.material} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#FAF8F5] px-4 py-2.5 text-sm outline-none focus:border-[#A0724A] focus:bg-white focus:ring-2 focus:ring-[#A0724A]/20 transition-all" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#5a4e46] mb-1.5">สี (ระบุเป็นรหัสสี คั่นด้วยลูกน้ำ เช่น #F4EFE7, #000000)</label>
                  <input type="text" name="colors" placeholder="#FFFFFF, #000000" value={formData.colors} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#FAF8F5] px-4 py-2.5 text-sm outline-none focus:border-[#A0724A] focus:bg-white focus:ring-2 focus:ring-[#A0724A]/20 transition-all font-mono" />
                </div>
              </div>
            </section>

            {/* รายละเอียดสินค้า */}
            <section>
              <div className="flex items-center gap-2 border-b border-[#E8E1DF] pb-2 mb-4">
                <span className="material-symbols-outlined text-[#A0724A] text-[20px]">description</span>
                <h3 className="text-[15px] font-bold text-[#3D2B1F]">รายละเอียดเพิ่มเติม</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#5a4e46] mb-1.5">รายละเอียดสินค้า (Description)</label>
                  <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#FAF8F5] px-4 py-3 text-sm outline-none focus:border-[#A0724A] focus:bg-white focus:ring-2 focus:ring-[#A0724A]/20 transition-all"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-[#5a4e46] mb-1.5">จุดเด่น (Highlights) <span className="text-xs text-[#9CA3AF] font-normal">(บรรทัดละ 1 ข้อ)</span></label>
                    <textarea name="highlights" rows="3" placeholder="โครงสร้างแข็งแรง&#10;ดีไซน์ทันสมัย" value={formData.highlights} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#FAF8F5] px-4 py-3 text-sm outline-none focus:border-[#A0724A] focus:bg-white focus:ring-2 focus:ring-[#A0724A]/20 transition-all"></textarea>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-[#5a4e46] mb-1.5">ข้อมูลเชิงเทคนิค (Specs) <span className="text-xs text-[#9CA3AF] font-normal">(บรรทัดละ 1 ข้อ)</span></label>
                    <textarea name="specs" rows="3" placeholder="ทำจากไม้แท้&#10;ขนาด 120x60 ซม." value={formData.specs} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#FAF8F5] px-4 py-3 text-sm outline-none focus:border-[#A0724A] focus:bg-white focus:ring-2 focus:ring-[#A0724A]/20 transition-all"></textarea>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5a4e46] mb-1.5">เงื่อนไขการรับประกัน</label>
                  <input type="text" name="warranty" placeholder="เช่น รับประกัน 1 ปี..." value={formData.warranty} onChange={handleChange} className="w-full rounded-xl border border-[#D2C4BC] bg-[#FAF8F5] px-4 py-2.5 text-sm outline-none focus:border-[#A0724A] focus:bg-white focus:ring-2 focus:ring-[#A0724A]/20 transition-all" />
                </div>
              </div>
            </section>

            {/* รูปภาพสินค้า */}
            <section>
              <div className="flex items-center justify-between border-b border-[#E8E1DF] pb-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#A0724A] text-[20px]">image</span>
                  <h3 className="text-[15px] font-bold text-[#3D2B1F]">รูปภาพสินค้า</h3>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#D2C4BC] bg-[#FAF8F5] rounded-2xl hover:bg-[#F3EFE9] transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,.avif,.webp" className="hidden" />
                  <span className="material-symbols-outlined text-4xl text-[#A0724A] mb-2">add_photo_alternate</span>
                  <p className="text-sm font-semibold text-[#3D2B1F]">
                    {uploadingImage ? 'กำลังอัปโหลด...' : 'คลิกเพื่อเลือกไฟล์รูปภาพ'}
                  </p>
                  <p className="text-xs text-[#81756E] mt-1">รองรับ JPG, PNG, WEBP, AVIF (ขนาดไม่เกิน 10MB)</p>
                </div>

                <div className="mt-2">
                  <label className="block text-xs font-medium text-[#81756E] mb-1">หรือระบุ URL รูปภาพ (บรรทัดละ 1 ลิงก์)</label>
                  <textarea 
                    name="images" 
                    rows="2" 
                    placeholder="https://example.com/image.jpg" 
                    value={formData.images} 
                    onChange={handleChange} 
                    className="w-full rounded-xl border border-[#D2C4BC] bg-[#FAF8F5] px-4 py-2 text-xs outline-none focus:border-[#A0724A] focus:bg-white focus:ring-2 focus:ring-[#A0724A]/20 font-mono transition-all"
                  />
                </div>

                {imageList.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-medium text-[#81756E] mb-3">รูปภาพที่เลือก ({imageList.length} รูป):</p>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                      {imageList.map((url, idx) => (
                        <div key={idx} className="relative group rounded-xl border border-[#E5E7EB] bg-white overflow-hidden p-1 shadow-sm hover:shadow-md transition-shadow">
                          <img 
                            src={url} 
                            alt={`Preview ${idx + 1}`} 
                            className="h-20 w-full object-cover rounded-lg"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image' }}
                          />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/90 text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            title="ลบรูปนี้"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                          <span className="absolute bottom-2 left-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                            {idx === 0 ? 'รูปหลัก' : `รูปที่ ${idx + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <div className="sticky bottom-0 -mx-8 -mb-8 mt-8 flex justify-end gap-3 bg-white/90 backdrop-blur-md px-8 py-4 border-t border-[#E8E1DF] rounded-b-3xl">
              <button type="button" onClick={onClose} className="rounded-xl px-6 py-2.5 text-sm font-semibold text-[#5a4e46] hover:bg-[#F3EFE9] transition">ยกเลิก</button>
              <button type="submit" disabled={loading || uploadingImage} className="rounded-xl bg-[#3D2B1F] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#2A1F14] transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2">
                {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>}
                บันทึกข้อมูลสินค้า
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

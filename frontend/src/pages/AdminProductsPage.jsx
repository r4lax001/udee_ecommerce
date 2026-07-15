import { motion } from 'framer-motion'
import { adminProductsPageData } from '../data/adminProductsPageData'

export default function AdminProductsPage({ reduceMotion = false, transition = { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }) {
  const products = adminProductsPageData

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
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-[#3D2B1F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d2318] shadow-sm">
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
              {products.map((product, index) => (
                <motion.tr
                  key={product.id}
                  className="hover:bg-[#FAFAFA] transition-colors"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...transition, delay: 0.15 + index * 0.04 }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover border border-[#E5E7EB]" />
                      <div>
                        <p className="text-xs font-bold text-[#111827]">{product.name}</p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#6B7280]">{product.category}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-[#111827]">{product.price}</td>
                  <td className="px-5 py-3.5 text-xs text-[#6B7280]">{product.stock}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        product.status === 'In Stock'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : product.status === 'Low Stock'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {product.status === 'In Stock' ? 'มีสินค้า' : product.status === 'Low Stock' ? 'ใกล้หมด' : 'หมด'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#3D2B1F] transition">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

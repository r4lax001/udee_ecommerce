import { motion } from 'framer-motion'
import { adminOrdersPageData } from '../data/adminOrdersPageData'

export default function AdminOrdersPage({ reduceMotion = false, transition = { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }) {
  const orders = adminOrdersPageData

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-50 text-green-700 border border-green-200'
      case 'Processing': return 'bg-blue-50 text-blue-700 border border-blue-200'
      case 'Pending': return 'bg-amber-50 text-amber-700 border border-amber-200'
      case 'Shipped': return 'bg-purple-50 text-purple-700 border border-purple-200'
      case 'Cancelled': return 'bg-red-50 text-red-700 border border-red-200'
      default: return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'Completed': return 'สำเร็จ'
      case 'Processing': return 'กำลังดำเนินการ'
      case 'Pending': return 'รอชำระเงิน'
      case 'Shipped': return 'จัดส่งแล้ว'
      case 'Cancelled': return 'ยกเลิก'
      default: return status
    }
  }

  return (
    <div className="max-w-7xl space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#9CA3AF]">
            search
          </span>
          <input
            type="text"
            placeholder="ค้นหาออเดอร์..."
            className="w-64 rounded-xl border border-[#E5E7EB] bg-white py-2 pl-9 pr-4 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20 transition"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-medium text-[#111827] transition hover:bg-[#F9FAFB] shadow-sm">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            ตัวกรอง
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-[#3D2B1F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d2318] shadow-sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            ส่งออก
          </button>
        </div>
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
                {['Order ID', 'ลูกค้า', 'วันที่', 'จำนวน', 'ยอดรวม', 'สถานะ', 'จัดการ'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  className="hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...transition, delay: 0.15 + index * 0.04 }}
                >
                  <td className="px-5 py-3.5 font-bold text-[#3D2B1F]">{order.id}</td>
                  <td className="px-5 py-3.5 text-xs text-[#374151]">{order.customer}</td>
                  <td className="px-5 py-3.5 text-xs text-[#9CA3AF]">{order.date}</td>
                  <td className="px-5 py-3.5 text-xs text-[#6B7280]">{order.items} ชิ้น</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-[#111827]">{order.total}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#3D2B1F] transition">
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                      </button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#3D2B1F] transition">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
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

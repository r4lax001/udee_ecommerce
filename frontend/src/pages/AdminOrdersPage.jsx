import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getOrders, getOrderById, updateOrderStatus } from '../services/order'

export default function AdminOrdersPage({ reduceMotion = false, transition = { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await getOrders()
      setOrders(data)
    } catch (err) {
      console.error(err)
      setError('ไม่สามารถดึงข้อมูลออเดอร์ได้')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleOpenModal = async (orderId) => {
    try {
      setIsModalOpen(true)
      const orderData = await getOrderById(orderId)
      setSelectedOrder(orderData)
    } catch (err) {
      console.error(err)
      alert('ไม่สามารถดึงข้อมูลรายละเอียดออเดอร์ได้')
      setIsModalOpen(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return
    setIsUpdating(true)
    try {
      await updateOrderStatus(selectedOrder.id, newStatus)
      // Update local state for modal
      setSelectedOrder({ ...selectedOrder, status: newStatus })
      // Refresh list
      await fetchOrders()
    } catch (err) {
      console.error(err)
      alert('อัปเดตสถานะไม่สำเร็จ')
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-50 text-green-700 border border-green-200'
      case 'CONFIRMED': return 'bg-blue-50 text-blue-700 border border-blue-200'
      case 'PENDING': return 'bg-amber-50 text-amber-700 border border-amber-200'
      case 'SHIPPED': return 'bg-purple-50 text-purple-700 border border-purple-200'
      case 'CANCELLED': return 'bg-red-50 text-red-700 border border-red-200'
      default: return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'DELIVERED': return 'สำเร็จ'
      case 'CONFIRMED': return 'กำลังดำเนินการ'
      case 'PENDING': return 'รอชำระเงิน'
      case 'SHIPPED': return 'จัดส่งแล้ว'
      case 'CANCELLED': return 'ยกเลิก'
      default: return status
    }
  }

  if (loading && orders.length === 0) {
    return <div className="py-10 text-center text-[#6B7280]">กำลังโหลดข้อมูล...</div>
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>
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
                  onClick={() => handleOpenModal(order.id)}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...transition, delay: 0.15 + index * 0.04 }}
                >
                  <td className="px-5 py-3.5 font-bold text-[#3D2B1F]">
                    ORD-{String(order.id).padStart(3, '0')}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#374151]">{order.user?.name || 'ไม่ระบุ'}</td>
                  <td className="px-5 py-3.5 text-xs text-[#9CA3AF]">
                    {new Date(order.createdAt).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#6B7280]">{order._count?.items || 0} ชิ้น</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-[#111827]">
                    ฿{Number(order.total).toLocaleString('th-TH')}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(order.id); }}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#3D2B1F] transition"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-[#6B7280]">
                    ไม่มีข้อมูลคำสั่งซื้อ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Modal Order Details ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4 shrink-0">
                <h3 className="text-lg font-bold text-[#111827]">
                  รายละเอียดคำสั่งซื้อ
                </h3>
                <button onClick={handleCloseModal} className="text-[#9CA3AF] hover:text-[#111827]">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {selectedOrder ? (
                <div className="p-6 overflow-y-auto">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                    <div>
                      <p className="text-sm text-[#6B7280]">หมายเลขคำสั่งซื้อ</p>
                      <p className="text-lg font-bold text-[#111827]">ORD-{String(selectedOrder.id).padStart(3, '0')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6B7280]">ลูกค้า</p>
                      <p className="text-base font-semibold text-[#374151]">{selectedOrder.user?.name}</p>
                      <p className="text-xs text-[#9CA3AF]">{selectedOrder.user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6B7280]">วันที่สั่งซื้อ</p>
                      <p className="text-base font-semibold text-[#374151]">
                        {new Date(selectedOrder.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-[#111827] mb-3">รายการสินค้า</p>
                    <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-[#F9FAFB]">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-[#6B7280]">สินค้า</th>
                            <th className="px-4 py-2 text-center text-xs font-semibold text-[#6B7280]">จำนวน</th>
                            <th className="px-4 py-2 text-right text-xs font-semibold text-[#6B7280]">ราคา/ชิ้น</th>
                            <th className="px-4 py-2 text-right text-xs font-semibold text-[#6B7280]">รวม</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                          {selectedOrder.items?.map(item => (
                            <tr key={item.id}>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  {item.product.images?.[0] && (
                                    <img src={`http://localhost:5000${item.product.images[0].imageUrl}`} alt="" className="w-10 h-10 rounded-lg object-cover border border-[#E5E7EB]" />
                                  )}
                                  <span className="font-semibold text-[#374151]">{item.product.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center text-[#6B7280]">{item.quantity}</td>
                              <td className="px-4 py-3 text-right text-[#6B7280]">฿{Number(item.price).toLocaleString('th-TH')}</td>
                              <td className="px-4 py-3 text-right font-semibold text-[#111827]">
                                ฿{(Number(item.price) * item.quantity).toLocaleString('th-TH')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-[#F9FAFB]">
                          <tr>
                            <td colSpan="3" className="px-4 py-3 text-right font-bold text-[#374151]">ยอดรวมทั้งสิ้น</td>
                            <td className="px-4 py-3 text-right font-bold text-[#A0724A] text-base">
                              ฿{Number(selectedOrder.total).toLocaleString('th-TH')}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB]">
                    <p className="text-sm font-semibold text-[#111827] mb-3">ปรับเปลี่ยนสถานะ</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'PENDING', label: 'รอชำระเงิน', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
                        { value: 'CONFIRMED', label: 'กำลังดำเนินการ', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
                        { value: 'SHIPPED', label: 'จัดส่งแล้ว', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
                        { value: 'DELIVERED', label: 'สำเร็จ', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
                        { value: 'CANCELLED', label: 'ยกเลิก', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
                      ].map(status => (
                        <button
                          key={status.value}
                          onClick={() => handleStatusChange(status.value)}
                          disabled={isUpdating || selectedOrder.status === status.value}
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
                            selectedOrder.status === status.value
                              ? 'ring-2 ring-offset-1 ring-[#111827] shadow-sm ' + status.color
                              : status.color
                          }`}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-10 text-center text-[#6B7280]">กำลังโหลดรายละเอียด...</div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

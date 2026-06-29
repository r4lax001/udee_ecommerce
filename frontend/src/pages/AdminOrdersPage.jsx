import { useState } from 'react'
import { adminOrdersPageData } from '../data/adminOrdersPageData'

const defaultOrders = adminOrdersPageData

const statusStyles = {
  'secondary-fixed': 'bg-[#FFDAC1] text-[#2E1500] border-[#FFDCC1]',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  green: 'bg-green-100 text-green-800 border-green-200',
}

const AdminOrdersPage = ({ orders = defaultOrders }) => {
  const [selectedOrder, setSelectedOrder] = useState(orders[0])
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#1D1B1A]">
      <div className="flex min-h-screen overflow-hidden">
        <aside className="hidden md:flex w-64 flex-col border-r border-[#D2C4BC] bg-[#F3ECEA] p-6">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#3D2B1F]">UDEE</h1>
            <p className="text-sm text-[#5a4e46]">Admin Panel</p>
          </div>
          <nav className="space-y-3">
            <a className="block rounded-2xl px-4 py-3 text-[#5a4e46] hover:bg-white" href="#">
              Dashboard
            </a>
            <a className="block rounded-2xl px-4 py-3 text-[#5a4e46] hover:bg-white" href="#">
              Products
            </a>
            <a className="block rounded-2xl bg-[#FFC698] px-4 py-3 font-semibold text-[#7F5530]" href="#">
              Orders
            </a>
            <a className="block rounded-2xl px-4 py-3 text-[#5a4e46] hover:bg-white" href="#">
              Customers
            </a>
          </nav>
        </aside>
        <div className="flex-1 bg-[#FAF6F1] p-6 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-semibold text-[#3D2B1F]">การจัดการคำสั่งซื้อ</h2>
              <p className="text-sm text-[#81756e]">ตรวจสอบและจัดการออเดอร์ของลูกค้า</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-2xl bg-[#3D2B1F] px-6 py-3 text-white hover:opacity-90 transition">
                Export
              </button>
              <button className="rounded-2xl border border-[#D2C4BC] px-6 py-3 text-[#3D2B1F] hover:bg-white transition">
                Filter
              </button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead className="bg-[#F3ECEA] border-b border-[#D2C4BC]">
                  <tr>
                    <th className="px-6 py-4"></th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5a4e46]">ID ออเดอร์</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5a4e46]">วันที่</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5a4e46]">ลูกค้า</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5a4e46]">สินค้า</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5a4e46] text-right">ยอดรวม</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5a4e46]">สถานะ</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E1DF]">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#F9F2F0] transition-colors">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-[#D2C4BC] text-[#3D2B1F] focus:ring-[#A0724A]" />
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#3D2B1F]">{order.id}</td>
                      <td className="px-6 py-4 text-[#81756e]">{order.date}</td>
                      <td className="px-6 py-4 text-[#3D2B1F]">{order.customer}</td>
                      <td className="px-6 py-4 text-[#81756e]">{order.items}</td>
                      <td className="px-6 py-4 text-right font-semibold text-[#A0724A]">{order.total}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[order.statusLabel]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order)
                            setModalOpen(true)
                          }}
                          className="rounded-full px-3 py-2 text-[#5a4e46] hover:bg-[#F3ECEA]"
                        >
                          view
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 p-4">
          <div className="h-full w-full max-w-[600px] overflow-y-auto rounded-l-[2rem] bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-[#3D2B1F]">รายละเอียดออเดอร์ {selectedOrder.id}</h3>
                <p className="text-sm text-[#81756e]">สั่งซื้อเมื่อ: {selectedOrder.date}</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="material-symbols-outlined text-[#81756e] hover:text-[#3D2B1F]">
                close
              </button>
            </div>
            <div className="mt-8 space-y-8">
              <div className="rounded-3xl bg-[#FAF6F1] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#81756e]">สถานะปัจจุบัน</p>
                    <p className="mt-2 font-semibold text-[#3D2B1F]">{selectedOrder.status}</p>
                  </div>
                  <div className="rounded-2xl bg-[#FFF4D5] px-4 py-2 text-sm font-semibold text-[#7F5530]">{selectedOrder.status}</div>
                </div>
              </div>
              <div className="rounded-3xl bg-[#FAF6F1] p-6">
                <h4 className="font-semibold text-[#3D2B1F] mb-4">ข้อมูลลูกค้าและที่อยู่จัดส่ง</h4>
                <div className="grid gap-4 text-sm text-[#5a4e46]">
                  <p>ลูกค้า: {selectedOrder.customer}</p>
                  <p>อีเมล: example@email.com</p>
                  <p>เบอร์โทร: 081-234-5678</p>
                  <p>ที่อยู่: 123/45 หมู่บ้านพรีเมียม ซอยสุขุมวิท 21 เขตวัฒนา กรุงเทพฯ 10110</p>
                </div>
              </div>
              <div className="rounded-3xl bg-[#FAF6F1] p-6">
                <h4 className="font-semibold text-[#3D2B1F] mb-4">รายการสินค้า</h4>
                <div className="rounded-3xl bg-white p-4 shadow-sm border border-[#E8E1DF]">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-[#F3ECEA]" />
                    <div>
                      <p className="font-semibold text-[#3D2B1F]">{selectedOrder.items}</p>
                      <p className="text-xs text-[#81756e]">1 x {selectedOrder.total}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-[#FAF6F1] p-6">
                <h4 className="font-semibold text-[#3D2B1F] mb-4">ประวัติคำสั่งซื้อ</h4>
                <div className="space-y-4">
                  {selectedOrder.statusHistory?.map((event) => (
                    <div key={event.label} className="border-l-2 border-[#A0724A] pl-4 text-sm text-[#5a4e46]">
                      <p className="font-semibold text-[#3D2B1F]">{event.label}</p>
                      <p>{event.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminOrdersPage

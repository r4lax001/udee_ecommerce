import { useState } from 'react'
import { adminProductsPageData } from '../data/adminProductsPageData'

const defaultProducts = adminProductsPageData

const AdminProductsPage = ({ products = defaultProducts }) => {
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
            <a className="block rounded-2xl bg-[#FFC698] px-4 py-3 font-semibold text-[#291801]" href="#">
              Products
            </a>
            <a className="block rounded-2xl px-4 py-3 text-[#5a4e46] hover:bg-white" href="#">
              Orders
            </a>
            <a className="block rounded-2xl px-4 py-3 text-[#5a4e46] hover:bg-white" href="#">
              Inventory
            </a>
            <a className="block rounded-2xl px-4 py-3 text-[#5a4e46] hover:bg-white" href="#">
              Settings
            </a>
          </nav>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-auto rounded-2xl bg-[#3D2B1F] px-4 py-3 text-white hover:opacity-90 transition"
          >
            เพิ่มสินค้า
          </button>
        </aside>
        <div className="flex-1 bg-[#FAF6F1] p-6 md:p-10">
          <div className="flex items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-semibold text-[#3D2B1F]">จัดการสินค้า</h2>
              <p className="text-sm text-[#81756e]">ดูแลสินค้าในสต็อกและสถานะการขาย</p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-2xl bg-[#3D2B1F] px-6 py-3 text-white hover:opacity-90 transition"
            >
              เพิ่มสินค้าใหม่
            </button>
          </div>
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead className="bg-[#F3ECEA] border-b border-[#D2C4BC]">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5a4e46]">สินค้า</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5a4e46]">หมวดหมู่</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5a4e46]">ราคา</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5a4e46] text-center">สต็อก</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5a4e46] text-center">สถานะ</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#5a4e46] text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E1DF]">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-[#F9F2F0] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 overflow-hidden rounded-2xl bg-[#F3ECEA]">
                            <img className="h-full w-full object-cover" src={product.image} alt={product.name} />
                          </div>
                          <div>
                            <div className="font-semibold text-[#3D2B1F]">{product.name}</div>
                            <div className="text-xs text-[#81756e]">ID: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#5a4e46]">{product.category}</td>
                      <td className="px-6 py-4 font-semibold text-[#A0724A]">{product.price}</td>
                      <td className="px-6 py-4 text-center text-[#3D2B1F]">{product.stock}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${product.active ? 'bg-[#FFC698] text-[#7F5530]' : 'bg-[#F3ECEA] text-[#81756e]'}`}>
                          {product.active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-[#5a4e46]">
                        <button className="p-2 hover:text-[#3D2B1F]">edit</button>
                        <button className="p-2 hover:text-[#A0724A]">delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-6 py-4 bg-[#FAF6F1] text-sm text-[#81756e]">
              <div>แสดง {products.length} รายการ</div>
              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-[#D2C4BC] px-3 py-2 hover:bg-white">Prev</button>
                <button className="rounded-lg border border-[#D2C4BC] px-3 py-2 hover:bg-white">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-4xl rounded-[1.5rem] bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-[#3D2B1F]">เพิ่มสินค้าใหม่</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="material-symbols-outlined text-[#81756e] hover:text-[#3D2B1F]">
                close
              </button>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-[#81756e]">
                ชื่อสินค้า
                <input className="rounded-2xl border border-[#D2C4BC] bg-[#F9F2F0] px-4 py-3 outline-none" />
              </label>
              <label className="flex flex-col gap-2 text-sm text-[#81756e]">
                หมวดหมู่
                <select className="rounded-2xl border border-[#D2C4BC] bg-[#F9F2F0] px-4 py-3 outline-none">
                  <option>เลือกหมวดหมู่</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm text-[#81756e]">
                ราคา
                <input className="rounded-2xl border border-[#D2C4BC] bg-[#F9F2F0] px-4 py-3 outline-none" type="number" />
              </label>
              <label className="flex flex-col gap-2 text-sm text-[#81756e]">
                สต็อก
                <input className="rounded-2xl border border-[#D2C4BC] bg-[#F9F2F0] px-4 py-3 outline-none" type="number" />
              </label>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-2xl border border-[#D2C4BC] px-6 py-3 hover:bg-[#F3ECEA]">
                ยกเลิก
              </button>
              <button type="button" className="rounded-2xl bg-[#3D2B1F] px-6 py-3 text-white hover:opacity-90">
                บันทึกสินค้า
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminProductsPage

import { tablesPageData } from '../data/tablesPageData'

const defaultProducts = tablesPageData

const TablesPage = ({ products = defaultProducts }) => {
  return (
    <main className="min-h-screen bg-[#F8F3EE] text-[#1D1B1A]">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-8 rounded-[2rem] bg-white p-8 shadow-[0_2px_25px_rgba(61,43,31,0.08)]">
            <div>
              <h2 className="text-3xl font-semibold text-[#3D2B1F]">ตารางและโต๊ะ</h2>
              <p className="mt-3 text-sm text-[#5a4e46]">เลือกโต๊ะที่เหมาะกับทุกมุมบ้าน</p>
            </div>
            <div className="space-y-4">
              <button className="w-full rounded-2xl bg-[#3D2B1F] px-5 py-4 text-left text-white">ทั้งหมด</button>
              {['โต๊ะกลาง', 'โต๊ะทานอาหาร', 'โต๊ะทำงาน', 'โต๊ะข้างโซฟา'].map((category) => (
                <button key={category} className="w-full rounded-2xl border border-[#D2C4BC] px-5 py-4 text-left text-[#5a4e46] hover:bg-[#F3ECEA]">
                  {category}
                </button>
              ))}
            </div>
            <div className="rounded-3xl border border-[#E8E1DF] bg-[#FEF4EA] p-6 text-sm text-[#5a4e46]">
              <h3 className="font-semibold text-[#3D2B1F] mb-3">จัดส่งฟรี</h3>
              <p>บริการส่งฟรีสำหรับคำสั่งซื้อเกิน 5,000 บาท พร้อมติดตั้งหน้างาน</p>
            </div>
          </aside>
          <div className="space-y-8">
            <div className="rounded-[2rem] bg-[#FEF4EA] p-8 shadow-[0_2px_25px_rgba(61,43,31,0.08)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-[#5a4e46]">ตารางและโต๊ะ</p>
                  <h1 className="text-4xl font-semibold text-[#3D2B1F]">ค้นหาโต๊ะที่ใช่สำหรับบ้านคุณ</h1>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button className="rounded-2xl bg-white px-6 py-3 text-[#3D2B1F] shadow-sm">กรอง</button>
                  <button className="rounded-2xl border border-[#D2C4BC] bg-[#F8F3EE] px-6 py-3 text-[#3D2B1F]">เรียงตามราคา</button>
                </div>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {products.map((product) => (
                <article key={product.name} className="overflow-hidden rounded-[2rem] bg-white shadow-[0_2px_25px_rgba(61,43,31,0.08)]">
                  <img className="h-64 w-full object-cover" src={product.image} alt={product.name} />
                  <div className="p-6">
                    <p className="text-sm uppercase tracking-[0.2em] text-[#A0724A]">{product.category}</p>
                    <h2 className="mt-3 text-2xl font-semibold text-[#3D2B1F]">{product.name}</h2>
                    <p className="mt-4 text-sm leading-7 text-[#5a4e46]">{product.description}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#3D2B1F]">{product.price}</span>
                      <button className="rounded-2xl bg-[#3D2B1F] px-6 py-3 text-white hover:opacity-90 transition">
                        ดูรายละเอียด
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default TablesPage

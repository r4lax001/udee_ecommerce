import { adminDashboardPageData } from '../data/adminDashboardPageData'

const defaultMetrics = adminDashboardPageData.metrics
const defaultHighlights = adminDashboardPageData.highlights
const adminNotifications = adminDashboardPageData.notifications
const defaultOrders = adminDashboardPageData.recentOrders

const AdminDashboardPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff8f2] via-[#faf6f1] to-[#fffdfc] text-[#1D1B1A]">
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full bg-[#F1D2A1]/70 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute left-0 bottom-0 h-64 w-64 rounded-full bg-[#EAD7C0]/60 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 py-16">
          <header className="mb-10 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full bg-[#F3ECEA] px-4 py-2 text-sm uppercase tracking-[0.28em] text-[#A0724A] shadow-sm">
                <span className="block h-2 w-2 rounded-full bg-[#A0724A]" />
                Admin Dashboard
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-[#3D2B1F] sm:text-5xl">
                  ภาพรวมธุรกิจ UDEE ที่พร้อมตัดสินใจได้ทันที
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[#5a4e46] sm:text-lg">
                  ดูการเติบโตของยอดขาย สต็อกสินค้า และคำสั่งซื้อใหม่ได้ในหน้าเดียว พร้อมข้อมูลที่จัดวางอย่างเป็นระบบสำหรับทีมดูแลร้านค้า.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button type="button" className="inline-flex items-center gap-2 rounded-3xl bg-[#3D2B1F] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#3d2b1f]/10 transition hover:-translate-y-0.5 hover:bg-[#2d2318] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A0724A]">
                  <span className="material-symbols-outlined" aria-hidden="true">download</span>
                  Export Report
                </button>
                <button type="button" className="rounded-3xl border border-[#E8E1DF] bg-white px-6 py-3 text-sm font-semibold text-[#3D2B1F] transition hover:bg-[#F3ECEA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A0724A]">
                  ดูสถิติเดือนนี้
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/95 p-8 shadow-[0_30px_90px_-55px_rgba(61,43,31,0.25)] backdrop-blur-sm animate-fade-in">
              <p className="text-sm uppercase tracking-[0.28em] text-[#A0724A]">Market Pulse</p>
              <h2 className="mt-4 text-3xl font-semibold text-[#3D2B1F]">ยอดขายโตขึ้น 16% ในสัปดาห์ล่าสุด</h2>
              <p className="mt-4 text-sm leading-7 text-[#5a4e46]">
                สถานะสินค้าพร้อมขายดีต่อเนื่อง และดูแล Logistics ได้ง่ายผ่านรายงานคุณภาพสูงที่อัปเดตทันที.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-[#FAF6F1] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#8f7b69]">อัตราการแปลง</p>
                  <p className="mt-4 text-2xl font-semibold text-[#3D2B1F]">4.8%</p>
                </div>
                <div className="rounded-3xl bg-[#FDF6F1] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#8f7b69]">ของขวัญขายดี</p>
                  <p className="mt-4 text-2xl font-semibold text-[#3D2B1F]">เก้าอี้สุขุม</p>
                </div>
              </div>
            </div>
          </header>

          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {defaultMetrics.map((metric) => (
              <article key={metric.label} className="card-base p-6 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(61,43,31,0.2)] animate-fade-in">
                <p className="text-sm text-[#81756e]">{metric.label}</p>
                <p className="mt-4 text-3xl font-semibold text-[#3D2B1F]">{metric.value}</p>
                <p className="mt-2 text-sm text-[#3D2B1F]">{metric.change}</p>
              </article>
            ))}
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="card-base p-8 lg:col-span-2 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">ภาพรวมยอดขาย</h2>
                  <p className="mt-2 text-sm text-[#81756e]">เปรียบเทียบกับเดือนก่อนเพื่อมองเห็นจุดพัฒนาที่สำคัญ</p>
                </div>
                <span className="badge-soft">เดือนนี้</span>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {defaultHighlights.map((item) => (
                  <div key={item.title} className="rounded-3xl bg-[#FAF6F1] p-6 transition duration-300 hover:bg-[#f7efe7]">
                    <p className="text-sm text-[#81756e]">{item.title}</p>
                    <p className="mt-3 text-xl font-semibold text-[#3D2B1F]">{item.value}</p>
                    <p className="mt-2 text-sm text-[#A0724A]">{item.badge}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="card-base p-8 animate-fade-in">
              <h2 className="text-2xl font-semibold text-[#3D2B1F]">การแจ้งเตือน</h2>
              <div className="mt-6 space-y-4">
                {adminNotifications.map((notification) => (
                  <div key={notification.title} className="rounded-3xl border border-[#E8E1DF] bg-[#FEF4EA] p-5 transition duration-300 hover:border-[#D5C6B3] hover:shadow-sm">
                    <p className="font-semibold text-[#3D2B1F]">{notification.title}</p>
                    <p className="mt-2 text-sm text-[#5a4e46]">{notification.description}</p>
                    <p className="mt-3 text-xs text-[#81756e]">{notification.time}</p>
                  </div>
                ))}
              </div>
            </aside>
          </section>

          <section className="mt-10 grid gap-6 xl:grid-cols-3">
            <div className="rounded-[2rem] bg-[#3D2B1F] p-8 text-white shadow-[0_2px_15px_rgba(61,43,31,0.12)] animate-fade-in">
              <p className="text-sm uppercase tracking-[0.24em] text-[#F4E7D9]">ความคืบหน้า</p>
              <h3 className="mt-4 text-3xl font-semibold">Campaign สินค้ารอบใหม่</h3>
              <p className="mt-4 text-sm leading-7 text-[#E7D7C9]">เตรียมเปิดตัวคอลเลคชันโต๊ะและเก้าอี้ใหม่ในเดือนหน้า พร้อมโฆษณาผ่านช่องทางออนไลน์</p>
              <div className="mt-6 flex flex-wrap gap-2 text-sm text-[#E7D7C9]">
                <span className="rounded-full bg-[#A0724A]/20 px-3 py-2">Live</span>
                <span className="rounded-full bg-[#A0724A]/20 px-3 py-2">Ready</span>
              </div>
            </div>
            <div className="card-base p-8 animate-fade-in">
              <h2 className="text-2xl font-semibold text-[#3D2B1F]">คำสั่งซื้อใหม่</h2>
              <div className="mt-6 space-y-4">
                {defaultOrders.map((order) => (
                  <div key={order.id} className="rounded-3xl border border-[#E8E1DF] p-5 transition duration-300 hover:border-[#C9B49C] hover:bg-[#FAF6F1]">
                    <p className="font-semibold text-[#3D2B1F]">{order.id}</p>
                    <p className="text-sm text-[#81756e] mt-1">{order.customer}</p>
                    <p className="mt-2 text-sm text-[#A0724A]">{order.status}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-base p-8 animate-fade-in">
              <h2 className="text-2xl font-semibold text-[#3D2B1F]">Top Categories</h2>
              <div className="mt-6 space-y-4 text-sm text-[#5a4e46]">
                <p>โต๊ะทานอาหาร • จำนวนสั่งซื้อ 82</p>
                <p>เก้าอี้นั่งเล่น • จำนวนสั่งซื้อ 61</p>
                <p>เสาโคมไฟ • จำนวนสั่งซื้อ 38</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default AdminDashboardPage

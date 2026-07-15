import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Customers, Analytics } from './admin/AdminPages'
import Settings from './admin/AdminSettings'
import AdminProductsPage from './AdminProductsPage'
import AdminOrdersPage from './AdminOrdersPage'

// ─── Scoped CSS สำหรับ sub-page components (AdminPages + AdminSettings) ──────
const ADMIN_SUB_STYLES = `
.udee-wrap-root * { box-sizing: border-box; }
.udee-wrap-root {
  font-family: 'Kanit', 'Prompt', 'Inter', 'Mitr', sans-serif;
  --pr: #3D2B1F; --ac: #A0724A; --acl: #C8A882;
  --bg: #F9FAFB; --sf: #fff; --sa: #F3F0EC;
  --tx: #2A1F14; --tm: #7A6355; --bd: #E5E1DC;
  --ok: #4A7C59; --er: #B94040; --wa: #C17B2A;
}
/* KPI Cards */
.kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
.kpi-card { background:var(--sf); border:1px solid var(--bd); border-radius:14px; padding:18px; position:relative; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,.06); }
.kpi-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; border-radius:14px 14px 0 0; }
.kpi-card.revenue::before { background:var(--ac); }
.kpi-card.orders::before  { background:#4A7C59; }
.kpi-card.customers::before { background:#2C6FAC; }
.kpi-card.stock::before   { background:var(--wa); }
.kpi-label { font-size:12px; color:var(--tm); margin-bottom:6px; }
.kpi-value { font-size:24px; font-weight:700; color:var(--tx); margin-bottom:4px; }
.kpi-badge { display:inline-flex; align-items:center; gap:4px; font-size:11px; padding:2px 8px; border-radius:20px; }
.kpi-badge.up   { background:#EAF3DE; color:#3B6D11; }
.kpi-badge.down { background:#FCEBEB; color:#A32D2D; }
.kpi-icon { position:absolute; right:14px; top:14px; width:36px; height:36px; border-radius:10px; background:var(--sa); display:flex; align-items:center; justify-content:center; color:var(--ac); }

/* Grid layouts */
.row2  { display:grid; grid-template-columns:1fr 340px; gap:14px; margin-bottom:20px; }
.card  { background:var(--sf); border:1px solid var(--bd); border-radius:14px; padding:18px; box-shadow:0 1px 4px rgba(0,0,0,.06); }
.card-head  { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.card-title { font-size:14px; font-weight:600; color:var(--tx); }
.card-sub   { font-size:12px; color:var(--tm); margin-top:2px; }
.view-all   { font-size:12px; color:var(--ac); cursor:pointer; text-decoration:none; }

/* Chart */
.chart-area { height:160px; display:flex; align-items:flex-end; gap:6px; padding-bottom:8px; border-bottom:1px solid var(--bd); }
.bar-wrap { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; }
.bar { width:100%; border-radius:4px 4px 0 0; transition:opacity .2s; cursor:pointer; }
.bar:hover { opacity:.75; }
.bar-lbl { font-size:10px; color:var(--tm); }

/* Table */
.udee-wrap-root table { width:100%; border-collapse:collapse; font-size:13px; }
.udee-wrap-root th { text-align:left; font-size:11px; color:var(--tm); font-weight:500; padding:6px 10px; border-bottom:1px solid var(--bd); text-transform:uppercase; letter-spacing:.04em; }
.udee-wrap-root td { padding:11px 10px; border-bottom:1px solid var(--bd); color:var(--tx); vertical-align:middle; }
.udee-wrap-root tr:last-child td { border-bottom:none; }
.udee-wrap-root tr:hover td { background:var(--bg); }
.badge { display:inline-flex; align-items:center; font-size:11px; padding:3px 9px; border-radius:20px; font-weight:500; }
.badge.done    { background:#EAF3DE; color:#3B6D11; }
.badge.process { background:#E6F1FB; color:#185FA5; }
.badge.pending { background:#FAEEDA; color:#854F0B; }
.badge.cancel  { background:#FCEBEB; color:#A32D2D; }

/* Notifications */
.notif { padding:10px 12px; border-radius:10px; background:var(--sa); margin-bottom:8px; display:flex; gap:10px; align-items:flex-start; cursor:pointer; transition:background .15s; }
.notif:hover { background:var(--bd); }
.notif i { color:var(--ac); font-size:16px; margin-top:1px; flex-shrink:0; }
.notif-title { font-size:13px; font-weight:500; color:var(--tx); }
.notif-time  { font-size:11px; color:var(--tm); margin-top:2px; }

/* Customers page */
.stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:20px; }
.stat-card  { background:var(--sf); border:1px solid var(--bd); border-radius:14px; padding:18px; text-align:center; box-shadow:0 1px 4px rgba(0,0,0,.06); }
.stat-num   { font-size:28px; font-weight:700; color:var(--tx); }
.stat-lbl   { font-size:12px; color:var(--tm); margin-top:4px; }
.avatar { width:32px; height:32px; border-radius:50%; background:var(--sa); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; color:var(--ac); flex-shrink:0; }
.search-bar { display:flex; align-items:center; gap:8px; background:var(--bg); border:1px solid var(--bd); border-radius:10px; padding:8px 12px; margin-bottom:14px; }
.search-bar input { border:none; background:transparent; font-size:13px; color:var(--tx); outline:none; flex:1; }
.filter-bar { display:flex; align-items:center; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
.filter-chip { padding:5px 14px; border-radius:20px; font-size:12px; border:1px solid var(--bd); cursor:pointer; color:var(--tm); background:var(--sf); transition:all .15s; }
.filter-chip.active { background:var(--pr); color:#fff; border-color:var(--pr); }
.tag { display:inline-flex; align-items:center; font-size:11px; padding:2px 9px; border-radius:20px; font-weight:500; }
.tag.vip { background:rgba(200,168,130,.25); color:#6b4c2a; }
.tag.new { background:#E6F1FB; color:#185FA5; }
.tag.reg { background:#F2EBE2; color:var(--tm); }

/* Analytics */
.ana-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px; }
.progress-row  { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.progress-bar  { flex:1; height:6px; background:var(--sa); border-radius:3px; overflow:hidden; }
.progress-fill { height:100%; border-radius:3px; background:var(--ac); }
.progress-lbl  { font-size:12px; color:var(--tm); min-width:80px; }
.progress-val  { font-size:12px; font-weight:500; color:var(--tx); min-width:35px; text-align:right; }
.donut-wrap  { display:flex; align-items:center; gap:16px; }
.legend-dot  { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
.legend-item { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.legend-lbl  { font-size:12px; color:var(--tm); }
.legend-val  { font-size:12px; font-weight:500; color:var(--tx); margin-left:auto; }

/* Settings */
.settings-grid    { display:grid; grid-template-columns:200px 1fr; gap:16px; }
.settings-nav     { background:var(--sf); border:1px solid var(--bd); border-radius:14px; padding:8px; height:fit-content; box-shadow:0 1px 4px rgba(0,0,0,.06); }
.settings-nav-item { padding:8px 12px; border-radius:8px; font-size:13px; color:var(--tm); cursor:pointer; display:flex; align-items:center; gap:8px; margin-bottom:2px; transition:all .15s; }
.settings-nav-item:hover  { background:var(--bg); }
.settings-nav-item.active { background:var(--sa); color:var(--pr); font-weight:500; }
.settings-content { background:var(--sf); border:1px solid var(--bd); border-radius:14px; padding:22px; box-shadow:0 1px 4px rgba(0,0,0,.06); }
.settings-section       { margin-bottom:24px; }
.settings-section-title { font-size:14px; font-weight:600; color:var(--tx); margin-bottom:4px; }
.settings-section-desc  { font-size:12px; color:var(--tm); margin-bottom:16px; }
.form-group  { margin-bottom:14px; }
.form-label  { font-size:12px; color:var(--tm); margin-bottom:6px; display:block; font-weight:500; }
.form-input  { width:100%; border:1px solid var(--bd); border-radius:8px; padding:8px 12px; font-size:13px; color:var(--tx); background:var(--bg); outline:none; transition:border-color .15s; }
.form-input:focus { border-color:var(--ac); }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.toggle { display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--bd); }
.toggle:last-child { border-bottom:none; }
.toggle-info .toggle-label { font-size:13px; font-weight:500; color:var(--tx); }
.toggle-info .toggle-desc  { font-size:12px; color:var(--tm); margin-top:2px; }
.switch { width:36px; height:20px; border-radius:20px; position:relative; cursor:pointer; flex-shrink:0; transition:background .2s; }
.switch.on  { background:var(--ac); }
.switch.off { background:var(--bd); }
.switch::after { content:''; position:absolute; top:2px; width:16px; height:16px; background:#fff; border-radius:50%; transition:left .2s; box-shadow:0 1px 3px rgba(0,0,0,.2); }
.switch.on::after  { left:18px; }
.switch.off::after { left:2px; }
.btn-save { background:var(--pr); color:#fff; border:none; border-radius:8px; padding:9px 22px; font-size:13px; font-weight:500; cursor:pointer; display:flex; align-items:center; gap:6px; transition:opacity .15s; }
.btn-save:hover { opacity:.88; }
.divider { height:1px; background:var(--bd); margin:20px 0; }

/* Top5 */
.top5-row  { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--bd); }
.top5-row:last-child { border-bottom:none; }
.top5-rank { font-size:13px; font-weight:600; color:var(--tm); min-width:20px; }
.top5-img  { width:36px; height:36px; border-radius:8px; background:var(--sa); display:flex; align-items:center; justify-content:center; }
.top5-name { flex:1; font-size:13px; color:var(--tx); }
.top5-sales { font-size:11px; color:var(--tm); }
.top5-val  { font-size:13px; font-weight:500; color:var(--tx); }
`

// ─── Page meta ───────────────────────────────────────────────────────────────
const PAGE_META = {
  dashboard: { title: 'Dashboard', subtitle: "สวัสดี! นี่คือภาพรวมร้านค้าของคุณวันนี้" },
  products:  { title: 'สินค้า', subtitle: 'จัดการข้อมูลสินค้าและสต็อกคงเหลือ' },
  orders:    { title: 'คำสั่งซื้อ', subtitle: 'ตรวจสอบและอัปเดตสถานะการจัดส่ง' },
  customers: { title: 'ลูกค้า', subtitle: 'จัดการข้อมูลและติดตามพฤติกรรมลูกค้า' },
  analytics: { title: 'Analytics', subtitle: 'วิเคราะห์ข้อมูลยอดขายและสถิติร้านค้า' },
  settings:  { title: 'ตั้งค่า', subtitle: 'จัดการการตั้งค่าระบบและร้านค้า' },
}

// ─── Sidebar navigation groups ───────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard',  icon: 'dashboard',     type: 'state' },
      { id: 'products',  label: 'Products',   icon: 'inventory_2',   type: 'state' },
      { id: 'orders',    label: 'Orders',     icon: 'shopping_cart', type: 'state' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { id: 'customers', label: 'Customers', icon: 'people',   type: 'state' },
      { id: 'analytics', label: 'Analytics', icon: 'insights', type: 'state' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'settings', label: 'Settings', icon: 'settings', type: 'state' },
    ],
  },
]

// ─── Top products data ────────────────────────────────────────────────────────
const TOP_PRODUCTS = [
  { name: 'โต๊ะกินข้าว Oak Gatherer', sales: 45, revenue: '฿832,500', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&q=80' },
  { name: 'เก้าอี้สุขุม Minimal',     sales: 38, revenue: '฿532,000', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300&q=80' },
  { name: 'โต๊ะทำงาน Pro Series',     sales: 32, revenue: '฿476,800', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=300&q=80' },
  { name: 'เสาโคมไฟ Industrial',      sales: 28, revenue: '฿252,000', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80' },
]

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const reduceMotion = useReducedMotion()
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const transition = { duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }

  // ── Sidebar NavItem ──────────────────────────────────────────────────────
  function NavItem({ item }) {
    const isActive = activePage === item.id
    const cls = `flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
      isActive
        ? 'bg-[#3D2B1F] text-white shadow-sm'
        : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#3D2B1F]'
    }`

    const inner = (
      <>
        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
        <span className="flex-1 text-left">{item.label}</span>
        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#C8A882]" />}
      </>
    )

    if (item.type === 'link') {
      return (
        <Link to={item.path}>
          <motion.div className={cls} whileHover={{ scale: isActive ? 1 : 1.01 }} whileTap={{ scale: 0.97 }}>
            {inner}
          </motion.div>
        </Link>
      )
    }
    return (
      <motion.button
        className={cls}
        onClick={() => { setActivePage(item.id); setSidebarOpen(false) }}
        whileHover={{ scale: isActive ? 1 : 1.01 }}
        whileTap={{ scale: 0.97 }}
      >
        {inner}
      </motion.button>
    )
  }

  // ── Content renderer ──────────────────────────────────────────────────────
  function renderContent() {
    if (activePage === 'dashboard') {
      return <DashboardView reduceMotion={reduceMotion} transition={transition} />
    }
    if (activePage === 'products') {
      return <AdminProductsPage reduceMotion={reduceMotion} transition={transition} />
    }
    if (activePage === 'orders') {
      return <AdminOrdersPage reduceMotion={reduceMotion} transition={transition} />
    }
    return (
      <div className="udee-wrap-root">
        <style>{ADMIN_SUB_STYLES}</style>
        {activePage === 'customers' && <Customers />}
        {activePage === 'analytics' && <Analytics />}
        {activePage === 'settings'  && <Settings />}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {/* ── Mobile overlay ────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ───────────────────────────────────── */}
      <aside
        className={`fixed md:static z-50 flex h-screen w-64 flex-shrink-0 flex-col bg-white border-r border-[#E5E7EB] ${
          sidebarOpen ? 'flex' : 'hidden md:flex'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#E5E7EB] px-5">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3D2B1F] group-hover:bg-[#5a3f2f] transition-colors">
              <span className="material-symbols-outlined text-white text-sm">table_restaurant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-[#3D2B1F]">UDEE</span>
              <span className="text-[10px] font-semibold text-[#A0724A] bg-[#FEF4EA] px-1.5 py-0.5 rounded-md border border-[#F3D9B8]">
                Admin
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#3D2B1F] hover:bg-[#F3F4F6] transition"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-[#C4C9D4]">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User profile */}
        <div className="border-t border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#F9FAFB] p-3 hover:bg-[#F3F4F6] transition cursor-pointer">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A0724A] to-[#3D2B1F] text-white font-bold text-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#111827] truncate">Admin User</p>
              <p className="text-xs text-[#9CA3AF] truncate">admin@udee.co.th</p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#9CA3AF]">more_vert</span>
          </div>
        </div>
      </aside>

      {/* ── Main area ─────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-white px-6 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile menu btn */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-[#6B7280] hover:text-[#3D2B1F] hover:bg-[#F3F4F6] transition"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-[#9CA3AF]">Admin</span>
              <span className="material-symbols-outlined text-[14px] text-[#D1D5DB]">chevron_right</span>
              <span className="font-semibold text-[#111827]">
                {PAGE_META[activePage]?.title ?? activePage}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#9CA3AF]">
                search
              </span>
              <input
                type="text"
                placeholder="ค้นหา..."
                className="w-52 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-2 pl-9 pr-4 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20 transition"
              />
            </div>
            {/* Notification */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F9FAFB] transition">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            {/* Go to store */}
            <Link
              to="/"
              className="flex h-9 items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#3D2B1F] transition"
              title="ไปหน้าร้านค้า"
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span className="hidden lg:block">ร้านค้า</span>
            </Link>
          </div>
        </header>

        {/* Page header strip */}
        <div className="flex-shrink-0 border-b border-[#E5E7EB] bg-white px-6 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage + '-header'}
              initial={reduceMotion ? false : { y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -4, opacity: 0 }}
              transition={{ duration: 0.14 }}
            >
              <h1 className="text-[22px] font-bold text-[#111827] leading-tight">
                {PAGE_META[activePage]?.title ?? activePage}
              </h1>
              <p className="mt-0.5 text-sm text-[#9CA3AF]">
                {PAGE_META[activePage]?.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={reduceMotion ? false : { y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={transition}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

// ─── Dashboard main view (improved premium design) ────────────────────────────
function DashboardView({ reduceMotion, transition }) {
  const BAR_DATA = [42, 58, 35, 67, 89, 74, 95, 82, 61, 78, 55, 90]
  const MONTHS  = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
  const maxVal  = Math.max(...BAR_DATA)

  const METRICS = [
    { label:'รายได้วันนี้',  value:'฿42,800',  change:'+16% vs เมื่อวาน', icon:'payments',     bg:'#FEF4EA', fg:'#A0724A', accent:'from-[#A0724A] to-[#3D2B1F]' },
    { label:'ยอดออเดอร์',   value:'124',      change:'+8% vs เมื่อวาน',  icon:'shopping_bag', bg:'#EAF3DE', fg:'#4A7C59', accent:'from-[#4A7C59] to-[#2d5939]' },
    { label:'ลูกค้าใหม่',   value:'48',       change:'+12% vs เมื่อวาน', icon:'person_add',   bg:'#E6F1FB', fg:'#2C6FAC', accent:'from-[#2C6FAC] to-[#1a4870]' },
    { label:'สินค้าคงเหลือ', value:'1,234',  change:'-4% vs เมื่อวาน',  icon:'inventory',    bg:'#FAEEDA', fg:'#C17B2A', accent:'from-[#C17B2A] to-[#8B5410]' },
  ]

  const RECENT_ORDERS = [
    { id:'ORD-001', customer:'สมชาย ใจดี',     amount:'฿45,900', status:'Completed', date:'2 ชม. ที่แล้ว' },
    { id:'ORD-002', customer:'วิภา สุขสันต์',  amount:'฿28,500', status:'Processing', date:'5 ชม. ที่แล้ว' },
    { id:'ORD-003', customer:'นฤมล รักษ์ดี',   amount:'฿67,200', status:'Pending',    date:'1 วันที่แล้ว' },
    { id:'ORD-004', customer:'กิตติ เก่งการค้า', amount:'฿34,100', status:'Completed', date:'2 วันที่แล้ว' },
    { id:'ORD-005', customer:'มานี มีสุข',      amount:'฿52,800', status:'Shipped',    date:'3 วันที่แล้ว' },
  ]

  const NOTIFS = [
    { icon:'shopping_cart', title:'คำสั่งซื้อใหม่ 25 รายการ', time:'1 ชั่วโมงที่แล้ว', urgent:false },
    { icon:'warning',       title:'สต็อกสินค้าใกล้หมด',      time:'3 ชั่วโมงที่แล้ว', urgent:true  },
    { icon:'person_add',    title:'ลูกค้าใหม่ 5 คนวันนี้',   time:'วานนี้',           urgent:false },
  ]

  const statusCls = (s) => {
    if (s === 'Completed')  return 'bg-green-50  text-green-700  border border-green-200'
    if (s === 'Processing') return 'bg-blue-50   text-blue-700   border border-blue-200'
    if (s === 'Pending')    return 'bg-amber-50  text-amber-700  border border-amber-200'
    if (s === 'Shipped')    return 'bg-purple-50 text-purple-700 border border-purple-200'
    return 'bg-gray-50 text-gray-700'
  }

  return (
    <div className="max-w-7xl space-y-5">

      {/* ── KPI Cards ──────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            className="relative overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] p-5 hover:shadow-lg transition-shadow"
            initial={reduceMotion ? false : { y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...transition, delay: i * 0.06 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">{m.label}</p>
                <p className="mt-2.5 text-[26px] font-bold leading-none text-[#111827]">{m.value}</p>
                <p className="mt-1.5 text-xs text-[#9CA3AF]">{m.change}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0" style={{ background: m.bg }}>
                <span className="material-symbols-outlined text-[22px]" style={{ color: m.fg }}>{m.icon}</span>
              </div>
            </div>
            {/* accent stripe */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${m.accent}`} />
          </motion.div>
        ))}
      </div>

      {/* ── Chart + Notifications ──────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Bar chart */}
        <motion.div
          className="lg:col-span-2 rounded-2xl bg-white border border-[#E5E7EB] p-5"
          initial={reduceMotion ? false : { y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...transition, delay: 0.26 }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-[#111827]">ยอดขายรายเดือน</h2>
              <p className="text-xs text-[#9CA3AF]">เปรียบเทียบปีนี้ vs ปีที่แล้ว</p>
            </div>
            <select className="text-xs border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[#6B7280] bg-white outline-none focus:border-[#A0724A] transition">
              <option>ปีนี้</option>
              <option>ปีที่แล้ว</option>
            </select>
          </div>
          <div className="flex items-end gap-1.5 h-36">
            {BAR_DATA.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <motion.div
                  className="w-full rounded-t-md cursor-pointer hover:opacity-75 transition-opacity"
                  style={{ background: v === maxVal ? '#3D2B1F' : v > 70 ? '#A0724A' : '#DDD0C4' }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.round((v / maxVal) * 100)}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.55, delay: 0.3 + i * 0.04, ease: 'easeOut' }}
                />
                <span className="text-[9px] text-[#9CA3AF]">{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          className="rounded-2xl bg-white border border-[#E5E7EB] p-5"
          initial={reduceMotion ? false : { y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...transition, delay: 0.32 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#111827]">การแจ้งเตือน</h2>
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2 ใหม่</span>
          </div>
          <div className="space-y-2">
            {NOTIFS.map((n, i) => (
              <motion.div
                key={i}
                className={`flex gap-3 items-start rounded-xl p-3 cursor-pointer transition-colors ${
                  n.urgent ? 'bg-red-50 hover:bg-red-100' : 'bg-[#FAF6F1] hover:bg-[#F2EBE2]'
                }`}
                initial={reduceMotion ? false : { x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ ...transition, delay: 0.38 + i * 0.06 }}
                whileHover={{ x: 2 }}
              >
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                  n.urgent ? 'bg-red-100' : 'bg-[#A0724A]/10'
                }`}>
                  <span className={`material-symbols-outlined text-[18px] ${n.urgent ? 'text-red-600' : 'text-[#A0724A]'}`}>
                    {n.icon}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#111827]">{n.title}</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">{n.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Recent Orders Table ────────────────────────── */}
      <motion.div
        className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden"
        initial={reduceMotion ? false : { y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...transition, delay: 0.42 }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-sm font-semibold text-[#111827]">ออเดอร์ล่าสุด</h2>
          <button
            onClick={() => setActivePage('orders')}
            className="flex items-center gap-1 text-xs font-medium text-[#A0724A] hover:text-[#3D2B1F] transition"
          >
            ดูทั้งหมด
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB]">
              <tr>
                {['Order ID', 'ลูกค้า', 'ยอด', 'สถานะ', 'วันที่'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {RECENT_ORDERS.map((order, i) => (
                <motion.tr
                  key={order.id}
                  className="hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...transition, delay: 0.48 + i * 0.04 }}
                >
                  <td className="px-5 py-3.5 font-bold text-[#3D2B1F]">{order.id}</td>
                  <td className="px-5 py-3.5 text-[#374151]">{order.customer}</td>
                  <td className="px-5 py-3.5 font-semibold text-[#111827]">{order.amount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusCls(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#9CA3AF]">{order.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Top Products ───────────────────────────────── */}
      <motion.div
        className="rounded-2xl bg-white border border-[#E5E7EB] p-5"
        initial={reduceMotion ? false : { y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...transition, delay: 0.52 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#111827]">สินค้าขายดี</h2>
          <button
            onClick={() => setActivePage('products')}
            className="flex items-center gap-1 text-xs font-medium text-[#A0724A] hover:text-[#3D2B1F] transition"
          >
            จัดการสินค้า
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOP_PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              className="rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-all cursor-pointer group"
              initial={reduceMotion ? false : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...transition, delay: 0.58 + i * 0.06 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative h-28 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] font-semibold text-[#6B7280]">
                  #{i + 1}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-xs font-semibold text-[#111827] line-clamp-2 mb-2 leading-relaxed">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#9CA3AF]">{p.sales} sold</span>
                  <span className="text-xs font-bold text-[#A0724A]">{p.revenue}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

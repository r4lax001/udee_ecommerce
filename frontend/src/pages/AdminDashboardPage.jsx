import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats } from '../services/admin'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Customers, Analytics } from './admin/AdminPages'
import Settings from './admin/AdminSettings'
import AdminProductsPage from './AdminProductsPage'
import AdminOrdersPage from './AdminOrdersPage'
import { useAuth } from '../contexts'

// ─── Scoped CSS ถูกนำออกแล้ว เนื่องจากปรับไปใช้ Tailwind CSS เต็มรูปแบบ ──────

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
  const { user } = useAuth()
  const reduceMotion = useReducedMotion()

  const roleKey = user?.role?.toUpperCase() || 'MANAGER'
  const ROLE_PERMISSIONS = {
    MANAGER: ['dashboard', 'products', 'orders'],
    ADMIN:   ['customers', 'analytics', 'settings'],
  }
  const allowedPages = ROLE_PERMISSIONS[roleKey] || []
  const defaultPage = roleKey === 'ADMIN' ? 'customers' : 'dashboard'

  const [activePage, setActivePage] = useState(defaultPage)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentPage = allowedPages.includes(activePage) ? activePage : defaultPage

  const transition = { duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }

  // ── Sidebar NavItem ──────────────────────────────────────────────────────
  function NavItem({ item }) {
    const isActive = currentPage === item.id
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
    if (!allowedPages.includes(currentPage)) return null;

    if (currentPage === 'dashboard') {
      return <DashboardView reduceMotion={reduceMotion} transition={transition} onNavigate={setActivePage} />
    }
    if (currentPage === 'products') {
      return <AdminProductsPage reduceMotion={reduceMotion} transition={transition} />
    }
    if (currentPage === 'orders') {
      return <AdminOrdersPage reduceMotion={reduceMotion} transition={transition} />
    }
    return (
      <div className="animate-in fade-in duration-300">
        {currentPage === 'customers' && <Customers />}
        {currentPage === 'analytics' && <Analytics />}
        {currentPage === 'settings'  && <Settings />}
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
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${
                roleKey === 'ADMIN' 
                  ? 'text-[#B94040] bg-[#FCEBEB] border-[#F5C6C6]' 
                  : 'text-[#C17B2A] bg-[#FEF4EA] border-[#F3D9B8]'
              }`}>
                {roleKey === 'ADMIN' ? 'Admin' : 'Manager'}
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
          {NAV_GROUPS.map((group) => {
            const visibleItems = group.items.filter(item => allowedPages.includes(item.id));
            if (visibleItems.length === 0) return null;
            return (
            <div key={group.label}>
              <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-[#C4C9D4]">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map((item) => (
                  <NavItem key={item.id} item={item} />
                ))}
              </div>
            </div>
            )
          })}
        </nav>

        {/* User profile */}
        <div className="border-t border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#F9FAFB] p-3 hover:bg-[#F3F4F6] transition cursor-pointer">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A0724A] to-[#3D2B1F] text-white font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#111827] truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-[#9CA3AF] truncate">{user?.email || 'admin@udee.co.th'}</p>
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
              <span className="text-[#9CA3AF]">{roleKey === 'ADMIN' ? 'Admin' : 'Manager'}</span>
              <span className="material-symbols-outlined text-[14px] text-[#D1D5DB]">chevron_right</span>
              <span className="font-semibold text-[#111827]">
                {PAGE_META[currentPage]?.title ?? currentPage}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
           
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
              key={currentPage + '-header'}
              initial={reduceMotion ? false : { y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -4, opacity: 0 }}
              transition={{ duration: 0.14 }}
            >
              <h1 className="text-[22px] font-bold text-[#111827] leading-tight">
                {PAGE_META[currentPage]?.title ?? currentPage}
              </h1>
              <p className="mt-0.5 text-sm text-[#9CA3AF]">
                {PAGE_META[currentPage]?.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
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
function DashboardView({ reduceMotion, transition, onNavigate }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const stats = await getDashboardStats()
        setData(stats)
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูล Dashboard ได้')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="flex h-64 items-center justify-center text-[#9CA3AF]">กำลังโหลดข้อมูล...</div>
  if (error) return <div className="flex h-64 items-center justify-center text-red-500">{error}</div>

  const BAR_DATA = data.monthlySales || Array(12).fill(0)
  const MONTHS  = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
  const maxVal  = Math.max(...BAR_DATA, 1) // prevent division by zero

  const kpi = data.kpi || {}
  const METRICS = [
    { label:'รายได้วันนี้',  value:`฿${Number(kpi.revenueToday || 0).toLocaleString('th-TH')}`,  change:`${kpi.revenueChange || '0%'} vs เมื่อวาน`, icon:'payments',     bg:'#FEF4EA', fg:'#A0724A', accent:'from-[#A0724A] to-[#3D2B1F]' },
    { label:'ยอดออเดอร์',   value:kpi.ordersToday || 0,      change:`${kpi.ordersChange || '0%'} vs เมื่อวาน`,  icon:'shopping_bag', bg:'#EAF3DE', fg:'#4A7C59', accent:'from-[#4A7C59] to-[#2d5939]' },
    { label:'ลูกค้าใหม่',   value:kpi.newCustomers || 0,       change:`${kpi.customersChange || '0%'} vs เมื่อวาน`, icon:'person_add',   bg:'#E6F1FB', fg:'#2C6FAC', accent:'from-[#2C6FAC] to-[#1a4870]' },
    { label:'สินค้าคงเหลือ', value:Number(kpi.totalStock || 0).toLocaleString('th-TH'), change:'',  icon:'inventory',    bg:'#FAEEDA', fg:'#C17B2A', accent:'from-[#C17B2A] to-[#8B5410]' },
  ]

  const RECENT_ORDERS = data.recentOrders || []
  const NOTIFS = data.notifications || []
  const TOP_PRODUCTS = data.topProducts || []

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
            onClick={() => onNavigate('orders')}
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
            onClick={() => onNavigate('products')}
            className="flex items-center gap-1 text-xs font-medium text-[#A0724A] hover:text-[#3D2B1F] transition"
          >
            จัดการสินค้า
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {TOP_PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-[#E5E7EB] hover:bg-[#FAFAFA] transition-all cursor-pointer group"
              initial={reduceMotion ? false : { x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ ...transition, delay: 0.58 + i * 0.06 }}
            >
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#F3F4F6]">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#9CA3AF]">
                    <span className="material-symbols-outlined text-xl">image</span>
                  </div>
                )}
                <div className="absolute top-1 left-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-[9px] font-bold text-[#111827] shadow-sm">
                  {i + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-[#111827] truncate group-hover:text-[#A0724A] transition-colors">{p.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[11px] text-[#6B7280]">{p.sales} items sold</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-[#3D2B1F]">{p.revenue}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

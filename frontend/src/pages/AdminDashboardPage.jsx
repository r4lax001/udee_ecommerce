import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { adminDashboardPageData } from '../data/adminDashboardPageData'

const defaultMetrics = adminDashboardPageData.metrics
const defaultHighlights = adminDashboardPageData.highlights
const adminNotifications = adminDashboardPageData.notifications
const defaultOrders = adminDashboardPageData.recentOrders

const AdminDashboardPage = () => {
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', active: true, path: '/admin-dashboard' },
    { id: 'products', label: 'Products', icon: 'inventory_2', path: '/admin-products' },
    { id: 'orders', label: 'Orders', icon: 'shopping_cart', path: '/admin-orders' },
    { id: 'customers', label: 'Customers', icon: 'people', path: '/' },
    { id: 'analytics', label: 'Analytics', icon: 'insights', path: '/' },
    { id: 'settings', label: 'Settings', icon: 'settings', path: '/' },
  ]

  const recentOrders = [
    { id: 'ORD-001', customer: 'สมชาย ใจดี', amount: '฿45,900', status: 'Completed', date: '2 ชั่วโมงที่แล้ว' },
    { id: 'ORD-002', customer: 'วิภา สุขสันต์', amount: '฿28,500', status: 'Processing', date: '5 ชั่วโมงที่แล้ว' },
    { id: 'ORD-003', customer: 'นฤมล รักษ์ดี', amount: '฿67,200', status: 'Pending', date: '1 วันที่แล้ว' },
    { id: 'ORD-004', customer: 'กิตติ เก่งการค้า', amount: '฿34,100', status: 'Completed', date: '2 วันที่แล้ว' },
    { id: 'ORD-005', customer: 'มานี มีสุข', amount: '฿52,800', status: 'Shipped', date: '3 วันที่แล้ว' },
  ]

  const topProducts = [
    { name: 'โต๊ะกินข้าว Oak Gatherer', sales: 45, revenue: '฿832,500', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=100&q=80' },
    { name: 'เก้าอี้สุขุม Minimal', sales: 38, revenue: '฿532,000', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=100&q=80' },
    { name: 'โต๊ะทำงาน Pro Series', sales: 32, revenue: '฿476,800', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=100&q=80' },
    { name: 'เสาโคมไฟ Industrial', sales: 28, revenue: '฿252,000', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&q=80' },
  ]

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:static z-50 w-64 flex-col border-r border-[#E5E7EB] bg-white shadow-lg md:shadow-none ${
          sidebarOpen ? 'flex' : 'hidden md:flex'
        }`}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={transition}
      >
        {/* Logo */}
        <Link to="/" className="flex h-16 items-center justify-between border-b border-[#E5E7EB] px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3D2B1F]">
              <span className="material-symbols-outlined text-white text-sm">table_restaurant</span>
            </div>
            <span className="text-xl font-bold text-[#3D2B1F]">UDEE</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              setSidebarOpen(false)
            }}
            className="md:hidden p-1 text-[#6B7280] hover:text-[#3D2B1F]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {sidebarItems.map((item) => (
            <Link key={item.id} to={item.path}>
              <motion.div
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  item.active
                    ? 'bg-[#3D2B1F] text-white'
                    : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#3D2B1F]'
                }`}
                whileHover={{ scale: item.active ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#F9FAFB] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A0724A]">
              <span className="material-symbols-outlined text-white">person</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#3D2B1F]">Admin User</p>
              <p className="text-xs text-[#6B7280]">admin@udee.com</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-white px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-[#6B7280] hover:text-[#3D2B1F]"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">search</span>
              <input
                type="text"
                placeholder="Search..."
                className="w-64 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] py-2 pl-10 pr-4 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[#6B7280] hover:text-[#3D2B1F]">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button className="p-2 text-[#6B7280] hover:text-[#3D2B1F]">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Title */}
            <motion.div
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={transition}
            >
              <h1 className="text-2xl font-semibold text-[#111827]">Dashboard</h1>
              <p className="mt-1 text-sm text-[#6B7280]">Welcome back! Here's what's happening with your store today.</p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...transition, delay: 0.1 }}
            >
              {defaultMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
                  initial={reduceMotion ? false : { y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ ...transition, delay: 0.15 + index * 0.05 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6B7280]">{metric.label}</p>
                      <p className="mt-2 text-3xl font-bold text-[#111827]">{metric.value}</p>
                      <p className="mt-1 text-sm text-green-600">{metric.change}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F4F6]">
                      <span className="material-symbols-outlined text-xl text-[#6B7280]">trending_up</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Sales Chart */}
              <motion.div
                className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm"
                initial={reduceMotion ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...transition, delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#111827]">Sales Overview</h2>
                    <p className="text-sm text-[#6B7280]">Monthly revenue vs last year</p>
                  </div>
                  <select className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none">
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>This Year</option>
                  </select>
                </div>
                {/* Simple Chart Visualization */}
                <div className="mt-6 flex h-48 items-end gap-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        className="w-full rounded-t-lg bg-[#3D2B1F]"
                        initial={{ height: 0 }}
                        animate={{ height: `${30 + Math.random() * 70}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.05 }}
                      />
                      <span className="text-xs text-[#6B7280]">{month}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Notifications */}
              <motion.div
                className="rounded-2xl bg-white p-6 shadow-sm"
                initial={reduceMotion ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...transition, delay: 0.35 }}
              >
                <h2 className="text-lg font-semibold text-[#111827]">Notifications</h2>
                <div className="mt-4 space-y-4">
                  {adminNotifications.slice(0, 3).map((notification, index) => (
                    <motion.div
                      key={notification.title}
                      className="flex gap-3 rounded-xl bg-[#FEF4EA] p-3"
                      initial={reduceMotion ? false : { x: 10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ ...transition, delay: 0.4 + index * 0.05 }}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A0724A]/20">
                        <span className="material-symbols-outlined text-sm text-[#A0724A]">notifications</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#111827]">{notification.title}</p>
                        <p className="text-xs text-[#6B7280]">{notification.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent Orders Table */}
            <motion.div
              className="rounded-2xl bg-white shadow-sm"
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...transition, delay: 0.45 }}
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] p-6">
                <h2 className="text-lg font-semibold text-[#111827]">Recent Orders</h2>
                <Link to="/admin-orders" className="text-sm font-medium text-[#A0724A] hover:text-[#3D2B1F]">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F9FAFB]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B7280]">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B7280]">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B7280]">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B7280]">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B7280]">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {recentOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        className="hover:bg-[#F9FAFB] transition"
                        initial={reduceMotion ? false : { y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ ...transition, delay: 0.5 + index * 0.03 }}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-[#111827]">{order.id}</td>
                        <td className="px-6 py-4 text-sm text-[#6B7280]">{order.customer}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#111827]">{order.amount}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              order.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'Processing'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'Shipped'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#6B7280]">{order.date}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Top Products */}
            <motion.div
              className="rounded-2xl bg-white p-6 shadow-sm"
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...transition, delay: 0.55 }}
            >
              <h2 className="text-lg font-semibold text-[#111827]">Top Products</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {topProducts.map((product, index) => (
                  <motion.div
                    key={product.name}
                    className="rounded-xl border border-[#E5E7EB] p-4 transition hover:shadow-md"
                    initial={reduceMotion ? false : { scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ ...transition, delay: 0.6 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <img src={product.image} alt={product.name} className="h-32 w-full rounded-lg object-cover" />
                    <h3 className="mt-3 text-sm font-medium text-[#111827] line-clamp-2">{product.name}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-[#6B7280]">{product.sales} sold</span>
                      <span className="text-sm font-semibold text-[#A0724A]">{product.revenue}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboardPage

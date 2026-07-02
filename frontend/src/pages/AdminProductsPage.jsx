import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { adminProductsPageData } from '../data/adminProductsPageData'

const defaultProducts = adminProductsPageData

const AdminProductsPage = ({ products = defaultProducts }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/admin-dashboard' },
    { id: 'products', label: 'Products', icon: 'inventory_2', active: true, path: '/admin-products' },
    { id: 'orders', label: 'Orders', icon: 'shopping_cart', path: '/admin-orders' },
    { id: 'customers', label: 'Customers', icon: 'people', path: '/' },
    { id: 'analytics', label: 'Analytics', icon: 'insights', path: '/' },
    { id: 'settings', label: 'Settings', icon: 'settings', path: '/' },
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
                placeholder="Search products..."
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

        {/* Products Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Title */}
            <motion.div
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={transition}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-2xl font-semibold text-[#111827]">Products</h1>
                <p className="mt-1 text-sm text-[#6B7280]">Manage your product inventory</p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#3D2B1F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2d2318]">
                <span className="material-symbols-outlined">add</span>
                Add Product
              </button>
            </motion.div>

            {/* Products Table */}
            <motion.div
              className="rounded-2xl bg-white shadow-sm"
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...transition, delay: 0.1 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F9FAFB]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B7280]">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B7280]">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B7280]">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B7280]">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B7280]">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {products.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        className="hover:bg-[#F9FAFB] transition"
                        initial={reduceMotion ? false : { y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ ...transition, delay: 0.15 + index * 0.03 }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                            <div>
                              <p className="text-sm font-medium text-[#111827]">{product.name}</p>
                              <p className="text-xs text-[#6B7280]">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#6B7280]">{product.category}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#111827]">{product.price}</td>
                        <td className="px-6 py-4 text-sm text-[#6B7280]">{product.stock}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              product.status === 'In Stock'
                                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                                : product.status === 'Low Stock'
                                ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                                : 'bg-rose-100 text-rose-800 border-2 border-rose-300'
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-[#6B7280] hover:text-[#3D2B1F]">
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                            <button className="p-1 text-[#6B7280] hover:text-red-600">
                              <span className="material-symbols-outlined text-xl">delete</span>
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
        </main>
      </div>
    </div>
  )
}

export default AdminProductsPage

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { profilePageData } from '../data/profilePageData'
import { useAuth } from '../contexts'

const defaultUser = profilePageData.user
const purchases = profilePageData.history

const ProfilePage = ({ user: propUser, history = purchases }) => {
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }
  const [activeTab, setActiveTab] = useState('dashboard')
  const { user: authUser, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF6F1] px-6 text-[#1D1B1A]">
        <span className="material-symbols-outlined text-6xl text-[#D2C4BC] mb-4">lock</span>
        <h2 className="text-2xl font-bold text-[#3D2B1F] mb-2">กรุณาเข้าสู่ระบบก่อน</h2>
        <p className="text-sm text-[#81756E] mb-6 text-center max-w-md">
          คุณต้องเข้าสู่ระบบสมาชิก UDEE เพื่อเข้าถึงข้อมูลส่วนตัว รายการโปรด และประวัติการสั่งซื้อของคุณ
        </p>
        <Link to="/auth" className="rounded-xl bg-[#3D2B1F] px-6 py-3 font-semibold text-white hover:opacity-90 active:scale-95 transition">
          เข้าสู่ระบบสมาชิก
        </Link>
      </div>
    )
  }

  const user = authUser || propUser || defaultUser

  const tabs = [
    { id: 'dashboard', label: 'ภาพรวมบัญชี', icon: 'dashboard' },
    { id: 'profile', label: 'ข้อมูลส่วนตัว', icon: 'person' },
    { id: 'orders', label: 'ประวัติการสั่งซื้อ', icon: 'shopping_bag' },
    { id: 'settings', label: 'การตั้งค่า', icon: 'settings' },
    { id: 'wishlist', label: 'รายการโปรด', icon: 'favorite' },
  ]

  const stats = [
    { label: 'ออเดอร์ทั้งหมด', value: '12', icon: 'shopping_cart' },
    { label: 'คะแนนสะสม', value: '850', icon: 'stars' },
    { label: 'วอชเชอร์', value: '3', icon: 'local_offer' },
    { label: 'รีวิว', value: '8', icon: 'rate_review' },
  ]

  return (
    <motion.main
      className="min-h-screen bg-[#FAF6F1] text-[#1D1B1A]"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
    >
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          className="mb-10 rounded-[2rem] bg-gradient-to-r from-[#3D2B1F] to-[#5a4e46] p-10 text-white shadow-[0_24px_70px_rgba(61,43,31,0.15)]"
          initial={reduceMotion ? false : { y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={transition}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
            <motion.div
              className="h-32 w-32 overflow-hidden rounded-full border-4 border-white/30 bg-white/10 shadow-xl"
              whileHover={{ scale: 1.05 }}
              transition={transition}
            >
              <div className="flex h-full w-full items-center justify-center bg-[#A0724A]/20">
                <span className="material-symbols-outlined text-5xl text-white/80">person</span>
              </div>
            </motion.div>
            <div className="flex-1">
              <p className="text-sm uppercase tracking-[0.28em] text-[#F4E7D9]">บัญชีของฉัน</p>
              <h1 className="mt-2 text-4xl font-semibold">{user.name}</h1>
              <p className="mt-2 text-[#E7D7C9]">{user.email}</p>
              <p className="mt-1 text-sm text-[#F4E7D9]/80">สมาชิกตั้งแต่ {user.joined}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl bg-white px-6 py-3 font-semibold text-[#3D2B1F] shadow-lg hover:bg-[#F8F3EB] transition"
            >
              แก้ไขโปรไฟล์
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial={reduceMotion ? false : { y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...transition, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="card-base p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(61,43,31,0.2)]"
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...transition, delay: 0.15 + index * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#81756e]">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-[#3D2B1F]">{stat.value}</p>
                </div>
                <span className="material-symbols-outlined text-4xl text-[#A0724A]/40">{stat.icon}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <motion.aside
            className="space-y-6"
            initial={reduceMotion ? false : { x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ...transition, delay: 0.2 }}
          >
            <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_30px_rgba(61,43,31,0.08)]">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left text-sm font-semibold transition ${
                      activeTab === tab.id
                        ? 'bg-[#3D2B1F] text-white'
                        : 'text-[#3D2B1F] hover:bg-[#F8F3EB]'
                    }`}
                    whileHover={{ scale: activeTab !== tab.id ? 1.02 : 1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                    {tab.label}
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.aside>

          <motion.div
            className="space-y-8"
            initial={reduceMotion ? false : { x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ...transition, delay: 0.25 }}
          >
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div key="dashboard" className="rounded-[2rem] bg-white p-10 shadow-[0_12px_30px_rgba(61,43,31,0.08)]">
                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">ออเดอร์ล่าสุด</h2>
                  <div className="mt-6 space-y-4">
                    {history.slice(0, 2).map((purchase) => (
                      <div key={purchase.id} className="rounded-3xl border border-[#E8E1DF] p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-[#3D2B1F]">{purchase.id}</p>
                            <p className="text-sm text-[#81756e]">{purchase.date}</p>
                          </div>
                          <p className="text-lg font-semibold text-[#A0724A]">{purchase.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div key="profile" className="rounded-[2rem] bg-white p-10 shadow-[0_12px_30px_rgba(61,43,31,0.08)]">
                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">ข้อมูลส่วนตัว</h2>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {[
                      { label: 'ชื่อ-นามสกุล', value: user.name, icon: 'badge' },
                      { label: 'อีเมล', value: user.email, icon: 'email' },
                      { label: 'เบอร์โทรศัพท์', value: user.phone, icon: 'phone' },
                      { label: 'ที่อยู่', value: user.address, icon: 'location_on' },
                    ].map((field) => (
                      <div key={field.label} className="rounded-3xl bg-[#F8F3EB] p-6">
                        <p className="text-sm text-[#81756e]">{field.label}</p>
                        <p className="mt-2 text-lg font-medium text-[#3D2B1F]">{field.value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div key="orders" className="rounded-[2rem] bg-white p-10 shadow-[0_12px_30px_rgba(61,43,31,0.08)]">
                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">ประวัติการสั่งซื้อ</h2>
                  <div className="mt-6 space-y-4">
                    {history.map((purchase) => (
                      <div key={purchase.id} className="rounded-3xl border border-[#E8E1DF] p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-[#3D2B1F]">{purchase.id}</p>
                            <p className="text-sm text-[#81756e]">{purchase.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-[#A0724A]">{purchase.total}</p>
                            <p className="text-sm text-[#81756e]">{purchase.status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div key="settings" className="rounded-[2rem] bg-white p-10 shadow-[0_12px_30px_rgba(61,43,31,0.08)]">
                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">การตั้งค่า</h2>
                  <div className="mt-6 space-y-4">
                    {[
                      { label: 'การแจ้งเตือน', value: 'เปิดใช้งาน' },
                      { label: 'ภาษา', value: 'ไทย' },
                      { label: 'ความเป็นส่วนตัว', value: 'สาธารณะ' },
                    ].map((setting) => (
                      <div key={setting.label} className="rounded-3xl bg-[#F8F3EB] p-6">
                        <p className="text-sm text-[#81756e]">{setting.label}</p>
                        <p className="mt-2 text-lg font-medium text-[#3D2B1F]">{setting.value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'wishlist' && (
                <motion.div key="wishlist" className="rounded-[2rem] bg-white p-10 shadow-[0_12px_30px_rgba(61,43,31,0.08)]">
                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">รายการโปรด</h2>
                  <p className="mt-6 text-[#81756e]">ยังไม่มีรายการโปรด</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </motion.main>
  )
}

export default ProfilePage

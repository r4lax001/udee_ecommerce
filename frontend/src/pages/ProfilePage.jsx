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
        {/* Profile Header */}
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

        {/* Stats Cards */}
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

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
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

            <motion.div
              className="rounded-[2rem] bg-gradient-to-br from-[#A0724A] to-[#8B5E3C] p-6 text-white shadow-[0_12px_30px_rgba(160,114,74,0.25)]"
              whileHover={{ scale: 1.02 }}
              transition={transition}
            >
              <p className="text-sm uppercase tracking-[0.28em] text-[#F4E7D9]">VIP Member</p>
              <p className="mt-3 text-lg font-semibold">รับสิทธิพิเศษ</p>
              <p className="mt-2 text-sm text-[#E7D7C9]">สะสมคะแนนเพื่อรับของขวัญ</p>
              <button className="mt-4 w-full rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30">
                ดูรายละเอียด
              </button>
            </motion.div>
          </motion.aside>

          {/* Content Area */}
          <motion.div
            className="space-y-8"
            initial={reduceMotion ? false : { x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ...transition, delay: 0.25 }}
          >
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={transition}
                  className="space-y-8"
                >
                  <div className="rounded-[2rem] bg-white p-10 shadow-[0_12px_30px_rgba(61,43,31,0.08)]">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-semibold text-[#3D2B1F]">ออเดอร์ล่าสุด</h2>
                      <button onClick={() => setActiveTab('orders')} className="text-sm font-medium text-[#A0724A] hover:text-[#3D2B1F] transition">ดูทั้งหมด</button>
                    </div>
                    <div className="space-y-4">
                      {history.slice(0, 2).map((purchase, index) => (
                        <motion.div
                          key={purchase.id}
                          className="rounded-3xl border border-[#E8E1DF] p-6 transition hover:border-[#A0724A] hover:shadow-md"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3ECEA]">
                                <span className="material-symbols-outlined text-[#A0724A]">receipt_long</span>
                              </div>
                              <div>
                                <p className="font-semibold text-[#3D2B1F]">{purchase.id}</p>
                                <p className="text-sm text-[#81756e]">{purchase.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-[#81756e]">ยอดรวม</p>
                              <p className="text-lg font-semibold text-[#A0724A]">{purchase.total}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="rounded-[2rem] bg-white p-8 shadow-[0_12px_30px_rgba(61,43,31,0.08)]">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-[#3D2B1F]">ที่อยู่จัดส่งเริ่มต้น</h3>
                        <button onClick={() => setActiveTab('profile')} className="text-sm text-[#A0724A] hover:text-[#3D2B1F]">แก้ไข</button>
                      </div>
                      <div className="rounded-2xl bg-[#F8F3EB] p-5">
                        <p className="font-medium text-[#3D2B1F] mb-1">{user.name}</p>
                        <p className="text-sm text-[#81756e] leading-relaxed">{user.address}</p>
                        <p className="text-sm text-[#81756e] mt-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">call</span> {user.phone}
                        </p>
                      </div>
                    </div>
                    
                    <div className="rounded-[2rem] bg-white p-8 shadow-[0_12px_30px_rgba(61,43,31,0.08)]">
                      <h3 className="text-lg font-semibold text-[#3D2B1F] mb-6">การแจ้งเตือนล่าสุด</h3>
                      <div className="space-y-4">
                        <div className="flex gap-3 items-start">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3ECEA] flex-shrink-0">
                            <span className="material-symbols-outlined text-[16px] text-[#A0724A]">local_shipping</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#3D2B1F]">ออเดอร์ #ORD-001 จัดส่งแล้ว</p>
                            <p className="text-xs text-[#81756e] mt-0.5">2 ชั่วโมงที่แล้ว</p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF3DE] flex-shrink-0">
                            <span className="material-symbols-outlined text-[16px] text-[#4A7C59]">redeem</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#3D2B1F]">คุณได้รับโค้ดส่วนลด 10%</p>
                            <p className="text-xs text-[#81756e] mt-0.5">เมื่อวานนี้</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={transition}
                  className="rounded-[2rem] bg-white p-10 shadow-[0_12px_30px_rgba(61,43,31,0.08)]"
                >
                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">ข้อมูลส่วนตัว</h2>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {[
                      { label: 'ชื่อ-นามสกุล', value: user.name, icon: 'badge' },
                      { label: 'อีเมล', value: user.email, icon: 'email' },
                      { label: 'เบอร์โทรศัพท์', value: user.phone, icon: 'phone' },
                      { label: 'ที่อยู่', value: user.address, icon: 'location_on' },
                    ].map((field) => (
                      <motion.div
                        key={field.label}
                        className="rounded-3xl bg-[#F8F3EB] p-6 transition hover:bg-[#F3ECEA]"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#A0724A]">{field.icon}</span>
                          <p className="text-sm text-[#81756e]">{field.label}</p>
                        </div>
                        <p className="mt-3 text-lg font-medium text-[#3D2B1F]">{field.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={transition}
                  className="rounded-[2rem] bg-white p-10 shadow-[0_12px_30px_rgba(61,43,31,0.08)]"
                >
                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">ประวัติการสั่งซื้อ</h2>
                  <div className="mt-8 space-y-4">
                    {history.map((purchase, index) => (
                      <motion.div
                        key={purchase.id}
                        className="rounded-3xl border border-[#E8E1DF] p-6 transition hover:border-[#A0724A] hover:shadow-md"
                        initial={reduceMotion ? false : { y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ ...transition, delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3ECEA]">
                              <span className="material-symbols-outlined text-[#A0724A]">receipt_long</span>
                            </div>
                            <div>
                              <p className="font-semibold text-[#3D2B1F]">{purchase.id}</p>
                              <p className="text-sm text-[#81756e]">{purchase.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-[#81756e]">ยอดรวม</p>
                            <p className="text-lg font-semibold text-[#A0724A]">{purchase.total}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="inline-flex rounded-full bg-[#F3ECEA] px-3 py-1 text-xs font-semibold text-[#3D2B1F]">
                            {purchase.status}
                          </span>
                          <button className="text-sm font-medium text-[#A0724A] hover:text-[#3D2B1F] transition">
                            ดูรายละเอียด
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={transition}
                  className="rounded-[2rem] bg-white p-10 shadow-[0_12px_30px_rgba(61,43,31,0.08)]"
                >
                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">การตั้งค่า</h2>
                  <div className="mt-8 space-y-6">
                    {[
                      { label: 'การแจ้งเตือน', value: 'เปิดใช้งาน', icon: 'notifications' },
                      { label: 'ภาษา', value: 'ไทย', icon: 'language' },
                      { label: 'การจัดส่ง', value: 'มาตรฐาน', icon: 'local_shipping' },
                      { label: 'ความเป็นส่วนตัว', value: 'สาธารณะ', icon: 'lock' },
                    ].map((setting) => (
                      <motion.div
                        key={setting.label}
                        className="flex items-center justify-between rounded-3xl bg-[#F8F3EB] p-6 transition hover:bg-[#F3ECEA]"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center gap-4">
                          <span className="material-symbols-outlined text-[#A0724A]">{setting.icon}</span>
                          <div>
                            <p className="text-sm text-[#81756e]">{setting.label}</p>
                            <p className="mt-1 text-lg text-[#3D2B1F]">{setting.value}</p>
                          </div>
                        </div>
                        <button className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#A0724A] transition hover:bg-[#F3ECEA]">
                          เปลี่ยน
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={transition}
                  className="rounded-[2rem] bg-white p-10 shadow-[0_12px_30px_rgba(61,43,31,0.08)]"
                >
                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">รายการโปรด</h2>
                  <div className="mt-8 text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-[#D2C4BC]">favorite_border</span>
                    <p className="mt-4 text-[#81756e]">ยังไม่มีรายการโปรด</p>
                    <button className="mt-4 rounded-2xl bg-[#3D2B1F] px-6 py-3 text-white hover:opacity-90 transition">
                      เริ่มช้อปปิ้ง
                    </button>
                  </div>
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

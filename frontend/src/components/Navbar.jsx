import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import ClickSparkButton from './ClickSparkButton'
import { homePageData } from '../data/homePageData'
import { useCart, useAuth } from '../contexts'
import { getNotifications, markAsRead, markAllAsRead } from '../services/notification'

const MotionLink = motion(Link)

const Navbar = () => {
  const reduceMotion = useReducedMotion()
  const location = useLocation()
  const { totalItems } = useCart()
  const { user, logout, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState([])
  const transition = { duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications()
    }
  }, [isAuthenticated])

  const loadNotifications = async () => {
    try {
      const data = await getNotifications()
      setNotifications(data)
    } catch (err) {
      console.error('Failed to load notifications', err)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id)
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    } catch (err) {
      console.error(err)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  
  const isActive = (href) => href === location.pathname

  return (
    <motion.nav
      className="sticky top-0 z-50 border-b border-[#E8E1DF] bg-[#FAF6F1]/90 backdrop-blur-sm shadow-sm"
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      <div className="mx-auto flex max-w-[1700px] items-center justify-between px-12 py-4">
        <Link to="/" className="flex items-center gap-1 cursor-pointer shrink-0 group relative">
          <div className="relative w-12 h-12 xl:w-14 xl:h-14 bg-[#A0724A] rounded-xl flex items-center justify-center shadow-lg shadow-[#A0724A]/30 overflow-hidden transition-all duration-700 group-hover:scale-110 group-hover:rotate-[10deg] group-hover:shadow-[#A0724A]/50">
            <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative text-white font-bold text-2xl xl:text-3xl italic leading-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-[10deg]">
              U
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl xl:text-3xl font-black tracking-tighter text-[#3D2B1F] uppercase transition-all duration-500 group-hover:tracking-widest group-hover:translate-x-1">
              dee
            </span>
            <div className="h-[2px] w-0 bg-[#A0724A] transition-all duration-500 group-hover:w-full rounded-full" />
          </div>
        </Link>

        <div className="hidden md:flex gap-8">
          {homePageData.navLinks.map((link) => (
            <div key={link.label}>
              {link.href.startsWith('/') ? (
                <MotionLink
                  to={link.href}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`inline-flex items-center gap-2 font-medium ${isActive(link.href) ? 'border-b-2 border-[#A0724A] pb-1 text-[#3D2B1F]' : 'text-[#5a4e46] hover:text-[#A0724A]'}`}
                >
                  {link.icon && <span className="material-symbols-outlined text-base text-[#A0724A]">{link.icon}</span>}
                  {link.label}
                </MotionLink>
              ) : (
                <motion.a
                  href={link.href}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`inline-flex items-center gap-2 font-medium ${isActive(link.href) ? 'border-b-2 border-[#A0724A] pb-1 text-[#3D2B1F]' : 'text-[#5a4e46] hover:text-[#A0724A]'}`}
                >
                  {link.icon && <span className="material-symbols-outlined text-base text-[#A0724A]">{link.icon}</span>}
                  {link.label}
                </motion.a>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="p-2 text-[#5a4e46] hover:text-[#3D2B1F] transition-transform"
          >
            <span className="material-symbols-outlined">search</span>
          </motion.button>
          
          {/* Notifications */}
          <div className="relative group">
            <motion.button
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="p-2 text-[#5a4e46] hover:text-[#3D2B1F] transition-transform relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 border-2 border-white text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </motion.button>
            
            <div className="absolute top-full right-0 mt-1 w-80 rounded-xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#E8E1DF] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col z-50 origin-top-right scale-95 group-hover:scale-100 overflow-hidden">
               <div className="px-4 py-3 border-b border-[#E8E1DF] flex justify-between items-center bg-[#FAF6F1]">
                 <span className="font-semibold text-sm text-[#3D2B1F]">การแจ้งเตือน</span>
                 {unreadCount > 0 && (
                   <span onClick={handleMarkAllAsRead} className="text-xs text-[#A0724A] cursor-pointer hover:underline">ทำเครื่องหมายอ่านแล้ว</span>
                 )}
               </div>
               <div className="max-h-[300px] overflow-y-auto">
                 {notifications.length === 0 ? (
                   <div className="px-4 py-6 text-center text-[#9CA3AF] text-sm">ไม่มีการแจ้งเตือนใหม่</div>
                 ) : (
                   notifications.map(notif => (
                     <div 
                       key={notif.id} 
                       onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                       className={`px-4 py-3 border-b border-[#E8E1DF] hover:bg-[#FAF6F1] cursor-pointer transition ${!notif.isRead ? 'bg-orange-50/30' : ''}`}
                     >
                       <p className={`text-sm ${!notif.isRead ? 'font-semibold text-[#3D2B1F]' : 'text-[#5a4e46]'}`}>
                         {notif.title}
                       </p>
                       <p className="text-xs text-[#5a4e46] mt-0.5 line-clamp-2">{notif.message}</p>
                       <p className="text-[10px] text-[#A0724A] mt-1">
                         {new Date(notif.createdAt).toLocaleString('th-TH')}
                       </p>
                     </div>
                   ))
                 )}
               </div>
            </div>
          </div>

          <motion.div whileHover={{ y: -2, scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/cart" className="relative p-2 text-[#5a4e46] hover:text-[#3D2B1F] transition-transform active:scale-95">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="absolute top-0 right-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#A0724A] text-[10px] text-white font-bold">
                {totalItems || 0}
              </span>
            </Link>
          </motion.div>
          {isAuthenticated ? (
            <div className="relative group hidden md:block">
              {/* Profile Trigger */}
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3D2B1F] cursor-pointer hover:text-[#A0724A] transition py-2">
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
                <span>{user?.name || 'บัญชี'}</span>
                <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:rotate-180">expand_more</span>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-1 w-48 rounded-xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#E8E1DF] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-2 z-50 origin-top-right scale-95 group-hover:scale-100">
                {['ADMIN', 'MANAGER'].includes(user?.role) && (
                  <Link 
                    to="/admin-dashboard" 
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-[#3D2B1F] hover:bg-[#FAF6F1] transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#A0724A]">dashboard</span>
                      <span className="font-medium">Dashboard</span>
                    </div>
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm ${user?.role === 'ADMIN' ? 'bg-red-500' : 'bg-orange-500'}`}>
                      {user?.role === 'ADMIN' ? 'Admin' : 'Mgr'}
                    </span>
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#3D2B1F] hover:bg-[#FAF6F1] transition"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#A0724A]">person</span>
                  <span className="font-medium">บัญชีของฉัน</span>
                </Link>
                
                <div className="h-px bg-[#E8E1DF] my-1.5 mx-3" />
                
                <button 
                  onClick={logout} 
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#BA1A1A] hover:bg-[#FFF0F0] transition w-full text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span className="font-medium">ออกจากระบบ</span>
                </button>
              </div>
            </div>

          ) : (
            <motion.div whileHover={{ y: -2, scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <ClickSparkButton
                as="link"
                to="/login"
                className="hidden md:inline-flex items-center justify-center rounded-lg border border-[#3D2B1F] bg-white px-5 py-2 text-sm font-medium text-[#3D2B1F] hover:bg-[#3D2B1F] hover:text-white transition-all"
              >
                Login
              </ClickSparkButton>
            </motion.div>
          )}
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="md:hidden p-2 text-[#3D2B1F]">
            <span className="material-symbols-outlined">menu</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar

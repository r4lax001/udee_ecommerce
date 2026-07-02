import { Link, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import ClickSparkButton from './ClickSparkButton'
import { homePageData } from '../data/homePageData'

const MotionLink = motion(Link)

const Navbar = () => {
  const reduceMotion = useReducedMotion()
  const location = useLocation()
  const transition = { duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }

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
          <motion.div whileHover={{ y: -2, scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/cart" className="relative p-2 text-[#5a4e46] hover:text-[#3D2B1F] transition-transform active:scale-95">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="absolute top-0 right-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#A0724A] text-[10px] text-white font-bold">
                ?
              </span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2, scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <ClickSparkButton
              as="link"
              to="/auth"
              className="hidden md:inline-flex items-center justify-center rounded-lg border border-[#3D2B1F] bg-white px-5 py-2 text-sm font-medium text-[#3D2B1F] hover:bg-[#3D2B1F] hover:text-white transition-all"
            >
              Login
            </ClickSparkButton>
          </motion.div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="md:hidden p-2 text-[#3D2B1F]">
            <span className="material-symbols-outlined">menu</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar

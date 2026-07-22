import { Outlet, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ClickSparkOverlay from '../components/ClickSparkOverlay'

const AppLayout = () => {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }

  return (
    <div className="min-h-screen w-[100%] bg-[#FAF6F1] text-[#1D1B1A]">
      <ClickSparkOverlay />
      <Navbar />

      <div className="flex min-h-[calc(100vh-180px)] flex-col">
        <motion.div
          key={location.pathname}
          className="flex-1 mx-auto w-[100%]  "
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? {} : { opacity: 0, y: -8 }}
          transition={transition}
        >
          <Outlet />
        </motion.div>

        <Footer />
      </div>
    </div>
  )
}

export default AppLayout

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import ClickSparkButton from '../components/ClickSparkButton'
import { homePageData } from '../data/homePageData'

const HomePage = ({
  hero = homePageData.hero,
  stats = homePageData.stats,
  categories = homePageData.categories,
  recommendedProducts = homePageData.recommendedProducts,
}) => {
  const reduceMotion = useReducedMotion()
  const [loadedImages, setLoadedImages] = useState({})
  const transition = { duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }

  const handleImageLoad = (key) => {
    setLoadedImages(prev => ({ ...prev, [key]: true }))
  }

  return (

    <motion.main
      className="bg-[#FAF6F1]  text-[#1D1B1A] overflow-x-hidden"
      style={{ fontFamily: 'Kanit, Inter, Prompt, Mitr, sans-serif' }}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      <motion.section
        className="w-full max-w-[1400px] mx-auto grid gap-16 px-6 py-16 md:grid-cols-2 md:items-center lg:px-16 xl:px-5"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition, delay: 0.04 }}
      >
        <div className="space-y-6">
          <motion.span
            className="inline-flex rounded-[10px] bg-[#C8A882] px-4 py-1 text-xs font-medium uppercase tracking-widest text-[#ffffff]"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.06 }}
          >
            {hero.badge}
          </motion.span>
          <motion.h1
            className="text-4xl font-semibold leading-tight text-[#3D2B1F] md:text-7xl font-Mitr "
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.08 }}
          >
            {hero.heading}
          </motion.h1>
          <motion.div
            className="h-1 w-10 bg-[#A0724A]"
            initial={reduceMotion ? false : { width: 0, opacity: 0 }}
            animate={{ width: 40, opacity: 1 }}
            transition={{ ...transition, delay: 0.1 }}
          />
          <motion.p
            className="max-w-xl text-base leading-7 text-[#5a4e46] md:text-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.12 }}
          >
            {hero.description}
          </motion.p>
          <motion.div className="flex flex-wrap gap-4 pt-2" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.14 }}>
            <ClickSparkButton whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }} className="rounded-2xl bg-[#3D2B1F] px-8 py-3 text-sm font-semibold text-white transition">
              {hero.primaryCta}
            </ClickSparkButton>
            <ClickSparkButton whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }} className="rounded-2xl border border-[#3D2B1F] px-8 py-3 text-sm font-semibold text-[#3D2B1F] hover:bg-[#3D2B1F]/10 transition">
              {hero.secondaryCta}
            </ClickSparkButton>
          </motion.div>

          <div className="flex flex-wrap gap-12 pt-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition, delay: 0.16 + index * 0.04 }}
              >
                <p className="text-3xl font-semibold text-[#3D2B1F]">{stat.value}</p>
                <p className="text-sm text-[#5a4e46]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="relative"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...transition, delay: 0.08 }}
        >
          <motion.div
            className="absolute -left-4 -top-4 z-10 rounded-3xl mx-16 bg-[#A0724A] px-4 py-4 text-sm font-bold text-[#ffffff]"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.8, y: -20 }}
            animate={reduceMotion ? {} : { y: [0, -3, 0], opacity: 1, scale: 1 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {hero.promoText}
          </motion.div>
          <Tilt
            tiltMaxAngleX={8}
            tiltMaxAngleY={8}
            transitionSpeed={260}
            scale={1.02}
            tiltReverse={true}
            glareEnable={false}
            className="overflow-hidden rounded-[2rem] bg-[#FAF6F1]"
          >
            <motion.div
              className="overflow-hidden rounded-[2rem]"
              whileHover={reduceMotion ? {} : { scale: 1.01, y: -2 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className='w-full max-w-[600px] h-[420px] sm:h-[500px] mx-auto rounded-[2rem] overflow-hidden'>
                <img 
                  src={hero.image} 
                  alt="Hero product" 
                  className={`h-full w-full object-cover transition-opacity duration-300 ${loadedImages['hero'] ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => handleImageLoad('hero')}
                />
                {!loadedImages['hero'] && (
                  <div className="absolute inset-0 bg-[#F2EBE2] animate-pulse" />
                )}
              </div>
            </motion.div>
          </Tilt>
        </motion.div>
      </motion.section>

      <section className="bg-[#F2EBE2] py-24">
        <div className="max-w-[1400px] font-mitr mx-auto px-6">
          <motion.div
            className="mb-10 mx-auto text-center"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={transition}
          >
            <motion.h2
              className="text-6xl font-semibold text-[#3D2B1F] tracking-tight mb-4"
              initial={reduceMotion ? false : { width: 0, opacity: 0, y: 0 }}
              whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, width: 'auto', y: [0, -10, 0] }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...transition, delay: 0.1, duration: 1.6 }}
            >
              เลือกตามประเภท
            </motion.h2>
            <motion.div
              className="h-1 w-24 bg-gradient-to-r from-[#A0724A] to-[#C8A882] mx-auto"
              initial={reduceMotion ? false : { width: 0, opacity: 0 }}
              whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, width: 96 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...transition, delay: 0.2 }}
            />
          </motion.div>
          <div className="grid gap-6 py-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <motion.article
                key={category.title}
                className="overflow-hidden rounded-3xl bg-white border border-transparent shadow-[0_12px_30px_rgba(61,43,31,0.06)] transition-all duration-500 group cursor-pointer perspective hover:border-[#A0724A] hover:shadow-[0_18px_40px_rgba(61,43,31,0.16)]"
                role="article"
                aria-label={`${category.title}, ${category.subtitle}`}
                initial={reduceMotion ? false : { opacity: 0, y: 24, rotateX: 10 }}
                whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ ...transition, delay: index * 0.05 }}
                whileHover={reduceMotion ? {} : { y: -14, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={category.image}
                    alt={category.title}
                    className={`h-full w-full object-cover transition-opacity duration-300 ${loadedImages[`category-${category.title}`] ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => handleImageLoad(`category-${category.title}`)}
                    whileHover={reduceMotion ? {} : { scale: 1.12 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/20 to-transparent opacity-0 transition-opacity duration-500"
                    whileHover={reduceMotion ? {} : { opacity: 1 }}
                  />
                  {!loadedImages[`category-${category.title}`] && (
                    <div className="absolute inset-0 bg-[#F2EBE2] animate-pulse" />
                  )}
                </div>
                <div className="flex items-end justify-between gap-4 p-6">
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ ...transition, delay: index * 0.05 + 0.1 }}
                  >
                    <h3 className="text-xl font-semibold text-[#3D2B1F] group-hover:text-[#A0724A] transition-colors">{category.title}</h3>
                    <p className="text-sm text-[#5a4e46]">{category.subtitle}</p>
                  </motion.div>
                  <motion.a
                    href={category.href}
                    className="text-[#A0724A] font-medium flex items-center gap-1 whitespace-nowrap"
                    whileHover={reduceMotion ? {} : { x: 4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span>ดูทั้งหมด</span>
                    <motion.span
                      className="inline-block"
                      initial={reduceMotion ? false : { x: 0 }}
                      whileHover={reduceMotion ? {} : { x: 4 }}
                      transition={{ duration: 0.3 }}
                    >
                      →
                    </motion.span>
                  </motion.a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FAF6F1] py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            className="mb-10"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={transition}
          >
            <motion.h2
              className="text-4xl font-semibold text-[#3D2B1F] tracking-tight mb-3"
              initial={reduceMotion ? false : { width: 0, opacity: 0 }}
              whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, width: 'auto' }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...transition, delay: 0.1 }}
            >
              สินค้าแนะนำ
            </motion.h2>
            <motion.div
              className="h-1 w-20 bg-gradient-to-r from-[#A0724A] to-[#C8A882]"
              initial={reduceMotion ? false : { width: 0, opacity: 0 }}
              whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, width: 80 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...transition, delay: 0.2 }}
            />
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {recommendedProducts.map((product, index) => (
              <motion.article
                key={product.id}
                className="group overflow-hidden rounded-3xl bg-white cursor-pointer perspective shadow-sm transition-all duration-500 hover:shadow-xl hover:border hover:border-[#A0724A]"
                role="article"
                aria-label={`${product.name}, ราคา ${product.price}, คะแนน ${product.rating} จาก ${product.reviews} รีวิว`}
                initial={reduceMotion ? false : { opacity: 0, y: 24, rotateX: 10 }}
                whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ ...transition, delay: index * 0.05 }}
                whileHover={reduceMotion ? {} : { y: -16, scale: 1.05, rotateX: 0 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="relative h-48 overflow-hidden bg-[#F2EBE2]">
                  {product.badge && (
                    <motion.span
                      className="absolute top-3 left-3 z-10 bg-[#A0724A] text-white text-xs font-semibold px-3 py-1 rounded-full"
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: -10 }}
                      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ ...transition, delay: index * 0.05 + 0.1 }}
                    >
                      {product.badge}
                    </motion.span>
                  )}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/20 to-transparent z-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  />
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className={`h-full w-full object-cover transition-opacity duration-300 ${loadedImages[`product-${product.id}`] ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => handleImageLoad(`product-${product.id}`)}
                    whileHover={reduceMotion ? {} : { scale: 1.1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                  {!loadedImages[`product-${product.id}`] && (
                    <div className="absolute inset-0 bg-[#F2EBE2] animate-pulse" />
                  )}
                </div>
                <div className="p-5">
                  <motion.h3
                    className="text-lg font-semibold text-[#3D2B1F] mb-2 line-clamp-2 group-hover:text-[#A0724A] transition-colors"
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ ...transition, delay: index * 0.05 + 0.1 }}
                  >
                    {product.name}
                  </motion.h3>
                  <motion.div
                    className="flex items-center gap-1 mb-2"
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ ...transition, delay: index * 0.05 + 0.15 }}
                  >
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-[#5a4e46]">{product.rating}</span>
                    <span className="text-xs text-[#5a4e46]">({product.reviews})</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2"
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ ...transition, delay: index * 0.05 + 0.2 }}
                  >
                    <span className="text-lg font-bold text-[#3D2B1F]">{product.price}</span>
                    <motion.span
                      className="text-sm text-[#5a4e46] line-through"
                      initial={reduceMotion ? false : { opacity: 0 }}
                      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 0.7 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ ...transition, delay: index * 0.05 + 0.25 }}
                    >
                      {product.originalPrice}
                    </motion.span>
                  </motion.div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </motion.main>

  )
}

export default HomePage

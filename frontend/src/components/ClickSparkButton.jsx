import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MotionLink = motion(Link)
const MotionAnchor = motion.a
const MotionButton = motion.button

const ClickSparkButton = ({ children, className = '', as = 'button', to, href, onClick, ...props }) => {
  const [sparks, setSparks] = useState([])
  const buttonRef = useRef(null)

  const createSparks = (event) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const newSparks = Array.from({ length: 8 }, (_, index) => {
      const angle = Math.random() * Math.PI * 2
      const distance = 16 + Math.random() * 18
      const dx = Math.cos(angle) * distance
      const dy = Math.sin(angle) * distance
      const size = 5 + Math.random() * 5
      const colors = ['#F7E3C9', '#A0724A', '#F0C78B', '#E9D8C0']
      return {
        id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
        x,
        y,
        dx,
        dy,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: `${Math.random() * 360}deg`,
      }
    })

    setSparks((prev) => [...prev, ...newSparks])
    window.setTimeout(() => {
      setSparks((prev) => prev.filter((spark) => !newSparks.some((item) => item.id === spark.id)))
    }, 550)
  }

  const handleClick = (event) => {
    createSparks(event)
    if (onClick) onClick(event)
  }

  const sharedProps = {
    ref: buttonRef,
    onClick: handleClick,
    className: `relative overflow-hidden ${className}`,
    ...props,
  }

  const content = (
    <>
      <span className="relative z-10 inline-flex items-center justify-center w-full h-full">{children}</span>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {sparks.map((spark) => (
          <span
            key={spark.id}
            className="spark absolute rounded-full"
            style={{
              left: `${spark.x}px`,
              top: `${spark.y}px`,
              width: `${spark.size}px`,
              height: `${spark.size * 0.28}px`,
              backgroundColor: spark.color,
              '--dx': `${spark.dx}px`,
              '--dy': `${spark.dy}px`,
              '--rot': spark.rot,
            }}
          />
        ))}
      </div>
    </>
  )

  if (as === 'link') {
    return (
      <MotionLink to={to} {...sharedProps}>
        {content}
      </MotionLink>
    )
  }

  if (as === 'a') {
    return (
      <MotionAnchor href={href} {...sharedProps}>
        {content}
      </MotionAnchor>
    )
  }

  return (
    <MotionButton type="button" {...sharedProps}>
      {content}
    </MotionButton>
  )
}

export default ClickSparkButton

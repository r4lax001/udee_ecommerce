import { useEffect, useState } from 'react'

const ClickSparkOverlay = () => {
  const [sparks, setSparks] = useState([])

  useEffect(() => {
    const handleClick = (event) => {
      if (event.button !== 0) return
      const x = event.clientX
      const y = event.clientY
      const newSparks = Array.from({ length: 8 }, (_, index) => {
        const angle = Math.random() * Math.PI * 2
        const distance = 18 + Math.random() * 20
        const dx = Math.cos(angle) * distance
        const dy = Math.sin(angle) * distance
        const size = 4 + Math.random() * 6
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

    window.addEventListener('pointerdown', handleClick)
    return () => window.removeEventListener('pointerdown', handleClick)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
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
  )
}

export default ClickSparkOverlay

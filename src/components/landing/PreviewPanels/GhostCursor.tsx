import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { prefersReducedMotion } from '@/lib/reduceMotion'

interface GhostCursorProps {
  targets?: string[]
  containerRef?: React.RefObject<HTMLDivElement>
}

export function GhostCursor({ targets = [], containerRef }: GhostCursorProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isClicking, setIsClicking] = useState(false)
  const reducedMotion = prefersReducedMotion()
  const cursorRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)

  const springX = useSpring(x, { stiffness: 200, damping: 25 })
  const springY = useSpring(y, { stiffness: 200, damping: 25 })
  const springScale = useSpring(scale, { stiffness: 300, damping: 20 })

  const opacity = useTransform(springScale, [1, 1.4], [0.4, 0])

  useEffect(() => {
    if (reducedMotion || !containerRef?.current) {
      setIsVisible(false)
      return
    }

    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    setIsVisible(document.visibilityState === 'visible')

    const container = containerRef.current

    const moveToTarget = (targetIndex: number) => {
      if (!isVisible || !container) return

      const selector = targets[targetIndex % targets.length]
      if (!selector) return

      const element = container.querySelector(selector) as HTMLElement
      if (!element) return

      const rect = element.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      const targetX = rect.left + rect.width / 2 - containerRect.left
      const targetY = rect.top + rect.height / 2 - containerRect.top

      x.set(targetX)
      y.set(targetY)

      setTimeout(() => {
        setIsClicking(true)
        scale.set(1.4)
        setTimeout(() => {
          scale.set(1)
          setIsClicking(false)
        }, 200)
      }, 800)

      setTimeout(() => {
        moveToTarget((targetIndex + 1) % targets.length)
      }, 2500)
    }

    const start = () => {
      if (targets.length > 0) {
        moveToTarget(0)
      } else {
        const rect = container.getBoundingClientRect()
        x.set(rect.width / 2)
        y.set(rect.height / 2)
      }
    }

    start()

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [reducedMotion, containerRef, targets, isVisible, x, y, scale])

  if (reducedMotion || !isVisible) return null

  return (
    <motion.div
      ref={cursorRef}
      className="absolute pointer-events-none z-50"
      style={{
        x: springX,
        y: springY,
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 232, 255, 0.6)',
        boxShadow: '0 0 8px rgba(0, 232, 255, 0.4)',
      }}
    >
      {isClicking && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-accent"
          style={{
            scale: springScale,
            opacity,
          }}
        />
      )}
    </motion.div>
  )
}


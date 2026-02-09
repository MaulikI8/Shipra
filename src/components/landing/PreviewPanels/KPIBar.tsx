import { useEffect, useState, useRef } from 'react'
import { Package, ShoppingCart, Truck } from 'lucide-react'
import { prefersReducedMotion } from '@/lib/reduceMotion'

interface KPIItem {
  label: string
  value: number
  suffix?: string
  icon: typeof Package
}

interface KPIBarProps {
  values?: KPIItem[]
}

const defaultValues: KPIItem[] = [
  { label: 'Stock', value: 142, icon: Package },
  { label: 'POs', value: 8, icon: ShoppingCart },
  { label: 'SOs', value: 12, icon: Truck },
]

function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = prefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      setCount(end)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const duration = 1500
          const startTime = Date.now()

          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(end * easeOut))

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(end)
            }
          }

          animate()
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [end, reducedMotion, hasAnimated])

  return (
    <div ref={ref} className="text-lg font-semibold text-white/90">
      {count}
      {suffix}
    </div>
  )
}

export function KPIBar({ values = defaultValues }: KPIBarProps) {
  return (
    <div className="grid grid-cols-3 gap-2 p-3">
      {values.map((item, i) => {
        const Icon = item.icon
        return (
          <div
            key={i}
            className="bg-white/5 rounded-lg p-2.5 border border-white/5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="p-1 bg-accent/10 rounded text-accent">
                <Icon size={12} />
              </div>
            </div>
            <CountUp end={item.value} suffix={item.suffix} />
            <div className="text-[10px] text-white/60 mt-0.5">{item.label}</div>
          </div>
        )
      })}
    </div>
  )
}


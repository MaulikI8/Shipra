import { useRef } from 'react'
import { useScroll, useTransform, MotionValue } from 'framer-motion'
import { prefersReducedMotion } from '@/lib/reduceMotion'

interface UseParallaxDepthOptions {
  strength?: [number, number, number]
}

interface UseParallaxDepthReturn {
  ref: React.RefObject<HTMLDivElement>
  styleLayer1: { y: MotionValue<number> }
  styleLayer2: { y: MotionValue<number> }
  styleLayer3: { y: MotionValue<number> }
}

export function useParallaxDepth({
  strength = [-40, -20, -8],
}: UseParallaxDepthOptions = {}): UseParallaxDepthReturn {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = prefersReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reducedMotion ? 0 : strength[0]]
  )
  const y2 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reducedMotion ? 0 : strength[1]]
  )
  const y3 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reducedMotion ? 0 : strength[2]]
  )

  return {
    ref,
    styleLayer1: { y: y1 },
    styleLayer2: { y: y2 },
    styleLayer3: { y: y3 },
  }
}


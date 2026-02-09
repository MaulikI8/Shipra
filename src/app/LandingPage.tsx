import logo from '../assets/logo.png'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import {
  Warehouse,
  Package,
  Truck,
  PackageSearch,
  FileText,
  FileSpreadsheet,
  Check,
  ShoppingBag,
  CreditCard,
  MessageSquare,
  ArrowRight,
  Activity,
  Home,
  Layers,
  Globe,
  Cpu,
  Terminal,
  User,
  RefreshCw,
  ChevronDown
} from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { MagneticButton } from '../components/MagneticButton'
import { WarehouseGlobe } from '../components/WarehouseGlobe'

// --- Utilities ---

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// --- Constants & Variants ---

const easeOutExpo = [0.16, 1, 0.3, 1] as const
const pageVariants = {
  initial: { opacity: 0, y: 8, filter: 'blur(2px)' },
  animate: { opacity: 1, y: 0, filter: 'none', transition: { duration: 0.45, ease: easeOutExpo } },
  exit: { opacity: 0, y: 6, filter: 'blur(1px)', transition: { duration: 0.25 } },
}
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutExpo } } }

// --- Shared Components ---

function Container({ children, className, size = 'xl' }: { children: React.ReactNode; className?: string; size?: 'lg' | 'xl' }) {
  const maxWidth = size === 'lg' ? 'max-w-[960px]' : 'max-w-[1200px]'
  return <div className={cn('mx-auto px-6 md:px-8 w-full', maxWidth, className)}>{children}</div>
}

function Section({ children, className, bleed = false, id }: { children: React.ReactNode; className?: string; bleed?: boolean; id?: string }) {
  const sectionClasses = cn('relative', bleed ? '' : 'bg-[rgb(var(--bg))]', 'py-20 md:py-32 lg:py-40', className)
  return (
    <motion.section id={id} variants={fadeUp as any} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.1 }} className={sectionClasses}>
      {children}
    </motion.section>
  )
}

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative backdrop-blur-[var(--blur)] bg-[rgba(255,255,255,0.07)]',
        'border border-[color:rgba(255,255,255,0.10)] rounded-2xl',
        'shadow-[var(--shadow-1)] transition-all',
        'hover:shadow-[var(--shadow-2)] hover:-translate-y-[1px]',
        className
      )}
    >
      {children}
      <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,.06) 0%, rgba(255,255,255,0) 60%)' }} />
    </div>
  )
}

function GlowButton({
  variant = 'primary',
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'outline'; children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })
  const translateX = useTransform(springX, [-1, 1], [-8, 8])
  const translateY = useTransform(springY, [-1, 1], [-8, 8])

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion() || !ref.current || !isHovered) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) / (rect.width / 2)
    const deltaY = (e.clientY - centerY) / (rect.height / 2)
    x.set(deltaX)
    y.set(deltaY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  const baseClasses = 'inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] transition-all focus-visible:outline-none'
  const variantClasses: Record<string, string> = {
    primary: 'bg-[linear-gradient(180deg,#E31E24_0%,#FF4D4D_60%,#FF8080_100%)] text-white shadow-[0_0_24px_rgba(227,30,36,0.25)] hover:translate-y-[-2px] font-medium',
    ghost: 'bg-white/6 text-white hover:bg-white/10',
    outline: 'border border-white/20 text-white hover:bg-white/5 hover:border-accent/40',
  }

  return (
    <motion.button
      ref={ref}
      className={cn(baseClasses, variantClasses[variant], className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: prefersReducedMotion() ? 0 : (translateX as any), y: prefersReducedMotion() ? 0 : (translateY as any) } as any}
      whileHover={prefersReducedMotion() ? {} : { scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}

// --- Modern Dock Navigation ---

function FloatingDock() {
  const navigate = useNavigate()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const items = [
    { icon: Home, label: 'Home', id: 'home', targetId: '' },
    { icon: Layers, label: 'Features', id: 'features', targetId: 'features' },
    { icon: Globe, label: 'Map', id: 'map', targetId: 'map' },
    { icon: Cpu, label: 'Engine', id: 'sim', targetId: 'sim' },
    { icon: Terminal, label: 'API', id: 'api', targetId: 'api' },
  ]

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault()
    if (targetId === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        className="flex items-center gap-2 p-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl shadow-black/50"
      >
        {items.map((item, index) => {
          const isHovered = hoveredIndex === index
          return (
            <button
              key={index}
              onClick={(e) => handleNavClick(e, item.targetId)}
              className="relative group flex items-center justify-center"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.div
                className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-full transition-colors",
                  "hover:bg-white/10"
                )}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon size={20} className={cn("transition-colors", isHovered ? "text-accent" : "text-white/70")} />
              </motion.div>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -16, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 border border-white/10 text-[10px] text-white whitespace-nowrap backdrop-blur-md pointer-events-none"
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )
        })}

        <div className="w-px h-6 bg-white/10 mx-1" />

        <motion.button
          onClick={() => navigate('/login')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-black transition-colors"
        >
          <User size={20} />
        </motion.button>
      </motion.div>
    </div>
  )
}

function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = []
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 1.5 + 0.5,
      })
    }

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (!reduced) {
        particles.forEach((p) => {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0) p.x = canvas.width
          if (p.x > canvas.width) p.x = 0
          if (p.y < 0) p.y = canvas.height
          if (p.y > canvas.height) p.y = 0
          const alpha = Math.min(0.12 - p.size * 0.04, 0.12)
          ctx.fillStyle = `rgba(227, 30, 36, ${alpha})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        })
      }
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [reduced])

  const parallaxX = reduced ? 0 : (mousePos.x / (typeof window !== 'undefined' ? window.innerWidth : 1920) - 0.5) * 6
  const parallaxY = reduced ? 0 : (mousePos.y / (typeof window !== 'undefined' ? window.innerHeight : 1080) - 0.5) * 6 + scrollY * 0.05
  const parallaxX3 = reduced ? 0 : (mousePos.x / (typeof window !== 'undefined' ? window.innerWidth : 1920) - 0.5) * 12
  const parallaxY3 = reduced ? 0 : (mousePos.y / (typeof window !== 'undefined' ? window.innerHeight : 1080) - 0.5) * 12 + scrollY * 0.1

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(circle at ${30 + parallaxX}% ${20 + parallaxY}%, rgba(0, 232, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at ${70 + parallaxX}% ${80 + parallaxY}%, rgba(0, 170, 200, 0.12) 0%, transparent 50%)`,
          animation: reduced ? 'none' : 'aurora-drift 120s ease-in-out infinite alternate',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-100" style={{ display: reduced ? 'none' : 'block' }} />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'conic-gradient(from 200deg at 50% 50%, rgba(255,255,255,.06), transparent 70%)',
          filter: 'blur(40px)',
          transform: `translate(${parallaxX3}px, ${parallaxY3}px)`,
        }}
      />
      <style>{`
        @keyframes aurora-drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -15px) scale(1.05); }
          100% { transform: translate(-15px, 10px) scale(0.98); }
        }
      `}</style>
    </div>
  )
}

function AnimatedHeadline({ lines }: { lines: string[] }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentLine = lines[index]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < currentLine.length) {
          setText(currentLine.slice(0, text.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (text.length > 0) {
          setText(currentLine.slice(0, text.length - 1))
        } else {
          setIsDeleting(false)
          setIndex((prev) => (prev + 1) % lines.length)
        }
      }
    }, isDeleting ? 30 : 60)
    return () => clearTimeout(timeout)
  }, [text, isDeleting, index, lines])

  return (
    <span className="bg-clip-text text-transparent bg-[linear-gradient(180deg,#EAFBFF_0%,#FFFFFF_40%,#C2F8FF_100%)]">
      {text}
      <span className="inline-block w-[2px] h-[1em] bg-accent ml-1 animate-pulse align-middle" />
    </span>
  )
}

// --- Specific Features ---

function FloatingPanelStack() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = prefersReducedMotion()

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  // Mouse interaction logic
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    rotateY.set(((e.clientX - centerX) / rect.width) * 20)
    rotateX.set(((e.clientY - centerY) / rect.height) * -20)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  const springConfig = { stiffness: 300, damping: 30 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)

  const chartData = [
    { name: 'M', value: 45 }, { name: 'T', value: 62 },
    { name: 'W', value: 58 }, { name: 'T', value: 71 },
    { name: 'F', value: 65 },
  ]

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] md:h-full perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Back Panel */}
      <motion.div
        className="absolute top-[10%] left-[5%] w-[70%] h-[60%] z-[1]"
        style={{
          rotateX: reducedMotion ? 0 : useTransform(springRotateX, v => v * 0.5),
          rotateY: reducedMotion ? 0 : useTransform(springRotateY, v => v * 0.5),
          transformStyle: 'preserve-3d'
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="h-full p-4">
          <div className="flex gap-2 mb-4">
            {['Stock', 'POs', 'SOs'].map((l, i) => (
              <div key={i} className="bg-white/5 rounded p-2 flex-1">
                <div className="text-[10px] text-white/60">{l}</div>
                <div className="text-sm font-bold text-white">{(i + 1) * 12}</div>
              </div>
            ))}
          </div>
          <div className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line type="monotone" dataKey="value" stroke="#E31E24" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      {/* Middle Panel */}
      <motion.div
        className="absolute top-[25%] right-[5%] w-[60%] h-[50%] z-[2]"
        style={{
          rotateX: reducedMotion ? 0 : useTransform(springRotateX, v => v * 0.75),
          rotateY: reducedMotion ? 0 : useTransform(springRotateY, v => v * 0.75),
          transformStyle: 'preserve-3d'
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="h-full p-4 flex flex-col justify-center gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-2 bg-white/5 p-2 rounded">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <div className="h-2 w-20 bg-white/10 rounded" />
            </div>
          ))}
        </GlassCard>
      </motion.div>

      {/* Front Panel */}
      <motion.div
        className="absolute top-[45%] left-[15%] w-[75%] h-[40%] z-[3]"
        style={{
          rotateX: reducedMotion ? 0 : springRotateX,
          rotateY: reducedMotion ? 0 : springRotateY,
          transformStyle: 'preserve-3d'
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="h-full p-6 flex flex-col justify-center border-accent/30 shadow-[0_0_30px_rgba(227,30,36,0.15)]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-white/60">Order #SO-2024</span>
            <span className="text-xs text-accent font-bold">Processing</span>
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>
          <div className="mt-4 flex gap-4">
            <div className="flex items-center gap-2">
              <Check size={14} className="text-accent" />
              <span className="text-xs text-white/80">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} className="text-accent" />
              <span className="text-xs text-white/80">Allocated</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}

function Hero() {
  const navigate = useNavigate()
  const headlineLines = [
    'Ops that feel instant.',
    'Inventory that stays accurate.',
    'Shipping that just flows.',
    'Orders processed in seconds.',
    'Real-time tracking everywhere.',
  ]

  return (
    <Section bleed id="home">
      <Container>
        <motion.div variants={pageVariants} initial="initial" animate="animate" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative z-20">
              {/* Brand Logo - Abstract, minimal, top left of hero content since navbar is gone */}
              {/* Shipra Brand Logo */}
              <div className="mb-8 inline-flex items-center gap-3">
                <img src={logo} alt="Shipra Logo" className="h-[60px] w-[60px] object-contain rounded-full" />
              </div>

              <h1 className="text-[clamp(2.4rem,4.6vw,4.2rem)] leading-[1.05] tracking-[-0.01em] text-white/90 font-semibold min-h-[3.15em] lg:min-h-[auto]">
                <AnimatedHeadline lines={headlineLines} />
              </h1>
              <p className="mt-6 text-white/85 text-[17px] md:text-[18px] max-w-[48ch]">
                A spatial, keyboard-first OMS for modern B2B teams.
              </p>
              <p className="mt-3 text-white/80 text-[16px] md:text-[17px] max-w-[60ch]">
                Track orders, stock, and fulfillment across multiple warehouses — in real time.
              </p>
              <div className="mt-10 flex items-center gap-4 flex-wrap">
                <MagneticButton variant="primary" onClick={() => navigate('/register')}>
                  Start Free Trial
                </MagneticButton>
                <MagneticButton variant="ghost" className="border border-white/20 hover:border-accent/40" onClick={() => navigate('/login')}>
                  Sign In
                </MagneticButton>
              </div>
            </div>

            <div className="lg:col-span-7 relative z-10">
              <div className="relative h-[420px] md:h-[480px] lg:h-[560px]">
                <FloatingPanelStack />
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}

function GlobalInfrastructure() {
  const stats = [
    { label: 'Processed volume', value: '$2B+' },
    { label: 'Uptime SLA', value: '99.99%' },
    { label: 'Active SKUs', value: '15M+' },
    { label: 'Global warehouses', value: '140+' },
  ]

  // Mock warehouses for the landing page globe
  const demoWarehouses = [
    { id: 1, name: 'New York Hub', city: 'New York' },
    { id: 2, name: 'London Gateway', city: 'London' },
    { id: 3, name: 'Tokyo Distribution', city: 'Tokyo' },
    { id: 4, name: 'Sydney Port', city: 'Sydney' },
    { id: 5, name: 'Singapore Center', city: 'Singapore' },
    { id: 6, name: 'Dubai Logistics', city: 'Dubai' },
    { id: 7, name: 'Berlin Central', city: 'Berlin' },
    { id: 8, name: 'SF Bay Area', city: 'San Francisco' },
  ]

  return (
    <div className="w-full border-y border-white/5 bg-white/[0.02] py-16">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-white/90 mb-6">Global Scale, Local Speed</h2>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Our distributed network ensures your inventory is always close to your customers.
              Visualize your entire supply chain in real-time with our 3D command center.
            </p>

            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/50 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[400px] relative">
            <WarehouseGlobe warehouses={demoWarehouses} />
          </div>
        </div>
      </Container>
    </div>
  )
}

function FeatureBelt() {
  const items = [
    { icon: Warehouse, title: 'Multi-Warehouse', desc: 'Manage stock across sites with live availability.' },
    { icon: Package, title: 'PO → Receive', desc: 'Precise receiving with tolerances and audits.' },
    { icon: Truck, title: 'Allocation', desc: 'Clean handoffs from allocation to ship.' },
    { icon: PackageSearch, title: 'Real-time Stock', desc: 'Instant availability across channels.' },
  ]

  return (
    <Section id="features">
      <Container>
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-white/90 mb-4">What you get out of the box</h2>
          <p className="text-white/60">A complete operating system designed to replace disparate spreadsheets and legacy ERP modules.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((f, i) => (
            <GlassCard key={i} className="p-6 h-full group hover:bg-white/5">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-colors">
                  <f.icon size={24} />
                </div>
                <div>
                  <h3 className="text-white/90 font-medium mb-1.5">{f.title}</h3>
                  <p className="text-sm text-white/75 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function FeatureSpotlight() {
  const features = [
    {
      title: 'Smart Routing',
      desc: 'Automatically route orders to the nearest warehouse with available stock, minimizing shipping zones and delivery times.',
      icon: Layers,
      color: 'from-accent to-purple-500'
    },
    {
      title: 'Real-time Sync',
      desc: 'Inventory changes propagate to all connected channels in milliseconds, preventing overselling even during flash sales.',
      icon: RefreshCw,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Audit Trails',
      desc: 'Every single action—from stock adjustment to shipment—is immutably logged. Know exactly who did what and when.',
      icon: FileText,
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <Section>
      <Container>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="relative group">
              <div className={cn("absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl -m-0.5", f.color)} />
              <GlassCard className="h-full p-8 flex flex-col relative bg-[#0a0a0a]">
                <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 text-white shadow-lg", f.color)}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-white/60 leading-relaxed mb-6 flex-1">{f.desc}</p>

                {/* Micro-visualization */}
                <div className="h-24 rounded-lg bg-white/5 border border-white/5 overflow-hidden relative">
                  {i === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex gap-4 items-center">
                        <div className="w-8 h-8 rounded bg-white/10" />
                        <ArrowRight size={14} className="text-white/40" />
                        <div className="w-8 h-8 rounded bg-accent/20 border border-accent" />
                      </div>
                    </div>
                  )}
                  {i === 1 && (
                    <div className="absolute inset-0 p-4 flex items-end gap-1">
                      {[40, 60, 30, 70, 50, 80].map((h, idx) => (
                        <motion.div
                          key={idx}
                          className="flex-1 bg-white/20 rounded-t-sm"
                          initial={{ height: '20%' }}
                          whileInView={{ height: `${h}%` }}
                          transition={{ delay: idx * 0.1, duration: 0.5 }}
                        />
                      ))}
                    </div>
                  )}
                  {i === 2 && (
                    <div className="absolute inset-0 p-3 space-y-2">
                      {[1, 2, 3].map((l) => (
                        <div key={l} className="flex gap-2 items-center opacity-60">
                          <div className="w-2 h-2 rounded-full bg-white/40" />
                          <div className="h-2 w-full bg-white/10 rounded" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function AllocationSim() {
  const [demand, setDemand] = useState(45)
  const onHand = 65
  const allocated = Math.min(demand, onHand)
  const remaining = onHand - allocated
  const isShortfall = demand > onHand
  const shortfall = isShortfall ? demand - onHand : 0

  return (
    <Section id="sim">
      <Container>
        <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="max-w-[820px] mx-auto">
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white/90">Interactive Allocation Engine</h3>
              {isShortfall && (
                <span className="text-xs font-medium text-red-400 bg-red-400/10 px-3 py-1 rounded-full">
                  Shortfall: {shortfall} units
                </span>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2 text-sm text-white/80">
                  <label>Customer Demand</label>
                  <span className={cn(isShortfall && "text-red-400")}>{demand} Units</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={demand}
                  onChange={(e) => setDemand(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                  style={{
                    background: isShortfall
                      ? `linear-gradient(to right, rgba(0,232,255,0.3) 0%, rgba(0,232,255,0.3) ${(onHand / 100) * 100}%, rgba(239,68,68,0.3) ${(onHand / 100) * 100}%, rgba(239,68,68,0.3) ${demand}%, rgba(255,255,255,0.1) ${demand}%, rgba(255,255,255,0.1) 100%)`
                      : `linear-gradient(to right, rgba(0,232,255,0.3) 0%, rgba(0,232,255,0.3) ${demand}%, rgba(255,255,255,0.1) ${demand}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                <div className="flex justify-between mt-1 text-[10px] text-white/40">
                  <span>0</span>
                  <span className="text-accent">Stock: {onHand}</span>
                  <span>100</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2 text-sm text-white/80">
                  <label>Warehouse Allocation</label>
                  <span>{allocated} / {onHand} Units</span>
                </div>
                <div className="h-10 bg-white/10 rounded-lg overflow-hidden flex relative">
                  <motion.div
                    className="h-full bg-accent flex items-center justify-center text-slate-900 font-bold text-xs"
                    animate={{ width: `${(allocated / onHand) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  >
                    {allocated > 0 && `Allocated: ${allocated}`}
                  </motion.div>
                  {remaining > 0 && (
                    <motion.div
                      className="h-full bg-white/5 flex items-center justify-center text-white/50 text-xs"
                      animate={{ width: `${(remaining / onHand) * 100}%` }}
                      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    >
                      Free: {remaining}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-white/60">
              Drag the slider to simulate how our engine prioritizes and locks inventory in real-time.
              {isShortfall && (
                <span className="block mt-2 text-red-400/80">
                  ⚠️ Demand exceeds available stock — allocation capped at {onHand} units
                </span>
              )}
            </p>
          </GlassCard>
        </motion.div>
      </Container>
    </Section>
  )
}



function IntegrationsGrid() {
  const integrations = [
    { name: 'Shopify', icon: ShoppingBag },
    { name: 'Slack', icon: MessageSquare },
    { name: 'Netsuite', icon: Layers },
    { name: 'Stripe', icon: CreditCard },
    { name: 'Github', icon: Activity },
    { name: 'Quickbooks', icon: FileSpreadsheet },
  ]

  return (
    <Section>
      <Container>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-white mb-4">Plays nice with others</h2>
            <p className="text-white/60 text-lg mb-8">
              Connect your entire stack with one click. We maintain the integrations so you don't have to build them.
            </p>
            <div className="space-y-4">
              {['Bi-directional sync', 'Webhooks for everything', 'Custom field mapping'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <Check size={14} className="text-accent" />
                  </div>
                  <span className="text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="grid grid-cols-3 gap-4">
              {integrations.map((item, i) => (
                <motion.div
                  key={i}
                  className="aspect-square rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/10 hover:border-white/10 transition-colors"
                  whileHover={{ y: -5 }}
                >
                  <item.icon size={24} className="text-white/70" />
                  <span className="text-xs text-white/50">{item.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

function Testimonials() {
  const reviews = [
    { name: 'Sarah J.', role: 'Ops Lead', text: "We cut our fulfillment time by 60% in the first week. The keyboard shortcuts are a lifesaver." },
    { name: 'Mike T.', role: 'CTO', text: "The API is a joy to work with. Webhooks actually arrive on time." },
    { name: 'Elena R.', role: 'Founder', text: "Finally an OMS that doesn't feel like it was built in the 90s. Beautiful and fast." },
    { name: 'David K.', role: 'Logistics Mgr', text: "Multi-warehouse routing saved us $50k in shipping costs last quarter alone." }
  ]

  return (
    <Section className="overflow-hidden">
      <Container>
        <h2 className="text-3xl font-bold text-white text-center mb-16">Loved by fast-moving teams</h2>
        <div className="flex gap-6 overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...reviews, ...reviews, ...reviews].map((r, i) => (
              <GlassCard key={i} className="w-[350px] p-6 flex-shrink-0">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <div key={s} className="w-4 h-4 text-accent fill-accent">★</div>)}
                </div>
                <p className="text-white/80 mb-6 text-lg">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-medium">{r.name}</div>
                    <div className="text-white/40 text-sm">{r.role}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}

function DevAPI() {
  const [activeTab, setActiveTab] = useState<'json' | 'curl'>('json')
  const defaultJson = `{
                "sku": "SKU-3001",
              "qty": 5,
              "warehouse": "Dallas",
              "strategy": "fifo"
}`

  return (
    <Section id="api">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="text-3xl font-bold text-white mb-4">Everything is an API.</h3>
            <p className="text-white/70 mb-8">
              Allocate inventory between warehouses in a single call. Webhooks notify on receive, allocate, and ship.
            </p>

            <ul className="space-y-4">
              {['Idempotent requests', 'Signed webhooks', '99.99% Uptime SLA'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-white/80">
                  <Check size={16} className="text-accent" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <GlassCard className="p-0 overflow-hidden h-full min-h-[400px]">
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab('json')}
                className={cn("px-4 py-2 text-xs font-mono border-r border-white/10 hover:bg-white/5", activeTab === 'json' ? 'text-accent bg-white/5' : 'text-white/50')}
              >
                payload.json
              </button>
              <button
                onClick={() => setActiveTab('curl')}
                className={cn("px-4 py-2 text-xs font-mono hover:bg-white/5", activeTab === 'curl' ? 'text-accent bg-white/5' : 'text-white/50')}
              >
                terminal
              </button>
            </div>
            <div className="p-6 bg-[#0c0c0c] font-mono text-xs overflow-x-auto h-full">
              {activeTab === 'json' ? (
                <pre className="text-white/80 transition-all duration-300">
                  {defaultJson}
                </pre>
              ) : (
                <pre className="text-white/80">
                  {`curl -X POST api.platform.com/v1/alloc \\
  -H "Authorization: Bearer sk_live_..." \\
  -d @payload.json`}
                </pre>
              )}
            </div>
          </GlassCard>
        </div>
      </Container>
    </Section>
  )
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { q: "Do you support multiple currencies?", a: "Yes, we handle automatic conversion based on daily spot rates." },
    { q: "How fast is the sync with Shopify?", a: "We use webhooks to ensure near-instant updates (typically <200ms)." },
    { q: "Can I bring my own carrier accounts?", a: "Absolutely. Connect FedEx, UPS, DHL, or regional carriers directly." },
    { q: "Is there a limit on SKUs?", a: "Our infrastructure scales to millions of SKUs without performance degradation." }
  ]

  return (
    <Section>
      <Container className="max-w-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <GlassCard key={i} className="p-0 overflow-hidden cursor-pointer">
              <div
                className="p-6 flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium text-white/90">{f.q}</span>
                <ChevronDown size={20} className={cn("text-white/50 transition-transform", openIndex === i ? "rotate-180" : "")} />
              </div>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-white/60 text-sm leading-relaxed">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function FinalCTA() {
  const navigate = useNavigate()

  const handleBookDemo = () => {
    // For now, show an alert. In production, this could open a modal or redirect to a booking page
    alert('Demo booking coming soon! For now, please sign up for a free trial to get started.')
  }

  return (
    <Section className="py-24">
      <Container>
        <div className="relative rounded-3xl overflow-hidden p-12 md:p-24 text-center">
          <div className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-transparent" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to scale without the chaos?</h2>
            <p className="text-lg text-white/60 mb-10">Join 500+ high-growth brands managing their operations on our platform.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GlowButton onClick={() => navigate('/register')} className="h-12 px-8 text-base">Get Started for Free</GlowButton>
              <GlowButton variant="outline" onClick={handleBookDemo} className="h-12 px-8 text-base">Book a Demo</GlowButton>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

function Footer() {
  const handleLinkClick = (e: React.MouseEvent, linkName: string) => {
    e.preventDefault()
    // In production, these would link to actual pages
    // For now, show informative alerts
    const messages: Record<string, string> = {
      'Documentation': 'Documentation will be available at docs.platform.com',
      'API Status': 'API Status page coming soon. Current status: All systems operational.',
      'Privacy': 'Privacy policy page coming soon.',
      'Terms': 'Terms of service page coming soon.'
    }
    alert(messages[linkName] || `${linkName} page coming soon.`)
  }

  return (
    <footer className="relative z-10 bg-black/40 border-t border-white/10 pb-24">
      <Container>
        <div className="py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-white/60 text-sm">
          <div>© {new Date().getFullYear()} Shipra. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" onClick={(e) => handleLinkClick(e, 'Documentation')} className="hover:text-white transition-colors cursor-pointer">Documentation</a>
            <a href="#" onClick={(e) => handleLinkClick(e, 'API Status')} className="hover:text-white transition-colors cursor-pointer">API Status</a>
            <a href="#" onClick={(e) => handleLinkClick(e, 'Privacy')} className="hover:text-white transition-colors cursor-pointer">Privacy</a>
            <a href="#" onClick={(e) => handleLinkClick(e, 'Terms')} className="hover:text-white transition-colors cursor-pointer">Terms</a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen bg-[#0d0d12] text-white selection:bg-accent/30 font-sans" style={{ '--bg': '13, 13, 18', '--accent': '#E31E24' } as React.CSSProperties}>
      <style>{`
        :root {
          --bg: 13, 13, 18;
          --blur: 16px;
          --shadow-1: 0 4px 30px rgba(0, 0, 0, 0.1);
          --shadow-2: 0 10px 40px rgba(227, 30, 36, 0.1);
        }
        body { margin: 0; background: rgb(var(--bg)); }
      `}</style>

      <FloatingDock />
      <BackgroundCanvas />

      <main className="relative z-10 flex flex-col">
        <Hero />
        <GlobalInfrastructure />
        <FeatureBelt />
        <FeatureSpotlight />

        <AllocationSim />
        <IntegrationsGrid />
        <Testimonials />
        <DevAPI />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  )
}
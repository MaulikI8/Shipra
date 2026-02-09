import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    className?: string
    variant?: 'primary' | 'secondary' | 'ghost'
}

export function MagneticButton({ children, className = '', variant = 'primary', ...props }: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { clientX, clientY } = e
        const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 }
        const x = clientX - (left + width / 2)
        const y = clientY - (top + height / 2)
        setPosition({ x: x * 0.2, y: y * 0.2 })
    }

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 })
    }

    const baseStyles = "relative px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 overflow-hidden"
    const variants = {
        primary: "bg-[linear-gradient(180deg,#00E8FF_0%,#22F0FF_60%,#8BF8FF_100%)] text-slate-900 shadow-[0_0_24px_rgba(0,232,255,.25)] hover:shadow-[0_0_32px_rgba(0,232,255,.35)]",
        secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/10",
        ghost: "hover:bg-white/5 text-white/60 hover:text-white"
    }

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props as any}
        >
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </motion.button>
    )
}

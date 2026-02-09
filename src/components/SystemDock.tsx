import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Warehouse, 
  FileBarChart, 
  Bell,
  LogOut,
  Map,
  Settings
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { api } from '../lib/api'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export function SystemDock() {
  const navigate = useNavigate()
  const location = useLocation()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const items = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard?tab=home' },
    { icon: Package, label: 'Orders', path: '/dashboard?tab=orders' },
    { icon: Warehouse, label: 'Inventory', path: '/dashboard?tab=inventory' },
    { icon: Map, label: 'Warehouses', path: '/warehouses' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: FileBarChart, label: 'Reports', path: '/reports' },
  ]

  const handleLogout = () => {
    api.logout()
    navigate('/login')
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
        className="flex items-center gap-1.5 p-2 rounded-2xl border border-white/10 bg-[#0E0F12]/80 backdrop-blur-xl shadow-2xl shadow-black/50"
      >
        {items.map((item, index) => {
          const isHovered = hoveredIndex === index
          
          // Strict matching logic
          let isActive = false
          
          if (item.path.includes('?')) {
             const [path, query] = item.path.split('?')
             // Match if current path matches item path AND search includes query
             // Special case: if query is 'tab=home' and current search is empty on dashboard, treat as active
             if (query === 'tab=home' && location.pathname === '/dashboard' && location.search === '') {
               isActive = true
             } else {
               isActive = location.pathname === path && location.search.includes(query)
             }
          } else {
            // Standard prefix match
            isActive = location.pathname.startsWith(item.path)
          }
          
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="relative group flex items-center justify-center"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.div
                className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                )}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon 
                  size={22} 
                  className={cn(
                    "transition-colors duration-300", 
                    isActive ? "text-accent" : isHovered ? "text-white" : "text-white/60"
                  )} 
                />
                
                {isActive && (
                  <motion.div 
                    layoutId="active-dot"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-accent"
                  />
                )}
              </motion.div>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -16, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-[#1A1B20] border border-white/10 text-[11px] font-medium text-white whitespace-nowrap shadow-xl z-50 pointer-events-none"
                  >
                    {item.label}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1A1B20] border-r border-b border-white/10 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )
        })}

        <div className="w-px h-8 bg-white/10 mx-1.5" />

        <button
          onClick={handleLogout}
          className="relative group flex items-center justify-center"
          onMouseEnter={() => setHoveredIndex(99)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <motion.div
            className="flex items-center justify-center w-12 h-12 rounded-xl hover:bg-red-500/10 transition-colors"
            whileHover={{ scale: 1.15, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={20} className="text-white/40 group-hover:text-red-400 transition-colors" />
          </motion.div>
          
          <AnimatePresence>
            {hoveredIndex === 99 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -16, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-[#1A1B20] border border-white/10 text-[11px] font-medium text-red-400 whitespace-nowrap shadow-xl z-50"
              >
                Sign Out
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1A1B20] border-r border-b border-white/10 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>
    </div>
  )
}

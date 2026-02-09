import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertTriangle, X } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

let toastListeners: ((toasts: Toast[]) => void)[] = []
let toasts: Toast[] = []

function notifyListeners() {
  toastListeners.forEach(listener => listener([...toasts]))
}

export function toast(message: string, type: ToastType = 'success') {
  const id = Date.now() + Math.random()
  toasts = [...toasts, { id, message, type }]
  notifyListeners()
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id)
    notifyListeners()
  }, 3000)
}

export function useToasts() {
  const [state, setState] = useState<Toast[]>([])

  useEffect(() => {
    toastListeners.push(setState)
    setState([...toasts])
    
    return () => {
      toastListeners = toastListeners.filter(l => l !== setState)
    }
  }, [])

  return state
}

export function ToastContainer() {
  const toastList = useToasts()

  const removeToast = (id: number) => {
    toasts = toasts.filter(t => t.id !== id)
    notifyListeners()
  }

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toastList.map((toastItem) => (
          <motion.div
            key={toastItem.id}
            initial={{ opacity: 0, y: 50, scale: 0.9, x: 100 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 100, transition: { duration: 0.2 } }}
            className={cn(
              "px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 min-w-[300px] pointer-events-auto",
              toastItem.type === 'success' 
                ? "bg-black/90 border-emerald-500/30 text-emerald-400 backdrop-blur-xl" 
                : toastItem.type === 'error'
                ? "bg-black/90 border-red-500/30 text-red-400 backdrop-blur-xl"
                : "bg-black/90 border-blue-500/30 text-blue-400 backdrop-blur-xl"
            )}
          >
            {toastItem.type === 'success' ? <Check size={18} /> : toastItem.type === 'error' ? <AlertTriangle size={18} /> : <AlertTriangle size={18} />}
            <span className="text-white text-sm font-medium flex-1">{toastItem.message}</span>
            <button
              onClick={() => removeToast(toastItem.id)}
              className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}


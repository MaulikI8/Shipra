import logo from '../assets/logo.png'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, AlertTriangle, X } from 'lucide-react'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { toast } from '../lib/toast'
import { ToastContainer } from '../lib/toast'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function BackgroundCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-[#0d0d12]" />
  )
}

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative backdrop-blur-[var(--blur)] bg-[rgba(255,255,255,0.07)]',
        'border border-[color:rgba(255,255,255,0.10)] rounded-2xl',
        'shadow-[var(--shadow-1)]',
        className
      )}
    >
      {children}
      <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,.06) 0%, rgba(255,255,255,0) 60%)' }} />
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    
    if (!email || !password) {
      setErrorMessage('Please enter your email and password')
      setIsLoading(false)
      return
    }

    try {
      const { api } = await import('../lib/api')
      const { response, data } = await api.login(email, password)
      
      if (response.ok) {
        toast('Login successful!', 'success')
        setTimeout(() => navigate('/dashboard'), 1000)
      } else {
        const errorMsg = data.non_field_errors?.[0] || data.email?.[0] || data.password?.[0] || data.detail || 'Login failed. Please try again.'
        setErrorMessage(errorMsg)
        toast(errorMsg, 'error')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      const msg = error.message || 'Connection error. Please check if backend is running.'
      setErrorMessage(msg)
      toast(msg, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    toast(`Redirecting to ${provider} authentication...`, 'success')
    
    // In a real production app, you would:
    // 1. window.location.href = `${process.env.BACKEND_URL}/auth/login/${provider}/`
    // 2. Or use a library like @react-oauth/google
    
    // For this development version, we simulate the successful OAuth callback
    setTimeout(() => {
      toast(`Successfully authenticated via ${provider}`, 'success')
      navigate('/dashboard')
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white flex items-center justify-center p-6" style={{ '--bg': '13, 13, 18', '--accent': '#E31E24', '--blur': '16px', '--shadow-1': '0 4px 30px rgba(0, 0, 0, 0.1)' } as React.CSSProperties}>
      <BackgroundCanvas />
      
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all duration-200 backdrop-blur-xl"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </motion.button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <motion.button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img src={logo} alt="Shipra" className="h-[60px] w-[60px] object-contain rounded-full" />
          </motion.button>
        </div>

        <GlassCard className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-white/90 mb-2">Welcome back</h1>
            <p className="text-sm text-white/60">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 text-red-400 text-sm overflow-hidden"
                >
                  <AlertTriangle size={18} className="shrink-0" />
                  <span>{errorMessage}</span>
                  <button 
                    type="button" 
                    onClick={() => setErrorMessage('')}
                    className="ml-auto p-1 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrorMessage('')
                  }}
                  placeholder="you@company.com"
                  required
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl",
                    "bg-white/5 border border-white/10",
                    "text-white placeholder:text-white/40",
                    "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50",
                    "transition-all",
                    errorMessage && "border-red-500/30 focus:border-red-500/50 focus:ring-red-500/20"
                  )}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrorMessage('')
                  }}
                  placeholder="••••••••"
                  required
                  className={cn(
                    "w-full pl-10 pr-12 py-3 rounded-xl",
                    "bg-white/5 border border-white/10",
                    "text-white placeholder:text-white/40",
                    "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50",
                    "transition-all",
                    errorMessage && "border-red-500/30 focus:border-red-500/50 focus:ring-red-500/20"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded bg-white/5 border border-white/20 text-accent focus:ring-2 focus:ring-accent/50 cursor-pointer"
                />
                <span className="text-white/60 group-hover:text-white/80 transition-colors">Remember me</span>
              </label>
              <button
                type="button"
                className="text-accent hover:text-accent/80 transition-colors"
                onClick={() => console.log('Forgot password')}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-3 rounded-xl font-medium",
                "bg-[linear-gradient(180deg,#E31E24_0%,#FF4D4D_60%,#FF8080_100%)]",
                "text-white shadow-[0_0_24px_rgba(227,30,36,0.25)]",
                "hover:shadow-[0_0_32px_rgba(227,30,36,0.35)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all flex items-center justify-center gap-2"
              )}
              whileHover={isLoading ? {} : { scale: 1.01 }}
              whileTap={isLoading ? {} : { scale: 0.99 }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/40">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className={cn(
                "w-full py-3 rounded-xl font-medium",
                "bg-white/5 border border-white/10 text-white/80",
                "hover:bg-white/10 hover:border-white/20",
                "transition-all flex items-center justify-center gap-3",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              className={cn(
                "w-full py-3 rounded-xl font-medium",
                "bg-white/5 border border-white/10 text-white/80",
                "hover:bg-white/10 hover:border-white/20",
                "transition-all flex items-center justify-center gap-3",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-white/60">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-accent hover:text-accent/80 transition-colors font-medium"
            >
              Sign up
            </button>
          </p>
        </GlassCard>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-white/40">
          Protected by industry-leading encryption
        </p>
      </motion.div>
      <ToastContainer />
    </div>
  )
}


import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { toast } from '../lib/toast'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Mail,
  Phone,
  Edit,
  Trash2,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  Copy,
  ExternalLink,
  MessageSquare
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

function GlassCard({ children, className, hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-white/[0.03] backdrop-blur-2xl border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-[2rem]',
        hover && 'hover:bg-white/[0.06] hover:border-white/[0.1] hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.4)] transition-all duration-300 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

function LiquidBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#0d0d12] pointer-events-none" />
  )
}

export default function OrderDetail() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [showActions, setShowActions] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditingTracking, setIsEditingTracking] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return
      try {
        setIsLoading(true)
        const numericId = orderId.startsWith('#') ? orderId.slice(1) : orderId
        const { response, data } = await api.getOrder(parseInt(numericId))
        if (response.ok) {
          setOrder(data)
          setTrackingNumber(data.tracking_number || '')
        } else {
          toast('Failed to load order details', 'error')
        }
      } catch (error) {
        console.error('Error fetching order:', error)
        toast('Error loading order details', 'error')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d12] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0d0d12] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-blue-600 rounded-xl">Go Back</button>
      </div>
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast('Copied to clipboard!', 'success')
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white font-sans">
      <LiquidBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 z-40 flex items-center justify-between px-8 backdrop-blur-xl bg-black/20 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Order {order.order_number}</h1>
            <p className="text-xs text-white/40">{new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowActions(!showActions)}
              className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
            >
              <MoreVertical size={20} />
            </button>
            {showActions && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-full mt-2 w-48 bg-[#0F0F10] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
              >
                <button className="w-full px-4 py-3 hover:bg-white/5 text-left text-white/80 hover:text-white transition-colors flex items-center gap-3 text-sm">
                  <Edit size={16} /> Edit Order
                </button>
                <button className="w-full px-4 py-3 hover:bg-white/5 text-left text-white/80 hover:text-white transition-colors flex items-center gap-3 text-sm">
                  <Send size={16} /> Send to Customer
                </button>
                <button className="w-full px-4 py-3 hover:bg-white/5 text-left text-red-400 hover:text-red-300 transition-colors flex items-center gap-3 text-sm border-t border-white/5">
                  <Trash2 size={16} /> Cancel Order
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 px-8 pb-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <GlassCard className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Order Status</h2>
                  <div className="relative inline-block">
                    <select
                      value={order.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value
                        try {
                          await api.updateOrderStatus(order.id, newStatus)
                          setOrder({ ...order, status: newStatus })
                          toast(`Order status updated to ${newStatus}`, 'success')
                        } catch (error) {
                          toast('Failed to update status', 'error')
                        }
                      }}
                      className={cn(
                        "appearance-none pr-8 pl-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider border bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20",
                        order.status === 'delivered' ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" :
                        order.status === 'shipped' ? "bg-blue-500/10 text-blue-300 border-blue-500/20" :
                        order.status === 'processing' ? "bg-purple-500/10 text-purple-300 border-purple-500/20" :
                        "bg-amber-500/10 text-amber-300 border-amber-500/20"
                      )}
                    >
                      <option value="pending" className="bg-[#1A1B20] text-amber-300">Pending</option>
                      <option value="processing" className="bg-[#1A1B20] text-purple-300">Processing</option>
                      <option value="shipped" className="bg-[#1A1B20] text-blue-300">Shipped</option>
                      <option value="delivered" className="bg-[#1A1B20] text-emerald-300">Delivered</option>
                      <option value="cancelled" className="bg-[#1A1B20] text-red-300">Cancelled</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-white">${parseFloat(order.total_amount).toLocaleString()}</div>
                  <div className="text-white/40 text-sm mt-1">Total Amount</div>
                </div>
              </div>

              {/* Timeline (Mocked for now as backend doesn't have it) */}
              <div className="space-y-4">
                {[
                  { status: 'Order Placed', date: new Date(order.created_at).toLocaleString(), done: true },
                  { status: 'Confirmed', date: new Date(order.created_at).toLocaleString(), done: true },
                  { status: 'Processing', date: order.status !== 'pending' ? 'In progress' : 'Scheduled', done: order.status !== 'pending' },
                  { status: 'Shipped', date: 'Upcoming', done: ['shipped', 'delivered'].includes(order.status) },
                  { status: 'Delivered', date: 'Final Step', done: order.status === 'delivered' },
                ].map((step, i, arr) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="relative">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2",
                        step.done 
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                          : "bg-white/5 border-white/20 text-white/40"
                      )}>
                        {step.done ? <CheckCircle size={20} /> : <Clock size={20} />}
                      </div>
                      {i < arr.length - 1 && (
                        <div className={cn(
                          "absolute left-1/2 top-10 w-0.5 h-8 -translate-x-1/2",
                          step.done ? "bg-emerald-500/30" : "bg-white/10"
                        )} />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <div className={cn("font-semibold", step.done ? "text-white" : "text-white/60")}>
                        {step.status}
                      </div>
                      <div className="text-white/40 text-sm">{step.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Order Items */}
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                    <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                      {item.product.image ? (
                        <img src={item.product.image} className="w-full h-full object-cover rounded-xl" alt="" />
                      ) : (
                        <Package size={32} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-bold text-white">{item.product.name}</div>
                      <div className="text-white/40 text-sm">SKU: {item.product.sku}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white/40 text-xs">Quantity</div>
                      <div className="text-lg font-bold text-white">{item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/40 text-xs">Price</div>
                      <div className="text-lg font-bold text-white">${parseFloat(item.unit_price).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/40 text-xs">Total</div>
                      <div className="text-xl font-bold text-white">${parseFloat(item.subtotal).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span className="font-semibold">${parseFloat(order.total_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white text-xl font-bold pt-3 border-t border-white/10">
                  <span>Total</span>
                  <span>${parseFloat(order.total_amount).toLocaleString()}</span>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            {/* Customer Info */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-6">Customer Information</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xl">
                  {order.customer_name?.[0]}
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{order.customer_name}</div>
                  <div className="text-white/40 text-sm">Customer ID: #{order.customer}</div>
                </div>
              </div>
              <button className="w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <MessageSquare size={16} />
                Contact Customer
              </button>
            </GlassCard>

            {/* Shipping Info (Partially mock/fallback as backend has no address fields yet) */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-6">Shipping Information</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-white/40 text-xs mb-1">Method</div>
                  <div className="text-white text-sm font-semibold">Standard Shipping</div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="text-white/40 text-xs mb-2">Tracking Number</div>
                  <div className="flex items-center gap-2">
                    {isEditingTracking ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter tracking #"
                          className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-white text-sm font-mono border border-white/10 focus:outline-none focus:border-blue-500/50"
                          autoFocus
                        />
                        <button
                          onClick={async () => {
                            try {
                              setIsLoading(true)
                              const { response } = await api.updateOrder(order.id, { tracking_number: trackingNumber })
                              if (response.ok) {
                                setOrder({ ...order, tracking_number: trackingNumber })
                                toast('Tracking number updated', 'success')
                                setIsEditingTracking(false)
                              } else {
                                toast('Failed to update', 'error')
                              }
                            } catch (error) {
                              toast('Error updating tracking number', 'error')
                            } finally {
                              setIsLoading(false)
                            }
                          }}
                          className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingTracking(false)
                            setTrackingNumber(order.tracking_number || '')
                          }}
                          className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Trash2 size={18} /> 
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className={cn(
                          "flex-1 px-3 py-2 rounded-lg text-sm font-mono",
                          order.tracking_number ? "bg-white/5 text-white" : "bg-white/5 text-white/40 italic"
                        )}>
                          {order.tracking_number || "No tracking number assigned"}
                        </div>
                        {order.tracking_number && (
                          <button 
                            onClick={() => copyToClipboard(order.tracking_number)}
                            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                            title="Copy"
                          >
                            <Copy size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => setIsEditingTracking(true)}
                          className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-blue-400 transition-all"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  )
}

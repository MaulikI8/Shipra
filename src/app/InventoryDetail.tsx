import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { toast } from '../lib/toast'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Package,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  Edit,
  Plus,
  Minus,
  Send,
  AlertTriangle,
  MoreVertical,
  Download,
  Truck,
  Box,
  BarChart3,
  Clock,
  CheckCircle
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis } from 'recharts'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))



function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-white/[0.03] backdrop-blur-2xl border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-[2rem]',
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

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#0F0F10] border border-white/10 rounded-2xl p-6 shadow-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
        {children}
      </motion.div>
    </div>
  )
}

export default function InventoryDetail() {
  const navigate = useNavigate()
  const { itemId } = useParams()
  const [showActions, setShowActions] = useState(false)
  const [showRestockModal, setShowRestockModal] = useState(false)
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [item, setItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchItem = async () => {
      if (!itemId) return
      try {
        setIsLoading(true)
        const { response, data } = await api.getProduct(parseInt(itemId))
        if (response.ok) {
          setItem(data)
        } else {
          toast('Failed to load product details', 'error')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast('Error loading product details', 'error')
      } finally {
        setIsLoading(false)
      }
    }
    fetchItem()
  }, [itemId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d12] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#0d0d12] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-blue-600 rounded-xl">Go Back</button>
      </div>
    )
  }

  const totalIncoming = 0 // item.warehouses?.reduce((sum, wh) => sum + wh.incoming, 0) || 0
  const projectedStock = (item.total_stock || 0) + totalIncoming

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}</style>
      
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
            <h1 className="text-xl font-bold text-white">{item.name}</h1>
            <p className="text-xs text-white/40">SKU: {item.sku}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowRestockModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-medium transition-colors flex items-center gap-2 border border-emerald-500/30"
          >
            <Plus size={16} />
            Restock
          </button>
          <button 
            onClick={() => setShowAdjustModal(true)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Edit size={16} />
            Adjust
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowActions(!showActions)}
              className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
            >
              <MoreVertical size={20} />
            </button>
            <AnimatePresence>
              {showActions && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-[#0F0F10] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                >
                  <button 
                    onClick={() => { setShowTransferModal(true); setShowActions(false) }}
                    className="w-full px-4 py-3 hover:bg-white/5 text-left text-white/80 hover:text-white transition-colors flex items-center gap-3 text-sm"
                  >
                    <Truck size={16} /> Transfer Stock
                  </button>
                  <button className="w-full px-4 py-3 hover:bg-white/5 text-left text-white/80 hover:text-white transition-colors flex items-center gap-3 text-sm">
                    <Download size={16} /> Export Report
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 px-8 pb-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stock Overview */}
            <GlassCard className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-white/40 text-sm mb-2">Current Stock</div>
                  <div className="text-4xl font-bold text-white">{item.total_stock || 0}</div>
                  <div className="text-white/60 text-sm mt-1">units available</div>
                </div>
                <div>
                  <div className="text-white/40 text-sm mb-2">Incoming Stock</div>
                  <div className="text-4xl font-bold text-emerald-400">+{totalIncoming}</div>
                  <div className="text-white/60 text-sm mt-1">in transit</div>
                </div>
                <div>
                  <div className="text-white/40 text-sm mb-2">Projected Total</div>
                  <div className="text-4xl font-bold text-blue-400">{projectedStock}</div>
                  <div className="text-white/60 text-sm mt-1">after delivery</div>
                </div>
              </div>

              {/* Stock Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={item.stock_history || [
                    { date: 'Mon', value: item.total_stock },
                    { date: 'Tue', value: item.total_stock },
                    { date: 'Wed', value: item.total_stock },
                    { date: 'Thu', value: item.total_stock },
                    { date: 'Fri', value: item.total_stock },
                  ]}>
                    <defs>
                      <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#stockGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Warehouse Distribution */}
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold text-white mb-6">Warehouse Distribution</h3>
              <div className="space-y-4">
                {item.inventory_items?.length === 0 && (
                  <div className="text-white/40 text-center py-4">No warehouse distribution found</div>
                )}
                {item.inventory_items?.map((inv: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <div className="text-white font-semibold">{inv.warehouse?.name}</div>
                          <div className="text-white/40 text-xs">{inv.warehouse?.city}, {inv.warehouse?.state}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{inv.quantity}</div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: (Math.min(100, (inv.quantity / (item.total_stock || 1)) * 100) + '%') }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Recent Activity */}
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {item.recent_activity?.length > 0 ? (
                  item.recent_activity.map((activity: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      {/* ... activity content ... */}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-white/40">No recent activity recorded</div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Product Info */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Product Information</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-white/40 text-xs mb-1">Category</div>
                  <div className="text-white">{item.category?.name || 'Uncategorized'}</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs mb-1">Status</div>
                  <div className={cn(
                    "inline-block px-3 py-1 rounded-lg text-xs font-bold",
                    "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20"
                  )}>
                    {item.status}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="text-white/40 text-xs mb-1">Description</div>
                  <div className="text-white/80 text-sm leading-relaxed">{item.description}</div>
                </div>
              </div>
            </GlassCard>

            {/* Pricing */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Pricing</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-white/40 text-xs mb-1">Selling Price</div>
                  <div className="text-2xl font-bold text-white">${item.price.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs mb-1">Cost Price</div>
                  <div className="text-lg font-semibold text-white/80">${item.cost.toLocaleString()}</div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="text-white/40 text-xs mb-1">Profit Margin</div>
                  <div className="text-xl font-bold text-emerald-400">
                    {(((item.price - item.cost) / item.price) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Sales Metrics */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Sales Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-white/60 text-sm">Sold This Month</div>
                  <div className="text-xl font-bold text-white">{item.metrics?.soldThisMonth || 0}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-white/60 text-sm">Avg Per Day</div>
                  <div className="text-lg font-semibold text-white">{item.metrics?.averagePerDay || 0}</div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="text-white/60 text-sm">Trend</div>
                  <div className={cn(
                    "px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1",
                    item.metrics?.trend === 'up' 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : "bg-red-500/20 text-red-400"
                  )}>
                    {item.metrics?.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {item.metrics?.changePercent || '0%'}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Alerts */}
            {(item.total_stock || 0) < (item.reorder_point || 10) && (
              <GlassCard className="p-6 border-amber-500/20 bg-amber-500/5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Low Stock Alert</h4>
                    <p className="text-white/60 text-sm">
                      Stock level is below reorder point ({item.reorder_point || 10} units). Consider restocking soon.
                    </p>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showRestockModal && (
          <Modal isOpen={showRestockModal} onClose={() => setShowRestockModal(false)} title="Restock Inventory">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/60">Quantity to Add</label>
                <input type="number" min="1" defaultValue="50" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/60">Warehouse</label>
                <select className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50">
                  {item.inventory_items?.map((inv: any) => (
                    <option key={inv.warehouse?.id} value={inv.warehouse?.id}>{inv.warehouse?.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowRestockModal(false)} className="flex-1 py-3 rounded-xl hover:bg-white/5 text-white/60">Cancel</button>
                <button onClick={() => setShowRestockModal(false)} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold">Add Stock</button>
              </div>
            </div>
          </Modal>
        )}

        {showAdjustModal && (
          <Modal isOpen={showAdjustModal} onClose={() => setShowAdjustModal(false)} title="Adjust Stock">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/60">Adjustment Type</label>
                <select className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50">
                  <option value="increase">Increase Stock</option>
                  <option value="decrease">Decrease Stock</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/60">Quantity</label>
                <input type="number" min="1" defaultValue="10" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/60">Reason</label>
                <select className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50">
                  <option>Damaged Items</option>
                  <option>Inventory Correction</option>
                  <option>Return/Refund</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAdjustModal(false)} className="flex-1 py-3 rounded-xl hover:bg-white/5 text-white/60">Cancel</button>
                <button onClick={() => setShowAdjustModal(false)} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold">Apply Adjustment</button>
              </div>
            </div>
          </Modal>
        )}

        {showTransferModal && (
          <Modal isOpen={showTransferModal} onClose={() => setShowTransferModal(false)} title="Transfer Stock">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/60">From Warehouse</label>
                <select className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50">
                  {item.inventory_items?.map((inv: any) => (
                    <option key={inv.warehouse?.id} value={inv.warehouse?.id}>{inv.warehouse?.name} ({inv.quantity} units)</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/60">To Warehouse</label>
                <select className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50">
                  {item.inventory_items?.map((inv: any) => (
                    <option key={inv.warehouse?.id} value={inv.warehouse?.id}>{inv.warehouse?.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/60">Quantity to Transfer</label>
                <input type="number" min="1" defaultValue="25" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowTransferModal(false)} className="flex-1 py-3 rounded-xl hover:bg-white/5 text-white/60">Cancel</button>
                <button onClick={() => setShowTransferModal(false)} className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold">Transfer Stock</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}



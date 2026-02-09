import logo from '../assets/logo.png'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Box,
  ShoppingCart,
  Users,
  Activity,
  Search,
  Bell,
  Settings,
  MoreHorizontal,
  ArrowUpRight,
  Plus,
  Filter,
  Zap,
  Cpu,
  Globe,
  Command,
  ChevronRight,
  Smartphone,
  Tablet,
  Monitor,
  TrendingUp,
  Mail,
  Lock,
  LogOut,
  Check,
  Shield,
  Moon,
  X,
  AlertTriangle,
  Download,
  Calendar,
  Warehouse,
  DollarSign,
  Package,
  Clock,
  Target,
  TrendingDown,
  ArrowRight,
  MapPin
} from 'lucide-react'
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid
} from 'recharts'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SystemDock } from '../components/SystemDock'
import { api } from '../lib/api'

// --- Utilities ---
// Helper function to merge Tailwind classes - handles conflicts and conditional classes
// Helper function to merge Tailwind classes - handles conflicts and conditional classes
const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

// --- Mock Data ---
// --- Form Components ---

// --- Form Components ---
// These are the modals/forms for creating orders, products, etc.

function CreateOrderForm({ customers, products, onClose, onSuccess, onError }: {
  customers: any[]
  products: any[]
  onClose: () => void
  onSuccess: () => void
  onError: (msg: string) => void
}) {
  const [customerId, setCustomerId] = useState('')
  const [orderItems, setOrderItems] = useState<Array<{ product_id: number, quantity: number, unit_price: number }>>([{ product_id: 0, quantity: 1, unit_price: 0 }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddItem = () => {
    setOrderItems([...orderItems, { product_id: 0, quantity: 1, unit_price: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...orderItems]
    newItems[index] = { ...newItems[index], [field]: value }
    if (field === 'product_id') {
      const product = products.find((p: any) => p.id === parseInt(value))
      if (product) {
        newItems[index].unit_price = parseFloat(product.price)
      }
    }
    setOrderItems(newItems)
  }

  const handleSubmit = async () => {
    if (!customerId) {
      onError('Please select a customer')
      return
    }
    if (orderItems.some(item => !item.product_id || item.quantity <= 0)) {
      onError('Please fill in all order items')
      return
    }

    try {
      setIsSubmitting(true)
      const { response, data } = await api.createOrder({
        customer: parseInt(customerId),
        items: orderItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price
        }))
      })

      if (response.ok) {
        onSuccess()
      } else {
        onError(data.detail || data.error || 'Failed to create order')
      }
    } catch (error: any) {
      onError(error.message || 'Failed to create order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-white/60">Customer *</label>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
        >
          <option value="">Select customer</option>
          {customers.map((customer: any) => (
            <option key={customer.id} value={customer.id}>{customer.name} - {customer.company}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-white/60">Order Items *</label>
          <button
            onClick={handleAddItem}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>

        {orderItems.map((item, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <select
                value={item.product_id}
                onChange={(e) => handleItemChange(index, 'product_id', parseInt(e.target.value))}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50 text-sm"
              >
                <option value="0">Select product</option>
                {products.map((product: any) => (
                  <option key={product.id} value={product.id}>{product.name} - ${product.price}</option>
                ))}
              </select>
            </div>
            <div className="w-24 space-y-2">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50 text-sm"
                placeholder="Qty"
              />
            </div>
            {orderItems.length > 1 && (
              <button
                onClick={() => handleRemoveItem(index)}
                className="p-3 text-red-400 hover:text-red-300"
              >
                <X size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white">Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Order'}
        </button>
      </div>
    </div>
  )
}

function CreateProductForm({ onClose, onSuccess, onError }: {
  onClose: () => void
  onSuccess: () => void
  onError: (msg: string) => void
}) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    price: '',
    cost: '',
    image: null as File | null
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!formData.sku || !formData.name || !formData.price) {
      onError('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      const { response, data } = await api.createProduct({
        sku: formData.sku,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        image: formData.image || undefined
      })

      if (response.ok) {
        onSuccess()
      } else {
        onError(data.detail || data.error || 'Failed to create product')
      }
    } catch (error: any) {
      onError(error.message || 'Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-white/60">Product Image</label>
        <div className="flex items-center gap-4">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-xl object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Package size={32} className="text-white/40" />
            </div>
          )}
          <label className="flex-1 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm text-center transition-colors">
              {imagePreview ? 'Change Image' : 'Upload Image'}
            </div>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/60">SKU *</label>
        <input
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
          placeholder="e.g. PROD-123"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/60">Product Name *</label>
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
          placeholder="Enter product name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/60">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50 resize-none"
          rows={3}
          placeholder="Product description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-white/60">Price *</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/60">Cost</label>
          <input
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white">Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </button>
      </div>
    </div>
  )
}

function RestockForm({ productId, product, warehouses, onClose, onSuccess, onError }: {
  productId: number | null
  product: any
  warehouses: any[]
  onClose: () => void
  onSuccess: () => void
  onError: (msg: string) => void
}) {
  const [quantity, setQuantity] = useState('10')
  const [warehouseId, setWarehouseId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!productId || !warehouseId || !quantity || parseInt(quantity) <= 0) {
      onError('Please fill in all fields')
      return
    }

    try {
      setIsSubmitting(true)
      const { response, data } = await api.restockProduct(
        productId,
        parseInt(warehouseId),
        parseInt(quantity)
      )

      if (response.ok) {
        onSuccess()
      } else {
        onError(data.detail || data.error || 'Failed to restock')
      }
    } catch (error: any) {
      onError(error.message || 'Failed to restock')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="text-sm text-white/60 mb-1">Product</div>
        <div className="text-lg font-bold text-white">
          {product?.name || 'Select item'}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/60">Quantity to Add *</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
          placeholder="Enter quantity"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/60">Warehouse Location *</label>
        <select
          value={warehouseId}
          onChange={(e) => setWarehouseId(e.target.value)}
          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
        >
          <option value="">Select warehouse</option>
          {warehouses.map((warehouse: any) => (
            <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors">Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Restocking...' : 'Restock'}
        </button>
      </div>
    </div>
  )
}

// --- Shared UI Components ---


function LiquidBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px] animate-pulse" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[100px] animate-pulse delay-1000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[140px] animate-pulse delay-2000" />
    </div>
  )
}

function Toast({ message, type = 'success', onClose }: { message: string, type?: 'success' | 'error', onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        "fixed bottom-8 right-8 z-[100] px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3",
        type === 'success' ? "bg-black/80 border-emerald-500/30 text-emerald-400" : "bg-black/80 border-red-500/30 text-red-400"
      )}
    >
      {type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
      <span className="text-white text-sm font-medium">{message}</span>
    </motion.div>
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
        className="relative w-full max-w-lg bg-[#0F0F10] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  )
}


function GlassCard({
  children,
  className,
  hover = false,
  delay = 0,
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  onClick?: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden bg-white/[0.03] backdrop-blur-2xl border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-[2rem]",
        hover && "hover:bg-white/[0.06] hover:border-white/[0.1] hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  )
}



// --- Views ---

function Overview({ onExport, onCreateOrder, onAddProduct, dashboardData, isLoading, customers }: {
  onExport: () => void,
  onCreateOrder: () => void,
  onAddProduct: () => void,
  dashboardData: any,
  isLoading: boolean,
  customers: any[]
}) {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('Last 7 Days')

  const data = dashboardData?.weekly_data || [
    { name: 'Mon', value: 0 },
    { name: 'Tue', value: 0 },
    { name: 'Wed', value: 0 },
    { name: 'Thu', value: 0 },
    { name: 'Fri', value: 0 },
    { name: 'Sat', value: 0 },
    { name: 'Sun', value: 0 },
  ]

  const totalRevenue = dashboardData?.total_revenue || 0
  const totalOrders = dashboardData?.total_orders || 0
  const totalProducts = dashboardData?.total_products || 0
  const recentOrders = dashboardData?.recent_orders || []
  const topProducts = dashboardData?.top_products || []

  const toggleTime = () => {
    setTimeRange(prev => prev === 'Last 7 Days' ? 'Last 30 Days' : 'Last 7 Days')
  }

  const handleExport = () => {
    onExport()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1 pb-24">
      <div className="lg:col-span-8 flex flex-col gap-6">
        <GlassCard className="p-8 min-h-[420px] flex flex-col relative group">
          <div className="absolute top-0 right-0 p-32 bg-accent/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-accent/20 transition-colors duration-500" />

          <div className="flex justify-between items-start relative z-10">
            <div>
              <h2 className="text-5xl font-bold text-white tracking-tighter">
                ${isLoading ? '...' : totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </h2>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-white/40 text-sm font-medium">
                  {isLoading ? 'Loading...' : (totalOrders > 0 ? (totalOrders + ' orders') : 'No data yet')}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={toggleTime} className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium transition-colors border border-white/5 flex items-center gap-2">
                <Calendar size={12} /> {timeRange}
              </button>
              <button onClick={handleExport} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all">
                <Download size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 mt-10 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E31E24" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#E31E24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                  contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="value" stroke="#E31E24" strokeWidth={4} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Orders', val: isLoading ? '...' : totalOrders.toString(), icon: Box, color: 'text-accent', bg: 'bg-accent/20', change: '' },
            { label: 'Products', val: isLoading ? '...' : totalProducts.toString(), icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/20', change: '' },
            { label: 'Stock Units', val: isLoading ? '...' : (dashboardData?.total_stock || 0).toString(), icon: Globe, color: 'text-pink-400', bg: 'bg-pink-400/20', change: '' },
          ].map((stat, i) => (
            <GlassCard
              key={i}
              className="p-6 flex items-center gap-5 cursor-pointer"
              hover
              onClick={() => {
                if (stat.label === 'Total Orders') navigate('/dashboard?tab=orders')
                else if (stat.label === 'Products') navigate('/dashboard?tab=inventory')
                else if (stat.label === 'Stock Units') navigate('/dashboard?tab=inventory')
              }}
            >
              <div className={cn("w-14 h-14 rounded-[1.2rem] flex items-center justify-center shrink-0", stat.bg, stat.color)}>
                <stat.icon size={26} />
              </div>
              <div className="flex-1">
                <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.val}</div>
                {stat.change && (
                  <div className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                    <TrendingUp size={12} /> {stat.change}
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Recent Activity & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders Preview */}
          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Recent Orders</h3>
              <button
                onClick={() => navigate('/dashboard?tab=orders')}
                className="text-sm text-accent hover:text-accent/80 flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight size={14} />
              </button>
            </div>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-white/40 text-sm">
                  No orders yet
                </div>
              ) : (
                recentOrders.slice(0, 3).map((order: any) => (
                  <div
                    key={order.id}
                    onClick={() => navigate('/orders/' + order.id)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        <Package size={18} className="text-accent" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{order.customer_name || 'Customer'}</div>
                        <div className="text-xs text-white/40 font-mono">{order.order_number}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">${parseFloat(order.total_amount).toFixed(2)}</span>
                      <ChevronRight size={16} className="text-white/40 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          {/* Top Products */}
          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Top Products</h3>
              <button
                onClick={() => navigate('/dashboard?tab=inventory')}
                className="text-sm text-accent hover:text-accent/80 flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight size={14} />
              </button>
            </div>
            <div className="space-y-4">
              {topProducts.length === 0 ? (
                <div className="text-center py-8 text-white/40 text-sm">
                  No products yet
                </div>
              ) : (
                topProducts.slice(0, 3).map((product: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => navigate('/dashboard?tab=inventory')}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Box size={18} className="text-purple-400" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{product.name}</div>
                        <div className="text-xs text-white/40">{product.sales || 0} sold</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">${product.revenue.toLocaleString()}</span>
                      <ChevronRight size={16} className="text-white/40 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Conversion Rate', val: '0%', icon: Target, color: 'text-accent', bg: 'bg-accent/20', change: '+0%' },
            { label: 'Customer Growth', val: customers.length.toString(), icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/20', change: '+0%' },
            { label: 'Revenue Growth', val: '$' + totalRevenue.toLocaleString(), icon: DollarSign, color: 'text-accent', bg: 'bg-accent/20', change: '+0%' },
            { label: 'Avg Response', val: '0s', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/20', change: '0s' },
          ].map((metric, i) => (
            <GlassCard
              key={i}
              className="p-5 cursor-pointer"
              hover
              onClick={() => {
                if (metric.label === 'Conversion Rate' || metric.label === 'Revenue Growth') navigate('/dashboard?tab=analytics')
                else if (metric.label === 'Customer Growth') navigate('/customers')
                else if (metric.label === 'Avg Response') navigate('/dashboard?tab=analytics')
              }}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", metric.bg, metric.color)}>
                <metric.icon size={20} />
              </div>
              <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">{metric.label}</div>
              <div className="text-xl font-bold text-white mb-1">{metric.val}</div>
              <div className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                {metric.change.startsWith('+') ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {metric.change}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-6">
        <GlassCard className="p-8 relative overflow-hidden min-h-[280px] flex flex-col" hover>
          <div className="flex justify-between items-start mb-8">
            <div className="w-12 h-12 rounded-[1rem] bg-purple-500/20 flex items-center justify-center text-purple-300">
              <Users size={24} />
            </div>
            <div className="flex items-center gap-1 text-purple-300 text-sm font-medium">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Live
            </div>
          </div>
          <div className="mt-auto">
            <div className="text-5xl font-bold text-white tracking-tighter">{customers.length.toLocaleString()}</div>
            <div className="text-white/40 text-sm mt-2 font-medium">Total Managed Customers</div>
          </div>
          <div className="h-16 mt-6 flex items-end gap-1.5">
            {[40, 70, 50, 90, 60, 80, 50, 75, 45, 65].map((h, i) => (
              <div key={i} className="flex-1 bg-white/10 rounded-t-sm hover:bg-purple-400 transition-colors duration-300" />
            ))}
          </div>
        </GlassCard>


        {/* Quick Actions */}
        <GlassCard className="p-6" hover>
          <h3 className="text-white font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Order', icon: Plus, color: 'bg-accent/20 text-accent', onClick: () => onCreateOrder() },
              { label: 'Add Product', icon: Package, color: 'bg-purple-500/20 text-purple-400', onClick: onAddProduct },
              { label: 'View Reports', icon: Activity, color: 'bg-emerald-500/20 text-emerald-400', onClick: () => navigate('/reports') },
              { label: 'Customers', icon: Users, color: 'bg-pink-500/20 text-pink-400', onClick: () => navigate('/customers') },
            ].map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className={cn("p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center gap-2", action.color)}
              >
                <action.icon size={20} />
                <span className="text-xs font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Activity Feed */}
        <GlassCard className="p-6" hover>
          <h3 className="text-white font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { icon: ShoppingCart, text: 'New order #9282 received', time: '2 mins ago', color: 'text-accent' },
              { icon: Package, text: 'Inventory restocked: Module X-1', time: '15 mins ago', color: 'text-emerald-400' },
              { icon: Users, text: 'New customer registered', time: '1 hour ago', color: 'text-purple-400' },
              { icon: DollarSign, text: 'Payment processed: $4,200', time: '2 hours ago', color: 'text-green-400' },
            ].slice(0, 0).map((activity, i) => (
              <div
                key={i}
                onClick={() => {
                  if (activity.text.includes('order')) navigate('/dashboard?tab=orders')
                  else if (activity.text.includes('Inventory') || activity.text.includes('restocked')) navigate('/dashboard?tab=inventory')
                  else if (activity.text.includes('customer')) navigate('/customers')
                  else if (activity.text.includes('Payment')) navigate('/dashboard?tab=orders')
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-white/10", activity.color)}>
                  <activity.icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white">{activity.text}</div>
                  <div className="text-xs text-white/40">{activity.time}</div>
                </div>
                <ChevronRight size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

function OrdersList({ searchQuery, onCreateOrder, orders = [] }: { searchQuery: string, onCreateOrder: () => void, orders?: any[] }) {
  const navigate = useNavigate()
  const filteredOrders = orders.filter(order =>
    (order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     order.id?.toString().includes(searchQuery) ||
     order.status?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-1 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight">Orders</h2>
          <p className="text-white/40 mt-2">{filteredOrders.length} orders found</p>
        </div>
        <button
          onClick={onCreateOrder}
          className="px-6 py-3 rounded-[1rem] bg-white text-black font-bold hover:bg-white/90 transition-colors flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          <Plus size={20} /> Create Order
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {filteredOrders.map((order, i) => (
          <GlassCard
            key={order.id}
            className="p-5 flex items-center justify-between group"
            hover
            onClick={() => navigate('/orders/' + order.id)}
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.2rem] bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                <ShoppingCart size={28} className="text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white mb-1">Order #{order.id}</div>
                <div className="flex items-center gap-3 text-white/40 text-sm">
                  <span>{order.customer_name || 'Customer'}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-12">
              <div className="text-right">
                <div className="text-lg font-bold text-white">${order.total_amount || '0.00'}</div>
                <div className="text-white/40 text-xs font-medium uppercase">Total</div>
              </div>
              <div className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider w-32 text-center border",
                order.status === 'shipped' && "bg-blue-500/10 text-blue-300 border-blue-500/20",
                order.status === 'processing' && "bg-purple-500/10 text-purple-300 border-purple-500/20",
                order.status === 'pending' && "bg-amber-500/10 text-amber-300 border-amber-500/20",
                order.status === 'delivered' && "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
              )}>
                {order.status}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate('/orders/' + order.id)
                }}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </GlassCard>
        ))}
        {filteredOrders.length === 0 && (
          <div className="text-center py-20 text-white/40">No orders found matching "{searchQuery}"</div>
        )}
      </div>
    </div>
  )
}

function InventoryGrid({ searchQuery, onRestockItem, products, isLoading, onAddProduct }: {
  searchQuery: string,
  onRestockItem: (id: number) => void,
  products: any[],
  isLoading: boolean,
  onAddProduct: () => void
}) {
  const navigate = useNavigate()
  const [filterStatus, setFilterStatus] = useState('ALL')

  const filteredItems = products.filter((item: any) =>
    (item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterStatus === 'ALL' ||
      (filterStatus === 'IN STOCK' && item.status === 'in_stock') ||
      (filterStatus === 'LOW STOCK' && item.status === 'low_stock'))
  )

  return (
    <div className="p-1 pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Inventory Management</h2>
          <p className="text-white/40 mt-2">{filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} in stock</p>
        </div>
        <div className="flex gap-3 items-center">
          {['ALL', 'IN STOCK', 'LOW STOCK'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold border transition-all",
                filterStatus === status
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white/60 border-white/10 hover:bg-white/5"
              )}
            >
              {status}
            </button>
          ))}
          <button
            onClick={onAddProduct}
            className="ml-4 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-white/40" />
            </div>
            <div className="text-white/60 text-lg mb-2">No products yet</div>
            <p className="text-white/40 text-sm mb-6">Get started by adding your first product</p>
            <button
              onClick={onAddProduct}
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus size={20} />
              Add Your First Product
            </button>
          </div>
        ) : (
          filteredItems.map((item, i) => (
            <GlassCard
              key={item.id}
              className="aspect-[4/5] p-6 flex flex-col justify-between group relative"
              hover
              onClick={() => navigate('/inventory/' + item.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-80 pointer-events-none z-[1]" />
              
              {/* Product Image Background */}
              {item.image ? (
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500"
                  />
                </div>
              ) : null}
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="w-12 h-12 rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-cover rounded-[1rem]" />
                  ) : (
                    <Cpu size={24} />
                  )}
                </div>
                <div className={cn(
                  "px-2 py-1 rounded-lg text-[10px] font-bold border",
                  item.status === 'in_stock' ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/20" :
                    item.status === 'low_stock' ? "bg-amber-500/20 text-amber-300 border-amber-500/20" :
                      "bg-red-500/20 text-red-300 border-red-500/20"
                )}>
                  {item.status === 'in_stock' ? 'IN STOCK' : item.status === 'low_stock' ? 'LOW STOCK' : 'OUT OF STOCK'}
                </div>
              </div>
              <div className="relative z-10">
                <div className="text-2xl font-bold text-white mb-1">{item.name}</div>
                <div className="text-white/40 text-sm mb-4">{item.description || item.sku || 'Product'}</div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-colors duration-300",
                      (item.total_stock || 0) > 50 ? "bg-emerald-500" : (item.total_stock || 0) > 20 ? "bg-amber-500" : "bg-red-500"
                    )}
                    style={{ width: (Math.min(100, ((item.total_stock || 0) / 100) * 100) + '%') }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs font-medium">
                  <span className="text-white/40">Stock Level</span>
                  <span className="text-white">{item.total_stock || 0} units</span>
                </div>

                {/* Quick Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRestockItem(item.id)
                  }}
                  className={cn(
                    "w-full mt-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                    (item.total_stock || 0) < 20
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                      : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Plus size={14} />
                  {(item.total_stock || 0) < 20 ? 'Restock Now' : 'Add Stock'}
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  )
}

function AnalyticsView({ timeRange, onToggleTime, dashboardData, isLoading }: { timeRange: string, onToggleTime: () => void, dashboardData: any, isLoading: boolean }) {
  const salesData = dashboardData?.weekly_data || []
  const topProducts = dashboardData?.top_products || []
  // For warehouse performance in analytics view, we'll try to use the same dashboard data if available or just empty if not
  const warehouseData: Array<{ name: string, orders: number, efficiency: number, color: string }> = []

  return (
    <div className="p-1 space-y-6 pb-24">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight">Business Analytics</h2>
          <p className="text-white/40 mt-2">Sales performance & operational insights.</p>
        </div>
        <GlassCard
          onClick={onToggleTime}
          className="px-4 py-2 flex items-center gap-2 text-sm text-white/80 hover:bg-white/10 cursor-pointer transition-colors"
        >
          {timeRange} <ChevronRight size={16} />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', val: dashboardData ? `$${dashboardData.total_revenue.toLocaleString()}` : '$0', change: '', trend: 'up' },
          { label: 'Total Orders', val: dashboardData ? dashboardData.total_orders.toLocaleString() : '0', change: '', trend: 'up' },
          { label: 'Total Products', val: dashboardData ? dashboardData.total_products.toLocaleString() : '0', change: '', trend: 'up' },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-6" hover>
            <div className="flex justify-between items-start mb-4">
              <span className="text-white/40 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
              {stat.change && (
                <span className={cn("text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1", stat.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400')}>
                  {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                  {stat.change}
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-white">{stat.val}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-8 min-h-[400px] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-white">Revenue & Orders</h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2 text-white/60"><span className="w-3 h-3 rounded-full bg-blue-500" /> Revenue ($)</div>
            <div className="flex items-center gap-2 text-white/60"><span className="w-3 h-3 rounded-full bg-purple-500" /> Orders</div>
          </div>
        </div>
        <div className="flex-1 w-full min-h-[280px]">
          {salesData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-white/40 text-sm">
              No sales data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }} dy={10} />
                <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-8">
          <h3 className="text-xl font-bold text-white mb-6">Top Selling Products</h3>
          <div className="space-y-6">
            {topProducts.length === 0 ? (
              <div className="text-center py-12 text-white/40 text-sm">
                No product data yet
              </div>
            ) : (
              topProducts.map((product: any, i: number) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-2xl" style={{ background: 'linear-gradient(135deg, ' + product.color + ' 0%, ' + product.color + '88 100%)' }}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-medium">{product.name}</span>
                      <span className="text-white/60">${product.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mr-4">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(product.sales / 124) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: product.color }}
                        />
                      </div>
                      <span className="text-white/40 text-sm">{product.sales} sold</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
          <h3 className="text-xl font-bold text-white mb-6">Warehouse Performance</h3>
          <div className="space-y-4">
            {warehouseData.length === 0 ? (
              <div className="text-center py-12 text-white/40 text-sm">
                No warehouse data yet
              </div>
            ) : (
              warehouseData.map((wh: any, i: number) => (
                <div key={i} className="p-4 hover:bg-white/5 rounded-xl transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium">{wh.name}</span>
                    <span className="text-emerald-400 text-sm font-bold">{wh.efficiency}% efficiency</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">{wh.orders} orders processed</span>
                    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${wh.efficiency}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: wh.color }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

function SettingsView({ user, onLogout, onUserUpdated }: { user: any, onLogout: () => void, onUserUpdated: (u: any) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    phone: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setImgError(false)
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        company: user.company || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { response, data } = await api.updateProfile(formData)
      if (response.ok) {
        onUserUpdated(data)
      } else {
        console.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setIsUploadingAvatar(true)
      try {
        const { response, data } = await api.updateProfile({ avatar: e.target.files[0] })
        if (response.ok) {
          onUserUpdated(data)
        }
      } catch (error) {
        console.error('Error uploading avatar:', error)
      } finally {
        setIsUploadingAvatar(false)
      }
    }
  }

  const initials = user?.first_name ? user.first_name[0].toUpperCase() : (user?.username?.[0]?.toUpperCase() || 'U')

  return (
    <div className="p-1 space-y-6 pb-24 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight">Settings</h2>
          <p className="text-white/40 mt-2">Manage your preferences and account security.</p>
        </div>
      </div>

      <GlassCard className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  {!imgError && user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover" 
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <span className="text-white font-bold text-3xl">{initials}</span>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                title="Change Profile Picture"
              >
                {isUploadingAvatar ? <Clock size={16} className="animate-spin" /> : <Plus size={16} />}
              </button>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : (user?.username || 'User')}
              </h3>
              <p className="text-white/40">{user?.email || 'No email'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm text-white/60 ml-1">First Name</label>
            <div className="relative">
              <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/60 ml-1">Last Name</label>
            <div className="relative">
              <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/60 ml-1">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/60 ml-1">Company</label>
            <div className="relative">
              <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-white/60 ml-1">Phone</label>
            <div className="relative">
              <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </GlassCard>

      <GlassCard className="p-6 border-red-500/20 bg-red-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
              <LogOut size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold">Sign Out</h3>
              <p className="text-white/40 text-sm">Securely log out of your account</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-6 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors font-medium"
          >
            Log Out
          </button>
        </div>
      </GlassCard>
    </div>
  )
}

// --- Global Components (Modals, Palettes) ---

function CommandPalette({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (id: string) => void }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[20vh] px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-[#0F0F10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center px-4 py-3 border-b border-white/5">
          <Search className="text-white/40 w-5 h-5" />
          <input autoFocus placeholder="Type a command or search..." className="flex-1 bg-transparent border-none outline-none text-white px-4 py-2 text-lg placeholder:text-white/20" />
          <span className="text-xs text-white/30 font-mono px-2 py-1 bg-white/5 rounded">ESC</span>
        </div>
        <div className="p-2">
          <div className="text-xs font-bold text-white/30 px-3 py-2">SUGGESTIONS</div>
          {[
            { icon: Plus, label: 'Create New Order', action: 'new_order' },
            { icon: Box, label: 'Go to Inventory', action: 'inventory' },
            { icon: Warehouse, label: 'Warehouse Management', action: 'warehouses' },
            { icon: Users, label: 'Customer Management', action: 'customers' },
            { icon: Activity, label: 'Reports & Analytics', action: 'reports' },
            { icon: Settings, label: 'Open Settings', action: 'settings' },
            { icon: LogOut, label: 'Log Out', action: 'logout' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => { onSelect(item.action); onClose() }}
              className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/5 rounded-xl transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 group-hover:text-white group-hover:bg-white/10 transition-all">
                <item.icon size={16} />
              </div>
              <span className="text-white/70 group-hover:text-white">{item.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// --- Main Layout ---

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Get initial tab from URL params, default to 'home'
  const getInitialTab = () => {
    const tab = searchParams.get('tab')
    if (tab && ['home', 'orders', 'inventory', 'analytics', 'settings'].includes(tab)) {
      return tab
    }
    return 'home'
  }

  const [activeTab, setActiveTab] = useState(getInitialTab())

  // Update activeTab when URL params change
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['home', 'orders', 'inventory', 'analytics', 'settings'].includes(tab)) {
      setActiveTab(tab)
    } else if (!tab) {
      setActiveTab('home')
    }
  }, [searchParams])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [toasts, setToasts] = useState<{ id: number, msg: string, type: 'success' | 'error' }[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Modals State
  const [modals, setModals] = useState({
    newOrder: false,
    newProduct: false,
    editProfile: false,
    logout: false,
    restockItem: false
  })

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  // Reset image error state when user avatar changes
  useEffect(() => {
    setImgError(false)
  }, [user?.avatar])

  // Fetch customers, warehouses, and user profile
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [customersRes, warehousesRes, profileRes] = await Promise.all([
          api.getCustomers(1),
          api.getWarehouses(),
          api.getProfile()
        ])
        if (customersRes.response.ok) {
          setCustomers(customersRes.data.results || customersRes.data || [])
        }
        if (warehousesRes.response.ok) {
          setWarehouses(warehousesRes.data.results || warehousesRes.data || [])
        }
        if (profileRes.response.ok) {
          setUser(profileRes.data)
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error)
      }
    }
    fetchDropdownData()
  }, [])

  // ========== State Management ==========
  // All the data we need to display on the dashboard

  // Dashboard overview stats - revenue, order counts, etc.
  const [dashboardData, setDashboardData] = useState<{
    total_revenue: number
    total_orders: number
    total_products: number
    total_stock: number
    recent_orders: any[]
    top_products: any[]
    weekly_data: any[]
  } | null>(null)
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true)

  // Orders and products for the respective tabs
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  const fetchNotifications = useCallback(async () => {
    try {
      const { response, data } = await api.getNotifications()
      if (response.ok) {
        setNotifications(data.results || data || [])
      }
    } catch (e) {
      console.error('Failed to fetch notifications', e)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // ========== Data Fetching ==========
  // Fetch dashboard stats when user is on the home tab
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoadingDashboard(true)
        const { response, data } = await api.getDashboardStats()
        if (response.ok) {
          setDashboardData(data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setIsLoadingDashboard(false)
      }
    }

    // Only fetch when on home tab to avoid unnecessary API calls
    if (activeTab === 'home') {
      fetchDashboardStats()
    }
  }, [activeTab])

  // Fetch orders when user switches to orders tab
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === 'orders') {
        try {
          setIsLoadingOrders(true)
          const { response, data } = await api.getOrders(1)
          if (response.ok) {
            // Handle paginated response (results) or direct array
            setOrders(data.results || data)
          }
        } catch (error) {
          console.error('Failed to fetch orders:', error)
        } finally {
          setIsLoadingOrders(false)
        }
      }
    }
    fetchOrders()
  }, [activeTab])

  // Fetch products when user switches to inventory tab OR when creating order/product
  useEffect(() => {
    const fetchProducts = async () => {
      // Always fetch if we don't have products yet, or if tab/modal requires it
      if (activeTab === 'inventory' || modals.newOrder || modals.newProduct || products.length === 0) {
        try {
          setIsLoadingProducts(true)
          const { response, data } = await api.getProducts(1)
          if (response.ok) {
            // Handle paginated response (results) or direct array
            setProducts(data.results || data)
          }
        } catch (error) {
          console.error('Failed to fetch products:', error)
        } finally {
          setIsLoadingProducts(false)
        }
      }
    }
    fetchProducts()
  }, [activeTab, modals.newOrder, modals.newProduct])

  const handleRestockItem = (itemId: number) => {
    setSelectedItemId(itemId)
    setModals(p => ({ ...p, restockItem: true }))
  }

  const addToast = (msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, type }])
  }

  const handleCommandAction = (action: string) => {
    if (action === 'new_order') setModals(p => ({ ...p, newOrder: true }))
    if (action === 'inventory') setActiveTab('inventory')
    if (action === 'warehouses') navigate('/warehouses')
    if (action === 'customers') navigate('/customers')
    if (action === 'reports') navigate('/reports')
    if (action === 'settings') setActiveTab('settings')
    if (action === 'logout') setModals(p => ({ ...p, logout: true }))
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setShowCommandPalette(open => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])


  return (
    <div className="min-h-screen bg-[#0d0d12] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}</style>

      <LiquidBackground />

      <AnimatePresence>
        {toasts.map(t => (
          <Toast key={t.id} message={t.msg} type={t.type} onClose={() => setToasts(prev => prev.filter(i => i.id !== t.id))} />
        ))}
      </AnimatePresence>

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSelect={handleCommandAction}
      />

      {/* Modals */}
      <Modal isOpen={modals.newOrder} onClose={() => setModals(p => ({ ...p, newOrder: false }))} title="Create New Order">
        <CreateOrderForm
          customers={customers}
          products={products}
          onClose={() => setModals(p => ({ ...p, newOrder: false }))}
          onSuccess={() => {
            addToast("Order created successfully")
            setModals(p => ({ ...p, newOrder: false }))
            fetchNotifications() // Refetch notifications to show "New Order Created"
            if (activeTab === 'orders') {
              // Refresh orders
              const fetchOrders = async () => {
                try {
                  const { response, data } = await api.getOrders(1)
                  if (response.ok) {
                    setOrders(data.results || data)
                  }
                } catch (error) {
                  console.error('Failed to fetch orders:', error)
                }
              }
              fetchOrders()
            } else {
              setActiveTab('orders')
              navigate('/dashboard?tab=orders')
            }
          }}
          onError={(msg) => addToast(msg, 'error')}
        />
      </Modal>

      <Modal isOpen={modals.newProduct} onClose={() => setModals(p => ({ ...p, newProduct: false }))} title="Add New Product">
        <CreateProductForm
          onClose={() => setModals(p => ({ ...p, newProduct: false }))}
          onSuccess={() => {
            addToast("Product created successfully")
            setModals(p => ({ ...p, newProduct: false }))
            if (activeTab === 'inventory') {
              // Refresh products
              const fetchProducts = async () => {
                try {
                  setIsLoadingProducts(true)
                  const { response, data } = await api.getProducts(1)
                  if (response.ok) {
                    setProducts(data.results || data)
                  }
                } catch (error) {
                  console.error('Failed to fetch products:', error)
                } finally {
                  setIsLoadingProducts(false)
                }
              }
              fetchProducts()
            } else {
              setActiveTab('inventory')
              navigate('/dashboard?tab=inventory')
            }
          }}
          onError={(msg) => addToast(msg, 'error')}
        />
      </Modal>

      <Modal isOpen={modals.editProfile} onClose={() => setModals(p => ({ ...p, editProfile: false }))} title="Edit Profile">
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center relative overflow-hidden group cursor-pointer">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">CHANGE</div>
            </div>
          </div>
          <input className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none" defaultValue="Alex Chen" />
          <input className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none" defaultValue="Administrator" />
          <button onClick={() => { setModals(p => ({ ...p, editProfile: false })); addToast("Profile updated") }} className="w-full py-3 rounded-xl bg-white text-black font-bold mt-2">Save Changes</button>
        </div>
      </Modal>

      <Modal isOpen={modals.logout} onClose={() => setModals(p => ({ ...p, logout: false }))} title="Confirm Logout">
        <div className="text-center">
          <p className="text-white/60 mb-6">Are you sure you want to log out? You will need to sign in again to access your dashboard.</p>
          <div className="flex gap-3">
            <button onClick={() => setModals(p => ({ ...p, logout: false }))} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white">Cancel</button>
            <button
              onClick={async () => {
                setModals(p => ({ ...p, logout: false }))
                try {
                  const { api } = await import('../lib/api')
                  await api.logout()
                  addToast("Logged out successfully. Redirecting...", "error")
                  setTimeout(() => navigate('/login'), 1500)
                } catch (error) {
                  addToast("Logout error", "error")
                  navigate('/login')
                }
              }}
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
            >
              Log Out
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modals.restockItem} onClose={() => setModals(p => ({ ...p, restockItem: false }))} title="Restock Inventory">
        <RestockForm
          productId={selectedItemId}
          product={products.find((p: any) => p.id === selectedItemId)}
          warehouses={warehouses}
          onClose={() => setModals(p => ({ ...p, restockItem: false }))}
          onSuccess={() => {
            addToast("Inventory restocked successfully")
            setModals(p => ({ ...p, restockItem: false }))
            fetchNotifications() // Refetch notifications for stock alerts
            // Refresh products
            const fetchProducts = async () => {
              try {
                setIsLoadingProducts(true)
                const { response, data } = await api.getProducts(1)
                if (response.ok) {
                  setProducts(data.results || data)
                }
              } catch (error) {
                console.error('Failed to fetch products:', error)
              } finally {
                setIsLoadingProducts(false)
              }
            }
            fetchProducts()
          }}
          onError={(msg) => addToast(msg, 'error')}
        />
      </Modal>



      <header className="fixed top-0 left-0 right-0 h-28 z-40 flex items-center justify-between px-8 md:px-12 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3">
          <img src={logo} alt="Shipra Logo" className="h-12 w-12 object-contain rounded-full" />
        </div>

        <div className={cn("pointer-events-auto relative transition-all duration-300", isSearchFocused ? "w-96" : "w-64")}>
          <div className={cn(
            "px-5 py-3 rounded-full flex items-center gap-4 shadow-2xl backdrop-blur-md transition-all duration-300",
            isSearchFocused
              ? "bg-white/10 border-2 border-accent/50 shadow-[0_0_30px_rgba(0,232,255,0.3)]"
              : "glass-card border border-white/10 bg-black/20"
          )}>
            <Search size={18} className={cn("transition-colors", isSearchFocused ? "text-accent" : "text-white/40")} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none ring-0 focus:ring-0 focus:border-none text-sm text-white placeholder:text-white/30 w-full transition-all"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-6 relative">
          <button
            className="relative group"
            onClick={() => {
              setShowNotifications(!showNotifications)
              if (!showNotifications) {
                addToast("Opening notifications")
              }
            }}
          >
            <Bell size={24} className="text-white/60 group-hover:text-white transition-colors" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-4 w-80 bg-[#0F0F10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                  <span className="font-bold text-white">Notifications</span>
                  <span 
                    className="text-xs text-accent cursor-pointer"
                    onClick={async () => {
                      try {
                        await api.markAllNotificationsRead()
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                        addToast("All notifications marked as read")
                      } catch (e) {
                         addToast("Failed to mark read")
                      }
                    }}
                  >
                    Mark all read
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-white/40 text-sm">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                        onClick={async () => {
                          if (!n.read) {
                            try {
                              await api.markNotificationRead(n.id)
                              setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))
                            } catch (e) {
                              console.error('Failed to mark notification as read', e)
                            }
                          }
                        }}
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]", 
                            n.read ? "bg-white/10" : 
                            n.type === 'alert' ? 'bg-amber-500 shadow-amber-500/50' : 
                            n.type === 'error' ? 'bg-red-500 shadow-red-500/50' : 
                            'bg-blue-500 shadow-blue-500/50'
                          )} />
                          <span className={cn("text-sm font-bold text-white transition-opacity", n.read && "font-normal opacity-50")}>{n.title}</span>
                        </div>
                        <p className={cn("text-xs pl-5 transition-opacity", n.read ? "text-white/20" : "text-white/50")}>{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <div
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg cursor-pointer hover:scale-105 hover:bg-accent hover:border-accent transition-all duration-300 bg-accent/20 flex items-center justify-center relative z-50"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              {!imgError && user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-accent font-bold text-lg">
                  {user?.first_name ? user.first_name[0].toUpperCase() : (user?.username?.[0]?.toUpperCase() || 'U')}
                </span>
              )}
            </div>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-56 bg-[#0F0F10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-white/5">
                    <p className="font-bold text-white">
                      {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : (user?.username || 'User')}
                    </p>
                    <p className="text-xs text-white/50">{user?.email || 'No email'}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => { setActiveTab('settings'); setShowProfileMenu(false) }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/80 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => { setModals(p => ({ ...p, logout: true })); setShowProfileMenu(false) }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className="pt-32 px-6 md:px-12 pb-12 min-h-screen max-w-[1600px] mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <Overview
                dashboardData={dashboardData}
                isLoading={isLoadingDashboard}
                customers={customers}
                onAddProduct={() => {
                  setActiveTab('inventory')
                  navigate('/dashboard?tab=inventory')
                  setTimeout(() => setModals(p => ({ ...p, newProduct: true })), 100)
                }}
                onExport={async () => {
                  try {
                    const { exportToCSV } = await import('../lib/export')
                    const data = [
                      { Month: 'Jan', Revenue: '$124,000', Orders: 342 },
                      { Month: 'Feb', Revenue: '$158,000', Orders: 412 },
                      { Month: 'Mar', Revenue: '$142,000', Orders: 389 },
                      { Month: 'Apr', Revenue: '$189,000', Orders: 521 },
                      { Month: 'May', Revenue: '$165,000', Orders: 456 },
                      { Month: 'Jun', Revenue: '$212,000', Orders: 587 },
                    ]
                    exportToCSV(data, 'revenue-report')
                    addToast("Report downloaded successfully")
                  } catch (error) {
                    addToast("Export failed. Please try again.", "error")
                  }
                }}
                onCreateOrder={() => setModals(p => ({ ...p, newOrder: true }))}
              />
            </motion.div>
          )}
          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <OrdersList searchQuery={searchQuery} onCreateOrder={() => setModals(p => ({ ...p, newOrder: true }))} orders={orders} />
            </motion.div>
          )}
          {activeTab === 'inventory' && (
            <motion.div key="inventory" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <InventoryGrid
                searchQuery={searchQuery}
                onRestockItem={handleRestockItem}
                products={products}
                isLoading={isLoadingProducts}
                onAddProduct={() => setModals(p => ({ ...p, newProduct: true }))}
              />
            </motion.div>
          )}
          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <AnalyticsView 
                timeRange="Last 7 Days" 
                onToggleTime={() => addToast("Time range updated")} 
                dashboardData={dashboardData}
                isLoading={isLoadingDashboard}
              />
            </motion.div>
          )}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <SettingsView
                user={user}
                onLogout={() => setModals(p => ({ ...p, logout: true }))}
                onUserUpdated={(u) => {
                  setUser(u)
                  addToast("Profile updated")
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <SystemDock />
    </div>
  )
}

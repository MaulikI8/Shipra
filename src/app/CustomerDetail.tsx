import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { toast } from '../lib/toast'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  CreditCard,
  FileText,
  Edit,
  Download,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, BarChart, Bar } from 'recharts'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))



function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl', className)}>
      {children}
    </div>
  )
}

export default function CustomerDetail() {
  const navigate = useNavigate()
  const { customerId } = useParams<{ customerId: string }>()
  const [customer, setCustomer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!customerId) return
      try {
        setIsLoading(true)
        const { response, data } = await api.getCustomer(parseInt(customerId))
        if (response.ok) {
          setCustomer(data)
        } else {
          toast('Failed to load customer details', 'error')
        }
      } catch (error) {
        console.error('Error fetching customer:', error)
        toast('Error loading customer details', 'error')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCustomer()
  }, [customerId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d12] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#0d0d12] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Customer not found</p>
          <button
            onClick={() => navigate('/customers')}
            className="px-4 py-2 rounded-full bg-accent text-black font-medium"
          >
            Back to Customers
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white">
      <div className="relative z-10">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/40 border-b border-white/10">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/customers')}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{customer.name}</h1>
                <p className="text-sm text-white/40">{customer.company}</p>
              </div>
            </div>
            
            <button
              onClick={() => alert('Edit customer - would open edit form in production')}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center gap-2 transition-colors"
            >
              <Edit size={18} />
              Edit
            </button>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info Card */}
              <GlassCard className="p-6">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                    {customer.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{customer.name}</h2>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        customer.status === 'active'
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-gray-500/20 text-gray-400"
                      )}>
                        {customer.status?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white/60">{customer.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-white/40" />
                    <div>
                      <p className="text-xs text-white/40">Email</p>
                      <p className="text-white">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-white/40" />
                    <div>
                      <p className="text-xs text-white/40">Phone</p>
                      <p className="text-white">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-white/40" />
                    <div>
                      <p className="text-xs text-white/40">Address</p>
                      <p className="text-white">{customer.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-white/40" />
                    <div>
                      <p className="text-xs text-white/40">Member Since</p>
                      <p className="text-white">{new Date(customer.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Financial Overview */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-bold mb-6">Financial Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-white/40 mb-1">Total Spent</p>
                    <p className="text-2xl font-bold">${parseFloat(customer.total_spent).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Credit Limit</p>
                    <p className="text-2xl font-bold">${parseFloat(customer.credit_limit).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Available Credit</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      ${(parseFloat(customer.credit_limit) - parseFloat(customer.total_spent)).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold">{customer.total_orders}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Monthly Spend Chart */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-bold mb-6">Monthly Spending</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={customer.monthly_spend || [
                      { month: 'Jan', amount: 0 },
                      { month: 'Feb', amount: 0 },
                      { month: 'Mar', amount: 0 },
                    ]}>
                      <defs>
                        <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00E8FF" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#00E8FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#ffffff40" />
                      <Tooltip 
                        contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#00E8FF" 
                        strokeWidth={3}
                        fill="url(#spendGradient)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Recent Orders */}
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Recent Orders</h3>
                  <button
                    onClick={() => navigate('/dashboard?tab=orders')}
                    className="text-sm text-accent hover:text-accent/80"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {customer.recent_orders?.length > 0 ? (
                    customer.recent_orders.map((order: any) => (
                      <div
                        key={order.id}
                        onClick={() => navigate('/orders/' + order.id)}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                            <Package size={20} className="text-accent" />
                          </div>
                          <div>
                            <p className="font-medium">{order.order_number}</p>
                            <p className="text-sm text-white/40">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold">${parseFloat(order.total_amount).toLocaleString()}</p>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            order.status === 'delivered' ? "bg-emerald-500/20 text-emerald-400" :
                            order.status === 'shipped' ? "bg-blue-500/20 text-blue-400" :
                            order.status === 'processing' ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-gray-500/20 text-gray-400"
                          )}>
                            {order.status?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-white/40">No recent orders</div>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-white/40 mb-1">Payment Terms</p>
                    <p className="text-lg font-bold">{customer.payment_terms}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Contact Info */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-white/40 mb-1">Email</p>
                    <p className="text-white">{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Phone</p>
                    <p className="text-white">{customer.phone || 'N/A'}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Shipping Addresses */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold mb-4">Shipping Addresses</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-sm text-white/60">{customer.address || 'No address provided'}</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


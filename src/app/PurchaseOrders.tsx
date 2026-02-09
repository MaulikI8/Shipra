import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  FileText,
  Search,
  Filter,
  Plus,
  Package,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Building
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

// Mock Data
const PURCHASE_ORDERS = [
  {
    id: 'PO-2024-001',
    supplier: 'Global Components Inc',
    items: 12,
    total: '$45,600',
    status: 'Received',
    orderDate: '2024-01-10',
    expectedDate: '2024-01-15',
    receivedDate: '2024-01-14'
  },
  {
    id: 'PO-2024-002',
    supplier: 'Tech Supplies Co',
    items: 8,
    total: '$23,400',
    status: 'In Transit',
    orderDate: '2024-01-12',
    expectedDate: '2024-01-18',
    receivedDate: null
  },
  {
    id: 'PO-2024-003',
    supplier: 'Manufacturing Parts Ltd',
    items: 25,
    total: '$67,800',
    status: 'Pending',
    orderDate: '2024-01-14',
    expectedDate: '2024-01-20',
    receivedDate: null
  },
  {
    id: 'PO-2024-004',
    supplier: 'Electronics Warehouse',
    items: 15,
    total: '$34,200',
    status: 'Received',
    orderDate: '2024-01-08',
    expectedDate: '2024-01-12',
    receivedDate: '2024-01-11'
  },
  {
    id: 'PO-2024-005',
    supplier: 'Industrial Supplies',
    items: 6,
    total: '$12,500',
    status: 'Cancelled',
    orderDate: '2024-01-05',
    expectedDate: '2024-01-10',
    receivedDate: null
  }
]

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl', className)}>
      {children}
    </div>
  )
}

export default function PurchaseOrders() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const filteredOrders = PURCHASE_ORDERS.filter(po => {
    const matchesSearch = po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         po.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || po.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: PURCHASE_ORDERS.length,
    pending: PURCHASE_ORDERS.filter(p => p.status === 'Pending').length,
    inTransit: PURCHASE_ORDERS.filter(p => p.status === 'In Transit').length,
    received: PURCHASE_ORDERS.filter(p => p.status === 'Received').length
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Received': return <CheckCircle size={20} className="text-emerald-400" />
      case 'In Transit': return <Truck size={20} className="text-blue-400" />
      case 'Pending': return <Clock size={20} className="text-yellow-400" />
      case 'Cancelled': return <XCircle size={20} className="text-red-400" />
      default: return <Clock size={20} className="text-white/40" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Received': return 'bg-emerald-500/20 text-emerald-400'
      case 'In Transit': return 'bg-blue-500/20 text-blue-400'
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'Cancelled': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white">
      <div className="relative z-10">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/40 border-b border-white/10">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Purchase Orders</h1>
                <p className="text-sm text-white/40">{filteredOrders.length} purchase orders</p>
              </div>
            </div>
            
            <button
              onClick={() => alert('Create PO - would open form in production')}
              className="px-4 py-2 rounded-full bg-accent text-black font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              New PO
            </button>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <FileText size={24} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Total POs</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Clock size={24} className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Truck size={24} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60">In Transit</p>
                  <p className="text-2xl font-bold">{stats.inTransit}</p>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle size={24} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Received</p>
                  <p className="text-2xl font-bold">{stats.received}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Search and Filters */}
          <GlassCard className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search purchase orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
              
              <div className="flex gap-2">
                {['ALL', 'Pending', 'In Transit', 'Received', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                      filterStatus === status
                        ? "bg-accent text-black"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Purchase Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((po) => (
              <GlassCard
                key={po.id}
                className="p-6 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                        <FileText size={24} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{po.id}</h3>
                        <p className="text-white/60 flex items-center gap-2">
                          <Building size={16} />
                          {po.supplier}
                        </p>
                      </div>
                      <span className={cn("px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2", getStatusColor(po.status))}>
                        {getStatusIcon(po.status)}
                        {po.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-xs text-white/40 mb-1">Items</p>
                        <p className="text-lg font-bold">{po.items}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-1">Total</p>
                        <p className="text-lg font-bold">{po.total}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-1">Order Date</p>
                        <p className="text-lg font-bold">{po.orderDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-1">Expected</p>
                        <p className="text-lg font-bold">{po.expectedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <GlassCard className="p-12 text-center">
              <FileText size={48} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/60">No purchase orders found</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}


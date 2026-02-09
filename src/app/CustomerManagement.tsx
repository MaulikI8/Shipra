import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pagination } from '../components/Pagination'
import { api } from '../lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { toast, ToastContainer } from '../lib/toast'
import {
  ArrowLeft,
  X,
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Building,
  MapPin,
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Home,
  ShoppingCart,
  Box,
  Warehouse
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

// Mock Data - Empty for new accounts
const CUSTOMERS: Array<{
  id: number
  name: string
  email: string
  phone: string
  company: string
  address: string
  status: string
  totalOrders: number
  totalSpent: string
  lastOrder: string
  joinDate: string
  creditLimit: string
  paymentTerms: string
}> = []

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl', className)}>
      {children}
    </div>
  )
}

// Removed BottomDock - using Dashboard navigation instead

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
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

function CreateCustomerForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    credit_limit: '',
    payment_terms: 'Net 30'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast('Name and Email are required', 'error')
      return
    }

    try {
      setIsSubmitting(true)
      const { response, data } = await api.createCustomer({
        ...formData,
        credit_limit: formData.credit_limit ? parseFloat(formData.credit_limit) : 0
      })

      if (response.ok) {
        toast('Customer created successfully')
        onSuccess()
      } else {
        toast(data.detail || data.error || 'Failed to create customer', 'error')
      }
    } catch (error) {
      toast('Failed to create customer', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-white/60">Full Name *</label>
        <input
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
          placeholder="John Doe"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/60">Email *</label>
        <input
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
          placeholder="john@example.com"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-2">
          <label className="text-sm text-white/60">Company</label>
          <input
            value={formData.company}
            onChange={e => setFormData({...formData, company: e.target.value})}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
            placeholder="Acme Inc"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/60">Phone</label>
          <input
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
            placeholder="+1 234 567 890"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/60">Address</label>
        <input
          value={formData.address}
          onChange={e => setFormData({...formData, address: e.target.value})}
          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
          placeholder="123 Main St"
        />
      </div>
       <div className="grid grid-cols-2 gap-4">
         <div className="space-y-2">
          <label className="text-sm text-white/60">Credit Limit</label>
          <input
            type="number"
            value={formData.credit_limit}
            onChange={e => setFormData({...formData, credit_limit: e.target.value})}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
            placeholder="5000"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/60">Payment Terms</label>
          <select
            value={formData.payment_terms}
            onChange={e => setFormData({...formData, payment_terms: e.target.value})}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="Net 30" className="bg-[#0f0f12] text-white">Net 30</option>
            <option value="Net 60" className="bg-[#0f0f12] text-white">Net 60</option>
            <option value="Immediate" className="bg-[#0f0f12] text-white">Immediate</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors">Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-xl bg-accent text-black font-bold hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Customer'}
        </button>
      </div>
    </div>
  )
}

export default function CustomerManagement() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showAddModal, setShowAddModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
  const [customers, setCustomers] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalRevenue: '$0',
    avgOrderValue: '$0'
  })
  const [isLoading, setIsLoading] = useState(true)

  // Fetch consumers data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch stats
        const { response: statsRes, data: statsData } = await api.getCustomerStats()
        if (statsRes.ok) {
           setStats({
             total: statsData.total,
             active: statsData.active,
             totalRevenue: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(statsData.totalRevenue),
             avgOrderValue: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(statsData.avgValue)
           })
        }

        // Fetch customers list
        const { response: listRes, data: listData } = await api.getCustomers(currentPage, searchQuery)
        if (listRes.ok) {
          setCustomers(listData.results || listData || [])
          // Update total pages if API provides count
          // const total = listData.count || listData.length
          // setTotalPages(Math.ceil(total / itemsPerPage))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
}, [currentPage, searchQuery, refreshTrigger])

  // Client-side filtering if API doesn't support complex filters yet (status is client-side for now)
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
       // Search is handled by API, but we keep this for status or extra safety
       const matchesStatus = filterStatus === 'ALL' || (customer.is_active ? 'Active' : 'Inactive') === filterStatus
       return matchesStatus
    })
  }, [customers, filterStatus])

  // Pagination logic needs to be adjusted based on API response
  // For now assuming API returns page results directly or we slice local
  // Since we fetch by page from API, filteredCustomers IS the page (mostly)
  // If API supports search, we trust it.

  // API handles pagination, so 'customers' is already the page
  const paginatedCustomers = customers
  const totalPages = 1 // Placeholder until API returns total count
  
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
                <h1 className="text-2xl font-bold">Customer Management</h1>
                <p className="text-sm text-white/40">{stats.total} customers</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-full bg-accent text-black font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Customer
            </button>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users size={24} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Total Customers</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp size={24} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Active</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <DollarSign size={24} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Total Revenue</p>
                  <p className="text-2xl font-bold">{stats.totalRevenue}</p>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Package size={24} className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Avg. Value</p>
                  <p className="text-2xl font-bold">{stats.avgOrderValue}</p>
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
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
              
              <div className="flex gap-2">
                {['ALL', 'Active', 'Inactive'].map((status) => (
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

          {/* Customers List */}
          <div className="space-y-4">
            {paginatedCustomers.map((customer) => (
              <GlassCard
                key={customer.id}
                className="p-6 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div onClick={() => navigate('/customers/' + customer.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {customer.name[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{customer.name}</h3>
                        <p className="text-sm text-white/60">{customer.company}</p>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        customer.status === 'Active'
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-gray-500/20 text-gray-400"
                      )}>
                        {customer.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <Mail size={16} />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60">
                        <Phone size={16} />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60">
                        <MapPin size={16} />
                        <span className="text-sm">{customer.address}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-xs text-white/40 mb-1">Total Orders</p>
                        <p className="text-lg font-bold">{customer.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-1">Total Spent</p>
                        <p className="text-lg font-bold">{customer.totalSpent}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-1">Credit Limit</p>
                        <p className="text-lg font-bold">{customer.creditLimit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-1">Last Order</p>
                        <p className="text-lg font-bold">{customer.lastOrder}</p>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <GlassCard className="p-12 text-center">
              <Users size={48} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/60 mb-4">No customers found</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setFilterStatus('ALL')
                }}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                Clear Filters
              </button>
            </GlassCard>
          )}

          {filteredCustomers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredCustomers.length}
              onItemsPerPageChange={(items) => {
                setItemsPerPage(items)
                setCurrentPage(1)
              }}
            />
          )}
        </div>
      </div>

      <AnimatePresence>
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Customer">
          <CreateCustomerForm 
            onClose={() => setShowAddModal(false)} 
            onSuccess={() => {
              setShowAddModal(false)
              setRefreshTrigger(prev => prev + 1)
            }}
          />
        </Modal>
      </AnimatePresence>
      <ToastContainer />
    </div>
  )
}


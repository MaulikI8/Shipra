import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../lib/api'
import { toast } from '../lib/toast'
import { MagneticButton } from '../components/MagneticButton'
import {
  ArrowLeft,
  MapPin,
  Package,
  TrendingUp,
  Users,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  Download,
  Settings,
  Activity,
  Truck,
  Box,
  AlertCircle,
  CheckCircle,
  Clock,
  Home,
  ShoppingCart,
  Warehouse,
  Map as MapIcon,
  List
} from 'lucide-react'
import { WarehouseGlobe } from '../components/WarehouseGlobe'
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, AreaChart, Area } from 'recharts'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

// Form Component for Creating Warehouse
function CreateWarehouseForm({ onClose, onSuccess, onError }: {
  onClose: () => void
  onSuccess: () => void
  onError: (msg: string) => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: 'USA',
    zip_code: '',
    capacity: '',
    latitude: '',
    longitude: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.zip_code) {
      onError('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      const { response, data } = await api.createWarehouse({
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zip_code: formData.zip_code,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined
      })

      if (response.ok) {
        onSuccess()
      } else {
        onError(data.detail || data.error || 'Failed to create warehouse')
      }
    } catch (error: any) {
      onError(error.message || 'Failed to create warehouse')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-white/60">Warehouse Name *</label>
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
          placeholder="e.g., Chicago Distribution"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/60">Address *</label>
        <input
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
          placeholder="Street address"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-white/60">City *</label>
          <input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
            placeholder="City"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/60">State *</label>
          <input
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
            placeholder="State"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-white/60">ZIP Code *</label>
          <input
            value={formData.zip_code}
            onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
            placeholder="ZIP Code"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/60">Country</label>
          <input
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
            placeholder="Country"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/60">Capacity (units)</label>
        <input
          type="number"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
          placeholder="50000"
        />
      </div>

      <div className="border-t border-white/10 pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm text-white/60">Coordinates (Optional)</label>
          <span className="text-xs text-white/40">Auto-geocoded if left empty</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-white/40">Latitude</label>
            <input
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
              placeholder="e.g., 40.7128"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-white/40">Longitude</label>
            <input
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
              placeholder="e.g., -74.0060"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors">Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Warehouse'}
        </button>
      </div>
    </div>
  )
}

const WAREHOUSES: Array<{
  id: number
  name: string
  code: string
  address: string
  manager: string
  phone: string
  email: string
  status: string
  capacity: number
  currentStock: number
  totalProducts: number
  activeOrders: number
  efficiency: number
  employees: number
  operatingHours: string
  established: string
  type: string
  monthlyStats: Array<{ name: string, orders: number }>
}> = []

function GlassCard({ children, className, hover = false, onClick }: { children: React.ReactNode; className?: string; hover?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
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
        className="relative w-full max-w-2xl bg-[#0F0F10] border border-white/10 rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
        {children}
      </motion.div>
    </div>
  )
}

export default function WarehouseManagement() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [stats, setStats] = useState({
    totalCapacity: 0,
    totalStock: 0,
    avgEfficiency: 0,
    activeOrders: 0
  })

  // Fetch warehouses and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [warehousesRes, statsRes] = await Promise.all([
          api.getWarehouses(),
          api.getWarehouseStats()
        ])
        
        if (warehousesRes.response.ok) {
          setWarehouses(warehousesRes.data.results || warehousesRes.data || [])
        }
        
        if (statsRes.response.ok) {
          setStats(statsRes.data)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        toast('Failed to load warehouse data', 'error')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredWarehouses = warehouses.filter(wh =>
    wh.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wh.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wh.city?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDisplayDetails = (warehouse: any) => {
    setSelectedWarehouse(warehouse)
    setShowDetailsModal(true)
  }

  // Alias for compatibility if needed, or simply use these
  const handleViewDetails = handleDisplayDetails

  const handleEdit = (warehouse: any) => {
    setSelectedWarehouse(warehouse)
    setShowEditModal(true)
  }

  const handleDelete = (warehouse: any) => {
    setSelectedWarehouse(warehouse)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedWarehouse) return
    try {
      const { response } = await api.deleteWarehouse(selectedWarehouse.id)
      if (response.ok) {
        toast('Warehouse deleted successfully')
        setWarehouses(prev => prev.filter(w => w.id !== selectedWarehouse.id))
        setShowDeleteModal(false)
      } else {
        toast('Failed to delete warehouse', 'error')
      }
    } catch (error) {
      toast('Error deleting warehouse', 'error')
    }
  }

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
            <h1 className="text-xl font-bold text-white">Warehouse Management</h1>
            <p className="text-xs text-white/40">{warehouses.length} active locations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mr-2">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all",
                viewMode === 'list' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
              )}
            >
              <List size={14} /> LIST
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={cn(
                "px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all",
                viewMode === 'map' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
              )}
            >
              <MapIcon size={14} /> MAP
            </button>
          </div>

          <MagneticButton
            onClick={() => setShowAddModal(true)}
            variant="primary"
          >
            <Plus size={20} />
            Add Warehouse
          </MagneticButton>
        </div>
      </header>

      <main className="pt-28 px-8 pb-32 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
        {viewMode === 'map' ? (
          <div className="h-[70vh] w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative bg-black/40">
            <WarehouseGlobe warehouses={warehouses} />
          </div>
        ) : (
          <>
            {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Package size={24} />
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Total Capacity</div>
                <div className="text-2xl font-bold text-white">{(stats.totalCapacity / 1000).toFixed(0)}K</div>
              </div>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: stats.avgEfficiency + '%' }} />
            </div>
            <div className="text-xs text-white/40 mt-2">{stats.avgEfficiency}% utilized</div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <TrendingUp size={24} />
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Avg Efficiency</div>
                <div className="text-2xl font-bold text-white">{stats.avgEfficiency}%</div>
              </div>
            </div>
            <div className="text-xs text-emerald-400 font-semibold">+2.3% vs last month</div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Truck size={24} />
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Active Orders</div>
                <div className="text-2xl font-bold text-white">{stats.activeOrders}</div>
              </div>
            </div>
            <div className="text-xs text-white/40">Across all locations</div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <MapPin size={24} />
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Locations</div>
                <div className="text-2xl font-bold text-white">{warehouses.length}</div>
              </div>
            </div>
            <div className="text-xs text-white/40">4 countries worldwide</div>
          </GlassCard>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search warehouses by name, code, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          <button className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center gap-2">
            <Filter size={18} />
            Filter
          </button>
          <button className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>


        {/* Warehouse Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredWarehouses.map((warehouse) => (
            <GlassCard key={warehouse.id} className="p-6" hover onClick={() => handleViewDetails(warehouse)}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{warehouse.name}</h3>
                    <p className="text-white/60 text-sm">{warehouse.city}, {warehouse.state}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    {warehouse.status}
                  </span>
                  <div className="relative group">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-40 bg-[#0F0F10] border border-white/10 rounded-xl shadow-2xl overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(warehouse) }}
                        className="w-full px-4 py-2 hover:bg-white/5 text-left text-white/80 hover:text-white transition-colors flex items-center gap-2 text-sm"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(warehouse) }}
                        className="w-full px-4 py-2 hover:bg-white/5 text-left text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 text-sm border-t border-white/5"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-white/40 text-xs mb-1">Capacity</div>
                  <div className="text-lg font-bold text-white">{(warehouse.capacity || 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs mb-1">Location</div>
                  <div className="text-lg font-bold text-white">{warehouse.zip_code}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin size={14} />
                <span className="truncate">{warehouse.address}</span>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredWarehouses.length === 0 && (
          <div className="text-center py-20">
            <div className="text-white/40 text-lg mb-2">
              {searchQuery ? 'No warehouses found' : 'No warehouses yet'}
            </div>
            <p className="text-white/30 text-sm">
              {searchQuery ? 'Try adjusting your search query' : 'Add your first warehouse to get started'}
            </p>
          </div>
        )}
      </>
    )}
  </main>

      {/* Modals */}
      <AnimatePresence>
        {showDetailsModal && selectedWarehouse && (
          <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title={selectedWarehouse.name}>
            <div className="space-y-6">
              {/* Warehouse Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-white/40 text-xs mb-1">Warehouse Code</div>
                  <div className="text-white font-semibold">{selectedWarehouse.code}</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs mb-1">Type</div>
                  <div className="text-white font-semibold">{selectedWarehouse.type}</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs mb-1">Manager</div>
                  <div className="text-white font-semibold">{selectedWarehouse.manager}</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs mb-1">Employees</div>
                  <div className="text-white font-semibold">{selectedWarehouse.employees}</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs mb-1">Established</div>
                  <div className="text-white font-semibold">{selectedWarehouse.established}</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs mb-1">Operating Hours</div>
                  <div className="text-white font-semibold text-sm">{selectedWarehouse.operatingHours}</div>
                </div>
              </div>

              {/* Contact */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-sm font-bold text-white mb-3">Contact Information</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Phone:</span>
                    <span className="text-white">{selectedWarehouse.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Email:</span>
                    <span className="text-white">{selectedWarehouse.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Address:</span>
                    <span className="text-white text-right flex-1 ml-4">{selectedWarehouse.address}</span>
                  </div>
                </div>
              </div>

              {/* Performance Chart */}
              <div>
                <div className="text-sm font-bold text-white mb-4">Monthly Performance</div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selectedWarehouse.monthlyStats}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                      <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setShowDetailsModal(false); handleEdit(selectedWarehouse) }} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors">
                  Edit Warehouse
                </button>
                <button onClick={() => setShowDetailsModal(false)} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors">
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}

        {showAddModal && (
          <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Warehouse">
            <CreateWarehouseForm
              onClose={() => setShowAddModal(false)}
              onSuccess={async () => {
                toast('Warehouse created successfully')
                setShowAddModal(false)
                // Refresh warehouses
                try {
                  const { response, data } = await api.getWarehouses()
                  if (response.ok) {
                    setWarehouses(data.results || data || [])
                  }
                } catch (error) {
                  console.error('Failed to refresh warehouses:', error)
                }
              }}
              onError={(msg) => toast(msg, 'error')}
            />
          </Modal>
        )}

        {showEditModal && selectedWarehouse && (
          <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Warehouse">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-white/60">Warehouse Name</label>
                  <input defaultValue={selectedWarehouse.name} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/60">Code</label>
                  <input defaultValue={selectedWarehouse.code} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/60">Address</label>
                <input defaultValue={selectedWarehouse.address} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-white/60">Manager</label>
                  <input defaultValue={selectedWarehouse.manager} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/60">Status</label>
                  <select defaultValue={selectedWarehouse.status} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50">
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowEditModal(false)} className="flex-1 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors">Cancel</button>
                <button onClick={() => setShowEditModal(false)} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors">Save Changes</button>
              </div>
            </div>
          </Modal>
        )}

        {showDeleteModal && selectedWarehouse && (
          <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Warehouse">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <p className="text-white/80 mb-2">Are you sure you want to delete <span className="font-bold text-white">{selectedWarehouse.name}</span>?</p>
              <p className="text-white/60 text-sm mb-6">This action cannot be undone. All data associated with this warehouse will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">Cancel</button>
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors">Delete Warehouse</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}


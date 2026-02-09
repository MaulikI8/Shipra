import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import { exportToCSV, exportToPDF, exportToExcel } from '../lib/export'
import { toast, ToastContainer } from '../lib/toast'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Warehouse,
  BarChart3,
  FileSpreadsheet,
  Printer
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

const REPORT_TEMPLATES = [
  { id: 1, name: 'Sales Report', description: 'Revenue, orders, and trends', icon: DollarSign },
  { id: 2, name: 'Inventory Report', description: 'Stock levels and movements', icon: Package },
  { id: 3, name: 'Customer Report', description: 'Customer activity and metrics', icon: Users },
  { id: 4, name: 'Warehouse Report', description: 'Warehouse performance and efficiency', icon: Warehouse }
]

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#14B8A6', '#F97316']

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden', className)}>
      {children}
    </div>
  )
}

export default function Reports() {
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState('Last 6 Months')
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [productPerformance, setProductPerformance] = useState<any[]>([])
  const [warehousePerformance, setWarehousePerformance] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true) 

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true)
        const months = dateRange === 'Last 12 Months' ? 12 : 6
        const [revRes, prodRes, whRes, catRes] = await Promise.all([
          api.getRevenueReport(months),
          api.getProductPerformance(),
          api.getWarehousePerformance(),
          api.getCategoryPerformance()
        ])

        if (revRes.response.ok) setRevenueData(revRes.data)
        if (prodRes.response.ok) setProductPerformance(prodRes.data)
        if (whRes.response.ok) setWarehousePerformance(whRes.data)
        if (catRes.response.ok) setCategoryData(catRes.data)
      } catch (error) {
        console.error('Error fetching reports:', error)
        toast('Error loading report data', 'error')
      } finally {
        setIsLoading(false)
      }
    }
    fetchReportData()
  }, [dateRange])

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      if (format === 'csv') {
        const exportData = revenueData.map(item => ({
          Month: item.month,
          Revenue: `$${item.revenue.toLocaleString()}`,
          Orders: item.orders
        }))
        exportToCSV(exportData, `revenue-report-${dateRange.toLowerCase().replace(/\s+/g, '-')}`)
        toast('CSV exported successfully!', 'success')
      } else if (format === 'excel') {
        const exportData = revenueData.map(item => ({
          Month: item.month,
          Revenue: `$${item.revenue.toLocaleString()}`,
          Orders: item.orders
        }))
        exportToExcel(exportData, `revenue-report-${dateRange.toLowerCase().replace(/\s+/g, '-')}`)
        toast('Excel file exported successfully!', 'success')
      } else if (format === 'pdf') {
        try {
          await exportToPDF(
            `Revenue Report - ${dateRange}`,
            revenueData.map(item => ({
              Month: item.month,
              Revenue: `$${item.revenue.toLocaleString()}`,
              Orders: item.orders.toString()
            })),
            ['Month', 'Revenue', 'Orders'],
            `revenue-report-${dateRange.toLowerCase().replace(/\s+/g, '-')}`
          )
          toast('PDF exported successfully!', 'success')
        } catch (error: any) {
          toast(error.message || 'PDF export failed.', 'error')
        }
      }
    } catch (error: any) {
      toast(error.message || 'Export failed. Please try again.', 'error')
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
                <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                <p className="text-sm text-white/40">Generate and export business reports</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setDateRange(dateRange === 'Last 6 Months' ? 'Last 12 Months' : 'Last 6 Months')}
                className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center gap-2 transition-colors"
              >
                <Calendar size={18} />
                {dateRange}
              </button>
              <button onClick={() => handleExport('pdf')} className="px-4 py-2 rounded-full bg-accent text-black font-medium hover:bg-accent/90 transition-colors flex items-center gap-2">
                <Download size={18} />
                Export Summary
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {/* Report Templates */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Report Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {REPORT_TEMPLATES.map((template) => (
                <GlassCard
                  key={template.id}
                  className="p-6 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                      <template.icon size={24} className="text-accent" />
                    </div>
                    <h3 className="font-bold">{template.name}</h3>
                  </div>
                  <p className="text-sm text-white/60">{template.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Trends */}
            <GlassCard className="lg:col-span-2 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold">Revenue Trends</h3>
                  <p className="text-white/40 text-sm">Monthly sales performance</p>
                </div>
                {revenueData.length > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-white/40 mb-1">Total Revenue (Period)</p>
                    <p className="text-2xl font-bold text-accent">
                      ${revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="h-80">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center text-white/20 italic">Loading chart data...</div>
                ) : revenueData.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/20 italic gap-4">
                    <TrendingUp size={48} />
                    No revenue data found for this period
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="reportGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00E8FF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00E8FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                      <Tooltip 
                        contentStyle={{ background: 'rgba(15,15,16,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                        itemStyle={{ color: '#00E8FF' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#00E8FF" strokeWidth={3} fill="url(#reportGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </GlassCard>

            {/* Warehouse Efficiency Chart */}
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-8">Warehouse Efficiency</h3>
              <div className="h-80">
                {isLoading ? (
                   <div className="h-full flex items-center justify-center text-white/20 italic">Loading...</div>
                ) : warehousePerformance.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/20 italic gap-4">
                    <Warehouse size={48} />
                    No warehouse data found
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={warehousePerformance}>
                      <XAxis dataKey="name" stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ background: 'rgba(15,15,16,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                      />
                      <Bar dataKey="efficiency" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Category Distribution */}
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-8">Category Distribution</h3>
              <div className="h-80 relative">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center text-white/20 italic">Loading...</div>
                ) : categoryData.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/20 italic gap-4">
                    <BarChart3 size={48} />
                    No category data found
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-[#0F0F10]/95 border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-md">
                                  <p className="font-bold text-white mb-1">{data.name}</p>
                                  <div className="flex items-center gap-4 text-xs">
                                    <span className="text-white/60">Revenue:</span>
                                    <span className="font-mono text-accent">${data.revenue.toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs mt-1">
                                    <span className="text-white/60">Share:</span>
                                    <span className="font-mono text-white">{data.percentage}%</span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Legend Overlay */}
                    <div className="absolute bottom-0 right-0 p-4 pointer-events-none">
                       <div className="flex flex-col gap-2">
                          {categoryData.slice(0, 5).map((cat, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                              <span className="text-white/60">{cat.name}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </>
                )}
              </div>
            </GlassCard>

            {/* Top Products Table */}
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-6">Top Products by Revenue</h3>
              <div className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase text-white/40">
                      <th className="py-3 font-medium pl-2">Product</th>
                      <th className="py-3 font-medium text-center">Status</th>
                      <th className="py-3 font-medium text-right">Sales</th>
                      <th className="py-3 font-medium text-right pr-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr><td colSpan={4} className="py-12 text-center text-white/20 italic">Loading...</td></tr>
                    ) : productPerformance.length === 0 ? (
                      <tr><td colSpan={4} className="py-12 text-center text-white/20 italic">No product data found</td></tr>
                    ) : (
                      productPerformance.map((product: any, i: number) => (
                        <tr key={i} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                          <td className="py-3 pl-2 max-w-[140px]">
                            <div className="font-medium truncate" title={product.name}>{product.name}</div>
                            <div className="w-full bg-white/5 h-1 rounded-full mt-1.5 overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${product.percentage}%` }}
                                className="h-full bg-accent rounded-full"
                              />
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide",
                              product.status === 'in_stock' ? "bg-emerald-500/20 text-emerald-400" :
                              product.status === 'low_stock' ? "bg-amber-500/20 text-amber-400" :
                              "bg-red-500/20 text-red-400"
                            )}>
                              {product.status?.replace('_', ' ') || 'UNK'}
                            </span>
                          </td>
                          <td className="py-3 text-right font-mono text-sm text-white/60">
                            {product.sales}
                          </td>
                          <td className="py-3 pr-2 text-right font-mono text-sm font-bold text-white">
                            ${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          {/* Warehouse Performance Table */}
          <GlassCard className="p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Warehouse Performance Details</h3>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center gap-2 transition-colors text-sm"
              >
                <Printer size={16} />
                Print Report
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Warehouse</th>
                    <th className="text-right py-3 px-4 text-white/60 font-medium">Orders</th>
                    <th className="text-right py-3 px-4 text-white/60 font-medium">Efficiency</th>
                    <th className="text-right py-3 px-4 text-white/60 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={4} className="py-12 text-center text-white/40 text-sm">Loading...</td></tr>
                  ) : warehousePerformance.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-white/40 text-sm">
                        No warehouse data yet
                      </td>
                    </tr>
                  ) : (
                    warehousePerformance.map((warehouse: any, i: number) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-medium">{warehouse.name}</td>
                        <td className="py-4 px-4 text-right">{warehouse.orders}</td>
                        <td className="py-4 px-4 text-right">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            warehouse.efficiency >= 90 ? "bg-emerald-500/20 text-emerald-400" :
                            warehouse.efficiency >= 80 ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-red-500/20 text-red-400"
                          )}>
                            {warehouse.efficiency}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-bold">${warehouse.revenue.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Export Options */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-6">Export Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleExport('pdf')}
                className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
              >
                <FileText size={32} className="mb-3 text-accent" />
                <h4 className="font-bold mb-2">Export as PDF</h4>
                <p className="text-sm text-white/60">Generate a formatted PDF report</p>
              </button>
              
              <button
                onClick={() => handleExport('csv')}
                className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
              >
                <FileSpreadsheet size={32} className="mb-3 text-accent" />
                <h4 className="font-bold mb-2">Export as CSV</h4>
                <p className="text-sm text-white/60">Download data as CSV file</p>
              </button>
              
              <button
                onClick={() => handleExport('excel')}
                className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
              >
                <FileSpreadsheet size={32} className="mb-3 text-accent" />
                <h4 className="font-bold mb-2">Export as Excel</h4>
                <p className="text-sm text-white/60">Generate Excel spreadsheet</p>
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

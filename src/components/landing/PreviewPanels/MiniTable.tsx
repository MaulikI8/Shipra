import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, Package } from 'lucide-react'

interface TableRow {
  order: string
  customer: string
  status: 'Allocated' | 'Pending' | 'Shipped'
}

const sampleRows: TableRow[] = [
  { order: 'SO-2024-001', customer: 'Acme Inc.', status: 'Allocated' },
  { order: 'SO-2024-002', customer: 'TechCorp', status: 'Pending' },
  { order: 'SO-2024-003', customer: 'Global Ltd', status: 'Shipped' },
]

const statusIcons = {
  Allocated: CheckCircle2,
  Pending: Clock,
  Shipped: Package,
}

export function MiniTable() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sampleRows.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-3 space-y-1.5">
      {sampleRows.map((row, i) => {
        const Icon = statusIcons[row.status]
        const isActive = i === activeIndex
        return (
          <div
            key={i}
            className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
              isActive
                ? 'bg-accent/10 border-l-2 border-accent'
                : 'bg-white/5 hover:bg-white/8'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white/90 truncate">{row.order}</div>
              <div className="text-[10px] text-white/60 truncate">{row.customer}</div>
            </div>
            <div className="flex items-center gap-1">
              <Icon
                size={12}
                className={isActive ? 'text-accent' : 'text-white/40'}
              />
              <span
                className={`text-[10px] ${
                  isActive ? 'text-accent' : 'text-white/60'
                }`}
              >
                {row.status}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}


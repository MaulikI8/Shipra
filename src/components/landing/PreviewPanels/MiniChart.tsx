import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { prefersReducedMotion } from '@/lib/reduceMotion'

interface MiniChartProps {
  height?: number
}

const chartData = [
  { name: 'M', value: 45 },
  { name: 'T', value: 62 },
  { name: 'W', value: 58 },
  { name: 'T', value: 71 },
  { name: 'F', value: 65 },
]

export function MiniChart({ height: _height = 64 }: MiniChartProps) {
  const reducedMotion = prefersReducedMotion()

  if (reducedMotion) {
    return (
      <div className="h-16 opacity-70">
        <svg viewBox="0 0 200 60" className="w-full h-full">
          <polyline
            points="0,45 50,20 100,30 150,5 200,15"
            fill="none"
            stroke="rgba(0,232,255,0.7)"
            strokeWidth="2"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className="h-16 opacity-70">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="rgba(0,232,255,0.7)"
            strokeWidth={2}
            dot={false}
            animationDuration={1500}
            animationBegin={0}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


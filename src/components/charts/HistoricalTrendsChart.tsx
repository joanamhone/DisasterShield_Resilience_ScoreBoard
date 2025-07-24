import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { format, subDays, subMonths, subYears } from 'date-fns'

interface HistoricalTrendsChartProps {
  timeRange: 'hour' | 'month' | 'year'
  location: string
}

const HistoricalTrendsChart: React.FC<HistoricalTrendsChartProps> = ({ timeRange, location }) => {
  const generateData = () => {
    const now = new Date()
    let data: any[] = []
    
    switch (timeRange) {
      case 'hour':
        // Last 24 hours, hourly data
        for (let i = 23; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000)
          data.push({
            time: format(time, 'HH:mm'),
            fullTime: time,
            flood: Math.random() * 5 + 1,
            wildfire: Math.random() * 4 + 0.5,
            storm: Math.random() * 6 + 2,
            earthquake: Math.random() * 2 + 0.2
          })
        }
        break
      case 'month':
        // Last 30 days, daily data
        for (let i = 29; i >= 0; i--) {
          const date = subDays(now, i)
          data.push({
            time: format(date, 'MMM dd'),
            fullTime: date,
            flood: Math.random() * 8 + 2,
            wildfire: Math.random() * 7 + 1,
            storm: Math.random() * 9 + 3,
            earthquake: Math.random() * 3 + 0.5
          })
        }
        break
      case 'year':
        // Last 12 months, monthly data
        for (let i = 11; i >= 0; i--) {
          const date = subMonths(now, i)
          data.push({
            time: format(date, 'MMM yyyy'),
            fullTime: date,
            flood: Math.random() * 12 + 5,
            wildfire: Math.random() * 10 + 3,
            storm: Math.random() * 15 + 8,
            earthquake: Math.random() * 5 + 1
          })
        }
        break
    }
    
    return data
  }

  const data = generateData()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text-primary">
          Historical Risk Trends
        </h3>
        <span className="text-sm text-text-secondary bg-surface px-3 py-1 rounded-full">
          {location}
        </span>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="time" 
              stroke="#718096"
              fontSize={12}
              tick={{ fill: '#718096' }}
            />
            <YAxis 
              stroke="#718096"
              fontSize={12}
              tick={{ fill: '#718096' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="flood" 
              stroke="#1976D2" 
              strokeWidth={2}
              name="Flood Risk"
              dot={{ fill: '#1976D2', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="wildfire" 
              stroke="#D32F2F" 
              strokeWidth={2}
              name="Wildfire Risk"
              dot={{ fill: '#D32F2F', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="storm" 
              stroke="#F57C00" 
              strokeWidth={2}
              name="Storm Risk"
              dot={{ fill: '#F57C00', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="earthquake" 
              stroke="#43A047" 
              strokeWidth={2}
              name="Earthquake Risk"
              dot={{ fill: '#43A047', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-xs text-text-tertiary text-center mt-3">
        Risk levels are calculated based on historical data and current conditions
      </p>
    </div>
  )
}

export default HistoricalTrendsChart
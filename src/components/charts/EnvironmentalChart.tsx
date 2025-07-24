import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { format, subDays, subMonths, subYears } from 'date-fns'

interface EnvironmentalChartProps {
  timeRange: 'hour' | 'month' | 'year'
  location: string
  parameter: 'temperature' | 'rainfall' | 'humidity' | 'windspeed'
}

const EnvironmentalChart: React.FC<EnvironmentalChartProps> = ({ 
  timeRange, 
  location, 
  parameter 
}) => {
  const generateData = () => {
    const now = new Date()
    let data: any[] = []
    
    const getParameterData = (baseValue: number, variance: number) => {
      return Math.max(0, baseValue + (Math.random() - 0.5) * variance)
    }
    
    const parameterConfig = {
      temperature: { base: 22, variance: 20, unit: '°C', color: '#F57C00' },
      rainfall: { base: 5, variance: 15, unit: 'mm', color: '#1976D2' },
      humidity: { base: 60, variance: 40, unit: '%', color: '#43A047' },
      windspeed: { base: 15, variance: 20, unit: 'km/h', color: '#9C27B0' }
    }
    
    const config = parameterConfig[parameter]
    
    switch (timeRange) {
      case 'hour':
        // Last 24 hours, hourly data
        for (let i = 23; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000)
          data.push({
            time: format(time, 'HH:mm'),
            fullTime: time,
            value: getParameterData(config.base, config.variance),
            average: config.base + (Math.random() - 0.5) * config.variance * 0.3
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
            value: getParameterData(config.base, config.variance),
            average: config.base + (Math.random() - 0.5) * config.variance * 0.5
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
            value: getParameterData(config.base, config.variance),
            average: config.base + (Math.random() - 0.5) * config.variance * 0.7
          })
        }
        break
    }
    
    return { data, config }
  }

  const { data, config } = generateData()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)} {config.unit}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const getParameterTitle = () => {
    switch (parameter) {
      case 'temperature': return 'Temperature'
      case 'rainfall': return 'Rainfall'
      case 'humidity': return 'Humidity'
      case 'windspeed': return 'Wind Speed'
      default: return 'Environmental Data'
    }
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text-primary">
          {getParameterTitle()} Trends
        </h3>
        <span className="text-sm text-text-secondary bg-surface px-3 py-1 rounded-full">
          {location}
        </span>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              label={{ value: config.unit, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              stroke={config.color}
              fill={`${config.color}20`}
              strokeWidth={2}
              name="Current"
            />
            <Area
              type="monotone"
              dataKey="average"
              stroke={`${config.color}80`}
              fill={`${config.color}10`}
              strokeWidth={1}
              strokeDasharray="5 5"
              name="Average"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-xs text-text-tertiary text-center mt-3">
        Data updates every hour • Last updated: {format(new Date(), 'HH:mm')}
      </p>
    </div>
  )
}

export default EnvironmentalChart
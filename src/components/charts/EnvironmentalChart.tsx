import React, { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { format, subDays, subHours, subMonths } from 'date-fns'
import { SupabaseClient } from '@supabase/supabase-js'
import { useAuth } from '../../contexts/AuthContext'

interface EnvironmentalChartProps {
  timeRange: 'hour' | 'day' | 'week' | 'month' | 'year'
  location: string
  parameter: 'temperature' | 'rainfall' | 'humidity' | 'windspeed'
  supabase: SupabaseClient
}

const EnvironmentalChart: React.FC<EnvironmentalChartProps> = ({ 
  timeRange, 
  location, 
  parameter,
  supabase
}) => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const parameterConfig = {
    temperature: { unit: '°C', color: '#F57C00' },
    rainfall: { unit: 'mm', color: '#1976D2' },
    humidity: { unit: '%', color: '#43A047' },
    windspeed: { unit: 'km/h', color: '#9C27B0' }
  };
  const config = parameterConfig[parameter];

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setIsLoading(true);

      const now = new Date();
      let startDate;
      let timeFormatter;

      // Updated logic for date range and label formatting
      switch (timeRange) {
        case 'hour':
          startDate = subHours(now, 1); // Data from the last 1 hour
          timeFormatter = (ts: string) => format(new Date(ts), 'HH:mm');
          break;
        case 'day':
          startDate = subHours(now, 24); // Last 24 hours
          timeFormatter = (ts: string) => format(new Date(ts), 'HH:mm');
          break;
        case 'week':
          startDate = subDays(now, 7);
          timeFormatter = (ts: string) => format(new Date(ts), 'EEE');
          break;
        case 'year':
          startDate = subMonths(now, 12);
          timeFormatter = (ts: string) => format(new Date(ts), 'MMM yy');
          break;
        case 'month':
        default:
          startDate = subDays(now, 30);
          timeFormatter = (ts: string) => format(new Date(ts), 'MMM dd');
          break;
      }

      const { data, error } = await supabase
        .from('environmental_data')
        .select('timestamp, temperature, rainfall, humidity, wind_speed')
        .eq('user_id', user.id)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching environmental data:', error);
        setIsLoading(false);
        return;
      }

      const formattedData = data.map(item => ({
        time: timeFormatter(item.timestamp),
        value: item[parameter === 'windspeed' ? 'wind_speed' : parameter],
      }));

      setChartData(formattedData);
      setIsLoading(false);
    };

    fetchData();
  }, [user, supabase, timeRange, parameter]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-text-primary mb-2">{label}</p>
          <p className="text-sm" style={{ color: config.color }}>
            {payload[0].name}: {payload[0].value.toFixed(1)} {config.unit}
          </p>
        </div>
      )
    }
    return null
  }

  const getParameterTitle = () => {
    switch (parameter) {
      case 'temperature': return 'Temperature';
      case 'rainfall': return 'Rainfall';
      case 'humidity': return 'Humidity';
      case 'windspeed': return 'Wind Speed';
      default: return 'Environmental Data';
    }
  }

  return (
    <div className="card p-4">
      <h3 className="font-bold text-text-primary mb-4">
        {getParameterTitle()} Trends
      </h3>
      {isLoading ? (
        <div className="h-80 flex items-center justify-center">Loading Chart Data...</div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                name={getParameterTitle()}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default EnvironmentalChart;

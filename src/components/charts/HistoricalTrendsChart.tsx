import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { format, subDays, subHours, subMonths } from 'date-fns'
import { SupabaseClient } from '@supabase/supabase-js'
import { useAuth } from '../../contexts/AuthContext'

interface HistoricalTrendsChartProps {
  timeRange: 'hour' | 'day' | 'week' | 'month' | 'year'
  location: string
  supabase: SupabaseClient
}

const HistoricalTrendsChart: React.FC<HistoricalTrendsChartProps> = ({ timeRange, supabase }) => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        .from('risk_trends')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching risk trends:', error);
        setIsLoading(false);
        return;
      }
      
      const formattedData = data.map(item => ({
        time: timeFormatter(item.timestamp),
        cold_wave: (item.cold_wave_risk || 0) * 100,
        heat_wave: (item.heat_wave_risk || 0) * 100,
        flash_flood: (item.flash_flood_risk || 0) * 100,
        storm: (item.storm_risk || 0) * 100,
        forest_fire: (item.forest_fire_risk || 0) * 100,
      }));

      setChartData(formattedData);
      setIsLoading(false);
    };

    fetchData();
  }, [user, supabase, timeRange]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="card p-4">
      <h3 className="font-bold text-text-primary mb-4">
        Historical Risk Trends (%)
      </h3>
      {isLoading ? (
          <div className="h-80 flex items-center justify-center">Loading Chart Data...</div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              <Line type="monotone" dataKey="cold_wave" name="Cold Wave" stroke="#00BCD4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="heat_wave" name="Heat Wave" stroke="#FF5722" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="flash_flood" name="Flash Flood" stroke="#1976D2" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="storm" name="Storm" stroke="#F57C00" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="forest_fire" name="Forest Fire" stroke="#D32F2F" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default HistoricalTrendsChart;

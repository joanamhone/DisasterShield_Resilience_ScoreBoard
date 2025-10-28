import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Loader2 } from 'lucide-react';

// Mock Data - Replace with Supabase fetch
const MOCK_STATS = {
  totalPopulation: 120500,
  households: 28100,
  highRisk: 15200,
};

const MOCK_TABLE_DATA = [
  { id: 1, community: 'Kuntaja - Blantyre', population: 15000, households: 3200 },
  { id: 2, community: 'Mlumbe - Zomba', population: 22000, households: 4500 },
  { id: 3, community: 'Kachere - Dedza', population: 18000, households: 4100 },
];

const DemographicsTab: React.FC<{ jurisdiction: string }> = ({ jurisdiction }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(MOCK_STATS);
  const [tableData, setTableData] = useState(MOCK_TABLE_DATA);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // TODO: Fetch real data from Supabase
      // 1. Fetch aggregated stats based on 'jurisdiction'
      // 2. Fetch table data based on 'jurisdiction'
      
      // Simulating API call
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, [jurisdiction, supabase]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-sm text-text-secondary">Total Population</p>
          <p className="text-3xl font-bold text-text-primary">{stats.totalPopulation.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-text-secondary">Total Households</p>
          <p className="text-3xl font-bold text-text-primary">{stats.households.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-text-secondary">High-Risk Individuals</p>
          <p className="text-3xl font-bold text-text-primary">{stats.highRisk.toLocaleString()}</p>
        </div>
      </div>

      {/* TODO: Add Charts here */}

      {/* Data Table */}
      <div className="card p-0 overflow-hidden">
        <h3 className="p-4 text-lg font-semibold">Population by Community</h3>
        <table className="min-w-full divide-y divide-divider">
          <thead className="bg-surface">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Community (T.A.)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Population</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Households</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-divider">
            {tableData.map((row) => (
              <tr key={row.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{row.community}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{row.population.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{row.households.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DemographicsTab;
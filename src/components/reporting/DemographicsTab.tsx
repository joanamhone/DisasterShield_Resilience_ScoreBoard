import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Loader2 } from 'lucide-react';


// Mock Data
const MOCK_STATS = { totalPopulation: 120500, households: 28100, highRisk: 15200 };
const MOCK_TABLE_DATA = [
  { id: 1, community: 'Kuntaja - Blantyre', population: 15000, households: 3200 },
  { id: 2, community: 'Mlumbe - Zomba', population: 22000, households: 4500 },
  { id: 3, community: 'Kachere - Dedza', population: 18000, households: 4100 },
];

export interface DemographicsTabRef {
  exportToExcel: () => void;
  exportToPdf: () => void;
}

const DemographicsTab = forwardRef<DemographicsTabRef, { jurisdiction: string }>(({ jurisdiction }, ref) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(MOCK_STATS);
  const [tableData, setTableData] = useState(MOCK_TABLE_DATA);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // TODO: Fetch real data
      setTimeout(() => setLoading(false), 500);
    };
    fetchData();
  }, [jurisdiction, supabase]);

  useImperativeHandle(ref, () => ({
    exportToExcel: () => {
      console.log('DemographicsTab exportToExcel called');
      console.log('Table data:', tableData);
      
      if (!tableData || tableData.length === 0) {
        alert("No data available to export.");
        return;
      }
      
      try {
        const csvContent = [
          'Community,Population,Households',
          ...tableData.map(row => `"${row.community}",${row.population},${row.households}`)
        ].join('\n');
        
        console.log('CSV Content:', csvContent);
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Demographics_Report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log('CSV export completed');
      } catch (error) {
        console.error('Export error:', error);
        alert('Export failed: ' + error);
      }
    },
    exportToPdf: () => {
      console.log('DemographicsTab exportToPdf called');
      
      if (!tableData || tableData.length === 0) {
        alert("No data available to export.");
        return;
      }
      
      try {
        const printContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Demographics Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { border-collapse: collapse; width: 100%; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Demographics Report</h1>
            <p><strong>Jurisdiction:</strong> ${jurisdiction}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            <table>
              <tr><th>Community</th><th>Population</th><th>Households</th></tr>
              ${tableData.map(row => `<tr><td>${row.community}</td><td>${row.population.toLocaleString()}</td><td>${row.households.toLocaleString()}</td></tr>`).join('')}
            </table>
          </body>
          </html>
        `;
        
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(printContent);
          printWindow.document.close();
          printWindow.print();
          console.log('Print dialog opened');
        } else {
          alert('Could not open print window. Please allow popups.');
        }
      } catch (error) {
        console.error('Print error:', error);
        alert('Print failed: ' + error);
      }
    },
  }));

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ... stat cards ... */}
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

      {/* Data Table */}
      <div className="card p-0 overflow-hidden">
        <h3 className="p-4 text-lg font-semibold">Population by Community</h3>
        <div className="overflow-x-auto">
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
    </div>
  );
});

export default DemographicsTab;
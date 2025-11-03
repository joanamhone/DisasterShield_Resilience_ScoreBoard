import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Loader2 } from 'lucide-react';


// Mock Data
const MOCK_STATS = { avgScore: 72, mostPrepared: "Mlumbe - Zomba", leastPrepared: "Kuntaja - Blantyre" };
const MOCK_TABLE_DATA = [
  { id: 1, community: 'Kuntaja - Blantyre', score: 65, status: 'Needs Improvement' },
  { id: 2, community: 'Mlumbe - Zomba', score: 82, status: 'Prepared' },
  { id: 3, community: 'Kachere - Dedza', score: 71, status: 'Acceptable' },
];

// Define Ref interface
export interface ReadinessTabRef {
  exportToExcel: () => void;
  exportToPdf: () => void;
}

// Use forwardRef
const ReadinessTab = forwardRef<ReadinessTabRef, { jurisdiction: string }>(({ jurisdiction }, ref) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(MOCK_STATS);
  const [tableData, setTableData] = useState(MOCK_TABLE_DATA);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // TODO: Fetch real data from Supabase based on 'jurisdiction'
      setTimeout(() => setLoading(false), 500);
    };
    fetchData();
  }, [jurisdiction, supabase]);

  // Expose export functions
  useImperativeHandle(ref, () => ({
    exportToExcel: () => {
      if (!tableData || tableData.length === 0) {
        alert("No data available to export.");
        return;
      }
      
      const csvContent = [
        'Community,Readiness Score,Status',
        ...tableData.map(row => `"${row.community}",${row.score}%,"${row.status}"`)
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Readiness_Report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    exportToPdf: () => {
      if (!tableData || tableData.length === 0) {
        alert("No data available to export.");
        return;
      }
      
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Community Readiness Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Community Readiness Report</h1>
          <p><strong>Jurisdiction:</strong> ${jurisdiction}</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          <table>
            <tr><th>Community</th><th>Readiness Score</th><th>Status</th></tr>
            ${tableData.map(row => `<tr><td>${row.community}</td><td>${row.score}%</td><td>${row.status}</td></tr>`).join('')}
          </table>
        </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
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
        <div className="card p-4">
          <p className="text-sm text-text-secondary">Average Readiness Score</p>
          <p className="text-3xl font-bold text-primary">{stats.avgScore}%</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-text-secondary">Most Prepared</p>
          <p className="text-xl font-bold text-text-primary truncate">{stats.mostPrepared}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-text-secondary">Least Prepared</p>
          <p className="text-xl font-bold text-text-primary truncate">{stats.leastPrepared}</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="card p-0 overflow-hidden">
        <h3 className="p-4 text-lg font-semibold">Readiness by Community</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-divider">
            <thead className="bg-surface">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Community (T.A.)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Readiness Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-divider">
              {tableData.map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{row.community}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary font-bold">{row.score}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}); // End of forwardRef

export default ReadinessTab;
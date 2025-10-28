import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Loader2, Eye } from 'lucide-react';
import Button from '../ui/Button';

// Mock Data - Replace with Supabase fetch
const MOCK_TABLE_DATA = [
  { id: 1, title: 'Flood Damage Report - Area 1', community: 'Kuntaja - Blantyre', leader: 'Jane Smith', date: '2025-10-23', status: 'Pending' },
  { id: 2, title: 'Evacuation Update', community: 'Mlumbe - Zomba', leader: 'Alex Johnson', date: '2025-10-22', status: 'Pending' },
  { id: 3, title: 'Initial Impact Assessment', community: 'Kachere - Dedza', leader: 'Grace Phiri', date: '2025-10-21', status: 'Reviewed' },
];

const ResponseTab: React.FC<{ jurisdiction: string }> = ({ jurisdiction }) => {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState(MOCK_TABLE_DATA);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // TODO: Fetch real data from Supabase 'reports' table
      // Filter based on 'jurisdiction'
      
      // Simulating API call
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, [jurisdiction, supabase]);

  const handleViewReport = (report: any) => {
    // TODO: Create a modal to show the full report content
    alert(`Viewing report: ${report.title}\n\nContent would be shown in a modal.`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Data Table */}
      <div className="card p-0 overflow-hidden">
        <h3 className="p-4 text-lg font-semibold">Submitted Response Reports</h3>
        <table className="min-w-full divide-y divide-divider">
          <thead className="bg-surface">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Report Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Community</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Submitted By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-divider">
            {tableData.map((row) => (
              <tr key={row.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{row.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{row.community}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{row.leader}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{row.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    row.status === 'Pending' ? 'bg-warning/10 text-warning-dark' : 'bg-success/10 text-success-dark'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button variant="ghost" size="sm" onClick={() => handleViewReport(row)}>
                    <Eye size={16} className="mr-1" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponseTab;
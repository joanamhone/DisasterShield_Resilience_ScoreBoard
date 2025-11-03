import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Loader2, Eye } from 'lucide-react';
import Button from '../ui/Button'; // Ensure correct path


// Mock Data
const MOCK_TABLE_DATA = [
  { id: 1, title: 'Flood Damage Report - Area 1', community: 'Kuntaja - Blantyre', leader: 'Jane Smith', date: '2025-10-23', status: 'Pending' },
  { id: 2, title: 'Evacuation Update', community: 'Mlumbe - Zomba', leader: 'Alex Johnson', date: '2025-10-22', status: 'Pending' },
  { id: 3, title: 'Initial Impact Assessment', community: 'Kachere - Dedza', leader: 'Grace Phiri', date: '2025-10-21', status: 'Reviewed' },
];

// Define Ref interface
export interface ResponseTabRef {
  exportToExcel: () => void;
  exportToPdf: () => void;
}

// Use forwardRef
const ResponseTab = forwardRef<ResponseTabRef, { jurisdiction: string }>(({ jurisdiction }, ref) => {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState(MOCK_TABLE_DATA);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // TODO: Fetch real data from Supabase 'reports' table based on 'jurisdiction'
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
        'Report Title,Community,Submitted By,Date,Status',
        ...tableData.map(row => `"${row.title}","${row.community}","${row.leader}",${row.date},"${row.status}"`)
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Response_Reports_${new Date().toISOString().split('T')[0]}.csv`;
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
          <title>Disaster Response Reports</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Disaster Response Reports</h1>
          <p><strong>Jurisdiction:</strong> ${jurisdiction}</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          <table>
            <tr><th>Report Title</th><th>Community</th><th>Submitted By</th><th>Date</th><th>Status</th></tr>
            ${tableData.map(row => `<tr><td>${row.title}</td><td>${row.community}</td><td>${row.leader}</td><td>${row.date}</td><td>${row.status}</td></tr>`).join('')}
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
        <div className="overflow-x-auto">
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
    </div>
  );
}); // End of forwardRef

export default ResponseTab;
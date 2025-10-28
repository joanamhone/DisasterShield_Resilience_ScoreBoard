import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
      const exportData = tableData.map(({ id, ...rest }) => ({
          ...rest,
          score: `${rest.score}%` // Format score for Excel
      }));
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Readiness Report');
      XLSX.writeFile(wb, `readiness_report_${jurisdiction}.xlsx`);
    },
    exportToPdf: () => {
      if (!tableData || tableData.length === 0) {
          alert("No data available to export.");
          return;
      }
      const doc = new jsPDF();
      doc.text(`Community Readiness Report - ${jurisdiction}`, 14, 15);
      autoTable(doc, {
        startY: 20,
        head: [['Community', 'Readiness Score', 'Status']], // Define headers
        body: tableData.map(row => [row.community, `${row.score}%`, row.status]), // Format score for PDF
      });
      doc.save(`readiness_report_${jurisdiction}.pdf`);
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
import React, { useState, useRef } from 'react'; // Import useRef
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button'; // Ensure correct path
import { Download, MapPin } from 'lucide-react';

// Import tab components AND their Ref types
import DemographicsTab, { DemographicsTabRef } from '../components/reporting/DemographicsTab';
import ReadinessTab, { ReadinessTabRef } from '../components/reporting/ReadinessTab';
import ResponseTab, { ResponseTabRef } from '../components/reporting/ResponseTab';

type Tab = 'demographics' | 'readiness' | 'response';

const ReportingCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('demographics');
  const { user } = useAuth();
  const userJurisdiction = user?.jurisdiction || 'All Regions'; // Assuming user object has jurisdiction

  // Refs to access export functions within tab components
  const demographicsRef = useRef<DemographicsTabRef>(null);
  const readinessRef = useRef<ReadinessTabRef>(null);
  const responseRef = useRef<ResponseTabRef>(null);

  // --- Updated Export Functions ---
  const handleExportExcel = () => {
    switch (activeTab) {
      case 'demographics':
        demographicsRef.current?.exportToExcel(); // Call function on ref
        break;
      case 'readiness':
        readinessRef.current?.exportToExcel();
        break;
      case 'response':
        responseRef.current?.exportToExcel();
        break;
    }
  };

  const handleExportPdf = () => {
    switch (activeTab) {
      case 'demographics':
        demographicsRef.current?.exportToPdf(); // Call function on ref
        break;
      case 'readiness':
        readinessRef.current?.exportToPdf();
        break;
      case 'response':
        responseRef.current?.exportToPdf();
        break;
    }
  };
  // --- End Updated Export Functions ---

  const renderTabContent = () => {
    switch (activeTab) {
      case 'demographics':
        // Pass the ref to the component
        return <DemographicsTab ref={demographicsRef} jurisdiction={userJurisdiction} />;
      case 'readiness':
        return <ReadinessTab ref={readinessRef} jurisdiction={userJurisdiction} />;
      case 'response':
        return <ResponseTab ref={responseRef} jurisdiction={userJurisdiction} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reporting Center</h1>
          <p className="flex items-center text-text-secondary mt-1">
            <MapPin size={16} className="mr-1.5" />
            Showing data for: <span className="font-medium text-text-primary ml-1">{userJurisdiction}</span>
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <Download size={16} className="mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={handleExportPdf}>
            <Download size={16} className="mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="border-b border-divider">
        <nav className="flex flex-wrap -mb-px space-x-4">
          <button
            onClick={() => setActiveTab('demographics')}
            className={`py-2 px-4 font-medium ${activeTab === 'demographics' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Demographics & Population
          </button>
          <button
            onClick={() => setActiveTab('readiness')}
            className={`py-2 px-4 font-medium ${activeTab === 'readiness' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Community Readiness
          </button>
          <button
            onClick={() => setActiveTab('response')}
            className={`py-2 px-4 font-medium ${activeTab === 'response' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Disaster Response
          </button>
        </nav>
      </div>

      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ReportingCenter;
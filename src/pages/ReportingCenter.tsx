import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { Download, MapPin } from 'lucide-react';

// Import the new components for each tab (we will create these next)
import DemographicsTab from '../components/reporting/DemographicsTab';
import ReadinessTab from '../components/reporting/ReadinessTab';
import ResponseTab from '../components/reporting/ResponseTab';

// Define the available tabs
type Tab = 'demographics' | 'readiness' | 'response';

const ReportingCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('demographics');
  const { user } = useAuth(); // To get coordinator's jurisdiction

  // TODO: Replace with real user jurisdiction from user object
  const userJurisdiction = user?.jurisdiction || 'All Regions';

  // --- EXPORT FUNCTIONS ---
  // We pass the activeTab to the components to get the correct data
  const handleExportExcel = () => {
    // We will trigger an export function inside the active tab component
    // This is a placeholder for now
    alert(`Exporting ${activeTab} data to Excel... (logic to be implemented in tab component)`);
  };

  const handleExportPdf = () => {
    // This is a placeholder for now
    alert(`Exporting ${activeTab} data to PDF... (logic to be implemented in tab component)`);
  };

  // --- RENDER FUNCTIONS ---
  const renderTabContent = () => {
    switch (activeTab) {
      case 'demographics':
        return <DemographicsTab jurisdiction={userJurisdiction} />;
      case 'readiness':
        return <ReadinessTab jurisdiction={userJurisdiction} />;
      case 'response':
        return <ResponseTab jurisdiction={userJurisdiction} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Export Buttons */}
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

      {/* 2. Tabs */}
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

      {/* 3. Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ReportingCenter;
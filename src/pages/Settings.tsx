import React, { useState } from 'react';
import { Settings as SettingsIcon, Users, Bell, Save, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'contacts' | 'notifications'>('general');
  const [loading, setLoading] = useState(false);
  
  const [] = useState<EmergencyContact[]>([]);
  
  const [] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: ''
  });
  
  const [notificationPrefs, setNotificationPrefs] = useState({
    method: user?.contactMethod || 'email',
    weatherAlerts: true,
    emergencyAlerts: true,
    communityUpdates: true,
    assessmentReminders: false
  });



  const saveSettings = async () => {
    setLoading(true);
    try {
      await updateProfile({
        contactMethod: notificationPrefs.method as 'email' | 'sms'
      });
      // In a real app, save contacts and notification preferences to backend
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
        <button
          onClick={saveSettings}
          disabled={loading}
          className="btn-primary"
        >
          <Save size={16} className="mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="card">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'general', label: 'General', icon: SettingsIcon },
              { id: 'contacts', label: 'Emergency Contacts', icon: Users },
              { id: 'notifications', label: 'Notifications', icon: Bell }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="font-bold text-text-primary">Notification Preferences</h3>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Preferred Contact Method
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="email"
                      checked={notificationPrefs.method === 'email'}
                      onChange={(e) => setNotificationPrefs({...notificationPrefs, method: e.target.value as 'email' | 'sms'})}
                      className="mr-2 text-primary focus:ring-primary"
                    />
                    <Mail className="mr-1" size={16} />
                    <span className="text-text-primary">Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="sms"
                      checked={notificationPrefs.method === 'sms'}
                      onChange={(e) => setNotificationPrefs({...notificationPrefs, method: e.target.value as 'email' | 'sms'})}
                      className="mr-2 text-primary focus:ring-primary"
                    />
                    <Phone className="mr-1" size={16} />
                    <span className="text-text-primary">SMS</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

import React, { useState } from 'react';
import { Settings, User, Phone, ChevronRight, LogOut, Bell, MapPin, Users as HouseholdIcon, Heart, PawPrint, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, updateProfile, signOut, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    location: user?.location || '',
    phoneNumber: user?.phoneNumber || '',
    contactMethod: user?.contactMethod || 'email',
    languages: user?.languages || [],
    householdSize: user?.householdSize || 1,
    hasVulnerableMembers: !!user?.vulnerableMembersDescription,
    vulnerableMembersDescription: user?.vulnerableMembersDescription || '',
    hasPets: (user?.numberOfPets || 0) > 0,
    numberOfPets: user?.numberOfPets || 0,
  });
  const [] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  if (!user) return null;

  const menuItems = [
    { id: 1, title: 'Emergency Contacts', icon: Phone, color: 'text-primary', bgColor: 'bg-primary/20', action: () => navigate('/settings/emergency-contacts') },
    { id: 2, title: 'Notification Settings', icon: Bell, color: 'text-accent', bgColor: 'bg-accent/20', action: () => navigate('/settings/notifications') },
    { id: 3, title: 'App Settings', icon: Settings, color: 'text-secondary', bgColor: 'bg-secondary/20', action: () => navigate('/settings/app') },
  ];

  const validatePhoneNumber = (number: string) => {
    if (!number) {
      setPhoneError('');
      return;
    }

    const phoneRegex = /^\+[1-9]\d{8,12}$/;

    if (!phoneRegex.test(number)) {
      setPhoneError('Phone number must be in format: +[country code][9-10 digits] (e.g., +1234567890)');
    } else {
      const digitsAfterPlus = number.substring(1);
      if (digitsAfterPlus.length < 10 || digitsAfterPlus.length > 13) {
        setPhoneError('Phone number must have 9-10 digits plus country code');
      } else {
        setPhoneError('');
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setFormData(prev => ({ ...prev, phoneNumber: newPhoneNumber }));
    validatePhoneNumber(newPhoneNumber);
  };

  const handleSave = async () => {
    if (phoneError) return; // Don't save if there's a validation error
    try {
      const profileToSave = {
        ...formData,
        vulnerableMembersDescription: formData.hasVulnerableMembers ? formData.vulnerableMembersDescription : '',
        numberOfPets: formData.hasPets ? formData.numberOfPets : 0,
      };
      await updateProfile(profileToSave);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
  
  const handleCancel = () => {
    setFormData({
        fullName: user?.fullName || '',
        location: user?.location || '',
        phoneNumber: user?.phoneNumber || '',
        contactMethod: user?.contactMethod || 'email',
        languages: user?.languages || [],
        householdSize: user?.householdSize || 1,
        hasVulnerableMembers: !!user?.vulnerableMembersDescription,
        vulnerableMembersDescription: user?.vulnerableMembersDescription || '',
        hasPets: (user?.numberOfPets || 0) > 0,
        numberOfPets: user?.numberOfPets || 0,
    });
    setEditing(false);
    setPhoneError(''); // Clear any errors on cancel
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      return;
    }

    try {
      await deleteAccount();
      navigate('/signin');
    } catch (error) {
      console.error('Delete account error:', error);
      alert('Failed to delete account. Please try again.');
    }
  };



  return (
    <div className="space-y-6 pb-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="text-primary" size={32} />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-1">{user.fullName}</h2>
          <p className="text-sm text-text-secondary mb-1">{user.email}</p>
        </div>
        <button onClick={() => setEditing(!editing)} className="btn-primary ml-auto">
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Information Section */}
      <div className="card p-4">
        <h3 className="text-lg font-bold text-text-primary mb-4">
          Profile Information
        </h3>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
              <input type="text" value={formData.fullName} onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))} className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Home Address / Location</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary"/>
            </div>
             <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
              <input type="tel" value={formData.phoneNumber} onChange={handlePhoneChange} className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary"/>
              {phoneError && <p className="text-error text-xs mt-1">{phoneError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Household Size</label>
              <input type="number" value={formData.householdSize} onChange={(e) => setFormData(prev => ({ ...prev, householdSize: parseInt(e.target.value) || 1 }))} className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary" min="1"/>
            </div>
            <div className="p-3 bg-surface/50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-text-primary">Vulnerable members in household?</label>
                    <ToggleSwitch isEnabled={formData.hasVulnerableMembers} onToggle={() => setFormData(prev => ({...prev, hasVulnerableMembers: !prev.hasVulnerableMembers}))} />
                </div>
                {formData.hasVulnerableMembers && (
                    <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">Please describe (e.g., elderly, infants)</label>
                        <input type="text" value={formData.vulnerableMembersDescription} onChange={(e) => setFormData(prev => ({ ...prev, vulnerableMembersDescription: e.target.value }))} placeholder="e.g., 1 elderly, 1 infant" className="w-full bg-white rounded-lg px-3 py-2 text-text-primary"/>
                    </div>
                )}
            </div>
            <div className="p-3 bg-surface/50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-text-primary">Pets in household?</label>
                    <ToggleSwitch isEnabled={formData.hasPets} onToggle={() => setFormData(prev => ({...prev, hasPets: !prev.hasPets}))} />
                </div>
                {formData.hasPets && (
                    <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">Number of Pets</label>
                        <input type="number" value={formData.numberOfPets} onChange={(e) => setFormData(prev => ({ ...prev, numberOfPets: parseInt(e.target.value) || 0 }))} className="w-full bg-white rounded-lg px-3 py-2 text-text-primary" min="0"/>
                    </div>
                )}
            </div>
            <div className="flex space-x-3 pt-4">
              <button onClick={handleCancel} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={!!phoneError} className="flex-1 btn-primary disabled:opacity-50">Save Changes</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <InfoRow label="Full Name" value={user.fullName} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone Number" value={user.phoneNumber || 'Not specified'} icon={Phone} />
            <InfoRow label="Home Address" value={user.location || 'Not specified'} icon={MapPin} />
            <InfoRow label="Household Size" value={user.householdSize || 1} icon={HouseholdIcon} />
            <InfoRow label="Vulnerable Members" value={user.vulnerableMembersDescription || 'None specified'} icon={Heart} />
            <InfoRow label="Number of Pets" value={user.numberOfPets || 0} icon={PawPrint} />
          </div>
        )}
      </div>
      
      {/* Quick Access */}
      <div className="card p-4">
        <h3 className="text-lg font-bold text-text-primary mb-2">Quick Access</h3>
        <div className="space-y-2">
            {menuItems.map((item) => {
                const Icon = item.icon
                return (
                    <button key={item.id} onClick={item.action} className="w-full flex items-center p-3 hover:bg-surface rounded-lg transition-colors">
                        <div className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center mr-3`}>
                            <Icon size={20} className={item.color} />
                        </div>
                        <span className="flex-1 text-left text-text-primary">{item.title}</span>
                        <ChevronRight size={20} className="text-text-tertiary" />
                    </button>
                )
            })}
        </div>
      </div>

      <button onClick={handleSignOut} className="w-full card p-4 flex items-center justify-center hover:bg-surface transition-colors duration-200">
        <LogOut size={20} className="text-error mr-2" />
        <span className="font-medium text-error">Sign Out</span>
      </button>

      <button onClick={() => setShowDeleteModal(true)} className="w-full card p-4 flex items-center justify-center hover:bg-surface transition-colors duration-200 border border-error/20">
        <Trash2 size={20} className="text-error mr-2" />
        <span className="font-medium text-error">Delete Account</span>
      </button>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-text-primary mb-4">Delete Account</h3>
            <p className="text-text-secondary mb-4">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <p className="text-text-secondary mb-4">
              Type <span className="font-bold text-error">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary mb-4 border border-border focus:outline-none focus:ring-2 focus:ring-error"
              placeholder="Type DELETE"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className="flex-1 bg-error text-white rounded-lg px-4 py-2 font-medium hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const InfoRow: React.FC<{label: string, value: string | number, icon?: React.ElementType}> = ({ label, value, icon: Icon }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary mb-1 flex items-center">
            {Icon && <Icon size={14} className="mr-2" />}
            {label}
        </label>
        <p className="text-text-primary">{value}</p>
    </div>
);

const ToggleSwitch: React.FC<{isEnabled: boolean, onToggle: () => void}> = ({ isEnabled, onToggle }) => (
    <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEnabled ? 'bg-primary' : 'bg-border'}`}
    >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`}/>
    </button>
);

export default Profile;

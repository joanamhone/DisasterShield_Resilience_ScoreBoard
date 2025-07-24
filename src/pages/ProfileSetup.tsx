import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, MapPin, Calendar, Briefcase, Loader2 } from 'lucide-react';

const ProfileSetup: React.FC = () => {
  // 1. Destructure the CORRECT function 'updateProfile' and the 'loading' state
  const { user, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  
  // 2. Align formData with your actual User type (use 'fullName')
  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    phoneNumber: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Pre-populate form with existing user data once it's available
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        location: user.location || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]); // This effect runs when the user object is loaded

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // Can't submit if there's no user
    
    setIsSaving(true);

    try {
      // 3. Call the correct 'updateProfile' function
      await updateProfile({
        ...formData, // This now includes fullName, location, phoneNumber
        profileCompleted: true // Mark the profile as complete
      });

      // Navigate based on user type
      switch (user.userType) {
        case 'community_leader':
          navigate('/community-dashboard');
          break;
        case 'school_admin':
          navigate('/school-dashboard');
          break;
        case 'disaster_coordinator':
          navigate('/coordinator-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // You could add a user-facing error message here
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Show a full-page loader while the AuthContext is getting the user
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-lg text-gray-700">Loading Your Profile...</p>
      </div>
    );
  }

  // If for some reason we finish loading but have no user, redirect
  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Help us personalize your disaster preparedness experience.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your full name"
                />
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="mt-1 relative">
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your city or region"
                />
                <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your phone number"
                />
                <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* User Type Display (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <div className="mt-1 relative">
                <div className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 bg-gray-50 text-gray-900 rounded-md sm:text-sm">
                  {user.userType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <Briefcase className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSaving}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
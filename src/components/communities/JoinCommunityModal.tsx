import React, { useState } from 'react';
import { X, MapPin, Users } from 'lucide-react';
import Button from '../ui/Button';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '../../contexts/AuthContext';

interface Community {
  id: string;
  name: string;
  location: string;
  description?: string;
}

interface JoinCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  community: Community | null;
  onSuccess: () => void;
}

const JoinCommunityModal: React.FC<JoinCommunityModalProps> = ({
  isOpen,
  onClose,
  community,
  onSuccess
}) => {
  const [countryCode, setCountryCode] = useState('+263');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!community || !user) return;

    setLoading(true);
    try {
      // Store join request in localStorage
      const joinRequests = JSON.parse(localStorage.getItem('join_requests') || '[]');
      const newRequest = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.user_metadata?.full_name || user.email,
        userLocation: user.user_metadata?.location || 'Harare, Zimbabwe',
        communityId: community.id,
        communityName: community.name,
        phoneNumber: countryCode + phoneNumber,
        email: email,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      joinRequests.push(newRequest);
      localStorage.setItem('join_requests', JSON.stringify(joinRequests));

      // Directly join the community
      localStorage.setItem(`joined_community_${user.id}`, community.id);
      
      alert('Successfully joined the community!');
      onSuccess();
      setPhoneNumber('');
      setEmail('');
    } catch (error) {
      console.error('Error submitting join request:', error);
      alert('Failed to submit join request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !community) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Join Community</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">{community.name}</h3>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{community.location}</span>
          </div>
          {community.description && (
            <p className="text-sm text-gray-600 mt-2">{community.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="flex space-x-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="+263">🇿🇼 +263 (Zimbabwe)</option>
                <option value="+27">🇿🇦 +27 (South Africa)</option>
                <option value="+254">🇰🇪 +254 (Kenya)</option>
                <option value="+256">🇺🇬 +256 (Uganda)</option>
                <option value="+255">🇹🇿 +255 (Tanzania)</option>
                <option value="+234">🇳🇬 +234 (Nigeria)</option>
                <option value="+233">🇬🇭 +233 (Ghana)</option>
                <option value="+260">🇿🇲 +260 (Zambia)</option>
                <option value="+265">🇲🇼 +265 (Malawi)</option>
                <option value="+267">🇧🇼 +267 (Botswana)</option>
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter your phone number without the country code</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              You will immediately become a member of this community and receive alerts.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Joining...' : 'Join Community'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinCommunityModal;
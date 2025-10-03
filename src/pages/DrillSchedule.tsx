import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Bell, MessageSquare, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface CommunityGroup {
  id: string;
  name: string;
  total_members: number;
}

const DrillSchedule: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    drillType: 'fire' as 'fire' | 'earthquake' | 'flood' | 'evacuation' | 'general',
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    durationMinutes: 60,
    location: '',
    communityId: '',
    notifyViaPush: true,
    notifyViaSMS: false,
  });

  const [communities, setCommunities] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadCommunities();
  }, [user]);

  const loadCommunities = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('community_groups')
        .select('id, name, total_members')
        .eq('leader_id', user.id);

      if (error) throw error;
      setCommunities(data || []);
    } catch (err) {
      console.error('Error loading communities:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.title.trim() || !formData.scheduledDate || !formData.scheduledTime) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);

      const { data: drillData, error: insertError } = await supabase
        .from('drills')
        .insert({
          organizer_id: user?.id,
          community_id: formData.communityId || null,
          drill_type: formData.drillType,
          title: formData.title,
          description: formData.description,
          scheduled_date: scheduledDateTime.toISOString(),
          duration_minutes: formData.durationMinutes,
          location: formData.location,
          status: 'scheduled',
          notification_sent: false,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const selectedCommunity = communities.find(c => c.id === formData.communityId);

      if (formData.notifyViaPush || formData.notifyViaSMS) {
        const notificationMethods = [];
        if (formData.notifyViaPush) notificationMethods.push('push');
        if (formData.notifyViaSMS) notificationMethods.push('sms');

        await supabase.from('alerts').insert({
          sender_id: user?.id,
          alert_type: 'general',
          severity: 'low',
          title: `Drill Scheduled: ${formData.title}`,
          message: `Emergency drill scheduled for ${formData.scheduledDate} at ${formData.scheduledTime}. Location: ${formData.location || 'TBD'}. Duration: ${formData.durationMinutes} minutes.`,
          target_audience: formData.communityId ? 'community' : 'all',
          target_community_id: formData.communityId || null,
          recipients_count: selectedCommunity?.total_members || 0,
          delivery_method: notificationMethods,
        });
      }

      await supabase.from('drills').update({ notification_sent: true }).eq('id', drillData.id);

      setSuccess(true);
      setTimeout(() => {
        navigate('/community-dashboard');
      }, 2000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const drillTypes = [
    { value: 'fire', label: 'Fire Drill', icon: '🔥', color: 'bg-red-100 text-red-800' },
    { value: 'earthquake', label: 'Earthquake Drill', icon: '🌍', color: 'bg-orange-100 text-orange-800' },
    { value: 'flood', label: 'Flood Drill', icon: '🌊', color: 'bg-blue-100 text-blue-800' },
    { value: 'evacuation', label: 'Evacuation Drill', icon: '🚪', color: 'bg-purple-100 text-purple-800' },
    { value: 'general', label: 'General Preparedness', icon: '📋', color: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule Emergency Drill</h1>
            <p className="text-gray-600">Plan and notify your community about upcoming drills</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Drill scheduled successfully! Notifications sent. Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Drill Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {drillTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, drillType: type.value as any }))}
                  className={`p-3 border-2 rounded-lg text-center transition-colors ${
                    formData.drillType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Drill Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Monthly Fire Drill"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide details about the drill objectives and procedures..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <select
              value={formData.durationMinutes}
              onChange={(e) => setFormData(prev => ({ ...prev, durationMinutes: Number(e.target.value) }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter drill location"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Community
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={formData.communityId}
                onChange={(e) => setFormData(prev => ({ ...prev, communityId: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All communities</option>
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.name} ({community.total_members} members)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Notification Methods
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.notifyViaPush}
                  onChange={(e) => setFormData(prev => ({ ...prev, notifyViaPush: e.target.checked }))}
                  className="mr-3"
                />
                <Bell className="mr-3 text-gray-600" size={20} />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Push Notifications</div>
                  <div className="text-sm text-gray-600">Send via mobile app notifications</div>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.notifyViaSMS}
                  onChange={(e) => setFormData(prev => ({ ...prev, notifyViaSMS: e.target.checked }))}
                  className="mr-3"
                />
                <MessageSquare className="mr-3 text-gray-600" size={20} />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">SMS Notifications</div>
                  <div className="text-sm text-gray-600">Send via text message</div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/community-dashboard')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {loading ? 'Scheduling...' : 'Schedule Drill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DrillSchedule;

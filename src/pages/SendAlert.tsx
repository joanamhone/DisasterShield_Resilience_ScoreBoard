import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Send, Users, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface CommunityGroup {
  id: string;
  name: string;
  total_members: number;
  location: string;
}

const SendAlert: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    alertType: 'general' as 'weather' | 'flood' | 'fire' | 'earthquake' | 'general',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    title: '',
    message: '',
    targetAudience: 'all' as 'all' | 'community' | 'region' | 'specific_group',
    targetCommunityId: '',
    deliveryMethod: ['email'] as string[],
    expiresInHours: 24,
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
        .select('id, name, total_members, location')
        .eq('leader_id', user.id);

      if (error) throw error;
      setCommunities(data || []);
    } catch (err) {
      console.error('Error loading communities:', err);
    }
  };

  const handleDeliveryMethodToggle = (method: string) => {
    setFormData(prev => {
      const methods = prev.deliveryMethod.includes(method)
        ? prev.deliveryMethod.filter(m => m !== method)
        : [...prev.deliveryMethod, method];
      return { ...prev, deliveryMethod: methods };
    });
  };

  const calculateRecipientsCount = () => {
    if (formData.targetAudience === 'all') {
      return communities.reduce((sum, c) => sum + c.total_members, 0);
    } else if (formData.targetAudience === 'community' && formData.targetCommunityId) {
      const community = communities.find(c => c.id === formData.targetCommunityId);
      return community?.total_members || 0;
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.title.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.deliveryMethod.length === 0) {
      setError('Please select at least one delivery method');
      return;
    }

    setLoading(true);

    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + formData.expiresInHours);

      const { error: insertError } = await supabase.from('alerts').insert({
        sender_id: user?.id,
        alert_type: formData.alertType,
        severity: formData.severity,
        title: formData.title,
        message: formData.message,
        target_audience: formData.targetAudience,
        target_community_id: formData.targetCommunityId || null,
        recipients_count: calculateRecipientsCount(),
        delivery_method: formData.deliveryMethod,
        expires_at: expiresAt.toISOString(),
      });

      if (insertError) throw insertError;

      await supabase.from('progress_tracking').upsert({
        user_id: user?.id,
        progress_type: 'community_leader',
        alerts_sent: supabase.rpc('increment', { x: 1 }),
      }, { onConflict: 'user_id' });

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

  const alertTypes = [
    { value: 'weather', label: 'Weather Alert', icon: '🌤️' },
    { value: 'flood', label: 'Flood Warning', icon: '🌊' },
    { value: 'fire', label: 'Fire Alert', icon: '🔥' },
    { value: 'earthquake', label: 'Earthquake Alert', icon: '🌍' },
    { value: 'general', label: 'General Alert', icon: '📢' },
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800 border-red-300' },
  ];

  const deliveryMethods = [
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'sms', label: 'SMS', icon: '📱' },
    { value: 'push', label: 'Push Notification', icon: '🔔' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Send Community Alert</h1>
            <p className="text-gray-600">Notify your community about important updates</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Alert sent successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Alert Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {alertTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, alertType: type.value as any }))}
                  className={`p-3 border-2 rounded-lg text-center transition-colors ${
                    formData.alertType === type.value
                      ? 'border-red-500 bg-red-50'
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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Severity Level
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {severityLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, severity: level.value as any }))}
                  className={`p-3 border-2 rounded-lg font-medium transition-colors ${
                    formData.severity === level.value
                      ? level.color + ' border-current'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., Severe Weather Warning"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Provide detailed information about the alert..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.message.length} / 500 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Target Audience
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="targetAudience"
                  value="all"
                  checked={formData.targetAudience === 'all'}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value as any }))}
                  className="mr-3"
                />
                <Users className="mr-3 text-gray-600" size={20} />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">All Communities</div>
                  <div className="text-sm text-gray-600">Send to everyone in all your communities</div>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="targetAudience"
                  value="community"
                  checked={formData.targetAudience === 'community'}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value as any }))}
                  className="mr-3"
                />
                <MapPin className="mr-3 text-gray-600" size={20} />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Specific Community</div>
                  <div className="text-sm text-gray-600">Send to a specific community group</div>
                </div>
              </label>

              {formData.targetAudience === 'community' && (
                <select
                  value={formData.targetCommunityId}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetCommunityId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ml-8"
                >
                  <option value="">Select a community</option>
                  {communities.map((community) => (
                    <option key={community.id} value={community.id}>
                      {community.name} ({community.total_members} members)
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Delivery Methods
            </label>
            <div className="grid grid-cols-3 gap-3">
              {deliveryMethods.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => handleDeliveryMethodToggle(method.value)}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    formData.deliveryMethod.includes(method.value)
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{method.icon}</div>
                  <div className="text-sm font-medium text-gray-700">{method.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Duration
            </label>
            <div className="flex items-center gap-3">
              <Clock className="text-gray-600" size={20} />
              <select
                value={formData.expiresInHours}
                onChange={(e) => setFormData(prev => ({ ...prev, expiresInHours: Number(e.target.value) }))}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value={1}>1 hour</option>
                <option value={6}>6 hours</option>
                <option value={12}>12 hours</option>
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
                <option value={72}>3 days</option>
                <option value={168}>1 week</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Alert Summary</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Alert Type:</span>
                <span className="font-medium text-gray-900">{alertTypes.find(t => t.value === formData.alertType)?.label}</span>
              </div>
              <div className="flex justify-between">
                <span>Severity:</span>
                <span className="font-medium text-gray-900">{formData.severity.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>Recipients:</span>
                <span className="font-medium text-gray-900">{calculateRecipientsCount()} people</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="font-medium text-gray-900">{formData.deliveryMethod.join(', ')}</span>
              </div>
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
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send size={20} />
              {loading ? 'Sending...' : 'Send Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendAlert;

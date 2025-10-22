import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users, FileText, Send, ArrowLeft, Plus, X } from 'lucide-react'
import { communityService, CommunityGroup } from '../services/communityService'
import { drillService } from '../services/drillService'
import { supabase } from '../lib/supabase'

const ScheduleDrill: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: '',
    time: '',
    duration: '',
    venue: '',
    maxParticipants: '',
    description: '',
    objectives: [''],
    materials: [''],
    targetGroups: [] as string[],
    notificationMethod: 'all'
  })
  const [loading, setLoading] = useState(false)
  const [communityGroups, setCommunityGroups] = useState<CommunityGroup[]>([])
  const [loadingGroups, setLoadingGroups] = useState(true)

  const drillTypes = [
    'Fire Evacuation',
    'Earthquake Response',
    'Flood Response',
    'Severe Weather',
    'Medical Emergency',
    'Security Threat',
    'Chemical Spill',
    'Power Outage'
  ]

  useEffect(() => {
    const fetchCommunityGroups = async () => {
      setLoadingGroups(true)
      const groups = await communityService.getCommunityGroups()
      setCommunityGroups(groups)
      setLoadingGroups(false)
    }
    fetchCommunityGroups()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: 'objectives' | 'materials', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'objectives' | 'materials') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field: 'objectives' | 'materials', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleGroupToggle = (groupId: string) => {
    setFormData(prev => ({
      ...prev,
      targetGroups: prev.targetGroups.includes(groupId)
        ? prev.targetGroups.filter(g => g !== groupId)
        : [...prev.targetGroups, groupId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Map drill types to database enum values
      const drillTypeMap: { [key: string]: string } = {
        'Fire Evacuation': 'fire',
        'Earthquake Response': 'earthquake',
        'Flood Response': 'flood',
        'Severe Weather': 'general',
        'Medical Emergency': 'general',
        'Security Threat': 'general',
        'Chemical Spill': 'general',
        'Power Outage': 'general'
      }

      // Prepare drill data
      const drillData = {
        drill_type: drillTypeMap[formData.type] || 'general' as any,
        title: formData.title,
        description: formData.description,
        scheduled_date: `${formData.date}T${formData.time}:00`,
        duration_minutes: formData.duration ? parseInt(formData.duration) : undefined,
        location: formData.venue,
        community_id: formData.targetGroups[0] || '' // Use first selected group as primary
      }

      // Determine notification methods
      const notificationMethods = formData.notificationMethod === 'all' 
        ? ['email', 'sms', 'push']
        : [formData.notificationMethod]

      // Schedule drill with notifications
      const result = await drillService.scheduleDrill(
        user.id,
        drillData,
        formData.targetGroups,
        notificationMethods
      )

      if (!result.success) {
        throw new Error(result.error || 'Failed to schedule drill')
      }
      
      // Navigate back to community dashboard
      navigate('/', { 
        state: { 
          message: 'Drill scheduled successfully! Notifications have been sent to selected groups.',
          type: 'success'
        }
      })
    } catch (error) {
      console.error('Error scheduling drill:', error)
      navigate('/', {
        state: {
          message: `Error scheduling drill: ${(error as Error).message}`,
          type: 'error'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return formData.title && formData.type && formData.date && formData.time && 
           formData.venue && formData.maxParticipants && formData.description &&
           formData.targetGroups.length > 0
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Schedule Community Drill</h2>
            <p className="text-text-secondary">Plan and organize an emergency drill for your community</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Drill Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
                placeholder="e.g., Monthly Fire Evacuation Drill"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Drill Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
                required
              >
                <option value="">Select drill type</option>
                {drillTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <Calendar size={16} className="inline mr-1" />
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <Clock size={16} className="inline mr-1" />
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
                placeholder="e.g., 60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <Users size={16} className="inline mr-1" />
                Max Participants *
              </label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
                placeholder="e.g., 50"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              <MapPin size={16} className="inline mr-1" />
              Venue *
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => handleInputChange('venue', e.target.value)}
              className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
              placeholder="e.g., Community Center Main Hall"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border h-24"
              placeholder="Describe the drill purpose, what participants will learn, and any special instructions..."
              required
            />
          </div>
        </div>

        {/* Drill Content */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Drill Content</h3>
          
          {/* Objectives */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Learning Objectives
            </label>
            {formData.objectives.map((objective, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                  className="flex-1 bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
                  placeholder={`Objective ${index + 1}`}
                />
                {formData.objectives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('objectives', index)}
                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('objectives')}
              className="flex items-center text-primary hover:underline text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Objective
            </button>
          </div>

          {/* Materials */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Required Materials/Equipment
            </label>
            {formData.materials.map((material, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={material}
                  onChange={(e) => handleArrayChange('materials', index, e.target.value)}
                  className="flex-1 bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
                  placeholder={`Material ${index + 1}`}
                />
                {formData.materials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('materials', index)}
                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('materials')}
              className="flex items-center text-primary hover:underline text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Material
            </button>
          </div>
        </div>

        {/* Target Groups */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Target Groups</h3>
          <p className="text-text-secondary text-sm mb-4">
            Select which community groups should be invited to participate in this drill
          </p>
          {loadingGroups ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
              <span className="ml-2 text-text-secondary">Loading community groups...</span>
            </div>
          ) : communityGroups.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              No community groups found. Please create groups first.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {communityGroups.map(group => (
                <label key={group.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-surface cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.targetGroups.includes(group.id)}
                    onChange={() => handleGroupToggle(group.id)}
                    className="text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <span className="text-text-primary font-medium">{group.name}</span>
                    {group.description && (
                      <p className="text-text-secondary text-sm">{group.description}</p>
                    )}
                    {group.member_count && (
                      <p className="text-text-secondary text-xs">{group.member_count} members</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Notification Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="notificationMethod"
                value="all"
                checked={formData.notificationMethod === 'all'}
                onChange={(e) => handleInputChange('notificationMethod', e.target.value)}
                className="text-primary focus:ring-primary"
              />
              <div>
                <span className="text-text-primary font-medium">Send to all methods</span>
                <p className="text-text-secondary text-sm">Push notifications, SMS, and email</p>
              </div>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="notificationMethod"
                value="push"
                checked={formData.notificationMethod === 'push'}
                onChange={(e) => handleInputChange('notificationMethod', e.target.value)}
                className="text-primary focus:ring-primary"
              />
              <div>
                <span className="text-text-primary font-medium">Push notifications only</span>
                <p className="text-text-secondary text-sm">In-app notifications</p>
              </div>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="notificationMethod"
                value="sms"
                checked={formData.notificationMethod === 'sms'}
                onChange={(e) => handleInputChange('notificationMethod', e.target.value)}
                className="text-primary focus:ring-primary"
              />
              <div>
                <span className="text-text-primary font-medium">SMS only</span>
                <p className="text-text-secondary text-sm">Text messages to registered phone numbers</p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Scheduling...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Schedule Drill & Send Invitations
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ScheduleDrill
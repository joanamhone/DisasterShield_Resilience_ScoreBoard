import React, { useState } from 'react'
import { Users, Shield, MapPin, Clock, Plus, Phone, Mail } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  specialization: string
  phone: string
  email: string
  status: 'available' | 'deployed' | 'off-duty'
}

interface ResponseTeam {
  id: string
  name: string
  type: 'medical' | 'fire' | 'rescue' | 'evacuation' | 'logistics'
  members: TeamMember[]
  currentDeployment?: {
    location: string
    startTime: string
    duration: string
    mission: string
  }
  status: 'standby' | 'deployed' | 'returning'
}

const ResponseTeams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teams' | 'members' | 'deployments'>('teams')
  const [showAddForm, setShowAddForm] = useState(false)
  const [] = useState<string | null>(null)

  const [teams, setTeams] = useState<ResponseTeam[]>([
    {
      id: '1',
      name: 'Alpha Medical Team',
      type: 'medical',
      status: 'deployed',
      members: [
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          role: 'Team Leader',
          specialization: 'Emergency Medicine',
          phone: '+1 (555) 123-4567',
          email: 'sarah.johnson@emergency.gov',
          status: 'deployed'
        },
        {
          id: '2',
          name: 'Mike Chen',
          role: 'Paramedic',
          specialization: 'Critical Care',
          phone: '+1 (555) 234-5678',
          email: 'mike.chen@emergency.gov',
          status: 'deployed'
        }
      ],
      currentDeployment: {
        location: 'Riverside Area',
        startTime: '4 hours ago',
        duration: '8 hours',
        mission: 'Medical support for flood evacuation'
      }
    },
    {
      id: '2',
      name: 'Bravo Fire & Rescue',
      type: 'fire',
      status: 'standby',
      members: [
        {
          id: '3',
          name: 'Captain Tom Wilson',
          role: 'Team Leader',
          specialization: 'Fire Suppression',
          phone: '+1 (555) 345-6789',
          email: 'tom.wilson@fire.gov',
          status: 'available'
        },
        {
          id: '4',
          name: 'Lisa Rodriguez',
          role: 'Firefighter',
          specialization: 'Technical Rescue',
          phone: '+1 (555) 456-7890',
          email: 'lisa.rodriguez@fire.gov',
          status: 'available'
        }
      ]
    },
    {
      id: '3',
      name: 'Charlie Evacuation Unit',
      type: 'evacuation',
      status: 'deployed',
      members: [
        {
          id: '5',
          name: 'James Park',
          role: 'Coordinator',
          specialization: 'Logistics',
          phone: '+1 (555) 567-8901',
          email: 'james.park@emergency.gov',
          status: 'deployed'
        }
      ],
      currentDeployment: {
        location: 'Forest Hills',
        startTime: '2 hours ago',
        duration: '12 hours',
        mission: 'Wildfire evacuation coordination'
      }
    }
  ])

  const [newTeam, setNewTeam] = useState({
    name: '',
    type: 'medical' as const
  })

  const getTeamTypeIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return '🏥'
      case 'fire':
        return '🚒'
      case 'rescue':
        return '🚁'
      case 'evacuation':
        return '🚌'
      case 'logistics':
        return '📦'
      default:
        return '👥'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'standby':
        return 'text-success bg-success/20'
      case 'deployed':
        return 'text-warning bg-warning/20'
      case 'returning':
        return 'text-accent bg-accent/20'
      case 'off-duty':
        return 'text-text-secondary bg-surface'
      default:
        return 'text-text-secondary bg-surface'
    }
  }

  const addTeam = () => {
    if (newTeam.name.trim()) {
      const team: ResponseTeam = {
        id: Date.now().toString(),
        name: newTeam.name,
        type: newTeam.type,
        members: [],
        status: 'standby'
      }
      setTeams(prev => [...prev, team])
      setNewTeam({ name: '', type: 'medical' })
      setShowAddForm(false)
    }
  }

  const totalMembers = teams.reduce((sum, team) => sum + team.members.length, 0)
  const deployedTeams = teams.filter(team => team.status === 'deployed').length
  const availableMembers = teams.reduce((sum, team) => 
    sum + team.members.filter(member => member.status === 'available').length, 0
  )

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Response Teams Management
        </h2>
        <p className="text-text-secondary">
          Manage emergency response teams, deployments, and personnel
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Total Teams</h3>
            <Shield className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold text-primary">{teams.length}</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Deployed Teams</h3>
            <MapPin className="text-warning" size={20} />
          </div>
          <div className="text-2xl font-bold text-warning">{deployedTeams}</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Total Members</h3>
            <Users className="text-accent" size={20} />
          </div>
          <div className="text-2xl font-bold text-accent">{totalMembers}</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Available</h3>
            <Clock className="text-success" size={20} />
          </div>
          <div className="text-2xl font-bold text-success">{availableMembers}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'teams', label: 'Teams Overview' },
              { id: 'members', label: 'Team Members' },
              { id: 'deployments', label: 'Active Deployments' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'teams' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-text-primary">Response Teams</h3>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary"
                >
                  <Plus size={16} className="mr-2" />
                  Add Team
                </button>
              </div>

              {showAddForm && (
                <div className="p-4 bg-surface rounded-lg">
                  <h4 className="font-medium text-text-primary mb-3">Add New Team</h4>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Team Name"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                      className="flex-1 bg-card rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
                    />
                    <select
                      value={newTeam.type}
                      onChange={(e) => setNewTeam({...newTeam, type: e.target.value as any})}
                      className="bg-card rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
                    >
                      <option value="medical">Medical</option>
                      <option value="fire">Fire & Rescue</option>
                      <option value="rescue">Search & Rescue</option>
                      <option value="evacuation">Evacuation</option>
                      <option value="logistics">Logistics</option>
                    </select>
                    <button onClick={addTeam} className="btn-primary">Add</button>
                    <button onClick={() => setShowAddForm(false)} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map((team) => (
                  <div key={team.id} className="card p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getTeamTypeIcon(team.type)}</div>
                        <div>
                          <h4 className="font-bold text-text-primary">{team.name}</h4>
                          <p className="text-sm text-text-secondary capitalize">{team.type} Team</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(team.status)}`}>
                        {team.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Members:</span>
                        <span className="font-medium text-text-primary">{team.members.length}</span>
                      </div>
                      {team.currentDeployment && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Location:</span>
                            <span className="font-medium text-text-primary">{team.currentDeployment.location}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Duration:</span>
                            <span className="font-medium text-text-primary">{team.currentDeployment.startTime}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button className="btn-secondary text-sm flex-1">View Details</button>
                      {team.status === 'standby' && (
                        <button className="btn-primary text-sm">Deploy</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">Team Members Directory</h3>
              <div className="space-y-4">
                {teams.map((team) => (
                  <div key={team.id} className="space-y-3">
                    <h4 className="font-medium text-text-primary flex items-center">
                      <span className="mr-2">{getTeamTypeIcon(team.type)}</span>
                      {team.name}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {team.members.map((member) => (
                        <div key={member.id} className="p-3 bg-surface rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h5 className="font-medium text-text-primary">{member.name}</h5>
                              <p className="text-sm text-text-secondary">{member.role}</p>
                              <p className="text-xs text-text-tertiary">{member.specialization}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                              {member.status}
                            </span>
                          </div>
                          <div className="space-y-1 text-xs text-text-tertiary">
                            <div className="flex items-center">
                              <Phone size={12} className="mr-1" />
                              <span>{member.phone}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail size={12} className="mr-1" />
                              <span>{member.email}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'deployments' && (
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">Active Deployments</h3>
              <div className="space-y-4">
                {teams.filter(team => team.currentDeployment).map((team) => (
                  <div key={team.id} className="card p-4 border-l-4 border-l-warning">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{getTeamTypeIcon(team.type)}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-text-primary mb-1">{team.name}</h4>
                          <p className="text-text-secondary mb-2">{team.currentDeployment!.mission}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-text-secondary">Location:</span>
                              <div className="font-medium text-text-primary">{team.currentDeployment!.location}</div>
                            </div>
                            <div>
                              <span className="text-text-secondary">Started:</span>
                              <div className="font-medium text-text-primary">{team.currentDeployment!.startTime}</div>
                            </div>
                            <div>
                              <span className="text-text-secondary">Duration:</span>
                              <div className="font-medium text-text-primary">{team.currentDeployment!.duration}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn-secondary text-sm">Update</button>
                        <button className="btn-primary text-sm">Recall</button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {teams.filter(team => team.currentDeployment).length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="mx-auto mb-3 text-text-tertiary" size={48} />
                    <p className="text-text-secondary">No active deployments</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResponseTeams
import React, { useState } from 'react'
import { Users, MapPin, TrendingUp, AlertTriangle, Plus, Edit, Save } from 'lucide-react'

interface DistrictData {
  id: string
  name: string
  population: number
  affected: number
  evacuated: number
  sheltered: number
  status: 'safe' | 'at-risk' | 'evacuating' | 'critical'
  lastUpdated: string
}

const AffectedPopulation: React.FC = () => {
  const [editingDistrict, setEditingDistrict] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  
  const [districts, setDistricts] = useState<DistrictData[]>([
    {
      id: '1',
      name: 'Downtown District',
      population: 15000,
      affected: 3500,
      evacuated: 500,
      sheltered: 200,
      status: 'at-risk',
      lastUpdated: '2 hours ago'
    },
    {
      id: '2',
      name: 'Riverside Area',
      population: 8500,
      affected: 1200,
      evacuated: 800,
      sheltered: 600,
      status: 'evacuating',
      lastUpdated: '1 hour ago'
    },
    {
      id: '3',
      name: 'Industrial Zone',
      population: 12000,
      affected: 2800,
      evacuated: 0,
      sheltered: 0,
      status: 'at-risk',
      lastUpdated: '3 hours ago'
    },
    {
      id: '4',
      name: 'North District',
      population: 20000,
      affected: 0,
      evacuated: 0,
      sheltered: 0,
      status: 'safe',
      lastUpdated: '1 hour ago'
    },
    {
      id: '5',
      name: 'Forest Hills',
      population: 5500,
      affected: 850,
      evacuated: 850,
      sheltered: 400,
      status: 'critical',
      lastUpdated: '30 minutes ago'
    }
  ])

  const [newDistrict, setNewDistrict] = useState({
    name: '',
    population: 0,
    affected: 0,
    evacuated: 0,
    sheltered: 0,
    status: 'safe' as const
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'text-success bg-success/20'
      case 'at-risk':
        return 'text-warning bg-warning/20'
      case 'evacuating':
        return 'text-accent bg-accent/20'
      case 'critical':
        return 'text-error bg-error/20'
      default:
        return 'text-text-secondary bg-surface'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return '✅'
      case 'at-risk':
        return '⚠️'
      case 'evacuating':
        return '🚨'
      case 'critical':
        return '🔴'
      default:
        return '❓'
    }
  }

  const updateDistrict = (id: string, updates: Partial<DistrictData>) => {
    setDistricts(prev => prev.map(district => 
      district.id === id 
        ? { ...district, ...updates, lastUpdated: 'Just now' }
        : district
    ))
    setEditingDistrict(null)
  }

  const addDistrict = () => {
    if (newDistrict.name.trim()) {
      const district: DistrictData = {
        id: Date.now().toString(),
        ...newDistrict,
        lastUpdated: 'Just now'
      }
      setDistricts(prev => [...prev, district])
      setNewDistrict({
        name: '',
        population: 0,
        affected: 0,
        evacuated: 0,
        sheltered: 0,
        status: 'safe'
      })
      setShowAddForm(false)
    }
  }

  const totalPopulation = districts.reduce((sum, d) => sum + d.population, 0)
  const totalAffected = districts.reduce((sum, d) => sum + d.affected, 0)
  const totalEvacuated = districts.reduce((sum, d) => sum + d.evacuated, 0)
  const totalSheltered = districts.reduce((sum, d) => sum + d.sheltered, 0)

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-warning/10 to-error/10 border-warning/20">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Affected Population Dashboard
        </h2>
        <p className="text-text-secondary">
          Monitor and manage population impact across all districts
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Total Population</h3>
            <Users className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold text-primary">{totalPopulation.toLocaleString()}</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Affected</h3>
            <AlertTriangle className="text-warning" size={20} />
          </div>
          <div className="text-2xl font-bold text-warning">{totalAffected.toLocaleString()}</div>
          <div className="text-sm text-text-secondary">
            {((totalAffected / totalPopulation) * 100).toFixed(1)}% of total
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Evacuated</h3>
            <TrendingUp className="text-accent" size={20} />
          </div>
          <div className="text-2xl font-bold text-accent">{totalEvacuated.toLocaleString()}</div>
          <div className="text-sm text-text-secondary">
            {totalAffected > 0 ? ((totalEvacuated / totalAffected) * 100).toFixed(1) : 0}% of affected
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Sheltered</h3>
            <MapPin className="text-success" size={20} />
          </div>
          <div className="text-2xl font-bold text-success">{totalSheltered.toLocaleString()}</div>
          <div className="text-sm text-text-secondary">
            {totalEvacuated > 0 ? ((totalSheltered / totalEvacuated) * 100).toFixed(1) : 0}% of evacuated
          </div>
        </div>
      </div>

      {/* Add New District Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          <Plus size={16} className="mr-2" />
          Add District
        </button>
      </div>

      {/* Add District Form */}
      {showAddForm && (
        <div className="card p-4">
          <h3 className="font-bold text-text-primary mb-4">Add New District</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="District Name"
              value={newDistrict.name}
              onChange={(e) => setNewDistrict({...newDistrict, name: e.target.value})}
              className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
            />
            <input
              type="number"
              placeholder="Total Population"
              value={newDistrict.population || ''}
              onChange={(e) => setNewDistrict({...newDistrict, population: parseInt(e.target.value) || 0})}
              className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
            />
            <select
              value={newDistrict.status}
              onChange={(e) => setNewDistrict({...newDistrict, status: e.target.value as any})}
              className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
            >
              <option value="safe">Safe</option>
              <option value="at-risk">At Risk</option>
              <option value="evacuating">Evacuating</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={addDistrict}
              className="btn-primary"
            >
              Add District
            </button>
          </div>
        </div>
      )}

      {/* Districts Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="text-left p-4 font-medium text-text-secondary">District</th>
                <th className="text-left p-4 font-medium text-text-secondary">Population</th>
                <th className="text-left p-4 font-medium text-text-secondary">Affected</th>
                <th className="text-left p-4 font-medium text-text-secondary">Evacuated</th>
                <th className="text-left p-4 font-medium text-text-secondary">Sheltered</th>
                <th className="text-left p-4 font-medium text-text-secondary">Status</th>
                <th className="text-left p-4 font-medium text-text-secondary">Last Updated</th>
                <th className="text-left p-4 font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {districts.map((district) => (
                <tr key={district.id} className="border-t border-border">
                  <td className="p-4">
                    <div className="flex items-center">
                      <MapPin size={16} className="text-text-tertiary mr-2" />
                      <span className="font-medium text-text-primary">{district.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-primary">{district.population.toLocaleString()}</td>
                  <td className="p-4">
                    {editingDistrict === district.id ? (
                      <input
                        type="number"
                        defaultValue={district.affected}
                        className="w-20 bg-surface rounded px-2 py-1 text-sm border border-border"
                        onBlur={(e) => updateDistrict(district.id, { affected: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      <span className="text-warning font-medium">{district.affected.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingDistrict === district.id ? (
                      <input
                        type="number"
                        defaultValue={district.evacuated}
                        className="w-20 bg-surface rounded px-2 py-1 text-sm border border-border"
                        onBlur={(e) => updateDistrict(district.id, { evacuated: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      <span className="text-accent font-medium">{district.evacuated.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingDistrict === district.id ? (
                      <input
                        type="number"
                        defaultValue={district.sheltered}
                        className="w-20 bg-surface rounded px-2 py-1 text-sm border border-border"
                        onBlur={(e) => updateDistrict(district.id, { sheltered: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      <span className="text-success font-medium">{district.sheltered.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className="mr-2">{getStatusIcon(district.status)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(district.status)}`}>
                        {district.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-text-tertiary text-sm">{district.lastUpdated}</td>
                  <td className="p-4">
                    <button
                      onClick={() => setEditingDistrict(editingDistrict === district.id ? null : district.id)}
                      className="text-primary hover:underline text-sm"
                    >
                      {editingDistrict === district.id ? 'Done' : 'Edit'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AffectedPopulation
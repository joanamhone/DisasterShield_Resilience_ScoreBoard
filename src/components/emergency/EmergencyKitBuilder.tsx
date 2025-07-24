import React, { useState } from 'react'
import { Plus, Minus, Check, Package, Droplets, Zap, Heart, Shield } from 'lucide-react'

interface KitItem {
  id: string
  name: string
  category: string
  recommended: number
  current: number
  unit: string
  essential: boolean
  description: string
}

const EmergencyKitBuilder: React.FC = () => {
  const [kitItems, setKitItems] = useState<KitItem[]>([
    // Water & Food
    {
      id: '1',
      name: 'Water',
      category: 'Water & Food',
      recommended: 14,
      current: 8,
      unit: 'liters',
      essential: true,
      description: '1 gallon per person per day for 2 weeks'
    },
    {
      id: '2',
      name: 'Non-perishable Food',
      category: 'Water & Food',
      recommended: 14,
      current: 10,
      unit: 'days supply',
      essential: true,
      description: 'Canned goods, dried fruits, nuts, energy bars'
    },
    {
      id: '3',
      name: 'Manual Can Opener',
      category: 'Water & Food',
      recommended: 1,
      current: 1,
      unit: 'piece',
      essential: true,
      description: 'Essential for accessing canned food'
    },
    
    // First Aid & Medical
    {
      id: '4',
      name: 'First Aid Kit',
      category: 'First Aid & Medical',
      recommended: 1,
      current: 1,
      unit: 'kit',
      essential: true,
      description: 'Bandages, antiseptic, pain relievers, medications'
    },
    {
      id: '5',
      name: 'Prescription Medications',
      category: 'First Aid & Medical',
      recommended: 30,
      current: 7,
      unit: 'days supply',
      essential: true,
      description: 'All essential medications for family members'
    },
    {
      id: '6',
      name: 'Thermometer',
      category: 'First Aid & Medical',
      recommended: 1,
      current: 0,
      unit: 'piece',
      essential: false,
      description: 'Digital thermometer for health monitoring'
    },
    
    // Power & Communication
    {
      id: '7',
      name: 'Flashlights',
      category: 'Power & Communication',
      recommended: 3,
      current: 2,
      unit: 'pieces',
      essential: true,
      description: 'LED flashlights with extra batteries'
    },
    {
      id: '8',
      name: 'Battery-powered Radio',
      category: 'Power & Communication',
      recommended: 1,
      current: 1,
      unit: 'piece',
      essential: true,
      description: 'Weather radio with NOAA alerts'
    },
    {
      id: '9',
      name: 'Power Bank',
      category: 'Power & Communication',
      recommended: 2,
      current: 1,
      unit: 'pieces',
      essential: true,
      description: 'Portable chargers for mobile devices'
    },
    {
      id: '10',
      name: 'Solar Charger',
      category: 'Power & Communication',
      recommended: 1,
      current: 0,
      unit: 'piece',
      essential: false,
      description: 'Renewable power source for devices'
    },
    
    // Tools & Supplies
    {
      id: '11',
      name: 'Multi-tool',
      category: 'Tools & Supplies',
      recommended: 1,
      current: 1,
      unit: 'piece',
      essential: true,
      description: 'Swiss army knife or multi-purpose tool'
    },
    {
      id: '12',
      name: 'Duct Tape',
      category: 'Tools & Supplies',
      recommended: 2,
      current: 1,
      unit: 'rolls',
      essential: true,
      description: 'For repairs and securing items'
    },
    {
      id: '13',
      name: 'Plastic Sheeting',
      category: 'Tools & Supplies',
      recommended: 10,
      current: 0,
      unit: 'square meters',
      essential: false,
      description: 'For shelter and waterproofing'
    },
    
    // Personal Items
    {
      id: '14',
      name: 'Cash',
      category: 'Personal Items',
      recommended: 500,
      current: 100,
      unit: 'dollars',
      essential: true,
      description: 'Small bills for emergency purchases'
    },
    {
      id: '15',
      name: 'Important Documents',
      category: 'Personal Items',
      recommended: 1,
      current: 1,
      unit: 'set',
      essential: true,
      description: 'Copies in waterproof container'
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', 'Water & Food', 'First Aid & Medical', 'Power & Communication', 'Tools & Supplies', 'Personal Items']

  const updateItemQuantity = (id: string, change: number) => {
    setKitItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, current: Math.max(0, item.current + change) }
        : item
    ))
  }

  const filteredItems = selectedCategory === 'All' 
    ? kitItems 
    : kitItems.filter(item => item.category === selectedCategory)

  const getCompletionPercentage = (item: KitItem) => {
    return Math.min(100, (item.current / item.recommended) * 100)
  }

  const getOverallCompletion = () => {
    const totalRecommended = kitItems.reduce((sum, item) => sum + item.recommended, 0)
    const totalCurrent = kitItems.reduce((sum, item) => sum + Math.min(item.current, item.recommended), 0)
    return Math.round((totalCurrent / totalRecommended) * 100)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Water & Food':
        return <Droplets className="text-secondary" size={20} />
      case 'First Aid & Medical':
        return <Heart className="text-error" size={20} />
      case 'Power & Communication':
        return <Zap className="text-warning" size={20} />
      case 'Tools & Supplies':
        return <Package className="text-accent" size={20} />
      case 'Personal Items':
        return <Shield className="text-primary" size={20} />
      default:
        return <Package className="text-text-secondary" size={20} />
    }
  }

  const overallCompletion = getOverallCompletion()

  return (
    <div className="space-y-6">
      {/* Header with overall progress */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary">Emergency Kit Builder</h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{overallCompletion}%</div>
            <div className="text-sm text-text-secondary">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-border h-3 rounded-full mb-4">
          <div 
            className="h-3 bg-primary rounded-full transition-all duration-500"
            style={{ width: `${overallCompletion}%` }}
          />
        </div>
        
        <p className="text-text-secondary">
          Build your comprehensive emergency kit by tracking essential supplies. 
          Recommendations are based on family size and disaster preparedness guidelines.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-border'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Kit items */}
      <div className="space-y-4">
        {filteredItems.map(item => {
          const completion = getCompletionPercentage(item)
          const isComplete = item.current >= item.recommended
          
          return (
            <div key={item.id} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  {getCategoryIcon(item.category)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-text-primary">{item.name}</h3>
                      {item.essential && (
                        <span className="bg-error text-white text-xs px-2 py-1 rounded-full">
                          Essential
                        </span>
                      )}
                      {isComplete && (
                        <Check className="text-success" size={16} />
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mb-2">
                      {item.description}
                    </p>
                    <div className="text-sm text-text-tertiary">
                      Category: {item.category}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">
                    {item.current} / {item.recommended} {item.unit}
                  </span>
                  <span className={`font-medium ${isComplete ? 'text-success' : 'text-text-secondary'}`}>
                    {Math.round(completion)}%
                  </span>
                </div>
                <div className="w-full bg-border h-2 rounded-full">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isComplete ? 'bg-success' : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min(completion, 100)}%` }}
                  />
                </div>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateItemQuantity(item.id, -1)}
                    disabled={item.current === 0}
                    className="w-8 h-8 rounded-full bg-surface hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-medium text-text-primary min-w-[3rem] text-center">
                    {item.current}
                  </span>
                  <button
                    onClick={() => updateItemQuantity(item.id, 1)}
                    className="w-8 h-8 rounded-full bg-surface hover:bg-border flex items-center justify-center transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="text-sm text-text-tertiary">
                  Target: {item.recommended} {item.unit}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick actions */}
      <div className="card p-4">
        <h3 className="font-bold text-text-primary mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="btn-primary">
            Export Kit List
          </button>
          <button className="btn-secondary">
            Print Checklist
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmergencyKitBuilder
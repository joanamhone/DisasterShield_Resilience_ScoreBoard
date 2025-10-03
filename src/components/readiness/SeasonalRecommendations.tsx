import React from 'react'
import { AlertCircle, CheckCircle, Clock, Star } from 'lucide-react'

interface SeasonalRecommendationsProps {
  season: string
  location: string
  score: number
}

const SeasonalRecommendations: React.FC<SeasonalRecommendationsProps> = ({ 
  season, 
  location, 
  score 
}) => {
  const getSeasonalRecommendations = () => {
    const recommendations: Record<string, Array<{
      id: number
      title: string
      description: string
      priority: 'high' | 'medium' | 'low'
      category: string
    }>> = {
      summer: [
        {
          id: 1,
          title: 'Install Backup Cooling Systems',
          description: 'Set up battery-powered fans, cooling towels, and identify air-conditioned public spaces.',
          priority: 'high',
          category: 'Heat Protection'
        },
        {
          id: 2,
          title: 'Increase Water Storage',
          description: 'Store at least 1 gallon per person per day for 7+ days. Include electrolyte solutions.',
          priority: 'high',
          category: 'Hydration'
        },
        {
          id: 3,
          title: 'Create Defensible Space',
          description: 'Clear vegetation within 30 feet of structures. Maintain fire-resistant landscaping.',
          priority: 'high',
          category: 'Wildfire Prevention'
        },
        {
          id: 4,
          title: 'Prepare for Power Outages',
          description: 'Install surge protectors and have backup power for essential medical devices.',
          priority: 'medium',
          category: 'Power Backup'
        },
        {
          id: 5,
          title: 'Stock Sun Protection Items',
          description: 'Sunscreen, hats, lightweight long-sleeve clothing, and UV-blocking window film.',
          priority: 'medium',
          category: 'UV Protection'
        }
      ],
      winter: [
        {
          id: 1,
          title: 'Winterize Your Home',
          description: 'Insulate pipes, seal air leaks, and service heating systems before cold weather.',
          priority: 'high',
          category: 'Home Preparation'
        },
        {
          id: 2,
          title: 'Stock Winter Emergency Supplies',
          description: 'Extra blankets, warm clothing, non-perishable food, and alternative heating sources.',
          priority: 'high',
          category: 'Winter Supplies'
        },
        {
          id: 3,
          title: 'Prepare Vehicle for Winter',
          description: 'Winter tires, emergency kit with blankets, shovel, sand/salt, and jumper cables.',
          priority: 'high',
          category: 'Vehicle Safety'
        },
        {
          id: 4,
          title: 'Install Carbon Monoxide Detectors',
          description: 'Essential when using alternative heating sources. Check batteries regularly.',
          priority: 'high',
          category: 'Safety Equipment'
        },
        {
          id: 5,
          title: 'Create Ice Dam Prevention Plan',
          description: 'Clean gutters, improve attic insulation, and know how to safely remove snow.',
          priority: 'medium',
          category: 'Property Protection'
        }
      ],
      rainy: [
        {
          id: 1,
          title: 'Improve Property Drainage',
          description: 'Clean gutters, install French drains, and ensure proper grading around foundation.',
          priority: 'high',
          category: 'Flood Prevention'
        },
        {
          id: 2,
          title: 'Waterproof Important Items',
          description: 'Store documents, electronics, and valuables in waterproof containers.',
          priority: 'high',
          category: 'Water Protection'
        },
        {
          id: 3,
          title: 'Install Sump Pump System',
          description: 'Consider backup sump pump with battery power for basement flood prevention.',
          priority: 'medium',
          category: 'Flood Control'
        },
        {
          id: 4,
          title: 'Prepare Flood Barriers',
          description: 'Sandbags, flood gates, or inflatable barriers for doorways and low areas.',
          priority: 'medium',
          category: 'Flood Defense'
        },
        {
          id: 5,
          title: 'Review Flood Insurance',
          description: 'Ensure adequate coverage and understand policy details before flood season.',
          priority: 'medium',
          category: 'Insurance'
        }
      ],
      spring: [
        {
          id: 1,
          title: 'Identify Safe Rooms',
          description: 'Designate interior rooms on lowest floor for tornado/severe weather protection.',
          priority: 'high',
          category: 'Storm Safety'
        },
        {
          id: 2,
          title: 'Install Weather Alert System',
          description: 'Weather radio with battery backup and smartphone weather apps with alerts.',
          priority: 'high',
          category: 'Early Warning'
        },
        {
          id: 3,
          title: 'Trim Trees and Secure Outdoor Items',
          description: 'Remove dead branches and secure patio furniture, grills, and decorations.',
          priority: 'medium',
          category: 'Property Maintenance'
        },
        {
          id: 4,
          title: 'Protect Against Hail',
          description: 'Covered parking, protective covers for AC units, and impact-resistant roofing.',
          priority: 'medium',
          category: 'Hail Protection'
        },
        {
          id: 5,
          title: 'Review Severe Weather Plan',
          description: 'Practice tornado drills and ensure all family members know safety procedures.',
          priority: 'medium',
          category: 'Emergency Planning'
        }
      ],
      autumn: [
        {
          id: 1,
          title: 'Hurricane/Storm Preparation',
          description: 'Install storm shutters, secure outdoor furniture, and stock emergency supplies.',
          priority: 'high',
          category: 'Storm Preparation'
        },
        {
          id: 2,
          title: 'Generator Safety Setup',
          description: 'Install transfer switch, store fuel safely, and practice proper generator operation.',
          priority: 'high',
          category: 'Power Backup'
        },
        {
          id: 3,
          title: 'Tree and Landscape Maintenance',
          description: 'Prune trees, remove dead branches, and secure loose items before storm season.',
          priority: 'medium',
          category: 'Property Maintenance'
        },
        {
          id: 4,
          title: 'Evacuation Route Planning',
          description: 'Know multiple evacuation routes and have transportation plans for all scenarios.',
          priority: 'medium',
          category: 'Evacuation Planning'
        },
        {
          id: 5,
          title: 'Communication Plan Update',
          description: 'Update emergency contacts and establish out-of-area contact person.',
          priority: 'low',
          category: 'Communication'
        }
      ],
      dry: [
        {
          id: 1,
          title: 'Water Conservation System',
          description: 'Install rainwater collection, greywater systems, and drought-resistant landscaping.',
          priority: 'high',
          category: 'Water Management'
        },
        {
          id: 2,
          title: 'Dust Storm Protection',
          description: 'Seal windows/doors, install air filtration, and create dust-free safe room.',
          priority: 'high',
          category: 'Air Quality'
        },
        {
          id: 3,
          title: 'Fire Prevention Measures',
          description: 'Create defensible space, install sprinkler systems, and maintain fire-resistant vegetation.',
          priority: 'high',
          category: 'Fire Safety'
        },
        {
          id: 4,
          title: 'Heat Management Systems',
          description: 'Improve insulation, install reflective roofing, and create shaded outdoor areas.',
          priority: 'medium',
          category: 'Heat Protection'
        },
        {
          id: 5,
          title: 'Emergency Water Storage',
          description: 'Large-capacity water storage tanks and water purification systems.',
          priority: 'medium',
          category: 'Water Security'
        }
      ]
    }

    return recommendations[season] || []
  }

  const recommendations = getSeasonalRecommendations()
  
  // Filter recommendations based on score
  const priorityRecommendations = recommendations.filter(rec => {
    if (score < 40) return rec.priority === 'high'
    if (score < 70) return rec.priority === 'high' || rec.priority === 'medium'
    return true
  })

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="text-error" size={20} />
      case 'medium':
        return <Clock className="text-warning" size={20} />
      case 'low':
        return <Star className="text-accent" size={20} />
      default:
        return <CheckCircle className="text-success" size={20} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-error bg-error/5'
      case 'medium':
        return 'border-l-warning bg-warning/5'
      case 'low':
        return 'border-l-accent bg-accent/5'
      default:
        return 'border-l-success bg-success/5'
    }
  }

  const getSeasonEmoji = (season: string) => {
    const seasonEmojis: Record<string, string> = {
      spring: '🌸',
      summer: '☀️',
      autumn: '🍂',
      winter: '❄️',
      rainy: '🌧️',
      dry: '🏜️'
    }
    return seasonEmojis[season] || '🌍'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary">
          {getSeasonEmoji(season)} {season.charAt(0).toUpperCase() + season.slice(1)} Season Recommendations
        </h3>
        <span className="text-sm text-text-secondary bg-surface px-3 py-1 rounded-full">
          {location}
        </span>
      </div>

      <p className="text-text-secondary">
        Based on your readiness score of {score}% and current season, here are personalized recommendations:
      </p>

      <div className="space-y-3">
        {priorityRecommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className={`card p-4 border-l-4 ${getPriorityColor(recommendation.priority)}`}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                {getPriorityIcon(recommendation.priority)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-text-primary">
                    {recommendation.title}
                  </h4>
                  <span className="text-xs bg-surface px-2 py-1 rounded-full text-text-secondary">
                    {recommendation.category}
                  </span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {recommendation.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    recommendation.priority === 'high' ? 'bg-error/20 text-error' :
                    recommendation.priority === 'medium' ? 'bg-warning/20 text-warning' :
                    'bg-accent/20 text-accent'
                  }`}>
                    {recommendation.priority.toUpperCase()} PRIORITY
                  </span>
                  <button className="text-primary text-sm font-medium hover:underline">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {priorityRecommendations.length === 0 && (
        <div className="card p-6 text-center">
          <CheckCircle className="text-success mx-auto mb-3" size={48} />
          <h4 className="font-bold text-text-primary mb-2">
            Excellent Seasonal Preparedness!
          </h4>
          <p className="text-text-secondary">
            You're well-prepared for {season} season in {location}. Keep maintaining your readiness level.
          </p>
        </div>
      )}
    </div>
  )
}

export default SeasonalRecommendations
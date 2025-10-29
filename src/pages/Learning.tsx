import React, { useState } from 'react';
import { BookOpen, Award, Clock, Users, Play, CheckCircle, Star } from 'lucide-react'; // Removed unused Download, Calendar

// --- 1. Import your images from the assets folder ---
import emergencyLeadershipImage from '../assets/emergency_leadership.jpg';
import communityAssessmentImage from '../assets/community_assessment.jpg';
import drillPlanningImage from '../assets/drill_planning.png';
import crisisCommunicationImage from '../assets/download.jpg'; 
import communityEngagementImage from '../assets/engagement.jpg';
import firstAidImage from '../assets/images.jpg'; 

const Learning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'certifications' | 'progress'>('courses');
  // Removed unused selectedCourse state for now

  const courses = [
    {
      id: 1,
      title: 'Emergency Response Leadership',
      description: 'Learn how to lead and coordinate emergency response efforts in your community',
      duration: '4 hours',
      modules: 8,
      difficulty: 'Intermediate',
      certification: true,
      enrolled: 156,
      rating: 4.8,
      progress: 0,
      status: 'available',
      instructor: 'Dr. Sarah Johnson',
      topics: ['Crisis Leadership', 'Team Coordination', 'Decision Making', 'Communication'],
      image: emergencyLeadershipImage // <-- Use imported variable
    },
    {
      id: 2,
      title: 'Community Risk Assessment',
      description: 'Master the skills to assess and analyze disaster risks in your community',
      duration: '3 hours',
      modules: 6,
      difficulty: 'Beginner',
      certification: true,
      enrolled: 203,
      rating: 4.9,
      progress: 65,
      status: 'in-progress',
      instructor: 'Prof. Michael Chen',
      topics: ['Risk Identification', 'Vulnerability Analysis', 'Impact Assessment', 'Mitigation Planning'],
      image: communityAssessmentImage // <-- Use imported variable
    },
    {
      id: 3,
      title: 'Drill Planning and Execution',
      description: 'Learn to design, plan, and execute effective emergency drills for your community',
      duration: '5 hours',
      modules: 10,
      difficulty: 'Advanced',
      certification: true,
      enrolled: 89,
      rating: 4.7,
      progress: 100,
      status: 'completed',
      instructor: 'Captain Lisa Rodriguez',
      topics: ['Drill Design', 'Safety Protocols', 'Evaluation Methods', 'Improvement Planning'],
      image: drillPlanningImage // <-- Use imported variable
    },
    {
      id: 4,
      title: 'Crisis Communication',
      description: 'Effective communication strategies during emergencies and crisis situations',
      duration: '2 hours',
      modules: 4,
      difficulty: 'Beginner',
      certification: false,
      enrolled: 312,
      rating: 4.6,
      progress: 0,
      status: 'available',
      instructor: 'Maria Santos',
      topics: ['Message Clarity', 'Multi-channel Communication', 'Public Speaking', 'Media Relations'],
      image: crisisCommunicationImage // <-- Use imported variable
    },
    {
      id: 5,
      title: 'Community Engagement and Mobilization',
      description: 'Build strong community networks and engage residents in preparedness activities',
      duration: '3.5 hours',
      modules: 7,
      difficulty: 'Intermediate',
      certification: true,
      enrolled: 145,
      rating: 4.8,
      progress: 0,
      status: 'available',
      instructor: 'Dr. James Park',
      topics: ['Community Outreach', 'Volunteer Management', 'Cultural Sensitivity', 'Stakeholder Engagement'],
      image: communityEngagementImage // <-- Use imported variable
    },
    {
      id: 6,
      title: 'First Aid and Medical Response',
      description: 'Essential first aid skills and medical response coordination for community leaders',
      duration: '6 hours',
      modules: 12,
      difficulty: 'Intermediate',
      certification: true,
      enrolled: 278,
      rating: 4.9,
      progress: 30,
      status: 'in-progress',
      instructor: 'Dr. Emily Watson',
      topics: ['Basic First Aid', 'CPR', 'Medical Triage', 'Emergency Medical Coordination'],
      image: firstAidImage // <-- Use imported variable
    }
  ];

  // Certifications data remains the same
   const certifications = [
    {
      id: 1,
      name: 'Certified Community Emergency Leader',
      description: 'Complete certification for community emergency leadership',
      requirements: ['Emergency Response Leadership', 'Community Risk Assessment', 'Drill Planning and Execution'],
      earned: true,
      earnedDate: '2024-01-15',
      validUntil: '2026-01-15'
    },
    {
      id: 2,
      name: 'Community Preparedness Specialist',
      description: 'Specialized certification in community preparedness planning',
      requirements: ['Community Risk Assessment', 'Community Engagement and Mobilization'],
      earned: false,
      progress: 50
    },
    {
      id: 3,
      name: 'Emergency Medical Response Coordinator',
      description: 'Certification for coordinating medical response in emergencies',
      requirements: ['First Aid and Medical Response', 'Crisis Communication'],
      earned: false,
      progress: 15
    }
  ];

  // Helper functions remain the same
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-success bg-success/20'
      case 'Intermediate':
        return 'text-warning bg-warning/20'
      case 'Advanced':
        return 'text-error bg-error/20'
      default:
        return 'text-text-secondary bg-surface'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/20'
      case 'in-progress':
        return 'text-warning bg-warning/20'
      case 'available':
        return 'text-primary bg-primary/20'
      default:
        return 'text-text-secondary bg-surface'
    }
  }

  const startCourse = (course: any) => {
    console.log('Starting course:', course.title)
    // Implementation for starting a course
  }

  const continueCourse = (course: any) => {
    console.log('Continuing course:', course.title)
    // Implementation for continuing a course
  }

  // JSX structure remains the same
  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Learning Center
        </h2>
        <p className="text-text-secondary">
          Enhance your community leadership skills with our comprehensive training programs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ... Stat Cards remain the same ... */}
         <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Courses Available</h3>
            <BookOpen className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold text-primary">{courses.length}</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">In Progress</h3>
            <Clock className="text-warning" size={20} />
          </div>
          <div className="text-2xl font-bold text-warning">
            {courses.filter(c => c.status === 'in-progress').length}
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Completed</h3>
            <CheckCircle className="text-success" size={20} />
          </div>
          <div className="text-2xl font-bold text-success">
            {courses.filter(c => c.status === 'completed').length}
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Certifications</h3>
            <Award className="text-accent" size={20} />
          </div>
          <div className="text-2xl font-bold text-accent">
            {certifications.filter(c => c.earned).length}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'courses', label: 'Courses' },
              { id: 'certifications', label: 'Certifications' },
              { id: 'progress', label: 'My Progress' }
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
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="card p-4 hover:shadow-lg transition-shadow flex flex-col"> {/* Added flex flex-col */}
                    <div className="aspect-video mb-4 rounded-lg overflow-hidden flex-shrink-0"> {/* Added flex-shrink-0 */}
                      <img
                        src={course.image} // Now uses the imported variable
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="space-y-3 flex flex-col flex-grow"> {/* Added flex flex-col flex-grow */}
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-text-primary text-lg leading-tight">
                          {course.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(course.status)}`}> {/* Added flex-shrink-0 */}
                          {course.status.replace('-', ' ')}
                        </span>
                      </div>

                      <p className="text-text-secondary text-sm leading-relaxed flex-grow"> {/* Added flex-grow */}
                        {course.description}
                      </p>

                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-text-tertiary"> {/* Added flex-wrap gap */}
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {course.duration}
                        </span>
                        <span className="flex items-center">
                          <BookOpen size={14} className="mr-1" />
                          {course.modules} modules
                        </span>
                        <span className="flex items-center">
                          <Users size={14} className="mr-1" />
                          {course.enrolled}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2"> {/* Added pt-2 */}
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                            {course.difficulty}
                          </span>
                          {course.certification && (
                            <Award className="text-accent" size={16} />
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="text-warning fill-current" size={14} />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                      </div>

                      {course.progress > 0 && (
                        <div className="space-y-1 pt-2"> {/* Added pt-2 */}
                          <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Progress</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-border h-2 rounded-full">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="pt-2 mt-auto"> {/* Added mt-auto to push button down */}
                        {course.status === 'available' ? (
                          <button
                            onClick={() => startCourse(course)}
                            className="w-full btn-primary" // Use your button classes
                          >
                            <Play size={16} className="mr-2" />
                            Start Course
                          </button>
                        ) : course.status === 'in-progress' ? (
                          <button
                            onClick={() => continueCourse(course)}
                            className="w-full btn-secondary" // Use your button classes
                          >
                            Continue Course
                          </button>
                        ) : (
                          <button className="w-full btn-secondary" disabled> {/* Use your button classes */}
                            <CheckCircle size={16} className="mr-2" />
                            Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="space-y-4">
              {/* ... Certifications JSX remains the same ... */}
              {certifications.map((cert) => (
                <div key={cert.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        cert.earned ? 'bg-success/20' : 'bg-surface'
                      }`}>
                        <Award className={cert.earned ? 'text-success' : 'text-text-tertiary'} size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary mb-2">{cert.name}</h3>
                        <p className="text-text-secondary mb-3">{cert.description}</p>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-text-secondary">Required Courses:</p>
                          <div className="flex flex-wrap gap-2">
                            {cert.requirements.map((req, index) => (
                              <span key={index} className="px-2 py-1 bg-surface rounded-full text-xs">
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {cert.earned ? (
                      <div className="text-right">
                        <span className="px-3 py-1 bg-success/20 text-success rounded-full text-sm font-medium">
                          Earned
                        </span>
                        <p className="text-xs text-text-tertiary mt-2">
                          {cert.earnedDate && `Earned: ${cert.earnedDate}`}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {cert.validUntil && `Valid until: ${cert.validUntil}`}
                        </p>
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="px-3 py-1 bg-warning/20 text-warning rounded-full text-sm font-medium">
                          In Progress
                        </span>
                        <p className="text-xs text-text-tertiary mt-2">
                          {cert.progress}% Complete
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {!cert.earned && cert.progress != null && ( // Added null check for progress
                    <div className="space-y-1">
                      <div className="w-full bg-border h-2 rounded-full">
                        <div 
                          className="bg-warning h-2 rounded-full transition-all duration-300"
                          style={{ width: `${cert.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'progress' && (
             <div className="space-y-6">
              {/* ... My Progress JSX remains the same ... */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-4">
                  <h3 className="font-bold text-text-primary mb-4">Learning Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Total Learning Hours</span>
                      {/* TODO: Calculate this dynamically */}
                      <span className="font-medium">23.5 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Courses Completed</span>
                      <span className="font-medium">{courses.filter(c => c.status === 'completed').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Certifications Earned</span>
                      <span className="font-medium">{certifications.filter(c => c.earned).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Average Rating</span>
                      {/* TODO: Calculate this dynamically */}
                      <span className="font-medium">4.8/5.0</span>
                    </div>
                  </div>
                </div>

                <div className="card p-4">
                  <h3 className="font-bold text-text-primary mb-4">Recent Activity</h3>
                  {/* TODO: Fetch recent activity dynamically */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="text-success" size={16} />
                      <div>
                        <p className="text-sm font-medium">Completed "Drill Planning and Execution"</p>
                        <p className="text-xs text-text-tertiary">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="text-accent" size={16} />
                      <div>
                        <p className="text-sm font-medium">Earned "Community Emergency Leader" certification</p>
                        <p className="text-xs text-text-tertiary">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Play className="text-primary" size={16} />
                      <div>
                        <p className="text-sm font-medium">Started "First Aid and Medical Response"</p>
                        <p className="text-xs text-text-tertiary">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <h3 className="font-bold text-text-primary mb-4">Course Progress</h3>
                <div className="space-y-4">
                  {courses.filter(c => c.progress > 0).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                      <div>
                        <h4 className="font-medium text-text-primary">{course.title}</h4>
                        <p className="text-sm text-text-secondary">{course.progress}% complete</p>
                      </div>
                      <div className="w-32">
                        <div className="w-full bg-border h-2 rounded-full">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Learning;
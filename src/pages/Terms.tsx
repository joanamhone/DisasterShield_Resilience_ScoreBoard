import React from 'react'
import { Shield, FileText, Calendar } from 'lucide-react'

const Terms: React.FC = () => {
  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <div className="flex items-center mb-4">
          <FileText className="text-primary mr-3" size={32} />
          <h1 className="text-2xl font-bold text-text-primary">Terms of Service</h1>
        </div>
        <p className="text-text-secondary">
          Last updated: January 15, 2024
        </p>
      </div>

      {/* Terms Content */}
      <div className="card p-6 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">1. Acceptance of Terms</h2>
          <p className="text-text-secondary leading-relaxed">
            By accessing and using Disaster Shield, you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">2. Service Description</h2>
          <p className="text-text-secondary leading-relaxed">
            Disaster Shield is a climate disaster preparedness platform that provides risk assessments, emergency planning tools, 
            and community coordination features. Our service is designed to help individuals, communities, schools, and disaster 
            coordinators prepare for and respond to climate-related emergencies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">3. User Responsibilities</h2>
          <div className="space-y-3">
            <p className="text-text-secondary leading-relaxed">Users agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
              <li>Provide accurate and current information during registration</li>
              <li>Maintain the security of their account credentials</li>
              <li>Use the service in compliance with all applicable laws and regulations</li>
              <li>Not misuse or attempt to gain unauthorized access to the service</li>
              <li>Respect the privacy and rights of other users</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">4. Data and Privacy</h2>
          <p className="text-text-secondary leading-relaxed">
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
            to understand our practices regarding the collection, use, and disclosure of your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">5. Emergency Information Disclaimer</h2>
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start">
              <Shield className="text-warning mr-3 mt-1" size={20} />
              <div>
                <h3 className="font-bold text-warning mb-2">Important Notice</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Disaster Shield provides preparedness information and tools for educational purposes. In case of actual 
                  emergencies, always follow official emergency services guidance and local authorities' instructions. 
                  Our service should not be used as the sole source of emergency information.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">6. Limitation of Liability</h2>
          <p className="text-text-secondary leading-relaxed">
            Disaster Shield and its affiliates shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
            resulting from your use of the service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">7. Changes to Terms</h2>
          <p className="text-text-secondary leading-relaxed">
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to 
            provide at least 30 days notice prior to any new terms taking effect.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">8. Contact Information</h2>
          <p className="text-text-secondary leading-relaxed">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <div className="mt-3 p-4 bg-surface rounded-lg">
            <p className="text-text-primary font-medium">Disaster Shield Support</p>
            <p className="text-text-secondary">Email: support@disastershield.com</p>
            <p className="text-text-secondary">Phone: 1-800-PREPARE</p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="card p-4 text-center">
        <div className="flex items-center justify-center text-text-tertiary">
          <Calendar size={16} className="mr-2" />
          <span className="text-sm">Effective Date: January 15, 2024</span>
        </div>
      </div>
    </div>
  )
}

export default Terms
import React from 'react'
import { Shield, Lock, Eye, Database } from 'lucide-react'

const Privacy: React.FC = () => {
  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-secondary/10 to-accent/10 border-secondary/20">
        <div className="flex items-center mb-4">
          <Shield className="text-secondary mr-3" size={32} />
          <h1 className="text-2xl font-bold text-text-primary">Privacy Policy</h1>
        </div>
        <p className="text-text-secondary">
          Last updated: July 1, 2025
        </p>
      </div>

      {/* Privacy Content */}
      <div className="card p-6 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">Information We Collect</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <Database className="text-primary mr-3 mt-1" size={20} />
              <div>
                <h3 className="font-medium text-text-primary mb-2">Personal Information</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  We collect information you provide directly, such as your name, email address, location, 
                  emergency contacts, and preparedness assessment responses.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Eye className="text-accent mr-3 mt-1" size={20} />
              <div>
                <h3 className="font-medium text-text-primary mb-2">Usage Information</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  We automatically collect information about how you use our service, including your interactions 
                  with features, assessment completion, and dashboard usage patterns.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
            <li>Provide personalized disaster preparedness recommendations</li>
            <li>Send relevant weather and emergency alerts based on your location</li>
            <li>Track your preparedness progress and improvement over time</li>
            <li>Enable community and organizational coordination features</li>
            <li>Improve our service through anonymized usage analytics</li>
            <li>Communicate important service updates and safety information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">Information Sharing</h2>
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-start">
              <Lock className="text-success mr-3 mt-1" size={20} />
              <div>
                <h3 className="font-bold text-success mb-2">Your Privacy is Protected</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                  except as described in this policy or as required by law.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <p className="text-text-secondary leading-relaxed">We may share information in these limited circumstances:</p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
              <li>With emergency services during actual emergencies (with your consent when possible)</li>
              <li>Anonymized, aggregated data for research and public safety planning</li>
              <li>With service providers who assist in operating our platform (under strict confidentiality agreements)</li>
              <li>When required by law or to protect the safety of our users</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">Data Security</h2>
          <p className="text-text-secondary leading-relaxed">
            We implement appropriate technical and organizational security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, 
            secure data transmission, and regular security assessments.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">Your Rights and Choices</h2>
          <div className="space-y-3">
            <p className="text-text-secondary leading-relaxed">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
              <li>Access and review your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of non-essential communications</li>
              <li>Export your data in a portable format</li>
              <li>Restrict certain uses of your information</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">Role-Specific Privacy Considerations</h2>
          <div className="space-y-4">
            <div className="p-4 bg-surface rounded-lg">
              <h3 className="font-medium text-text-primary mb-2">Community Leaders & School Administrators</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                When using community or school management features, you may have access to aggregated, anonymized data 
                about group preparedness levels. Individual user data remains private and is never shared without explicit consent.
              </p>
            </div>
            
            <div className="p-4 bg-surface rounded-lg">
              <h3 className="font-medium text-text-primary mb-2">Disaster Coordinators</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Regional analytics and reporting features use only anonymized, aggregated data. No individual personal 
                information is accessible through coordinator dashboards without proper authorization and consent.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">Contact Us</h2>
          <p className="text-text-secondary leading-relaxed">
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="mt-3 p-4 bg-surface rounded-lg">
            <p className="text-text-primary font-medium">Privacy Officer</p>
            <p className="text-text-secondary">Email: privacy@disastershield.com</p>
            <p className="text-text-secondary">Phone: +265 (555) 123-4567</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Privacy
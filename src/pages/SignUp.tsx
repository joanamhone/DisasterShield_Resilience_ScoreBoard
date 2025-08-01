import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, MapPin } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const SignUp: React.FC = () => {
  const navigate = useNavigate()
  // 1. Remove 'loading' from useAuth, it's no longer needed here
  const { signUp, signInWithGoogle } = useAuth()
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    agreeToTerms: false
  })
  const [userType, setUserType] = useState('')
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // 2. Add a local state to manage the form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string, userType: string) => {
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email'
    }
    
    if (userType === 'school_admin' || userType === 'disaster_coordinator') {
      const officialDomains = ['.edu', '.gov', '.org', '.ac', 'school', 'district', 'emergency', 'disaster']
      const hasOfficialDomain = officialDomains.some(domain => email.toLowerCase().includes(domain))
      if (!hasOfficialDomain) {
        const roleLabel = userType === 'school_admin' ? 'School Administrators' : 'Disaster Coordinators'
        return `${roleLabel} must register with official institutional email addresses`
      }
    }
    
    return null
  }

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters'
    }
    
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    if (!hasLetter || !hasNumber || !hasSpecial) {
      return 'Password must contain letters, numbers, and at least one special character'
    }
    
    return null
  }
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else {
      const emailError = validateEmail(formData.email, userType)
      if (emailError) {
        newErrors.email = emailError
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const passwordError = validatePassword(formData.password)
      if (passwordError) {
        newErrors.password = passwordError
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!userType) {
      newErrors.userType = 'Please select a user type'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 3. Update handleSubmit to use the local state
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true);
    try {
      await signUp(formData.email, formData.password, formData.fullName, formData.location, userType as any)
      navigate('/profile-setup')
    } catch (error) {
      setErrors({ submit: (error as Error).message })
    } finally {
      setIsSubmitting(false); // This guarantees the loading state will stop
    }
  }

  const handleGoogleSignUp = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle()
      // The onAuthStateChange listener in AuthContext will handle navigation
      // or you can navigate here if a profile setup step is always required.
      navigate('/profile-setup')
    } catch (error) {
      setErrors({ submit: (error as Error).message })
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Disaster Shield</h1>
          <h2 className="text-xl font-bold text-text-primary mb-2">Create Account</h2>
          <p className="text-text-secondary">Join Disaster Shield to stay prepared for climate disasters</p>
        </div>

        {/* Social Sign Up */}
        <div className="mb-6">
          <button
            onClick={handleGoogleSignUp}
            disabled={isSubmitting} // 4. Update the buttons to use the local state
            className="w-full flex items-center justify-center px-4 py-3 border border-border rounded-lg hover:bg-surface transition-colors duration-200 disabled:opacity-50"
          >
            <svg className="mr-3" width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium text-text-primary">Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-text-secondary">Or continue with email</span>
          </div>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields remain the same */}
          {/* ... */}
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              User Type <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { value: 'individual', label: 'Individual', description: 'Personal disaster preparedness' },
                { value: 'community_leader', label: 'Community Leader', description: 'Lead community preparedness efforts' },
                // { value: 'school_admin', label: 'School Administrator', description: 'Manage school emergency plans' },
                { value: 'disaster_coordinator', label: 'Disaster Coordinator', description: 'Regional emergency management' }
              ].map((type) => (
                <label key={type.value} className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-surface cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    value={type.value}
                    checked={userType === type.value}
                    onChange={(e) => setUserType(e.target.value)}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">{type.label}</div>
                    <div className="text-sm text-text-secondary">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.userType && <p className="text-error text-sm mt-1">{errors.userType}</p>}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={20} />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.fullName ? 'border-error' : 'border-border'
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.fullName && <p className="text-error text-sm mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={20} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email ? 'border-error' : 'border-border'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.password ? 'border-error' : 'border-border'
                }`}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.confirmPassword ? 'border-error' : 'border-border'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={20} />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.location ? 'border-error' : 'border-border'
                }`}
                placeholder="Enter your city, state, country"
              />
            </div>
            {errors.location && <p className="text-error text-sm mt-1">{errors.location}</p>}
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
              className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-text-secondary">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && <p className="text-error text-sm mt-1">{errors.agreeToTerms}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>

          {errors.submit && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3">
              <p className="text-error text-sm">{errors.submit}</p>
            </div>
          )}
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-text-secondary">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
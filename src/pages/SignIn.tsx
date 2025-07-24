import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const SignIn: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signInWithGoogle, loading } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previousUser, setPreviousUser] = useState<any>(null)

  // Load previous user info on component mount
  React.useEffect(() => {
    const savedPreviousUser = sessionStorage.getItem('previous_user')
    if (savedPreviousUser) {
      try {
        const userData = JSON.parse(savedPreviousUser)
        setPreviousUser(userData)
        setFormData(prev => ({ ...prev, email: userData.email }))
        // Don't clear immediately - let user see the info
      } catch (error) {
        console.error('Error loading previous user:', error)
      }
    }
  }, [])

  // Clear previous user data when form is submitted or component unmounts
  React.useEffect(() => {
    return () => {
      sessionStorage.removeItem('previous_user')
    }
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Clear previous user data when signing in
    sessionStorage.removeItem('previous_user')

    try {
      await signIn(formData.email, formData.password)
      navigate('/')
    } catch (error) {
      setErrors({ submit: (error as Error).message })
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      // Clear previous user data when signing in
      sessionStorage.removeItem('previous_user')
      await signInWithGoogle()
      navigate('/')
    } catch (error) {
      setErrors({ submit: (error as Error).message })
    }
  }

  const handleInputChange = (field: string, value: string) => {
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
          <h2 className="text-xl font-bold text-text-primary mb-2">
            {previousUser ? `Welcome Back, ${previousUser.fullName}` : 'Welcome Back'}
          </h2>
          <p className="text-text-secondary">
            {previousUser ? `Sign in to your account (${previousUser.email})` : 'Sign in to your account to continue'}
          </p>
          {previousUser && (
            <div className="mt-3 p-3 bg-surface rounded-lg">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                  {previousUser.profilePhoto ? (
                    <img
                      src={previousUser.profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-primary text-sm font-medium">
                      {previousUser.fullName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">{previousUser.fullName}</p>
                  <p className="text-xs text-text-secondary">{previousUser.email}</p>
                </div>
              </div>
              <p className="text-xs text-text-tertiary text-center mt-2">
                Not you? <button 
                  onClick={() => {
                    setPreviousUser(null)
                    setFormData({ email: '', password: '' })
                    sessionStorage.removeItem('previous_user')
                  }}
                  className="text-primary hover:underline"
                >
                  Sign in with different account
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Social Sign In */}
        <div className="mb-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
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

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your password"
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

          {/* Forgot Password */}
          <div className="text-right">
            <Link to="/forgot-password" className="text-primary text-sm hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {errors.submit && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3">
              <p className="text-error text-sm">{errors.submit}</p>
            </div>
          )}
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
import { useState, useEffect } from 'react'

interface LocationData {
  latitude: number
  longitude: number
  city: string
  country: string
  loading: boolean
  error: string | null
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData>({
    latitude: 0,
    longitude: 0,
    city: '',
    country: '',
    loading: true,
    error: null
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by this browser'
      }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Mock reverse geocoding - in real app, use a service like OpenCage or Google
          const mockCities = [
            { lat: 37.7749, lng: -122.4194, city: 'San Francisco', country: 'USA' },
            { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA' },
            { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', country: 'USA' },
            { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' },
            { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France' }
          ]
          
          // Find closest city (simplified)
          const closest = mockCities.reduce((prev, curr) => {
            const prevDist = Math.abs(prev.lat - latitude) + Math.abs(prev.lng - longitude)
            const currDist = Math.abs(curr.lat - latitude) + Math.abs(curr.lng - longitude)
            return currDist < prevDist ? curr : prev
          })
          
          setLocation({
            latitude,
            longitude,
            city: closest.city,
            country: closest.country,
            loading: false,
            error: null
          })
        } catch (error) {
          setLocation(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to get location details'
          }))
        }
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }, [])

  return location
}
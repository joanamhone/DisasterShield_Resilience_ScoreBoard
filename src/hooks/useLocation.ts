import { useState, useEffect } from 'react'

// The interface defining the shape of our location data
// Make sure this is exported so other files like LocationContext can import it
export interface LocationData {
  latitude: number | null
  longitude: number | null
  city: string
  country: string
  loading: boolean
  error: string | null
}

export const useLocation = (): LocationData => {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    city: '',
    country: '',
    loading: true, // Start in a loading state
    error: null,
  })

  useEffect(() => {
    // This effect runs once when the component using the hook mounts
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by this browser.',
      }))
      return
    }

    // Success callback for when the browser gets the coordinates
    const handleSuccess = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords

      try {
        // --- Real Reverse Geocoding using OpenStreetMap Nominatim API ---
        // This service is free and does not require an API key.
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        )

        if (!response.ok) {
          throw new Error('Reverse geocoding failed.')
        }

        const data = await response.json()

        // Extract city and country from the API response
        const city = data.address.city || data.address.town || data.address.village || 'Unknown City'
        const country = data.address.country || 'Unknown Country'
        
        // Update state with the accurate location information
        setLocation({
          latitude,
          longitude,
          city,
          country,
          loading: false,
          error: null,
        })
      } catch (err) {
        setLocation((prev) => ({
          ...prev,
          latitude, // We still have the coordinates
          longitude,
          city: 'N/A', // But couldn't get the name
          country: 'N/A',
          loading: false,
          error: 'Failed to fetch location name.',
        }))
      }
    }

    // Error callback for when geolocation fails
    const handleError = (error: GeolocationPositionError) => {
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }))
    }

    // Request the user's current position with options for higher accuracy
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true, // Request the most accurate position possible
      timeout: 15000,           // Increase timeout to 15 seconds to allow for GPS lock
      maximumAge: 0             // **Force a fresh location, do not use a cached one**
    })
  }, []) // The empty dependency array ensures this effect runs only once

  return location
}

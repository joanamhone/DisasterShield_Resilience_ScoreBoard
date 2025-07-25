import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWeather, getPredictions, WeatherData, PredictionResult } from '../services/predictionService';

// --- Interfaces ---

interface Location {
  latitude: number;
  longitude: number;
}

interface DisasterPredictionContextType {
  weather: WeatherData | null;
  prediction: PredictionResult | null;
  isLoading: boolean;
  error: string | null; // Changed to a string to hold the error message
  activeLocation: Location | null;
  setCustomLocation: (location: Location) => void;
  clearCustomLocation: () => void;
  retryFetch: () => void; // Function to manually retry the fetch
}

// --- Context Definition ---

const DisasterPredictionContext = createContext<DisasterPredictionContextType | undefined>(undefined);

// --- Provider Component ---

export const DisasterPredictionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State to hold any error message

  const [autoLocation, setAutoLocation] = useState<Location | null>(null);
  const [customLocation, setCustomLocation] = useState<Location | null>(null);
  
  const activeLocation = customLocation || autoLocation;

  // Function to fetch data, now memoized with useCallback
  const fetchPrediction = useCallback(async (location: Location) => {
    setIsLoading(true);
    setError(null); // Clear previous errors before a new fetch

    try {
      const weatherData = await getWeather(location.latitude, location.longitude);
      setWeather(weatherData);

      const predictionResult = await getPredictions(weatherData);
      setPrediction(predictionResult);
    } catch (err: any) {
      console.error("Error in prediction fetch process:", err);
      // Set the error state to stop further automatic retries
      setError(err.message || 'An unknown error occurred during prediction fetch.');
      setWeather(null);
      setPrediction(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Effect to get the user's automatic location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setAutoLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        setError("Could not get your location automatically. Please set it manually.");
        setIsLoading(false);
      }
    );
  }, []);

  // Main effect to fetch predictions when the location changes
  useEffect(() => {
    // Only fetch if we have a location AND there is no existing error.
    if (activeLocation && !error) {
      fetchPrediction(activeLocation);
    }
  }, [activeLocation, error, fetchPrediction]); // Add error to dependency array

  // Function to manually trigger a refetch
  const retryFetch = () => {
    if (activeLocation) {
      // The fetchPrediction function will automatically clear the error state
      fetchPrediction(activeLocation);
    }
  };

  const value = {
    weather,
    prediction,
    isLoading,
    error,
    activeLocation,
    setCustomLocation,
    clearCustomLocation: () => setCustomLocation(null),
    retryFetch,
  };

  return (
    <DisasterPredictionContext.Provider value={value}>
      {children}
    </DisasterPredictionContext.Provider>
  );
};

// Custom hook to easily use the context
export const useDisasterPrediction = () => {
  const context = useContext(DisasterPredictionContext);
  if (context === undefined) {
    throw new Error('useDisasterPrediction must be used within a DisasterPredictionProvider');
  }
  return context;
};

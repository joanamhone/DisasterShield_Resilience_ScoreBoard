import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode, 
  useMemo, 
  useCallback,
  useRef
} from 'react';
import { useLocation } from '../hooks/useLocation';
import { getWeather, getPredictions, WeatherData, PredictionResult } from '../services/predictionService';

// Define a type for location data to be consistent
export interface LocationData {
  latitude: number;
  longitude: number;
}

interface DisasterPredictionContextType {
  weather: WeatherData | null;
  prediction: PredictionResult | null;
  isLoading: boolean;
  error: string | null;
  activeLocation: LocationData | null;
  setCustomLocation: (location: LocationData) => void;
  clearCustomLocation: () => void;
  retryFetch: () => void;
}

const DisasterPredictionContext = createContext<DisasterPredictionContextType | undefined>(undefined);

export const DisasterPredictionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [customLocation, setCustomLocation] = useState<LocationData | null>(null);
  const autoLocation = useLocation();

  const hasFetched = useRef(false);

  const activeLocation = useMemo(() => {
    if (customLocation) {
      return customLocation;
    }
    if (autoLocation.latitude && autoLocation.longitude) {
      return { latitude: autoLocation.latitude, longitude: autoLocation.longitude };
    }
    return null;
  }, [customLocation, autoLocation.latitude, autoLocation.longitude]);

  const fetchPrediction = useCallback(async () => {
    if (!activeLocation) {
      setError("Location not available to fetch weather data.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Re-enable live weather fetching
      const weatherData = await getWeather(activeLocation.latitude, activeLocation.longitude);
      setWeather(weatherData);

      const predictionResult = await getPredictions(weatherData);
      setPrediction(predictionResult);
      
    } catch (err: any) {
      console.error("Error in prediction fetch process:", err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [activeLocation]);

  useEffect(() => {
    if (activeLocation && !hasFetched.current) {
      hasFetched.current = true;
      fetchPrediction();
    } else if (autoLocation.error && !customLocation) {
        setError("Could not automatically detect location. Please set one manually.");
        setIsLoading(false);
    }
  }, [activeLocation, fetchPrediction, autoLocation.error, customLocation]);

  const retryFetch = () => {
    hasFetched.current = false;
    if (activeLocation) {
        fetchPrediction();
    }
  }

  const value = {
    weather,
    prediction,
    isLoading,
    error,
    activeLocation,
    retryFetch,
    setCustomLocation: (location: LocationData) => {
        hasFetched.current = false;
        setCustomLocation(location);
    },
    clearCustomLocation: () => {
        hasFetched.current = false;
        setCustomLocation(null);
    },
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

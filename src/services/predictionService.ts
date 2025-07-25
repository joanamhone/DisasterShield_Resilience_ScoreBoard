// This service handles all API calls to external services like OpenWeather and your Hugging Face model.

// IMPORTANT: Add this to a .env.local file in your project's root folder
// VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// The full URL of your Hugging Face Space API endpoint
const HUGGINGFACE_API_URL = 'https://huggingface.co/spaces/joanamhone/DisasterShield/api/predict/';

// --- Interfaces for the data we expect from the APIs ---

// Defines the structure of the weather data from OpenWeather
export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windGust: number;
  windSpeed: number;
  pressure: number;
}

// Defines the structure of the prediction data from your Hugging Face model
export interface PredictionResult {
  [key: string]: number; // e.g., { "Drought": 0.1, "Floods": 0.8, ... }
}

/**
 * Fetches the current weather data from the OpenWeatherMap API for a given location.
 * @param lat - Latitude of the location.
 * @param lon - Longitude of the location.
 * @returns A promise that resolves to the formatted WeatherData object.
 */
export const getWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  
  console.log("Fetching weather from URL:", url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch weather data from OpenWeather API.');
    }

    const data = await response.json();

    // *** NEW LINE: Log the raw data received from the API ***
    console.log("Raw Weather Data Received:", data);

    // Transform the raw API response into our clean WeatherData format
    const weatherData: WeatherData = {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windGust: data.wind.gust || data.wind.speed, // Use gust if available, otherwise fallback to speed
      precipitation: data.rain ? data.rain['1h'] : 0, // Precipitation in the last hour, default to 0
    };

    return weatherData;
  } catch (error) {
    console.error("OpenWeather API Error:", error);
    throw error;
  }
};

/**
 * Sends weather data to your Hugging Face model to get a disaster prediction.
 * @param weatherData - The weather data object.
 * @returns A promise that resolves to the prediction result from the model.
 */
export const getPredictions = async (weatherData: WeatherData): Promise<PredictionResult> => {
  const inputData = {
    // Ensure these keys match EXACTLY what your Gradio app expects
    "Temperature": weatherData.temperature,
    "Humidity": weatherData.humidity,
    "Precipitation": weatherData.precipitation,
    "Wind Gust": weatherData.windGust,
    "Wind Speed": weatherData.windSpeed,
    "Pressure": weatherData.pressure
  };

  // *** NEW LINE: Log the data being sent to Hugging Face ***
  console.log("Sending to Hugging Face API:", inputData);

  try {
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: Object.values(inputData) }), // Gradio API expects a 'data' array with the input values
    });

    if (!response.ok) {
      throw new Error('Prediction API error from Hugging Face.');
    }

    const result = await response.json();
    
    // *** NEW LINE: Log the raw prediction data received from Hugging Face ***
    console.log("Raw Prediction Received:", result);
    
    // The actual prediction dictionary is in the first element of the 'data' array in the response
    if (result.data && Array.isArray(result.data) && result.data.length > 0) {
      return result.data[0]; 
    } else {
      throw new Error("Invalid response format from prediction API.");
    }

  } catch (error) {
    console.error("Hugging Face API Error:", error);
    throw error;
  }
};

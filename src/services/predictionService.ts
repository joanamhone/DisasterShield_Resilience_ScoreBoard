// --- Interfaces ---

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windGust: number;
  windSpeed: number;
  pressure: number;
}

export interface PredictionResult {
  [key: string]: number;
}

// --- Environment Variables & API URLs ---

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
// The URL for your Flask proxy server (kept for disaster predictions)
const FLASK_PROXY_URL = 'https://disaster-prediction-api-485908055275.us-central1.run.app/predict';
// The URL for your new Google Cloud Function for flood maps
const CLOUD_FUNCTION_URL = "https://us-central1-quick-function-425810-r8.cloudfunctions.net/generate-flood-map";


// --- API Functions ---

/**
 * Fetches the current weather data from the OpenWeather API.
 */
export const getWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  
  console.log("Fetching weather from URL:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenWeather API responded with status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Received weather data:", data);

    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      precipitation: data.rain?.['1h'] || 0,
      windGust: data.wind.gust || data.wind.speed,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
    };
  } catch (error) {
    console.error("OpenWeather API Error:", error);
    throw new Error('Failed to fetch weather data from OpenWeather API.');
  }
};

/**
 * Sends weather data to the Flask proxy to get a disaster prediction.
 */
export const getPredictions = async (weatherData: WeatherData): Promise<PredictionResult> => {
  const inputForFlask = {
    temp: weatherData.temperature,
    humidity: weatherData.humidity,
    precipitation: weatherData.precipitation,
    windgust: weatherData.windGust,
    windspeed: weatherData.windSpeed,
    pressure: weatherData.pressure,
  };

  console.log("Sending to Flask Proxy:", inputForFlask);

  try {
    const response = await fetch(FLASK_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputForFlask),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Flask proxy responded with status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Received prediction from Flask:", result);

    return result.prediction;

  } catch (error) {
    console.error("Flask Proxy API Error:", error);
    throw new Error('Failed to fetch prediction from the Flask proxy server.');
  }
};


/**
 * Calls the Google Cloud Function to generate and retrieve a flood map URL.
 */
export async function getFloodMapUrl(latitude: number, longitude: number): Promise<string> {
  console.log("Requesting flood map from Google Cloud Function...");

  try {
    const response = await fetch(CLOUD_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Cloud Function responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Received map URL:", data.mapUrl);
    
    if (!data.mapUrl) {
        throw new Error("Cloud Function did not return a map URL.");
    }

    return data.mapUrl;

  } catch(error) {
    console.error("Google Cloud Function Error:", error);
    throw new Error('Failed to generate or retrieve flood map.');
  }
}

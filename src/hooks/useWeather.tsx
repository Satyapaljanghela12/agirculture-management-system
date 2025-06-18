import { useState, useEffect } from 'react';
import { fetchWeatherData, getUserLocation } from '../services/weatherService';

interface WeatherData {
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    visibility: number;
    pressure: number;
    uvIndex: number;
    condition: string;
    description: string;
    icon: string;
    sunrise: number;
    sunset: number;
  };
  forecast: Array<{
    date: string;
    day: string;
    high: number;
    low: number;
    condition: string;
    description: string;
    precipitation: number;
    icon: string;
    humidity: number;
    windSpeed: number;
  }>;
  location: {
    city: string;
    country: string;
    lat: number;
    lon: number;
  };
}

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  refreshWeather: () => void;
  lastUpdated: Date | null;
}

export const useWeather = (): UseWeatherReturn => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get user's location first
      const location = await getUserLocation();
      const data = await fetchWeatherData(location.lat, location.lon);
      
      setWeatherData(data);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      console.error('Weather data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshWeather = () => {
    loadWeatherData();
  };

  useEffect(() => {
    loadWeatherData();

    // Set up auto-refresh every 10 minutes
    const interval = setInterval(() => {
      loadWeatherData();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    weatherData,
    loading,
    error,
    refreshWeather,
    lastUpdated,
  };
};
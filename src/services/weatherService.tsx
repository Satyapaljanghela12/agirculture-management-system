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

interface OpenWeatherCurrentResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
}

interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp_max: number;
      temp_min: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    pop: number;
  }>;
}

interface OpenWeatherUVResponse {
  value: number;
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const DEFAULT_LAT = parseFloat(import.meta.env.VITE_DEFAULT_LAT || '40.7128');
const DEFAULT_LON = parseFloat(import.meta.env.VITE_DEFAULT_LON || '-74.0060');
const DEFAULT_CITY = import.meta.env.VITE_DEFAULT_CITY || 'New York';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const kelvinToCelsius = (kelvin: number): number => {
  return Math.round(kelvin - 273.15);
};

const mpsToKmh = (mps: number): number => {
  return Math.round(mps * 3.6);
};

export const fetchWeatherData = async (lat?: number, lon?: number): Promise<WeatherData> => {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    // Return mock data when API key is not configured
    return getMockWeatherData();
  }

  const latitude = lat || DEFAULT_LAT;
  const longitude = lon || DEFAULT_LON;

  try {
    // Fetch current weather
    const currentResponse = await fetch(
      `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    );
    
    if (!currentResponse.ok) {
      throw new Error(`Weather API error: ${currentResponse.status}`);
    }
    
    const currentData: OpenWeatherCurrentResponse = await currentResponse.json();

    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    );
    
    if (!forecastResponse.ok) {
      throw new Error(`Forecast API error: ${forecastResponse.status}`);
    }
    
    const forecastData: OpenWeatherForecastResponse = await forecastResponse.json();

    // Fetch UV Index
    let uvIndex = 0;
    try {
      const uvResponse = await fetch(
        `${BASE_URL}/uvi?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );
      if (uvResponse.ok) {
        const uvData: OpenWeatherUVResponse = await uvResponse.json();
        uvIndex = Math.round(uvData.value);
      }
    } catch (error) {
      console.warn('UV Index data not available:', error);
    }

    // Process forecast data - get daily forecasts
    const dailyForecasts = processForecastData(forecastData.list);

    const weatherData: WeatherData = {
      current: {
        temperature: kelvinToCelsius(currentData.main.temp),
        feelsLike: kelvinToCelsius(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        windSpeed: mpsToKmh(currentData.wind.speed),
        windDirection: getWindDirection(currentData.wind.deg || 0),
        visibility: Math.round(currentData.visibility / 1000), // Convert to km
        pressure: currentData.main.pressure,
        uvIndex: uvIndex,
        condition: currentData.weather[0].main,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        sunrise: currentData.sys.sunrise,
        sunset: currentData.sys.sunset,
      },
      forecast: dailyForecasts,
      location: {
        city: currentData.name,
        country: currentData.sys.country,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
      },
    };

    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return mock data as fallback
    return getMockWeatherData();
  }
};

const processForecastData = (forecastList: OpenWeatherForecastResponse['list']) => {
  const dailyData: { [key: string]: any } = {};
  
  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = {
        date: dateKey,
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        high: kelvinToCelsius(item.main.temp_max),
        low: kelvinToCelsius(item.main.temp_min),
        condition: item.weather[0].main,
        description: item.weather[0].description,
        precipitation: Math.round(item.pop * 100),
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: mpsToKmh(item.wind.speed),
      };
    } else {
      // Update high/low temperatures
      dailyData[dateKey].high = Math.max(dailyData[dateKey].high, kelvinToCelsius(item.main.temp_max));
      dailyData[dateKey].low = Math.min(dailyData[dateKey].low, kelvinToCelsius(item.main.temp_min));
    }
  });

  return Object.values(dailyData).slice(0, 5);
};

const getMockWeatherData = (): WeatherData => {
  return {
    current: {
      temperature: 24,
      feelsLike: 26,
      humidity: 65,
      windSpeed: 12,
      windDirection: 'NW',
      visibility: 10,
      pressure: 1013,
      uvIndex: 6,
      condition: 'Partly Cloudy',
      description: 'partly cloudy',
      icon: '02d',
      sunrise: Date.now() / 1000 - 3600,
      sunset: Date.now() / 1000 + 3600,
    },
    forecast: [
      {
        date: new Date().toISOString().split('T')[0],
        day: 'Today',
        high: 26,
        low: 18,
        condition: 'Partly Cloudy',
        description: 'partly cloudy',
        precipitation: 10,
        icon: '02d',
        humidity: 65,
        windSpeed: 12,
      },
      {
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        day: 'Tomorrow',
        high: 28,
        low: 20,
        condition: 'Sunny',
        description: 'clear sky',
        precipitation: 0,
        icon: '01d',
        humidity: 55,
        windSpeed: 8,
      },
      {
        date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        day: 'Saturday',
        high: 25,
        low: 19,
        condition: 'Light Rain',
        description: 'light rain',
        precipitation: 80,
        icon: '10d',
        humidity: 85,
        windSpeed: 15,
      },
      {
        date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
        day: 'Sunday',
        high: 23,
        low: 17,
        condition: 'Cloudy',
        description: 'overcast clouds',
        precipitation: 20,
        icon: '04d',
        humidity: 70,
        windSpeed: 10,
      },
      {
        date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
        day: 'Monday',
        high: 27,
        low: 19,
        condition: 'Partly Cloudy',
        description: 'few clouds',
        precipitation: 15,
        icon: '02d',
        humidity: 60,
        windSpeed: 9,
      },
    ],
    location: {
      city: DEFAULT_CITY,
      country: 'US',
      lat: DEFAULT_LAT,
      lon: DEFAULT_LON,
    },
  };
};

export const getUserLocation = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.warn('Geolocation error:', error);
        // Fallback to default location
        resolve({
          lat: DEFAULT_LAT,
          lon: DEFAULT_LON,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};
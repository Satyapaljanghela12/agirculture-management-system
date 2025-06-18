import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    visibility: number;
    uvIndex: number;
    condition: string;
    icon: string;
    lastUpdated: string;
  };
  forecast: {
    date: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
    icon: string;
  }[];
  alerts: {
    id: string;
    type: 'warning' | 'watch' | 'advisory';
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    expires: string;
  }[];
}

const WeatherDashboard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    current: {
      temperature: 24,
      humidity: 68,
      windSpeed: 12,
      windDirection: 'NW',
      pressure: 1013,
      visibility: 10,
      uvIndex: 6,
      condition: 'Partly Cloudy',
      icon: 'partly-cloudy',
      lastUpdated: new Date().toISOString()
    },
    forecast: [
      {
        date: '2024-05-20',
        high: 26,
        low: 18,
        condition: 'Sunny',
        precipitation: 0,
        icon: 'sunny'
      },
      {
        date: '2024-05-21',
        high: 28,
        low: 20,
        condition: 'Partly Cloudy',
        precipitation: 10,
        icon: 'partly-cloudy'
      },
      {
        date: '2024-05-22',
        high: 22,
        low: 16,
        condition: 'Rainy',
        precipitation: 85,
        icon: 'rainy'
      },
      {
        date: '2024-05-23',
        high: 25,
        low: 17,
        condition: 'Cloudy',
        precipitation: 30,
        icon: 'cloudy'
      },
      {
        date: '2024-05-24',
        high: 27,
        low: 19,
        condition: 'Sunny',
        precipitation: 5,
        icon: 'sunny'
      }
    ],
    alerts: [
      {
        id: '1',
        type: 'warning',
        title: 'Heavy Rain Warning',
        description: 'Heavy rainfall expected tomorrow. Consider postponing outdoor activities.',
        severity: 'high',
        expires: '2024-05-22T18:00:00Z'
      },
      {
        id: '2',
        type: 'advisory',
        title: 'Frost Advisory',
        description: 'Temperatures may drop near freezing early morning. Protect sensitive crops.',
        severity: 'medium',
        expires: '2024-05-21T10:00:00Z'
      }
    ]
  });

  const [loading, setLoading] = useState(false);

  // Simulate real-time weather updates
  useEffect(() => {
    const updateWeather = () => {
      setWeatherData(prev => ({
        ...prev,
        current: {
          ...prev.current,
          temperature: Math.round(20 + Math.random() * 10), // 20-30°C
          humidity: Math.round(50 + Math.random() * 30), // 50-80%
          windSpeed: Math.round(5 + Math.random() * 15), // 5-20 km/h
          pressure: Math.round(1000 + Math.random() * 30), // 1000-1030 hPa
          lastUpdated: new Date().toISOString()
        }
      }));
    };

    // Update weather every 30 seconds for demo
    const interval = setInterval(updateWeather, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const refreshWeather = async () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setWeatherData(prev => ({
        ...prev,
        current: {
          ...prev.current,
          temperature: Math.round(20 + Math.random() * 10),
          humidity: Math.round(50 + Math.random() * 30),
          windSpeed: Math.round(5 + Math.random() * 15),
          pressure: Math.round(1000 + Math.random() * 30),
          lastUpdated: new Date().toISOString()
        }
      }));
      setLoading(false);
    }, 1000);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'partly-cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-600" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getAlertColor = (severity: string, type: string) => {
    if (type === 'warning') return 'border-red-200 bg-red-50 text-red-800';
    if (type === 'watch') return 'border-orange-200 bg-orange-50 text-orange-800';
    return 'border-yellow-200 bg-yellow-50 text-yellow-800';
  };

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return 'text-green-600';
    if (uvIndex <= 5) return 'text-yellow-600';
    if (uvIndex <= 7) return 'text-orange-600';
    if (uvIndex <= 10) return 'text-red-600';
    return 'text-purple-600';
  };

  const getUVIndexLabel = (uvIndex: number) => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weather Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time conditions and forecast for your farm</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(weatherData.current.lastUpdated).toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={refreshWeather}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Weather Alerts */}
      {weatherData.alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Weather Alerts</h2>
          {weatherData.alerts.map((alert) => (
            <div key={alert.id} className={`rounded-lg border p-4 ${getAlertColor(alert.severity, alert.type)}`}>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold">{alert.title}</h3>
                  <p className="text-sm mt-1">{alert.description}</p>
                  <p className="text-xs mt-2">Expires: {new Date(alert.expires).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Current Weather */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm text-white p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Current Weather</h2>
            <p className="text-blue-100">Real-time conditions</p>
          </div>
          <div className="flex items-center space-x-2">
            {getWeatherIcon(weatherData.current.icon)}
            {loading && <RefreshCw className="w-6 h-6 animate-spin" />}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Thermometer className="w-6 h-6" />
            </div>
            <p className="text-sm text-blue-100">Temperature</p>
            <p className="text-3xl font-bold">{weatherData.current.temperature}°C</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Droplets className="w-6 h-6" />
            </div>
            <p className="text-sm text-blue-100">Humidity</p>
            <p className="text-3xl font-bold">{weatherData.current.humidity}%</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Wind className="w-6 h-6" />
            </div>
            <p className="text-sm text-blue-100">Wind</p>
            <p className="text-xl font-bold">{weatherData.current.windSpeed} km/h</p>
            <p className="text-sm text-blue-100">{weatherData.current.windDirection}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Eye className="w-6 h-6" />
            </div>
            <p className="text-sm text-blue-100">Visibility</p>
            <p className="text-3xl font-bold">{weatherData.current.visibility}</p>
            <p className="text-sm text-blue-100">km</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-blue-400 grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-blue-100 text-sm">Pressure</p>
            <p className="text-xl font-semibold">{weatherData.current.pressure} hPa</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">UV Index</p>
            <p className={`text-xl font-semibold ${getUVIndexColor(weatherData.current.uvIndex)}`}>
              {weatherData.current.uvIndex} ({getUVIndexLabel(weatherData.current.uvIndex)})
            </p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Condition</p>
            <p className="text-xl font-semibold">{weatherData.current.condition}</p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">5-Day Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="text-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <p className="text-sm font-medium text-gray-600 mb-2">
                {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <div className="flex justify-center mb-3">
                {getWeatherIcon(day.icon)}
              </div>
              <p className="text-xs text-gray-600 mb-2">{day.condition}</p>
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="w-3 h-3 text-red-500" />
                  <span className="text-sm font-semibold text-gray-900">{day.high}°</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <TrendingDown className="w-3 h-3 text-blue-500" />
                  <span className="text-sm text-gray-600">{day.low}°</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-1">
                  <Droplets className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-gray-600">{day.precipitation}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Irrigation Recommendations</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Field A - Tomatoes</p>
                <p className="text-sm text-blue-700">Last watered: 2 days ago</p>
              </div>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Water Now
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">Field B - Corn</p>
                <p className="text-sm text-green-700">Rain expected tomorrow</p>
              </div>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Skip Today
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Field C - Wheat</p>
                <p className="text-sm text-gray-700">Adequate moisture levels</p>
              </div>
              <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Monitor
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Work Recommendations</h3>
          <div className="space-y-4">
            <div className="p-3 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Sun className="w-4 h-4 text-green-600" />
                <p className="font-medium text-green-900">Ideal for Planting</p>
              </div>
              <p className="text-sm text-gray-600">Weather conditions are perfect for planting soybeans in Field D</p>
            </div>
            <div className="p-3 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <p className="font-medium text-yellow-900">Postpone Harvesting</p>
              </div>
              <p className="text-sm text-gray-600">Heavy rain expected. Delay wheat harvest by 2-3 days</p>
            </div>
            <div className="p-3 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Droplets className="w-4 h-4 text-blue-600" />
                <p className="font-medium text-blue-900">Fertilizer Application</p>
              </div>
              <p className="text-sm text-gray-600">Apply fertilizer before rain to maximize absorption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
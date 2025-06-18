import React from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Eye,
  Droplet,
  Thermometer,
  Gauge,
  Calendar,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  MapPin,
  Sunrise,
  Sunset,
  Loader2
} from 'lucide-react';
import { useWeather } from '../hooks/useWeather';

const WeatherDashboard: React.FC = () => {
  const { weatherData, loading, error, refreshWeather, lastUpdated } = useWeather();

  const alerts = [
    {
      id: 1,
      type: 'High Temperature',
      message: 'Expected high temperatures this weekend. Ensure adequate irrigation.',
      severity: 'medium',
      validUntil: '2024-01-27'
    },
    {
      id: 2,
      type: 'Rain Expected',
      message: 'Light rain expected. Good for crops, postpone outdoor maintenance.',
      severity: 'low',
      validUntil: '2024-01-27'
    }
  ];

  const recommendations = [
    {
      id: 1,
      activity: 'Irrigation',
      recommendation: 'Schedule extra watering due to high temperatures',
      priority: 'high'
    },
    {
      id: 2,
      activity: 'Harvesting',
      recommendation: 'Good conditions for harvesting today and tomorrow',
      priority: 'medium'
    },
    {
      id: 3,
      activity: 'Spraying',
      recommendation: 'Avoid spraying during expected rain periods',
      priority: 'high'
    },
    {
      id: 4,
      activity: 'Field Work',
      recommendation: 'Ideal conditions for field work in dry periods',
      priority: 'low'
    }
  ];

  const getWeatherIcon = (iconCode: string, size: string = 'w-8 h-8') => {
    const iconMap: { [key: string]: JSX.Element } = {
      '01d': <Sun className={`${size} text-amber-500`} />,
      '01n': <Sun className={`${size} text-amber-400`} />,
      '02d': <Cloud className={`${size} text-stone-500`} />,
      '02n': <Cloud className={`${size} text-stone-400`} />,
      '03d': <Cloud className={`${size} text-stone-600`} />,
      '03n': <Cloud className={`${size} text-stone-500`} />,
      '04d': <Cloud className={`${size} text-stone-700`} />,
      '04n': <Cloud className={`${size} text-stone-600`} />,
      '09d': <CloudRain className={`${size} text-blue-500`} />,
      '09n': <CloudRain className={`${size} text-blue-400`} />,
      '10d': <CloudRain className={`${size} text-blue-600`} />,
      '10n': <CloudRain className={`${size} text-blue-500`} />,
      '11d': <CloudRain className={`${size} text-purple-600`} />,
      '11n': <CloudRain className={`${size} text-purple-500`} />,
      '13d': <Cloud className={`${size} text-blue-200`} />,
      '13n': <Cloud className={`${size} text-blue-100`} />,
      '50d': <Cloud className={`${size} text-stone-400`} />,
      '50n': <Cloud className={`${size} text-stone-300`} />,
    };

    return iconMap[iconCode] || <Sun className={`${size} text-amber-500`} />;
  };

  const severityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  const priorityColors = {
    high: 'text-red-600',
    medium: 'text-amber-600',
    low: 'text-emerald-600'
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDayName = (dateString: string, index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long' });
  };

  if (loading && !weatherData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Weather Monitoring</h1>
          <p className="text-stone-600">Loading current conditions and forecasts...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="ml-2 text-stone-600">Fetching weather data...</span>
        </div>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Weather Monitoring</h1>
          <p className="text-stone-600">Unable to load weather data</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-red-900">Weather Data Unavailable</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={refreshWeather}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Weather Monitoring</h1>
          <div className="flex items-center space-x-2 text-stone-600">
            <MapPin className="w-4 h-4" />
            <span>{weatherData.location.city}, {weatherData.location.country}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {lastUpdated && (
            <span className="text-sm text-stone-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={refreshWeather}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Current Weather */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Current Weather</h2>
            <p className="text-blue-100 capitalize">{weatherData.current.description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              {getWeatherIcon(weatherData.current.icon, 'w-12 h-12')}
              <div className="text-4xl font-bold ml-3">{weatherData.current.temperature}°C</div>
            </div>
            <p className="text-blue-100">Feels like {weatherData.current.feelsLike}°C</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Droplet className="w-5 h-5 mr-2" />
              <span className="text-sm">Humidity</span>
            </div>
            <div className="text-xl font-semibold">{weatherData.current.humidity}%</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Wind className="w-5 h-5 mr-2" />
              <span className="text-sm">Wind</span>
            </div>
            <div className="text-xl font-semibold">{weatherData.current.windSpeed} km/h</div>
            <div className="text-xs text-blue-100">{weatherData.current.windDirection}</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Eye className="w-5 h-5 mr-2" />
              <span className="text-sm">Visibility</span>
            </div>
            <div className="text-xl font-semibold">{weatherData.current.visibility} km</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Gauge className="w-5 h-5 mr-2" />
              <span className="text-sm">Pressure</span>
            </div>
            <div className="text-xl font-semibold">{weatherData.current.pressure}</div>
            <div className="text-xs text-blue-100">hPa</div>
          </div>
        </div>

        {/* Additional Weather Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Sun className="w-5 h-5 mr-2" />
              <span className="text-sm">UV Index</span>
            </div>
            <div className="text-xl font-semibold">{weatherData.current.uvIndex}</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Sunrise className="w-5 h-5 mr-2" />
              <span className="text-sm">Sunrise</span>
            </div>
            <div className="text-xl font-semibold">{formatTime(weatherData.current.sunrise)}</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Sunset className="w-5 h-5 mr-2" />
              <span className="text-sm">Sunset</span>
            </div>
            <div className="text-xl font-semibold">{formatTime(weatherData.current.sunset)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
            <h3 className="text-lg font-semibold text-stone-900">Weather Alerts</h3>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${severityColors[alert.severity as keyof typeof severityColors]}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{alert.type}</h4>
                  <span className="text-xs opacity-75">
                    Valid until {new Date(alert.validUntil).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Farm Recommendations */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
            <h3 className="text-lg font-semibold text-stone-900">Farm Recommendations</h3>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 bg-stone-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-stone-900">{rec.activity}</h4>
                  <span className={`text-xs font-medium ${priorityColors[rec.priority as keyof typeof priorityColors]}`}>
                    {rec.priority} priority
                  </span>
                </div>
                <p className="text-sm text-stone-600">{rec.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-stone-900">5-Day Forecast</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="text-center p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors duration-200">
              <div className="font-semibold text-stone-900 mb-2">{getDayName(day.date, index)}</div>
              <div className="text-sm text-stone-600 mb-3">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="flex justify-center mb-3">
                {getWeatherIcon(day.icon)}
              </div>
              <div className="text-sm text-stone-600 mb-2 capitalize">{day.description}</div>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="font-semibold text-stone-900">{day.high}°</span>
                <span className="text-stone-500">{day.low}°</span>
              </div>
              <div className="flex items-center justify-center text-xs text-blue-600 mb-1">
                <Droplet className="w-3 h-3 mr-1" />
                {day.precipitation}%
              </div>
              <div className="flex items-center justify-center text-xs text-stone-500">
                <Wind className="w-3 h-3 mr-1" />
                {day.windSpeed} km/h
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
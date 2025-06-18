import React, { useEffect, useState } from "react";

const API_KEY = "32b3b56df7655a06cb6f450a7ac06616"; // Replace with your OpenWeatherMap API key

const WeatherDashboard = () => {
  const [city, setCity] = useState("Seoni ");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.length > 2) {
        fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${API_KEY}`
        )
          .then((res) => res.json())
          .then((data) => setSuggestions(data));
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchWeatherData = async () => {
    try {
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const currentData = await currentRes.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();

      setWeather(currentData);
      setForecast(
        forecastData.list.filter((item) => item.dt_txt.includes("12:00:00")).slice(0, 5)
      );
      setHourly(forecastData.list.slice(0, 5));
    } catch (error) {
      console.error("Weather fetch error:", error);
    }
  };

  useEffect(() => {
    if (city) fetchWeatherData();
  }, [city]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 p-6 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-3xl font-extrabold text-green-800">🌾 Agri Weather Dashboard</div>
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search any city globally..."
              className="p-3 border border-green-300 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border rounded-md mt-1 z-10 w-full max-h-60 overflow-y-auto shadow-lg">
                {suggestions.map((cityData, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => {
                      setCity(`${cityData.name},${cityData.country}`);
                      setSearch(cityData.name);
                      setSuggestions([]);
                    }}
                  >
                    {cityData.name}, {cityData.state ? cityData.state + ", " : ""}{cityData.country}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {weather && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-green-700">{weather.name}</h2>
              <p className="text-6xl font-extrabold text-green-900">{Math.round(weather.main.temp)}°C</p>
              <p className="text-green-600">Feels like: {Math.round(weather.main.feels_like)}°C</p>
              <p className="capitalize text-green-700">{weather.weather[0].description}</p>
              <div className="mt-3 text-sm text-gray-600">
                <p>🌅 Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
                <p>🌇 Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-green-700 mb-2">Weather Details</h3>
              <p>💧 Humidity: {weather.main.humidity}%</p>
              <p>💨 Wind Speed: {weather.wind.speed} m/s</p>
              <p>📊 Pressure: {weather.main.pressure} hPa</p>
              <p>🌞 UV Index: 6 (placeholder)</p>
            </div>

            <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-lg text-center">
              <h3 className="font-semibold text-green-700">Current Time</h3>
              <p className="text-3xl font-bold text-green-800">{time.toLocaleTimeString()}</p>
              <p className="text-green-600">{time.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-green-700 mb-4">🌿 5 Days Forecast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {forecast.map((day, i) => (
                <div key={i} className="text-center text-green-800">
                  <p className="font-semibold">
                    {new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'short' })}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt="icon"
                    className="mx-auto w-12"
                  />
                  <p className="text-sm min-h-[36px]">{day.weather[0].description}</p>
                  <p className="font-bold text-lg">{Math.round(day.main.temp)}°C</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-green-700 mb-4">🌱 Hourly Forecast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {hourly.map((hour, i) => (
                <div key={i} className="text-center text-green-800">
                  <p className="font-semibold text-sm">
                    {new Date(hour.dt_txt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                    alt="icon"
                    className="mx-auto w-10"
                  />
                  <p className="text-sm">{hour.main.temp}°C</p>
                  <p className="text-xs">{hour.wind.speed} km/h</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;

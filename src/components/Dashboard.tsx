import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Droplets, 
  Thermometer,
  DollarSign,
  Sprout,
  MapPin,
  AlertTriangle,
  CheckSquare,
  Package,
  BarChart3,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  location: string;
}

interface DashboardStats {
  totalRevenue: number;
  activeCrops: number;
  totalArea: number;
  pendingTasks: number;
  revenueChange: number;
  cropsChange: number;
}

const Dashboard: React.FC = () => {
  const { token, user } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    activeCrops: 0,
    totalArea: 0,
    pendingTasks: 0,
    revenueChange: 0,
    cropsChange: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchWeatherData();
    
    // Set up real-time weather updates every 5 minutes
    const weatherInterval = setInterval(fetchWeatherData, 300000);
    
    return () => clearInterval(weatherInterval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [cropsRes, fieldsRes, tasksRes, financeRes] = await Promise.all([
        axios.get('/crops', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/fields', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/tasks', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/finance/summary', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const crops = cropsRes.data;
      const fields = fieldsRes.data;
      const tasks = tasksRes.data;
      const finance = financeRes.data;

      setStats({
        totalRevenue: finance.totalIncome || 0,
        activeCrops: crops.length,
        totalArea: fields.reduce((sum: number, field: any) => sum + field.area, 0),
        pendingTasks: tasks.filter((task: any) => task.status === 'pending').length,
        revenueChange: 12, // This would come from historical data comparison
        cropsChange: crops.length > 0 ? 2 : 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async () => {
    try {
      // In a real application, you would use a weather API like OpenWeatherMap
      // For demo purposes, we'll simulate real-time weather data
      const mockWeatherData: WeatherData = {
        temperature: Math.round(20 + Math.random() * 10), // 20-30°C
        humidity: Math.round(50 + Math.random() * 30), // 50-80%
        windSpeed: Math.round(5 + Math.random() * 15), // 5-20 km/h
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        location: user?.farmLocation || 'Farm Location'
      };
      
      setWeather(mockWeatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleQuickAction = async (action: string) => {
    try {
      switch (action) {
        case 'add-crop':
          // This would typically open a modal or navigate to crop management
          window.dispatchEvent(new CustomEvent('openAddCropModal'));
          break;
        case 'schedule-task':
          // Create a quick task
          const newTask = {
            title: 'Quick Task',
            description: 'Task created from dashboard',
            priority: 'medium',
            status: 'pending',
            assignee: user?.firstName + ' ' + user?.lastName,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            category: 'General',
            estimatedHours: 2,
            notes: 'Created from dashboard quick action'
          };
          
          await axios.post('/tasks', newTask, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Refresh dashboard data
          fetchDashboardData();
          alert('Task scheduled successfully!');
          break;
        case 'record-expense':
          // Create a quick expense record
          const newExpense = {
            date: new Date().toISOString(),
            description: 'Quick Expense Entry',
            category: 'General',
            type: 'expense',
            amount: 0,
            notes: 'Created from dashboard quick action',
            paymentMethod: 'cash'
          };
          
          await axios.post('/finance/transactions', newExpense, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          alert('Expense record created! Please update the details in Finance Management.');
          break;
        case 'update-inventory':
          // This would typically open inventory management
          alert('Redirecting to Inventory Management...');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error handling quick action:', error);
      alert('Error performing action. Please try again.');
    }
  };

  const recentActivities = [
    { id: 1, activity: 'Corn Field A - Irrigation completed', time: '2 hours ago', type: 'success' },
    { id: 2, activity: 'Fertilizer order placed for Wheat Field B', time: '4 hours ago', type: 'info' },
    { id: 3, activity: 'Harvest scheduled for Tomato Field C', time: '6 hours ago', type: 'warning' },
    { id: 4, activity: 'Equipment maintenance reminder', time: '1 day ago', type: 'error' },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}! Here's what's happening on your farm.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${stats.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+{stats.revenueChange}% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Crops</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeCrops}</p>
              <div className="flex items-center mt-2">
                {stats.cropsChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ml-1 ${stats.cropsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.cropsChange >= 0 ? '+' : ''}{stats.cropsChange} new crops
                </span>
              </div>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <Sprout className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Field Areas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalArea} acres</p>
              <div className="flex items-center mt-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600 ml-1">Total managed area</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingTasks}</p>
              <div className="flex items-center mt-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-amber-600 ml-1">Require attention</span>
              </div>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <CheckSquare className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Weather Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Live Weather</h3>
              <p className="text-blue-100 text-sm">{weather?.location}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-200">Updated</p>
              <p className="text-xs text-blue-200">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          
          {weather && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-5 h-5" />
                  <span>Temperature</span>
                </div>
                <span className="font-bold text-xl">{weather.temperature}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-5 h-5" />
                  <span>Humidity</span>
                </div>
                <span className="font-bold">{weather.humidity}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Wind Speed</span>
                </div>
                <span className="font-bold">{weather.windSpeed} km/h</span>
              </div>
              <div className="mt-4 p-3 bg-white/20 rounded-lg">
                <p className="text-center font-medium">{weather.condition}</p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' :
                  activity.type === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.activity}</p>
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              label: 'Add New Crop', 
              color: 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300',
              icon: Sprout,
              action: 'add-crop'
            },
            { 
              label: 'Schedule Task', 
              color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300',
              icon: CheckSquare,
              action: 'schedule-task'
            },
            { 
              label: 'Record Expense', 
              color: 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-300',
              icon: DollarSign,
              action: 'record-expense'
            },
            { 
              label: 'Update Inventory', 
              color: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300',
              icon: Package,
              action: 'update-inventory'
            }
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className={`p-4 rounded-lg border-2 border-dashed transition-all duration-200 flex flex-col items-center space-y-2 hover:scale-105 ${action.color}`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium text-center">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Farm Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Sprout className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Crop Health</h4>
            <p className="text-2xl font-bold text-green-600 mt-1">Excellent</p>
            <p className="text-sm text-gray-600">Overall crop condition</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Productivity</h4>
            <p className="text-2xl font-bold text-blue-600 mt-1">87%</p>
            <p className="text-sm text-gray-600">Farm efficiency rating</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Growth Rate</h4>
            <p className="text-2xl font-bold text-purple-600 mt-1">+15%</p>
            <p className="text-sm text-gray-600">Compared to last season</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
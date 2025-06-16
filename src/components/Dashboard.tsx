import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Droplets, 
  Thermometer,
  DollarSign,
  Sprout,
  MapPin,
  AlertTriangle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,280',
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Crops',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: Sprout,
      color: 'bg-emerald-500'
    },
    {
      title: 'Field Areas',
      value: '156 acres',
      change: 'No change',
      trend: 'stable',
      icon: MapPin,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Tasks',
      value: '12',
      change: '-3',
      trend: 'down',
      icon: AlertTriangle,
      color: 'bg-amber-500'
    }
  ];

  const recentActivities = [
    { id: 1, activity: 'Corn Field A - Irrigation completed', time: '2 hours ago', type: 'success' },
    { id: 2, activity: 'Fertilizer order placed for Wheat Field B', time: '4 hours ago', type: 'info' },
    { id: 3, activity: 'Harvest scheduled for Tomato Field C', time: '6 hours ago', type: 'warning' },
    { id: 4, activity: 'Equipment maintenance reminder', time: '1 day ago', type: 'error' },
  ];

  const weatherData = {
    temperature: '24°C',
    humidity: '65%',
    windSpeed: '12 km/h',
    condition: 'Partly Cloudy'
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening on your farm.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                    <span className={`text-sm ml-1 ${
                      stat.trend === 'up' ? 'text-green-600' : 
                      stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm text-white p-6">
          <h3 className="text-lg font-semibold mb-4">Weather Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5" />
                <span>Temperature</span>
              </div>
              <span className="font-bold">{weatherData.temperature}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5" />
                <span>Humidity</span>
              </div>
              <span className="font-bold">{weatherData.humidity}</span>
            </div>
            <div className="mt-4 p-3 bg-white/20 rounded-lg">
              <p className="text-center font-medium">{weatherData.condition}</p>
            </div>
          </div>
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
            { label: 'Add New Crop', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
            { label: 'Schedule Task', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
            { label: 'Record Expense', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
            { label: 'Update Inventory', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' }
          ].map((action, index) => (
            <button
              key={index}
              className={`p-4 rounded-lg border-2 border-dashed border-gray-300 transition-all ${action.color}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
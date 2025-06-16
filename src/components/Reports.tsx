import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Sprout,
  MapPin,
  Users,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';

interface ReportData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  cropYield: number;
  efficiency: number;
}

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('financial');

  const [reportData] = useState<ReportData[]>([
    { period: 'Jan 2024', revenue: 45280, expenses: 32150, profit: 13130, cropYield: 85, efficiency: 78 },
    { period: 'Feb 2024', revenue: 38920, expenses: 28750, profit: 10170, cropYield: 82, efficiency: 75 },
    { period: 'Mar 2024', revenue: 52340, expenses: 35200, profit: 17140, cropYield: 88, efficiency: 82 },
    { period: 'Apr 2024', revenue: 48750, expenses: 31800, profit: 16950, cropYield: 90, efficiency: 85 },
    { period: 'May 2024', revenue: 55680, expenses: 38200, profit: 17480, cropYield: 92, efficiency: 87 }
  ]);

  const currentData = reportData[reportData.length - 1];
  const previousData = reportData[reportData.length - 2];

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  const revenueChange = calculateChange(currentData.revenue, previousData.revenue);
  const profitChange = calculateChange(currentData.profit, previousData.profit);
  const yieldChange = calculateChange(currentData.cropYield, previousData.cropYield);
  const efficiencyChange = calculateChange(currentData.efficiency, previousData.efficiency);

  const cropPerformance = [
    { crop: 'Tomatoes', yield: 92, revenue: 18500, area: 2.5, efficiency: 88 },
    { crop: 'Corn', yield: 88, revenue: 15200, area: 5.0, efficiency: 82 },
    { crop: 'Wheat', yield: 95, revenue: 12800, area: 8.5, efficiency: 91 },
    { crop: 'Soybeans', yield: 85, revenue: 9180, area: 3.2, efficiency: 79 }
  ];

  const fieldPerformance = [
    { field: 'Field A', area: 12.5, utilization: 95, revenue: 22400, crops: 3 },
    { field: 'Field B', area: 8.3, utilization: 88, revenue: 18200, crops: 2 },
    { field: 'Field C', area: 15.7, utilization: 92, revenue: 28600, crops: 2 },
    { field: 'Field D', area: 6.2, utilization: 78, revenue: 12300, crops: 1 }
  ];

  const reportTypes = [
    { id: 'financial', label: 'Financial Report', icon: DollarSign },
    { id: 'crop', label: 'Crop Performance', icon: Sprout },
    { id: 'field', label: 'Field Analysis', icon: MapPin },
    { id: 'operational', label: 'Operations Report', icon: Activity }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your farm performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${currentData.revenue.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                {revenueChange.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ml-1 ${revenueChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueChange.isPositive ? '+' : '-'}{revenueChange.value}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${currentData.profit.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                {profitChange.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ml-1 ${profitChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {profitChange.isPositive ? '+' : '-'}{profitChange.value}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Crop Yield</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{currentData.cropYield}%</p>
              <div className="flex items-center mt-2">
                {yieldChange.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ml-1 ${yieldChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {yieldChange.isPositive ? '+' : '-'}{yieldChange.value}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <Sprout className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Efficiency</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{currentData.efficiency}%</p>
              <div className="flex items-center mt-2">
                {efficiencyChange.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ml-1 ${efficiencyChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {efficiencyChange.isPositive ? '+' : '-'}{efficiencyChange.value}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedReport(type.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    selectedReport === type.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {selectedReport === 'financial' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Financial Performance</h3>
              
              {/* Revenue vs Expenses Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Revenue vs Expenses Trend</h4>
                <div className="space-y-4">
                  {reportData.map((data, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-20 text-sm text-gray-600">{data.period}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-700">Revenue</span>
                          <span className="text-sm font-medium">${data.revenue.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(data.revenue / 60000) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-red-700">Expenses</span>
                          <span className="text-sm font-medium">${data.expenses.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${(data.expenses / 60000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profit Margin Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-medium text-green-900 mb-2">Profit Margin</h4>
                  <p className="text-2xl font-bold text-green-700">
                    {((currentData.profit / currentData.revenue) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-green-600 mt-1">Industry average: 15-20%</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-medium text-blue-900 mb-2">ROI</h4>
                  <p className="text-2xl font-bold text-blue-700">24.8%</p>
                  <p className="text-sm text-blue-600 mt-1">Return on Investment</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <h4 className="font-medium text-purple-900 mb-2">Break-even</h4>
                  <p className="text-2xl font-bold text-purple-700">78%</p>
                  <p className="text-sm text-purple-600 mt-1">Of capacity needed</p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'crop' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Crop Performance Analysis</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {cropPerformance.map((crop, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{crop.crop}</h4>
                      <span className="text-sm text-gray-600">{crop.area} acres</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Yield Performance</span>
                          <span className="text-sm font-medium text-gray-900">{crop.yield}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${crop.yield}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Efficiency</span>
                          <span className="text-sm font-medium text-gray-900">{crop.efficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${crop.efficiency}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Revenue Generated</span>
                          <span className="text-lg font-bold text-green-600">${crop.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedReport === 'field' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Field Analysis</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crops</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue/Acre</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fieldPerformance.map((field, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{field.field}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {field.area} acres
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${field.utilization}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{field.utilization}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {field.crops} crops
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${field.revenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${Math.round(field.revenue / field.area).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReport === 'operational' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Operations Report</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Tasks Completed</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">127</p>
                    </div>
                    <CheckSquare className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Equipment Uptime</p>
                      <p className="text-2xl font-bold text-green-900 mt-1">94%</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Labor Hours</p>
                      <p className="text-2xl font-bold text-yellow-900 mt-1">1,248</p>
                    </div>
                    <Users className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Maintenance Cost</p>
                      <p className="text-2xl font-bold text-purple-900 mt-1">$8,450</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Resource Utilization</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Water Usage</span>
                      <span className="text-sm font-medium text-gray-900">2,450 gallons/acre</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Fuel Consumption</span>
                      <span className="text-sm font-medium text-gray-900">15.2 gal/acre</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Labor Efficiency</span>
                      <span className="text-sm font-medium text-gray-900">87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
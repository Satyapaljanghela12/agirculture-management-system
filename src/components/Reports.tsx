import React, { useState, useEffect } from 'react';
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
  Activity,
  CheckSquare,
  Truck,
  Package,
  Zap
} from 'lucide-react';
import { exportToPDF } from '../utils/pdfExport';

interface ReportData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  cropYield: number;
  efficiency: number;
}

interface OperationalData {
  tasksCompleted: number;
  equipmentUptime: number;
  laborHours: number;
  maintenanceCost: number;
  waterUsage: number;
  fuelConsumption: number;
  laborEfficiency: number;
  energyUsage: number;
  wasteReduction: number;
  soilHealth: number;
}

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('financial');
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [operationalData, setOperationalData] = useState<OperationalData | null>(null);

  // Generate dynamic data based on selected period
  useEffect(() => {
    generateReportData();
  }, [selectedPeriod]);

  const generateReportData = () => {
    const baseData = {
      week: [
        { period: 'Mon', revenue: 8500, expenses: 6200, profit: 2300, cropYield: 88, efficiency: 82 },
        { period: 'Tue', revenue: 7200, expenses: 5800, profit: 1400, cropYield: 85, efficiency: 79 },
        { period: 'Wed', revenue: 9100, expenses: 6500, profit: 2600, cropYield: 90, efficiency: 85 },
        { period: 'Thu', revenue: 8800, expenses: 6100, profit: 2700, cropYield: 87, efficiency: 83 },
        { period: 'Fri', revenue: 9500, expenses: 6800, profit: 2700, cropYield: 92, efficiency: 88 },
        { period: 'Sat', revenue: 7800, expenses: 5900, profit: 1900, cropYield: 86, efficiency: 81 },
        { period: 'Sun', revenue: 6900, expenses: 5200, profit: 1700, cropYield: 84, efficiency: 78 }
      ],
      month: [
        { period: 'Jan 2024', revenue: 45280, expenses: 32150, profit: 13130, cropYield: 85, efficiency: 78 },
        { period: 'Feb 2024', revenue: 38920, expenses: 28750, profit: 10170, cropYield: 82, efficiency: 75 },
        { period: 'Mar 2024', revenue: 52340, expenses: 35200, profit: 17140, cropYield: 88, efficiency: 82 },
        { period: 'Apr 2024', revenue: 48750, expenses: 31800, profit: 16950, cropYield: 90, efficiency: 85 },
        { period: 'May 2024', revenue: 55680, expenses: 38200, profit: 17480, cropYield: 92, efficiency: 87 },
        { period: 'Jun 2024', revenue: 62100, expenses: 41500, profit: 20600, cropYield: 94, efficiency: 89 }
      ],
      quarter: [
        { period: 'Q1 2024', revenue: 136540, expenses: 96100, profit: 40440, cropYield: 85, efficiency: 78 },
        { period: 'Q2 2024', revenue: 166530, expenses: 111500, profit: 55030, cropYield: 92, efficiency: 87 },
        { period: 'Q3 2024', revenue: 178200, expenses: 118900, profit: 59300, cropYield: 89, efficiency: 85 },
        { period: 'Q4 2024', revenue: 165800, expenses: 112300, profit: 53500, cropYield: 87, efficiency: 83 }
      ],
      year: [
        { period: '2020', revenue: 520000, expenses: 380000, profit: 140000, cropYield: 78, efficiency: 72 },
        { period: '2021', revenue: 580000, expenses: 410000, profit: 170000, cropYield: 82, efficiency: 76 },
        { period: '2022', revenue: 640000, expenses: 445000, profit: 195000, cropYield: 85, efficiency: 80 },
        { period: '2023', revenue: 720000, expenses: 485000, profit: 235000, cropYield: 88, efficiency: 84 },
        { period: '2024', revenue: 647070, expenses: 438800, profit: 208270, cropYield: 88, efficiency: 83 }
      ]
    };

    setReportData(baseData[selectedPeriod as keyof typeof baseData]);

    // Generate operational data based on period
    const operationalMultiplier = selectedPeriod === 'week' ? 0.1 : selectedPeriod === 'month' ? 1 : selectedPeriod === 'quarter' ? 3 : 12;
    setOperationalData({
      tasksCompleted: Math.round(127 * operationalMultiplier),
      equipmentUptime: 94,
      laborHours: Math.round(1248 * operationalMultiplier),
      maintenanceCost: Math.round(8450 * operationalMultiplier),
      waterUsage: Math.round(2450 * operationalMultiplier),
      fuelConsumption: Math.round(15.2 * operationalMultiplier * 10) / 10,
      laborEfficiency: 87,
      energyUsage: Math.round(3200 * operationalMultiplier),
      wasteReduction: 23,
      soilHealth: 91
    });
  };

  const currentData = reportData[reportData.length - 1];
  const previousData = reportData[reportData.length - 2];

  const calculateChange = (current: number, previous: number) => {
    if (!previous) return { value: '0.0', isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  const revenueChange = currentData && previousData ? calculateChange(currentData.revenue, previousData.revenue) : { value: '0.0', isPositive: true };
  const profitChange = currentData && previousData ? calculateChange(currentData.profit, previousData.profit) : { value: '0.0', isPositive: true };
  const yieldChange = currentData && previousData ? calculateChange(currentData.cropYield, previousData.cropYield) : { value: '0.0', isPositive: true };
  const efficiencyChange = currentData && previousData ? calculateChange(currentData.efficiency, previousData.efficiency) : { value: '0.0', isPositive: true };

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

  const handleExport = async () => {
    try {
      let exportData;
      let title;

      switch (selectedReport) {
        case 'financial':
          exportData = reportData.map(data => ({
            period: data.period,
            revenue: data.revenue,
            expenses: data.expenses,
            profit: data.profit,
            profitMargin: ((data.profit / data.revenue) * 100).toFixed(1) + '%'
          }));
          title = `Financial Report - ${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}ly`;
          break;
        case 'crop':
          exportData = cropPerformance;
          title = 'Crop Performance Report';
          break;
        case 'field':
          exportData = fieldPerformance.map(field => ({
            ...field,
            revenuePerAcre: Math.round(field.revenue / field.area)
          }));
          title = 'Field Analysis Report';
          break;
        case 'operational':
          exportData = operationalData ? [operationalData] : [];
          title = 'Operations Report';
          break;
        default:
          exportData = reportData;
          title = 'General Report';
      }

      const columns = getColumnsForReport(selectedReport);
      const summary = getSummaryForReport(selectedReport);

      await exportToPDF({
        title,
        data: exportData,
        columns,
        summary
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error exporting report. Please try again.');
    }
  };

  const getColumnsForReport = (reportType: string) => {
    switch (reportType) {
      case 'financial':
        return [
          { key: 'period', label: 'Period', width: 120 },
          { key: 'revenue', label: 'Revenue ($)', width: 120 },
          { key: 'expenses', label: 'Expenses ($)', width: 120 },
          { key: 'profit', label: 'Profit ($)', width: 120 },
          { key: 'profitMargin', label: 'Profit Margin', width: 120 }
        ];
      case 'crop':
        return [
          { key: 'crop', label: 'Crop', width: 120 },
          { key: 'yield', label: 'Yield (%)', width: 100 },
          { key: 'revenue', label: 'Revenue ($)', width: 120 },
          { key: 'area', label: 'Area (acres)', width: 100 },
          { key: 'efficiency', label: 'Efficiency (%)', width: 120 }
        ];
      case 'field':
        return [
          { key: 'field', label: 'Field', width: 120 },
          { key: 'area', label: 'Area (acres)', width: 100 },
          { key: 'utilization', label: 'Utilization (%)', width: 120 },
          { key: 'revenue', label: 'Revenue ($)', width: 120 },
          { key: 'revenuePerAcre', label: 'Revenue/Acre ($)', width: 140 },
          { key: 'crops', label: 'Crops', width: 80 }
        ];
      case 'operational':
        return [
          { key: 'tasksCompleted', label: 'Tasks Completed', width: 140 },
          { key: 'equipmentUptime', label: 'Equipment Uptime (%)', width: 160 },
          { key: 'laborHours', label: 'Labor Hours', width: 120 },
          { key: 'maintenanceCost', label: 'Maintenance Cost ($)', width: 160 }
        ];
      default:
        return [
          { key: 'period', label: 'Period', width: 120 },
          { key: 'revenue', label: 'Revenue ($)', width: 120 },
          { key: 'profit', label: 'Profit ($)', width: 120 }
        ];
    }
  };

  const getSummaryForReport = (reportType: string) => {
    switch (reportType) {
      case 'financial':
        return {
          totalRevenue: reportData.reduce((sum, data) => sum + data.revenue, 0),
          totalExpenses: reportData.reduce((sum, data) => sum + data.expenses, 0),
          totalProfit: reportData.reduce((sum, data) => sum + data.profit, 0),
          averageEfficiency: Math.round(reportData.reduce((sum, data) => sum + data.efficiency, 0) / reportData.length)
        };
      case 'crop':
        return {
          totalCrops: cropPerformance.length,
          totalArea: cropPerformance.reduce((sum, crop) => sum + crop.area, 0),
          totalRevenue: cropPerformance.reduce((sum, crop) => sum + crop.revenue, 0),
          averageYield: Math.round(cropPerformance.reduce((sum, crop) => sum + crop.yield, 0) / cropPerformance.length)
        };
      case 'field':
        return {
          totalFields: fieldPerformance.length,
          totalArea: fieldPerformance.reduce((sum, field) => sum + field.area, 0),
          totalRevenue: fieldPerformance.reduce((sum, field) => sum + field.revenue, 0),
          averageUtilization: Math.round(fieldPerformance.reduce((sum, field) => sum + field.utilization, 0) / fieldPerformance.length)
        };
      case 'operational':
        return operationalData ? {
          tasksCompleted: operationalData.tasksCompleted,
          equipmentUptime: operationalData.equipmentUptime,
          laborHours: operationalData.laborHours,
          maintenanceCost: operationalData.maintenanceCost
        } : {};
      default:
        return {};
    }
  };

  if (!currentData) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your farm performance</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">Monthly</option>
            <option value="quarter">Quarterly</option>
            <option value="year">Yearly</option>
          </select>
          <button 
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
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
                            style={{ width: `${(data.revenue / Math.max(...reportData.map(d => d.revenue))) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-red-700">Expenses</span>
                          <span className="text-sm font-medium">${data.expenses.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${(data.expenses / Math.max(...reportData.map(d => d.revenue))) * 100}%` }}
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

          {selectedReport === 'operational' && operationalData && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Operations Report</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Tasks Completed</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">{operationalData.tasksCompleted}</p>
                    </div>
                    <CheckSquare className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Equipment Uptime</p>
                      <p className="text-2xl font-bold text-green-900 mt-1">{operationalData.equipmentUptime}%</p>
                    </div>
                    <Truck className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Labor Hours</p>
                      <p className="text-2xl font-bold text-yellow-900 mt-1">{operationalData.laborHours.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Maintenance Cost</p>
                      <p className="text-2xl font-bold text-purple-900 mt-1">${operationalData.maintenanceCost.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Resource Utilization</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Water Usage</span>
                        <span className="text-sm font-medium text-gray-900">{operationalData.waterUsage} gallons/acre</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Fuel Consumption</span>
                        <span className="text-sm font-medium text-gray-900">{operationalData.fuelConsumption} gal/acre</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Labor Efficiency</span>
                        <span className="text-sm font-medium text-gray-900">{operationalData.laborEfficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${operationalData.laborEfficiency}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Sustainability Metrics</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Energy Usage</span>
                        <span className="text-sm font-medium text-gray-900">{operationalData.energyUsage} kWh</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Waste Reduction</span>
                        <span className="text-sm font-medium text-gray-900">{operationalData.wasteReduction}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${operationalData.wasteReduction}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Soil Health</span>
                        <span className="text-sm font-medium text-gray-900">{operationalData.soilHealth}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${operationalData.soilHealth}%` }}></div>
                      </div>
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
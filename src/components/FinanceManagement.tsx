import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  PieChart,
  BarChart3,
  CreditCard,
  Receipt,
  Target,
  AlertCircle
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  field?: string;
  notes: string;
}

interface Budget {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
}

const FinanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterPeriod, setFilterPeriod] = useState('month');

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2024-05-15',
      description: 'Tomato Harvest Sale',
      category: 'Crop Sales',
      type: 'income',
      amount: 3250,
      field: 'Field A',
      notes: 'Premium tomatoes to local market'
    },
    {
      id: '2',
      date: '2024-05-14',
      description: 'Fertilizer Purchase',
      category: 'Supplies',
      type: 'expense',
      amount: 450,
      field: 'Field B',
      notes: 'Organic fertilizer for corn'
    },
    {
      id: '3',
      date: '2024-05-12',
      description: 'Equipment Maintenance',
      category: 'Maintenance',
      type: 'expense',
      amount: 850,
      notes: 'Tractor hydraulic system repair'
    },
    {
      id: '4',
      date: '2024-05-10',
      description: 'Wheat Contract Payment',
      category: 'Crop Sales',
      type: 'income',
      amount: 12500,
      field: 'Field C',
      notes: 'Contract delivery to grain elevator'
    },
    {
      id: '5',
      date: '2024-05-08',
      description: 'Seeds Purchase',
      category: 'Supplies',
      type: 'expense',
      amount: 680,
      field: 'Field D',
      notes: 'Soybean seeds for new planting'
    }
  ]);

  const [budgets] = useState<Budget[]>([
    { category: 'Seeds & Plants', budgeted: 5000, spent: 2340, remaining: 2660 },
    { category: 'Fertilizers', budgeted: 3000, spent: 1875, remaining: 1125 },
    { category: 'Equipment Maintenance', budgeted: 4000, spent: 2950, remaining: 1050 },
    { category: 'Fuel & Energy', budgeted: 2500, spent: 1680, remaining: 820 },
    { category: 'Labor', budgeted: 8000, spent: 4200, remaining: 3800 },
    { category: 'Insurance', budgeted: 1500, spent: 1500, remaining: 0 }
  ]);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const getCategoryColor = (category: string) => {
    const colors = {
      'Crop Sales': 'bg-green-100 text-green-800',
      'Supplies': 'bg-blue-100 text-blue-800',
      'Maintenance': 'bg-yellow-100 text-yellow-800',
      'Labor': 'bg-purple-100 text-purple-800',
      'Fuel & Energy': 'bg-orange-100 text-orange-800',
      'Insurance': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.budgeted) * 100;
    if (percentage >= 100) return { color: 'text-red-600', status: 'Over Budget' };
    if (percentage >= 80) return { color: 'text-yellow-600', status: 'Nearly Exceeded' };
    return { color: 'text-green-600', status: 'On Track' };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Management</h1>
          <p className="text-gray-600 mt-1">Track income, expenses, and budgets</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-sm">
            <Plus className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalIncome.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+15% from last month</span>
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
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalExpenses.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600 ml-1">+8% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(netProfit).toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                {netProfit >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ml-1 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netProfit >= 0 ? 'Profit' : 'Loss'}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-full ${netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <BarChart3 className={`w-6 h-6 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">73%</p>
              <div className="flex items-center mt-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-600 ml-1">On track</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <PieChart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'transactions', label: 'Transactions', icon: Receipt },
              { id: 'budgets', label: 'Budgets', icon: Target }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <div className="flex items-center space-x-3">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <select
                    value={filterPeriod}
                    onChange={(e) => setFilterPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                            {transaction.category}
                          </span>
                          {transaction.field && (
                            <span className="text-sm text-gray-600">• {transaction.field}</span>
                          )}
                          <span className="text-sm text-gray-600">• {new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </p>
                      {transaction.notes && (
                        <p className="text-sm text-gray-500 mt-1">{transaction.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'budgets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Budget Overview</h3>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Budget</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgets.map((budget, index) => {
                  const percentage = (budget.spent / budget.budgeted) * 100;
                  const status = getBudgetStatus(budget);
                  
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">{budget.category}</h4>
                        <span className={`text-sm font-medium ${status.color}`}>{status.status}</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Budgeted</span>
                          <span className="font-medium text-gray-900">${budget.budgeted.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Spent</span>
                          <span className="font-medium text-gray-900">${budget.spent.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Remaining</span>
                          <span className={`font-medium ${budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${Math.abs(budget.remaining).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm font-medium text-gray-900">{percentage.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-300 ${
                                percentage >= 100 ? 'bg-red-500' : 
                                percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Financial Overview</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Revenue by Category</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-green-800 font-medium">Crop Sales</span>
                      <span className="text-green-900 font-bold">${(totalIncome * 0.85).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-800 font-medium">Livestock</span>
                      <span className="text-blue-900 font-bold">${(totalIncome * 0.10).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-800 font-medium">Other Income</span>
                      <span className="text-purple-900 font-bold">${(totalIncome * 0.05).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Expenses by Category</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-red-800 font-medium">Supplies</span>
                      <span className="text-red-900 font-bold">${(totalExpenses * 0.40).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-yellow-800 font-medium">Maintenance</span>
                      <span className="text-yellow-900 font-bold">${(totalExpenses * 0.35).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="text-orange-800 font-medium">Labor</span>
                      <span className="text-orange-900 font-bold">${(totalExpenses * 0.25).toLocaleString()}</span>
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

export default FinanceManagement;
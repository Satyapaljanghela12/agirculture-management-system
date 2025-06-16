import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Calendar,
  MapPin,
  Edit,
  Eye,
  RotateCcw
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  location: string;
  supplier: string;
  costPerUnit: number;
  lastRestocked: string;
  expiryDate?: string;
  notes: string;
}

const InventoryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);

  const [inventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Organic Fertilizer NPK 10-10-10',
      category: 'Fertilizers',
      currentStock: 15,
      minStock: 20,
      maxStock: 100,
      unit: 'bags (50kg)',
      location: 'Storage Shed A',
      supplier: 'GreenGrow Supplies',
      costPerUnit: 45.99,
      lastRestocked: '2024-04-20',
      notes: 'Low stock - reorder soon'
    },
    {
      id: '2',
      name: 'Tomato Seeds - Roma Variety',
      category: 'Seeds',
      currentStock: 5,
      minStock: 3,
      maxStock: 15,
      unit: 'packets',
      location: 'Seed Storage',
      supplier: 'Heritage Seeds Co.',
      costPerUnit: 12.50,
      lastRestocked: '2024-03-15',
      expiryDate: '2025-03-15',
      notes: 'Store in cool, dry place'
    },
    {
      id: '3',
      name: 'Herbicide - Glyphosate 41%',
      category: 'Pesticides',
      currentStock: 8,
      minStock: 5,
      maxStock: 20,
      unit: 'bottles (1L)',
      location: 'Pesticide Cabinet',
      supplier: 'AgriChem Solutions',
      costPerUnit: 28.75,
      lastRestocked: '2024-05-01',
      expiryDate: '2026-05-01',
      notes: 'Handle with care - PPE required'
    },
    {
      id: '4',
      name: 'Irrigation Drip Tape',
      category: 'Equipment',
      currentStock: 12,
      minStock: 8,
      maxStock: 30,
      unit: 'rolls (500ft)',
      location: 'Equipment Shed',
      supplier: 'Irrigation Pro',
      costPerUnit: 85.00,
      lastRestocked: '2024-04-10',
      notes: 'Good quality, reusable'
    },
    {
      id: '5',
      name: 'Potting Mix - Premium Blend',
      category: 'Soil & Amendments',
      currentStock: 25,
      minStock: 15,
      maxStock: 50,
      unit: 'bags (40L)',
      location: 'Storage Shed B',
      supplier: 'Earth Care Products',
      costPerUnit: 18.99,
      lastRestocked: '2024-05-05',
      notes: 'Great for seedling production'
    },
    {
      id: '6',
      name: 'Corn Seeds - Sweet Corn',
      category: 'Seeds',
      currentStock: 2,
      minStock: 5,
      maxStock: 12,
      unit: 'bags (10kg)',
      location: 'Seed Storage',
      supplier: 'Premium Seeds Ltd.',
      costPerUnit: 125.00,
      lastRestocked: '2024-03-20',
      expiryDate: '2025-03-20',
      notes: 'Urgent reorder needed'
    }
  ]);

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return { status: 'low', color: 'text-red-600', icon: TrendingDown };
    if (item.currentStock >= item.maxStock * 0.8) return { status: 'high', color: 'text-green-600', icon: TrendingUp };
    return { status: 'normal', color: 'text-gray-600', icon: Package };
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Seeds': 'bg-green-100 text-green-800',
      'Fertilizers': 'bg-blue-100 text-blue-800',
      'Pesticides': 'bg-red-100 text-red-800',
      'Equipment': 'bg-purple-100 text-purple-800',
      'Soil & Amendments': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays >= 0;
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesLowStock = !showLowStock || item.currentStock <= item.minStock;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const inventoryStats = {
    totalItems: inventory.reduce((sum, item) => sum + item.currentStock, 0),
    lowStockItems: inventory.filter(item => item.currentStock <= item.minStock).length,
    expiringItems: inventory.filter(item => item.expiryDate && isExpiringSoon(item.expiryDate)).length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0),
    categories: [...new Set(inventory.map(item => item.category))].length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track supplies, equipment, and materials</p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{inventoryStats.totalItems}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{inventoryStats.lowStockItems}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{inventoryStats.expiringItems}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{inventoryStats.categories}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Filter className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${inventoryStats.totalValue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search items, suppliers, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Seeds">Seeds</option>
              <option value="Fertilizers">Fertilizers</option>
              <option value="Pesticides">Pesticides</option>
              <option value="Equipment">Equipment</option>
              <option value="Soil & Amendments">Soil & Amendments</option>
            </select>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Low stock only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredInventory.map((item) => {
          const stockStatus = getStockStatus(item);
          const StockIcon = stockStatus.icon;
          
          return (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <StockIcon className={`w-5 h-5 ${stockStatus.color}`} />
                  </div>
                </div>

                {/* Stock Information */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Stock</span>
                    <span className={`font-semibold ${stockStatus.color}`}>
                      {item.currentStock} {item.unit}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Min: {item.minStock}</span>
                      <span>Max: {item.maxStock}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.currentStock <= item.minStock ? 'bg-red-500' : 
                          item.currentStock >= item.maxStock * 0.8 ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-xs text-gray-500">Cost per Unit</p>
                      <p className="font-medium text-gray-900">${item.costPerUnit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Value</p>
                      <p className="font-medium text-gray-900">${(item.currentStock * item.costPerUnit).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Location and Supplier */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{item.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{item.supplier}</span>
                  </div>
                </div>

                {/* Expiry Warning */}
                {item.expiryDate && (
                  <div className={`p-2 rounded-lg mb-4 ${
                    isExpired(item.expiryDate) ? 'bg-red-50 border border-red-200' :
                    isExpiringSoon(item.expiryDate) ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <Calendar className={`w-4 h-4 ${
                        isExpired(item.expiryDate) ? 'text-red-600' :
                        isExpiringSoon(item.expiryDate) ? 'text-yellow-600' : 'text-gray-600'
                      }`} />
                      <span className={`text-sm ${
                        isExpired(item.expiryDate) ? 'text-red-800' :
                        isExpiringSoon(item.expiryDate) ? 'text-yellow-800' : 'text-gray-700'
                      }`}>
                        Expires: {new Date(item.expiryDate).toLocaleDateString()}
                        {isExpired(item.expiryDate) && ' (EXPIRED)'}
                        {isExpiringSoon(item.expiryDate) && !isExpired(item.expiryDate) && ' (Soon)'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {item.notes && (
                  <div className="mb-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{item.notes}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    Last restocked: {new Date(item.lastRestocked).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors px-2 py-1 rounded-lg hover:bg-green-50">
                      <RotateCcw className="w-4 h-4" />
                      <span className="text-sm font-medium">Restock</span>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
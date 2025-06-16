import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Sprout,
  Calendar,
  MapPin,
  Droplets,
  Sun,
  TrendingUp,
  AlertCircle,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface Crop {
  id: string;
  name: string;
  variety: string;
  field: string;
  plantedDate: string;
  expectedHarvest: string;
  status: 'planted' | 'growing' | 'flowering' | 'ready' | 'harvested';
  area: number;
  progress: number;
  health: 'excellent' | 'good' | 'fair' | 'poor';
  irrigation: 'automated' | 'manual' | 'rain-fed';
  notes: string;
}

const CropManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [crops] = useState<Crop[]>([
    {
      id: '1',
      name: 'Tomatoes',
      variety: 'Roma',
      field: 'Field A',
      plantedDate: '2024-03-15',
      expectedHarvest: '2024-06-15',
      status: 'flowering',
      area: 2.5,
      progress: 65,
      health: 'excellent',
      irrigation: 'automated',
      notes: 'Growing well, regular pruning scheduled'
    },
    {
      id: '2',
      name: 'Corn',
      variety: 'Sweet Corn',
      field: 'Field B',
      plantedDate: '2024-04-01',
      expectedHarvest: '2024-07-15',
      status: 'growing',
      area: 5.0,
      progress: 45,
      health: 'good',
      irrigation: 'rain-fed',
      notes: 'Monitor for corn borer'
    },
    {
      id: '3',
      name: 'Wheat',
      variety: 'Winter Wheat',
      field: 'Field C',
      plantedDate: '2024-02-10',
      expectedHarvest: '2024-07-01',
      status: 'ready',
      area: 8.5,
      progress: 90,
      health: 'excellent',
      irrigation: 'manual',
      notes: 'Ready for harvest next week'
    },
    {
      id: '4',
      name: 'Soybeans',
      variety: 'Early Maturing',
      field: 'Field D',
      plantedDate: '2024-05-01',
      expectedHarvest: '2024-09-15',
      status: 'planted',
      area: 3.2,
      progress: 20,
      health: 'good',
      irrigation: 'automated',
      notes: 'Recently planted, emergence expected soon'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'growing': return 'bg-green-100 text-green-800 border-green-200';
      case 'flowering': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ready': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'harvested': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.field.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || crop.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crop Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your crops throughout their lifecycle</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Crop</span>
        </button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Crops</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{crops.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Sprout className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Area</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{crops.reduce((sum, crop) => sum + crop.area, 0)} acres</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ready to Harvest</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{crops.filter(c => c.status === 'ready').length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Health</p>
              <p className="text-2xl font-bold text-green-600 mt-1">Good</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crops, varieties, or fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="planted">Planted</option>
              <option value="growing">Growing</option>
              <option value="flowering">Flowering</option>
              <option value="ready">Ready</option>
              <option value="harvested">Harvested</option>
            </select>
          </div>
        </div>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <div key={crop.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
                  <p className="text-gray-600">{crop.variety}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(crop.status)}`}>
                  {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{crop.field}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{crop.area} acres</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Harvest</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{new Date(crop.expectedHarvest).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Health</span>
                  </div>
                  <span className={`text-sm font-medium ${getHealthColor(crop.health)}`}>
                    {crop.health.charAt(0).toUpperCase() + crop.health.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Irrigation</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {crop.irrigation.charAt(0).toUpperCase() + crop.irrigation.slice(1)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Growth Progress</span>
                  <span className="text-sm font-medium text-gray-900">{crop.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${crop.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Notes */}
              {crop.notes && (
                <div className="mb-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{crop.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">View Details</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <div className="text-center py-12">
          <Sprout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No crops found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default CropManagement;
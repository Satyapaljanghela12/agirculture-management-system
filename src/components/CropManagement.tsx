import React, { useState, useEffect } from 'react';
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
  Eye,
  X,
  Save,
  DollarSign,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Crop {
  _id?: string;
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
  yield?: {
    expected: number;
    actual?: number;
  };
  costs?: {
    seeds: number;
    fertilizer: number;
    pesticides: number;
    labor: number;
    other: number;
  };
  images?: string[];
}

interface NewCropForm {
  name: string;
  variety: string;
  field: string;
  plantedDate: string;
  expectedHarvest: string;
  area: string;
  irrigation: 'automated' | 'manual' | 'rain-fed';
  notes: string;
  expectedYield: string;
  seedCost: string;
  fertilizerCost: string;
  pesticideCost: string;
  laborCost: string;
  otherCost: string;
}

interface UpdateProgressForm {
  progress: number;
  status: 'planted' | 'growing' | 'flowering' | 'ready' | 'harvested';
  health: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string;
  actualYield?: number;
}

const CropManagement: React.FC = () => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(false);
  const [crops, setCrops] = useState<Crop[]>([]);
  
  const [formData, setFormData] = useState<NewCropForm>({
    name: '',
    variety: '',
    field: '',
    plantedDate: '',
    expectedHarvest: '',
    area: '',
    irrigation: 'manual',
    notes: '',
    expectedYield: '',
    seedCost: '',
    fertilizerCost: '',
    pesticideCost: '',
    laborCost: '',
    otherCost: ''
  });

  const [editFormData, setEditFormData] = useState<Crop | null>(null);
  const [progressData, setProgressData] = useState<UpdateProgressForm>({
    progress: 0,
    status: 'planted',
    health: 'good',
    notes: '',
    actualYield: undefined
  });

  // Fetch crops on component mount
  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/crops', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleProgressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProgressData(prev => ({ ...prev, [name]: name === 'progress' || name === 'actualYield' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newCrop = {
        name: formData.name,
        variety: formData.variety,
        field: formData.field,
        plantedDate: formData.plantedDate,
        expectedHarvest: formData.expectedHarvest,
        status: 'planted' as const,
        area: parseFloat(formData.area),
        progress: 0,
        health: 'good' as const,
        irrigation: formData.irrigation,
        notes: formData.notes,
        yield: { expected: parseFloat(formData.expectedYield) || 0 },
        costs: {
          seeds: parseFloat(formData.seedCost) || 0,
          fertilizer: parseFloat(formData.fertilizerCost) || 0,
          pesticides: parseFloat(formData.pesticideCost) || 0,
          labor: parseFloat(formData.laborCost) || 0,
          other: parseFloat(formData.otherCost) || 0
        }
      };

      await axios.post('/crops', newCrop, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchCrops();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating crop:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData || !editFormData._id) return;
    
    setLoading(true);
    try {
      await axios.put(`/crops/${editFormData._id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchCrops();
      setShowEditModal(false);
      setEditFormData(null);
    } catch (error) {
      console.error('Error updating crop:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrop || !selectedCrop._id) return;
    
    setLoading(true);
    try {
      const updateData = {
        ...selectedCrop,
        progress: progressData.progress,
        status: progressData.status,
        health: progressData.health,
        notes: progressData.notes,
        yield: {
          ...selectedCrop.yield,
          actual: progressData.actualYield
        }
      };

      await axios.put(`/crops/${selectedCrop._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchCrops();
      setShowProgressModal(false);
      setSelectedCrop(null);
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cropId: string) => {
    if (!window.confirm('Are you sure you want to delete this crop?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`/crops/${cropId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCrops();
    } catch (error) {
      console.error('Error deleting crop:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      variety: '',
      field: '',
      plantedDate: '',
      expectedHarvest: '',
      area: '',
      irrigation: 'manual',
      notes: '',
      expectedYield: '',
      seedCost: '',
      fertilizerCost: '',
      pesticideCost: '',
      laborCost: '',
      otherCost: ''
    });
  };

  const handleViewDetails = (crop: Crop) => {
    setSelectedCrop(crop);
    setShowDetailModal(true);
  };

  const handleEdit = (crop: Crop) => {
    setEditFormData(crop);
    setShowEditModal(true);
  };

  const handleUpdateProgress = (crop: Crop) => {
    setSelectedCrop(crop);
    setProgressData({
      progress: crop.progress,
      status: crop.status,
      health: crop.health,
      notes: crop.notes,
      actualYield: crop.yield?.actual
    });
    setShowProgressModal(true);
  };

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.field.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || crop.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getTotalCosts = (costs: Crop['costs']) => {
    if (!costs) return 0;
    return costs.seeds + costs.fertilizer + costs.pesticides + costs.labor + costs.other;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crop Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your crops throughout their lifecycle</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-sm hover:shadow-md transform hover:scale-105"
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
              <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {crops.length > 0 ? Math.round(crops.reduce((sum, crop) => sum + crop.progress, 0) / crops.length) : 0}%
              </p>
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crops...</p>
        </div>
      )}

      {/* Crops Grid */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <div key={crop._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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
                  <button 
                    onClick={() => handleViewDetails(crop)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View Details</span>
                  </button>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEdit(crop)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(crop._id!)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredCrops.length === 0 && (
        <div className="text-center py-12">
          <Sprout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No crops found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Crop</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Crop Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Tomatoes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Variety *</label>
                    <input
                      type="text"
                      name="variety"
                      value={formData.variety}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Roma"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Field *</label>
                    <input
                      type="text"
                      name="field"
                      value={formData.field}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Field A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area (acres) *</label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Planted Date *</label>
                    <input
                      type="date"
                      name="plantedDate"
                      value={formData.plantedDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Harvest *</label>
                    <input
                      type="date"
                      name="expectedHarvest"
                      value={formData.expectedHarvest}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Irrigation and Yield */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cultivation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Irrigation System</label>
                    <select
                      name="irrigation"
                      value={formData.irrigation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="manual">Manual</option>
                      <option value="automated">Automated</option>
                      <option value="rain-fed">Rain-fed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Yield (lbs)</label>
                    <input
                      type="number"
                      name="expectedYield"
                      value={formData.expectedYield}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 15000"
                    />
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seeds ($)</label>
                    <input
                      type="number"
                      name="seedCost"
                      value={formData.seedCost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fertilizer ($)</label>
                    <input
                      type="number"
                      name="fertilizerCost"
                      value={formData.fertilizerCost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pesticides ($)</label>
                    <input
                      type="number"
                      name="pesticideCost"
                      value={formData.pesticideCost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Labor ($)</label>
                    <input
                      type="number"
                      name="laborCost"
                      value={formData.laborCost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Other Costs ($)</label>
                    <input
                      type="number"
                      name="otherCost"
                      value={formData.otherCost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Any additional notes about this crop..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>{loading ? 'Adding...' : 'Add Crop'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Crop Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Crop</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crop Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variety</label>
                  <input
                    type="text"
                    name="variety"
                    value={editFormData.variety}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field</label>
                  <input
                    type="text"
                    name="field"
                    value={editFormData.field}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area (acres)</label>
                  <input
                    type="number"
                    name="area"
                    value={editFormData.area}
                    onChange={handleEditInputChange}
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={editFormData.notes}
                  onChange={handleEditInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>{loading ? 'Updating...' : 'Update Crop'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Progress Modal */}
      {showProgressModal && selectedCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Update Progress</h2>
              <button
                onClick={() => setShowProgressModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleProgressUpdate} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
                  <input
                    type="number"
                    name="progress"
                    value={progressData.progress}
                    onChange={handleProgressInputChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={progressData.status}
                    onChange={handleProgressInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="planted">Planted</option>
                    <option value="growing">Growing</option>
                    <option value="flowering">Flowering</option>
                    <option value="ready">Ready</option>
                    <option value="harvested">Harvested</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Health</label>
                  <select
                    name="health"
                    value={progressData.health}
                    onChange={handleProgressInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Actual Yield (lbs)</label>
                  <input
                    type="number"
                    name="actualYield"
                    value={progressData.actualYield || ''}
                    onChange={handleProgressInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter if harvested"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={progressData.notes}
                  onChange={handleProgressInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Update notes about current status..."
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowProgressModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Activity className="w-5 h-5" />
                  )}
                  <span>{loading ? 'Updating...' : 'Update Progress'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Crop Detail Modal */}
      {showDetailModal && selectedCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCrop.name} - {selectedCrop.variety}</h2>
                <p className="text-gray-600">{selectedCrop.field} • {selectedCrop.area} acres</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Status and Progress */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedCrop.status)}`}>
                        {selectedCrop.status.charAt(0).toUpperCase() + selectedCrop.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Health</span>
                      <span className={`font-medium ${getHealthColor(selectedCrop.health)}`}>
                        {selectedCrop.health.charAt(0).toUpperCase() + selectedCrop.health.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{selectedCrop.progress}%</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${selectedCrop.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Planted</span>
                      <span className="font-medium text-gray-900">{new Date(selectedCrop.plantedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Expected Harvest</span>
                      <span className="font-medium text-gray-900">{new Date(selectedCrop.expectedHarvest).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Days to Harvest</span>
                      <span className="font-medium text-gray-900">
                        {Math.max(0, Math.ceil((new Date(selectedCrop.expectedHarvest).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cultivation</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Irrigation</span>
                      <span className="font-medium text-gray-900">
                        {selectedCrop.irrigation.charAt(0).toUpperCase() + selectedCrop.irrigation.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Area</span>
                      <span className="font-medium text-gray-900">{selectedCrop.area} acres</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Field</span>
                      <span className="font-medium text-gray-900">{selectedCrop.field}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Yield Information */}
              {selectedCrop.yield && (
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    <span>Yield Information</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Expected Yield</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedCrop.yield.expected?.toLocaleString() || 'N/A'} lbs</p>
                    </div>
                    {selectedCrop.yield.actual && (
                      <div>
                        <p className="text-sm text-gray-600">Actual Yield</p>
                        <p className="text-2xl font-bold text-green-600">{selectedCrop.yield.actual.toLocaleString()} lbs</p>
                      </div>
                    )}
                    {selectedCrop.yield.actual && selectedCrop.yield.expected && (
                      <div>
                        <p className="text-sm text-gray-600">Yield Efficiency</p>
                        <p className={`text-2xl font-bold ${
                          (selectedCrop.yield.actual / selectedCrop.yield.expected) >= 1 ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {((selectedCrop.yield.actual / selectedCrop.yield.expected) * 100).toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cost Breakdown */}
              {selectedCrop.costs && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span>Cost Breakdown</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Seeds</p>
                      <p className="text-lg font-bold text-gray-900">${selectedCrop.costs.seeds}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Fertilizer</p>
                      <p className="text-lg font-bold text-gray-900">${selectedCrop.costs.fertilizer}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Pesticides</p>
                      <p className="text-lg font-bold text-gray-900">${selectedCrop.costs.pesticides}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Labor</p>
                      <p className="text-lg font-bold text-gray-900">${selectedCrop.costs.labor}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Other</p>
                      <p className="text-lg font-bold text-gray-900">${selectedCrop.costs.other}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-lg font-bold text-blue-600">${getTotalCosts(selectedCrop.costs)}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Cost per Acre</span>
                      <span className="text-xl font-bold text-blue-600">
                        ${(getTotalCosts(selectedCrop.costs) / selectedCrop.area).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedCrop.notes && (
                <div className="bg-amber-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span>Notes</span>
                  </h3>
                  <p className="text-gray-700">{selectedCrop.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => handleEdit(selectedCrop)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-5 h-5" />
                  <span>Edit Crop</span>
                </button>
                <button 
                  onClick={() => handleUpdateProgress(selectedCrop)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Activity className="w-5 h-5" />
                  <span>Update Progress</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropManagement;
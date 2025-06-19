import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Plus,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Droplets,
  Sun,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  X,
  Save,
  Trash2,
  BarChart3
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
    expected?: number;
    actual?: number;
  };
  costs?: {
    seeds: number;
    fertilizer: number;
    pesticides: number;
    labor: number;
    other: number;
  };
}

interface NewCropForm {
  name: string;
  variety: string;
  field: string;
  plantedDate: string;
  expectedHarvest: string;
  status: 'planted' | 'growing' | 'flowering' | 'ready' | 'harvested';
  area: string;
  progress: string;
  health: 'excellent' | 'good' | 'fair' | 'poor';
  irrigation: 'automated' | 'manual' | 'rain-fed';
  notes: string;
  expectedYield: string;
  actualYield: string;
  seedsCost: string;
  fertilizerCost: string;
  pesticidesCost: string;
  laborCost: string;
  otherCost: string;
}

const CropManagement: React.FC = () => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [editFormData, setEditFormData] = useState<Crop | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressCrop, setProgressCrop] = useState<Crop | null>(null);
  const [newProgress, setNewProgress] = useState('');

  const [formData, setFormData] = useState<NewCropForm>({
    name: '',
    variety: '',
    field: '',
    plantedDate: '',
    expectedHarvest: '',
    status: 'planted',
    area: '',
    progress: '0',
    health: 'good',
    irrigation: 'manual',
    notes: '',
    expectedYield: '',
    actualYield: '',
    seedsCost: '0',
    fertilizerCost: '0',
    pesticidesCost: '0',
    laborCost: '0',
    otherCost: '0'
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => prev ? { ...prev, [name]: value } : null);
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
        status: formData.status,
        area: parseFloat(formData.area),
        progress: parseFloat(formData.progress),
        health: formData.health,
        irrigation: formData.irrigation,
        notes: formData.notes,
        yield: {
          expected: formData.expectedYield ? parseFloat(formData.expectedYield) : undefined,
          actual: formData.actualYield ? parseFloat(formData.actualYield) : undefined
        },
        costs: {
          seeds: parseFloat(formData.seedsCost),
          fertilizer: parseFloat(formData.fertilizerCost),
          pesticides: parseFloat(formData.pesticidesCost),
          labor: parseFloat(formData.laborCost),
          other: parseFloat(formData.otherCost)
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
      status: 'planted',
      area: '',
      progress: '0',
      health: 'good',
      irrigation: 'manual',
      notes: '',
      expectedYield: '',
      actualYield: '',
      seedsCost: '0',
      fertilizerCost: '0',
      pesticidesCost: '0',
      laborCost: '0',
      otherCost: '0'
    });
  };

  const handleEdit = (crop: Crop) => {
    setEditFormData(crop);
    setShowEditModal(true);
  };

  const handleViewDetails = (crop: Crop) => {
    setSelectedCrop(crop);
    setShowDetailsModal(true);
  };

  const handleUpdateProgress = (crop: Crop) => {
    setProgressCrop(crop);
    setNewProgress(crop.progress.toString());
    setShowProgressModal(true);
  };

  const submitProgressUpdate = async () => {
    if (!progressCrop || !progressCrop._id) return;
    
    setLoading(true);
    try {
      const updatedCrop = {
        ...progressCrop,
        progress: parseFloat(newProgress)
      };

      await axios.put(`/crops/${progressCrop._id}`, updatedCrop, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchCrops();
      setShowProgressModal(false);
      setProgressCrop(null);
      setNewProgress('');
    } catch (error) {
      console.error('Error updating progress:', error);
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

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'good': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'fair': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'poor': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDaysToHarvest = (expectedHarvest: string) => {
    const today = new Date();
    const harvestDate = new Date(expectedHarvest);
    const diffTime = harvestDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
          <p className="text-gray-600 mt-1">Monitor and manage your crop production</p>
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
              <p className="text-sm font-medium text-gray-600">Growing</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{crops.filter(c => c.status === 'growing').length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Total Area</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{crops.reduce((sum, crop) => sum + crop.area, 0)} acres</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-600" />
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
        {filteredCrops.map((crop) => {
          const daysToHarvest = getDaysToHarvest(crop.expectedHarvest);
          
          return (
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
                    <span className="text-sm text-gray-600">Field</span>
                    <span className="font-medium text-gray-900">{crop.field}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Area</span>
                    <span className="font-medium text-gray-900">{crop.area} acres</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Health</span>
                    <div className="flex items-center space-x-1">
                      {getHealthIcon(crop.health)}
                      <span className={`font-medium ${getHealthColor(crop.health)}`}>
                        {crop.health.charAt(0).toUpperCase() + crop.health.slice(1)}
                      </span>
                    </div>
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

                {/* Days to Harvest */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        {daysToHarvest > 0 ? `${daysToHarvest} days to harvest` : 
                         daysToHarvest === 0 ? 'Harvest today!' : 
                         `${Math.abs(daysToHarvest)} days overdue`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Irrigation Status */}
                <div className="flex items-center space-x-2 mb-4">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    {crop.irrigation.charAt(0).toUpperCase() + crop.irrigation.slice(1)} irrigation
                  </span>
                </div>

                {/* Notes */}
                {crop.notes && (
                  <div className="mb-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
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
                      onClick={() => handleUpdateProgress(crop)}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors px-3 py-1 rounded-lg hover:bg-green-50"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">Update Progress</span>
                    </button>
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
          );
        })}
      </div>

      {filteredCrops.length === 0 && !loading && (
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
                      placeholder="e.g., Cherry Tomatoes"
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

              {/* Status and Health */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status and Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
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
                      value={formData.health}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Irrigation</label>
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
                </div>
              </div>

              {/* Progress and Yield */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress and Yield</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
                    <input
                      type="number"
                      name="progress"
                      value={formData.progress}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Yield (tons)</label>
                    <input
                      type="number"
                      name="expectedYield"
                      value={formData.expectedYield}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 5.2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Actual Yield (tons)</label>
                    <input
                      type="number"
                      name="actualYield"
                      value={formData.actualYield}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 4.8"
                    />
                  </div>
                </div>
              </div>

              {/* Cost Tracking */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Tracking ($)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seeds</label>
                    <input
                      type="number"
                      name="seedsCost"
                      value={formData.seedsCost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 150.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fertilizer</label>
                    <input
                      type="number"
                      name="fertilizerCost"
                      value={formData.fertilizerCost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 300.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pesticides</label>
                    <input
                      type="number"
                      name="pesticidesCost"
                      value={formData.pesticidesCost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 75.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Labor</label>
                    <input
                      type="number"
                      name="laborCost"
                      value={formData.laborCost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 500.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Other</label>
                    <input
                      type="number"
                      name="otherCost"
                      value={formData.otherCost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 100.00"
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
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditInputChange}
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
                    value={editFormData.health}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
                  <input
                    type="number"
                    name="progress"
                    value={editFormData.progress}
                    onChange={handleEditInputChange}
                    min="0"
                    max="100"
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

      {/* View Details Modal */}
      {showDetailsModal && selectedCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Crop Details - {selectedCrop.name}</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crop Name:</span>
                      <span className="font-medium">{selectedCrop.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Variety:</span>
                      <span className="font-medium">{selectedCrop.variety}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Field:</span>
                      <span className="font-medium">{selectedCrop.field}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="font-medium">{selectedCrop.area} acres</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCrop.status)}`}>
                        {selectedCrop.status.charAt(0).toUpperCase() + selectedCrop.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Planted Date:</span>
                      <span className="font-medium">{new Date(selectedCrop.plantedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Harvest:</span>
                      <span className="font-medium">{new Date(selectedCrop.expectedHarvest).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Days to Harvest:</span>
                      <span className="font-medium">{getDaysToHarvest(selectedCrop.expectedHarvest)} days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress and Health */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Growth Progress:</span>
                      <span className="font-medium">{selectedCrop.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${selectedCrop.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Health & Care</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Health Status:</span>
                      <div className="flex items-center space-x-2">
                        {getHealthIcon(selectedCrop.health)}
                        <span className={`font-medium ${getHealthColor(selectedCrop.health)}`}>
                          {selectedCrop.health.charAt(0).toUpperCase() + selectedCrop.health.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Irrigation:</span>
                      <span className="font-medium">{selectedCrop.irrigation.charAt(0).toUpperCase() + selectedCrop.irrigation.slice(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Yield Information */}
              {(selectedCrop.yield?.expected || selectedCrop.yield?.actual) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Yield Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCrop.yield?.expected && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected Yield:</span>
                        <span className="font-medium">{selectedCrop.yield.expected} tons</span>
                      </div>
                    )}
                    {selectedCrop.yield?.actual && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Actual Yield:</span>
                        <span className="font-medium">{selectedCrop.yield.actual} tons</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cost Breakdown */}
              {selectedCrop.costs && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Cost Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seeds:</span>
                      <span className="font-medium">${selectedCrop.costs.seeds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fertilizer:</span>
                      <span className="font-medium">${selectedCrop.costs.fertilizer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pesticides:</span>
                      <span className="font-medium">${selectedCrop.costs.pesticides}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Labor:</span>
                      <span className="font-medium">${selectedCrop.costs.labor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other:</span>
                      <span className="font-medium">${selectedCrop.costs.other}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-gray-900">
                        ${(selectedCrop.costs.seeds + selectedCrop.costs.fertilizer + selectedCrop.costs.pesticides + selectedCrop.costs.labor + selectedCrop.costs.other).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedCrop.notes && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedCrop.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Progress Modal */}
      {showProgressModal && progressCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Update Progress</h2>
              <button
                onClick={() => setShowProgressModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">{progressCrop.name}</h3>
                <p className="text-sm text-gray-600">Current progress: {progressCrop.progress}%</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Progress (%)</label>
                <input
                  type="number"
                  value={newProgress}
                  onChange={(e) => setNewProgress(e.target.value)}
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter new progress percentage"
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitProgressUpdate}
                  disabled={loading || !newProgress}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update'}
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
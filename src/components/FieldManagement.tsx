import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  Search,
  Ruler,
  Thermometer,
  Droplets,
  Zap,
  AlertTriangle,
  TrendingUp,
  Edit,
  Eye,
  X,
  Save,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Field {
  _id?: string;
  name: string;
  area: number;
  location: {
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    address: string;
  };
  soilType: string;
  soilPH: number;
  moisture: number;
  temperature: number;
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  currentCrop: string | null;
  status: 'active' | 'fallow' | 'preparation';
  lastTested: string;
  notes: string;
  irrigationSystem: 'drip' | 'sprinkler' | 'flood' | 'manual';
}

interface NewFieldForm {
  name: string;
  area: string;
  address: string;
  latitude: string;
  longitude: string;
  soilType: string;
  soilPH: string;
  moisture: string;
  temperature: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  currentCrop: string;
  status: 'active' | 'fallow' | 'preparation';
  notes: string;
  irrigationSystem: 'drip' | 'sprinkler' | 'flood' | 'manual';
}

const FieldManagement: React.FC = () => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);
  const [editFormData, setEditFormData] = useState<Field | null>(null);

  const [formData, setFormData] = useState<NewFieldForm>({
    name: '',
    area: '',
    address: '',
    latitude: '',
    longitude: '',
    soilType: '',
    soilPH: '',
    moisture: '',
    temperature: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    currentCrop: '',
    status: 'active',
    notes: '',
    irrigationSystem: 'manual'
  });

  // Fetch fields on component mount
  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    setLoading(true);
    // Mock data for demo
    setTimeout(() => {
      setFields([
        {
          _id: '1',
          name: 'North Field',
          area: 12.5,
          location: {
            address: '123 Farm Road, Demo City',
            coordinates: { latitude: 40.7128, longitude: -74.0060 }
          },
          soilType: 'Loamy',
          soilPH: 6.8,
          moisture: 65,
          temperature: 24,
          nutrients: {
            nitrogen: 75,
            phosphorus: 68,
            potassium: 82
          },
          currentCrop: 'Tomatoes',
          status: 'active',
          lastTested: new Date().toISOString(),
          notes: 'Excellent soil conditions',
          irrigationSystem: 'drip'
        },
        {
          _id: '2',
          name: 'South Field',
          area: 8.3,
          location: {
            address: '456 Farm Road, Demo City'
          },
          soilType: 'Clay Loam',
          soilPH: 7.2,
          moisture: 58,
          temperature: 22,
          nutrients: {
            nitrogen: 62,
            phosphorus: 71,
            potassium: 69
          },
          currentCrop: 'Corn',
          status: 'active',
          lastTested: new Date().toISOString(),
          notes: 'Good drainage, suitable for corn',
          irrigationSystem: 'sprinkler'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'fallow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparation': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNutrientLevel = (value: number) => {
    if (value >= 70) return { label: 'High', color: 'text-green-600' };
    if (value >= 50) return { label: 'Medium', color: 'text-yellow-600' };
    return { label: 'Low', color: 'text-red-600' };
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
      const newField = {
        name: formData.name,
        area: parseFloat(formData.area),
        location: {
          coordinates: formData.latitude && formData.longitude ? {
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude)
          } : undefined,
          address: formData.address
        },
        soilType: formData.soilType,
        soilPH: parseFloat(formData.soilPH),
        moisture: parseFloat(formData.moisture),
        temperature: parseFloat(formData.temperature),
        nutrients: {
          nitrogen: parseFloat(formData.nitrogen),
          phosphorus: parseFloat(formData.phosphorus),
          potassium: parseFloat(formData.potassium)
        },
        currentCrop: formData.currentCrop || null,
        status: formData.status,
        lastTested: new Date().toISOString(),
        notes: formData.notes,
        irrigationSystem: formData.irrigationSystem
      };

      await axios.post('/fields', newField, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchFields();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating field:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData || !editFormData._id) return;
    
    setLoading(true);
    try {
      await axios.put(`/fields/${editFormData._id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchFields();
      setShowEditModal(false);
      setEditFormData(null);
    } catch (error) {
      console.error('Error updating field:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fieldId: string) => {
    if (!window.confirm('Are you sure you want to delete this field?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`/fields/${fieldId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchFields();
    } catch (error) {
      console.error('Error deleting field:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      area: '',
      address: '',
      latitude: '',
      longitude: '',
      soilType: '',
      soilPH: '',
      moisture: '',
      temperature: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      currentCrop: '',
      status: 'active',
      notes: '',
      irrigationSystem: 'manual'
    });
  };

  const handleEdit = (field: Field) => {
    setEditFormData(field);
    setShowEditModal(true);
  };

  const filteredFields = fields.filter(field =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.soilType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (field.currentCrop && field.currentCrop.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Field Management</h1>
          <p className="text-gray-600 mt-1">Monitor soil conditions and manage field operations</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Field</span>
        </button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fields</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{fields.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Area</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{fields.reduce((sum, field) => sum + field.area, 0)} acres</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Ruler className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Fields</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{fields.filter(f => f.status === 'active').length}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Soil pH</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {fields.length > 0 ? (fields.reduce((sum, field) => sum + field.soilPH, 0) / fields.length).toFixed(1) : '0.0'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search fields, soil types, or crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fields...</p>
        </div>
      )}

      {/* Fields Grid */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFields.map((field) => (
            <div key={field._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{field.name}</h3>
                    <p className="text-gray-600">{field.area} acres • {field.soilType}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(field.status)}`}>
                    {field.status.charAt(0).toUpperCase() + field.status.slice(1)}
                  </span>
                </div>

                {field.currentCrop && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Current Crop: {field.currentCrop}</p>
                  </div>
                )}

                {/* Environmental Conditions */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Thermometer className="w-5 h-5 text-red-500" />
                      </div>
                      <p className="text-sm text-gray-600">Temperature</p>
                      <p className="text-lg font-semibold text-gray-900">{field.temperature}°C</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-sm text-gray-600">Moisture</p>
                      <p className="text-lg font-semibold text-gray-900">{field.moisture}%</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Zap className="w-5 h-5 text-purple-500" />
                      </div>
                      <p className="text-sm text-gray-600">pH Level</p>
                      <p className="text-lg font-semibold text-gray-900">{field.soilPH}</p>
                    </div>
                  </div>

                  {/* Nutrient Levels */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Nutrient Levels</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Nitrogen (N)</span>
                        <span className={`text-sm font-medium ${getNutrientLevel(field.nutrients.nitrogen).color}`}>
                          {field.nutrients.nitrogen}% ({getNutrientLevel(field.nutrients.nitrogen).label})
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${field.nutrients.nitrogen}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Phosphorus (P)</span>
                        <span className={`text-sm font-medium ${getNutrientLevel(field.nutrients.phosphorus).color}`}>
                          {field.nutrients.phosphorus}% ({getNutrientLevel(field.nutrients.phosphorus).label})
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${field.nutrients.phosphorus}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Potassium (K)</span>
                        <span className={`text-sm font-medium ${getNutrientLevel(field.nutrients.potassium).color}`}>
                          {field.nutrients.potassium}% ({getNutrientLevel(field.nutrients.potassium).label})
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${field.nutrients.potassium}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {field.notes && (
                  <div className="mb-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{field.notes}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    Last tested: {new Date(field.lastTested).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">View Map</span>
                    </button>
                    <button 
                      onClick={() => handleEdit(field)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(field._id!)}
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

      {!loading && filteredFields.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No fields found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Add Field Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Field</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Field Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., North Field"
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
                      placeholder="e.g., 12.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Field location address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="fallow">Fallow</option>
                      <option value="preparation">Preparation</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location Coordinates */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">GPS Coordinates (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      step="any"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 40.7128"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      step="any"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., -74.0060"
                    />
                  </div>
                </div>
              </div>

              {/* Soil Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Soil Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type *</label>
                    <select
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select soil type</option>
                      <option value="Clay">Clay</option>
                      <option value="Sandy">Sandy</option>
                      <option value="Loamy">Loamy</option>
                      <option value="Clay Loam">Clay Loam</option>
                      <option value="Sandy Loam">Sandy Loam</option>
                      <option value="Silt">Silt</option>
                      <option value="Silt Loam">Silt Loam</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soil pH *</label>
                    <input
                      type="number"
                      name="soilPH"
                      value={formData.soilPH}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="14"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 6.8"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Moisture (%)</label>
                    <input
                      type="number"
                      name="moisture"
                      value={formData.moisture}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 65"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                    <input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 24"
                    />
                  </div>
                </div>
              </div>

              {/* Nutrient Levels */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrient Levels (%)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nitrogen (N)</label>
                    <input
                      type="number"
                      name="nitrogen"
                      value={formData.nitrogen}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 75"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phosphorus (P)</label>
                    <input
                      type="number"
                      name="phosphorus"
                      value={formData.phosphorus}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 68"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Potassium (K)</label>
                    <input
                      type="number"
                      name="potassium"
                      value={formData.potassium}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 82"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Crop</label>
                    <input
                      type="text"
                      name="currentCrop"
                      value={formData.currentCrop}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Tomatoes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Irrigation System</label>
                    <select
                      name="irrigationSystem"
                      value={formData.irrigationSystem}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="manual">Manual</option>
                      <option value="drip">Drip</option>
                      <option value="sprinkler">Sprinkler</option>
                      <option value="flood">Flood</option>
                    </select>
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
                  placeholder="Any additional notes about this field..."
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
                  <span>{loading ? 'Adding...' : 'Add Field'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Field Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Field</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Crop</label>
                  <input
                    type="text"
                    name="currentCrop"
                    value={editFormData.currentCrop || ''}
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
                    <option value="active">Active</option>
                    <option value="fallow">Fallow</option>
                    <option value="preparation">Preparation</option>
                  </select>
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
                  <span>{loading ? 'Updating...' : 'Update Field'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldManagement;
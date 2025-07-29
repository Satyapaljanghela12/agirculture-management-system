import React, { useState, useEffect } from 'react';
import {
  Truck,
  Plus,
  Search,
  Settings,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  DollarSign,
  TrendingUp,
  Edit,
  Eye,
  X,
  Save,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Equipment {
  _id?: string;
  name: string;
  type: string;
  model: string;
  year: number;
  status: 'active' | 'maintenance' | 'repair' | 'retired';
  location: string;
  hoursUsed: number;
  lastMaintenance: string;
  nextMaintenance: string;
  fuelLevel?: number;
  maintenanceCost: number;
  notes: string;
  purchaseDate?: string;
  purchasePrice?: number;
  serialNumber?: string;
}

interface NewEquipmentForm {
  name: string;
  type: string;
  model: string;
  year: string;
  status: 'active' | 'maintenance' | 'repair' | 'retired';
  location: string;
  hoursUsed: string;
  lastMaintenance: string;
  nextMaintenance: string;
  fuelLevel: string;
  maintenanceCost: string;
  notes: string;
  purchaseDate: string;
  purchasePrice: string;
  serialNumber: string;
}

const EquipmentManagement: React.FC = () => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<Equipment | null>(null);

  const [formData, setFormData] = useState<NewEquipmentForm>({
    name: '',
    type: '',
    model: '',
    year: '',
    status: 'active',
    location: '',
    hoursUsed: '0',
    lastMaintenance: new Date().toISOString().split('T')[0],
    nextMaintenance: '',
    fuelLevel: '',
    maintenanceCost: '0',
    notes: '',
    purchaseDate: '',
    purchasePrice: '',
    serialNumber: ''
  });

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setLoading(true);
    // Mock data for demo
    setTimeout(() => {
      setEquipment([
        {
          _id: '1',
          name: 'Main Tractor',
          type: 'Tractor',
          model: 'John Deere 6120M',
          year: 2020,
          status: 'active',
          location: 'Equipment Shed A',
          hoursUsed: 1247,
          lastMaintenance: '2024-01-01',
          nextMaintenance: '2024-02-01',
          fuelLevel: 78,
          maintenanceCost: 2450,
          notes: 'Regular maintenance required'
        },
        {
          _id: '2',
          name: 'Irrigation Pump',
          type: 'Irrigation',
          model: 'AquaFlow 2000',
          year: 2019,
          status: 'maintenance',
          location: 'Pump House',
          hoursUsed: 3200,
          lastMaintenance: '2024-01-10',
          nextMaintenance: '2024-01-25',
          maintenanceCost: 850,
          notes: 'Scheduled maintenance in progress'
        }
      ]);
      setLoading(false);
    }, 1000);
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
      const newEquipment = {
        name: formData.name,
        type: formData.type,
        model: formData.model,
        year: parseInt(formData.year),
        status: formData.status,
        location: formData.location,
        hoursUsed: parseFloat(formData.hoursUsed),
        lastMaintenance: formData.lastMaintenance,
        nextMaintenance: formData.nextMaintenance,
        fuelLevel: formData.fuelLevel ? parseFloat(formData.fuelLevel) : undefined,
        maintenanceCost: parseFloat(formData.maintenanceCost),
        notes: formData.notes,
        purchaseDate: formData.purchaseDate || undefined,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
        serialNumber: formData.serialNumber || undefined
      };

      await axios.post('/equipment', newEquipment, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchEquipment();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData || !editFormData._id) return;
    
    setLoading(true);
    try {
      await axios.put(`/equipment/${editFormData._id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchEquipment();
      setShowEditModal(false);
      setEditFormData(null);
    } catch (error) {
      console.error('Error updating equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (equipmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`/equipment/${equipmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchEquipment();
    } catch (error) {
      console.error('Error deleting equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      model: '',
      year: '',
      status: 'active',
      location: '',
      hoursUsed: '0',
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: '',
      fuelLevel: '',
      maintenanceCost: '0',
      notes: '',
      purchaseDate: '',
      purchasePrice: '',
      serialNumber: ''
    });
  };

  const handleEdit = (item: Equipment) => {
    setEditFormData(item);
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'repair': return 'bg-red-100 text-red-800 border-red-200';
      case 'retired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'maintenance': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'repair': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'retired': return <Settings className="w-4 h-4 text-gray-600" />;
      default: return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  const isMaintenanceDue = (nextMaintenance: string) => {
    const dueDate = new Date(nextMaintenance);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
          <p className="text-gray-600 mt-1">Track and maintain your farm equipment</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add Equipment</span>
        </button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Equipment</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{equipment.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Units</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{equipment.filter(e => e.status === 'active').length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance Due</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{equipment.filter(e => isMaintenanceDue(e.nextMaintenance)).length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance Cost</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${equipment.reduce((sum, e) => sum + e.maintenanceCost, 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
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
              placeholder="Search equipment, model, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="repair">Repair</option>
              <option value="retired">Retired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEquipment.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600">{item.model} ({item.year})</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                  <span>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium text-gray-900">{item.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{item.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hours Used</p>
                  <p className="font-medium text-gray-900">{item.hoursUsed.toLocaleString()} hrs</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Maintenance Cost</p>
                  <p className="font-medium text-gray-900">${item.maintenanceCost.toLocaleString()}</p>
                </div>
              </div>

              {/* Fuel Level (if applicable) */}
              {item.fuelLevel && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Fuel Level</span>
                    <span className="text-sm font-medium text-gray-900">{item.fuelLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        item.fuelLevel > 50 ? 'bg-green-500' : 
                        item.fuelLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.fuelLevel}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Maintenance Schedule */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wrench className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Last Maintenance</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{new Date(item.lastMaintenance).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Next Maintenance</span>
                  </div>
                  <span className={`text-sm font-medium ${isMaintenanceDue(item.nextMaintenance) ? 'text-red-600' : 'text-gray-900'}`}>
                    {new Date(item.nextMaintenance).toLocaleDateString()}
                    {isMaintenanceDue(item.nextMaintenance) && (
                      <span className="ml-1 text-red-600">⚠️</span>
                    )}
                  </span>
                </div>
              </div>

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
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">View Details</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors px-3 py-1 rounded-lg hover:bg-green-50">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Schedule</span>
                  </button>
                  <button 
                    onClick={() => handleEdit(item)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id!)}
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

      {filteredEquipment.length === 0 && !loading && (
        <div className="text-center py-12">
          <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Equipment</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Main Tractor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select type</option>
                      <option value="Tractor">Tractor</option>
                      <option value="Harvester">Harvester</option>
                      <option value="Planting">Planting Equipment</option>
                      <option value="Irrigation">Irrigation System</option>
                      <option value="Sprayer">Sprayer</option>
                      <option value="Cultivator">Cultivator</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., John Deere 6120M"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 2020"
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
                      <option value="maintenance">Maintenance</option>
                      <option value="repair">Repair</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Equipment Shed A"
                    />
                  </div>
                </div>
              </div>

              {/* Usage Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hours Used</label>
                    <input
                      type="number"
                      name="hoursUsed"
                      value={formData.hoursUsed}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 1247"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Level (%)</label>
                    <input
                      type="number"
                      name="fuelLevel"
                      value={formData.fuelLevel}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 78"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Maintenance</label>
                    <input
                      type="date"
                      name="lastMaintenance"
                      value={formData.lastMaintenance}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Next Maintenance *</label>
                    <input
                      type="date"
                      name="nextMaintenance"
                      value={formData.nextMaintenance}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Cost ($)</label>
                    <input
                      type="number"
                      name="maintenanceCost"
                      value={formData.maintenanceCost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 2450"
                    />
                  </div>
                </div>
              </div>

              {/* Purchase Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Information (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price ($)</label>
                    <input
                      type="number"
                      name="purchasePrice"
                      value={formData.purchasePrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 85000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., JD123456789"
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
                  placeholder="Any additional notes about this equipment..."
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
                  <span>{loading ? 'Adding...' : 'Add Equipment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Equipment Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Equipment</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name</label>
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
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="repair">Repair</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hours Used</label>
                  <input
                    type="number"
                    name="hoursUsed"
                    value={editFormData.hoursUsed}
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
                  <span>{loading ? 'Updating...' : 'Update Equipment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentManagement;
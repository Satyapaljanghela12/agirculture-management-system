import React, { useState } from 'react';
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
  Eye
} from 'lucide-react';

interface Equipment {
  id: string;
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
}

const EquipmentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [equipment] = useState<Equipment[]>([
    {
      id: '1',
      name: 'Main Tractor',
      type: 'Tractor',
      model: 'John Deere 6120M',
      year: 2020,
      status: 'active',
      location: 'Field A',
      hoursUsed: 1247,
      lastMaintenance: '2024-04-15',
      nextMaintenance: '2024-06-15',
      fuelLevel: 78,
      maintenanceCost: 2450,
      notes: 'Regular maintenance up to date'
    },
    {
      id: '2',
      name: 'Combine Harvester',
      type: 'Harvester',
      model: 'Case IH Axial-Flow 250',
      year: 2019,
      status: 'maintenance',
      location: 'Equipment Shed',
      hoursUsed: 892,
      lastMaintenance: '2024-05-10',
      nextMaintenance: '2024-05-20',
      maintenanceCost: 3200,
      notes: 'Scheduled maintenance in progress'
    },
    {
      id: '3',
      name: 'Irrigation System Alpha',
      type: 'Irrigation',
      model: 'Valley 8000 Series',
      year: 2021,
      status: 'active',
      location: 'Field B',
      hoursUsed: 2156,
      lastMaintenance: '2024-03-20',
      nextMaintenance: '2024-07-20',
      maintenanceCost: 1200,
      notes: 'Running efficiently'
    },
    {
      id: '4',
      name: 'Seeder Unit',
      type: 'Planting',
      model: 'Great Plains 3S-3000HD',
      year: 2018,
      status: 'repair',
      location: 'Repair Shop',
      hoursUsed: 567,
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-06-01',
      maintenanceCost: 850,
      notes: 'Hydraulic system needs repair'
    }
  ]);

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
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-sm">
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
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default EquipmentManagement;
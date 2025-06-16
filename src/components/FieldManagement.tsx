import React, { useState } from 'react';
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
  Eye
} from 'lucide-react';

interface Field {
  id: string;
  name: string;
  area: number;
  location: string;
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
}

const FieldManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const [fields] = useState<Field[]>([
    {
      id: '1',
      name: 'Field A - North Pasture',
      area: 12.5,
      location: '40.7128° N, 74.0060° W',
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
      lastTested: '2024-05-15',
      notes: 'Excellent drainage, high organic matter content'
    },
    {
      id: '2',
      name: 'Field B - South Valley',
      area: 8.3,
      location: '40.7130° N, 74.0058° W',
      soilType: 'Clay Loam',
      soilPH: 7.2,
      moisture: 58,
      temperature: 23,
      nutrients: {
        nitrogen: 62,
        phosphorus: 71,
        potassium: 59
      },
      currentCrop: 'Corn',
      status: 'active',
      lastTested: '2024-05-12',
      notes: 'Needs nitrogen supplementation'
    },
    {
      id: '3',
      name: 'Field C - East Ridge',
      area: 15.7,
      location: '40.7125° N, 74.0062° W',
      soilType: 'Sandy Loam',
      soilPH: 6.5,
      moisture: 42,
      temperature: 25,
      nutrients: {
        nitrogen: 45,
        phosphorus: 55,
        potassium: 48
      },
      currentCrop: 'Wheat',
      status: 'active',
      lastTested: '2024-05-10',
      notes: 'Low moisture retention, requires frequent irrigation'
    },
    {
      id: '4',
      name: 'Field D - West Slope',
      area: 6.2,
      location: '40.7132° N, 74.0055° W',
      soilType: 'Clay',
      soilPH: 7.8,
      moisture: 72,
      temperature: 22,
      nutrients: {
        nitrogen: 58,
        phosphorus: 64,
        potassium: 71
      },
      currentCrop: null,
      status: 'preparation',
      lastTested: '2024-05-08',
      notes: 'Being prepared for soybean planting'
    }
  ]);

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
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-sm">
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
              <p className="text-2xl font-bold text-gray-900 mt-1">{(fields.reduce((sum, field) => sum + field.soilPH, 0) / fields.length).toFixed(1)}</p>
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

      {/* Fields Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFields.map((field) => (
          <div key={field.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFields.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No fields found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default FieldManagement;
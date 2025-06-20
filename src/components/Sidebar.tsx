import React from 'react';
import { 
  Home, 
  Sprout, 
  MapPin, 
  Cloud, 
  Truck, 
  DollarSign, 
  CheckSquare, 
  Package,
  BarChart3,
  Settings,
  User,
  LogOut,
  MapPin as LocationIcon,
  Phone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'crops', label: 'Crops', icon: Sprout },
    { id: 'fields', label: 'Fields', icon: MapPin },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'equipment', label: 'Equipment', icon: Truck },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-80 bg-gradient-to-b from-green-900 via-green-800 to-green-900 text-white h-screen flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-green-700/50">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-green-600 rounded-xl shadow-lg">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AgriManage</h1>
            <p className="text-green-300 text-sm font-medium">Farm Management System</p>
          </div>
        </div>
      </div>

      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-green-800">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    activeSection === item.id
                      ? 'bg-green-600 text-white shadow-lg transform scale-105'
                      : 'text-green-200 hover:bg-green-700/50 hover:text-white hover:transform hover:scale-102'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${
                    activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {activeSection === item.id && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Footer Actions */}
      <div className="p-4 border-t border-green-700/50 bg-green-800/30">
        <div className="space-y-2">
          <button 
            onClick={() => setActiveSection('settings')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-green-200 hover:bg-green-700/50 hover:text-white rounded-xl transition-all duration-300 group"
          >
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-green-200 hover:bg-red-600/80 hover:text-white rounded-xl transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
        
        {/* Last Login Info */}
        <div className="mt-4 pt-4 border-t border-green-700/30">
          <p className="text-xs text-green-400 text-center">
            Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Today'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
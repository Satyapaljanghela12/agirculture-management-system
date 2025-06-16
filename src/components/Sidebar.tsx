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
  LogOut
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
    <div className="w-64 bg-green-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-green-800">
        <div className="flex items-center space-x-3">
          <Sprout className="w-8 h-8 text-green-400" />
          <div>
            <h1 className="text-xl font-bold">AgriManage</h1>
            <p className="text-green-300 text-sm">{user?.farmName}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-green-700 text-white shadow-lg'
                      : 'text-green-300 hover:bg-green-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-green-800">
        <div className="flex items-center space-x-3 px-4 py-3 mb-2">
          <User className="w-5 h-5 text-green-400" />
          <div>
            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-green-400 text-sm capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-green-300 hover:bg-green-800 hover:text-white rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
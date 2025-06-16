import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AuthWrapper from './components/auth/AuthWrapper';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CropManagement from './components/CropManagement';
import FieldManagement from './components/FieldManagement';
import WeatherMonitoring from './components/WeatherMonitoring';
import EquipmentManagement from './components/EquipmentManagement';
import FinanceManagement from './components/FinanceManagement';
import TaskManagement from './components/TaskManagement';
import InventoryManagement from './components/InventoryManagement';
import Reports from './components/Reports';

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'crops':
        return <CropManagement />;
      case 'fields':
        return <FieldManagement />;
      case 'weather':
        return <WeatherMonitoring />;
      case 'equipment':
        return <EquipmentManagement />;
      case 'finance':
        return <FinanceManagement />;
      case 'tasks':
        return <TaskManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-auto scroll-smooth">
        <div className="fade-in">
          {renderActiveSection()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthWrapper>
        <AppContent />
      </AuthWrapper>
    </AuthProvider>
  );
}

export default App;
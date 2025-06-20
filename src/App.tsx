import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AuthWrapper from './components/auth/AuthWrapper';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CropManagement from './components/CropManagement';
import FieldManagement from './components/FieldManagement';
import WeatherDashboard from './components/WeatherDashboard';
import EquipmentManagement from './components/EquipmentManagement';
import FinanceManagement from './components/FinanceManagement';
import TaskManagement from './components/TaskManagement';
import InventoryManagement from './components/InventoryManagement';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Chatbot from './components/Chatbot';
import { MessageCircle } from 'lucide-react';

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    // Listen for navigation events from dashboard quick actions
    const handleNavigation = (event: any) => {
      if (event.type === 'navigateToInventory') {
        setActiveSection('inventory');
      } else if (event.type === 'navigateToSettings') {
        setActiveSection('settings');
      } else if (event.type === 'openAddCropModal') {
        setActiveSection('crops');
        // Trigger add crop modal in crop management
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('openCropModal'));
        }, 100);
      }
    };

    window.addEventListener('navigateToInventory', handleNavigation);
    window.addEventListener('navigateToSettings', handleNavigation);
    window.addEventListener('openAddCropModal', handleNavigation);

    return () => {
      window.removeEventListener('navigateToInventory', handleNavigation);
      window.removeEventListener('navigateToSettings', handleNavigation);
      window.removeEventListener('openAddCropModal', handleNavigation);
    };
  }, []);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'crops':
        return <CropManagement />;
      case 'fields':
        return <FieldManagement />;
      case 'weather':
        return <WeatherDashboard />;
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
      case 'settings':
        return <Settings />;
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
      
      {/* Chatbot Toggle Button */}
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      
      {/* Chatbot Component */}
      <Chatbot 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
      />
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
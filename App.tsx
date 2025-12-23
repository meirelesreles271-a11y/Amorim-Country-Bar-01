import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Role } from './types';

// Pages
import Login from './pages/Login';
import WaiterDashboard from './pages/WaiterDashboard';
import KitchenDisplay from './pages/KitchenDisplay';
import CashierDashboard from './pages/CashierDashboard';
import DigitalMenu from './pages/DigitalMenu';

const AppContent = () => {
  const { userRole } = useApp();

  // Simple Router based on Role
  const renderContent = () => {
    switch (userRole) {
      case Role.WAITER:
        return <WaiterDashboard />;
      case Role.KITCHEN:
        return <KitchenDisplay />;
      case Role.CASHIER:
      case Role.ADMIN:
        return <CashierDashboard />;
      case Role.CUSTOMER:
        return <DigitalMenu />;
      case Role.NONE:
      default:
        return <Login />;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

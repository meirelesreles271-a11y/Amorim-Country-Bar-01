import React from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { LogOut } from 'lucide-react';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { userRole, setUserRole } = useApp();

  if (userRole === Role.NONE) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar for Staff only, Customer view is separate */}
      {userRole !== Role.CUSTOMER && (
        <header className="bg-gray-900 text-white p-3 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <div className="font-bold text-brand-500">AMORIM POS</div>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
              {userRole}
            </span>
          </div>
          <button 
            onClick={() => setUserRole(Role.NONE)}
            className="text-gray-400 hover:text-white flex items-center gap-1 text-sm"
          >
            <LogOut size={16} /> Sair
          </button>
        </header>
      )}
      <main className="flex-1 relative">
        {children}
      </main>
    </div>
  );
};
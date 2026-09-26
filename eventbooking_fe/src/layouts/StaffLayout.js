import React, { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import StaffSidebar from '../components/staff/StaffSidebar';
import StaffHeader from '../components/staff/StaffHeader';
import Notification from '../components/common/Notification';

export const StaffToastContext = createContext(null);

const StaffLayout = () => {
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toast = {
    success: (msg) => {
      const id = Date.now();
      setToasts((p) => [...p, { id, type: 'success', message: msg }]);
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
    },
    error: (msg) => {
      const id = Date.now();
      setToasts((p) => [...p, { id, type: 'error', message: msg }]);
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
    },
  };

  return (
    <StaffToastContext.Provider value={toast}>
      <div className="min-h-screen bg-slate-50 flex overflow-hidden">
        <StaffSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0">
          <StaffHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 admin-scroll">
            <Outlet />
          </main>
        </div>
        {toasts.length > 0 && 
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map(t => <div key={t.id} className={`p-4 rounded shadow-lg ${t.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>{t.message}</div>)}
          </div>
        }
      </div>
    </StaffToastContext.Provider>
  );
};

export default StaffLayout;

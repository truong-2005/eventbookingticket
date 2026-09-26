import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/client/Navbar';
import Footer from '../components/client/Footer';

const ClientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;

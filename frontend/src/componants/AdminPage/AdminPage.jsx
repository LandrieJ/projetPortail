import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header fixé en haut */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar fixe à gauche */}
        <Sidebar />
        
   
        <main className="flex-1 p-6 bg-gray-100 ml-60">
        
          <Outlet />  {/* Affiche le contenu des sous-routes */}
        </main>
      </div>
    </div>
  );
}

export default AdminPage;

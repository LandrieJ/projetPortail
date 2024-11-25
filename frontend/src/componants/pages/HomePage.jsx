import React from 'react';

import Heros from './Heros';
import ListProduct from './ListProduct';
import ActualiterPage from '../AdminPage/ActualiterPage';
// import ActualiterPage from './ActualiterPage';

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Heros />
      <main className="flex-grow p-6">
        <ListProduct />
       <ActualiterPage/>  
      </main>
    </div>
  );
}

export default HomePage;

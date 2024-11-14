import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-2">
      <div className="container mx-auto px-3">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          {/* Section de contact */}
          <div className="mb-4 sm:mb-0">
            <h2 className="text-lg font-semibold">Contact</h2>
            <p className="text-gray-400">Téléphone: +261 38 30 818 30</p>
            <p className="text-gray-400">Email: pac.mg</p>
          </div>
          
          {/* Section des crédits */}
          <div>
            <p className="text-center text-gray-400">
              &copy; {new Date().getFullYear()} Votre Société. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

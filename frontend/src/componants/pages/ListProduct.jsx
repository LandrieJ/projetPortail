import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_IMG = import.meta.env.VITE_API_BASE_IMG;

function ListProduct() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [materiels, setMateriels] = useState([]);
  const [filteredMateriels, setFilteredMateriels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearchInput, setShowSearchInput] = useState(false); // Gestion de l'état pour l'affichage de l'input
  const location = useLocation();
  const jwt_access = localStorage.getItem('jwt_access');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/materiels${location.search}`, {
        headers: {
          "Authorization": `Bearer ${jwt_access}`
        }
      });
      if (response.data && Array.isArray(response.data.items)) {
        setMateriels(response.data.items);
        setFilteredMateriels(response.data.items);
      } else {
        setMateriels([]);
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la récupération des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const filtered = materiels.filter((materiel) =>
      materiel.nom.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setFilteredMateriels(filtered);
  }, [debouncedSearchTerm, materiels]);

  return (
    <div className="p-4 bg-gray-100 min-h-screen w-full">
      {/* Section du message d'assistance */}
      <div className="text-center mb-4">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 animate-translate">
          Pour toute assistance ou renseignement, veuillez contacter le numéro +261 38 30 000 11 ou +261 32 05 222 05
        </h1>
      </div>

      {/* Section de la recherche et du titre */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="text-center sm:text-left flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
            Tous les listes d'application utilisées
          </h3>
        </div>

        {/* Barre de recherche */}
        <div 
          className="relative flex-1 max-w-full sm:max-w-md mx-auto sm:mx-0"
          onMouseEnter={() => setShowSearchInput(true)}  // Affiche l'input quand la souris survole
          onMouseLeave={() => setShowSearchInput(false)}  // Cache l'input quand la souris quitte
        >
          {showSearchInput ? (
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Rechercher un produit..."
              className="p-2 pl-10 w-full border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all duration-300 ease-in-out"
            />
          ) : (
            <FaSearch className="text-gray-400 text-xl cursor-pointer" />
          )}
        </div>
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="text-center">
          <p>Chargement...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
          {filteredMateriels.length > 0 ? (
            filteredMateriels.map((materiel) => (
              <div key={materiel.id} className="flex flex-col items-center p-3  rounded-s-full shadow-transparent transition-transform transform hover:scale-105">
                <a href={materiel.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={materiel.image ? `${API_BASE_IMG}${materiel.image}` : 'https://via.placeholder.com/150'}
                    alt={materiel.nom}
                    className="w-[120px] h-[100px] object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                  <p className="mt-2 text-center text-sm font-medium text-gray-700 underline">
                    {materiel.nom}
                  </p>
                </a>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">Aucun produit trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ListProduct;

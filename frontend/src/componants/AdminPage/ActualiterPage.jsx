import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../../redux/action/auth.action';
import UpdateAct from './UpdateAct';
import DelletAct from './DelletAct'; 
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import ModalImage from './ModalImage';
import ModalActualite from './ModalActualite';

function ActualiterPage() {
  const jwt_access = localStorage.getItem('jwt_access');
  const dispatch = useDispatch();
  const location = useLocation();
  const { me } = useSelector(state => state.auth);
  const [actualites, setActualites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedActualite, setSelectedActualite] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  // Fetch des actualités
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/actualite${location.search}`, {
        headers: { Authorization: `Bearer ${jwt_access}` },
      });
      setActualites(response.data.items || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      if (error.response && error.response.status === 401) {
        dispatch(logout(location.pathname + location.search));
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  const handleEdit = async (updatedActualite) => {
    if (selectedActualite) {
      try {
        await axios.put(`http://localhost:5000/api/v1/actualite/${selectedActualite.id}`, updatedActualite, {
          headers: { Authorization: `Bearer ${jwt_access}` },
        });
        fetchData();
        setShowUpdateModal(false);
      } catch (error) {
        console.error('Erreur lors de la modification :', error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/actualite/${id}`, {
        headers: { "Authorization": `Bearer ${jwt_access}` }
      });
      fetchData(); 
      setShowDeleteModal(false); 
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  // Fonction pour déterminer la couleur de fond
  const getBackgroundColor = (titre) => {
    switch (titre) {
      case 'DCN':
        return 'bg-gray-400'; // Gris
      case 'Pac Antananarivo':
        return 'bg-blue-500'; // Bleu
      case 'Pac Fianarantsoa':
        return 'bg-green-500'; // Vert
      case 'Pac Majunga':
        return 'bg-red-500'; // Rouge
      default:
        return 'bg-white'; // Couleur par défaut
    }
  };

  // Rendu des actualités
  const renderActualites = () => {
    return actualites.map((actualite) => (
      <div key={actualite.id} className="py-10 flex justify-center items-center min-h-[200px]">
        <div 
          className={`flex flex-col items-center w-full max-w-md justify-center p-6 border-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 ${getBackgroundColor(actualite.titre)}`}
          onMouseEnter={() => setHoveredId(actualite.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <h2 className="font-semibold text-xl text-center mb-4 text-white">
            {actualite.titre}
          </h2>

          {actualite.imgUrl && (
            <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 xl:h-96 2xl:h-[400px] mb-8">
              <img
                src={`http://localhost:5000/uploads/${actualite.imgUrl}`}
                alt="Actualité"
                className="w-full h-64 object-cover rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                onClick={() => {
                  setSelectedImage(`http://localhost:5000/uploads/${actualite.imgUrl}`);
                  setShowImageModal(true);
                }}
              />

              {me?.role === 'admin' && hoveredId === actualite.id && (
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedActualite(actualite);
                      setShowUpdateModal(true);
                    }}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-300 transition-colors duration-200"
                  >
                    <FaEdit className="mr-2" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedActualite(actualite);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                  >
                    <FaTrash className="mr-2" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="h-100 min-h-full sm:h-200 xl:h-96 2xl:h-[400px] w-full">
      <div className="mb-2 flex justify-center items-center flex-col text-center">
        <div className={`flex ${me?.role === 'admin' ? 'justify-between w-full' : 'justify-center w-full'}`}>
          <h2 className="text-2xl font-semibold mb-4">Liste des Actualités</h2>
          {me?.role === 'admin' && (
            <button 
              onClick={() => setShowModal(true)} 
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              <FaPlus />
            </button>
          )}
        </div>
      </div>

      {/* Section des actualités */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 place-items-center items-center">
        {renderActualites()}
      </div>

      {showModal && (
        <ModalActualite
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          fetchActualites={fetchData}
        />
      )}

      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
            <UpdateAct 
              actualiteData={selectedActualite}
              onUpdate={handleEdit} 
              onClose={() => setShowUpdateModal(false)} 
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
            <DelletAct 
              actualiteData={selectedActualite}
              onDelete={handleDelete} 
              onClose={() => setShowDeleteModal(false)} 
            />
          </div>
        </div>
      )}

      {showImageModal && (
        <ModalImage 
          isOpen={showImageModal} 
          onRequestClose={() => setShowImageModal(false)} 
          imageSrc={selectedImage} 
        />
      )}
    </div>
  );
}

export default ActualiterPage;

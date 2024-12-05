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
import CardActualite from './CardActualite';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_IMG = import.meta.env.VITE_API_BASE_IMG;

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


  // Fetch des actualités
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/actualite${location.search}`, {
        headers: { Authorization: `Bearer ${jwt_access}` },
        
      });
      console.log(jwt_access)
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
        await axios.put(`${API_BASE_URL}/actualite/${selectedActualite.id}`, updatedActualite, {
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
      await axios.delete(`${API_BASE_URL}/actualite/${id}`, {
        headers: { "Authorization": `Bearer ${jwt_access}` }
      });
      fetchData(); 
      setShowDeleteModal(false); 
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  // Fonction pour déterminer la couleur de fond

  // Rendu des actualités
  const renderActualites = () => {
    return actualites.map((actualite) => (<CardActualite actualite={actualite} setShowUpdateModal={setShowUpdateModal} setShowDeleteModal={setShowDeleteModal} setSelectedActualite={setSelectedActualite}/>)
    );
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

 
        
  
    </div>
  );
}

export default ActualiterPage;

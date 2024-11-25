import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { useDispatch } from 'react-redux'; // Assurez-vous d'importer useDispatch
// import { logout } from './path_to_your_actions'; // Remplacez par le bon chemin
// import { logout } from '../../redux/action/auth.action';
function DelletAct({ actualiteData, onDelete, onClose }) {
  const jwt_access = localStorage.getItem('jwt_access');
  const [id, setId] = useState(actualiteData?.id || null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const dispatch = useDispatch();

  const handleClose = () => {
    setSuccessMessage('');
    onClose();
  };

  useEffect(() => {
    if (actualiteData) {
      setId(actualiteData.id);
    }
  }, [actualiteData]);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/actualite/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt_access}`
        }
      });
      setSuccessMessage('Actualité supprimée avec succès !');
      onDelete(id);  // Appel de la fonction pour mettre à jour la liste après suppression
      setTimeout(() => {
        setSuccessMessage('');
        handleClose();
        // dispatch(logout()); // Assurez-vous que cette action est nécessaire ici
      }, 1500);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setSuccessMessage('Erreur lors de la suppression.'); // Afficher un message d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
        <p className="mb-4">Êtes-vous sûr de vouloir supprimer l'actualité : <strong>{actualiteData?.titre}</strong> ?</p>
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>} {/* Affichage du message de succès */}
        <div className="flex justify-between mt-4">
          <button 
            onClick={handleDelete} 
            className={`bg-red-500 text-white py-2 px-4 rounded transition duration-300 hover:bg-red-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={isLoading}
          >
            {isLoading ? 'Suppression...' : 'Confirmer'}
          </button>
          <button 
            onClick={handleClose} 
            className="bg-gray-500 text-white py-2 px-4 rounded transition duration-300 hover:bg-gray-600"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export default DelletAct;

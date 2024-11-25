import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function DelletApp({ isOpen, onClose, materielData, deleteMateriel }) {
  const jwt_access = localStorage.getItem('jwt_access');
  const [id, setId] = useState(materielData?.id || null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setSuccessMessage('');
    onClose();
  };
  useEffect(() => {
    setId(materielData?.id);
  }, [materielData?.id]);

  const handleDelete = async () => {
    setIsLoading(true); 
    try {
      await axios.delete(`${API_BASE_URL}/materiels/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + jwt_access
        }
      });
      setSuccessMessage('Matériel supprimé avec succès !');
      deleteMateriel(id);  // Mise à jour après suppression
      setTimeout(() => {
        setSuccessMessage('');
        handleClose();
      }, 1500);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md">
        <h2 className="text-lg font-bold mb-4">Supprimer le matériel</h2>
        <p>Êtes-vous sûr de vouloir supprimer le matériel : <strong>{materielData?.nom}</strong> ?</p>
        <div className="mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            disabled={isLoading}
          >
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </button>
          <button onClick={handleClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Annuler
          </button>
        </div>
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      </div>
    </div>
  );
}

export default DelletApp;

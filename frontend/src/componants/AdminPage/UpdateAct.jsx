import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { getMe } from '../../redux/action/auth.action';
import { Circles } from 'react-loader-spinner';  // Import du spinner

function UpdateAct({ actualiteData, onClose, onUpdate }) {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.auth);
  const location = useLocation();
  const jwt_access = localStorage.getItem('jwt_access');

  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);  // État de chargement

  useEffect(() => {
    if (actualiteData) {
      setTitre(actualiteData.titre || '');
      setContenu(actualiteData.contenu || '');
      setImage(null);
    }
  }, [actualiteData]);

  const handleClose = () => {
    setSuccessMessage('');
    setError(null);
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      setError('Seuls les fichiers d\'image sont autorisés.');
      setImage(null);
    } else {
      setError(null);
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!actualiteData) {
      console.error("Données d'actualité manquantes");
      return;
    }
    setError(null);
    setLoading(true);  // Active le loader au début du processus

    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('contenu', contenu);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.put(`http://localhost:5000/api/v1/actualite/${actualiteData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${jwt_access}`,
        },
      });

      setSuccessMessage('Actualité modifiée avec succès !');
      if (onUpdate) onUpdate();

      if (actualiteData.id === me.id) {
        dispatch(getMe(location.pathname + location.search));
      }

      setTimeout(() => {
        setLoading(false);  // Désactive le loader après 60 secondes
      }, 60000);  // Délai de 60 secondes (1 minute) avant d'arrêter le loader

    } catch (err) {
      setLoading(false);  // Désactive le loader en cas d'erreur
      if (err.response) {
        setError(err.response.data.message || 'Une erreur s\'est produite lors de la mise à jour.');
      } else {
        setError('Erreur de réseau.');
      }
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Modifier l'Actualité</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Titre</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
            className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Contenu</label>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
            className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Image</label>
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="border border-gray-300 rounded w-full p-2" 
          />
          {error && <p className="text-red-500 mt-1">{error}</p>}
        </div>
        <div className='flex justify-between mt-4'>
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded transition duration-300 hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <Circles 
                height="25"
                width="25"
                color="#fff"
                ariaLabel="loading"
              />
            ) : 'Modifier'}
          </button>
          <button 
            onClick={handleClose} 
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateAct;

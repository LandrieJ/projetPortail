import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/action/auth.action';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ModalActualite = ({ isOpen, onRequestClose, fetchActualites }) => {
  const jwt_access = localStorage.getItem('jwt_access');
  const dispatch = useDispatch();

  const [contenu, setContenu] = useState('');
  const [titre, setTitre] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);

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

  const handleAddActualite = async (e) => {
    e.preventDefault();
    setLoader(true);
    setError(null);

    const formData = new FormData();
    formData.append('contenu', contenu);
    formData.append('titre', titre);
    if (image) formData.append('image', image);

    try {
      await axios.post(`${API_BASE_URL}/actualite`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${jwt_access}`,
        },
      });

      fetchActualites(); // Rafraîchissement des données
      onRequestClose(); // Fermeture de la modal
    } catch (err) {
      if (err.response && err.response.status === 401) {
        dispatch(logout()); // Gestion de l'expiration du token
      } else {
        setError(err.response?.data?.errors || 'Erreur lors de l\'envoi des données.');
      }
    } finally {
      setLoader(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onRequestClose}>
      <div
        className="bg-white rounded-lg p-6 w-11/12 md:w-1/3 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl mb-4">Ajouter une Actualité</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleAddActualite}>
          <div className="mb-4">
            <label className="block mb-2">Titre :</label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
              className="border rounded-lg p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Contenu :</label>
            <textarea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              required
              className="border rounded-lg p-2 w-full h-32"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Image :</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="border rounded-lg p-2 w-full"
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <div className="flex justify-between mt-4">
            <button 
              type="submit" 
              className={`bg-blue-500 text-white py-2 px-4 rounded ${loader ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loader}
            >
              {loader ? 'Envoi...' : 'Ajouter'}
            </button>
            <button 
              className="bg-red-500 text-white py-2 px-4 rounded" 
              onClick={onRequestClose}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalActualite;

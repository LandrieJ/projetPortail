import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { getMe } from '../../redux/action/auth.action';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_IMG = import.meta.env.VITE_API_BASE_IMG;

function UpdateApp({ isOpen, onClose, materielData, onUpdateMateriel }) {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.auth);
  const location = useLocation();
  const jwt_access = localStorage.getItem('jwt_access');

  const [nom, setNom] = useState(materielData?.nom || '');
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(materielData?.url || '');

  const [errors, setErrors] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (materielData) {
      setNom(materielData.nom || '');
      setImage(null);
      setUrl(materielData.url || '');
    }
  }, [materielData]);

  const handleClose = () => {
    setSuccessMessage('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!materielData) {
      console.error("Données de matériel manquantes");
      return;
    }
    setErrors(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('url', url);
    if (image) {
      formData.append('image', image);
    }

    try {
      const res = await axios.put(`${API_BASE_URL}/materiels/${materielData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${jwt_access}`,
        },
      });

      setSuccessMessage('Matériel modifié avec succès !');
      if (onUpdateMateriel) onUpdateMateriel();

      if (materielData.id === me.id) {
        dispatch(getMe(location.pathname + location.search));
      }
      setTimeout(() => {
        setLoading(false);
        window.location.reload(); // Actualisation automatique
      }, 1000);
    } catch (err) {
      setLoading(false);
      setErrors(err.response && err.response.data && err.response.data.errors
        ? err.response.data.errors
        : { global: 'Une erreur est survenue.' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Modifier le matériel</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
          <label className="block text-gray-700">Image</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}  // Stocker l'image dans l'état
              className="w-full p-2 border border-gray-300 rounded-md"
            />
                    </div>
          <div className="mb-4">
            <label className="block text-gray-700">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {errors && <p className="text-red-500 mb-4">{errors.global || errors.message}</p>}
          {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateApp;

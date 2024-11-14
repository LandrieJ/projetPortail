import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../../redux/action/auth.action';

function ModalMateriel({ isOpen, onClose, fetchData }) {
  const jwt_access = localStorage.getItem('jwt_access');
  const dispatch = useDispatch();
  const location = useLocation();

  const [nom, setNom] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);

  const [isNomTouch, setIsNomTouch] = useState(false);
  const [isUrlTouch, setUrlTouch] = useState(false);
  const [isImageTouch, setImageTouch] = useState(false);

  // Vérification si l'image est bien un fichier autorisé
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxFileSize = 5 * 1024 * 1024; // 5 Mo
    if (file && !file.type.startsWith('image/')) {
      setError('Seuls les fichiers d\'image sont autorisés.');
      setImage(null);
    } else if (file && file.size > maxFileSize) {
      setError('Le fichier est trop volumineux. La taille maximale autorisée est de 5 Mo.');
      setImage(null);
    } else {
      setError(null);
      setImage(file);
    }
  };

  // Envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true); // Activation du loader
    setError(null);

    if (!jwt_access) {
      setError('Token JWT manquant. Veuillez vous reconnecter.');
      setLoader(false);
      return;
    }

    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('url', url);
    if (image) formData.append('image', image); // Ajouter l'image seulement si elle est sélectionnée

    try {
      const response = await axios.post('http://localhost:5000/api/v1/materiels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${jwt_access}`,
        },
      });
      
      if (fetchData) fetchData(); // Rafraîchissement des données
      onClose(); // Fermeture de la modal
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          dispatch(logout(location.pathname + location.search)); // Gestion de l'expiration du token
        } else if (err.response.data && err.response.data.errors) {
          setError(err.response.data.errors.join(', '));
        } else {
          setError(err.response.data.message || 'Erreur lors de l\'envoi des données.');
        }
      } else {
        setError('Erreur réseau. Veuillez vérifier votre connexion.');
      }
    } finally {
      setLoader(false); // Désactivation du loader
    }
  };

  if (!isOpen) return null; // Si la modal est fermée, ne rien rendre

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ajouter un matériel</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nom du matériel</label>
            <input
              type="text"
              name="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              onBlur={() => setIsNomTouch(true)}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Entrez le nom du matériel"
              required
            />
            {isNomTouch && !nom && <div className="text-red-500 text-sm">Le nom est requis</div>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">URL du matériel</label>
            <input
              type="text"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => setUrlTouch(true)}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Entrez l'URL"
              required
            />
            {isUrlTouch && !url && <div className="text-red-500 text-sm">L'url est requise</div>}
            {/* {isUrlTouch && url.length > 0  && <div className="text-red-500 text-sm">L'URL n'est pas valide</div>} */}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Logo du matériel</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              onBlur={() => setImageTouch(true)}
              className="w-full border border-gray-300 p-2 rounded-md"
              accept="image/*"
              required
            />
            {isImageTouch && !image && <div className="text-red-500 text-sm">Le logo est requis</div>}
          </div>
          {error && <div className="mt-4 text-red-500">{error}</div>}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              disabled={loader}
            >
              {loader ? 'Envoi...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalMateriel;

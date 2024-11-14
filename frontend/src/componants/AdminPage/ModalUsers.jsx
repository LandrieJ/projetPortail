import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../../redux/action/auth.action';

function ModalUsers({ closeModal, fetchData }) {
  const jwt_access = localStorage.getItem('jwt_access');
  const dispatch = useDispatch();
  const location = useLocation();

  const [nom, setNom] = useState("");
  const [nomTouch, setNomTouch] = useState(false);

  const [prenom, setPrenom] = useState("");
  const [prenomTouched, setPrenomTouched] = useState(false);

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [password, setPassword] = useState("");
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] = useState(false);

  const [role, setRole] = useState("");
  const [isRoleTouched, setIsRoleTouched] = useState(false);

  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true); // Start loading
    setError(null);

    try {
      await axios.post('http://localhost:5000/api/v1/users', { nom, prenom, email, password, role }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_access}`
        }
      });

      // Fetch updated data and close modal
      if (fetchData) fetchData();
      closeModal();
      resetForm(); // Clear form fields
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Logout if unauthorized
        dispatch(logout(location.pathname + location.search));
      } else {
        setError(err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message);
      }
    } finally {
      setLoader(false); // Stop loading
    }
  };

  const resetForm = () => {
    setNom("");
    setPrenom("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRole("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Ajouter un utilisateur</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              onBlur={() => setNomTouch(true)}
              className="w-full border border-gray-300 p-1/2 rounded-md"
              required
            />
            {nomTouch && nom.length === 0 && <div className='form-error'>Veuillez saisir votre nom</div>}
            {nomTouch && nom.length > 0 && nom.length < 2 && <div className='form-error'>Le nom doit comporter au moins 2 caractères</div>}
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              onBlur={() => setPrenomTouched(true)}
              className="w-full border border-gray-300 p-1/2 rounded-md"
              required
            />
            {prenomTouched && prenom.length === 0 && <div className='form-error'>Veuillez saisir votre prénom</div>}
            {prenomTouched && prenom.length > 0 && prenom.length < 2 && <div className='form-error'>Le prénom doit comporter au moins 2 caractères</div>}
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              className="w-full border border-gray-300 p-1/2 rounded-md"
              required
            />
            {emailTouched && email.length === 0 && <div className='form-error'>Veuillez saisir votre email</div>}
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Rôle</label>
            <select
              id="role"
              name="role"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onBlur={() => setIsRoleTouched(true)}
              className={`w-full border border-gray-300 p-1/2 rounded-md ${isRoleTouched && role.length === 0 ? 'border-red-500' : ''}`}
            >
              <option value="" disabled>Sélectionnez votre rôle</option>
              <option value="user">Utilisateur</option>
              <option value="admin">Admin</option>
            </select>
            {isRoleTouched && role.length === 0 && <div className="text-red-500 text-sm mt-1">Veuillez sélectionner votre rôle</div>}
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setIsPasswordTouched(true)}
              className="w-full border border-gray-300 p-1/2 rounded-md"
              required
            />
            {isPasswordTouched && password.length === 0 && <div className='form-error'>Veuillez saisir votre mot de passe</div>}
            {isPasswordTouched && password.length < 8 && <div className='form-error'>Le mot de passe doit comporter au moins 8 caractères</div>}
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setIsConfirmPasswordTouched(true)}
              className="w-full border border-gray-300 p-1/2 rounded-md"
              required
            />
            {isConfirmPasswordTouched && confirmPassword.length === 0 && <div className='form-error'>Veuillez confirmer votre mot de passe</div>}
            {isConfirmPasswordTouched && password !== confirmPassword && <div className='form-error'>Les mots de passe ne correspondent pas</div>}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              disabled={loader} // Disable button while loading
            >
              {loader ? 'Enregistrement en cours...' : 'Enregistrer'}
            </button>
          </div>
        </form>
        {loader && <div className="text-center mt-4">Chargement...</div>} {/* Display loader */}
        {error && <div className="text-red-500 text-center mt-4">{error}</div>} {/* Display error */}
      </div>
    </div>
  );
}

export default ModalUsers;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  

function MotOublier() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate(); 

  const jwt_access = localStorage.getItem("jwt_access");

  useEffect(() => {
    if (jwt_access) {
      navigate("/"); 
    }
  }, [navigate, jwt_access]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    setError(null);
    setSuccessMessage(null); 

    // Vérification que les mots de passe correspondent
    if (newPassword.trim() !== confirmPassword.trim()) {
        setError("Les mots de passe ne correspondent pas.");
        setLoader(false);
        return;
    }

    try {
        const { data } = await axios.post(
            `${API_BASE_URL}/resetPassword`, 
            { email, newPassword, confirmPassword }, // Ajout de confirmPassword
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        // Stockez le token JWT si nécessaire
        localStorage.setItem('jwt_access', data.jwt_access); // Supposons que le token se trouve dans data.jwt_access
        setSuccessMessage("Votre mot de passe a été réinitialisé avec succès !");
        setError(null); 
        navigate("/login"); 
    } catch (err) {
        // Vérifier les types d'erreurs renvoyées par le backend
        if (err.response?.data?.errors) {
          const backendErrors = err.response.data.errors;
          if (backendErrors.confirmPassword) {
            setError(backendErrors.confirmPassword);
          } else if (backendErrors.email) {
            setError(backendErrors.email);
          } else {
            setError(backendErrors.global || "Une erreur s'est produite.");
          }
        } else {
          setError(err.message || "Une erreur s'est produite.");
        }
    } finally {
        setLoader(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold text-center mb-6">Réinitialiser le mot de passe</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Votre email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="new-password">Nouveau mot de passe</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Votre nouveau mot de passe"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700" htmlFor="confirm-password">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Confirmez votre mot de passe"
              required
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
            disabled={loader || 
              !/^[a-z0-9.-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email) || 
              newPassword.length < 4 || 
              confirmPassword.length < 4
            }
          >
            {loader ? "Chargement..." : "Confirmer"}
          </button>

          <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-900">Retour à la connexion</Link>
        </form>
      </div>
    </div>
  );
}

export default MotOublier;

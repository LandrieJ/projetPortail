import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/LOGO.png";

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState(null);
    const [passwordError, setPasswordError] = useState(null); // État pour l'erreur de mot de passe
    const [successMessage, setSuccessMessage] = useState(null); // État pour le message de succès

    const jwt_access = localStorage.getItem("jwt_access");

    useEffect(() => {
        if (jwt_access) {
            navigate("/");
        }
    }, [navigate, jwt_access]);

    const validatePassword = (password) => {
        return password.length >= 4; // Exemples de critères : longueur minimale de 4 caractères
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        setError(null);
        setPasswordError(null); // Réinitialiser l'erreur de mot de passe
        setSuccessMessage(null); // Réinitialiser le message de succès

        if (!validatePassword(password)) {
            setPasswordError("Le mot de passe doit contenir au moins 4 caractères.");
            setLoader(false);
            return;
        }

        try {
            const { data } = await axios.post(`http://localhost:5000/api/v1/auth/login`, {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(data);
            localStorage.setItem('jwt_access', data);
            setSuccessMessage("Connexion réussie !"); // Définir le message de succès
            setTimeout(() => {
                navigate("/");  // Redirection après 2 secondes
            }, 2000);
        } catch (err) {
            setError(err.response && err.response.data && err.response.data.message 
                ? err.response.data.message 
                : err.message);
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-blue-300">
                <div className='w-full flex justify-center mb-6'>
                    <img src={logo} alt="Logo" className="h-20 w-auto object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>

                {/* Affichage des messages de succès et d'erreur */}
                {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Affichage de l'erreur */}

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
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Votre mot de passe"
                        />
                        {passwordError && <p className="text-red-500">{passwordError}</p>} {/* Affichage de l'erreur de mot de passe */}
                    </div>

                    <div className="mb-4 flex justify-between">
                        <Link to="/login/oublier" className="text-sm text-indigo-600 hover:text-indigo-900">Mot de passe oublié ?</Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={
                            loader || /^[a-z0-9.-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email) === false || password.length < 4} // Désactiver le bouton si le mot de passe n'est pas valide
                    >
                        {loader ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;

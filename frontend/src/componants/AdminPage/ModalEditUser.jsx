import React, { useState } from 'react';
import axios from 'axios';
import { getMe } from '../../redux/action/auth.action';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ModalEditUser({ closeModal, userData, updateUser, fetchData }) {
    const dispatch = useDispatch();
    const { me } = useSelector(state => state.auth);
    const location = useLocation();
    const jwt_access = localStorage.getItem('jwt_access');

    const [nom, setNom] = useState(userData.nom || '');
    const [prenom, setPrenom] = useState(userData.prenom || '');
    const [role, setRole] = useState(userData.role || '');
    const [email, setEmail] = useState(userData.email || '');

    const [errors, setErrors] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false); // État pour le bouton de chargement

    const handleClose = () => {
        setSuccessMessage('');
        closeModal();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(null);
        setLoading(true); // Début du chargement
        axios.put(`${API_BASE_URL}/users/${userData.id}`, {
                prenom,
                nom,
                role,
                email,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwt_access
                }
            })
            .then((res) => {
                setSuccessMessage('Utilisateur modifié avec succès !');
                if (fetchData) fetchData();

                if (userData.id === me.id) {
                    dispatch(getMe(location.pathname + location.search));
                }

                setTimeout(() => {
                    setLoading(false); // Arrêter le chargement
                    window.location.reload(); // Actualisation automatique de la page
                }, 1000); // Délai pour montrer la confirmation avant l'actualisation
            })
            .catch((err) => {
                setLoading(false); // Arrêter le chargement en cas d'erreur
                setErrors(err.response && err.response.data && err.response.data.errors 
                    ? err.response.data.errors 
                    : {global: err.response.message});
            });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Modifier l'utilisateur</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Nom</label>
                        <input
                            type="text"
                            name="nom"
                            value={nom}
                            onChange={(event) => setNom(event.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                         
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Prénom</label>
                        <input
                            type="text"
                            name="prenom"
                            value={prenom}
                            onChange={(event) => setPrenom(event.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                        {errors && errors.prenom && <div className='form-error'>{errors.prenom}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                        {errors && errors.email && <div className='form-error'>{errors.email}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Fonction</label>
                        <input
                            type="text"
                            name="role"
                            value={role}
                            onChange={(event) => setRole(event.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                        {errors && errors.role && <div className='form-error'>{errors.role}</div>}
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                        >
                            Annuler
                        </button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md" disabled={loading}>
                            {loading ? 'Modification...' : 'Modifier'} {/* Affichage du "loading" */}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalEditUser;

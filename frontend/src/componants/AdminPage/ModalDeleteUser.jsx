import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ModalDeleteUser({ closeModal, userData, deleteUser, fetchData }) {
    const jwt_access = localStorage.getItem('jwt_access');
    const [id, setId] = useState(userData.id);
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);  // État de chargement

    const handleClose = () => {
        setSuccessMessage('');
        closeModal();
    };

    useEffect(() => {
        setId(userData.id);
    }, [userData.id]);

    const handleDelete = async () => {
        setIsLoading(true);  // Démarre l'indicateur de chargement
        try {
            const res = await axios.delete(`http://localhost:5000/api/v1/users/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwt_access
                }
            });
            setSuccessMessage('Utilisateur supprimé avec succès !');
            if (deleteUser) {
                deleteUser(id);  // Supprime l'utilisateur dans la liste globale
            }
            if (fetchData) {
                fetchData();  // Mettre à jour les données après suppression
            }

            // Ferme la modal après un court délai
            setTimeout(() => {
                setSuccessMessage('');
                handleClose();
            }, 1500);

        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
        } finally {
            setIsLoading(false);  // Arrête l'indicateur de chargement
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Supprimer l'utilisateur</h2>
                <p>Êtes-vous sûr de vouloir supprimer l'utilisateur {userData.nom} {userData.prenom} ?</p>
                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                        disabled={isLoading}  // Désactiver le bouton pendant le chargement
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className={`bg-red-500 text-white px-4 py-2 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}  // Désactiver le bouton pendant le chargement
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 mr-3 -ml-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V1a10 10 0 00-10 10h2z"></path>
                            </svg>
                        ) : 'Supprimer'}
                    </button>
                </div>
                {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
            </div>
        </div>
    );
}

export default ModalDeleteUser;

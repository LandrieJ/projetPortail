import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function HomePage() {
    const [data, setData] = useState({ items: [] }); // Initialiser avec un objet pour éviter les erreurs
    const [data1, setData1] = useState({ items: [] }); // Même chose pour les matériels
    const location = useLocation();
    const { me } = useSelector(state => state.auth);
    const jwt_access = localStorage.getItem('jwt_access');

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users${location.search}`, {
                headers: {
                    "Authorization": `Bearer ${jwt_access}`
                }
            });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching users:", error.message); // Message d'erreur plus clair
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/materiels${location.search}`, {
                headers: {
                    "Authorization": `Bearer ${jwt_access}`,
                },
            });
            setData1(response.data); // Utiliser response.data directement si la structure est correcte
        } catch (error) {
            console.error('Erreur lors de la récupération des matériels :', error.message); // Message d'erreur plus clair
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchData();
    }, [location]);

    const handleEdit = (user) => {
        // Logique d'édition ici
    };

    const handleDelete = (user) => {
        // Logique de suppression ici
    };

    const totalEmployes = data.items.length; // Total d'utilisateurs
    const totalMateriel = data1.items.length; // Total de matériels

    return (
        <HelmetProvider>
            <Helmet>
                <title>Tableau de bord - D&amp;I Pointing</title>
            </Helmet>
            <section className='section p-6 bg-gray-100'>
                <main>
                    <div className="head-title flex justify-between items-center mb-4">
                        <div className="left">
                            <h1 className="text-2xl font-bold">Dashboard</h1>
                        </div>
                    </div>
                    {/* Box info */}
                    <ul className="box-info grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <li className="bg-white p-4 rounded shadow flex items-center">
                            <span className="text">
                                 <p>Total Utilisateurs</p>
                                <h3 className="text-xl font-semibold">{totalEmployes !== undefined ? totalEmployes : 'Chargement...'}</h3>
                               
                            </span>
                        </li>
                        <li className="bg-white p-4 rounded shadow flex items-center">
                            <span className="text">
                               <p>Total Matériel</p>
                                <h3 className="text-xl font-semibold">{totalMateriel !== undefined ? totalMateriel : 'Chargement...'}</h3>
                               
                            </span>
                        </li>
                    </ul>
                </main>
                {/* Table des utilisateurs */}
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 text-left">ID</th>
                            <th className="py-2 text-left">Nom</th>
                            <th className="py-2 text-left">Prénom</th>
                            <th className="py-2 text-left">Email</th>
                            <th className="py-2 text-left">Fonction</th>
                            <th className="py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((user, i) => (
                            <tr key={i}>
                                <td className="px-4 py-2 border-b">{user.id}</td>
                                <td className="px-4 py-2 border-b">{user.nom}</td>
                                <td className="px-4 py-2 border-b">{user.prenom}</td>
                                <td className="px-4 py-2 border-b">{user.email}</td>
                                <td className="px-4 py-2 border-b">{user.role}</td>
                                <td className="px-4 py-2 border-b text-center">
                                    <button
                                        className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition duration-300 mr-2"
                                        onClick={() => handleEdit(user)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300"
                                        onClick={() => handleDelete(user)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </HelmetProvider>
    );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import ModalMateriel from './ModalMateriel';
import UpdateApp from './UpdateApp';
import DelletApp from './DelletApp';
import { useLocation } from 'react-router-dom';

function Materiel() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMateriel, setSelectedMateriel] = useState(null);
  const [materiels, setMateriels] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const location = useLocation();
  const jwt_access = localStorage.getItem('jwt_access');

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/materiels${location.search}`, {
        headers: {
          Authorization: `Bearer ${jwt_access}`,
        },
      });
      if (response.data && Array.isArray(response.data.items)) {
        setMateriels(response.data.items);
      } else {
        setMateriels([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  const handleEdit = (materiel) => {
    setSelectedMateriel(materiel);
    setEditModalOpen(true);
  };

  const handleDelete = (materiel) => {
    setSelectedMateriel(materiel);
    setDeleteModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4 flex justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Liste des matériels</h2>
        </div>
        <div className="mb-6 flex justify-end">
          <button
            className="flex bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            onClick={() => setModalOpen(true)}
          >
            <FaPlus className="mr-1" />
            Nouveau
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="px-4 py-2 border-b">Id</th>
                <th className="px-4 py-2 border-b">Nom</th>
                <th className="px-4 py-2 border-b">Image</th>
                <th className="px-4 py-2 border-b">Url</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {materiels.map((materiel, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 border-b">{materiel.id}</td>
                  <td className="px-4 py-2 border-b">{materiel.nom}</td>
                  <td className="px-4 py-2 border-b text-center">
                    <img
                      src={materiel.image ? `http://localhost:5000/uploads/${materiel.image}` : 'https://via.placeholder.com/150'}
                      alt={materiel.nom}
                      className="w-10 h-10 object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 border-b">
                    <a
                      href={materiel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {materiel.url}
                    </a>
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    <button
                      className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition duration-300 mr-2"
                      onClick={() => handleEdit(materiel)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300"
                      onClick={() => handleDelete(materiel)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <ModalMateriel isOpen={isModalOpen} onClose={() => setModalOpen(false)} fetchData={fetchData} />}
      {isEditModalOpen && <UpdateApp isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} materielData={selectedMateriel} />}
      {isDeleteModalOpen && <DelletApp isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} materielData={selectedMateriel} deleteMateriel={fetchData} />}
    </div>
  );
}

export default Materiel;

import React, { useState, useEffect } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import ModalEditUser from './ModalEditUser';
import ModalDeleteUser from './ModalDeleteUser';
import ModalUsers from './ModalUsers';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Employer() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState([]);
  const location = useLocation();
  const { me } = useSelector(state => state.auth);
  const jwt_access = localStorage.getItem('jwt_access');

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/users${location.search}`, {
        headers: {
          "Authorization": "Bearer " + jwt_access
        }
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const updateUser = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/v1/users/${id}`, updatedData, {
        headers: {
          "Authorization": "Bearer " + jwt_access
        }
      });
      fetchData(); // Re-fetch data after update
      setIsEditModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/users/${id}`, {
        headers: {
          "Authorization": "Bearer " + jwt_access
        }
      });
      fetchData(); // Re-fetch data after deletion
      setIsDeleteModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // const totalEmployes = data.items ? data.items.length : 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4 flex justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Liste des utilisateurs</h2>

        </div>
        <div className="mb-6 flex justify-end">
          <button
            className="flex bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            onClick={handleOpenModal}
          >
            <FaPlus className='mr-1' />
            Nouveau
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="px-4 py-2 border-b">Id</th>
                <th className="px-4 py-2 border-b">Nom</th>
                <th className="px-4 py-2 border-b">Prénom</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Fonction</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data && data.items && data.items.map((user, i) => (
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
        </div>
      </div>

      {isEditModalOpen && (
        <ModalEditUser
          closeModal={() => setIsEditModalOpen(false)}
          userData={selectedUser}
          updateUser={updateUser}
        />
      )}

      {isDeleteModalOpen && (
        <ModalDeleteUser
          closeModal={() => setIsDeleteModalOpen(false)}
          userData={selectedUser}
          deleteUser={deleteUser}
        />
      )}

      {isModalOpen && <ModalUsers closeModal={handleCloseModal} />}
    </div>
  );
}

export default Employer;

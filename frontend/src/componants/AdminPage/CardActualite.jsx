import React, {useState} from 'react'
import ModalImage from './ModalImage';
import { useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const API_BASE_IMG = import.meta.env.VITE_API_BASE_IMG;

export default function CardActualite({actualite, setShowDeleteModal, setShowUpdateModal, setSelectedActualite}) {
    const [showImageModal, setShowImageModal] = React.useState(false);
    const { me } = useSelector(state => state.auth);
    const [hoveredId, setHoveredId] = useState(null);
    
  const [selectedImage, setSelectedImage] = useState(null);
    const getBackgroundColor = (titre) => {
        switch (titre) {
          case 'DCN':
            return 'bg-gray-400'; // Gris
          case 'Pac Antananarivo':
            return 'bg-blue-500'; // Bleu
          case 'Pac Fianarantsoa':
            return 'bg-green-500'; // Vert
          case 'Pac Majunga':
            return 'bg-red-500'; // Rouge
          default:
            return 'bg-white'; // Couleur par défaut
        }
      };
  return (
    <>
        <div key={actualite.id} className="py-10 flex justify-center items-center min-h-[200px]">
        <div 
          className={`flex flex-col items-center w-full max-w-md justify-center p-6 border-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 ${getBackgroundColor(actualite.titre)}`}
          onMouseEnter={() => setHoveredId(actualite.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <h2 className="font-semibold text-xl text-center mb-4 text-white">
            {actualite.titre}
          </h2>

          {actualite.imgUrl && (
            <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 xl:h-96 2xl:h-[400px] mb-8">
              <img
                src={`${API_BASE_IMG}${actualite.imgUrl}`}
                alt="Actualité"
                className="w-full h-64 object-cover rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                onClick={() => {
                  setSelectedImage(`${API_BASE_IMG}${actualite.imgUrl}`);
                  setShowImageModal(showImageModal => !showImageModal);
                }}
              />

              {me?.role === 'admin' && hoveredId === actualite.id && (
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedActualite(actualite);
                      setShowUpdateModal(true)
                    }}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-300 transition-colors duration-200"
                  >
                    <FaEdit className="mr-2" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedActualite(actualite);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                  >
                    <FaTrash className="mr-2" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ModalImage 
      isOpen={showImageModal} 
      onRequestClose={() => setShowImageModal(false)} 
      imageSrc={selectedImage} 
      actualite={actualite}
    />
    </>
  )
}

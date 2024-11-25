import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import headerImage from '../../assets/logoPac.jpg';
import drapeau from '../../assets/drapeau.jpg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const ModalImage = ({
  isOpen,
  onRequestClose,
  imageSrc,
  isAdmin,
  onEdit,
  onDelete,
  jwtAccess,
  actualiteId,
}) => {
  const [actualite, setActualite] = useState(null);

  // Récupérer les données de l'actualité
  useEffect(() => {
    console.log({ isOpen, actualiteId });

    if (!isOpen || !actualiteId) return; // Ne rien faire si le modal n'est pas ouvert ou si actualiteId est absent

    const fetchActualite = async () => {
      try {
        console.log(`Récupération des données pour actualiteId: ${actualiteId}`);
        const response = await axios.get(
          `${API_BASE_URL}/actualite/${actualiteId}`,
          {
            headers: { Authorization: `Bearer ${jwtAccess}` },
          }
        );
        setActualite(response.data); // Mettre à jour l'état avec l'actualité récupérée
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        if (error.response && error.response.status === 401) {
          alert('Session expirée. Veuillez vous reconnecter.');
        }
      }
    };

    fetchActualite();
  }, [isOpen, actualiteId, jwtAccess]);

  // Générer un PDF
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();

      // Largeur de la page
      const pageWidth = doc.internal.pageSize.getWidth();

      // Dimensions et positions des images
      const imageWidth = 20;
      const margin = 10;
      const headerImageX = margin;
      const headerImageY = 10;
      const drapeauX = pageWidth - imageWidth - margin;
      const drapeauY = 10;

      // Ajouter le logo gauche
      doc.addImage(headerImage, 'JPEG', headerImageX, headerImageY, imageWidth, imageWidth);

      // Ajouter le logo droit
      doc.addImage(drapeau, 'JPEG', drapeauX, drapeauY, imageWidth, imageWidth);

      // Ajouter les textes en haut
      doc.setFontSize(10);
      doc.text("REPUBLIKAN'I MADAGASIKARA", pageWidth / 2, 15, { align: 'center' });
      doc.text('Fitiavana - Tanindrazana - Fandrosoana', pageWidth / 2, 20, { align: 'center' });

      doc.setFontSize(12);
      doc.text(
        'DIRECTION DE COORDINATION NATIONALE DES PÔLES ANTI-CORRUPTION',
        pageWidth / 2,
        33,
        { align: 'center' }
      );

      // Ajouter le titre principal
      doc.setFontSize(16);
      doc.setFont('Helvetica', 'bold');
      doc.text('Rapport sur l\'actualité', pageWidth / 2, 50, { align: 'center' });

      // Ajouter le titre et le contenu de l'actualité
      doc.setFontSize(14);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Titre : ${actualite?.titre || 'Non disponible'}`, 10, 70);

      // Ajouter l'image principale si disponible
      if (imageSrc) {
        const contentWidth = 100;
        const contentHeight = 100;
        const contentX = (pageWidth - contentWidth) / 2;
        const contentY = 110;
        doc.addImage(imageSrc, 'JPEG', contentX, contentY, contentWidth, contentHeight);
      }

      // Sauvegarder le PDF
      doc.save('actualite.pdf');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF :', error);
      alert('Une erreur est survenue lors de la génération du PDF.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onRequestClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{actualite?.titre || 'Titre indisponible'}</h2>
          {imageSrc && (
            <img src={imageSrc} alt="Actualité" className="w-full h-auto rounded-lg mb-4" />
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={handleDownloadPDF}
            className="bg-green-500 text-white py-2 px-4 rounded transition duration-200 hover:bg-green-600"
          >
            Télécharger en PDF
          </button>
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="bg-blue-500 text-white py-2 px-4 rounded transition duration-200 hover:bg-blue-600"
              >
                Modifier
              </button>
              <button
                onClick={onDelete}
                className="bg-red-500 text-white py-2 px-4 rounded transition duration-200 hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          )}
          <button
            onClick={onRequestClose}
            className="bg-gray-500 text-white py-2 px-4 rounded transition duration-200 hover:bg-gray-600"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalImage;

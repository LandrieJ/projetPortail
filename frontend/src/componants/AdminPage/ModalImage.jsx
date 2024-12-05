import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import headerImage from '../../assets/logoPac.jpg';
import drapeau from '../../assets/drapeau.jpg';

const ModalImage = ({
  isOpen,
  onRequestClose,
  imageSrc,
  isAdmin,
  onEdit,
  onDelete,
  actualite,
}) => {
  // État local pour gérer le titre dynamiquement
  const [titre, setTitre] = useState(actualite?.titre || 'Titre indisponible');

  // Synchronisation de l'état local avec les changements de props
  useEffect(() => {
    if (isOpen) {
      setTitre(actualite?.titre || 'Titre indisponible');
    }
  }, [isOpen, actualite]);

  console.log(actualite.titre)
  // Générer un PDF basé sur l'actualité
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

      // Ajouter les images d'en-tête
      doc.addImage(headerImage, 'JPEG', headerImageX, headerImageY, imageWidth, imageWidth);
      doc.addImage(drapeau, 'JPEG', drapeauX, drapeauY, imageWidth, imageWidth);

      // Ajouter les textes d'en-tête
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
      doc.text(`Titre : ${titre}`, 10, 70);

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

  // Si le modal n'est pas ouvert, ne rien afficher
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
          <h2 className="text-2xl font-bold mb-4">{actualite.titre}</h2>
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

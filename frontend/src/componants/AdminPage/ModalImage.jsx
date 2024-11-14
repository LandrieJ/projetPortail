import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ModalImage = ({
  isOpen,
  onRequestClose,
  imageSrc,
  isAdmin,
  onEdit,
  onDelete
}) => {
  
  const handleDownloadPDF = async () => {
    const imageElement = document.getElementById('image-to-download').querySelector('img');

    if (imageElement.complete) {
      await generatePDF();
    } else {
      imageElement.onload = async () => {
        await generatePDF();
      };
      imageElement.onerror = () => {
        console.error("L'image n'a pas pu être chargée.");
      };
    }
  };

  const generatePDF = async () => {
    const canvas = await html2canvas(document.getElementById('image-to-download'), {
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();

    const imgWidth = 190; // Largeur d'image souhaitée (modifiable)
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculer la hauteur pour garder les proportions
    const pdfWidth = pdf.internal.pageSize.getWidth(); // Largeur de la page PDF
    const pdfHeight = pdf.internal.pageSize.getHeight(); // Hauteur de la page PDF

    // Calculer les coordonnées pour centrer l'image
    const x = (pdfWidth - imgWidth) / 2; 
    const y = (pdfHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight); // Ajout de l'image avec les coordonnées centrées
    pdf.save('image.pdf');
  };

  // Styles personnalisés pour la modal
  const customStyles = {
    display: isOpen ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000
  };

  return (
    <div style={customStyles}>
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full">
        <div id="image-to-download" className="flex justify-center items-center">
          <img src={imageSrc} alt="Actualité" className="w-full h-auto rounded-md" />
        </div>
        <div className="mt-4 flex justify-between">
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
                className="bg-blue-500 text-white py-2 px-4 rounded transition duration-200 hover:bg-yellow-600"
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
            className="bg-blue-500 text-white py-2 px-4 rounded transition duration-200 hover:bg-blue-600"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalImage;

import React, { useState, useCallback } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { AddCoproDialogProps } from '@/interfaces/AddCopro.interface';
import { motion } from 'framer-motion';
import { PinataService } from '@/service/pinata.service';
import { ErrorService } from '@/service/error.service';

const AddCoproDialog: React.FC<AddCoproDialogProps> = ({ open, handleClose, handleSubmit, handleChange, propertyData }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setUploadedImageUrl(''); // Reset uploaded URL when new file is selected
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        ErrorService.errorMessage('Erreur', 'Veuillez sélectionner une image valide');
      }
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setUploadedImageUrl(''); // Reset uploaded URL when new file is selected
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        ErrorService.errorMessage('Erreur', 'Veuillez sélectionner une image valide');
      }
    }
  }, []);

  const handleCloseModal = () => {
    // Reset all states when closing
    setSelectedFile(null);
    setUploadedImageUrl('');
    setImagePreview('');
    setIsDragOver(false);
    setIsUploading(false);
    handleClose();
  };

  const handleSubmitWithImage = async () => {
    if (!selectedFile) {
      ErrorService.errorMessage('Erreur', 'Veuillez d\'abord sélectionner une image');
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await PinataService.uploadImage(selectedFile);
      setUploadedImageUrl(imageUrl);
      
      propertyData.imageUrl = imageUrl; // Update propertyData with the uploaded image URL
      // Call the original handleSubmit after successful upload
      await handleSubmit();
      
      // Reset states after successful submission
      setSelectedFile(null);
      setUploadedImageUrl('');
      setImagePreview('');
      setIsUploading(false);
      
      ErrorService.successMessage('Succès', 'Propriété créée avec succès');
      handleClose();
    } catch (error) {
      setIsUploading(false);
      ErrorService.errorMessage('Erreur', 'Échec de l\'upload de l\'image ou de la création de la propriété');
      console.error('Upload/Submit error:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCloseModal} 
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          borderRadius: '16px',
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl"
      >
        <div className="px-8 py-6 border-b border-gray-700/50">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Ajouter une nouvelle propriété
          </h2>
          <p className="text-gray-400 mt-2">
            Créez une nouvelle propriété immobilière sur la blockchain
          </p>
        </div>

        <div className="px-8 py-6 space-y-6">
          {[
            { field: "name", label: "Nom de la propriété", type: "text", placeholder: "Ex: Résidence Les Jardins" },
            { field: "symbol", label: "Symbole", type: "text", placeholder: "Ex: RJ" },
            { field: "flatCount", label: "Nombre d'appartements", type: "number", placeholder: "Ex: 12" },
            { field: "street_number", label: "Numéro de rue", type: "number", placeholder: "Ex: 12" },
            { field: "street_name", label: "Nom de la rue", type: "text", placeholder: "Ex: Avenue des Champs-Élysées" },
            { field: "complement_address", label: "Complément d'adresse", type: "text", placeholder: "Bâtiment, étage, etc." },
            { field: "city", label: "Ville", type: "text", placeholder: "Ex: Paris" },
            { field: "zip_code", label: "Code postal", type: "text", placeholder: "Ex: 75008" },
            { field: "region", label: "Région", type: "text", placeholder: "Ex: Île-de-France" },
            { field: "country", label: "Pays", type: "text", placeholder: "Ex: France" },
            { field: "promoter", label: "Adresse du promoteur", type: "text", placeholder: "0x..." },
          ].map(({ field, label, type, placeholder }, index) => (
            <motion.div
              key={field}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (index * 0.05) }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {label}
              </label>
              <TextField
                name={field}
                type={type}
                placeholder={placeholder}
                fullWidth
                variant="outlined"
                value={propertyData[field as keyof (Exclude<typeof propertyData, 'imageUrl'>)]}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(55, 65, 81, 0.5)',
                    borderRadius: '12px',
                    border: '1px solid rgba(75, 85, 99, 0.5)',
                    '&:hover': {
                      border: '1px solid rgba(59, 130, 246, 0.5)',
                    },
                    '&.Mui-focused': {
                      border: '1px solid rgba(59, 130, 246, 0.8)',
                      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9CA3AF',
                    '&.Mui-focused': {
                      color: '#3B82F6',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#FFFFFF',
                    '&::placeholder': {
                      color: '#6B7280',
                      opacity: 1,
                    },
                  },
                }}
              />
            </motion.div>
          ))}
          
          {/* Zone de glisser-déposer pour l'image */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image de la propriété
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
                ${isDragOver 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : selectedFile 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
                }
              `}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-blue-400">Création de la propriété en cours...</p>
                </div>
              ) : selectedFile && imagePreview ? (
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <img 
                      src={imagePreview} 
                      alt="Aperçu" 
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-600"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-green-400 font-medium">Image sélectionnée</p>
                  <p className="text-gray-400 text-sm mt-1">{selectedFile.name}</p>
                  <p className="text-gray-500 text-xs mt-2">Cliquez pour changer d'image</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-300 font-medium mb-2">Glissez-déposez votre image ici</p>
                  <p className="text-gray-400 text-sm">ou cliquez pour sélectionner un fichier</p>
                  <p className="text-gray-500 text-xs mt-2">PNG, JPG, GIF jusqu'à 10MB</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="px-8 py-6 border-t border-gray-700/50 flex justify-end space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCloseModal}
            disabled={isUploading}
            className="px-6 py-3 text-gray-300 hover:text-white font-medium rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmitWithImage}
            disabled={!selectedFile || isUploading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Création...
              </div>
            ) : (
              "Créer la propriété"
            )}
          </motion.button>
        </div>
      </motion.div>
    </Dialog>
  );
};

export default AddCoproDialog;

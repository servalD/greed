import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { motion } from 'framer-motion';

export default function GuestEntranceDialog({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl"
      >
        <div className="px-8 py-6 border-b border-gray-700/50">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Rejoindre en tant qu'invité
          </h2>
          <p className="text-gray-400 mt-2">
            Complétez votre profil pour soumettre votre demande de rejoindre la plateforme
          </p>
        </div>
        <div className="px-8 py-6 space-y-6">
          {[{ field: "first_name", label: "Prénom", type: "text", placeholder: "Votre prénom" },
            { field: "last_name", label: "Nom", type: "text", placeholder: "Votre nom" },
            { field: "email", label: "Email", type: "email", placeholder: "Votre email" }
          ].map(({ field, label, type, placeholder }, index) => (
            <motion.div
              key={field}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (index * 0.05) }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
              <TextField
                name={field}
                type={type}
                placeholder={placeholder}
                fullWidth
                variant="outlined"
                value={form[field]}
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
        </div>
        <div className="px-8 py-6 border-t border-gray-700/50 flex justify-end space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-6 py-3 text-gray-300 hover:text-white font-medium rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200"
          >
            Annuler
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/20"
          >
            Rejoindre
          </motion.button>
        </div>
      </motion.div>
    </Dialog>
  );
} 
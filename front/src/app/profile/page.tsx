"use client";

import { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Person, Email } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getUser, updateUser } from '@/service/auth';
import { ErrorService } from '@/service/error.service';
import { User, UserUpdate, UserRoleIdLabels, UserLabelRoleIds } from '@/types/users';
import Navbar from '@/components/ui/navbar';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await getUser();
      if (userData) {
        setUser(userData);
        setFormData({
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          email: userData.email || ''
        });
      }
    } catch (error: any) {
      console.error('Error fetching user:', error);
      ErrorService.errorMessage('Erreur', 'Impossible de charger les informations utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) return;

    setSaving(true);
    try {
      const updateData: UserUpdate = {
        id: user.id,
        eth_address: user.eth_address,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        role: UserRoleIdLabels[user.role]
      };

      await updateUser(updateData);
      
      ErrorService.successMessage(
        'Profil mis à jour',
        'Vos informations ont été mises à jour avec succès'
      );
      
      // Refresh user data
      await fetchUser();
      
    } catch (error: any) {
      console.error('Error updating user:', error);
      ErrorService.errorMessage(
        'Erreur de mise à jour',
        error.message || 'Une erreur est survenue lors de la mise à jour'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <Navbar />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress size={60} />
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={6}
            sx={{ 
              p: 4, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Mon Profil
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Gérez vos informations personnelles
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Informations utilisateur */}
              <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person /> Informations personnelles
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Prénom"
                        value={formData.firstName}
                        onChange={handleInputChange('firstName')}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                          }
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Nom"
                        value={formData.lastName}
                        onChange={handleInputChange('lastName')}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                          }
                        }}
                      />
                    </Box>

                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                        }
                      }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Typography variant="body2">Rôle:</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {user?.role !== undefined ? UserRoleIdLabels[user.role] : 'Non défini'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

              {/* Bouton de soumission */}
              <Box textAlign="center" mt={3}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={saving}
                  sx={{
                    minWidth: 200,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:disabled': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }
                  }}
                >
                  {saving ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      Enregistrement...
                    </>
                  ) : (
                    'Mettre à jour'
                  )}
                </Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </div>
  );
}

"use client"
import Navbar from '@/components/ui/navbar';
import { Container, Typography, Grid, Box, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useCoproApartments } from '@/contracts/useCoproApartments';
import { useCoproInteractions } from '@/hooks/useCoproInteractions';
import { useParams } from 'next/navigation';
import { ApartmentCard } from '@/components/ui/ApartmentCard';
import { useEffect } from 'react';

export default function CoproDetailPage() {
  const params = useParams();
  const realtyId = Number(params.id);
  
  const { apartments, loading, error, coproAddress, refetch: refetchApartments } = useCoproApartments(realtyId);
  const { 
    cancelSale,
    sellApartment,
    buyApartment, 
    isProcessing, 
    isConfirmed, 
    getTransactionStatus,
    userAddress 
  } = useCoproInteractions(coproAddress || undefined);

  // Filtrer seulement les appartements qui existent
  const existingApartments = apartments.filter(apartment => apartment.exists);

  const handleBuy = async (apartment: any) => {
    if (!apartment.isForSale || !apartment.price) {
      return;
    }
    console.log(apartment.price)
    await buyApartment(apartment.id, apartment.price);
  };

  const handleSell = async (apartment: any) => {
    if (apartment.isForSale) {
      return;
    }
    
    await sellApartment(apartment.id, apartment.price);
  };

  const handleCancel = async (apartment: any) => {
    if (!apartment.isForSale) {
      return;
    }
    await cancelSale(apartment.id);
  };

  useEffect(() => {
    isConfirmed && refetchApartments();
  }, [isConfirmed, refetchApartments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h4" sx={{ color: 'red' }} gutterBottom>
            Erreur: {error}
          </Typography>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" fontWeight="bold" className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-8" gutterBottom>
            Appartements de la copropriété #{realtyId}
          </Typography>
          
          {coproAddress && (
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 4 }}>
              Contrat: {coproAddress}
            </Typography>
          )}

          {/* Informations sur les appartements */}
          <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`Total d'appartements: ${apartments.length}`} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              label={`Appartements mintés: ${existingApartments.length}`} 
              color="success" 
              variant="outlined"
            />
            {existingApartments.length > 0 && (
              <Chip 
                label={`En vente: ${existingApartments.filter(apt => apt.isForSale).length}`} 
                color="warning" 
                variant="outlined"
              />
            )}
          </Box>

          <Grid container spacing={4}>
            {existingApartments.map(apartment => {
              const buyStatus = getTransactionStatus(apartment.id, 'buy');
              const isProcessingBuy = buyStatus === 'pending';
              const isBought = buyStatus === 'success';

              return (
                <Grid item xs={12} sm={6} md={4} key={apartment.id}>
                  <ApartmentCard
                    apartment={apartment}
                    userAddress={userAddress}
                    onBuy={handleBuy}
                    onSell={handleSell}
                    onCancel={handleCancel}
                    isProcessing={isProcessingBuy}
                    isBought={isBought}
                  />
                </Grid>
              );
            })}
          </Grid>

          {existingApartments.length === 0 && (
            <Box textAlign="center" sx={{ py: 8 }}>
              <Typography variant="h6" sx={{ color: '#9ca3af' }}>
                Aucun appartement minté pour cette copropriété
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', mt: 2 }}>
                {apartments.length > 0 ? `${apartments.length} appartements sont configurés mais aucun n'a encore été minté.` : 'Aucun appartement configuré pour cette copropriété.'}
              </Typography>
            </Box>
          )}

          {/* Message de confirmation d'achat */}
          {isConfirmed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg"
            >
              <Typography variant="body2" fontWeight="bold">
                Transaction confirmée avec succès !
              </Typography>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </div>
  );
} 

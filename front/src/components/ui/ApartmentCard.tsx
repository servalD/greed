import React from 'react';
import { Card, CardContent, Typography, Button, Chip, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { Address } from 'viem';
import { Apartment } from '@/contracts/useCoproApartments';
import { CoproService } from '@/service/copro.service';

interface ApartmentCardProps {
  apartment: Apartment;
  userAddress?: Address;
  onBuy?: (apartment: Apartment) => void;
  isProcessing?: boolean;
  isBought?: boolean;
  showDetails?: boolean;
}

export const ApartmentCard: React.FC<ApartmentCardProps> = ({
  apartment,
  userAddress,
  onBuy,
  isProcessing = false,
  isBought = false,
  showDetails = false,
}) => {
  const isOwner = userAddress && CoproService.isOwner(userAddress, apartment.owner);
  const canBuy = CoproService.canBuyApartment(apartment, userAddress);

  const handleBuy = () => {
    if (onBuy && canBuy) {
      onBuy(apartment);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900/90 rounded-xl border border-gray-700/50 shadow-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
    >
      <div className="w-full h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center relative">
        <Typography variant="h6" sx={{ color: 'white' }}>
          Appartement #{apartment.id + 1}
        </Typography>
        {apartment.isForSale && (
          <Chip 
            label="EN VENTE" 
            color="success" 
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8,
              fontWeight: 'bold'
            }}
          />
        )}
        {isOwner && (
          <Chip 
            label="VOTRE PROPRIÉTÉ" 
            color="primary" 
            size="small"
            sx={{ 
              position: 'absolute', 
              bottom: 8, 
              left: 8,
              fontWeight: 'bold'
            }}
          />
        )}
      </div>
      
      <CardContent sx={{ backgroundColor: 'transparent' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }} gutterBottom>
          Appartement #{apartment.id + 1}
        </Typography>
        
        <Typography variant="body2" sx={{ color: '#d1d5db' }} gutterBottom>
          Propriétaire: {CoproService.formatAddress(apartment.owner)}
        </Typography>
        
        {showDetails && (
          <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.75rem' }} gutterBottom>
            Adresse complète: {apartment.owner}
          </Typography>
        )}
        
        {apartment.isForSale && apartment.price && (
          <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 'bold' }} gutterBottom>
            Prix: {CoproService.formatPrice(apartment.price)} ETH
          </Typography>
        )}
        
        <Typography variant="body2" sx={{ color: apartment.isForSale ? '#10b981' : '#6b7280' }} gutterBottom>
          Statut: {apartment.isForSale ? 'En vente' : 'Non disponible'}
        </Typography>
        
        {apartment.exists && (
          <Typography variant="body2" sx={{ color: '#10b981', fontSize: '0.75rem' }} gutterBottom>
            ✓ Appartement minté
          </Typography>
        )}
        
        {/* Boutons d'action */}
        {isOwner ? (
          <Button
            variant="outlined"
            className="border-gray-600 text-gray-300 font-medium rounded-lg mt-2"
            fullWidth
            disabled
          >
            Votre propriété
          </Button>
        ) : apartment.isForSale ? (
          <Button
            variant="contained"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg mt-2"
            fullWidth
            disabled={isProcessing || isBought || !canBuy}
            onClick={handleBuy}
          >
            {isProcessing ? 'Transaction en cours...' : isBought ? 'Acheté !' : 'Acheter'}
          </Button>
        ) : (
          <Button
            variant="contained"
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-lg mt-2"
            fullWidth
            disabled
          >
            Non disponible
          </Button>
        )}
      </CardContent>
    </motion.div>
  );
}; 
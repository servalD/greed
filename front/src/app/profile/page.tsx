"use client";

import Navbar from '@/components/ui/navbar';
import { Container, Box, Paper, Typography, Divider, Grid, Button, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { RealtyService } from '@/service/realty.service';
import { IRealty } from '@/app/models/realty.model';
import { useRouter } from 'next/navigation';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [realties, setRealties] = useState<IRealty[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRealties = async () => {
      const result = await RealtyService.getAllRealties();
      if (result.errorCode === 0 && result.result) {
        // Filtrer les realty dont l'adresse du promoteur correspond à l'adresse du user connecté
        setRealties(result.result.filter(r => {
          const promoter = String(r.promoter).toLowerCase();
          const userAddress = typeof user?.eth_address === 'string' ? user.eth_address.toLowerCase() : '';
          return promoter === userAddress;
        }));
      }
    };
    if (user?.eth_address) fetchRealties();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={4} mb={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={6}
                className="rounded-2xl p-6 shadow-lg border border-gray-700/50"
                sx={{ backgroundColor: "rgba(17, 24, 39, 0.9)" }}
              >
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: '#6366f1', fontSize: 32 }}>
                    {(user?.first_name?.[0] || '?')}{(user?.last_name?.[0] || '?')}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
                    {user?.first_name || 'Non renseigné'} {user?.last_name || ''}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#d1d5db' }}>
                    {user?.email || 'Non renseigné'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9ca3af', wordBreak: 'break-all' }}>
                    {user?.eth_address || 'Non renseigné'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={4} mb={4}>
            <Grid item xs={12} md={12}>
              <Paper elevation={6}
                className="rounded-2xl p-6 shadow-lg border border-gray-700/50"
                sx={{ backgroundColor: "rgba(17, 24, 39, 0.9)" }}
              >
                <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }} gutterBottom>
                  Mes propriétés
                </Typography>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
                <Grid container spacing={3}>
                  {realties.length === 0 && (
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ color: '#9ca3af' }}>
                        Vous ne possédez aucune propriété pour le moment.
                      </Typography>
                    </Grid>
                  )}
                  {realties.map((realty) => (
                    <Grid item xs={12} sm={6} md={3} key={realty.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="group relative bg-gray-800/90 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                        onClick={() => router.push(`/copro/${realty.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="relative overflow-hidden aspect-[4/3]">
                          <img
                            src={realty.image_url}
                            alt={realty.name}
                            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold" style={{ color: 'white' }}>
                            {realty.name}
                          </h3>
                          <p
                            className="mb-2"
                            style={{ color: '#d1d5db', maxHeight: 60, overflowY: 'auto' }}
                          >
                            {realty.address}, {realty.city}, {realty.zip_code}, {realty.region}, {realty.country}
                          </p>
                          <Button
                            variant="contained"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg mt-2"
                            fullWidth
                            onClick={e => { e.stopPropagation(); router.push(`/copro/${realty.id}`); }}
                          >
                            Voir les détails
                          </Button>
                        </div>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={4} mb={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={6}
                className="rounded-2xl p-6 shadow-lg border border-gray-700/50"
                sx={{ backgroundColor: "rgba(17, 24, 39, 0.9)" }}
              >
                <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }} gutterBottom>
                  Dernières activités
                </Typography>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
                <Box className="text-gray-400">
                  <ul className="space-y-2">
                    <li>• Achat de 20 tokens sur <span className="text-blue-300">Résidence Les Jardins</span></li>
                    <li>• Reçu un dividende de 500 €</li>
                    <li>• Nouvelle propriété ajoutée : <span className="text-purple-300">Loft Lumière</span></li>
                  </ul>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </div>
  );
}
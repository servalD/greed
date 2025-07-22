"use client";

import Navbar from '@/components/ui/navbar';
import { Container, Box, Paper, Typography, Divider, Grid, Card, CardContent, Button, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const mockRealties = [
  {
    id: 1,
    name: "Résidence",
    city: "Paris",
    address: "12 Avenue des Champs-Élysées",
    street_number: "12",
    street_name: "Avenue des Champs-Élysées",
    zip_code: "75008",
    region: "Île-de-France",
    country: "France",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    tokens: 120,
    value: 250000,
  },
  {
    id: 2,
    name: "Villa Azure",
    city: "Nice",
    address: "5 Promenade des Anglais",
    street_number: "5",
    street_name: "Promenade des Anglais",
    zip_code: "06000",
    region: "Provence-Alpes-Côte d'Azur",
    country: "France",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    tokens: 80,
    value: 180000,
  },
  {
    id: 3,
    name: "Loft Lumière",
    city: "Lyon",
    address: "8 Rue de la République",
    street_number: "8",
    street_name: "Rue de la République",
    zip_code: "69002",
    region: "Auvergne-Rhône-Alpes",
    country: "France",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80",
    tokens: 60,
    value: 120000,
  },
];

export default function ClientDashboard() {
  const { user } = useAuth();
  const [realties] = useState(mockRealties);
  
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
                  {realties.map((realty) => (
                    <Grid item xs={12} sm={6} md={3} key={realty.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="group relative bg-gray-800/90 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                      >
                        <div className="relative overflow-hidden aspect-[4/3]">
                          <img
                            src={realty.image}
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

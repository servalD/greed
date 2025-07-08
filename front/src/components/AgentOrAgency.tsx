import React, { useEffect, useState } from 'react';
import { Button, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import AddCoproDialog from './dialog/AddCopro';
import { ErrorService } from '@/service/error.service';
import { Address } from 'viem';
import { useAgency } from '@/contracts/useAgency';
import { useReadDataContract } from '@/contracts/useReadDataContract';
import { motion } from 'framer-motion';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

const AgentOrAgency = () => {
  const [open, setOpen] = useState(false);
  const [propertyData, setPropertyData] = useState({
    name: '',
    symbol: '',
    flatCount: 0,
    promoter: '',
  });

  const { createCopro, isPendingCopro } = useAgency();
  const { guests, clients } = useReadDataContract();

  useEffect(() => {
    console.log("GUESTS :", guests, "CLIENTS", clients)
  })

  // todo : Récupérer les vrais guest entrance
  const guestData = [
    { id: 1, name: 'Alice Dupont', email: 'alice.dupont@example.com' },
    { id: 2, name: 'Bob Martin', email: 'bob.martin@example.com' },
  ];

  // todo : récupérer les vrais clients
  const clientData = [
    { id: 1, name: 'Charlie Durand', email: 'charlie.durand@example.com' },
    { id: 2, name: 'Diane Petit', email: 'diane.petit@example.com' },
  ];

  const guestColumns = [
    { name: 'name', label: 'Nom' },
    { name: 'email', label: 'Email' },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRenderLite: (dataIndex: number) => (
          <div className="flex gap-2">
            <Button 
              variant="contained" 
              color="success" 
              onClick={() => handleAccept(guestData[dataIndex].id)}
              className="bg-green-600 hover:bg-green-700 transition-colors"
            >
              Accepter
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={() => handleDeny(guestData[dataIndex].id)}
              className="bg-red-600 hover:bg-red-700 transition-colors"
            >
              Refuser
            </Button>
          </div>
        ),
      },
    },
  ];

  const clientColumns = [
    { name: 'name', label: 'Nom' },
    { name: 'email', label: 'Email' },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRenderLite: (dataIndex : any) => (
          <Button 
            variant="contained" 
            color="warning" 
            onClick={() => handleBan(clientData[dataIndex].id)}
            className="bg-amber-600 hover:bg-amber-700 transition-colors"
          >
            Bannir
          </Button>
        ),
      },
    },
  ];

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPropertyData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createCopro(
        propertyData.name,
        propertyData.symbol,
        Number(propertyData.flatCount),
        propertyData.promoter as Address
      );

      setPropertyData({ name: '', symbol: '', flatCount: 0, promoter: '' });
      handleClose();
    } catch (error) {
      ErrorService.mixinMessage('Erreur lors de la création du bien', 'error');
      console.error(error);
    }
  };

  const handleAccept = (_ : number) => ErrorService.mixinMessage("L'invité a été accepté", "success");
  const handleDeny = (_ : number) => ErrorService.mixinMessage("L'invité a été refusé", "error");
  const handleBan = (_ : number) => ErrorService.mixinMessage("Le client a été banni", "info");

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Dashboard Administrateur
            </h1>
            <p className="text-gray-400 text-lg">
              Gérez vos propriétés et vos utilisateurs depuis ce panneau de contrôle
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <Button 
              variant="contained" 
              onClick={handleClickOpen} 
              disabled={isPendingCopro}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                text-white font-medium px-6 py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPendingCopro ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Création en cours...
                </div>
              ) : (
                "Ajouter une nouvelle propriété"
              )}
            </Button>
          </motion.div>

          <AddCoproDialog
            open={open}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            propertyData={propertyData}
          />

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <h2 className="text-2xl font-semibold mb-4 text-white">Liste d'attente des invités</h2>
              <MUIDataTable 
                title="" 
                data={guestData} 
                columns={guestColumns} 
                options={{ 
                  selectableRows: 'none',
                  elevation: 0,
                  tableBodyHeight: 'auto',
                  tableBodyMaxHeight: '400px',
                }} 
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <h2 className="text-2xl font-semibold mb-4 text-white">Liste des clients</h2>
              <MUIDataTable 
                title="" 
                data={clientData} 
                columns={clientColumns} 
                options={{ 
                  selectableRows: 'none',
                  elevation: 0,
                  tableBodyHeight: 'auto',
                  tableBodyMaxHeight: '400px',
                }} 
              />
            </motion.div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AgentOrAgency;

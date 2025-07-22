import React, { useEffect, useState } from 'react';
import { Button, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AddCoproDialog from './dialog/AddCopro';
import { ErrorService } from '@/service/error.service';
import { Address } from 'viem';
import { useAgency } from '@/contracts/useAgency';
import { useReadDataContract } from '@/contracts/useReadDataContract';
import { motion } from 'framer-motion';
import { CustomDataTable } from './ui/Datatable';
import { RealtyService } from '@/service/realty.service';
import { UserService } from '@/service/user.service';
import { useReadAgencyGetCoproByName } from '@/contracts/generatedContracts';
import { useWaitForTransactionReceipt } from 'wagmi';
import { useAuth } from '@/hooks/useAuth';
import { User, UserRoleIds } from '@/types/users';

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
    apartment_count: 0,
    promoter: '',
    imageUrl: '',
    street_number: 0,
    street_name: '',
    complement_address: '',
    city: '',
    zip_code: '',
    region: '',
    country: '',
    address: '',
  });
  const [pendingBackendPayload, setPendingBackendPayload] = useState<any>(null);
  const [guestData, setGuestData] = useState<any[]>([]);
  const [clientData, setClientData] = useState<any[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [acceptingClientId, setAcceptingClientId] = useState<number | null>(null);
  const [revokingClientId, setRevokingClientId] = useState<number | null>(null);

  const { createCopro, isConfirmedCopro, createCoproStatus, acceptClient, isConfirmedClient, acceptClientStatus, WriteRevokeClient, revokeClientStatus, isConfirmedRevoke } = useAgency();
  const { guests, clients } = useReadDataContract();
  const { user } = useAuth();

  const { data: contractAddress } = useReadAgencyGetCoproByName({
    args: pendingBackendPayload?.name ? [pendingBackendPayload.name] : undefined,
  });

  // Fonction pour transformer les données User en format attendu par CustomDataTable
  const transformUserData = (users: User[]) => {
    return users.map(user => ({
      id: user.id,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Non renseigné',
      email: user.email || 'Non renseigné',
      eth_address: user.eth_address,
    }));
  };

  // Charger les données des guests
  const loadGuests = async () => {
    try {
      setLoadingGuests(true);
      const result = await UserService.getGuests();
      if (result.errorCode === 0) { // ServiceErrorCode.success
        setGuestData(transformUserData(result.result || []));
      } else {
        ErrorService.errorMessage('Erreur', 'Impossible de charger la liste des invités');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des guests:', error);
      ErrorService.errorMessage('Erreur', 'Impossible de charger la liste des invités');
    } finally {
      setLoadingGuests(false);
    }
  };

  // Charger les données des clients
  const loadClients = async () => {
    try {
      setLoadingClients(true);
      const result = await UserService.getClients();
      if (result.errorCode === 0) { // ServiceErrorCode.success
        setClientData(transformUserData(result.result || []));
      } else {
        ErrorService.errorMessage('Erreur', 'Impossible de charger la liste des clients');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      ErrorService.errorMessage('Erreur', 'Impossible de charger la liste des clients');
    } finally {
      setLoadingClients(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadGuests();
    loadClients();
  }, []);

  useEffect(() => {
    console.log("GUESTS :", guests, "CLIENTS", clients)
  })

  const guestColumns = [
    { name: 'name', label: 'Nom' },
    { name: 'email', label: 'Email' },
    { name: 'actions', label: 'Actions', actions: true },
  ];

  const clientColumns = [
    { name: 'name', label: 'Nom' },
    { name: 'email', label: 'Email' },
    { name: 'actions', label: 'Actions', actions: true },
  ];

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setPropertyData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    if (isConfirmedCopro && contractAddress && pendingBackendPayload) {
      const sendToBackend = async () => {
        const { imageUrl, apartment_count, street_number, ...rest } = pendingBackendPayload;
        await RealtyService.createRealty({
          ...rest,
          user_id: user?.id ?? 0,
          image_url: imageUrl,
          address: contractAddress,
          apartment_count: Number(apartment_count),
          street_number: street_number?.toString?.() ?? '',
        });
        setPropertyData({
          name: '',
          symbol: '',
          apartment_count: 0,
          promoter: '',
          imageUrl: '',
          street_number: 0,
          street_name: '',
          complement_address: '',
          city: '',
          zip_code: '',
          region: '',
          country: '',
          address: '',
        });
        setPendingBackendPayload(null);
        handleClose();
        loadClients();
        loadGuests();
      };
      sendToBackend();
    }
  }, [isConfirmedCopro, contractAddress, pendingBackendPayload, user]);

  // Gérer l'acceptation d'un client
  const handleAcceptClient = async (userId: number) => {
    try {
      setAcceptingClientId(userId);

      // Trouver l'utilisateur dans les données
      const userToAccept = guestData.find(u => u.id === userId);
      if (!userToAccept) {
        ErrorService.errorMessage('Erreur', 'Utilisateur non trouvé');
        return;
      }

      // Appel blockchain
      const tx = await acceptClient(userToAccept.eth_address as Address);
      // Attendre la confirmation de la transaction
      // La mise à jour en base se fera dans le useEffect qui surveille isAcceptClientConfirmed

    } catch (error) {
      console.error('Erreur lors de l\'acceptation du client:', error);
      ErrorService.errorMessage('Erreur', 'Impossible d\'accepter le client');
      setAcceptingClientId(null);
    }
  };

  // Surveiller la confirmation de la transaction d'acceptation
  useEffect(() => {
    if (isConfirmedClient && acceptingClientId) {
      console.log("Acceptation confirmée pour l'utilisateur ID:", acceptingClientId);
      const updateUserInBackend = async () => {
        try {
          // Mettre à jour le rôle en base de données
          const result = await UserService.updateUserRole(acceptingClientId, UserRoleIds.CLIENT);

          if (result.errorCode === 0) { // ServiceErrorCode.success
            ErrorService.successMessage('Succès', 'Client accepté avec succès');
            // Recharger les données
            loadGuests();
            loadClients();
          } else {
            ErrorService.errorMessage('Erreur', 'Impossible de mettre à jour le rôle en base de données');
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour du rôle:', error);
          ErrorService.errorMessage('Erreur', 'Impossible de mettre à jour le rôle en base de données');
        } finally {
          setAcceptingClientId(null);
        }
      };

      updateUserInBackend();
    }
  }, [isConfirmedClient, acceptingClientId]);

  // Gérer la révocation d'un client
  const handleRevokeClient = async (userId: number) => {
    try {
      setRevokingClientId(userId);
      // Trouver l'utilisateur dans les données
      const userToRevoke = clientData.find(u => u.id === userId);
      if (!userToRevoke) {
        ErrorService.errorMessage('Erreur', 'Utilisateur non trouvé');
        return;
      }
      // Appel blockchain
      const tx = await WriteRevokeClient({ args: [userToRevoke.eth_address as Address] });
      // Attendre la confirmation de la transaction
      // La mise à jour en base se fera dans le useEffect qui surveille isConfirmedRevoke
    } catch (error) {
      console.error('Erreur lors de la révocation du client:', error);
      ErrorService.errorMessage('Erreur', 'Impossible de révoquer le client');
      setRevokingClientId(null);
    }
  };

  // Surveiller la confirmation de la transaction de révocation
  useEffect(() => {
    if (isConfirmedRevoke && revokingClientId) {
      console.log("Révocation confirmée pour l'utilisateur ID:", revokingClientId);
      const updateUserInBackend = async () => {
        try {
          // Mettre à jour le rôle en base de données
          
          const result = await UserService.updateUserRole(revokingClientId, UserRoleIds.NOBODY);

          if (result.errorCode === 0) { // ServiceErrorCode.success
            ErrorService.successMessage('Succès', 'Client révoqué avec succès');
            // Recharger les données
            loadGuests();
            loadClients();
          } else {
            ErrorService.errorMessage('Erreur', 'Impossible de mettre à jour le rôle en base de données');
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour du rôle:', error);
          ErrorService.errorMessage('Erreur', 'Impossible de mettre à jour le rôle en base de données');
        } finally {
          setRevokingClientId(null);
        }
      };

      updateUserInBackend();
    }
  }, [isConfirmedRevoke, revokingClientId]);

  const handleSubmit = async () => {
    try {
      const tx = await createCopro(
        propertyData.name,
        propertyData.symbol,
        Number(propertyData.apartment_count),
        propertyData.promoter as Address,
        propertyData.imageUrl
      );
      setPendingBackendPayload(propertyData);
    } catch (error) {
      ErrorService.mixinMessage('Erreur lors de la création du bien', 'error');
      console.error(error);
    }
  };

  const handleAction = (id: number, action: string) => {
    switch (action) {
      case 'accept':
        if (acceptingClientId === id) {
          ErrorService.infoMessage('En cours', 'Acceptation en cours...');
          return;
        }
        if (acceptClientStatus === 'pending') {
          ErrorService.infoMessage('En cours', 'Une acceptation est déjà en cours...');
          return;
        }
        handleAcceptClient(id);
        break;
      case 'deny':
        ErrorService.mixinMessage("L'invité a été refusé", "error");
        break;
      case 'ban':
        if (revokeClientStatus === 'pending') {
          ErrorService.infoMessage('En cours', 'Une révocation est déjà en cours...');
          return;
        }
        if (revokingClientId === id) {
          ErrorService.infoMessage('En cours', 'Révocation en cours...');
          return;
        }
        handleRevokeClient(id);
        break;
      // ErrorService.mixinMessage("Le client a été banni", "info");
      // break;
    }
  };

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
              disabled={createCoproStatus === 'pending' || createCoproStatus === "success" && !isConfirmedCopro}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                text-white font-medium px-6 py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createCoproStatus === 'pending' || createCoproStatus === "success" && !isConfirmedCopro ? (
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
            >
              <CustomDataTable
                title="Liste d'attente des invités"
                data={loadingGuests ? [] : guestData}
                columns={guestColumns}
                onAction={handleAction}
              />
              {loadingGuests && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center text-blue-400">
                    <div className="w-4 h-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mr-2"></div>
                    Chargement des invités...
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CustomDataTable
                title="Liste des clients"
                data={loadingClients ? [] : clientData}
                columns={clientColumns}
                onAction={handleAction}
              />
              {loadingClients && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center text-blue-400">
                    <div className="w-4 h-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mr-2"></div>
                    Chargement des clients...
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AgentOrAgency;

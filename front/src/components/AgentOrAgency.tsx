import React, { useState } from 'react';
import { Button, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import AddCoproDialog from './dialog/AddCopro';
import { ErrorService } from '@/service/error.service';

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
    apartments: '',
    promoterAddress: '',
  });

  const guestData = [
    { id: 1, name: 'Alice Dupont', email: 'alice.dupont@example.com' },
    { id: 2, name: 'Bob Martin', email: 'bob.martin@example.com' },
  ];

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
        customBodyRenderLite: (dataIndex: any) => (
          <div className="flex gap-2">
            <Button variant="contained" color="success" onClick={() => handleAccept(guestData[dataIndex].id)}>
              Accepter
            </Button>
            <Button variant="contained" color="error" onClick={() => handleDeny(guestData[dataIndex].id)}>
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
          <Button variant="contained" color="warning" onClick={() => handleBan(clientData[dataIndex].id)}>
            Bannir
          </Button>
        ),
      },
    },
  ];

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e : any) => {
    const { name, value } = e.target;
    setPropertyData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    ErrorService.mixinMessage("Nouveau bien ajouté", "success");
    setPropertyData({ name: '', symbol: '', apartments: '', promoterAddress: '' });
    handleClose();
  };

  const handleAccept = (id : number) => ErrorService.mixinMessage("L'invité a été accepté", "success");
  const handleDeny = (id : number) => ErrorService.mixinMessage("L'invité a été refusé", "error");
  const handleBan = (id : number) => ErrorService.mixinMessage("Le client a été banni", "info");

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="min-h-screen p-8" style={{ backgroundColor: darkTheme.palette.background.default, color: darkTheme.palette.text.primary }}>
        <h1 className="text-2xl font-bold mb-4">Agent's dashboard</h1>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add a new Copro
        </Button>

        <AddCoproDialog
          open={open}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          propertyData={propertyData}
        />

        <h2 className="text-xl font-semibold mt-8">Guest waitlist</h2>
        <div className="mt-4">
          <MUIDataTable title="Guest list" data={guestData} columns={guestColumns} options={{ selectableRows: 'none' }} />
        </div>

        <h2 className="text-xl font-semibold mt-8">Clients</h2>
        <div className="mt-4">
          <MUIDataTable title="Client list" data={clientData} columns={clientColumns} options={{ selectableRows: 'none' }} />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AgentOrAgency;

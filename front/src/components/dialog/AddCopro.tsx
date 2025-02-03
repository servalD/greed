import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { AddCoproDialogProps } from '@/interfaces/AddCopro.interface';

const AddCoproDialog: React.FC<AddCoproDialogProps> = ({ open, handleClose, handleSubmit, handleChange, propertyData }) => {
  return (
    <Dialog open={open} onClose={handleClose} sx={{ "& .MuiPaper-root": { backgroundColor: "#2E2E2E", color: "#fff" } }}>
      <DialogTitle>Add a new Copro</DialogTitle>
      <DialogContent>
        {["name", "symbol", "apartments", "promoterAddress"].map((field) => (
          <TextField
            key={field}
            margin="dense"
            name={field}
            label={field === "apartments" ? "Nombre d'appartements" : field.charAt(0).toUpperCase() + field.slice(1)}
            type={field === "apartments" ? "number" : "text"}
            fullWidth
            variant="outlined"
            InputLabelProps={{ style: { color: '#bbb' } }}
            InputProps={{ style: { color: '#fff', backgroundColor: '#424242' } }}
            value={propertyData[field as keyof typeof propertyData]}
            onChange={handleChange}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: "#fff" }}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          sx={{ bgcolor: "#4CAF50", color: "#fff", '&:hover': { bgcolor: "#388E3C" } }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCoproDialog;

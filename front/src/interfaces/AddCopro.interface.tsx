export interface AddCoproDialogProps {
    open: boolean;
    handleClose: () => void;
    handleSubmit: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    propertyData: {
      name: string;
      symbol: string;
      apartments: string;
      promoterAddress: string;
    };
}
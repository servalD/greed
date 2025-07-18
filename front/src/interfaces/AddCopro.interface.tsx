export interface AddCoproDialogProps {
    open: boolean;
    handleClose: () => void;
    handleSubmit: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    propertyData: {
      name: string;
      symbol: string;
      flatCount: number;
      promoter: string;
      imageUrl: string;
    };
}

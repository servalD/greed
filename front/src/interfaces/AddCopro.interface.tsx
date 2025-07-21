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
      street_number: number;
      street_name: string;
      complement_address?: string;
      city: string;
      zip_code: string;
      region: string;
      country: string;
      address: string;
    };
}

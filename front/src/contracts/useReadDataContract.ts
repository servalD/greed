import { useReadAgencyGuests, useReadAgencyClients } from "./generatedContracts";
import { Address } from "thirdweb";

export const useReadDataContract = () => {

  const { data: guests, refetch: refetchGuests } = useReadAgencyGuests();
  const { data: clients, refetch: refetchClients } = useReadAgencyClients();

  return {
    guests: guests as Address[] || [],
    clients: clients as Address[] || [],
    refetchGuests,
    refetchClients,
  };
};

import { useReadAgencyGuests, useReadAgencyClients, useReadManagerGetRole } from "./generatedContracts";
import { useAccount } from "wagmi";
import { UserRoleIds } from "@/types/users";
import { Address } from "thirdweb";
import { useEffect } from "react";

export const useReadDataContract = () => {
  const { address } = useAccount();

  // Role verification
  const { data: userRole, refetch: refetchUserRole } = useReadManagerGetRole({
    args: [address!], });

  const { data: guests, refetch: refetchGuests } = useReadAgencyGuests();
  const { data: clients, refetch: refetchClients } = useReadAgencyClients();

  // useEffect(() => {
  //   refetchUserRole();
  // }, [address]);

  return {
    userRole: userRole ? Number(userRole) as UserRoleIds : UserRoleIds.GUEST,
    guests: guests as Address[] || [],
    clients: clients as Address[] || [],
    refetchUserRole,
    refetchGuests,
    refetchClients,
  };
};

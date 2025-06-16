import { useReadManagerHasRole, useReadAgencyGuests, useReadAgencyClientRole } from "./generatedContracts";
import { useAccount } from "wagmi";
import { useMemo } from "react";

const AGENCY_ROLE = 1;
const AGENT_ROLE = 2;
const CLIENT_ROLE = 3;
const CO_OWNER_ROLE = 4;

export const useReadDataContract = () => {
  const { address } = useAccount();

  // Role verification
  const { data: isAgency, refetch: refetchAgency } = useReadManagerHasRole({ args: [BigInt(AGENCY_ROLE), address as `0x${string}`] });
  const { data: isAgent, refetch: refetchAgent } = useReadManagerHasRole({ args: [BigInt(AGENT_ROLE), address as `0x${string}`] });
  const { data: isClient, refetch: refetchClient } = useReadManagerHasRole({ args: [BigInt(CLIENT_ROLE), address as `0x${string}`] });
  const { data: isCoOwner, refetch: refetchCoOwner } = useReadManagerHasRole({ args: [BigInt(CO_OWNER_ROLE), address as `0x${string}`] });

  const userRole = useMemo(() => {
    if (isAgency) return "agency";
    if (isAgent) return "agent";
    if (isClient) return "client";
    if (isCoOwner) return "coOwner";
    return "guest";
  }, [isAgency, isAgent, isClient, isCoOwner]);

  /*  */

  const { data: guests, refetch: refetchGuests } = useReadAgencyGuests();
  const { data: clients, refetch: refetchClients } = useReadAgencyClientRole();

  const refetchUserRole = async () => {
    await Promise.all([
      refetchAgency(),
      refetchAgent(),
      refetchClient(),
      refetchCoOwner(),
      refetchGuests(),
      refetchClients()
    ]);
  };

  return { userRole, guests, clients, refetchUserRole };
};

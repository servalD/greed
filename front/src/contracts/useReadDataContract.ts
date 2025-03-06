import { useReadManagerHasRole } from "./generatedContracts";
import { useAccount } from "wagmi";
import { useMemo } from "react";

const AGENCY_ROLE = 1;
const AGENT_ROLE = 2;
const CLIENT_ROLE = 3;
const CO_OWNER_ROLE = 4;

export const useReadDataContract = () => {
  const { address } = useAccount();

  const { data: isAgency } = useReadManagerHasRole({ args: [BigInt(AGENCY_ROLE), address as `0x${string}`] });
  const { data: isAgent } = useReadManagerHasRole({ args: [BigInt(AGENT_ROLE), address as `0x${string}`] });
  const { data: isClient } = useReadManagerHasRole({ args: [BigInt(CLIENT_ROLE), address as `0x${string}`] });
  const { data: isCoOwner } = useReadManagerHasRole({ args: [BigInt(CO_OWNER_ROLE), address as `0x${string}`] });

  const userRole = useMemo(() => {
    if (isAgency) return "agency";
    if (isAgent) return "agent";
    if (isClient) return "client";
    if (isCoOwner) return "coOwner";
    return "guest";
  }, [isAgency, isAgent, isClient, isCoOwner]);

  return { userRole };
};

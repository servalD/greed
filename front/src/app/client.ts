"use client"
import { createThirdwebClient } from "thirdweb";
import { config as dotenvConf } from "dotenv";
dotenvConf();
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, anvil } from 'wagmi/chains'

// Thirdweb client
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID as string;

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
});

// Wagmi config
export const config = createConfig({
  chains: [anvil, sepolia],
  transports: {
    [anvil.id]: http(),
    [sepolia.id]: http(),
  },
})

import { createThirdwebClient } from "thirdweb";
import { config } from "dotenv";

config();

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID as string;

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
});
import { createThirdwebClient } from "thirdweb";

const clientId = '345a045b6c7bd174fa7febdb2e4739a7';

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
});
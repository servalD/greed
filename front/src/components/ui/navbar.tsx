"use client";

import { ConnectButton, useSwitchActiveWalletChain } from "thirdweb/react";
import { client } from "../../app/client";
import { sepolia } from "thirdweb/chains";
import { useEffect } from "react";

export default function Navbar({connectionStatus}: {connectionStatus: string}) {
  const switchChain = useSwitchActiveWalletChain();

  useEffect(() => {
    if (connectionStatus === "connected") switchChain(sepolia);
  }, [connectionStatus])

  return (
    <nav className="w-full bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">GREED Agency</div>
        <div className="flex justify-center">
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Copro App",
              url: "",
            }}
          />
        </div>
      </div>
    </nav>
  );
}

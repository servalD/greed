"use client";

import { ConnectButton } from "thirdweb/react";
import { client } from "../../app/client";
import { useSwitchActiveWalletChain } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";

export default function Navbar() {
    const switchChain = useSwitchActiveWalletChain();
  return (
    <nav className="w-full bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Copro App</div>
        <div className="flex justify-center">
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Copro App",
              url: "",
            }}
          />
          <button onClick={() => switchChain(sepolia)}>Switch Chain</button>
        </div>
      </div>
    </nav>
  );
}

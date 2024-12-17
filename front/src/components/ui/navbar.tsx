"use client";

import { ConnectButton } from "thirdweb/react";
import { client } from "../../app/client";

export default function Navbar() {
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
        </div>
      </div>
    </nav>
  );
}

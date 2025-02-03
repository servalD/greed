"use client";

import { ConnectButton, useSwitchActiveWalletChain } from "thirdweb/react";
import { client } from "../../app/client";
import { sepolia } from "thirdweb/chains";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAgency } from "@/contracts/useAgency";

export default function Navbar({connectionStatus}: {connectionStatus: string}) {

  const switchChain = useSwitchActiveWalletChain();
  const [role, setRole] = useState<string>("guest");
  const contractAddress = '0xA662Ed93e6960a3cfd878cF58206fa71f93efe75';
  const router = useRouter();

  const { guestEntrance, isPending } = useAgency(contractAddress);

  useEffect(() => {
    if (connectionStatus === "connected") {
      switchChain(sepolia);
    }
    setRole("guest");
    localStorage.setItem("role", "guest");
  }, [connectionStatus]);

  return (
    <nav className="w-full bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold" onClick={() => router.push('/')}>GREED Agency</div>
        <div className="flex justify-center">
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Copro App",
              url: "",
            }}
          />
          {role === "guest" && (
            <button
              className="w-full px-4 py-2 text-sm font-medium rounded shadow-md bg-gray-600 text-white hover:bg-gray-700 ml-4"
              onClick={guestEntrance}
              disabled={isPending}
            >
              {isPending ? "En attente..." : "Rejoindre"}
            </button>
          )}
          {role === "agent" && (
            <button
              className="px-4 py-2 ml-3 text-sm font-medium rounded-lg shadow-md bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
              onClick={() => router.push("/admin")}
            >
              Admin Panel
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

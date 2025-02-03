"use client";

import { ConnectButton, useSwitchActiveWalletChain } from "thirdweb/react";
import { client } from "../../app/client";
import { sepolia } from "thirdweb/chains";
import { useEffect, useState } from "react";
import { ErrorService } from "@/service/error.service";
import { useWaitForTransactionReceipt, useWriteContract, useAccount } from 'wagmi';
import { agencyAbi } from "@/contracts/generatedContracts";
import { useRouter } from "next/navigation";

export default function Navbar({connectionStatus}: {connectionStatus: string}) {

  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const { isConnected, connector, address } = useAccount();
  const switchChain = useSwitchActiveWalletChain();
  const [role, setRole] = useState<string>("guest");
  const [txHash, setTxHash] = useState<string | null>(null);
  const contractAddress = '0xA662Ed93e6960a3cfd878cF58206fa71f93efe75';
  const router = useRouter();

  useEffect(() => {
    if (connectionStatus === "connected") {
      switchChain(sepolia);
    }
    setRole("agent");
    localStorage.setItem("role", "agent");
  }, [connectionStatus]);

  useEffect(() => {
    if (txHash && isConfirmed) {
      ErrorService.infoMessage("Rejoindre", "Votre demande a bien été soumise");
    }
  }, [isConfirmed, txHash]);

  async function handleJoin() {
    if (!isConnected) {
      await connector?.connect();
    }

    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: agencyAbi,
        functionName: "GuestEntrance",
        args: [],
      });

      console.log("Transaction envoyée:", tx);
      setTxHash(tx);

    } catch (err: any) {
      console.error("Erreur lors de la transaction:", err);
    }
  }

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
              onClick={handleJoin}
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

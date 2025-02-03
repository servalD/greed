"use client";

import { ConnectButton, useSwitchActiveWalletChain } from "thirdweb/react";
import { client } from "../../app/client";
import { sepolia } from "thirdweb/chains";
import { useEffect, useState } from "react";
import { ErrorService } from "@/service/error.service";
import { useWaitForTransactionReceipt, useWriteContract, useAccount } from 'wagmi';
import { agencyAbi } from "@/contracts/generatedContracts";

export default function Navbar({connectionStatus}: {connectionStatus: string}) {

  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isSuccess: isConfirmed} = useWaitForTransactionReceipt({ hash });
  const {isConnected, connector, address} = useAccount();
  const switchChain = useSwitchActiveWalletChain();
  const [role, setRole] = useState<string>();
  const contractAddress = '0xA662Ed93e6960a3cfd878cF58206fa71f93efe75'

  useEffect(() => {
    if (connectionStatus === "connected") switchChain(sepolia);
    setRole('guest')
    localStorage.setItem('role', 'guest')
  }, [connectionStatus])

  async function handleJoin() {

    if (!isConnected) {
      await connector?.connect();
    }

    try {

      const tx = writeContractAsync({
        address: contractAddress,
        abi: agencyAbi,
        functionName: 'GuestEntrance',
        args: []
      })

      await isConfirmed;

      if (isConfirmed) {
        ErrorService.infoMessage('Rejoindre', 'Votre demande a bien été soumise')
    }

    } catch (err: any) {
      console.log(err)
    }
  
  }

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
          { role === 'guest' && 
            <button className={`w-full px-4 py-2 text-sm font-medium rounded shadow-md bg-gray-600 text-white hover:bg-gray-700 ml-4`} onClick={handleJoin}>
              Rejoindre
            </button> 
          }
        </div>
      </div>
    </nav>
  );
}

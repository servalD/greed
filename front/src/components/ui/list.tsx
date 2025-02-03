"use client";

import { useEffect, useState } from "react";
import { ErrorService } from "@/service/error.service";
import { Images } from "@/types/resources";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { coproAbi } from "@/contracts/generatedContracts";

export default function List({ images }: { images: Images[] }) {
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const { isConnected, connector, address } = useAccount();
  const [txHash, setTxHash] = useState<string | null>(null);
  const contractAddress = '0x574EAB16A1B1A94605bb7214b0518aCEf817f6a9';
  
  const [minted, setMinted] = useState<number[]>([]);

  useEffect(() => {
    if (txHash && isConfirmed) {
      ErrorService.infoMessage("Acheter", "L'achat a été effectué avec succès !");
    }
  }, [isConfirmed, txHash]);

  const handleMint = async (id: number) => {
    if (localStorage.getItem('role') === 'guest') {
      ErrorService.mixinMessage('Vous n\'avez pas les droits pour acheter', 'error')
      return;
    }

    if (!isConnected) {
      await connector?.connect();
    }

    ErrorService.mixinMessage(`Minting NFT for image ID: ${id}`, "info");

    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: coproAbi,
        functionName: "buy",
        args: [BigInt(0)],
      });

      console.log("Transaction envoyée:", tx);
      setTxHash(tx);

      setMinted((prev) => [...prev, id]);

    } catch (err: any) {
      console.error("Erreur lors de la transaction:", err);
    }

  };

  return (
    <div className="bg-gray-900 min-h-screen py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden p-4 flex flex-col items-center"
            >
              <img
                src={image.src}
                alt="Not found"
                className="h-64 w-full object-cover rounded-md mb-4"
              />
              <button
                onClick={() => handleMint(image.id)}
                disabled={minted.includes(image.id)}
                className={`w-full px-4 py-2 text-sm font-medium rounded shadow-md ${
                  minted.includes(image.id)
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {minted.includes(image.id) ? "Minted" : "Mint"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

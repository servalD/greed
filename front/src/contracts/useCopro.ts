import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { coproAbi } from "@/contracts/generatedContracts";
import { ErrorService } from "@/service/error.service";

export const useCopro = (contractAddress: `0x${string}`) => {
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const { isConnected, connector } = useAccount();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [minted, setMinted] = useState<number[]>([]);

  useEffect(() => {
    if (txHash && isConfirmed) {
      ErrorService.successMessage("Acheter", "L'achat a été effectué avec succès !");
    }
  }, [isConfirmed, txHash]);

  const buy = async (id: number) => {
    if (localStorage.getItem("role") === "guest") {
      ErrorService.mixinMessage("You don't have the rights", "error");
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

  return { buy, isPending, minted };
};

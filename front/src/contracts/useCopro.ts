import { useState, useEffect } from "react";
import { useWaitForTransactionReceipt, useAccount } from "wagmi";
import { ErrorService } from "@/service/error.service";
import { useWriteCoproBuy } from "./generatedContracts";

export const useCopro = () => {
  const { isConnected, connector } = useAccount();
  const { writeContractAsync, data: hash, isPending } = useWriteCoproBuy();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [txHash, setTxHash] = useState<string | null>(null);
  const [bought, setBought] = useState<number[]>([]);

  useEffect(() => {
    if (txHash && isConfirmed) {
      ErrorService.successMessage("Buy", "Buy done with success !");
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

    ErrorService.mixinMessage(`Buying NFT for image ID: ${id}`, "info");

    try {
      const tx = await writeContractAsync({ args: [BigInt(id)] });

      console.log("Transaction envoyée:", tx);
      setTxHash(tx);
      setBought((prev) => [...prev, id]);

    } catch (err: any) {
      ErrorService.errorMessage("Erreur lors de la transaction:", err);
    }
  };

  return { buy, isPending, bought };
};

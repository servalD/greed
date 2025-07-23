import { useState, useEffect } from "react";
import { useWaitForTransactionReceipt, useAccount, useReadContract } from "wagmi";
import { ErrorService } from "@/service/error.service";
import { useWriteCoproBuy, coproAbi } from "./generatedContracts";
import { Address } from "viem";

export const useCopro = (coproAddress?: Address) => {
  const { isConnected, connector } = useAccount();
  const { writeContractAsync, data: hash, isPending } = useWriteCoproBuy();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [txHash, setTxHash] = useState<string | null>(null);
  const [bought, setBought] = useState<number[]>([]);

  useEffect(() => {
    if (txHash && isConfirmed) {
      ErrorService.successMessage("Achat", "Achat effectué avec succès !");
    }
  }, [isConfirmed, txHash]);

  const buy = async (tokenId: number, price: bigint) => {
    if (localStorage.getItem("role") === "guest") {
      ErrorService.mixinMessage("Vous n'avez pas les droits pour acheter", "error");
      return;
    }

    if (!isConnected) {
      await connector?.connect();
    }

    if (!coproAddress) {
      ErrorService.mixinMessage("Adresse du contrat Copro non disponible", "error");
      return;
    }

    ErrorService.mixinMessage(`Achat de l'appartement #${tokenId + 1}`, "info");

    try {
      const tx = await writeContractAsync({ 
        args: [BigInt(tokenId)],
        value: price
      });

      console.log("Transaction envoyée:", tx);
      setTxHash(tx);
      setBought((prev) => [...prev, tokenId]);

    } catch (err: unknown) {
      ErrorService.errorMessage("Erreur lors de la transaction:", err as string);
    }
  };

  const sell = async (tokenId: number, price: bigint) => {
    if (!coproAddress) {
      ErrorService.mixinMessage("Adresse du contrat Copro non disponible", "error");
      return;
    }

    try {
      // todo Utiliser useWriteContract pour la fonction sell
      ErrorService.mixinMessage(`Mise en vente de l'appartement #${tokenId + 1}`, "info");
    } catch (err: unknown) {
      ErrorService.errorMessage("Erreur lors de la mise en vente:", err as string);
    }
  };

  const cancelSale = async (tokenId: number) => {
    if (!coproAddress) {
      ErrorService.mixinMessage("Adresse du contrat Copro non disponible", "error");
      return;
    }

    try {
      // todo Utiliser useWriteContract pour la fonction cancelSale
      ErrorService.mixinMessage(`Annulation de la vente de l'appartement #${tokenId + 1}`, "info");
    } catch (err: unknown) {
      ErrorService.errorMessage("Erreur lors de l'annulation:", err as string);
    }
  };

  return { 
    buy, 
    sell, 
    cancelSale,
    isPending, 
    bought,
    isConfirmed 
  };
};

import { useState, useEffect } from "react";
import { useWaitForTransactionReceipt, useAccount } from "wagmi";
import { ErrorService } from "@/service/error.service";
import { useWriteAgencyGuestEntrance, useWriteAgencyCreateCopro } from "./generatedContracts";
import { Address } from "viem";

export const useAgency = () => {
  const { isConnected, connector } = useAccount();
  const { writeContractAsync: WriteGuest, data: hashGuest, isPending: isPendingGuest } = useWriteAgencyGuestEntrance();
  const { writeContractAsync: WriteCreateCopro, data: hashCopro, isPending: isPendingCopro } = useWriteAgencyCreateCopro();
  const { isSuccess: isConfirmedGuest } = useWaitForTransactionReceipt({ hash: hashGuest });
  const { isSuccess: isConfirmedCopro } = useWaitForTransactionReceipt({ hash: hashCopro });

  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    if (txHash && isConfirmedGuest) {
      ErrorService.infoMessage("Rejoindre", "Votre demande a bien été soumise");
    } else if (txHash && isConfirmedCopro) {
        ErrorService.infoMessage("Creation", "Copro créée");
    }
  }, [isConfirmedGuest, isConfirmedCopro, txHash]);

  const guestEntrance = async () => {
    if (!isConnected) {
      await connector?.connect();
    }

    try {
      const tx = await WriteGuest({});
      console.log("Transaction envoyée:", tx);
      setTxHash(tx);
    } catch (err: any) {
      console.error("Erreur lors de la transaction:", err);
    }
  };

  const createCopro = async (name: string, symbol: string, flatCount: number, promoter: Address) => {
    if (!isConnected) {
        await connector?.connect();
    }

    try {
        const tx = await WriteCreateCopro({ args: [name, symbol, BigInt(flatCount), promoter] })
        console.log("Transaction envoyée:", tx);
        setTxHash(tx);
    } catch (err: any) {
        console.error("Erreur lors de la transaction:", err);
    }

  }

  return { guestEntrance, isPendingGuest, createCopro, isPendingCopro };
};

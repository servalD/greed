import { useState, useEffect } from "react";
import { useWaitForTransactionReceipt, useAccount } from "wagmi";
import { ErrorService } from "@/service/error.service";
import { useWriteAgencyGuestEntrance } from "./generatedContracts";

export const useAgency = () => {
  const { isConnected, connector } = useAccount();
  const { writeContractAsync, data: hash, isPending } = useWriteAgencyGuestEntrance();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    if (txHash && isConfirmed) {
      ErrorService.infoMessage("Rejoindre", "Votre demande a bien été soumise");
    }
  }, [isConfirmed, txHash]);

  const guestEntrance = async () => {
    if (!isConnected) {
      await connector?.connect();
    }

    try {
      const tx = await writeContractAsync({});
      console.log("Transaction envoyée:", tx);
      setTxHash(tx);
    } catch (err: any) {
      console.error("Erreur lors de la transaction:", err);
    }
  };

  return { guestEntrance, isPending };
};

import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { agencyAbi } from "@/contracts/generatedContracts";
import { ErrorService } from "@/service/error.service";

export const useAgency = (contractAddress: `0x${string}`) => {
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const { isConnected, connector } = useAccount();
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
  };

  return { guestEntrance, isPending };
};

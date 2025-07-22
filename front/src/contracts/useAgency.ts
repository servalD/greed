import { useState, useEffect } from "react";
import { useWaitForTransactionReceipt, useAccount } from "wagmi";
import { ErrorService } from "@/service/error.service";
import { useWriteAgencyGuestEntrance, useWriteAgencyCreateCopro, useWriteAgencyAcceptClient, useWriteAgencyRevokeClient } from "./generatedContracts";
import { Address, UnknownNodeError } from "viem";

export const useAgency = () => {
  const { isConnected, connector } = useAccount();
  const { writeContractAsync: WriteGuest, status: guestEntranceStatus, data: guestTx } = useWriteAgencyGuestEntrance();
  const { writeContractAsync: WriteCreateCopro, status: createCoproStatus, data: coproTx } = useWriteAgencyCreateCopro();
  const { writeContractAsync: WriteAcceptClient, status: acceptClientStatus, data: acceptClientTx } = useWriteAgencyAcceptClient();
  const { writeContractAsync: WriteRevokeClient, status: revokeClientStatus, data: revokeClientTx } = useWriteAgencyRevokeClient();

  const { isSuccess: isConfirmedGuest } = useWaitForTransactionReceipt({ hash: guestTx });
  const { isSuccess: isConfirmedCopro } = useWaitForTransactionReceipt({ hash: coproTx });
  const { isSuccess: isConfirmedClient } = useWaitForTransactionReceipt({ hash: acceptClientTx });
  const { isSuccess: isConfirmedRevoke } = useWaitForTransactionReceipt({ hash: revokeClientTx });

  useEffect(() => {
    if (guestEntranceStatus === "success") {
      ErrorService.infoMessage("Rejoindre", "Votre demande a bien été soumise");
    } else if (createCoproStatus === "success") {
      ErrorService.infoMessage("Creation", "Copro créée");
    } else if (acceptClientStatus === "success") {
      ErrorService.infoMessage("Acceptation", "Client accepté");
    } else if (revokeClientStatus === "success") {
      ErrorService.infoMessage("Révocation", "Client révoqué");
    }
  }, [isConfirmedGuest, isConfirmedCopro, isConfirmedClient, isConfirmedRevoke]);

  const guestEntrance = async () => {
    if (!isConnected) {
      await connector?.connect();
    }

    try {
      const tx = await WriteGuest({});
      console.log("Transaction envoyée:", tx);
      return tx
    } catch (err: unknown) {
      console.error("Erreur lors de la transaction:", err as string);
    }
  };

  const createCopro = async (name: string, symbol: string, flatCount: number, promoter: Address, imageUrl: string) => {
    if (!isConnected) {
        await connector?.connect();
    }

    try {
      const tx = await WriteCreateCopro({ args: [name, symbol, BigInt(flatCount), promoter, imageUrl] })
      console.log("Transaction envoyée:", tx);
      return tx;
    } catch (err: unknown) {
      console.error("Erreur lors de la transaction:", err as string);
      throw err;
    }
  }

  const acceptClient = async (client: Address) => {
    if (!isConnected) {
      await connector?.connect();
    }

    try {
      const tx = await WriteAcceptClient({ args: [client] })
      console.log("Transaction envoyée:", tx);
      return tx
    } catch (err: unknown) {
      console.error("Erreur lors de la transaction:", err as string);
      throw err;
    }
  }

  return { guestEntrance, guestEntranceStatus, isConfirmedGuest, createCopro, createCoproStatus, isConfirmedCopro, acceptClient, acceptClientStatus, isConfirmedClient, WriteRevokeClient, revokeClientStatus, isConfirmedRevoke};
};

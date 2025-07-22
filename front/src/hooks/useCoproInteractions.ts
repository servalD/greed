import { useState, useEffect, useCallback } from 'react';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { Address } from 'viem';
import { useWriteContract } from 'wagmi';
import { coproAbi } from '@/contracts/generatedContracts';
import { ErrorService } from '@/service/error.service';
import { CoproService } from '@/service/copro.service';

export interface CoproTransaction {
  type: 'buy' | 'sell' | 'cancelSale';
  tokenId: number;
  price?: bigint;
  hash?: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export const useCoproInteractions = (coproAddress?: Address) => {
  const { address: userAddress, isConnected, connector } = useAccount();
  const [transactions, setTransactions] = useState<CoproTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Gérer les transactions confirmées
  useEffect(() => {
    if (hash && isConfirmed) {
      setTransactions(prev => 
        prev.map(tx => 
          tx.hash === hash 
            ? { ...tx, status: 'success' as const }
            : tx
        )
      );
      setIsProcessing(false);
      ErrorService.successMessage("Transaction", "Transaction confirmée avec succès !");
    }
  }, [hash, isConfirmed]);

  // Fonction d'achat d'appartement
  const buyApartment = useCallback(async (tokenId: number, price: bigint) => {
    if (!coproAddress) {
      const error = "Adresse du contrat Copro non disponible";
      ErrorService.mixinMessage(error, "error");
      return;
    }

    if (!isConnected) {
      try {
        await connector?.connect();
      } catch (err) {
        ErrorService.mixinMessage("Échec de la connexion au wallet", "error");
        return;
      }
    }

    if (localStorage.getItem("role") === "guest") {
      ErrorService.mixinMessage("Vous n'avez pas les droits pour acheter", "error");
      return;
    }

    const transaction: CoproTransaction = {
      type: 'buy',
      tokenId,
      price,
      status: 'pending'
    };

    setTransactions(prev => [...prev, transaction]);
    setIsProcessing(true);

    try {
      ErrorService.mixinMessage(`Achat de l'appartement #${tokenId + 1}`, "info");

      const tx = await writeContractAsync({
        address: coproAddress,
        abi: coproAbi,
        functionName: 'buy',
        args: [BigInt(tokenId)],
        value: price,
      });

      setTransactions(prev => 
        prev.map(t => 
          t.tokenId === tokenId && t.type === 'buy'
            ? { ...t, hash: tx, status: 'pending' as const }
            : t
        )
      );

    } catch (err: unknown) {
      const errorMessage = CoproService.getErrorMessage(err);
      ErrorService.errorMessage("Erreur lors de l'achat:", errorMessage);
      
      setTransactions(prev => 
        prev.map(t => 
          t.tokenId === tokenId && t.type === 'buy'
            ? { ...t, status: 'error' as const, error: errorMessage }
            : t
        )
      );
      setIsProcessing(false);
    }
  }, [coproAddress, isConnected, connector, writeContractAsync]);

  // Fonction de mise en vente d'appartement
  const sellApartment = useCallback(async (tokenId: number, price: bigint) => {
    if (!coproAddress) {
      const error = "Adresse du contrat Copro non disponible";
      ErrorService.mixinMessage(error, "error");
      return;
    }

    if (!isConnected) {
      try {
        await connector?.connect();
      } catch (err) {
        ErrorService.mixinMessage("Échec de la connexion au wallet", "error");
        return;
      }
    }

    const transaction: CoproTransaction = {
      type: 'sell',
      tokenId,
      price,
      status: 'pending'
    };

    setTransactions(prev => [...prev, transaction]);
    setIsProcessing(true);

    try {
      ErrorService.mixinMessage(`Mise en vente de l'appartement #${tokenId + 1}`, "info");

      const tx = await writeContractAsync({
        address: coproAddress,
        abi: coproAbi,
        functionName: 'sell',
        args: [BigInt(tokenId), price],
      });

      setTransactions(prev => 
        prev.map(t => 
          t.tokenId === tokenId && t.type === 'sell'
            ? { ...t, hash: tx, status: 'pending' as const }
            : t
        )
      );

    } catch (err: unknown) {
      const errorMessage = CoproService.getErrorMessage(err);
      ErrorService.errorMessage("Erreur lors de la mise en vente:", errorMessage);
      
      setTransactions(prev => 
        prev.map(t => 
          t.tokenId === tokenId && t.type === 'sell'
            ? { ...t, status: 'error' as const, error: errorMessage }
            : t
        )
      );
      setIsProcessing(false);
    }
  }, [coproAddress, isConnected, connector, writeContractAsync]);

  // Fonction d'annulation de vente
  const cancelSale = useCallback(async (tokenId: number) => {
    if (!coproAddress) {
      const error = "Adresse du contrat Copro non disponible";
      ErrorService.mixinMessage(error, "error");
      return;
    }

    if (!isConnected) {
      try {
        await connector?.connect();
      } catch (err) {
        ErrorService.mixinMessage("Échec de la connexion au wallet", "error");
        return;
      }
    }

    const transaction: CoproTransaction = {
      type: 'cancelSale',
      tokenId,
      status: 'pending'
    };

    setTransactions(prev => [...prev, transaction]);
    setIsProcessing(true);

    try {
      ErrorService.mixinMessage(`Annulation de la vente de l'appartement #${tokenId + 1}`, "info");

      const tx = await writeContractAsync({
        address: coproAddress,
        abi: coproAbi,
        functionName: 'cancelSale',
        args: [BigInt(tokenId)],
      });

      setTransactions(prev => 
        prev.map(t => 
          t.tokenId === tokenId && t.type === 'cancelSale'
            ? { ...t, hash: tx, status: 'pending' as const }
            : t
        )
      );

    } catch (err: unknown) {
      const errorMessage = CoproService.getErrorMessage(err);
      ErrorService.errorMessage("Erreur lors de l'annulation:", errorMessage);
      
      setTransactions(prev => 
        prev.map(t => 
          t.tokenId === tokenId && t.type === 'cancelSale'
            ? { ...t, status: 'error' as const, error: errorMessage }
            : t
        )
      );
      setIsProcessing(false);
    }
  }, [coproAddress, isConnected, connector, writeContractAsync]);

  // Obtenir le statut d'une transaction pour un appartement
  const getTransactionStatus = useCallback((tokenId: number, type: 'buy' | 'sell' | 'cancelSale') => {
    const transaction = transactions.find(t => t.tokenId === tokenId && t.type === type);
    return transaction?.status || null;
  }, [transactions]);

  // Nettoyer les anciennes transactions
  const clearTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  return {
    buyApartment,
    sellApartment,
    cancelSale,
    getTransactionStatus,
    clearTransactions,
    isProcessing,
    isPending,
    isConfirmed,
    transactions,
    userAddress,
    isConnected
  };
}; 
import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { coproAbi } from "./generatedContracts";
import { Address } from "viem";
import { RealtyService } from "@/service/realty.service";
import { ServiceErrorCode } from "@/service/service.result";

export interface Apartment {
  id: number;
  owner: Address;
  isForSale: boolean;
  price?: bigint;
  image?: string;
  exists: boolean;
}

const MAX_APARTMENTS = 20;

export const useCoproApartments = (realtyId: number) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coproAddress, setCoproAddress] = useState<Address | null>(null);

  useEffect(() => {
    const fetchRealty = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await RealtyService.getRealtyById(realtyId);
        
        if (result.errorCode === ServiceErrorCode.success && result.result) {
          setCoproAddress(result.result.address as Address);
        } else {
          setError("Impossible de récupérer les informations de la realty");
          setLoading(false);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de la realty:", err);
        setError("Erreur lors de la récupération de la realty");
        setLoading(false);
      }
    };

    fetchRealty();
  }, [realtyId]);

  const { data: initialFlats } = useReadContract({
    address: coproAddress as Address | undefined,
    abi: coproAbi,
    functionName: 'initialFlats',
  });

  const { data: additionalFlats } = useReadContract({
    address: coproAddress as Address | undefined,
    abi: coproAbi,
    functionName: 'additionalFlats',
  });

  const totalFlats = Math.min(Number(initialFlats || 0) + Number(additionalFlats || 0), MAX_APARTMENTS);

  const ownerResults: ReturnType<typeof useReadContract>[] = [];
  const marketResults: ReturnType<typeof useReadContract>[] = [];
  for (let i = 0; i < MAX_APARTMENTS; i++) {
    ownerResults.push(
      useReadContract({
        address: coproAddress as Address | undefined,
        abi: coproAbi,
        functionName: 'ownerOf',
        args: [BigInt(i)],
      })
    );
    marketResults.push(
      useReadContract({
        address: coproAddress as Address | undefined,
        abi: coproAbi,
        functionName: 'market',
        args: [BigInt(i)],
      })
    );
  }

  useEffect(() => {
    if (!coproAddress || !initialFlats || totalFlats === 0) {
      return;
    }

    const allLoaded = ownerResults.slice(0, totalFlats).every(r => !r.isLoading) && marketResults.slice(0, totalFlats).every(r => !r.isLoading);

    if (allLoaded) {
      const apartmentsData: Apartment[] = [];
      for (let i = 0; i < totalFlats; i++) {
        const owner = ownerResults[i].data;
        const marketPrice = marketResults[i].data;
        const isOwnerValid = typeof owner === 'string' && owner.length === 42;
        const isMarketValid = typeof marketPrice === 'bigint';
        const exists = isOwnerValid && owner !== '0x0000000000000000000000000000000000000000';
        apartmentsData.push({
          id: i,
          owner: isOwnerValid ? (owner as Address) : '0x0000000000000000000000000000000000000000' as Address,
          isForSale: isMarketValid ? (marketPrice as bigint) > 0n : false,
          price: isMarketValid ? (marketPrice as bigint) : undefined,
          exists,
        });
      }
      setApartments(apartmentsData);
      setLoading(false);
    }
  }, [coproAddress, initialFlats, totalFlats, ...ownerResults, ...marketResults]);

  return {
    apartments,
    loading,
    error,
    coproAddress,
    totalFlats,
  };
}; 
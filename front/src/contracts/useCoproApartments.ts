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

  let { data: markets, status: marketStatus, refetch } = useReadContract({
    address: coproAddress as Address | undefined,
    abi: coproAbi,
    functionName: 'getMarketByOwners',
  });

  useEffect(() => {
    if (!coproAddress || marketStatus !== "success") {
      return;
    }
    
    const apartmentsData: Apartment[] = [];
    let i=0
      for (let market of markets || []) {
        apartmentsData.push({
          id: i,
          owner: market.owner as Address,
          isForSale: market.price > 0n,
          price: market.price > 0n ? market.price : undefined,
          exists: market.owner !== "0x0000000000000000000000000000000000000000"
        });
        i++;
      }
      setApartments(apartmentsData);
      setLoading(false);
  }, [coproAddress, marketStatus, markets]);
  return {
    apartments,
    loading,
    error,
    coproAddress,
    refetch
  };
}; 

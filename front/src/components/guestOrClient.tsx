'use client'
import { images } from "@/constants/moke/list";
import List from "./ui/list";
import { useReadAgencyGetCopros } from "../contracts/generatedContracts";
import { Address } from "viem";

export default function GuestOrClient() {
    const { data: coproAddress, isFetched, error, isLoadingError } = useReadAgencyGetCopros();
    console.log(coproAddress, error, isFetched, isLoadingError)
    return (
        <main>
            {isFetched && <List images={coproAddress.map((_: Address, index: number) => images[index])} />}
        </main>
      );

}

'use client'
import List from "./ui/list";
import { useReadAgencyGetCopros, useReadCopro, useReadCoproBaseImageUrl } from "../contracts/generatedContracts";
import { Address } from "viem";
import { motion } from "framer-motion";
import { RealtyService } from "@/service/realty.service";
import { useEffect, useState } from "react";
import { IRealty } from "@/app/models/realty.model";
import { ServiceErrorCode } from "@/service/service.result";

export default function GuestOrClient() {
    // const { data: coproAddress, isFetched, error, isLoadingError } = useReadAgencyGetCopros();
    const [realties, setRealties] = useState([] as IRealty[]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await RealtyService.getAllRealties()
            if (result.errorCode === ServiceErrorCode.success && result.result) {
                setRealties(result.result);
                console.log("Realties fetched successfully:", result.result);
            } else {
                console.error("Failed to fetch realties");
            }
        }
        fetchData()
    }, []);

    return (
        <main className="min-h-screen py-12">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                        Nos Propriétés Exclusives
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Découvrez notre sélection de biens immobiliers premium, disponibles pour acquisition sur la blockchain
                    </p>
                </motion.div>

                {realties.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <List images={realties.map((realty) => ({
                          id: realty.id ?? 0,
                          src: realty.image_url,
                          name: realty.name
                        }))} />
                    </motion.div>
                ) : (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>
        </main>
      );
}

'use client'
import { images } from "@/constants/moke/list";
import List from "./ui/list";
import { useReadAgencyGetCopros } from "../contracts/generatedContracts";
import { Address } from "viem";
import { motion } from "framer-motion";

export default function GuestOrClient() {
    const { data: coproAddress, isFetched, error, isLoadingError } = useReadAgencyGetCopros();

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

                {isFetched && coproAddress ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <List images={coproAddress.map((_: Address, index: number) => images[index])} />
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

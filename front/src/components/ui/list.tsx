"use client";

import { Images } from "@/types/resources";
import { useCopro } from "@/contracts/useCopro";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function List({ images }: { images: Images[] }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
          onClick={() => router.push(`/copro/${image.id}`)}
        >
          <div className="relative overflow-hidden aspect-[4/3]">
            <img
              src={image.src}
              alt="Property"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              {image.name || `Propriété Premium #${image.id}`}
            </h3>
            <p className="text-gray-400 mb-4">
              Une opportunité unique d'investissement immobilier sur la blockchain
            </p>
            <button
              onClick={e => { e.stopPropagation(); router.push(`/copro/${image.id}`); }}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Voir les appartements
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

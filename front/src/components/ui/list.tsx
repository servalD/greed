"use client";

import { useState } from "react";
import { ErrorService } from "@/service/error.service";
import { Images } from "@/types/resources";

export default function List({ images }: { images: Images[] }) {
  const [minted, setMinted] = useState<number[]>([]);

  const handleMint = (id: number) => {
    ErrorService.mixinMessage(`Minting NFT for image ID: ${id}`, "info");
    setMinted((prev) => [...prev, id]);
    ErrorService.mixinMessage('NFT minted !', "success");
  };

  return (
    <div className="bg-gray-900 min-h-screen py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden p-4 flex flex-col items-center"
            >
              <img
                src={image.src}
                alt="Not found"
                className="h-64 w-full object-cover rounded-md mb-4"
              />
              <button
                onClick={() => handleMint(image.id)}
                disabled={minted.includes(image.id)}
                className={`w-full px-4 py-2 text-sm font-medium rounded shadow-md ${
                  minted.includes(image.id)
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {minted.includes(image.id) ? "Minted" : "Mint"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

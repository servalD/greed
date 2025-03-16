"use client";

import { useEffect, useState } from "react";
import { ErrorService } from "@/service/error.service";
import { Images } from "@/types/resources";
import { useAccount } from "wagmi";
import { useCopro } from "@/contracts/useCopro";

export default function List({ images }: { images: Images[] }) {

  const { buy, isPending, bought } = useCopro();

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
                onClick={() => buy(image.id)}
                disabled={bought.includes(image.id) || isPending}
                className={`w-full px-4 py-2 text-sm font-medium rounded shadow-md ${
                  bought.includes(image.id)
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {bought.includes(image.id) ? "Bought" : isPending ? "En attente..." : "Buy"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

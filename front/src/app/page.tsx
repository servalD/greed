"use client";

import Navbar from "@/components/ui/navbar";
import NotConnected from "@/components/notConnected";
import List from "@/components/ui/list";
import { useActiveWalletConnectionStatus } from "thirdweb/react";
import GuestOrClient from "@/components/guestOrClient";
import { useEffect, useState } from "react";

export default function Home() {
  const status = useActiveWalletConnectionStatus();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navbar connectionStatus={status} />
      
      {status === "connected" ? (
        <GuestOrClient />
      ) : (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Bienvenue sur GREED Agency
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Découvrez notre sélection exclusive de biens immobiliers premium sur la blockchain
            </p>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Connectez votre wallet pour commencer
              </h2>
              <p className="text-gray-400 mb-6">
                Accédez à notre plateforme sécurisée et explorez nos propriétés uniques
              </p>
              <div className="animate-pulse">
                <div className="h-12 w-48 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-75"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-blue-400 text-2xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Sécurité Blockchain</h3>
              <p className="text-gray-400">Transactions sécurisées et transparentes grâce à la technologie blockchain</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-purple-400 text-2xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Biens Premium</h3>
              <p className="text-gray-400">Une sélection exclusive de propriétés haut de gamme</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-green-400 text-2xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Transactions Rapides</h3>
              <p className="text-gray-400">Processus d'achat simplifié et efficace</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

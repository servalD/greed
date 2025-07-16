"use client";

import Navbar from "@/components/ui/navbar";
import { useActiveWalletConnectionStatus, ConnectButton } from "thirdweb/react";
import { client } from "@/app/client";
import GuestOrClient from "@/components/guestOrClient";
import {
  generatePayload,
  getUser,
  login,
  logout,
} from "@/service/auth";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, isAuthenticated, refetch } = useAuth();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navbar />
      
      {isAuthenticated ? (
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
              <div className="flex justify-center">
                  <ConnectButton
                    client={client}
                    appMetadata={{
                      name: "GREED Agency",
                      url: "",
                    }}
                    auth={{
                      getLoginPayload: async (params) => {
                        // Génère le payload SIWE depuis le backend
                        const payload = generatePayload(params);
                        console.log('Generated Payload:', await payload);
                        return payload
                      },
                      doLogin: async (params) => {
                        // Envoie la signature au backend pour validation
                        const data = await login({ nonce: params.payload.nonce, signature: params.signature });
                        localStorage.setItem("user", data.user);
                        localStorage.setItem("access_token", data.token);
                        localStorage.setItem("refresh_token", data.refresh_token);
                        refetch();
                      },
                      isLoggedIn: async () => {
                        // Vérifie si l'utilisateur est connecté
                        const user = await getUser();
                        return !!user;
                      },
                      doLogout: async () => {
                        // Déconnecte l'utilisateur
                        return logout();
                      },
                    }}
                  />
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

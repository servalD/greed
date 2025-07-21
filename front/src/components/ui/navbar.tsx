"use client";

import { ConnectButton, useActiveWalletConnectionStatus, useActiveAccount } from "thirdweb/react";
import { client } from "@/app/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSwitchActiveWalletChain } from "thirdweb/react";
import { motion } from "framer-motion";
import { sepolia } from "thirdweb/chains";
import { useReadDataContract } from "@/contracts/useReadDataContract";
import { useAgency } from "@/contracts/useAgency";
import { generatePayload, getUser, login, logout } from "@/service/auth";
import { UserRoleIds } from "@/types/users";
import { useAuth } from "@/hooks/useAuth";
import GuestEntranceDialog from '../dialog/GuestEntranceDialog';
import { ErrorService } from "@/service/error.service";

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);
  const [openGuestDialog, setOpenGuestDialog] = useState(false);
  const switchChain = useSwitchActiveWalletChain();
  const { user, isAuthenticated, updateUserProfile } = useAuth();
  const { guestEntrance: becomeClient } = useAgency();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
      };
      
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const guestEntrance = async () => {
    try {
      setIsSwitchingChain(true);
      await switchChain(sepolia);
      await becomeClient();
    } catch (error) {
      console.error("Error switching chain:", error);
    } finally {
      setIsSwitchingChain(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              GREED Agency
            </span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-800/50 text-white hover:bg-gray-700/50 
                    border border-gray-700/50 hover:border-purple-500/50 transition-all duration-200"
                  onClick={() => router.push("/profile")}
                >
                  Mon Profil
                </motion.button>
              )}

              {isAuthenticated && user?.role === UserRoleIds.GUEST && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-800/50 text-white hover:bg-gray-700/50 
                    border border-gray-700/50 hover:border-blue-500/50 transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setOpenGuestDialog(true)}
                  disabled={isSwitchingChain}
                >
                  {isSwitchingChain ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                      En attente...
                    </div>
                  ) : (
                    "Rejoindre"
                  )}
                </motion.button>
              )}
              
              {isAuthenticated && (user?.role === UserRoleIds.AGENT) && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 
                    text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200
                    shadow-lg shadow-blue-500/20"
                  onClick={() => router.push("/admin")}
                >
                  Admin Panel
                </motion.button>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="connect-button-wrapper"
              >
                <ConnectButton
                  client={client}
                  appMetadata={{
                    name: "GREED Agency",
                    url: "",
                  }}
                  auth={{
                    getLoginPayload: async (params) => {
                      // Génère le payload SIWE depuis le backend
                      return generatePayload(params);
                    },
                    doLogin: async (params) => {
                      // Envoie la signature au backend pour validation
                      const data = await login({ nonce: params.payload.nonce, signature: params.signature });
                      localStorage.setItem("user", data.user);
                      localStorage.setItem("access_token", data.token);
                      localStorage.setItem("refresh_token", data.refresh_token);
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
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <GuestEntranceDialog
        open={openGuestDialog}
        onClose={() => setOpenGuestDialog(false)}
        onSubmit={async (form) => {
          try {
            setIsSwitchingChain(true);
            if (!user) throw new Error("Utilisateur non connecté");
            try {
              await updateUserProfile({
                id: user.id,
                eth_address: user.eth_address,
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
              });
            } catch (err) {
              setIsSwitchingChain(false);
              ErrorService.errorMessage("Erreur lors de l'enregistrement de votre profil. Veuillez réessayer.", err as string);
              return;
            }
            setOpenGuestDialog(false);
            await switchChain(sepolia);
            await becomeClient();
          } catch (e) {
            setIsSwitchingChain(false);
          } finally {
            setIsSwitchingChain(false);
          }
        }}
      />
    </motion.nav>
  );
}

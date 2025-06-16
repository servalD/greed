"use client";

import { ConnectButton, useActiveWalletConnectionStatus, useActiveAccount } from "thirdweb/react";
import { client } from "@/app/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSwitchActiveWalletChain } from "thirdweb/react";
import { motion } from "framer-motion";
import { sepolia } from "thirdweb/chains";
import { useReadDataContract } from "@/contracts/useReadDataContract";

export default function Navbar() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);
  const switchChain = useSwitchActiveWalletChain();
  const connectionStatus = useActiveWalletConnectionStatus();
  const account = useActiveAccount();
  const { userRole, refetchUserRole } = useReadDataContract();

  useEffect(() => {
    const updateRole = async () => {
      console.log('Connection Status:', connectionStatus);
      console.log('Account:', account?.address);

      if (connectionStatus === "connected" && account?.address) {
        try {
          await refetchUserRole();
          console.log('User Role after refetch:', userRole);
          
          if (userRole) {
            console.log('Setting role to:', userRole);
            setRole(userRole);
            localStorage.setItem("role", userRole);
          }
        } catch (error) {
          console.error('Error refetching user role:', error);
        }
      } else if (connectionStatus === "disconnected" || !account?.address) {
        console.log('Clearing role');
        setRole(null);
        localStorage.removeItem("role");
      }
    };

    updateRole();
  }, [connectionStatus, account?.address, refetchUserRole, userRole]);

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
              {connectionStatus === "connected" && account?.address && role === "guest" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-800/50 text-white hover:bg-gray-700/50 
                    border border-gray-700/50 hover:border-blue-500/50 transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={guestEntrance}
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
              
              {connectionStatus === "connected" && account?.address && (role === "agent" || role === "agency") && (
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
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

"use client";

import Navbar from "@/components/ui/navbar";
import NotConnected from "@/components/notConnected";
import { useActiveWalletConnectionStatus, useActiveAccount } from "thirdweb/react";
import { useEffect, useState } from "react";
import AgentOrAgency from "@/components/AgentOrAgency";
import { useRouter } from "next/navigation";
import { ErrorService } from "@/service/error.service";
import { useReadDataContract } from "@/contracts/useReadDataContract";

export default function Home() {
  const status = useActiveWalletConnectionStatus();
  const account = useActiveAccount();
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const { userRole, refetchUserRole } = useReadDataContract();

  useEffect(() => {
    const updateRole = async () => {
      console.log('Admin - Connection Status:', status);
      console.log('Admin - Account:', account?.address);
      console.log('Admin - User Role:', userRole);

      if (status === "connected" && account?.address) {
        try {
          await refetchUserRole();
          console.log('Admin - User Role after refetch:', userRole);
          
          if (userRole) {
            console.log('Admin - Setting role to:', userRole);
            setRole(userRole);
            localStorage.setItem("role", userRole);
          }
        } catch (error) {
          console.error('Admin - Error refetching user role:', error);
        }
      } else if (status === "disconnected" || !account?.address) {
        console.log('Admin - Clearing role');
        setRole(null);
        localStorage.removeItem("role");
      }
    };

    updateRole();
  }, [status, account?.address, refetchUserRole, userRole]);

  useEffect(() => {
    console.log('Admin - Final role:', role);

  }, [role, router]);

  return (
    <main>
      <Navbar />
      {status === "connected"  ? (
        <AgentOrAgency />
      ) : (
        <NotConnected />
      )}
    </main>
  );
}

"use client";

import Navbar from "@/components/ui/navbar";
import NotConnected from "@/components/notConnected";
import { useActiveWalletConnectionStatus } from "thirdweb/react";
import AgentOrAgency from "@/components/AgentOrAgency";
import { useReadDataContract } from "@/contracts/useReadDataContract";
import { UserRoleIds } from "@/types/users";
import { redirect } from 'next/navigation';

export default function Home() {
  const status = useActiveWalletConnectionStatus();
  const { userRole } = useReadDataContract();

  if (userRole !== UserRoleIds.AGENT) {
    redirect("/")
  }

  return (
    <main>
      <Navbar />
      {status === "connected" && userRole === UserRoleIds.AGENT ? (
        <AgentOrAgency />
      ) : (
        <NotConnected />
      )}
    </main>
  );
}

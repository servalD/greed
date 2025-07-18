"use client";

import Navbar from "@/components/ui/navbar";
import NotConnected from "@/components/notConnected";
import { useActiveWalletConnectionStatus } from "thirdweb/react";
import AgentOrAgency from "@/components/AgentOrAgency";
import { UserRoleIds } from "@/types/users";
import { redirect } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const status = useActiveWalletConnectionStatus();
  const { user } = useAuth();

  if (user?.role !== UserRoleIds.AGENT) {
    redirect("/")
  }

  return (
    <main>
      <Navbar />
      {status === "connected" ? (
        <AgentOrAgency />
      ) : (
        <NotConnected />
      )}
    </main>
  );
}

"use client";

import Navbar from "@/components/ui/navbar";
import NotConnected from "@/components/notConnected";
import { useActiveWalletConnectionStatus } from "thirdweb/react";
import { useEffect, useState } from "react";
import AgentOrAgency from "@/components/AgentOrAgency";
import { useRouter } from "next/navigation";
import { ErrorService } from "@/service/error.service";

export default function Home() {
  const status = useActiveWalletConnectionStatus();
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }

    console.log('status :', status)
    console.log(role)

    if (role == "client" || role == "guest") {
        ErrorService.mixinMessage("You don't have the rights", "error");
        router.push("/")
    }
  }, []);

  return (
    <main>
      <Navbar />
      {status === "connected" && (role === "agent" || role === 'agency') ? (
        <AgentOrAgency />
      ) : (
        <NotConnected />
      )}
    </main>
  );
}

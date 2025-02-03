"use client";

import Navbar from "@/components/ui/navbar";
import NotConnected from "@/components/notConnected";
import List from "@/components/ui/list";
import { useActiveWalletConnectionStatus } from "thirdweb/react";
import GuestOrClient from "@/components/guestOrClient";
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

    console.log(role)

    // if (role != "agent") {
    //     ErrorService.mixinMessage("You don't have the rights", "error");
    //     router.push("/")
    // }
  }, []);

  return (
    <main>
      <Navbar connectionStatus={status} />
      {status === "connected" && role === "agent" ? (
        <AgentOrAgency />
      ) : (
        <NotConnected />
      )}
    </main>
  );
}

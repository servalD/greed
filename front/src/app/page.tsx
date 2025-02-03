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
    <main>
      <Navbar connectionStatus={status} />
      {status === "connected" ? (
        <GuestOrClient />
      ) : (
        <NotConnected />
      )}
    </main>
  );
}

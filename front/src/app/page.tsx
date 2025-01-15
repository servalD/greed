"use client";

import Navbar from "@/components/ui/navbar";
import NotConnected from "@/components/notConnected";
import List from "@/components/ui/list";
import { useActiveWalletConnectionStatus } from "thirdweb/react";
import { images } from "@/constants/moke/list";
import GuestOrClient from "@/components/guestOrClient";

export default function Home() {
  const status = useActiveWalletConnectionStatus();
  return (
    <main>
      <Navbar connectionStatus={status} />
      {status === 'connected' ? <GuestOrClient /> : <NotConnected />}
    </main>
  );
}

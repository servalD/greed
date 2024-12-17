"use client";

import Navbar from "@/components/ui/navbar";
import NotConnected from "@/components/notConnected";
import { useAccount } from 'wagmi';
import List from "@/components/ui/list";
import { useEffect, useState } from "react";

export default function Home() {

  const {isConnected} = useAccount();

  const [connectionStatus, setConnectionStatus] = useState(false);

  useEffect(() => {
    setConnectionStatus(isConnected);
  }, [isConnected]);

  return (
    <main>
      <Navbar />
      {!connectionStatus && <NotConnected />}
      {connectionStatus && <List />}
    </main>
  );
}
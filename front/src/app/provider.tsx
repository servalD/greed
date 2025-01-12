"use client";

import type { Metadata } from "next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";

import { config } from "./client";
import { ThirdwebProvider } from "thirdweb/react";

export const metadata: Metadata = {
  title: "Architecture blockchain thirdweb",
  description:
    "Starter template for using thirdweb SDK",
};

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThirdwebProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      </WagmiProvider>
    </ThirdwebProvider>
  );
}

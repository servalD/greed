import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";
import { WagmiProvider } from 'wagmi'
import { config } from './client'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Architecture blockchain thirdweb",
  description:
    "Starter template for using thirdweb SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ThirdwebProvider activeChain={sepolia}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </ThirdwebProvider>
      </body>
    </html>
  );
}
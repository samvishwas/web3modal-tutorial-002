import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

import { Web3Modal } from "@web3modal/react";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";

const environment = process.env.NEXT_PUBLIC_NODE_ENV;
console.log(`environment: ${environment}.`);
const isProductionEnvironment = environment === "production";
console.log(`isProductionEnvironment: ${isProductionEnvironment}`);

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID env variable");
}
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

// 2. Configure wagmi client
const chainsProduction = [polygon];
const chainsNonProduction = [polygonMumbai];
const chains = isProductionEnvironment ? chainsProduction : chainsNonProduction;
const { provider } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ version: 1, chains, projectId }),
  provider,
});

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains);

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready ? (
        <WagmiConfig client={wagmiClient}>
          <Component {...pageProps} />
        </WagmiConfig>
      ) : null}

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}

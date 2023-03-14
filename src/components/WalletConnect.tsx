import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { useWeb3Modal } from "@web3modal/react";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import styles from "@/styles/Home.module.css";

const environment = process.env.NEXT_PUBLIC_NODE_ENV;
const isProductionEnvironment = environment === "production";

export default function WalletConnect() {
  console.log(`[WalletConnect.tsx] isProductionEnvironment: ${isProductionEnvironment}.`);

  const [loading, setLoading] = useState(false);
  const { open } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const urlChainExplorer = isProductionEnvironment ? `https://polygonscan.com/address/${address}` : `https://mumbai.polygonscan.com/address/${address}`;

  function onClick() {
    if (isConnected) {
      disconnect();
    }
  }
  return (
    <>
      {isConnected ? (
        <p>
          <button onClick={onClick}>Disconnect...</button>
          <a target="_blank" href={urlChainExplorer}>
            {address}
          </a>
        </p>
      ) : (
        <Web3Button icon="show" label="Connect Wallet" balance="show" />
      )}
    </>
  );
}

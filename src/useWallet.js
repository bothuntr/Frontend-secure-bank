import { useState, useCallback, useEffect, useRef } from "react";
import { BrowserProvider, Contract, formatEther } from "ethers";
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  FOUNDRY_CHAIN_ID,
  FOUNDRY_CHAIN_PARAMS,
  FOUNDRY_NETWORK_NAME,
} from "./contractConfig";

// ─────────────────────────────────────────────────────────────────────────
// useWallet — real MetaMask connection wired to a local Foundry/Anvil node
// ─────────────────────────────────────────────────────────────────────────
export function useWallet(addLog) {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Keep provider/contract in refs so they survive re-renders without
  // re-triggering effects, but are always reachable from callbacks.
  const providerRef = useRef(null);
  const contractRef = useRef(null);

  const hasMetaMask = typeof window !== "undefined" && !!window.ethereum;

  // ── build provider + contract + signer-bound contract ──────────────────
  const setupProviderAndContract = useCallback(async () => {
    if (!hasMetaMask) return null;
    const provider = new BrowserProvider(window.ethereum);
    providerRef.current = provider;

    const network = await provider.getNetwork();
    const onFoundry = network.chainId === FOUNDRY_CHAIN_ID;
    setIsCorrectNetwork(onFoundry);
    setNetwork(onFoundry ? FOUNDRY_NETWORK_NAME : `Chain ${network.chainId}`);

    if (onFoundry) {
      const signer = await provider.getSigner();
      contractRef.current = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    } else {
      contractRef.current = null;
    }
    return provider;
  }, [hasMetaMask]);

  // ── switch / add the Foundry Anvil network in MetaMask ──────────────────
  const switchToFoundry = useCallback(async () => {
    if (!hasMetaMask) return false;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: FOUNDRY_CHAIN_PARAMS.chainId }],
      });
      return true;
    } catch (switchError) {
      // 4902 = chain not added to MetaMask yet, so add it then switch
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [FOUNDRY_CHAIN_PARAMS],
          });
          return true;
        } catch (addError) {
          addLog?.("error", "Network", "Couldn't add Foundry network to MetaMask");
          return false;
        }
      }
      addLog?.("error", "Network", "Network switch was rejected");
      return false;
    }
  }, [hasMetaMask, addLog]);

  // ── connect wallet ───────────────────────────────────────────────────────
  const connectWallet = useCallback(async () => {
    if (!hasMetaMask) {
      addLog?.("error", "Wallet", "MetaMask not found — install the extension");
      return;
    }
    if (connecting || connected) return;

    setConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts || accounts.length === 0) {
        addLog?.("warn", "Wallet", "No accounts returned by MetaMask");
        setConnecting(false);
        return;
      }

      const provider = await setupProviderAndContract();
      const net = await provider.getNetwork();

      if (net.chainId !== FOUNDRY_CHAIN_ID) {
        addLog?.("warn", "Network", `Connected to wrong network (chain ${net.chainId}), switching…`);
        const switched = await switchToFoundry();
        if (switched) {
          // re-derive provider/contract now that the chain changed
          await setupProviderAndContract();
        }
      }

      const short = `${accounts[0].slice(0, 6)}…${accounts[0].slice(-4)}`;
      setAccount(accounts[0]);
      setConnected(true);
      addLog?.("info", "Wallet connected", short);
    } catch (err) {
      if (err.code === 4001) {
        addLog?.("warn", "Wallet", "Connection request rejected");
      } else {
        addLog?.("error", "Wallet", err.shortMessage || err.message || "Failed to connect");
      }
    } finally {
      setConnecting(false);
    }
  }, [hasMetaMask, connecting, connected, setupProviderAndContract, switchToFoundry, addLog]);

  const disconnectWallet = useCallback(() => {
    setConnected(false);
    setAccount("");
    setNetwork("");
    setIsCorrectNetwork(false);
    providerRef.current = null;
    contractRef.current = null;
  }, []);

  // ── read balances directly from the chain ───────────────────────────────
  const readBalances = useCallback(async () => {
    if (!contractRef.current || !account) return { userBal: 0, tvlBal: 0 };
    try {
      const [userRaw, tvlRaw] = await Promise.all([
        contractRef.current.balanceOf(account),
        contractRef.current.totalValueLocked(),
      ]);
      return {
        userBal: parseFloat(formatEther(userRaw)),
        tvlBal: parseFloat(formatEther(tvlRaw)),
      };
    } catch (err) {
      addLog?.("error", "Read balance", err.shortMessage || err.message || "Failed");
      return { userBal: 0, tvlBal: 0 };
    }
  }, [account, addLog]);

  // ── react to account / chain changes from MetaMask itself ──────────────
  useEffect(() => {
    if (!hasMetaMask) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        addLog?.("warn", "Wallet", "Disconnected from MetaMask");
        disconnectWallet();
      } else if (accounts[0] !== account) {
        const short = `${accounts[0].slice(0, 6)}…${accounts[0].slice(-4)}`;
        setAccount(accounts[0]);
        addLog?.("info", "Account switched", short);
      }
    };

    const handleChainChanged = async () => {
      addLog?.("info", "Network", "Network changed, reloading provider…");
      await setupProviderAndContract();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMetaMask, account]);

  return {
    connected,
    account,
    network,
    isCorrectNetwork,
    connecting,
    hasMetaMask,
    connectWallet,
    disconnectWallet,
    switchToFoundry,
    readBalances,
    getContract: () => contractRef.current,
    getProvider: () => providerRef.current,
  };
}

import { useState, useCallback, useEffect } from "react";
import { parseEther } from "ethers";
import "./App.css";

import Navbar    from "./components/Navbar";
import AppPage   from "./pages/AppPage";
import Tutorial  from "./pages/Tutorial";
import Contact   from "./pages/Contact";
import { useWallet } from "./useWallet";

function App() {
  const [page,        setPage]       = useState("app");  // "app" | "tutorial" | "contact"
  const [userBal,     setUserBal]    = useState(0);
  const [tvlBal,      setTvlBal]     = useState(0);
  const [logEntries,  setLogEntries] = useState([]);
  const [loading,     setLoading]    = useState(null); // "deposit"|"withdraw"|"withdrawAll"

  // ── helpers ──────────────────────────────────────────────────
  const addLog = useCallback((type, title, detail = "") => {
    setLogEntries(prev => [{
      id: Date.now() + Math.random(),
      type, title, detail,
      time: new Date().toLocaleTimeString(),
    }, ...prev]);
  }, []);

  const clearLog = useCallback(() => setLogEntries([]), []);

  // ── real wallet + contract wiring (Foundry/Anvil + MetaMask) ───
  const {
    connected,
    account,
    network,
    isCorrectNetwork,
    connecting,
    hasMetaMask,
    connectWallet,
    readBalances,
    getContract,
  } = useWallet(addLog);

  // ── refresh balances whenever we connect / after a tx ───────────
  const refreshBalances = useCallback(async () => {
    if (!connected || !isCorrectNetwork) return;
    const { userBal, tvlBal } = await readBalances();
    setUserBal(userBal);
    setTvlBal(tvlBal);
  }, [connected, isCorrectNetwork, readBalances]);

  useEffect(() => {
    if (connected && isCorrectNetwork) refreshBalances();
  }, [connected, isCorrectNetwork, refreshBalances]);

  // ── deposit ──────────────────────────────────────────────────
  const handleDeposit = useCallback(async (amt, clearInput) => {
    if (!connected) { addLog("warn", "Deposit", "Connect wallet first"); return; }
    if (!isCorrectNetwork) { addLog("warn", "Deposit", "Switch to Foundry network first"); return; }
    if (!amt || parseFloat(amt) <= 0) { addLog("warn", "Deposit", "Enter a valid amount"); return; }

    const contract = getContract();
    if (!contract) { addLog("error", "Deposit", "Contract not ready"); return; }

    setLoading("deposit");
    addLog("info", "Deposit", `Sending ${amt} ETH…`);
    try {
      const tx = await contract.deposit({ value: parseEther(amt) });
      addLog("info", "Pending", tx.hash);
      await tx.wait();
      addLog("success", "Deposited", `${amt} ETH confirmed ✓`);
      clearInput();
      await refreshBalances();
    } catch (err) {
      addLog("error", "Deposit", err.shortMessage || err.reason || err.message || "Transaction failed");
    } finally {
      setLoading(null);
    }
  }, [connected, isCorrectNetwork, getContract, addLog, refreshBalances]);

  // ── withdraw ─────────────────────────────────────────────────
  const handleWithdraw = useCallback(async (amt, clearInput) => {
    if (!connected) { addLog("warn", "Withdraw", "Connect wallet first"); return; }
    if (!isCorrectNetwork) { addLog("warn", "Withdraw", "Switch to Foundry network first"); return; }
    if (!amt || parseFloat(amt) <= 0) { addLog("warn", "Withdraw", "Enter a valid amount"); return; }
    if (parseFloat(amt) > userBal) { addLog("error", "Withdraw", "Insufficient balance"); return; }

    const contract = getContract();
    if (!contract) { addLog("error", "Withdraw", "Contract not ready"); return; }

    setLoading("withdraw");
    addLog("info", "Withdraw", `Requesting ${amt} ETH…`);
    try {
      const tx = await contract.withdraw(parseEther(amt));
      addLog("info", "Pending", tx.hash);
      await tx.wait();
      addLog("success", "Withdrawn", `${amt} ETH confirmed ✓`);
      clearInput();
      await refreshBalances();
    } catch (err) {
      addLog("error", "Withdraw", err.shortMessage || err.reason || err.message || "Transaction failed");
    } finally {
      setLoading(null);
    }
  }, [connected, isCorrectNetwork, userBal, getContract, addLog, refreshBalances]);

  // ── withdraw all ─────────────────────────────────────────────
  const handleWithdrawAll = useCallback(async () => {
    if (!connected) { addLog("warn", "WithdrawAll", "Connect wallet first"); return; }
    if (!isCorrectNetwork) { addLog("warn", "WithdrawAll", "Switch to Foundry network first"); return; }
    if (userBal <= 0) { addLog("warn", "WithdrawAll", "Nothing to withdraw"); return; }

    const contract = getContract();
    if (!contract) { addLog("error", "WithdrawAll", "Contract not ready"); return; }

    setLoading("withdrawAll");
    addLog("warn", "WithdrawAll", "Emptying your balance…");
    try {
      const tx = await contract.withdrawAll();
      addLog("info", "Pending", tx.hash);
      await tx.wait();
      addLog("success", "WithdrawAll", "All funds returned ✓");
      await refreshBalances();
    } catch (err) {
      addLog("error", "WithdrawAll", err.shortMessage || err.reason || err.message || "Transaction failed");
    } finally {
      setLoading(null);
    }
  }, [connected, isCorrectNetwork, userBal, getContract, addLog, refreshBalances]);

  // ── render ───────────────────────────────────────────────────
  return (
    <>
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <Navbar
        page={page}
        setPage={setPage}
        connected={connected}
        account={account}
        network={network}
        isCorrectNetwork={isCorrectNetwork}
        connecting={connecting}
        hasMetaMask={hasMetaMask}
        onConnect={connectWallet}
      />

      {page === "app" && (
        <AppPage
          connected={connected}
          account={account}
          userBal={userBal}
          tvlBal={tvlBal}
          loading={loading}
          logEntries={logEntries}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
          onWithdrawAll={handleWithdrawAll}
          onClearLog={clearLog}
        />
      )}
      {page === "tutorial" && <Tutorial />}
      {page === "contact"  && <Contact />}
    </>
  );
}

export default App;

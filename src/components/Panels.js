import { useState } from "react";
import Tooltip from "./Tooltip";

function Panels({ onDeposit, onWithdraw, onWithdrawAll, loading }) {
  const [depositAmt,  setDepositAmt]  = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");

  return (
    <>
      <div className="main-grid">
        {/* ── DEPOSIT ── */}
        <div className="panel">
          <div className="panel-title">
            <span className="dot" /> Deposit ETH
          </div>
          <div className="input-wrap">
            <input
              type="number"
              placeholder="0.01"
              min="0"
              step="any"
              value={depositAmt}
              onChange={e => setDepositAmt(e.target.value)}
            />
            <span className="input-unit">ETH</span>
          </div>
          <Tooltip
            titleText="💰 Deposit ETH"
            titleClass="green"
            trigger={
              <button
                className="btn btn-green"
                disabled={loading === "deposit"}
                onClick={() => onDeposit(depositAmt, () => setDepositAmt(""))}
              >
                {loading === "deposit"
                  ? <><span className="spinner" />Depositing…</>
                  : "Deposit"}
              </button>
            }
          >
            Sends the entered ETH from your wallet into the SecureBank contract.
            Your balance increases by this amount.
          </Tooltip>
        </div>

        {/* ── WITHDRAW ── */}
        <div className="panel">
          <div className="panel-title">
            <span className="dot danger" /> Withdraw ETH
          </div>
          <div className="input-wrap">
            <input
              type="number"
              placeholder="0.005"
              min="0"
              step="any"
              value={withdrawAmt}
              onChange={e => setWithdrawAmt(e.target.value)}
            />
            <span className="input-unit">ETH</span>
          </div>
          <Tooltip
            titleText="📤 Withdraw ETH"
            titleClass="red"
            trigger={
              <button
                className="btn btn-danger"
                disabled={loading === "withdraw"}
                onClick={() => onWithdraw(withdrawAmt, () => setWithdrawAmt(""))}
              >
                {loading === "withdraw"
                  ? <><span className="spinner" />Withdrawing…</>
                  : "Withdraw"}
              </button>
            }
          >
            Pulls a specific ETH amount from the contract back to your wallet.
            Must not exceed your current balance.
          </Tooltip>
        </div>
      </div>

      {/* ── WITHDRAW ALL ── */}
      <div className="wa-panel">
        <div className="wa-info">
          <h3>⚡ Withdraw Everything</h3>
          <p>Transfers your entire contract balance back to your wallet in one transaction.</p>
        </div>
        <Tooltip
          titleText="⚡ Withdraw All"
          titleClass="yellow"
          trigger={
            <button
              className="btn btn-outline"
              style={{ minWidth: "210px" }}
              disabled={loading === "withdrawAll"}
              onClick={onWithdrawAll}
            >
              {loading === "withdrawAll"
                ? <><span className="spinner" />Processing…</>
                : "Withdraw All Funds"}
            </button>
          }
        >
          Calls <strong style={{ color: "#cdd6f4" }}>withdrawAll()</strong> on
          the contract — moves your <em>entire</em> balance to your wallet.
          Cannot be undone.
        </Tooltip>
      </div>
    </>
  );
}

export default Panels;

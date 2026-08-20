function Stats({ userBal, tvlBal, account }) {
  return (
    <div className="stats-row">
      <div className="stat-card green">
        <div className="stat-label">Your Balance</div>
        <div className="stat-value accent">{userBal.toFixed(6)} ETH</div>
        <div className="stat-sub">ETH in contract</div>
      </div>

      <div className="stat-card purple">
        <div className="stat-label">Contract TVL</div>
        <div className="stat-value">{tvlBal.toFixed(6)} ETH</div>
        <div className="stat-sub">Total ETH locked</div>
      </div>

      <div className="stat-card yellow">
        <div className="stat-label">Connected Address</div>
        <div className="stat-value" style={{ fontSize: ".82rem" }}>
          {account || "—"}
        </div>
        <div className="stat-sub">{account ? "Wallet active" : "Not connected"}</div>
      </div>
    </div>
  );
}

export default Stats;

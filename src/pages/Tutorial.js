const FEATURES = [
  { icon: "🔐", cls: "g", title: "Non-Custodial",      body: "SecureBank never touches your private keys. All funds are controlled exclusively by a transparent, audited Ethereum smart contract." },
  { icon: "⚡", cls: "b", title: "Instant Settlement",  body: "Deposits and withdrawals settle on-chain — in seconds on Hardhat, minutes on testnets, depending on network conditions and gas." },
  { icon: "🛡️", cls: "r", title: "Open Source",        body: "Every line of contract code is publicly verifiable on Etherscan. No hidden logic, no backdoors — fully transparent by design." },
  { icon: "📊", cls: "y", title: "Real-time Balances", body: "Your balance and the contract's TVL (total value locked) refresh automatically after every confirmed transaction." },
];

const STEPS = [
  { title: "Install MetaMask",         body: <>Download MetaMask from <strong style={{color:"var(--accent2)"}}>metamask.io</strong>. Create or import a wallet using your seed phrase. <strong style={{color:"var(--danger)"}}>Never share your seed phrase.</strong></> },
  { title: "Connect Your Wallet",      body: <>Click <strong style={{color:"var(--accent)"}}>Connect Wallet</strong> in the top-right. MetaMask will request approval — click Connect. Your address and network appear in the navbar immediately.</> },
  { title: "Select the Correct Network", body: <>Ensure MetaMask is on the same network as the deployed contract — e.g. <code>Sepolia</code> testnet or <code>Localhost:8545</code> for Hardhat. The network badge in the nav shows your current chain.</> },
  { title: "Deposit ETH",              body: <>Enter an amount in the <strong style={{color:"var(--accent)"}}>Deposit ETH</strong> panel and click Deposit. MetaMask opens a transaction confirmation — review the gas fee and approve. Your balance updates on confirmation.</> },
  { title: "Withdraw ETH",             body: <>Enter a value ≤ your contract balance in the <strong style={{color:"var(--danger)"}}>Withdraw ETH</strong> panel, or click <strong style={{color:"var(--warn)"}}>Withdraw All Funds</strong> to sweep your entire balance in one transaction.</> },
  { title: "Monitor the Activity Log", body: <>Every action is tracked in the <strong style={{color:"var(--warn)"}}>Activity Log</strong> at the bottom — colour-coded tags distinguish info, success, warning, and error events.</> },
];

function Tutorial() {
  return (
    <div className="page" key="tutorial">
      {/* Hero */}
      <div className="hero-block">
        <div className="pill">📖 Documentation</div>
        <h1>What is <span>SecureBank</span>?</h1>
        <p>
          SecureBank is a decentralized Ethereum banking DApp. You can deposit and withdraw ETH
          directly to and from a smart contract — no banks, no middlemen, no custodians.
          Your keys, your funds, your rules.
        </p>
      </div>

      {/* Feature cards */}
      <div className="card-grid">
        {FEATURES.map((f, i) => (
          <div className="f-card" key={f.title} style={{ animationDelay: `${(i + 1) * 0.1}s` }}>
            <div className={`f-icon ${f.cls}`}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="sec-title">How to Use SecureBank</div>

      {STEPS.map((s, i) => (
        <div className="step" key={s.title} style={{ animationDelay: `${(i + 1) * 0.05}s` }}>
          <div className="step-num">{i + 1}</div>
          <div>
            <h4>{s.title}</h4>
            <p>{s.body}</p>
          </div>
        </div>
      ))}

      {/* Info boxes */}
      <div style={{ marginTop: "28px" }}>
        <div className="info-box y">
          <span style={{ fontSize: "1.2rem", flexShrink: 0, marginTop: "2px" }}>⚠️</span>
          <p>
            <strong style={{ color: "var(--warn)" }}>Testnet first:</strong>{" "}
            Always test on Sepolia or foundry before using real ETH.
            Gas fees are irreversible and transactions cannot be rolled back on mainnet.
          </p>
        </div>
        <div className="info-box b">
          <span style={{ fontSize: "1.2rem", flexShrink: 0, marginTop: "2px" }}>💡</span>
          <p>
            <strong style={{ color: "var(--accent2)" }}>Dev tip:</strong>{" "}
            Run <code>foundry</code> locally for instant, free transactions during
            development. Point MetaMask to <code>Localhost:8545</code> and deploy your contract
            before opening the DApp.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;

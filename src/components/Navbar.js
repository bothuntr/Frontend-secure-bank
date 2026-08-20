function Navbar({ page, setPage, connected, account, network, onConnect }) {
  return (
    <nav className="topnav">
      {/* Logo */}
      <button className="nav-logo" onClick={() => setPage("app")}>
        <div className="nav-logo-icon">🏦</div>
        Secure<span>Bank</span>
      </button>

      {/* Nav links */}
      <div className="nav-links">
        <button
          className={`nav-link ${page === "app" ? "active" : ""}`}
          onClick={() => setPage("app")}
        >
          App
        </button>
        <button
          className={`nav-link tut ${page === "tutorial" ? "active" : ""}`}
          onClick={() => setPage("tutorial")}
        >
          📖 Tutorial
        </button>
        <button
          className={`nav-link cnt ${page === "contact" ? "active" : ""}`}
          onClick={() => setPage("contact")}
        >
          ✉️ Contact
        </button>
      </div>

      {/* Right side */}
      <div className="nav-right">
        <span className="network-badge">
          <span className={`net-dot ${connected ? "live" : ""}`} />
          {network || "— Network"}
        </span>
        <button
          className={`connect-btn ${connected ? "connected" : ""}`}
          onClick={onConnect}
        >
          {connected
            ? `${account.slice(0, 6)}…${account.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

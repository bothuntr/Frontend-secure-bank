function Log({ entries = [], onClear }) {
  return (
    <div className="log-panel">
      <div className="log-header">
        <div className="panel-title" style={{ margin: 0 }}>
          <span className="dot warn" /> Activity Log
        </div>
        {entries.length > 0 && (
          <button className="log-clear" onClick={onClear}>Clear</button>
        )}
      </div>

      <div className="log-body">
        {entries.length === 0 ? (
          <div className="log-empty">No activity yet. Connect wallet to start.</div>
        ) : (
          entries.map(e => (
            <div className="log-entry" key={e.id}>
              <span className={`log-tag tag-${e.type}`}>{e.type}</span>
              <span className="log-text">
                <strong>{e.title}</strong>
                {e.detail ? ` — ${e.detail}` : ""}
                {" "}
                <span style={{ color: "var(--border-hi)", fontSize: ".75rem" }}>
                  {e.time}
                </span>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Log;

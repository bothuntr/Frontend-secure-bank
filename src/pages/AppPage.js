import Stats  from "../components/Stats";
import Panels from "../components/Panels";
import Log    from "../components/Log";

function AppPage({
  connected, account,
  userBal, tvlBal,
  loading, logEntries,
  onDeposit, onWithdraw, onWithdrawAll, onClearLog,
}) {
  return (
    <div className="page" key="app">
      <Stats
        userBal={userBal}
        tvlBal={tvlBal}
        account={account}
      />
      <Panels
        onDeposit={onDeposit}
        onWithdraw={onWithdraw}
        onWithdrawAll={onWithdrawAll}
        loading={loading}
      />
      <Log
        entries={logEntries}
        onClear={onClearLog}
      />
    </div>
  );
}

export default AppPage;

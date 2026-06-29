import React, { useEffect, useState } from 'react';
import { fetchLeaveRequests } from '../api/googleScriptApi';
import PageLoader from '../pages/PageLoader';
import { useLoader } from '../context/LoaderProvider';

function getMonthYear(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonthYear(monthStr) {
  const [year, month] = monthStr.split('-');
  return `${new Date(year, parseInt(month, 10) - 1, 1).toLocaleString('default', { month: 'long' })} ${year}`;
}

const TOTAL_LEAVE = 18;
const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const allMonthsList = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

const AdminStatsPage = () => {
  const [userStats, setUserStats] = useState({});
  const [allData, setAllData] = useState([]);
  const [selectedUser, setSelectedUser] = useState('All');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('All');
  const { loading, setLoading } = useLoader();

  const refreshLeaveData = () => {
    setLoading(true);
    fetchLeaveRequests()
      .then(data => { setAllData(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { refreshLeaveData(); }, [setLoading]);

  useEffect(() => {
    if (!allData.length) return;
    const stats = {};
    allData.forEach(req => {
      if (!stats[req.name]) stats[req.name] = {};
      const start = new Date(req.startDate);
      let end = req.endDate && !isNaN(new Date(req.endDate)) ? new Date(req.endDate) : new Date(req.startDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        if ((req.type.startsWith('Leave') || req.type.startsWith('Half Day')) && (day === 0 || day === 6)) continue;
        const month = getMonthYear(d);
        if (!stats[req.name][month]) stats[req.name][month] = { leave: 0, wfh: 0, total: 0 };
        if (['Leave', 'Leave - Full Day'].includes(req.type)) { stats[req.name][month].leave += 1; stats[req.name][month].total += 1; }
        else if (['Half Day AM', 'Half Day PM', 'Leave - Half Day AM', 'Leave - Half Day PM'].includes(req.type)) { stats[req.name][month].leave += 0.5; stats[req.name][month].total += 0.5; }
        else if (['Work From Home', 'WFH - Full Day'].includes(req.type)) { stats[req.name][month].wfh += 1; stats[req.name][month].total += 1; }
        else if (['WFH - Half Day AM', 'WFH - Half Day PM'].includes(req.type)) { stats[req.name][month].wfh += 0.5; stats[req.name][month].total += 0.5; }
      }
    });
    setUserStats(stats);
  }, [allData]);

  const userOptions = ['All', ...Object.keys(userStats)];
  const allMonths = Object.values(userStats).flatMap(m => m ? Object.keys(m) : []);
  const allYears = Array.from(new Set(allMonths.map(m => m.split('-')[0]))).sort();

  const filterStats = monthsObj => {
    if (!monthsObj) return {};
    return Object.keys(monthsObj)
      .filter(month => {
        const [year, m] = month.split('-');
        return String(selectedYear) === year && (selectedMonth === 'All' || selectedMonth === m);
      })
      .reduce((obj, k) => { obj[k] = monthsObj[k]; return obj; }, {});
  };

  const filteredStats = selectedUser === 'All'
    ? Object.fromEntries(Object.entries(userStats).map(([u, m]) => [u, filterStats(m)]))
    : { [selectedUser]: filterStats(userStats[selectedUser]) };

  return (
    <div className="portal-page">
      {loading && <PageLoader />}
      <div className="row justify-content-center g-0">
        <div className="col-12 col-xl-11">

          <div className="d-flex justify-content-between align-items-center mb-3" style={{ flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h4 style={{ fontWeight: 700, color: '#0d1b3e', margin: 0 }}>Leave Statistics</h4>
              <p style={{ color: '#8a9ab5', fontSize: '0.88rem', margin: '2px 0 0' }}>Yearly breakdown per employee</p>
            </div>
            <button className="portal-btn portal-btn-sm" onClick={refreshLeaveData} disabled={loading}>
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="portal-card mb-4">
            <div className="portal-card-body" style={{ padding: '14px 20px' }}>
              <div className="d-flex flex-wrap gap-3 align-items-end">
                <div>
                  <label className="portal-label" style={{ marginBottom: 4 }}>User</label>
                  <select className="portal-select" style={{ width: 180, height: 38, fontSize: '0.85rem' }} value={selectedUser} onChange={e => setSelectedUser(e.target.value)} disabled={loading}>
                    {userOptions.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="portal-label" style={{ marginBottom: 4 }}>Year</label>
                  <select className="portal-select" style={{ width: 110, height: 38, fontSize: '0.85rem' }} value={selectedYear} onChange={e => setSelectedYear(e.target.value)} disabled={loading}>
                    {allYears.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="portal-label" style={{ marginBottom: 4 }}>Month</label>
                  <select className="portal-select" style={{ width: 150, height: 38, fontSize: '0.85rem' }} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} disabled={loading}>
                    <option value="All">All Months</option>
                    {allMonthsList.map(m => <option key={m} value={m}>{monthNames[parseInt(m, 10)]}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* User stat cards grid */}
          {loading ? (
            <div className="text-center py-5"><PageLoader /></div>
          ) : Object.keys(filteredStats).length === 0 ? (
            <div className="portal-empty"><i className="bi bi-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}></i>No leave data found.</div>
          ) : (
            <div className="row g-3">
              {Object.entries(filteredStats).map(([user, months]) => {
                const usedLeave = Object.values(months).reduce((s, v) => s + v.leave, 0);
                const usedWfh   = Object.values(months).reduce((s, v) => s + v.wfh,   0);
                const usedTotal = Object.values(months).reduce((s, v) => s + v.total,  0);
                const remaining = TOTAL_LEAVE - usedLeave;
                const pct = Math.min(100, Math.round((usedLeave / TOTAL_LEAVE) * 100));

                return (
                  <div className="col-12 col-lg-6" key={user}>
                    <div className="portal-card">
                      <div className="portal-card-header" style={{ justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' }}>
                            {user[0]?.toUpperCase()}
                          </div>
                          <h5 style={{ margin: 0 }}>{user}</h5>
                        </div>
                        <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem' }}>
                          <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '3px 10px' }}>
                            Leave: {usedLeave}/{TOTAL_LEAVE}
                          </span>
                          <span style={{ background: remaining <= 3 ? 'rgba(220,38,38,0.3)' : 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '3px 10px' }}>
                            Left: {remaining}
                          </span>
                        </div>
                      </div>
                      <div className="portal-card-body" style={{ padding: '16px 20px' }}>
                        {/* Mini progress bar */}
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#8a9ab5', marginBottom: 4 }}>
                            <span>Leave used</span><span>{pct}%</span>
                          </div>
                          <div style={{ height: 6, background: '#e5e9f0', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? '#dc2626' : pct >= 60 ? '#d97706' : '#000033', borderRadius: 4, transition: 'width 0.4s' }}></div>
                          </div>
                        </div>

                        {Object.entries(months).length === 0 ? (
                          <div className="portal-empty" style={{ padding: '16px 0' }}>No data for selected period.</div>
                        ) : (
                          <div className="table-responsive">
                            <table className="portal-table">
                              <thead>
                                <tr>
                                  <th>Month</th>
                                  <th className="text-center">Leave</th>
                                  <th className="text-center">WFH</th>
                                  <th className="text-center">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).map(([month, s]) => (
                                  <tr key={month}>
                                    <td style={{ fontSize: '0.85rem' }}>{formatMonthYear(month)}</td>
                                    <td className="text-center">{s.leave > 0 ? <span className="badge bg-danger">{s.leave}</span> : <span style={{ color: '#8a9ab5' }}>—</span>}</td>
                                    <td className="text-center">{s.wfh > 0 ? <span className="badge bg-warning text-dark">{s.wfh}</span> : <span style={{ color: '#8a9ab5' }}>—</span>}</td>
                                    <td className="text-center"><span className="badge" style={{ background: '#eef0ff', color: '#000033', fontWeight: 700 }}>{s.total}</span></td>
                                  </tr>
                                ))}
                                <tr style={{ background: '#f1f4f9' }}>
                                  <td className="fw-bold" style={{ fontSize: '0.85rem' }}>Total</td>
                                  <td className="text-center"><span className="badge bg-danger">{usedLeave}</span></td>
                                  <td className="text-center"><span className="badge bg-warning text-dark">{usedWfh}</span></td>
                                  <td className="text-center"><span className="badge" style={{ background: '#000033', color: '#fff', fontWeight: 700 }}>{usedTotal}</span></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminStatsPage;

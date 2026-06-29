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

const AVATAR_PALETTE = ['#3b82f6', '#8b5cf6', '#ec4899', '#0d9488', '#f59e0b', '#ef4444', '#22c55e', '#6366f1'];
const avatarColor = (name) => AVATAR_PALETTE[(name || 'U').charCodeAt(0) % AVATAR_PALETTE.length];

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

  useEffect(() => { refreshLeaveData(); }, [setLoading]); // eslint-disable-line

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

  const totalEmployees = Object.keys(filteredStats).length;
  const grandLeave = Object.values(filteredStats).reduce((s, m) => s + Object.values(m).reduce((a, v) => a + v.leave, 0), 0);
  const grandWfh   = Object.values(filteredStats).reduce((s, m) => s + Object.values(m).reduce((a, v) => a + v.wfh,   0), 0);
  const grandTotal = grandLeave + grandWfh;

  return (
    <div className="portal-page">
      {loading && <PageLoader />}
      <div className="row justify-content-center g-0">
        <div className="col-12 col-xl-11">

          {/* Title + Filters */}
          <div className="portal-card mb-4">
            <div className="portal-card-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="bi bi-bar-chart-fill" style={{ fontSize: '1.1rem' }}></i>
                <div>
                  <h4 style={{ margin: 0 }}>Leave Statistics</h4>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: 1, fontWeight: 400 }}>
                    Yearly breakdown per employee
                  </div>
                </div>
              </div>
              <button className="portal-btn portal-btn-sm" onClick={refreshLeaveData} disabled={loading}>
                <i className="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </div>
            <div className="portal-card-body" style={{ padding: '18px 24px' }}>
              <div className="d-flex flex-wrap align-items-end" style={{ gap: '0', rowGap: 16 }}>
                <div style={{ paddingRight: 28 }}>
                  <label className="portal-label" style={{ marginBottom: 4 }}><i className="bi bi-person"></i> User</label>
                  <select className="portal-select" style={{ width: 180, height: 38, fontSize: '0.85rem' }}
                    value={selectedUser} onChange={e => setSelectedUser(e.target.value)} disabled={loading}>
                    {userOptions.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div style={{ width: 1, height: 52, background: '#e5e9f0', flexShrink: 0, alignSelf: 'center' }} />
                <div style={{ paddingLeft: 28, paddingRight: 28 }}>
                  <label className="portal-label" style={{ marginBottom: 4 }}><i className="bi bi-calendar3"></i> Year</label>
                  <select className="portal-select" style={{ width: 110, height: 38, fontSize: '0.85rem' }}
                    value={selectedYear} onChange={e => setSelectedYear(e.target.value)} disabled={loading}>
                    {allYears.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div style={{ width: 1, height: 52, background: '#e5e9f0', flexShrink: 0, alignSelf: 'center' }} />
                <div style={{ paddingLeft: 28 }}>
                  <label className="portal-label" style={{ marginBottom: 4 }}><i className="bi bi-calendar-month"></i> Month</label>
                  <select className="portal-select" style={{ width: 150, height: 38, fontSize: '0.85rem' }}
                    value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} disabled={loading}>
                    <option value="All">All Months</option>
                    {allMonthsList.map(m => <option key={m} value={m}>{monthNames[parseInt(m, 10)]}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5"><PageLoader /></div>
          ) : Object.keys(filteredStats).length === 0 ? (
            <div className="portal-card">
              <div className="portal-card-body">
                <div className="portal-empty">
                  <i className="bi bi-inbox" style={{ fontSize: '2.4rem', display: 'block', marginBottom: 10, color: '#c5cdd8' }}></i>
                  <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>No leave data found</div>
                  <div style={{ fontSize: '0.82rem' }}>Try adjusting the filters above.</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Summary strip */}
              <div className="cal-stats-row mb-4">
                <div className="cal-stat-pill" style={{ borderColor: '#000033', background: '#eef0ff' }}>
                  <i className="bi bi-people-fill" style={{ color: '#000033', fontSize: '0.9rem' }}></i>
                  <span className="cal-stat-label">Employees</span>
                  <span className="cal-stat-count" style={{ color: '#000033' }}>{totalEmployees}</span>
                </div>
                <div className="cal-stat-pill" style={{ borderColor: '#dc2626', background: '#fff5f5' }}>
                  <i className="bi bi-calendar-x-fill" style={{ color: '#dc2626', fontSize: '0.9rem' }}></i>
                  <span className="cal-stat-label">Leave Days</span>
                  <span className="cal-stat-count" style={{ color: '#dc2626' }}>{grandLeave}</span>
                </div>
                <div className="cal-stat-pill" style={{ borderColor: '#d97706', background: '#fffbeb' }}>
                  <i className="bi bi-house-fill" style={{ color: '#d97706', fontSize: '0.9rem' }}></i>
                  <span className="cal-stat-label">WFH Days</span>
                  <span className="cal-stat-count" style={{ color: '#d97706' }}>{grandWfh}</span>
                </div>
                <div className="cal-stat-pill" style={{ borderColor: '#6c757d', background: '#f1f3f5' }}>
                  <i className="bi bi-stack" style={{ color: '#6c757d', fontSize: '0.9rem' }}></i>
                  <span className="cal-stat-label">Total Days</span>
                  <span className="cal-stat-count" style={{ color: '#6c757d' }}>{grandTotal}</span>
                </div>
              </div>

              {/* User stat cards — equal height grid */}
              <div className="row g-4">
                {Object.entries(filteredStats).map(([user, months]) => {
                  const usedLeave = Object.values(months).reduce((s, v) => s + v.leave, 0);
                  const usedWfh   = Object.values(months).reduce((s, v) => s + v.wfh,   0);
                  const usedTotal = Object.values(months).reduce((s, v) => s + v.total,  0);
                  const remaining = TOTAL_LEAVE - usedLeave;
                  const pct = Math.min(100, Math.round((usedLeave / TOTAL_LEAVE) * 100));
                  const barColor = pct >= 80 ? '#dc2626' : pct >= 60 ? '#d97706' : '#16a34a';
                  const color = avatarColor(user);

                  return (
                    <div className="col-12 col-lg-6 d-flex" key={user}>
                      <div className="portal-card w-100 d-flex flex-column">

                        {/* Card header */}
                        <div className="portal-card-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 38, height: 38, borderRadius: '50%',
                              background: color,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 800, fontSize: '1rem', color: '#fff',
                              flexShrink: 0, boxShadow: `0 0 0 3px rgba(255,255,255,0.2)`
                            }}>
                              {user[0]?.toUpperCase()}
                            </div>
                            <h5 style={{ margin: 0 }}>{user}</h5>
                          </div>
                          <div style={{ display: 'flex', gap: 8, fontSize: '0.78rem', flexWrap: 'wrap' }}>
                            <span style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '3px 10px', fontWeight: 600 }}>
                              {usedLeave} / {TOTAL_LEAVE} days
                            </span>
                            <span style={{
                              background: remaining <= 3 ? 'rgba(220,38,38,0.35)' : 'rgba(22,163,74,0.25)',
                              border: `1px solid ${remaining <= 3 ? 'rgba(220,38,38,0.4)' : 'rgba(22,163,74,0.3)'}`,
                              borderRadius: 8, padding: '3px 10px', fontWeight: 600
                            }}>
                              {remaining} left
                            </span>
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="portal-card-body" style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>

                          {/* Progress bar */}
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8a9ab5', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Leave Used</span>
                              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: barColor }}>{pct}%</span>
                            </div>
                            <div style={{ height: 8, background: '#e5e9f0', borderRadius: 6, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 6, transition: 'width 0.5s ease' }} />
                            </div>
                          </div>

                          {/* Stat chips */}
                          <div className="user-stat-chips">
                            <div className="user-stat-chip chip-leave">
                              <i className="bi bi-calendar-x"></i>
                              <span className="chip-val">{usedLeave}</span>
                              <span className="chip-label">Leave</span>
                            </div>
                            <div className="user-stat-chip chip-wfh">
                              <i className="bi bi-house"></i>
                              <span className="chip-val">{usedWfh}</span>
                              <span className="chip-label">WFH</span>
                            </div>
                            <div className="user-stat-chip chip-total">
                              <i className="bi bi-stack"></i>
                              <span className="chip-val">{usedTotal}</span>
                              <span className="chip-label">Total</span>
                            </div>
                            <div className={`user-stat-chip ${remaining <= 3 ? 'chip-danger' : 'chip-remaining'}`}>
                              <i className={`bi ${remaining <= 3 ? 'bi-exclamation-triangle' : 'bi-check-circle'}`}></i>
                              <span className="chip-val">{remaining}</span>
                              <span className="chip-label">Left</span>
                            </div>
                          </div>

                          {/* Monthly breakdown table */}
                          {Object.entries(months).length === 0 ? (
                            <div className="portal-empty" style={{ padding: '16px 0', flex: 1 }}>No data for this period.</div>
                          ) : (
                            <div className="table-responsive" style={{ flex: 1 }}>
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
                                      <td style={{ fontSize: '0.85rem', fontWeight: 500 }}>{formatMonthYear(month)}</td>
                                      <td className="text-center">
                                        {s.leave > 0
                                          ? <span className="stats-badge badge-leave">{s.leave}</span>
                                          : <span className="stats-dash">—</span>}
                                      </td>
                                      <td className="text-center">
                                        {s.wfh > 0
                                          ? <span className="stats-badge badge-wfh">{s.wfh}</span>
                                          : <span className="stats-dash">—</span>}
                                      </td>
                                      <td className="text-center">
                                        <span className="stats-badge badge-total">{s.total}</span>
                                      </td>
                                    </tr>
                                  ))}
                                  <tr className="stats-total-row">
                                    <td style={{ fontSize: '0.85rem' }}>Total</td>
                                    <td className="text-center"><span className="stats-badge badge-leave">{usedLeave}</span></td>
                                    <td className="text-center"><span className="stats-badge badge-wfh">{usedWfh}</span></td>
                                    <td className="text-center"><span className="stats-badge badge-total-dark">{usedTotal}</span></td>
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
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminStatsPage;

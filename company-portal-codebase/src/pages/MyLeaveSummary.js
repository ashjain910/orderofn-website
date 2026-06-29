import React, { useEffect, useState } from 'react';
import { fetchUserLeaveRequests } from '../api/googleScriptApi';
import PageLoader from './PageLoader';

function getMonthYear(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonthYear(monthStr) {
  const [year, month] = monthStr.split('-');
  return new Date(year, parseInt(month, 10) - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
}

const TOTAL_LEAVE = 18;

const MyLeaveSummary = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const auth = JSON.parse(localStorage.getItem('auth'));

  useEffect(() => {
    setLoading(true);
    fetchUserLeaveRequests(auth.username)
      .then(data => {
        const currentYear = new Date().getFullYear();
        const monthStats = {};
        (Array.isArray(data) ? data : []).forEach(req => {
          const start = new Date(req.startDate);
          const end = req.endDate ? new Date(req.endDate) : new Date(req.startDate);
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const day = d.getDay();
            if (d.getFullYear() !== currentYear) continue;
            if ((req.type.startsWith('Leave') || req.type.startsWith('Half Day')) && (day === 0 || day === 6)) continue;
            const month = getMonthYear(d);
            if (!monthStats[month]) monthStats[month] = { leave: 0, wfh: 0, total: 0 };
            if (['Leave', 'Leave - Full Day'].includes(req.type)) { monthStats[month].leave += 1; monthStats[month].total += 1; }
            else if (['Half Day AM', 'Half Day PM', 'Leave - Half Day AM', 'Leave - Half Day PM'].includes(req.type)) { monthStats[month].leave += 0.5; monthStats[month].total += 0.5; }
            else if (['Work From Home', 'WFH - Full Day'].includes(req.type)) { monthStats[month].wfh += 1; monthStats[month].total += 1; }
            else if (['WFH - Half Day AM', 'WFH - Half Day PM'].includes(req.type)) { monthStats[month].wfh += 0.5; monthStats[month].total += 0.5; }
          }
        });
        setStats(monthStats);
        setLoading(false);
      })
      .catch(() => { setStats({}); setLoading(false); });
  }, [auth.username]);

  if (loading) return <PageLoader />;

  const currentYear = new Date().getFullYear();
  const yearStats = Object.keys(stats)
    .filter(m => m.startsWith(currentYear + '-'))
    .reduce((obj, k) => { obj[k] = stats[k]; return obj; }, {});

  const used      = Object.values(yearStats).reduce((s, v) => s + v.leave, 0);
  const wfhTotal  = Object.values(yearStats).reduce((s, v) => s + v.wfh,   0);
  const remaining = TOTAL_LEAVE - used;
  const pct       = Math.min(100, Math.round((used / TOTAL_LEAVE) * 100));
  const barColor  = pct >= 90 ? '#dc2626' : pct >= 65 ? '#d97706' : '#16a34a';

  return (
    <div className="portal-page">
      <div className="row justify-content-center g-0">
        <div className="col-12 col-lg-9 col-xl-8">

          {/* Page header card */}
          <div className="portal-card mb-4">
            <div className="portal-card-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="bi bi-person-lines-fill" style={{ fontSize: '1.1rem' }}></i>
                <div>
                  <h4 style={{ margin: 0 }}>My Leave Summary</h4>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: 1, fontWeight: 400 }}>
                    {auth?.username} · {currentYear}
                  </div>
                </div>
              </div>
              <span style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 20,
                padding: '4px 14px',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.3px'
              }}>
                FY {currentYear}
              </span>
            </div>
            <div className="portal-card-body">
              {/* Progress bar */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8a9ab5', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Leave Used — {used} of {TOTAL_LEAVE} days
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: barColor }}>{pct}%</span>
                </div>
                <div style={{ height: 10, background: '#e5e9f0', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 6, transition: 'width 0.5s ease' }} />
                </div>
              </div>

              {/* Stat chips */}
              <div className="user-stat-chips">
                <div className="user-stat-chip chip-leave">
                  <i className="bi bi-calendar-x"></i>
                  <span className="chip-val">{used}</span>
                  <span className="chip-label">Leave</span>
                </div>
                <div className="user-stat-chip chip-wfh">
                  <i className="bi bi-house"></i>
                  <span className="chip-val">{wfhTotal}</span>
                  <span className="chip-label">WFH</span>
                </div>
                <div className="user-stat-chip chip-total">
                  <i className="bi bi-stack"></i>
                  <span className="chip-val">{used + wfhTotal}</span>
                  <span className="chip-label">Total</span>
                </div>
                <div className={`user-stat-chip ${remaining <= 3 ? 'chip-danger' : 'chip-remaining'}`}>
                  <i className={`bi ${remaining <= 3 ? 'bi-exclamation-triangle' : 'bi-check-circle'}`}></i>
                  <span className="chip-val">{remaining}</span>
                  <span className="chip-label">Left</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning banner */}
          {remaining <= 5 && (
            <div className="portal-info-banner mb-4" style={{
              background: remaining === 0 ? '#fff5f5' : '#fffbeb',
              borderColor: remaining === 0 ? '#fca5a5' : '#fcd34d',
              color: remaining === 0 ? '#dc2626' : '#b45309'
            }}>
              <i className={`bi ${remaining === 0 ? 'bi-exclamation-triangle-fill' : 'bi-exclamation-circle-fill'}`}
                style={{ fontSize: '1rem', flexShrink: 0 }}></i>
              <span style={{ fontSize: '0.87rem' }}>
                You have used <strong>{used}</strong> of <strong>{TOTAL_LEAVE}</strong> leave days.{' '}
                {remaining === 0
                  ? 'No leave days remaining — any additional leave will be loss of pay.'
                  : `Only ${remaining} day${remaining === 1 ? '' : 's'} remaining.`}
              </span>
            </div>
          )}

          {/* Monthly breakdown */}
          <div className="portal-card">
            <div className="portal-card-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="bi bi-bar-chart-line" style={{ fontSize: '1.1rem' }}></i>
                <h5 style={{ margin: 0 }}>Monthly Breakdown</h5>
              </div>
              {Object.keys(yearStats).length > 0 && (
                <span style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 20,
                  padding: '3px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}>
                  {Object.keys(yearStats).length} month{Object.keys(yearStats).length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="portal-card-body" style={{ padding: 0 }}>
              {Object.keys(yearStats).length === 0 ? (
                <div className="portal-empty">
                  <i className="bi bi-inbox" style={{ fontSize: '2.4rem', display: 'block', marginBottom: 10, color: '#c5cdd8' }}></i>
                  <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>No leave data for {currentYear}</div>
                  <div style={{ fontSize: '0.82rem' }}>Your leave records will appear here once submitted.</div>
                </div>
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
                      {Object.entries(yearStats).sort(([a], [b]) => a.localeCompare(b)).map(([month, s]) => (
                        <tr key={month}>
                          <td style={{ fontWeight: 500, fontSize: '0.87rem' }}>{formatMonthYear(month)}</td>
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
                        <td style={{ fontSize: '0.87rem' }}>Total</td>
                        <td className="text-center"><span className="stats-badge badge-leave">{used}</span></td>
                        <td className="text-center"><span className="stats-badge badge-wfh">{wfhTotal}</span></td>
                        <td className="text-center"><span className="stats-badge badge-total-dark">{used + wfhTotal}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyLeaveSummary;

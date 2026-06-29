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
        setStats(monthStats); setLoading(false);
      })
      .catch(() => { setStats({}); setLoading(false); });
  }, [auth.username]);

  if (loading) return <PageLoader />;

  const currentYear = new Date().getFullYear();
  const yearStats = Object.keys(stats).filter(m => m.startsWith(currentYear + '-')).reduce((obj, k) => { obj[k] = stats[k]; return obj; }, {});
  const used = Object.values(yearStats).reduce((s, v) => s + v.leave, 0);
  const wfhTotal = Object.values(yearStats).reduce((s, v) => s + v.wfh, 0);
  const total = 18;
  const remaining = total - used;

  return (
    <div className="portal-page">
      <div className="row justify-content-center g-0">
        <div className="col-12 col-lg-9 col-xl-8">

          {/* Stat cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-sm-3">
              <div className="portal-stat-card used">
                <div className="portal-stat-icon used"><i className="bi bi-calendar-x"></i></div>
                <div><div className="portal-stat-label">Leave Used</div><div className="portal-stat-value">{used}</div></div>
              </div>
            </div>
            <div className="col-6 col-sm-3">
              <div className="portal-stat-card remaining">
                <div className="portal-stat-icon remaining"><i className="bi bi-calendar-check"></i></div>
                <div><div className="portal-stat-label">Remaining</div><div className="portal-stat-value">{remaining}</div></div>
              </div>
            </div>
            <div className="col-6 col-sm-3">
              <div className="portal-stat-card wfh">
                <div className="portal-stat-icon wfh"><i className="bi bi-house-check"></i></div>
                <div><div className="portal-stat-label">WFH Days</div><div className="portal-stat-value">{wfhTotal}</div></div>
              </div>
            </div>
            <div className="col-6 col-sm-3">
              <div className="portal-stat-card total">
                <div className="portal-stat-icon total"><i className="bi bi-calendar2"></i></div>
                <div><div className="portal-stat-label">Total</div><div className="portal-stat-value">{total}</div></div>
              </div>
            </div>
          </div>

          {/* Info banner */}
          {remaining <= 5 && (
            <div className="portal-info-banner mb-4">
              <i className="bi bi-info-circle-fill" style={{ fontSize: '1.1rem', flexShrink: 0 }}></i>
              <span>
                You have used <strong>{used}</strong> of <strong>{total}</strong> leave days.{' '}
                {remaining === 0 ? 'No leave days left — any additional leave is loss of pay.' : `Only ${remaining} day${remaining === 1 ? '' : 's'} remaining.`}
              </span>
            </div>
          )}

          {/* Monthly breakdown */}
          <div className="portal-card">
            <div className="portal-card-header">
              <i className="bi bi-bar-chart-line" style={{ fontSize: '1.1rem' }}></i>
              <h5>Monthly Breakdown — {currentYear}</h5>
            </div>
            <div className="portal-card-body" style={{ padding: 0 }}>
              {Object.keys(yearStats).length === 0 ? (
                <div className="portal-empty"><i className="bi bi-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}></i>No leave data for this year.</div>
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
                          <td className="fw-semibold">{formatMonthYear(month)}</td>
                          <td className="text-center">{s.leave > 0 ? <span className="badge bg-danger">{s.leave}</span> : <span style={{ color: '#8a9ab5' }}>—</span>}</td>
                          <td className="text-center">{s.wfh > 0 ? <span className="badge bg-warning text-dark">{s.wfh}</span> : <span style={{ color: '#8a9ab5' }}>—</span>}</td>
                          <td className="text-center"><span className="badge" style={{ background: '#eef0ff', color: '#000033', fontWeight: 700 }}>{s.total}</span></td>
                        </tr>
                      ))}
                      <tr style={{ background: '#f1f4f9', fontWeight: 700 }}>
                        <td className="fw-bold">Total</td>
                        <td className="text-center"><span className="badge bg-danger">{used}</span></td>
                        <td className="text-center"><span className="badge bg-warning text-dark">{wfhTotal}</span></td>
                        <td className="text-center"><span className="badge" style={{ background: '#000033', color: '#fff', fontWeight: 700 }}>{used + wfhTotal}</span></td>
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

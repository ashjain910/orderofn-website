import React, { useEffect, useState } from 'react';
import { fetchUserLeaveRequests } from '../api/googleScriptApi';
import PageLoader from './PageLoader';

function getMonthYear(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonthYear(monthStr) {
  const [year, month] = monthStr.split('-');
  const date = new Date(year, parseInt(month, 10) - 1, 1);
  return `${date.toLocaleString('default', { month: 'long' })} ${year}`;
}

const MyLeaveSummary = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const auth = JSON.parse(localStorage.getItem('auth'));

  useEffect(() => {
    setLoading(true);
    fetchUserLeaveRequests(auth.username)
      .then(data => {
        // Build stats month-wise
        const monthStats = {};
        (Array.isArray(data) ? data : []).forEach(req => {
          const start = new Date(req.startDate);
          const end = req.endDate ? new Date(req.endDate) : new Date(req.startDate);
          for (
            let d = new Date(start);
            d <= end;
            d.setDate(d.getDate() + 1)
          ) {
            const month = getMonthYear(d);
            if (!monthStats[month]) monthStats[month] = { leave: 0, wfh: 0, total: 0 };
            if (req.type === 'Leave') monthStats[month].leave += 1;
            if (req.type === 'Work From Home') monthStats[month].wfh += 1;
            monthStats[month].total += 1;
          }
        });
        setStats(monthStats);
        setLoading(false);
      })
      .catch(() => {
        setStats({});
        setLoading(false);
      });
  }, [auth.username]);

  if (loading) return <PageLoader />;

  // Calculate leave count summary
  let used = 0;
  (stats && Object.keys(stats).length > 0) && Object.values(stats).forEach(s => { used += s.leave; });
  const total = 12;
  const remaining = total - used;

  return (
    <div className="container py-4">
      <div className="card shadow" style={{ background: 'linear-gradient(135deg, #f8fafc 60%, #cfe2ff 100%)' }}>
        <div className="card-header bg-primary text-white text-center">
          <h2 className="mb-0" style={{ fontSize: '24px' }}>My Leave Summary</h2>
        </div>
        <div className="card-body">
          <div className="mb-3 text-center">
            <span className="fw-bold text-dark">Leave Count: {total}/{used} ({remaining} remaining)</span><br />
            <span>You have used {used} out of your {total} available leave days. Only {remaining} leave days remain. After using all 12 leave days, any additional leave taken will be considered loss of pay.</span>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-sm mb-0">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Leave</th>
                  <th>Work From Home</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {stats && Object.keys(stats).length > 0 ? (
                  <>
                    {Object.entries(stats).sort(([a], [b]) => a.localeCompare(b)).map(([month, s]) => (
                      <tr key={month}>
                        <td>{formatMonthYear(month)}</td>
                        <td>{s.leave}</td>
                        <td>{s.wfh}</td>
                        <td>{s.total}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="fw-bold text-end">Total</td>
                      <td className="fw-bold">
                        <span className="badge bg-info">
                          {Object.values(stats).reduce((sum, s) => sum + s.leave, 0)}
                        </span>
                      </td>
                      <td className="fw-bold">
                        <span className="badge bg-info">
                          {Object.values(stats).reduce((sum, s) => sum + s.wfh, 0)}
                        </span>
                      </td>
                      <td className="fw-bold">
                        <span className="badge bg-info">
                          {Object.values(stats).reduce((sum, s) => sum + s.total, 0)}
                        </span>
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">No leave data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLeaveSummary;
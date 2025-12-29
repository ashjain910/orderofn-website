import React, { useEffect, useState } from 'react';
import { fetchLeaveRequests } from '../api/googleScriptApi';
import PageLoader from '../pages/PageLoader';
import { useLoader } from '../context/LoaderProvider'; // <-- Add this import

function getMonthYear(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonthYear(monthStr) {
  // monthStr is in "YYYY-MM" format
  const [year, month] = monthStr.split('-');
  const date = new Date(year, parseInt(month, 10) - 1, 1);
  return `${date.toLocaleString('default', { month: 'long' })} ${year}`;
}

const AdminStatsPage = () => {
  const [userStats, setUserStats] = useState({});
  const [allData, setAllData] = useState([]);
  const [selectedUser, setSelectedUser] = useState('All');
  const { loading, setLoading } = useLoader(); // <-- Use loader context

  useEffect(() => {
    setLoading(true); // Show loader on page load/reload
    fetchLeaveRequests()
      .then(data => {
        setAllData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [setLoading]);

  useEffect(() => {
    if (!allData.length) return;
    const stats = {};
    allData.forEach(req => {
      if (!stats[req.name]) stats[req.name] = {};
      const start = new Date(req.startDate);
      // If endDate is missing, empty, or invalid, use startDate
      let end = req.endDate && !isNaN(new Date(req.endDate)) && req.endDate !== 'Invalid Date'
        ? new Date(req.endDate)
        : new Date(req.startDate);

      // Loop through each day in the range
      for (
        let d = new Date(start);
        d <= end;
        d.setDate(d.getDate() + 1)
      ) {
        const day = d.getDay();
        // 0 = Sunday, 6 = Saturday; skip weekends for leave calculation
        if (req.type === 'Leave' && (day === 0 || day === 6)) continue;
        const month = getMonthYear(d);
        if (!stats[req.name][month]) stats[req.name][month] = { leave: 0, wfh: 0, total: 0 };
        if (req.type === 'Leave') stats[req.name][month].leave += 1;
        if (req.type === 'Work From Home') stats[req.name][month].wfh += 1;
        stats[req.name][month].total += 1;
      }
    });
    setUserStats(stats);
  }, [allData]);

  // Get all unique users for the dropdown
  const userOptions = ['All', ...Object.keys(userStats)];

  // Filter stats by selected user
  const filteredStats = selectedUser === 'All'
    ? userStats
    : { [selectedUser]: userStats[selectedUser] };

  const colorArray = [
    '#519db8', '#51b8ad', '#5bce95', '#b6ce5b', '#cc803d',
    '#cc493d', '#447bb5', '#4135cc', '#8d28b5', '#b528a7',
    '#b52867', '#b52830', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="container-fluid mt-4 px-2 px-md-4">
      <div className="card shadow" style={{ width: '100%', background: 'linear-gradient(135deg, #f8fafc 60%, #cfe2ff 100%)' }}>
        <div className="card-header bg-success text-white text-center">
          <h2 className="mb-0" style={{ fontSize: '24px' }}>Leave Statistics</h2>
        </div>
        <div className="card-body">
          <div className="mb-4 d-flex flex-column flex-sm-row flex-wrap align-items-stretch align-items-sm-center gap-2">
            <div>
              <label className="fw-bold mb-1" htmlFor="userFilter">Filter by User:</label>
              <select
                id="userFilter"
                className="form-select"
                style={{ maxWidth: 220, minWidth: 120 }}
                value={selectedUser}
                onChange={e => {
                  setLoading(true); // Show loader on filter change
                  setSelectedUser(e.target.value);
                  setTimeout(() => setLoading(false), 300); // Simulate loading for UX
                }}
                disabled={loading}
              >
                {userOptions.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            {Object.entries(filteredStats).map(([user, months], idx) => (
              <div className="col-12 col-md-6 mb-4" key={user}>
                <div
                  className="card h-100 shadow-sm"
                  style={{ borderColor: colorArray[idx % colorArray.length], borderWidth: 2, borderStyle: 'solid' }}
                >
                  <div
                    className="card-header d-flex justify-content-between align-items-center"
                    style={{ background: colorArray[idx % colorArray.length] }}
                  >
                    <h5 className="mb-0 text-white">{user}</h5>
                    {/* Leave Balance summary for this user */}
                    {(() => {
                      // Calculate leave used for this user
                      let used = 0;
                      if (months && typeof months === 'object') {
                        Object.values(months).forEach(s => { used += s.leave; });
                      }
                      const total = 12;
                      const remaining = total - used;
                        return (
                        <span className="fw-bold text-white" style={{ fontSize: 14 }}>
                          Leave Balance: {used}/{total} ({remaining} remaining)
                        </span>
                        );
                    })()}
                  </div>
                  <div className="card-body">
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
                          {Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).map(([month, stats]) => (
                            <tr key={month}>
                              <td>{formatMonthYear(month)}</td>
                              <td><span>{stats.leave}</span></td>
                              <td><span>{stats.wfh}</span></td>
                              <td><span>{stats.total}</span></td>
                            </tr>
                          ))}
                          {/* Total row */}
                          <tr>
                            <td className="fw-bold text-end">Total</td>
                            <td className="fw-bold">
                              <span className="badge bg-info">
                                {Object.values(months).reduce((sum, s) => sum + s.leave, 0)}
                              </span>
                            </td>
                            <td className="fw-bold">
                              <span className="badge bg-info">
                                {Object.values(months).reduce((sum, s) => sum + s.wfh, 0)}
                              </span>
                            </td>
                            <td className="fw-bold">
                              <span className="badge bg-info">
                                {Object.values(months).reduce((sum, s) => sum + s.total, 0)}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {Object.keys(filteredStats).length === 0 && (
              <div className="text-center text-muted">No leave data found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsPage;
import React, { useEffect, useState } from 'react';
import { fetchLeaveRequests, updateLeaveStatus } from '../api/googleScriptApi';
import PageLoader from '../pages/PageLoader';
import { useLoader } from '../context/LoaderProvider';
import { formatDateWithDay } from '../pipes/formatDatePipe';

const statusColors = { Approved: '#16a34a', Pending: '#d97706', Rejected: '#dc2626', Hold: '#6b7280' };
const statusBg    = { Approved: '#f0fff4', Pending: '#fffbeb', Rejected: '#fff5f5', Hold: '#f3f4f6' };

const months = [
  { value: 0, label: 'Jan' }, { value: 1, label: 'Feb' }, { value: 2, label: 'Mar' },
  { value: 3, label: 'Apr' }, { value: 4, label: 'May' }, { value: 5, label: 'Jun' },
  { value: 6, label: 'Jul' }, { value: 7, label: 'Aug' }, { value: 8, label: 'Sep' },
  { value: 9, label: 'Oct' }, { value: 10, label: 'Nov' }, { value: 11, label: 'Dec' },
];

const AdminPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [success, setSuccess] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const { loading, setLoading } = useLoader();
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [selectedType, setSelectedType] = useState('all');
  const [userList, setUserList] = useState([]);

  const loadLeaves = () => {
    setLoading(true);
    fetchLeaveRequests()
      .then(data => {
        const sorted = data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        setLeaves(sorted);
        setUserList(Array.from(new Set(data.map(l => l.name))).sort());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadLeaves(); }, []);

  const handleStatusChange = async (leave, status) => {
    const key = `${leave.name}-${leave.startDate}-${leave.endDate}-${leave.reason}`;
    setLoadingId(key);
    setLoading(true);
    const result = await updateLeaveStatus(leave, status);
    if (result.success) {
      setSuccess(`Status updated to "${status}"`);
      loadLeaves();
      setTimeout(() => setSuccess(''), 2500);
    }
    setLoadingId(null);
    setLoading(false);
  };

  const filtered = leaves.filter(leave => {
    if (selectedUser && leave.name !== selectedUser) return false;
    const start = new Date(leave.startDate);
    if (selectedMonth !== 'all' && start.getMonth() !== Number(selectedMonth)) return false;
    if (selectedYear !== 'all' && start.getFullYear() !== Number(selectedYear)) return false;
    if (selectedType !== 'all' && leave.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="portal-page">
      {loading && <PageLoader />}
      <div className="row justify-content-center g-0">
        <div className="col-12 col-xl-11">

          <div className="d-flex justify-content-between align-items-center mb-3" style={{ flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h4 style={{ fontWeight: 700, color: '#0d1b3e', margin: 0 }}>Leave Requests</h4>
              <p style={{ color: '#8a9ab5', fontSize: '0.88rem', margin: '2px 0 0' }}>{filtered.length} record{filtered.length !== 1 ? 's' : ''} found</p>
            </div>
            <button className="portal-btn portal-btn-sm" onClick={loadLeaves} disabled={loading}>
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="portal-card mb-3">
            <div className="portal-card-body" style={{ padding: '18px 24px' }}>
              <div className="d-flex flex-wrap align-items-end" style={{ gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="portal-label">User</label>
                  <select className="portal-select" style={{ width: 180, height: 38, fontSize: '0.85rem' }} value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                    <option value="">All Users</option>
                    {userList.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="portal-label">Month</label>
                  <select className="portal-select" style={{ width: 120, height: 38, fontSize: '0.85rem' }} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                    <option value="all">All</option>
                    {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="portal-label">Year</label>
                  <select className="portal-select" style={{ width: 100, height: 38, fontSize: '0.85rem' }} value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                    <option value="all">All</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="portal-label">Type</label>
                  <select className="portal-select" style={{ width: 160, height: 38, fontSize: '0.85rem' }} value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="Leave">Leave</option>
                    <option value="Work From Home">Work From Home</option>
                  </select>
                </div>
                {(selectedUser || selectedMonth !== 'all' || selectedYear !== 'all' || selectedType !== 'all') && (
                  <button className="portal-btn-outline portal-btn-sm" style={{ height: 38, padding: '0 14px', marginTop: 'auto' }}
                    onClick={() => { setSelectedUser(''); setSelectedMonth('all'); setSelectedYear(String(new Date().getFullYear())); setSelectedType('all'); }}>
                    <i className="bi bi-x"></i> Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="portal-card">
            <div className="portal-card-header">
              <i className="bi bi-calendar2-check" style={{ fontSize: '1.1rem' }}></i>
              <h5>All Leave Requests</h5>
            </div>
            <div className="portal-card-body" style={{ padding: 0 }}>
              {success && <div className="portal-alert-success" style={{ margin: '16px 20px 0' }}>{success}</div>}
              <div className="table-responsive">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={7} className="portal-empty">No leave requests found.</td></tr>
                    ) : filtered.map((leave, idx) => {
                      const key = `${leave.name}-${leave.startDate}-${leave.endDate}-${leave.reason}`;
                      return (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600, color: '#0d1b3e' }}>{leave.name}</td>
                          <td>{formatDateWithDay(leave.startDate)}</td>
                          <td>{leave.startDate === leave.endDate || !leave.endDate ? <span style={{ color: '#8a9ab5' }}>—</span> : formatDateWithDay(leave.endDate)}</td>
                          <td style={{ maxWidth: 200 }}>
                            <span
                              style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'help' }}
                              title={leave.reason}
                            >
                              {leave.reason.length > 80 ? leave.reason.slice(0, 80) + '…' : leave.reason}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              background: statusBg[leave.status] || '#f3f4f6',
                              color: statusColors[leave.status] || '#6b7280',
                              border: `1px solid ${statusColors[leave.status] || '#6b7280'}33`,
                              borderRadius: 6,
                              padding: '3px 10px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                            }}>{leave.status}</span>
                          </td>
                          <td style={{ fontSize: '0.82rem', color: '#374151' }}>{leave.type}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              {leave.status !== 'Reapprove' && (
                                <button
                                  className="portal-btn portal-btn-sm portal-btn-success"
                                  onClick={() => handleStatusChange(leave, 'Approved')}
                                  disabled={leave.status === 'Approved' || loadingId === key}
                                >
                                  {loadingId === key ? <span className="spinner-border spinner-border-sm"></span> : 'Approve'}
                                </button>
                              )}
                              {leave.status === 'Reapprove' && (
                                <button
                                  className="portal-btn portal-btn-sm portal-btn-warning"
                                  onClick={() => handleStatusChange(leave, 'Approved')}
                                  disabled={loadingId === key}
                                >
                                  {loadingId === key ? <span className="spinner-border spinner-border-sm"></span> : 'Reapprove'}
                                </button>
                              )}
                              <button
                                className="portal-btn portal-btn-sm portal-btn-danger"
                                onClick={() => handleStatusChange(leave, 'Rejected')}
                                disabled={leave.status === 'Rejected' || loadingId === key}
                              >
                                {loadingId === key ? <span className="spinner-border spinner-border-sm"></span> : 'Reject'}
                              </button>
                              <button
                                className="portal-btn portal-btn-sm"
                                style={{ background: '#6b7280' }}
                                onClick={() => handleStatusChange(leave, 'Hold')}
                                disabled={leave.status === 'Hold' || loadingId === key}
                              >
                                {loadingId === key ? <span className="spinner-border spinner-border-sm"></span> : 'Hold'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPage;

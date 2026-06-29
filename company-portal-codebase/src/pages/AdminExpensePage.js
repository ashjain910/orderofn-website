import React, { useEffect, useState } from 'react';
import { fetchAllExpenses, updateExpenseRemark } from '../api/googleScriptApi';
import { formatDate } from '../pipes/formatDatePipe';
import { useLoader } from '../context/LoaderProvider';

const statusColors = { Sent: '#16a34a', Pending: '#d97706', Rejected: '#dc2626' };
const statusBg    = { Sent: '#f0fff4', Pending: '#fffbeb', Rejected: '#fff5f5' };

const AdminExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [remark, setRemark] = useState({});
  const [status, setStatus] = useState({});
  const [success, setSuccess] = useState('');
  const [reload, setReload] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedUser, setSelectedUser] = useState('All');
  const { loading, setLoading } = useLoader();

  useEffect(() => {
    setLoading(true);
    fetchAllExpenses().then((res) => {
      const sorted = (res.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(sorted);
      setLoading(false);
    });
  }, [reload, setLoading]);

  const handleUpdate = async (id) => {
    setLoading(true);
    await updateExpenseRemark(id, status[id] || 'Approved', remark[id] || '');
    setSuccess('Expense updated!');
    setRemark({ ...remark, [id]: '' });
    setStatus({ ...status, [id]: '' });
    setReload(r => r + 1);
    setTimeout(() => setSuccess(''), 2500);
    setLoading(false);
  };

  const now = new Date();
  const monthOptions = [{ value: 'All', label: 'All Months' }];
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    monthOptions.push({ value, label });
  }

  const userOptions = ['All', ...Array.from(new Set(expenses.map(e => e.username)))];

  const filtered = expenses.filter(exp => {
    const matchMonth = selectedMonth === 'All' ||
      (new Date(exp.date).getFullYear() === parseInt(selectedMonth.split('-')[0], 10) &&
       new Date(exp.date).getMonth() + 1 === parseInt(selectedMonth.split('-')[1], 10));
    const matchUser = selectedUser === 'All' || exp.username === selectedUser;
    return matchMonth && matchUser;
  });

  const total = filtered.reduce((s, e) => s + Number(e.amount || 0), 0);
  const pending = filtered.filter(e => e.status === 'Pending').length;

  return (
    <div className="portal-page">
      <div className="row justify-content-center g-0">
        <div className="col-12 col-xl-11">

          <div className="mb-3">
            <h4 style={{ fontWeight: 700, color: '#0d1b3e', margin: 0 }}>User Expenses</h4>
            <p style={{ color: '#8a9ab5', fontSize: '0.88rem', margin: '2px 0 0' }}>{filtered.length} expense{filtered.length !== 1 ? 's' : ''} found</p>
          </div>

          {/* Summary cards */}
          <div className="row g-3 mb-3">
            <div className="col-6 col-md-3">
              <div className="portal-stat-card total">
                <div className="portal-stat-icon total"><i className="bi bi-cash-coin"></i></div>
                <div>
                  <div className="portal-stat-label">Total Amount</div>
                  <div className="portal-stat-value" style={{ fontSize: '1.3rem' }}>₹{total}</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="portal-stat-card wfh">
                <div className="portal-stat-icon wfh"><i className="bi bi-hourglass-split"></i></div>
                <div>
                  <div className="portal-stat-label">Pending</div>
                  <div className="portal-stat-value">{pending}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="portal-card mb-3">
            <div className="portal-card-body" style={{ padding: '14px 20px' }}>
              <div className="d-flex flex-wrap gap-3 align-items-end">
                <div>
                  <label className="portal-label" style={{ marginBottom: 4 }}>Month</label>
                  <select className="portal-select" style={{ width: 200, height: 38, fontSize: '0.85rem' }} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                    {monthOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="portal-label" style={{ marginBottom: 4 }}>User</label>
                  <select className="portal-select" style={{ width: 180, height: 38, fontSize: '0.85rem' }} value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                    {userOptions.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="portal-card">
            <div className="portal-card-header">
              <i className="bi bi-cash-coin" style={{ fontSize: '1.1rem' }}></i>
              <h5>All Expenses</h5>
            </div>
            <div className="portal-card-body" style={{ padding: 0 }}>
              {success && <div className="portal-alert-success" style={{ margin: '16px 20px 0' }}>{success}</div>}
              {filtered.length === 0 ? (
                <div className="portal-empty">No expenses found.</div>
              ) : (
                <div className="table-responsive">
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Remark</th>
                        <th>Remark Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(exp => (
                        <tr key={exp.id}>
                          <td style={{ fontWeight: 600, color: '#0d1b3e' }}>{exp.username}</td>
                          <td>{formatDate(exp.date)}</td>
                          <td>
                            <span style={{ background: '#eef0ff', color: '#000033', borderRadius: 6, padding: '3px 10px', fontWeight: 700, fontSize: '0.85rem' }}>
                              ₹{exp.amount}
                            </span>
                          </td>
                          <td style={{ maxWidth: 200, fontSize: '0.85rem' }}>{exp.description}</td>
                          <td>
                            <select
                              className="portal-select"
                              style={{ height: 34, fontSize: '0.82rem', padding: '0 8px', width: 120,
                                background: statusBg[status[exp.id] || exp.status] || '#f7f9fc',
                                color: statusColors[status[exp.id] || exp.status] || '#374151',
                                borderColor: statusColors[status[exp.id] || exp.status] || '#e0e6ed',
                                fontWeight: 600 }}
                              value={status[exp.id] || exp.status}
                              onChange={e => setStatus({ ...status, [exp.id]: e.target.value })}
                            >
                              <option value="Sent">Sent</option>
                              <option value="Pending">Pending</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td>
                            <input
                              className="portal-input"
                              style={{ height: 34, fontSize: '0.82rem', padding: '0 10px' }}
                              value={remark[exp.id] !== undefined ? remark[exp.id] : (exp.adminRemark || '')}
                              onChange={e => setRemark({ ...remark, [exp.id]: e.target.value })}
                              placeholder="Add remark…"
                            />
                          </td>
                          <td style={{ fontSize: '0.82rem', color: '#8a9ab5' }}>{formatDate(exp.remarkDate)}</td>
                          <td>
                            <button className="portal-btn portal-btn-sm portal-btn-success" onClick={() => handleUpdate(exp.id)}>
                              <i className="bi bi-check-lg"></i> Update
                            </button>
                          </td>
                        </tr>
                      ))}
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

export default AdminExpensePage;

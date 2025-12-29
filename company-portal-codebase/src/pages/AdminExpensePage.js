import React, { useEffect, useState } from 'react';
import { fetchAllExpenses, updateExpenseRemark } from '../api/googleScriptApi';
import { formatDate } from '../pipes/formatDatePipe'; // Use the formatDate pipe
import { useLoader } from '../context/LoaderProvider';

const AdminExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [remark, setRemark] = useState({});
  const [status, setStatus] = useState({});
  const [success, setSuccess] = useState('');
  const [reload, setReload] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('All'); // Default to "All"
  const [selectedUser, setSelectedUser] = useState('All');
  const { loading, setLoading } = useLoader();

  useEffect(() => {
    setLoading(true);
    fetchAllExpenses().then((res) => {
      const sortedExpenses = (res.data || []).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
      setExpenses(sortedExpenses);
      setLoading(false);
    });
  }, [reload, setLoading]);

  const handleUpdate = async (id) => {
    setLoading(true);
    await updateExpenseRemark(id, status[id] || 'Approved', remark[id] || '');
    setSuccess('Expense updated!');
    setRemark({ ...remark, [id]: '' });
    setStatus({ ...status, [id]: '' });
    setReload((r) => r + 1);
    setTimeout(() => setSuccess(''), 2000);
    setLoading(false);
  };

  // Filter logic
  const filteredExpenses = expenses.filter((exp) => {
    const matchesMonth =
      selectedMonth === 'All' ||
      (new Date(exp.date).getFullYear() === parseInt(selectedMonth.split('-')[0], 10) &&
        new Date(exp.date).getMonth() + 1 === parseInt(selectedMonth.split('-')[1], 10));
    const matchesUser = selectedUser === 'All' || exp.username === selectedUser;
    return matchesMonth && matchesUser;
  });

  // Calculate total expenses for the filtered data
  const totalMonthExpense = filteredExpenses.reduce((sum, exp) => {
    return sum + Number(exp.amount || 0);
  }, 0);

  // Generate month options for the filter (last 12 months)
  const monthOptions = [{ value: 'All', label: 'All Months' }];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    monthOptions.push({ value, label });
  }

  // Generate user options for the filter
  const userOptions = ['All', ...Array.from(new Set(expenses.map((exp) => exp.username)))];

  return (
    <div className="container-fluid mt-4 px-2 px-md-4">
      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0" style={{ fontSize: '24px' }}>All User Expenses</h4>
        </div>
        <div className="card-body">
          <div className="mb-3 d-flex flex-column flex-md-row flex-wrap align-items-stretch align-items-md-center justify-content-between gap-2">
            <div className="d-flex flex-column flex-sm-row align-items-stretch gap-2">
              <div>
                <label className="fw-bold mb-1" htmlFor="monthFilter">Filter by Month:</label>
                <select
                  id="monthFilter"
                  className="form-select"
                  style={{ width: 220, minWidth: 120 }}
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {monthOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="fw-bold mb-1" htmlFor="userFilter">Filter by User:</label>
                <select
                  id="userFilter"
                  className="form-select"
                  style={{ width: 180, minWidth: 100 }}
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  {userOptions.map((user) => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="alert alert-info fw-bold mb-0 mt-2 mt-md-0" style={{ minWidth: 220 }}>
              Total Expenses for {selectedMonth === 'All' ? 'All Months' : monthOptions.find((m) => m.value === selectedMonth)?.label}
              {selectedUser !== 'All' && ` (${selectedUser})`}
              : <span className="text-success">{totalMonthExpense}</span>
            </div>
          </div>
          {success && <div className="alert alert-success">{success}</div>}
          {filteredExpenses.length === 0 ? (
            <div className="text-muted text-center">No expenses found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle" style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Admin Remark</th>
                    <th>Remark Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((exp) => (
                    <tr key={exp.id}>
                      <td>{exp.username}</td>
                      <td>{formatDate(exp.date)}</td> {/* Use formatDate */}
                      <td>{exp.amount}</td>
                      <td>{exp.description}</td>
                      <td>
                        <select
                          className="form-select"
                          value={status[exp.id] || exp.status}
                          onChange={(e) => setStatus({ ...status, [exp.id]: e.target.value })}
                        >
                          <option value="Sent">Sent</option>
                          <option value="Pending">Pending</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={remark[exp.id] || exp.adminRemark}
                          onChange={(e) => setRemark({ ...remark, [exp.id]: e.target.value })}
                        />
                      </td>
                      <td>{formatDate(exp.remarkDate)}</td> {/* Use formatDate */}
                      <td>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleUpdate(exp.id)}
                        >
                          Update
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
  );
};

export default AdminExpensePage;
import React, { useState } from 'react';
import { sendUserExpense, fetchUserExpenses } from '../api/googleScriptApi';
import { formatDate } from '../pipes/formatDatePipe';
import { useLoader } from '../context/LoaderProvider';
import PageLoader from './PageLoader';

const UserExpensePage = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const auth = JSON.parse(localStorage.getItem('auth'));
  const { loading, setLoading } = useLoader();

  const loadExpenses = async () => {
    setLoading(true);
    const res = await fetchUserExpenses(auth.username);
    if (res.success) setExpenses((res.data || []).sort((a, b) => new Date(b.date) - new Date(a.date)));
    else alert(res?.message || 'Failed to fetch expenses.');
    setLoading(false);
  };

  React.useEffect(() => { loadExpenses(); }, []); // eslint-disable-line

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(''); setError('');
    if (!amount || !description || !date) { setError('Please fill all fields.'); return; }
    setLoading(true);
    try {
      const res = await sendUserExpense(auth.username, amount, description, date);
      if (res.success) {
        setSuccess('Expense submitted!'); setAmount(''); setDescription(''); setDate(''); setShowForm(false);
        await loadExpenses();
      } else { setError('Failed to submit.'); alert(res?.message || 'Failed to submit.'); }
    } catch { setError('Failed to submit.'); }
    finally { setLoading(false); }
  };

  const statusBadge = (status) => {
    const map = { Approved: 'success', Rejected: 'danger', Pending: 'warning text-dark' };
    return <span className={`badge bg-${map[status] || 'secondary'}`}>{status}</span>;
  };

  return (
    <div className="portal-page">
      {loading && <PageLoader />}
      <div className="row justify-content-center g-0">
        <div className="col-12 col-lg-10">

          <div className="d-flex justify-content-end mb-3">
            <button className="portal-btn" onClick={() => setShowForm(true)}>
              <i className="bi bi-plus-circle"></i> Submit Expense
            </button>
          </div>

          <div className="portal-card">
            <div className="portal-card-header">
              <i className="bi bi-receipt" style={{ fontSize: '1.1rem' }}></i>
              <h5>My Expenses</h5>
            </div>
            <div className="portal-card-body">
              <div className="table-responsive">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Admin Remark</th>
                      <th>Remark Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.length === 0 ? (
                      <tr><td colSpan={6} className="portal-empty">No expenses found.</td></tr>
                    ) : (
                      expenses.map((exp, idx) => (
                        <tr key={idx}>
                          <td style={{ whiteSpace: 'nowrap' }}>{formatDate(exp.date)}</td>
                          <td>
                            <span className="badge" style={{ background: '#eef0ff', color: '#000033', fontWeight: 700, fontSize: '0.85rem', padding: '5px 10px', borderRadius: 6 }}>
                              <i className="bi bi-currency-rupee"></i>{exp.amount}
                            </span>
                          </td>
                          <td>{exp.description}</td>
                          <td>{statusBadge(exp.status)}</td>
                          <td>{exp.adminRemark || <span style={{ color: '#8a9ab5' }}>—</span>}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{formatDate(exp.remarkDate)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Expense Modal */}
      {showForm && (
        <>
          <div className="modal-backdrop fade show" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}></div>
          <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content" style={{ borderRadius: 14, overflow: 'hidden', border: 'none' }}>
                <div className="portal-modal-header">
                  <h5><i className="bi bi-receipt me-2"></i>Submit Expense</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowForm(false)}></button>
                </div>
                <div className="modal-body" style={{ padding: 24 }}>
                  {success && <div className="portal-alert-success">{success}</div>}
                  {error && <div className="portal-alert-error">{error}</div>}
                  <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-3">
                      <label className="portal-label"><i className="bi bi-calendar-event me-1"></i>Date</label>
                      <input type="date" className="portal-input" value={date} onChange={e => setDate(e.target.value)} required disabled={loading} />
                    </div>
                    <div className="mb-3">
                      <label className="portal-label"><i className="bi bi-currency-rupee me-1"></i>Amount</label>
                      <input type="number" className="portal-input" value={amount} onChange={e => setAmount(e.target.value)} required disabled={loading} placeholder="Enter amount" />
                    </div>
                    <div className="mb-4">
                      <label className="portal-label"><i className="bi bi-card-text me-1"></i>Description</label>
                      <textarea className="portal-textarea" value={description} onChange={e => setDescription(e.target.value)} required disabled={loading} placeholder="Enter description" style={{ minHeight: 70 }} />
                    </div>
                    <button className="portal-btn w-100" type="submit" disabled={loading} style={{ justifyContent: 'center', height: 46 }}>
                      {loading ? <><span className="spinner-border spinner-border-sm"></span> Submitting…</> : <><i className="bi bi-send"></i> Submit</>}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserExpensePage;

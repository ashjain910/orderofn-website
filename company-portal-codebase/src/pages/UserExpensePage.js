import React, { useState } from 'react';
import { sendUserExpense, fetchUserExpenses } from '../api/googleScriptApi';
import { formatDate } from '../pipes/formatDatePipe'; // Import the pipe
import { useLoader } from '../context/LoaderProvider';
import PageLoader from './PageLoader';

const UserExpensePage = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to control the modal visibility
  const auth = JSON.parse(localStorage.getItem('auth'));
  const { loading, setLoading } = useLoader();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!amount || !description || !date) {
      setError('Please fill all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await sendUserExpense(auth.username, amount, description, date);
      if (res.success) {
        setSuccess('Expense submitted!');
        setAmount('');
        setDescription('');
        setDate('');
        setShowForm(false); // Close the modal after submission
        await loadExpenses();
      } else {
        setError('Failed to submit.');
        alert(res?.message || 'Failed to submit.');
      }
    } catch {
      setError('Failed to submit.');
    } finally {
      setLoading(false);
    }
  };

  const loadExpenses = async () => {
    setLoading(true);
    const res = await fetchUserExpenses(auth.username);
    if (res.success) {
      const sortedExpenses = (res.data || []).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
      setExpenses(sortedExpenses);
    } else {
      alert(res?.message || 'Failed to fetch expenses.');
    }
    setLoading(false);
  };

  React.useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line
  }, []);

  

  return (
    <div className="container py-4">
      {loading && <PageLoader />}
      <div className="row g-4 justify-content-center">
        {/* Submit Expense Button */}
        <div className="col-12 mt-1 text-end">
          <button
            style={{ fontSize: '13px' }}
            className="btn btn-success"
            onClick={() => setShowForm(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>Submit Expense
          </button>
        </div>

        {/* My Expenses Section */}
        <div className="col-12 mt-1">
          <div className="card shadow-lg border-0" style={{ borderRadius: 18 }}>
            <div className="card-header bg-info text-white" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
              <h5 className="mb-0 text-center text-md-start">
                <i className="bi bi-list-ul me-2"></i>My Expenses
              </h5>
            </div>
            <div className="card-body" style={{ background: '#f8fafc', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
              <div className="table-responsive">
                <table className="table table-bordered align-middle mb-0">
                  <thead className="table-light">
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
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">No expenses found.</td>
                      </tr>
                    ) : (
                      expenses.map((exp, idx) => (
                        <tr key={idx}>
                          <td>{formatDate(exp.date)}</td> {/* Updated */}
                          <td>
                            <span className="badge bg-primary fs-6">
                              <i className="bi bi-currency-rupee"></i>{exp.amount}
                            </span>
                          </td>
                          <td>{exp.description}</td>
                          <td>
                            {exp.status === 'Approved' ? (
                              <span className="badge bg-success">{exp.status}</span>
                            ) : exp.status === 'Rejected' ? (
                              <span className="badge bg-danger">{exp.status}</span>
                            ) : (
                              <span className="badge bg-secondary">{exp.status}</span>
                            )}
                          </td>
                          <td>{exp.adminRemark || <span className="text-muted">-</span>}</td>
                          <td>{formatDate(exp.remarkDate)}</td> {/* Updated */}
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

      {/* Modal for Submit Expense */}
      {showForm && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1040,
            }}
          ></div>

          {/* Modal */}
          <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">Submit Expense</h5>
                  <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>
                <div className="modal-body">
                  {success && <div className="alert alert-success">{success}</div>}
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-3">
                      <label className="fw-bold" htmlFor="date">
                        <i className="bi bi-calendar-event me-1"></i>Date
                      </label>
                      <input
                        id="date"
                        type="date"
                        className="form-control border-primary"
                        style={{ backgroundColor: '#e7f1ff' }}
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="fw-bold" htmlFor="amount">
                        <i className="bi bi-currency-rupee me-1"></i>Amount
                      </label>
                      <input
                        id="amount"
                        type="number"
                        className="form-control border-primary"
                        style={{ backgroundColor: '#e7f1ff' }}
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="fw-bold" htmlFor="description">
                        <i className="bi bi-card-text me-1"></i>Description
                      </label>
                      <textarea
                        id="description"
                        className="form-control border-primary"
                        style={{ backgroundColor: '#e7f1ff', minHeight: 70 }}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <button className="btn btn-success w-100 fw-bold" type="submit" disabled={loading} style={{ fontSize: 18, borderRadius: 8 }}>
                      {loading ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Submitting...
                        </span>
                      ) : (
                        <span>
                          <i className="bi bi-send me-2"></i>Submit
                        </span>
                      )}
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
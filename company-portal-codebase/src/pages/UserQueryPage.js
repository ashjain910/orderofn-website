import React, { useState, useEffect } from 'react';
import { sendUserQuery, fetchAllQueries } from '../api/googleScriptApi';
import { useLoader } from '../context/LoaderProvider';
import PageLoader from './PageLoader';
import { formatDate } from '../pipes/formatDatePipe'; // Import the pipe

const UserQueryPage = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [queries, setQueries] = useState([]);
  const [activeTab, setActiveTab] = useState('notReplied'); // 'notReplied' or 'replied'
  const [selectedQuery, setSelectedQuery] = useState(null); // State for viewing full query
  const [showForm, setShowForm] = useState(false); // State for showing the form popup
  const auth = JSON.parse(localStorage.getItem('auth'));
  const { loading, setLoading } = useLoader();

  useEffect(() => {
    if (auth?.username) {
      setLoading(true);
      fetchAllQueries()
        .then(res => {
          // console.log('Fetched queries:', res); // Debugging
          if (res.success) {
          let allQueries = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : [];
          const userQueries = allQueries
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
          setQueries(userQueries);
          setLoading(false);
          } else {
            setQueries([]);
            alert(res?.message || 'No queries found or server error.');
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          alert(error?.message || 'Failed to fetch queries or server error.'); // Show error in alert
          setError(error?.message || 'Failed to fetch queries or server error.');
        });
    }
  }, [auth?.username, success, setLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!message.trim()) {
      setError('Please enter your query or feedback.');
      return;
    }
    setLoading(true);
    try {
      const res = await sendUserQuery(auth.username, message);
      if (res.success) {
        setSuccess('Your query/feedback has been sent to the admin.');
        setMessage('');
        setShowForm(false); // Close the form popup after submission
      } else {
        alert(res?.message || 'Failed to send. Please try again.'); // Show error in alert
        setError(res?.message || 'Failed to send. Please try again.');
      }
    } catch (error) {
      alert(error?.message || 'Failed to send. Please try again.'); // Show error in alert
      setError(error?.message || 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container">
      {loading && <PageLoader />}
      <div className="row justify-content-center">
        {/* Add New Query Button */}
        <div className="col-12 text-end mb-1">
          <button
            className="btn btn-primary"
            style={{fontSize: '13px'}}
            onClick={() => setShowForm(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>Add New Query
          </button>
        </div>

        {/* Tabs for Replied/Not Replied */}
        <div className="col-12 mb-2">
          <div style={{ display: 'flex', gap: 0 }}>
            <button
              className={`fw-bold px-4 py-2 border-0 ${activeTab === 'notReplied' ? 'tab-active' : 'tab-inactive'}`}
              style={{
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
                background: activeTab === 'notReplied' ? '#0dcaf0' : '#e7f1ff',
                color: activeTab === 'notReplied' ? '#fff' : '#003366',
                boxShadow: activeTab === 'notReplied' ? '0 2px 8px rgba(13,202,240,0.15)' : 'none',
                borderRight: '1px solid #b6eaff',
                transition: 'all 0.2s',
                fontSize: 16
              }}
              onClick={() => setActiveTab('notReplied')}
            >
              <i className="bi bi-hourglass-split me-2"></i>Not Replied
            </button>
            <button
              className={`fw-bold px-4 py-2 border-0 ${activeTab === 'replied' ? 'tab-active' : 'tab-inactive'}`}
              style={{
                borderTopRightRadius: 12,
                borderBottomRightRadius: 12,
                background: activeTab === 'replied' ? '#0dcaf0' : '#e7f1ff',
                color: activeTab === 'replied' ? '#fff' : '#003366',
                boxShadow: activeTab === 'replied' ? '0 2px 8px rgba(13,202,240,0.15)' : 'none',
                borderLeft: '1px solid #b6eaff',
                transition: 'all 0.2s',
                fontSize: 16
              }}
              onClick={() => setActiveTab('replied')}
            >
              <i className="bi bi-check2-circle me-2"></i>Replied
            </button>
          </div>
        </div>

        {/* Your Queries - Tabbed Content */}
        <div className="col-12">
          <div className="card shadow-lg border-0" style={{ borderRadius: 18 }}>
            <div className="card-header" style={{
              background: '#0dcaf0',
              color: '#fff',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18
            }}>
              <div className="d-flex align-items-center">
                <i className="bi bi-inbox me-2" style={{ fontSize: 22 }}></i>
                <h5 className="mb-0 flex-grow-1">Your Queries & Replies</h5>
              </div>
            </div>
            <div className="card-body p-0" style={{
              background: '#f8fafc',
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18
            }}>
              <div className="table-responsive">
                <table className="table table-bordered mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '60%' }}>Your Query</th>
                      <th style={{ width: '40%' }}>Admin Reply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const filtered = activeTab === 'notReplied'
                        ? queries.filter(q => !q.adminReply)
                        : queries.filter(q => q.adminReply);
                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={2} className="text-center text-muted py-4">No queries found.</td>
                          </tr>
                        );
                      }
                      return filtered.map((q, i) => (
                        <tr key={i}>
                          <td>
                            <span className="d-block">
                              {q.message.length > 200
                                ? (
                                  <>
                                    {q.message.slice(0, 200)}...
                                    <i
                                      className="bi bi-eye-fill text-primary ms-2"
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => setSelectedQuery(q.message)}
                                      title="View Full Query"
                                    ></i>
                                  </>
                                )
                                : q.message}
                            </span>
                            <span className="text-muted small">{q.date ? formatDate(q.date) : ''}</span>
                          </td>
                          <td>
                            {q.adminReply
                              ? <span className="text-success">{q.adminReply}</span>
                              : <span className="text-muted">No reply yet</span>
                            }
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Query Form */}
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

          <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header" style={{
                  background: '#003366',
                  color: '#fff',
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18
                }}>
                  <h5 className="modal-title">Send Query / Feedback</h5>
                  <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>
                <div className="modal-body" style={{
                  background: '#f8fafc',
                  borderBottomLeftRadius: 18,
                  borderBottomRightRadius: 18
                }}>
                  {success && <div className="alert alert-success">{success}</div>}
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-primary">
                        <i className="bi bi-chat-left-text me-1"></i>Your Query / Feedback
                      </label>
                      <textarea
                        className="form-control border-primary"
                        style={{ backgroundColor: '#e7f1ff', minHeight: 90 }}
                        rows={4}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        required
                        disabled={loading}
                        placeholder="Type your message here..."
                      />
                    </div>
                    <button className="btn w-100 fw-bold py-2"
                      style={{
                        background: '#003366',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 18,
                        borderRadius: 8
                      }}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending...
                        </span>
                      ) : (
                        <span>
                          <i className="bi bi-send me-2"></i>Send
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

      {/* Modal for Full Query */}
      {selectedQuery && (
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

          <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Full Query</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedQuery(null)}></button>
                </div>
                <div className="modal-body">
                  <p>{selectedQuery}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedQuery(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserQueryPage;
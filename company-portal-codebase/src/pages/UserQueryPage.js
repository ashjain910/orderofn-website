import React, { useState, useEffect } from 'react';
import { sendUserQuery, fetchAllQueries } from '../api/googleScriptApi';
import { useLoader } from '../context/LoaderProvider';
import PageLoader from './PageLoader';
import { formatDate } from '../pipes/formatDatePipe';

const UserQueryPage = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [queries, setQueries] = useState([]);
  const [activeTab, setActiveTab] = useState('notReplied');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const auth = JSON.parse(localStorage.getItem('auth'));
  const { loading, setLoading } = useLoader();

  useEffect(() => {
    if (!auth?.username) return;
    setLoading(true);
    fetchAllQueries()
      .then(res => {
        if (res.success) {
          const all = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : [];
          setQueries(all.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } else { setQueries([]); alert(res?.message || 'No queries found.'); }
        setLoading(false);
      })
      .catch(err => { setLoading(false); setError(err?.message || 'Failed to fetch queries.'); });
  }, [auth?.username, success, setLoading]); // eslint-disable-line

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(''); setError('');
    if (!message.trim()) { setError('Please enter your query or feedback.'); return; }
    setLoading(true);
    try {
      const res = await sendUserQuery(auth.username, message);
      if (res.success) { setSuccess('Your query has been sent.'); setMessage(''); setShowForm(false); }
      else { setError(res?.message || 'Failed to send.'); alert(res?.message || 'Failed to send.'); }
    } catch (err) { setError(err?.message || 'Failed to send.'); }
    finally { setLoading(false); }
  };

  const filtered = activeTab === 'notReplied' ? queries.filter(q => !q.adminReply) : queries.filter(q => q.adminReply);

  return (
    <div className="portal-page">
      {loading && <PageLoader />}
      <div className="row justify-content-center g-0">
        <div className="col-12 col-lg-10">

          <div className="d-flex justify-content-between align-items-center mb-3" style={{ flexWrap: 'wrap', gap: 10 }}>
            {/* Tabs */}
            <div style={{ display: 'flex' }}>
              <button className={`portal-tab ${activeTab === 'notReplied' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('notReplied')}>
                <i className="bi bi-hourglass-split me-1"></i>Pending
                <span className="ms-2 badge" style={{ background: activeTab === 'notReplied' ? 'rgba(255,255,255,0.2)' : '#c7d9f8', color: activeTab === 'notReplied' ? '#fff' : '#000033', borderRadius: 20, padding: '2px 8px', fontSize: '0.75rem' }}>
                  {queries.filter(q => !q.adminReply).length}
                </span>
              </button>
              <button className={`portal-tab ${activeTab === 'replied' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('replied')}>
                <i className="bi bi-check2-circle me-1"></i>Replied
                <span className="ms-2 badge" style={{ background: activeTab === 'replied' ? 'rgba(255,255,255,0.2)' : '#c7d9f8', color: activeTab === 'replied' ? '#fff' : '#000033', borderRadius: 20, padding: '2px 8px', fontSize: '0.75rem' }}>
                  {queries.filter(q => q.adminReply).length}
                </span>
              </button>
            </div>
            <button className="portal-btn" onClick={() => setShowForm(true)}>
              <i className="bi bi-plus-circle"></i> New Query
            </button>
          </div>

          <div className="portal-card">
            <div className="portal-card-header">
              <i className="bi bi-inbox" style={{ fontSize: '1.1rem' }}></i>
              <h5>Your Queries &amp; Replies</h5>
            </div>
            <div className="portal-card-body" style={{ padding: 0 }}>
              <div className="table-responsive">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th style={{ width: '58%' }}>Your Query</th>
                      <th>Admin Reply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={2} className="portal-empty">No queries found.</td></tr>
                    ) : filtered.map((q, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ marginBottom: 4 }}>
                            {q.message.length > 200 ? (
                              <>{q.message.slice(0, 200)}…
                                <i className="bi bi-eye-fill ms-2" style={{ color: '#000033', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => setSelectedQuery(q.message)} title="View full query"></i>
                              </>
                            ) : q.message}
                          </div>
                          <span style={{ fontSize: '0.78rem', color: '#8a9ab5' }}>{q.date ? formatDate(q.date) : ''}</span>
                        </td>
                        <td>
                          {q.adminReply
                            ? <span style={{ color: '#16a34a', fontSize: '0.88rem' }}>{q.adminReply}</span>
                            : <span style={{ color: '#8a9ab5', fontSize: '0.85rem' }}>No reply yet</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Query Modal */}
      {showForm && (
        <>
          <div className="modal-backdrop fade show" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}></div>
          <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content" style={{ borderRadius: 14, overflow: 'hidden', border: 'none' }}>
                <div className="portal-modal-header">
                  <h5><i className="bi bi-chat-left-text me-2"></i>Send Query / Feedback</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowForm(false)}></button>
                </div>
                <div className="modal-body" style={{ padding: 24 }}>
                  {success && <div className="portal-alert-success">{success}</div>}
                  {error && <div className="portal-alert-error">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="portal-label">Your Query / Feedback</label>
                      <textarea className="portal-textarea" rows={4} value={message} onChange={e => setMessage(e.target.value)} required disabled={loading} placeholder="Type your message here…" style={{ minHeight: 100 }} />
                    </div>
                    <button className="portal-btn w-100" type="submit" disabled={loading} style={{ justifyContent: 'center', height: 46 }}>
                      {loading ? <><span className="spinner-border spinner-border-sm"></span> Sending…</> : <><i className="bi bi-send"></i> Send</>}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Full Query Modal */}
      {selectedQuery && (
        <>
          <div className="modal-backdrop fade show" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}></div>
          <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content" style={{ borderRadius: 14, overflow: 'hidden', border: 'none' }}>
                <div className="portal-modal-header">
                  <h5>Full Query</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedQuery(null)}></button>
                </div>
                <div className="modal-body" style={{ padding: 24 }}>
                  <p style={{ lineHeight: 1.7, color: '#374151' }}>{selectedQuery}</p>
                </div>
                <div className="modal-footer" style={{ borderTop: '1px solid #e5e9f0' }}>
                  <button className="portal-btn-outline" onClick={() => setSelectedQuery(null)}>Close</button>
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

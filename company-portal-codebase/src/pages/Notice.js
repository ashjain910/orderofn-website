import React, { useEffect, useState } from 'react';
import { fetchNotices, addNotice, deleteNotice } from '../api/googleScriptApi';
import { formatDate } from '../pipes/formatDatePipe';

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNotice, setNewNotice] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const loadNotices = async () => {
    setLoading(true);
    try {
      const res = await fetchNotices();
      setNotices(Array.isArray(res) ? res : res.data || []);
    } catch { setError('Failed to load notices.'); }
    setLoading(false);
  };

  useEffect(() => { loadNotices(); }, []); // eslint-disable-line

  const handleAdd = async (e) => {
    e.preventDefault();
    setSuccess(''); setError('');
    if (!newTitle.trim() || !newNotice.trim()) { setError('Title and description are required.'); return; }
    setLoading(true);
    try {
      const res = await addNotice(newTitle.trim(), newNotice.trim());
      if (res.success) {
        setSuccess('Notice added!');
        setShowModal(false);
        setNewTitle(''); setNewNotice('');
        loadNotices();
        setTimeout(() => setSuccess(''), 2500);
      } else { setError('Failed to add notice.'); }
    } catch { setError('Failed to add notice.'); }
    setLoading(false);
  };

  const handleDelete = async (notice) => {
    setLoading(true); setError('');
    try {
      const res = await deleteNotice(notice.id);
      if (res.success) { setSuccess('Notice deleted!'); loadNotices(); setTimeout(() => setSuccess(''), 2500); }
      else setError('Failed to delete notice.');
    } catch { setError('Failed to delete notice.'); }
    setLoading(false);
  };

  return (
    <div className="portal-page">
      <div className="row justify-content-center g-0">
        <div className="col-12 col-lg-9">

          <div className="d-flex justify-content-between align-items-center mb-3" style={{ flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h4 style={{ fontWeight: 700, color: '#0d1b3e', margin: 0 }}>Admin Notice Board</h4>
              <p style={{ color: '#8a9ab5', fontSize: '0.88rem', margin: '2px 0 0' }}>{notices.length} active notice{notices.length !== 1 ? 's' : ''}</p>
            </div>
            <button className="portal-btn" onClick={() => { setShowModal(true); setError(''); }}>
              <i className="bi bi-plus-circle"></i> Add Notice
            </button>
          </div>

          {success && <div className="portal-alert-success">{success}</div>}
          {error && !showModal && <div className="portal-alert-error">{error}</div>}

          <div className="portal-card">
            <div className="portal-card-header">
              <i className="bi bi-megaphone-fill" style={{ fontSize: '1.1rem' }}></i>
              <h5>All Notices</h5>
            </div>
            <div className="portal-card-body" style={{ padding: 0 }}>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#000033' }}></div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th style={{ width: 48 }}>#</th>
                        <th style={{ width: '25%' }}>Title</th>
                        <th>Description</th>
                        <th style={{ width: 110 }}>Date</th>
                        <th style={{ width: 80 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notices.length === 0 ? (
                        <tr><td colSpan={5} className="portal-empty">No notices yet.</td></tr>
                      ) : notices.map((n, idx) => (
                        <tr key={idx}>
                          <td style={{ color: '#8a9ab5', fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 600, color: '#0d1b3e' }}>{n.title || ''}</td>
                          <td style={{ fontSize: '0.88rem', color: '#374151' }}>{n.description || n.notice || n.message}</td>
                          <td style={{ fontSize: '0.82rem', color: '#8a9ab5', whiteSpace: 'nowrap' }}>{n.date ? formatDate(n.date) : ''}</td>
                          <td>
                            <button className="portal-btn portal-btn-sm portal-btn-danger" onClick={() => handleDelete(n)} title="Delete">
                              <i className="bi bi-trash"></i>
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

      {/* Add Notice Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
            onClick={() => { setShowModal(false); setError(''); }}></div>
          <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1" role="dialog" aria-modal="true"
            onKeyDown={e => e.key === 'Escape' && setShowModal(false)}>
            <div className="modal-dialog modal-dialog-centered" role="document" onClick={e => e.stopPropagation()}>
              <div className="modal-content" style={{ borderRadius: 14, overflow: 'hidden', border: 'none' }}>
                <div className="portal-modal-header">
                  <h5><i className="bi bi-plus-circle me-2"></i>Add New Notice</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => { setShowModal(false); setError(''); }}></button>
                </div>
                <form onSubmit={handleAdd}>
                  <div className="modal-body" style={{ padding: 24 }}>
                    {error && <div className="portal-alert-error">{error}</div>}
                    <div className="mb-3">
                      <label className="portal-label">Title</label>
                      <input className="portal-input" type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Notice title" required autoFocus />
                    </div>
                    <div>
                      <label className="portal-label">Description</label>
                      <textarea className="portal-textarea" rows={4} value={newNotice} onChange={e => setNewNotice(e.target.value)} placeholder="Notice description…" required style={{ minHeight: 100 }} />
                    </div>
                  </div>
                  <div className="modal-footer" style={{ borderTop: '1px solid #e5e9f0', padding: '14px 20px', gap: 10 }}>
                    <button type="button" className="portal-btn-outline" onClick={() => { setShowModal(false); setError(''); }}>Cancel</button>
                    <button type="submit" className="portal-btn portal-btn-success" disabled={loading}>
                      {loading ? <><span className="spinner-border spinner-border-sm me-1"></span> Saving…</> : <><i className="bi bi-check-lg"></i> Add Notice</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notice;

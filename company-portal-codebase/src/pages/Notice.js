import React, { useEffect, useState } from 'react';
import { fetchNotices, addNotice, deleteNotice } from '../api/googleScriptApi';
import { formatDate } from '../pipes/formatDatePipe'; // Import the pipe

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
    } catch {
      setError('Failed to load notices.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotices();
    // eslint-disable-next-line
  }, []);

  // Add Notice
  const handleAddNotice = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!newTitle.trim() || !newNotice.trim()) {
      setError('Title and Description cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      const res = await addNotice(newTitle.trim(), newNotice.trim());
      if (res.success) {
        setSuccess('Notice added successfully!');
        setShowModal(false);
        setNewTitle('');
        setNewNotice('');
        loadNotices();
      } else {
        setError('Failed to add notice.');
      }
    } catch {
      setError('Failed to add notice.');
    }
    setLoading(false);
  };

  // Delete Notice
  const handleDelete = async (notice) => {
    setLoading(true);
    setError('');
    try {
      const res = await deleteNotice(notice.id);
      if (res.success) {
        setSuccess('Notice deleted successfully!');
        loadNotices();
      } else {
        setError('Failed to delete notice.');
      }
    } catch {
      setError('Failed to delete notice.');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0" style={{ borderRadius: 18 }}>
            <div className="card-header bg-warning text-dark d-flex align-items-center justify-content-between" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
              <h4 className="mb-0" style={{fontSize: '24px'}}>
                <i className="bi bi-megaphone me-2"></i>
                Admin Notice Board
              </h4>
              <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                <i className="bi bi-plus-circle me-1"></i> Add Notice
              </button>
            </div>
            <div className="card-body" style={{ background: '#fffbe7', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
              {success && <div className="alert alert-success py-2">{success}</div>}
              {error && <div className="alert alert-danger py-2">{error}</div>}
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-warning"></div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered align-middle mb-0 mt-0" style={{fontSize: '13px'}}>
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: 60 }}>#</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th style={{ width: 100 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notices.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center text-muted">No notices found.</td>
                        </tr>
                      ) : (
                        notices.map((n, idx) => (
                          <tr key={idx}>
                            <td className="fw-bold text-center">{idx + 1}</td>
                            <td className="text-start">{n.title || ''}</td>
                            <td className="text-start">{n.description || n.notice || n.message}</td>
                            <td>{n.date ? formatDate(n.date) : ''}</td> {/* Updated to use formatDate */}
                            <td className="text-center">
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(n)}
                                title="Delete"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
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
          {/* Backdrop click closes modal */}
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={() => { setShowModal(false); setError(''); }}
            tabIndex="-1"
            aria-hidden="true"
          ></div>
          <div
            className="modal fade show"
            style={{ display: 'block', zIndex: 1050 }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setShowModal(false);
                setError('');
              }
            }}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-content" style={{ borderRadius: 12 }}>
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title"><i className="bi bi-plus-circle me-2"></i>Add New Notice</h5>
                  <button type="button" className="btn-close" onClick={() => { setShowModal(false); setError(''); }}></button>
                </div>
                <form onSubmit={handleAddNotice}>
                  <div className="modal-body">
                    <input
                      className="form-control mb-2"
                      type="text"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="Title"
                      required
                      autoFocus
                    />
                    <textarea
                      className="form-control"
                      rows={4}
                      value={newNotice}
                      onChange={e => setNewNotice(e.target.value)}
                      placeholder="Description"
                      required
                    />
                    {error && <div className="alert alert-danger py-2 mt-2">{error}</div>}
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setError(''); }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Saving...
                        </span>
                      ) : (
                        'Add Notice'
                      )}
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
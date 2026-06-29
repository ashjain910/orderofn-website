import React, { useEffect, useState } from 'react';
import { fetchUserLeaveRequests, deleteLeaveRequest, ReapproveStatus } from '../api/googleScriptApi';
import PageLoader from '../pages/PageLoader';
import { useLoader } from '../context/LoaderProvider';
import { formatDateWithDay } from '../pipes/formatDatePipe';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function toLocalDateString(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

const statusColors = {
  Approved: 'success',
  Pending: 'warning',
  Rejected: 'danger',
  Hold: 'secondary',
};

const UserStatusPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const [editLeave, setEditLeave] = useState(null);
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editReason, setEditReason] = useState('');
  const [editType, setEditType] = useState('');
  const [editRowId, setEditRowId] = useState(null);
  const auth = JSON.parse(localStorage.getItem('auth'));
  const { loading, setLoading } = useLoader();

  const loadLeaves = () => {
    setLoading(true);
    setError('');
    if (auth && auth.username) {
      fetchUserLeaveRequests(auth.username)
        .then(data => {
          if (Array.isArray(data)) {
            const currentYear = new Date().getFullYear();
            const filtered = data.filter(l => l.startDate && new Date(l.startDate).getFullYear() === currentYear);
            setLeaves(filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)));
          } else {
            setLeaves([]);
            if (data?.error || data?.success === false) alert(data?.message || 'No leave data found.');
          }
          setLoading(false);
        })
        .catch(err => { setLeaves([]); setError(err?.message || 'Failed to fetch leave data.'); setLoading(false); });
    }
  };

  useEffect(() => { loadLeaves(); }, []); // eslint-disable-line

  useEffect(() => { document.body.style.overflow = editLeave ? 'hidden' : ''; }, [editLeave]);

  useEffect(() => {
    if (editLeave) {
      setEditStartDate(editLeave.startDate);
      setEditEndDate(editLeave.endDate);
      setEditReason(editLeave.reason);
      setEditType(editLeave.type);
      setEditRowId(editLeave.rowId || editLeave.id || null);
    }
  }, [editLeave]);

  const isPastOrNoon = (leave) => {
    const now = new Date();
    const today = new Date(now.toDateString());
    const startDay = new Date(new Date(leave.startDate).toDateString());
    return startDay < today || (startDay.getTime() === today.getTime() && now.getHours() >= 12);
  };

  return (
    <div className="portal-page">
      {loading && <PageLoader />}
      <div className="row justify-content-center g-0">
        <div className="col-12 col-lg-11">
          <div className="portal-card">
            <div className="portal-card-header">
              <i className="bi bi-card-checklist" style={{ fontSize: '1.2rem' }}></i>
              <h5 style={{ flexGrow: 1 }}>My Requests Status — {new Date().getFullYear()}</h5>
              <button className="portal-btn portal-btn-sm portal-btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }} onClick={loadLeaves} disabled={loading}>
                <i className="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </div>
            <div className="portal-card-body">
              {error && <div className="portal-alert-error">{error}</div>}
              {leaves.length === 0 && !error ? (
                <div className="portal-empty"><i className="bi bi-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}></i>No leave requests found for {new Date().getFullYear()}.</div>
              ) : (
                <div className="table-responsive">
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Type</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.map((leave, idx) => (
                        <tr key={idx}>
                          <td style={{ minWidth: 130, whiteSpace: 'nowrap' }}>{formatDateWithDay(leave.startDate)}</td>
                          <td style={{ minWidth: 130, whiteSpace: 'nowrap' }}>
                            {leave.startDate === leave.endDate || !leave.endDate ? '—' : formatDateWithDay(leave.endDate)}
                          </td>
                          <td
                            style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: leave.reason.length > 100 ? 'pointer' : 'default' }}
                            onMouseEnter={e => {
                              document.querySelectorAll('.custom-leave-tooltip').forEach(el => el.remove());
                              if (leave.reason.length > 100) {
                                const tooltip = document.createElement('div');
                                tooltip.innerText = leave.reason;
                                Object.assign(tooltip.style, { position: 'fixed', background: '#1e293b', color: '#fff', padding: '8px 12px', borderRadius: '8px', zIndex: 9999, maxWidth: '360px', fontSize: '0.88rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', lineHeight: '1.5' });
                                tooltip.className = 'custom-leave-tooltip';
                                document.body.appendChild(tooltip);
                                tooltip.style.left = (e.clientX + 10) + 'px';
                                tooltip.style.top = (e.clientY - tooltip.offsetHeight - 10) + 'px';
                                e.target._tooltip = tooltip;
                              }
                            }}
                            onMouseLeave={e => { if (e.target._tooltip) { document.body.removeChild(e.target._tooltip); e.target._tooltip = null; } }}
                          >
                            {leave.reason.length > 100 ? leave.reason.slice(0, 100) + '…' : leave.reason}
                          </td>
                          <td>
                            <span className={`badge bg-${statusColors[leave.status] || 'secondary'}`}>{leave.status}</span>
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>{leave.type || 'N/A'}</td>
                          <td>
                            {isPastOrNoon(leave) ? (
                              <span style={{ color: '#8a9ab5', fontSize: '0.82rem' }}>No action</span>
                            ) : leave.status === 'Pending' ? (
                              <button
                                className="portal-btn portal-btn-sm portal-btn-danger"
                                onClick={async () => {
                                  if (window.confirm('Are you sure you want to withdraw this leave request?')) {
                                    setLoading(true);
                                    const res = await deleteLeaveRequest(auth.username, leave.startDate, leave.endDate);
                                    if (res.success) loadLeaves();
                                    else alert('Failed to withdraw leave.');
                                  }
                                }}
                              >
                                Withdraw
                              </button>
                            ) : (
                              <span style={{ color: '#8a9ab5', fontSize: '0.82rem' }}>No action</span>
                            )}
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

      {/* Edit Modal */}
      {editLeave && (
        <>
          <div className="modal fade show" style={{ display: 'block', position: 'fixed', zIndex: 1050, inset: 0, overflowY: 'auto' }} tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content" style={{ borderRadius: 14, overflow: 'hidden', border: 'none' }}>
                <div className="portal-modal-header">
                  <h5><i className="bi bi-pencil-square me-2"></i>Edit Leave Request</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setEditLeave(null)}></button>
                </div>
                <div className="modal-body" style={{ padding: 24 }}>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    const res = await ReapproveStatus({ name: auth.username, type: editType, startDate: editStartDate, endDate: editEndDate, reason: editReason, rowId: editRowId || undefined, id: editRowId || undefined, status: 'Reapprove' });
                    setLoading(false);
                    if (res.success) { setEditLeave(null); loadLeaves(); }
                    else alert('Failed to update leave.');
                  }}>
                    <div className="mb-3">
                      <label className="portal-label">Start Date</label>
                      <input type="date" className="portal-input" value={toLocalDateString(editStartDate)} onChange={e => setEditStartDate(e.target.value)} required />
                      <div className="form-text text-muted" style={{ fontSize: '0.8rem', marginTop: 4 }}>Previous: {formatDate(editLeave.startDate)}</div>
                    </div>
                    <div className="mb-3">
                      <label className="portal-label">End Date</label>
                      <input type="date" className="portal-input" value={toLocalDateString(editEndDate)} onChange={e => setEditEndDate(e.target.value)} />
                      <div className="form-text text-muted" style={{ fontSize: '0.8rem', marginTop: 4 }}>Previous: {formatDate(editLeave.endDate)}</div>
                    </div>
                    <div className="mb-3">
                      <label className="portal-label">Type of Leave</label>
                      <select className="portal-select" value={editType} onChange={e => setEditType(e.target.value)} required>
                        <option value="">Select Type</option>
                        <option value="Leave">Leave</option>
                        <option value="Work From Home">Work From Home</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="portal-label">Reason</label>
                      <textarea className="portal-textarea" value={editReason} onChange={e => setEditReason(e.target.value)} required />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="portal-btn portal-btn-success" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
                        {loading ? 'Saving…' : 'Save Changes'}
                      </button>
                      <button type="button" className="portal-btn-outline" onClick={() => setEditLeave(null)} disabled={loading} style={{ flex: 1 }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ position: 'fixed', zIndex: 1040, inset: 0, background: '#000', opacity: 0.5 }}></div>
        </>
      )}
    </div>
  );
};

export default UserStatusPage;
